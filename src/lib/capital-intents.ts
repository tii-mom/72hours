import { useEffect, useState } from "react";
import { useTonAddress, useTonConnectUI, useTonWallet } from "@tonconnect/ui-react";
import type {
  CapitalAppSlug,
  CapitalIntentKind,
  CapitalIntentLookupResponse,
  CapitalIntentResponse,
  CapitalIntentTrackingPayload,
  CapitalSeatType,
} from "72h-capital-shared";
import {
  getCapitalAlphaAllocateIntentApiPath,
  getCapitalIntentApiPath,
  getCapitalIntentSubmissionApiPath,
  getCapitalReserveAllocateIntentApiPath,
  getCapitalReserveRedeemIntentApiPath,
  getCapitalRuntimeConfig,
  getCapitalRewardClaimIntentApiPath,
} from "./capital-client";
import type { Locale } from "./locale";

export interface CapitalIntentPayload {
  locale: Locale;
  appSlug: CapitalAppSlug;
  seatType: CapitalSeatType;
  seatNumber?: number;
  amount?: string | number;
  walletAddress?: string;
  memo?: string;
}

export type CapitalIntentState =
  | { status: "idle" }
  | { status: "blocked"; message: string }
  | { status: "loading"; kind: CapitalIntentKind }
  | { status: "ready"; response: CapitalIntentResponse }
  | { status: "error"; message: string };

export type CapitalIntentExecutionState =
  | { status: "idle" }
  | { status: "sending" }
  | { status: "success"; boc: string }
  | { status: "error"; message: string };

export interface CapitalIntentTrackingState {
  status: "idle" | "syncing" | "ready" | "error";
  response?: CapitalIntentTrackingPayload;
  message?: string;
}

function resolveIntentPath(kind: CapitalIntentKind) {
  switch (kind) {
    case "reserve.allocate":
      return getCapitalReserveAllocateIntentApiPath();
    case "reserve.redeem":
      return getCapitalReserveRedeemIntentApiPath();
    case "alpha.allocate":
      return getCapitalAlphaAllocateIntentApiPath();
    case "reward.claim":
      return getCapitalRewardClaimIntentApiPath();
  }
}

function buildUrl(pathname: string, locale: Locale) {
  const { apiBaseUrl } = getCapitalRuntimeConfig();
  const normalizedBase =
    apiBaseUrl === "/" ? "" : apiBaseUrl.endsWith("/") ? apiBaseUrl.slice(0, -1) : apiBaseUrl;
  const search = new URLSearchParams({ locale });
  return `${normalizedBase}${pathname}?${search.toString()}`;
}

function createTrackingError(locale: Locale, fallbackEnglish: string, fallbackChinese: string, error: unknown) {
  return error instanceof Error ? error.message : locale === "en-US" ? fallbackEnglish : fallbackChinese;
}

function createOptimisticSubmission(
  locale: Locale,
  response: CapitalIntentResponse,
  boc: string,
): CapitalIntentResponse["submission"] {
  const submittedAt = new Date().toISOString();

  return {
    submitted: true,
    status: "submitted",
    statusLabel: locale === "en-US" ? "Wallet submission received" : "已收到钱包提交",
    submittedAt,
    boc,
  };
}

function normalizeLookupResponse(
  response: CapitalIntentLookupResponse,
): CapitalIntentTrackingPayload {
  return {
    intentId: response.intentId,
    kind: response.kind,
    status: response.status,
    statusLabel: response.statusLabel,
    createdAt: response.createdAt,
    updatedAt: response.updatedAt,
    terminal: response.terminal,
    lastCheckedAt: response.lastCheckedAt,
    uiState: response.uiState,
    references: response.references,
    networkMeta: response.networkMeta,
    submission: {
      submitted: response.walletSubmission.exists,
      status: response.status,
      statusLabel: response.statusLabel,
      submittedAt: response.walletSubmission.submittedAt,
      boc: response.walletSubmission.boc,
      explorerUrl: response.walletSubmission.explorerUrl,
    },
  };
}

function shouldPollTracking(response: CapitalIntentTrackingPayload | undefined) {
  if (response?.terminal) {
    return false;
  }

  const status = response?.submission?.status;
  if (!response?.submission?.submitted || !status) {
    return false;
  }

  return status === "submitted" || status === "pending" || status === "broadcast";
}

export function getDefaultSeatAmount72H(slug: CapitalAppSlug, type: CapitalSeatType) {
  if (type === "reserve") return 720;
  if (slug === "multi-millionaire") return 720_000;
  return 72_000;
}

export function parseCapitalSeatKey(value: string) {
  const [appSlug, seatType, seatNumber] = value.split(":");

  if (
    (appSlug !== "multi-millionaire" && appSlug !== "72hours" && appSlug !== "wan") ||
    (seatType !== "reserve" && seatType !== "alpha")
  ) {
    return undefined;
  }

  const parsedSeatNumber = Number(seatNumber);

  if (!Number.isInteger(parsedSeatNumber) || parsedSeatNumber <= 0) {
    return undefined;
  }

  return {
    appSlug,
    seatType,
    seatNumber: parsedSeatNumber,
  } as const;
}

export function getCapitalIntentWalletSendBlockReason(
  locale: Locale,
  response: CapitalIntentResponse,
) {
  const isEnglish = locale === "en-US";

  if (response.uiState.disabled) {
    return response.uiState.reason || (isEnglish ? "Wallet sending is not available for this request." : "当前请求暂不可通过钱包发送。");
  }

  if (response.networkMeta?.mode === "mock") {
    return isEnglish
      ? "Wallet sending is unavailable until this request is confirmed on the live network."
      : "该请求完成正式网络确认前，暂不可通过钱包发送。";
  }

  if (response.transactionRequest?.scaffold?.productionReady === false) {
    return isEnglish
      ? "Wallet sending is unavailable until the transaction details are finalized for signing."
      : "交易信息完成正式签名确认前，暂不可通过钱包发送。";
  }

  if (!response.transactionRequest?.messages?.length) {
    return isEnglish ? "No prepared wallet messages are available." : "当前没有可发送的钱包消息。";
  }

  return undefined;
}

export function useCapitalIntentController(locale: Locale) {
  const [intentState, setIntentState] = useState<CapitalIntentState>({ status: "idle" });
  const [executionState, setExecutionState] = useState<CapitalIntentExecutionState>({ status: "idle" });
  const [trackingState, setTrackingState] = useState<CapitalIntentTrackingState>({ status: "idle" });
  const [tonConnectUI] = useTonConnectUI();
  const wallet = useTonWallet();
  const walletAddress = useTonAddress(true);

  const refreshIntentTracking = async (intentId: string, options?: { silent?: boolean }) => {
    if (!options?.silent) {
      setTrackingState((current) => ({
        status: "syncing",
        response: current.response,
      }));
    }

    try {
      const response = await fetch(buildUrl(getCapitalIntentApiPath(intentId), locale), {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Request status refresh failed (${response.status}).`);
      }

      const data = (await response.json()) as CapitalIntentLookupResponse;
      const trackedIntent = normalizeLookupResponse(data);
      setTrackingState({
        status: "ready",
        response: trackedIntent,
      });
      return trackedIntent;
    } catch (error) {
      setTrackingState((current) => ({
        status: "error",
        response: current.response,
        message: createTrackingError(
          locale,
          "Request status refresh failed.",
          "请求状态刷新失败。",
          error,
        ),
      }));
      return undefined;
    }
  };

  const requestIntent = async (
    kind: CapitalIntentKind,
    payload: Omit<CapitalIntentPayload, "locale" | "walletAddress">,
  ) => {
    const needsWallet = true;

    if (needsWallet && !walletAddress) {
      setIntentState({
        status: "blocked",
        message:
          locale === "en-US"
            ? "Connect a TON wallet first. A wallet identity is required before this action can be prepared for review."
            : "请先连接 TON 钱包。动作进入核对前需要先确认钱包身份。",
      });

      await tonConnectUI.openModal();
      return;
    }

    setIntentState({ status: "loading", kind });
    setTrackingState({ status: "idle" });

    try {
      const response = await fetch(buildUrl(resolveIntentPath(kind), locale), {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          locale,
          ...payload,
          walletAddress,
        } satisfies CapitalIntentPayload),
      });

      if (!response.ok) {
        throw new Error(`Request preparation failed (${response.status}).`);
      }

      const data = (await response.json()) as CapitalIntentResponse;
      setIntentState({ status: "ready", response: data });
      setExecutionState({ status: "idle" });
      setTrackingState({ status: "idle" });
    } catch (error) {
      setIntentState({
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : locale === "en-US"
              ? "Request preparation failed."
              : "请求生成失败。",
      });
    }
  };

  const sendPreparedIntent = async () => {
    if (intentState.status !== "ready" || !intentState.response.transactionRequest) {
      setExecutionState({
        status: "error",
        message:
          locale === "en-US"
            ? "No prepared transaction request is available."
            : "当前没有可发送的交易请求。",
      });
      return;
    }

    const sendBlockReason = getCapitalIntentWalletSendBlockReason(locale, intentState.response);
    if (sendBlockReason) {
      setExecutionState({
        status: "error",
        message: sendBlockReason,
      });
      return;
    }

    if (!wallet) {
      setExecutionState({
        status: "error",
        message:
          locale === "en-US"
            ? "Connect a TON wallet before sending the prepared request."
            : "发送前请先连接 TON 钱包。",
      });
      return;
    }

    const validUntilUnix = intentState.response.transactionRequest.validUntil
      ? Math.floor(new Date(intentState.response.transactionRequest.validUntil).getTime() / 1000)
      : Math.floor(Date.now() / 1000) + 300;

    try {
      setExecutionState({ status: "sending" });

      const result = await tonConnectUI.sendTransaction({
        validUntil: validUntilUnix,
        messages: intentState.response.transactionRequest.messages?.map((message) => ({
          address: message.address,
          amount: message.amount,
          payload: message.payload,
        })) ?? [],
      });

      setExecutionState({
        status: "success",
        boc: result.boc,
      });

      const optimisticResponse: CapitalIntentTrackingPayload = {
        intentId: intentState.response.intentId,
        kind: intentState.response.kind,
        status: "submitted",
        statusLabel: locale === "en-US" ? "Wallet submission received" : "已收到钱包提交",
        createdAt: intentState.response.createdAt,
        updatedAt: new Date().toISOString(),
        uiState: intentState.response.uiState,
        references: intentState.response.references,
        networkMeta: intentState.response.networkMeta,
        submission: createOptimisticSubmission(locale, intentState.response, result.boc),
      };

      setTrackingState({
        status: "ready",
        response: optimisticResponse,
      });

      try {
        const submissionResponse = await fetch(
          buildUrl(getCapitalIntentSubmissionApiPath(intentState.response.intentId), locale),
          {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              boc: result.boc,
              walletAddress,
            }),
          },
        );

        if (!submissionResponse.ok) {
          throw new Error(`Request submission sync failed (${submissionResponse.status}).`);
        }

        const trackedIntent = normalizeLookupResponse(
          (await submissionResponse.json()) as CapitalIntentLookupResponse,
        );
        setTrackingState({
          status: "ready",
          response: trackedIntent,
        });
      } catch (error) {
        setTrackingState({
          status: "error",
          response: optimisticResponse,
          message: createTrackingError(
            locale,
            "Wallet submission succeeded, but the website could not sync the request status.",
            "钱包发送已成功，但官网暂时无法同步请求状态。",
            error,
          ),
        });
      }
    } catch (error) {
      setExecutionState({
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : locale === "en-US"
              ? "Wallet submission failed."
              : "钱包提交失败。",
      });
    }
  };

  useEffect(() => {
    if (trackingState.status !== "ready" || !shouldPollTracking(trackingState.response)) {
      return;
    }

    const timeout = window.setTimeout(() => {
      void refreshIntentTracking(trackingState.response!.intentId, { silent: true });
    }, 5000);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [locale, trackingState]);

  return {
    wallet,
    walletAddress,
    intentState,
    executionState,
    trackingState,
    requestIntent,
    sendPreparedIntent,
    refreshIntentTracking,
    resetIntent: () => {
      setIntentState({ status: "idle" });
      setExecutionState({ status: "idle" });
      setTrackingState({ status: "idle" });
    },
  };
}
