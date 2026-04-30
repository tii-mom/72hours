import {
  useIsConnectionRestored,
  useTonAddress,
  useTonConnectUI,
  useTonWallet,
} from "@tonconnect/ui-react";
import { useState } from "react";
import type { CapitalMetricItem } from "../content/capital";
import type { Locale } from "./locale";
import { getCapitalRuntimeConfig, isCapitalApiMode } from "./capital-runtime";

export type CapitalWalletSurfaceState = "preview" | "restoring" | "standby" | "connected";

export interface CapitalWalletAction {
  label: string;
  variant?: "primary" | "secondary";
  kind: "link" | "button";
  href?: string;
  disabled?: boolean;
  onClick?: () => void | Promise<void>;
}

export interface CapitalWalletView {
  eyebrow: string;
  title: string;
  body: string;
  stateLabel: string;
  status: CapitalWalletSurfaceState;
  metrics: CapitalMetricItem[];
  note: string;
  actions: CapitalWalletAction[];
  actionError?: string;
}

function buildMetric(label: string, value: string, hint?: string): CapitalMetricItem {
  return { label, value, hint };
}

function formatWalletAddress(address: string, locale: Locale) {
  if (!address) return locale === "en-US" ? "Not connected" : "未连接";
  if (address.length <= 18) return address;
  return `${address.slice(0, 6)}...${address.slice(-6)}`;
}

function formatChainLabel(locale: Locale, chain: string | undefined) {
  const isEnglish = locale === "en-US";

  if (chain === "-239") return isEnglish ? "Mainnet" : "主网";
  if (chain === "-3") return isEnglish ? "Testnet" : "测试网";
  return isEnglish ? "Unknown" : "未知";
}

export function useCapitalWalletView(locale: Locale): CapitalWalletView {
  const isEnglish = locale === "en-US";
  const runtime = getCapitalRuntimeConfig();
  const apiMode = isCapitalApiMode(runtime);
  const [tonConnectUI] = useTonConnectUI();
  const wallet = useTonWallet();
  const address = useTonAddress(true);
  const isConnectionRestored = useIsConnectionRestored();
  const [actionError, setActionError] = useState<string | undefined>();
  const [pendingAction, setPendingAction] = useState<"connect" | "disconnect" | null>(null);

  const connectWallet = async () => {
    try {
      setPendingAction("connect");
      setActionError(undefined);
      await tonConnectUI.openModal();
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : isEnglish
            ? "Wallet connection did not complete."
            : "钱包连接未完成。",
      );
    } finally {
      setPendingAction(null);
    }
  };

  const disconnectWallet = async () => {
    try {
      setPendingAction("disconnect");
      setActionError(undefined);
      await tonConnectUI.disconnect();
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : isEnglish
            ? "Wallet disconnect did not complete."
            : "钱包断开未完成。",
      );
    } finally {
      setPendingAction(null);
    }
  };

  if (apiMode) {
    if (!isConnectionRestored) {
      return {
        eyebrow: isEnglish ? "Wallet boundary" : "钱包边界",
        title: isEnglish ? "TonConnect is restoring the last wallet session." : "TonConnect 正在恢复上一次的钱包会话。",
        body: isEnglish
          ? "Wallet restoration must complete before any seat request or identity update can be reviewed."
          : "钱包恢复完成之前，席位请求和身份更新都不会进入可核对状态。",
        stateLabel: isEnglish ? "Restoring" : "恢复中",
        status: "restoring",
        metrics: [
          buildMetric(isEnglish ? "Service state" : "服务状态", isEnglish ? "Public service" : "公开服务"),
          buildMetric(isEnglish ? "Wallet rail" : "钱包通道", "TonConnect"),
          buildMetric(isEnglish ? "Session" : "会话状态", isEnglish ? "Restoring" : "恢复中"),
        ],
        note: isEnglish
          ? "Seat claims, vault allocation, reward claim, and redemption flows stay gated until wallet restoration completes."
          : "在钱包恢复完成之前，Claim、配置、奖励领取和赎回流程都会保持关闭。",
        actions: [
          {
            label: isEnglish ? "Restore in progress" : "恢复中",
            kind: "button",
            variant: "primary",
            disabled: true,
          },
          {
            label: isEnglish ? "Open My Capital" : "打开我的 Capital",
            kind: "link",
            href: "/capital/me",
          },
        ],
      };
    }

    if (wallet && address) {
      const walletName = "name" in wallet ? wallet.name : wallet.device.appName;

      return {
        eyebrow: isEnglish ? "Wallet boundary" : "钱包边界",
        title: isEnglish ? "TON wallet is connected to Capital." : "TON 钱包已连接到 Capital。",
        body: isEnglish
          ? "Connection is available for identity review and routing. Seat allocation, vault signing, and settlement will only open through the official flow."
          : "连接已可用于身份核对与路由联动。席位配置、资金池签名与结算只会通过官方流程开放。",
        stateLabel: isEnglish ? "Connected" : "已连接",
        status: "connected",
        metrics: [
          buildMetric(isEnglish ? "Wallet" : "钱包", walletName),
          buildMetric(isEnglish ? "Address" : "地址", formatWalletAddress(address, locale)),
          buildMetric(isEnglish ? "Network" : "网络", formatChainLabel(locale, wallet.account.chain)),
        ],
        note: isEnglish
          ? "Network fees are paid by the user wallet only when official transactions open. This page is for review only today."
          : "正式交易开放后，链上网络费用由用户钱包自行承担。本页当前仅用于核对。",
        actions: [
          {
            label:
              pendingAction === "connect"
                ? isEnglish ? "Opening wallet" : "正在打开钱包"
                : isEnglish ? "Manage wallet" : "管理钱包",
            kind: "button",
            variant: "primary",
            onClick: connectWallet,
            disabled: pendingAction !== null,
          },
          {
            label:
              pendingAction === "disconnect"
                ? isEnglish ? "Disconnecting" : "正在断开"
                : isEnglish ? "Disconnect wallet" : "断开钱包",
            kind: "button",
            onClick: disconnectWallet,
            disabled: pendingAction !== null,
          },
          {
            label: isEnglish ? "Open My Capital" : "打开我的 Capital",
            kind: "link",
            href: "/capital/me",
          },
        ],
        actionError,
      };
    }

    return {
      eyebrow: isEnglish ? "Wallet boundary" : "钱包边界",
      title: isEnglish ? "Wallet connection is available for identity review." : "钱包连接可用于身份核对。",
      body: isEnglish
        ? "TonConnect can connect a wallet on this page. Signing, vault interaction, and settlement will only open through the official TON flow."
        : "本页可通过 TonConnect 连接钱包。签名、资金池交互与结算只会通过正式 TON 流程开放。",
      stateLabel: isEnglish ? "Standby" : "待连接",
      status: "standby",
      metrics: [
        buildMetric(isEnglish ? "Service state" : "服务状态", isEnglish ? "Public service" : "公开服务"),
        buildMetric(isEnglish ? "Wallet access" : "钱包入口", "TonConnect", isEnglish ? "Connection only" : "仅开放连接"),
        buildMetric(isEnglish ? "Fee policy" : "Gas 规则", isEnglish ? "User-paid" : "用户自付"),
      ],
      note: isEnglish
        ? "Wallet connection is available for review. Signing, vault interaction, and settlement will only open after the official announcement."
        : "钱包连接已可用于核对。签名、资金池交互和结算动作只会在官方公告后开放。",
      actions: [
        {
          label:
            pendingAction === "connect"
              ? isEnglish ? "Opening wallet" : "正在打开钱包"
              : isEnglish ? "Connect wallet" : "连接钱包",
          kind: "button",
          variant: "primary",
          onClick: connectWallet,
          disabled: pendingAction !== null,
        },
        {
          label: isEnglish ? "Open My Capital" : "打开我的 Capital",
          kind: "link",
          href: "/capital/me",
        },
        {
          label: isEnglish ? "Browse capital seats" : "查看 Capital 席位",
          kind: "link",
          href: "/capital",
        },
      ],
      actionError,
    };
  }

  return {
    eyebrow: isEnglish ? "Wallet boundary" : "钱包边界",
    title: isEnglish ? "Wallet actions are unavailable on this public Capital page." : "当前公开 Capital 页面不开放钱包动作。",
    body: isEnglish
      ? "Capital currently shows seat rules, identity cards, and verification routes without live transaction prompts."
      : "当前 Capital 展示席位规则、身份卡片与验证页，不触发真实链上交易提示。",
    stateLabel: isEnglish ? "Review only" : "仅供核对",
    status: "preview",
    metrics: [
      buildMetric(isEnglish ? "Service state" : "服务状态", isEnglish ? "Verification view" : "核对视图"),
      buildMetric(isEnglish ? "Wallet rail" : "钱包通道", isEnglish ? "Not connected" : "未连接"),
      buildMetric(isEnglish ? "Fee policy" : "Gas 规则", isEnglish ? "User-paid in live mode" : "上线后由用户自付"),
    ],
    note: isEnglish
      ? "Use this page to inspect seat scarcity, identity status, and verification routes. TonConnect signing and vault actions are not open yet."
      : "当前页面用于查看席位稀缺性、身份状态与验证路径。TonConnect 签名与资金池动作尚未开放。",
    actions: [
      {
        label: isEnglish ? "Open My Capital" : "打开我的 Capital",
        kind: "link",
        href: "/capital/me",
        variant: "primary",
      },
      {
        label: isEnglish ? "Review app seats" : "查看应用席位",
        kind: "link",
        href: "/capital",
      },
    ],
  };
}
