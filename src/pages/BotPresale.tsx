import { useEffect, useMemo, useState } from "react";
import {
  useIsConnectionRestored,
  useTonAddress,
  useTonConnectUI,
  useTonWallet,
} from "@tonconnect/ui-react";
import {
  ArrowRight,
  CheckCircle2,
  CircleDollarSign,
  ExternalLink,
  Gift,
  LifeBuoy,
  Share2,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import { useLocale } from "../lib/locale";

type PresaleRuntime = {
  configured: boolean;
  enabled: boolean;
  networkMode: string;
  presaleVaultAddress: string;
  jettonMasterAddress: string;
  miniAppUrl?: string;
  tonRpcConfigured: boolean;
  tonApiKeyConfigured: boolean;
  storageConfigured: boolean;
  purchaseFlowStatus: "read_only" | "intent_only";
  configStatus: "configured" | "unavailable";
  tradingStatus: "configured" | "disabled";
  chainGetterStatus: "configured" | "disabled" | "unavailable";
  chainVerifierStatus: "manual_review_only" | "disabled";
  chainGetterMessage: string;
  chainGetterErrors?: string[];
  chainSnapshot?: {
    fetchedAt: string;
    active: boolean;
    contractStage: number;
    publicStage?: number;
    funded72H: string;
    sold72H: string;
    saleProceedsTon: string;
    withdrawnTon: string;
    buyerAddress?: string;
    buyerPurchased72H?: string;
    buyerRemaining72H?: string;
    soldByStage: {
      publicStage: number;
      contractStage: number;
      sold72H: string;
      cap72H: string;
    }[];
  };
  walletCap72H: string;
  totalCap72H: string;
  stageRules: {
    publicStage: number;
    contractStage: number;
    tokensPerTon: string;
    cap72H: string;
  }[];
};

type PresaleStatusState =
  | { status: "loading" }
  | { status: "ready"; presale: PresaleRuntime }
  | { status: "error"; message: string; presale: PresaleRuntime };

type BuyerSignal =
  | "buy_interest"
  | "wallet_help"
  | "contract_check"
  | "human_followup";

type ReservationRecord = {
  id: string;
  createdAt: string;
  status: "reserved" | "cancelled" | "review";
  telegramUserId: string;
  username?: string;
  walletAddress?: string;
  desiredAllocation72H: string;
  referral?: string;
  source?: string;
  waitlistMode?: string;
  whitelistStatus?: string;
  saleReminderOptIn?: boolean;
  userSegment?: string;
  communityTasks?: {
    joinedTelegram: boolean;
    followedX: boolean;
    sharedInvite: boolean;
    status: "not_started" | "in_progress" | "completed";
  };
  inviteCode?: string;
  inviteLink?: string;
  referralCode?: string;
  referredByTelegramUserId?: string;
  validReferralCount?: number;
  lotteryCodeCount?: number;
  lotteryCodeLedger?: {
    reason: string;
    codes: number;
    relatedTelegramUserId?: string;
    relatedReservationId?: string;
    createdAt: string;
    note?: string;
  }[];
  lotteryEligible: boolean;
  lotteryStatus?: string;
  drawStatus?: string;
  winningTier?: string;
  winningTierLabel?: string;
  rewardAmount72H?: string;
  payoutStatus?: string;
  payoutTx?: string;
  reservationReward72H: string;
  rewardStatus?: string;
  rewardTxHash?: string;
  rewardAwardedAt?: string;
  lotteryPool72H: string;
  saleOpensAt: string;
  lotteryEvidence?: {
    pool72H: string;
    fundingStatus: string;
    fundingSource: string;
    payoutMode: string;
    noNewContract: boolean;
  };
};

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        initData?: string;
        ready?: () => void;
      };
    };
  }
}

const SALE_OPENS_AT = "2026-05-05T09:00:00.000Z";
const LOTTERY_POOL_LABEL = "10,000,000";
const RESERVATION_REWARD_LABEL = "72";
const PARTICIPATION_REWARD_RANGE_LABEL = "10-200";
const WARMUP_MODE_LABEL = "Early Access";

const FALLBACK_PRESALE: PresaleRuntime = {
  configured: true,
  enabled: false,
  networkMode: "mainnet",
  presaleVaultAddress: "EQCj56OaGFtIBgdtQjIacb7s1jlEy93vh-93PU07MDR1vpE9",
  jettonMasterAddress: "EQBGIzEDvvKObStrcVb6i5Z1-8uYZYtUrYzF2rFZU7xUAXVg",
  tonRpcConfigured: false,
  tonApiKeyConfigured: false,
  storageConfigured: false,
  purchaseFlowStatus: "read_only",
  configStatus: "configured",
  tradingStatus: "disabled",
  chainGetterStatus: "disabled",
  chainVerifierStatus: "disabled",
  chainGetterMessage: "Presale status endpoint is unavailable in this environment.",
  walletCap72H: "7,200,000",
  totalCap72H: "4,500,000,000",
  stageRules: [
    { publicStage: 0, contractStage: 1, tokensPerTon: "10,072", cap72H: "1,500,000,000" },
    { publicStage: 1, contractStage: 2, tokensPerTon: "7,200", cap72H: "1,500,000,000" },
    { publicStage: 2, contractStage: 3, tokensPerTon: "3,500", cap72H: "1,500,000,000" },
  ],
};

function shortAddress(value: string) {
  if (!value) return "Unavailable";
  if (value.length <= 18) return value;
  return `${value.slice(0, 7)}...${value.slice(-7)}`;
}

function explorerAddressUrl(address: string) {
  return `https://tonviewer.com/${address}`;
}

function formatCountdown(ms: number, isEnglish: boolean) {
  if (ms <= 0) return isEnglish ? "opening window reached" : "已到开放窗口";
  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return isEnglish
    ? `${days}d ${hours}h ${minutes}m ${seconds}s`
    : `${days}天 ${hours}小时 ${minutes}分 ${seconds}秒`;
}

function getTelegramInitData() {
  if (typeof window === "undefined") return "";
  return window.Telegram?.WebApp?.initData || "";
}

async function postMiniAppEvent(initData: string, body: Record<string, unknown>) {
  if (!initData) return;
  await fetch("/api/telegram/presale-events", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-Telegram-Init-Data": initData,
    },
    body: JSON.stringify(body),
  });
}

function StatusBadge({
  tone = "neutral",
  children,
}: {
  tone?: "primary" | "gold" | "neutral";
  children: string;
}) {
  const toneClass = {
    primary: "border-primary/25 bg-primary/10 text-primary",
    gold: "border-gold/25 bg-gold/10 text-gold",
    neutral: "border-line/70 bg-surface/58 text-muted-foreground",
  }[tone];

  return (
    <span className={`inline-flex min-h-8 items-center rounded-sm border px-3 text-xs font-semibold ${toneClass}`}>
      {children}
    </span>
  );
}

function MetricCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail?: string;
}) {
  return (
    <div className="rounded-sm border border-line/70 bg-background/42 px-4 py-4">
      <div className="text-xs font-semibold text-muted-foreground">{label}</div>
      <div className="mt-2 text-2xl font-black tracking-normal text-foreground">{value}</div>
      {detail ? <div className="mt-1 text-sm leading-6 text-muted-foreground">{detail}</div> : null}
    </div>
  );
}

function StagePriceRow({
  stage,
  active,
  isEnglish,
}: {
  stage: PresaleRuntime["stageRules"][number];
  active: boolean;
  isEnglish: boolean;
}) {
  return (
    <div
      className={`grid min-h-[4.25rem] grid-cols-[5.75rem_minmax(0,1fr)] items-center gap-3 border-b border-line/60 px-4 last:border-b-0 ${
        active ? "bg-primary/8" : "bg-background/38"
      }`}
    >
      <div className={`text-sm font-black ${active ? "text-primary" : "text-foreground"}`}>
        Stage {stage.publicStage}
      </div>
      <div className="text-right">
        <div className="text-base font-black text-foreground">1 TON = {stage.tokensPerTon} 72H</div>
        <div className="mt-1 text-xs text-muted-foreground">
          {isEnglish ? "cap" : "额度"} {stage.cap72H} 72H
        </div>
      </div>
    </div>
  );
}

function ContractLink({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <a
      href={explorerAddressUrl(value)}
      target="_blank"
      rel="noreferrer"
      className="grid min-h-[4.25rem] grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-line/60 px-4 transition-colors last:border-b-0 hover:bg-primary/6"
    >
      <span>
        <span className="block text-sm font-bold text-foreground">{label}</span>
        <span className="mt-1 block font-mono text-xs text-muted-foreground">{shortAddress(value)}</span>
      </span>
      <ExternalLink className="h-4 w-4 text-muted-foreground" />
    </a>
  );
}

function QuickAction({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-[4.75rem] items-center gap-3 rounded-sm border border-line/70 bg-background/42 px-4 text-left text-sm font-bold text-foreground transition-colors hover:border-primary/30 hover:bg-primary/8"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border border-primary/20 bg-primary/10 text-primary">
        {icon}
      </span>
      {label}
    </button>
  );
}

function RuleStep({
  index,
  title,
  body,
}: {
  index: string;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-sm border border-line/70 bg-background/42 px-4 py-4">
      <div className="flex items-center gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm border border-primary/20 bg-primary/10 text-xs font-black text-primary">
          {index}
        </span>
        <h3 className="text-sm font-black text-foreground">{title}</h3>
      </div>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">{body}</p>
    </div>
  );
}

export default function BotPresale() {
  const { locale } = useLocale();
  const isEnglish = locale === "en-US";
  const [state, setState] = useState<PresaleStatusState>({ status: "loading" });
  const [tonConnectUI] = useTonConnectUI();
  const wallet = useTonWallet();
  const address = useTonAddress(true);
  const restored = useIsConnectionRestored();
  const [walletActionError, setWalletActionError] = useState<string | undefined>();
  const [walletPending, setWalletPending] = useState(false);
  const [initData, setInitData] = useState("");
  const [signalFeedback, setSignalFeedback] = useState<string | undefined>();
  const [countdownNow, setCountdownNow] = useState(() => Date.now());
  const [desiredAllocation72H, setDesiredAllocation72H] = useState("");
  const [referral, setReferral] = useState("");
  const [reservation, setReservation] = useState<ReservationRecord | undefined>();
  const [reservationPending, setReservationPending] = useState(false);
  const [shareTaskPending, setShareTaskPending] = useState(false);
  const [reservationFeedback, setReservationFeedback] = useState<string | undefined>();

  useEffect(() => {
    const telegramInitData = getTelegramInitData();
    setInitData(telegramInitData);
    window.Telegram?.WebApp?.ready?.();
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadStatus() {
      try {
        const statusUrl = address
          ? `/api/telegram/presale-status?${new URLSearchParams({ buyerAddress: address }).toString()}`
          : "/api/telegram/presale-status";
        const response = await fetch(statusUrl, {
          headers: { Accept: "application/json" },
        });

        if (!response.ok) {
          throw new Error(`Presale status request failed (${response.status}).`);
        }

        const payload = (await response.json()) as { ok?: boolean; presale?: PresaleRuntime };
        if (!payload.ok || !payload.presale) {
          throw new Error("Presale status response is invalid.");
        }

        if (!cancelled) {
          setState({ status: "ready", presale: payload.presale });
        }
      } catch (error) {
        if (!cancelled) {
          setState({
            status: "error",
            message: error instanceof Error ? error.message : "status_endpoint_unavailable",
            presale: FALLBACK_PRESALE,
          });
        }
      }
    }

    void loadStatus();

    return () => {
      cancelled = true;
    };
  }, [address]);

  useEffect(() => {
    const timer = window.setInterval(() => setCountdownNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!initData) return;
    void postMiniAppEvent(initData, { type: "miniapp_open" }).catch(() => undefined);
  }, [initData]);

  useEffect(() => {
    if (!initData) return;
    let cancelled = false;

    async function loadReservation() {
      try {
        const response = await fetch("/api/telegram/presale-reservations", {
          headers: {
            Accept: "application/json",
            "X-Telegram-Init-Data": initData,
          },
        });
        if (!response.ok) return;
        const payload = (await response.json()) as { reservation?: ReservationRecord };
        if (!cancelled && payload.reservation) {
          setReservation(payload.reservation);
          setDesiredAllocation72H(payload.reservation.desiredAllocation72H || "");
          setReferral(payload.reservation.referral || "");
        }
      } catch {
        // Keep the form usable; submit will show the real error if auth/storage is unavailable.
      }
    }

    void loadReservation();
    return () => {
      cancelled = true;
    };
  }, [initData]);

  useEffect(() => {
    if (!initData || !address) return;
    void postMiniAppEvent(initData, {
      type: "wallet_connected",
      walletAddress: address,
    }).catch(() => undefined);
  }, [address, initData]);

  const presale = state.status === "ready" || state.status === "error" ? state.presale : FALLBACK_PRESALE;
  const liveStage = presale.chainSnapshot?.publicStage;
  const walletName = useMemo(() => {
    if (!wallet) return isEnglish ? "Not connected" : "未连接";
    return "name" in wallet ? wallet.name : wallet.device.appName;
  }, [isEnglish, wallet]);
  const walletStatusText = !restored
    ? isEnglish ? "Restoring session" : "正在恢复会话"
    : address ? shortAddress(address) : isEnglish ? "Connect a TON wallet" : "连接 TON 钱包";
  const purchaseStatus = isEnglish ? "Early Access reservation · purchase not open" : "白名单预约开放 · 购买未开放";
  const saleOpenMs = new Date(SALE_OPENS_AT).getTime() - countdownNow;
  const saleOpenLabel = new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Shanghai",
  }).format(new Date(SALE_OPENS_AT));
  const countdownText = formatCountdown(saleOpenMs, isEnglish);

  const submitReservation = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setReservationFeedback(undefined);

    if (!initData) {
      setReservationFeedback(isEnglish ? "Open this page inside the official Telegram Mini App to reserve." : "请在官方 Telegram Mini App 内打开本页后预约。");
      return;
    }

    try {
      setReservationPending(true);
      const response = await fetch("/api/telegram/presale-reservations", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-Telegram-Init-Data": initData,
        },
        body: JSON.stringify({
          desiredAllocation72H,
          walletAddress: address || undefined,
          referral: referral || undefined,
          source: "miniapp_waitlist",
          saleReminderOptIn: true,
          communityTasks: {
            joinedTelegram: true,
            followedX: false,
            sharedInvite: false,
          },
        }),
      });
      const payload = (await response.json()) as { ok?: boolean; error?: string; duplicate?: boolean; reservation?: ReservationRecord };
      if (!response.ok || !payload.ok || !payload.reservation) {
        throw new Error(payload.error || `reservation_failed_${response.status}`);
      }
      setReservation(payload.reservation);
      setReservationFeedback(payload.duplicate
        ? isEnglish ? "You are already on the whitelist reservation list." : "你已经在预约白名单中。"
        : isEnglish ? "Reservation confirmed. Whitelist status, opening reminder, 72H reward, and lottery eligibility are recorded." : "预约成功。白名单登记、开售提醒、72H 奖励与抽奖资格已记录。"
      );
    } catch (error) {
      setReservationFeedback(error instanceof Error ? error.message : isEnglish ? "Reservation failed." : "预约失败。");
    } finally {
      setReservationPending(false);
    }
  };

  const completeShareTask = async () => {
    setReservationFeedback(undefined);
    if (!initData || !reservation) return;

    const shareText = reservation.inviteLink
      ? isEnglish
        ? `I reserved 72H Early Access. Join with my invite link: ${reservation.inviteLink}`
        : `我已预约 72H Early Access 白名单。用我的邀请链接加入：${reservation.inviteLink}`
      : isEnglish
        ? "I reserved 72H Early Access. Search the official 72H Bot to join."
        : "我已预约 72H Early Access 白名单，搜索官方 72H Bot 加入。";

    try {
      setShareTaskPending(true);
      await navigator.clipboard?.writeText(shareText).catch(() => undefined);
      const response = await fetch("/api/telegram/presale-reservations", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-Telegram-Init-Data": initData,
        },
        body: JSON.stringify({ action: "community_share_completed" }),
      });
      const payload = (await response.json()) as { ok?: boolean; error?: string; duplicate?: boolean; reservation?: ReservationRecord };
      if (!response.ok || !payload.ok || !payload.reservation) {
        throw new Error(payload.error || `share_task_failed_${response.status}`);
      }
      setReservation(payload.reservation);
      setReservationFeedback(payload.duplicate
        ? isEnglish ? "Share task was already recorded once. Invite text copied again." : "社群分享任务已记录过一次；邀请文案已再次复制。"
        : isEnglish ? "Share task recorded: +2 lottery codes. Invite text copied." : "社群分享任务已记录：+2 个抽奖码。邀请文案已复制。"
      );
    } catch (error) {
      setReservationFeedback(error instanceof Error ? error.message : isEnglish ? "Share task failed." : "分享任务记录失败。");
    } finally {
      setShareTaskPending(false);
    }
  };

  const connectWallet = async () => {
    try {
      setWalletPending(true);
      setWalletActionError(undefined);
      await tonConnectUI.openModal();
    } catch (error) {
      setWalletActionError(error instanceof Error ? error.message : isEnglish ? "Wallet connection failed." : "钱包连接失败。");
    } finally {
      setWalletPending(false);
    }
  };

  const disconnectWallet = async () => {
    try {
      setWalletPending(true);
      setWalletActionError(undefined);
      await tonConnectUI.disconnect();
    } catch (error) {
      setWalletActionError(error instanceof Error ? error.message : isEnglish ? "Wallet disconnect failed." : "钱包断开失败。");
    } finally {
      setWalletPending(false);
    }
  };

  const recordBuyerSignal = (type: BuyerSignal) => {
    const messages: Record<BuyerSignal, string> = {
      buy_interest: isEnglish
        ? "Opening reminder recorded. Purchases are not open yet."
        : "开售提醒已记录。购买暂未开放。",
      wallet_help: isEnglish
        ? "Wallet help signal recorded."
        : "钱包问题已记录。",
      contract_check: isEnglish
        ? "Security check signal recorded."
        : "安全核验需求已记录。",
      human_followup: isEnglish
        ? "Human follow-up signal recorded. You can also send /human in the bot chat."
        : "人工跟进需求已记录。你也可以回到 Bot 聊天发送 /human。",
    };

    setSignalFeedback(messages[type]);
    void postMiniAppEvent(initData, {
      type,
      walletAddress: address || undefined,
      presaleEnabled: presale.enabled,
    }).catch(() => undefined);
  };

  return (
    <div className="page-shell min-h-dvh">
      <section className="page-section-tight pt-[calc(1rem+var(--safe-top))]">
        <div className="page-container mx-auto grid max-w-5xl gap-5">
          <div className="rounded-md border border-line/70 bg-surface/72 p-5 shadow-[0_24px_90px_rgba(0,0,0,0.18)] sm:p-6">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge tone={presale.enabled ? "primary" : "gold"}>{purchaseStatus}</StatusBadge>
              <StatusBadge tone={presale.chainGetterStatus === "configured" ? "primary" : "neutral"}>
                {presale.chainGetterStatus === "configured"
                  ? isEnglish ? "Chain read ready" : "链上状态已读取"
                  : isEnglish ? "Chain read unavailable" : "链上状态不可用"}
              </StatusBadge>
              <StatusBadge tone={address ? "primary" : "neutral"}>
                {address ? (isEnglish ? "Wallet connected" : "钱包已连接") : isEnglish ? "Wallet not connected" : "钱包未连接"}
              </StatusBadge>
            </div>

            <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-end">
              <div>
                <h1 className="text-4xl font-black leading-[1.02] tracking-normal text-foreground sm:text-5xl">
                  {isEnglish ? "72H Whitelist Reservation" : "72H 白名单登记"}
                </h1>
                <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
                  {isEnglish
                    ? "Whitelist registration and opening reminders are handled inside the official Bot / Mini App. This page does not request payment, signatures, private transfers, or promise on-chain quota; register first and watch the countdown."
                    : "预售信息只在官方 Telegram Bot / Mini App 内展示。本页不会要求付款、签名或私下转账，也不承诺链上额度；现在只开放白名单登记、开售提醒与倒计时。"}
                </p>
              </div>

              <div className="rounded-sm border border-line/70 bg-background/42 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-muted-foreground">{isEnglish ? "Wallet" : "钱包"}</div>
                    <div className="mt-2 truncate text-lg font-black text-foreground">{walletName}</div>
                    <div className="mt-1 break-all text-sm leading-6 text-muted-foreground">{walletStatusText}</div>
                  </div>
                  <Wallet className="h-5 w-5 shrink-0 text-gold" />
                </div>

                {walletActionError ? (
                  <div className="mt-3 rounded-sm border border-gold/25 bg-gold/8 px-3 py-2 text-sm leading-6 text-foreground/86">
                    {walletActionError}
                  </div>
                ) : null}

                <button
                  type="button"
                  onClick={address ? disconnectWallet : connectWallet}
                  disabled={walletPending || !restored}
                  className={`${address ? "page-action-muted" : "page-action"} mt-4 w-full disabled:pointer-events-none disabled:opacity-60`}
                >
                  {walletPending
                    ? isEnglish ? "Working" : "处理中"
                    : address
                      ? isEnglish ? "Disconnect" : "断开钱包"
                      : isEnglish ? "Connect wallet" : "连接钱包"}
                </button>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <MetricCard
                label={isEnglish ? "Official opening reminder" : "开售提醒时间"}
                value={countdownText}
                detail={`${saleOpenLabel} · GMT+8`}
              />
              <MetricCard
                label={isEnglish ? "Base lottery code" : "基础抽奖码"}
                value="1"
                detail={isEnglish ? "auto-added after reservation" : "预约成功自动获得"}
              />
              <MetricCard
                label={isEnglish ? "Lottery pool" : "抽奖奖池"}
                value={LOTTERY_POOL_LABEL}
                detail={isEnglish ? "72H wallet-funded prize pool" : "72H 钱包注入奖池"}
              />
            </div>

            <div className="mt-5 rounded-md border border-line/70 bg-background/35 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-black tracking-normal text-foreground">
                    {isEnglish ? "Reward and lottery rules" : "奖励与抽奖规则"}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {isEnglish
                      ? "This is a reservation record only. It creates off-chain eligibility evidence for later manual payout review; it does not open purchase, payment, signature, claim, or a new smart contract."
                      : "当前只是预约记录。它会生成链下资格证据，供后续人工发奖核对；不会开放购买、付款、签名、领取，也不会新增合约。"}
                  </p>
                </div>
                <Gift className="h-5 w-5 shrink-0 text-gold" />
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                <RuleStep
                  index="01"
                  title={isEnglish ? "How to get the 72H reward" : "如何获得预约奖励"}
                  body={isEnglish
                    ? `Submit one valid whitelist reservation in the official Mini App. Eligible records are marked for a ${RESERVATION_REWARD_LABEL} 72H manual wallet-transfer reward after the team verifies duplicates and abuse.`
                    : `在官方 Mini App 提交一条有效白名单预约。团队核对重复与作弊后，符合条件的记录会标记为 ${RESERVATION_REWARD_LABEL} 72H 人工钱包转账奖励。`}
                />
                <RuleStep
                  index="02"
                  title={isEnglish ? "How to get more codes" : "如何获得更多抽奖码"}
                  body={isEnglish
                    ? "Reservation success gives +1 code. Each valid new user invited through your code gives +1. Completing the group/community share task gives +2 once per user."
                    : "预约成功 +1 个抽奖码；通过你的邀请码成功邀请 1 个新用户 +1；完成群/社群分享任务一次性 +2。"}
                />
                <RuleStep
                  index="03"
                  title={isEnglish ? "Transparent draw and payout" : "透明开奖与发奖"}
                  body={isEnglish
                    ? `Each lottery code is one ticket. The team uses a public seed made from TON block hash + activity id + draw time for deterministic shuffling. Prize tiers: first, second, third, and participation (${PARTICIPATION_REWARD_RANGE_LABEL} 72H random range). One user can win at most one major prize; participation rewards may cover more users. Payouts are later sent from an official/private prize wallet. No self-claim page and no contract claim action here.`
                    : `每个抽奖码就是一张票。团队用 TON 区块哈希 + 活动 ID + 开奖时间组成公开随机种子，确定性洗牌开奖。奖项分为一等奖、二等奖、三等奖、参与奖；参与奖为 ${PARTICIPATION_REWARD_RANGE_LABEL} 72H 随机区间。同一用户最多中一次大奖，参与奖可覆盖更多用户。奖励后续由官方/私人奖池钱包转账发放，本页没有自助领取入口，也没有合约领取动作。`}
                />
              </div>
            </div>

            {address && presale.chainSnapshot?.buyerRemaining72H ? (
              <div className="mt-4 rounded-sm border border-primary/20 bg-primary/8 px-4 py-3 text-sm leading-6 text-foreground/90">
                {isEnglish ? "Planned wallet cap remaining" : "计划单钱包剩余上限"}: {presale.chainSnapshot.buyerRemaining72H} 72H
              </div>
            ) : null}

            <div className="mt-4 rounded-sm border border-gold/25 bg-gold/8 px-4 py-3 text-sm leading-6 text-foreground/88">
              {isEnglish
                ? "Before the official opening, this page only records whitelist reservations and reminders. No payment, signature, private transfer, or on-chain quota promise is required."
                : "正式开放前，本页只用于白名单预约和开售提醒。无需付款、无需签名、无需私下转账，也不承诺链上额度。"}
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_20rem]">
            <div className="grid gap-5">
              <div className="rounded-md border border-line/70 bg-surface/72 p-5 sm:p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-black tracking-normal text-foreground">
                      {isEnglish ? "Register whitelist preference" : "登记白名单意向"}
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {isEnglish
                        ? "Submit once with your desired reservation amount. Wallet is optional now; connecting one will attach it to the reservation record."
                        : "填写希望登记的 72H 意向数量。钱包现在可选；已连接钱包会自动写入预约记录。"}
                    </p>
                  </div>
                  <Gift className="h-5 w-5 text-gold" />
                </div>

                {reservation ? (
                  <div className="mt-5 grid gap-3 rounded-sm border border-primary/20 bg-primary/8 px-4 py-3 text-sm leading-6 text-foreground/90">
                    <div>
                      {isEnglish ? "Reserved" : "已预约"}: {reservation.desiredAllocation72H} 72H
                      {reservation.walletAddress ? ` · ${shortAddress(reservation.walletAddress)}` : ""}
                      {reservation.whitelistStatus ? ` · ${reservation.whitelistStatus}` : ""}
                      {reservation.userSegment ? ` · ${reservation.userSegment}` : ""}
                      {reservation.rewardStatus ? ` · ${isEnglish ? "reward" : "发奖"}: ${reservation.rewardStatus}` : ""}
                    </div>
                    <div className="grid gap-2 sm:grid-cols-3">
                      <MetricCard
                        label={isEnglish ? "Your lottery codes" : "当前抽奖码"}
                        value={String(reservation.lotteryCodeCount ?? (reservation.lotteryEligible ? 1 : 0))}
                        detail={isEnglish ? "+1 reserve · +1 per valid invite · +2 one-time group share" : "预约 +1；每邀请 1 个有效新用户 +1；群分享任务一次 +2"}
                      />
                      <MetricCard
                        label={isEnglish ? "Valid invites" : "有效邀请"}
                        value={String(reservation.validReferralCount ?? 0)}
                        detail={reservation.inviteCode ? `${isEnglish ? "Code" : "邀请码"}: ${reservation.inviteCode}` : undefined}
                      />
                      <button
                        type="button"
                        onClick={completeShareTask}
                        disabled={shareTaskPending}
                        className="flex min-h-[6rem] items-center justify-center rounded-sm border border-gold/30 bg-gold/10 px-4 text-sm font-black text-gold transition-colors hover:bg-gold/15 disabled:pointer-events-none disabled:opacity-60"
                      >
                        <Share2 className="mr-2 h-4 w-4" />
                        {shareTaskPending
                          ? isEnglish ? "Recording" : "记录中"
                          : reservation.communityTasks?.sharedInvite
                            ? isEnglish ? "Copy invite again" : "再次复制邀请"
                            : isEnglish ? "Record group share +2" : "记录群分享 +2"}
                      </button>
                    </div>
                    {reservation.drawStatus ? (
                      <div className="rounded-sm border border-line/60 bg-background/35 px-3 py-2 text-xs leading-5 text-muted-foreground">
                        {isEnglish ? "Draw" : "开奖"}: {reservation.drawStatus}
                        {reservation.winningTier && reservation.winningTier !== "none" ? ` · ${reservation.winningTierLabel || reservation.winningTier} · ${reservation.rewardAmount72H || "0"} 72H` : ""}
                        {reservation.payoutStatus ? ` · ${isEnglish ? "payout" : "发放"}: ${reservation.payoutStatus}` : ""}
                        {reservation.payoutTx ? ` · tx: ${reservation.payoutTx}` : ""}
                      </div>
                    ) : null}
                    {reservation.inviteLink ? (
                      <div className="break-all rounded-sm border border-line/60 bg-background/35 px-3 py-2 text-xs text-muted-foreground">
                        {isEnglish ? "Invite link" : "邀请链接"}: {reservation.inviteLink}
                      </div>
                    ) : null}
                  </div>
                ) : null}

                <form className="mt-5 grid gap-4" onSubmit={submitReservation}>
                  <label className="grid gap-2 text-sm font-bold text-foreground">
                    {isEnglish ? "Desired reservation amount (72H)" : "希望登记数量（72H）"}
                    <input
                      value={desiredAllocation72H}
                      onChange={(event) => setDesiredAllocation72H(event.target.value)}
                      inputMode="decimal"
                      placeholder="7200000"
                      disabled={Boolean(reservation) || reservationPending}
                      className="min-h-12 rounded-sm border border-line/70 bg-background/60 px-4 text-base font-semibold outline-none transition-colors focus:border-primary/50 disabled:opacity-60"
                    />
                  </label>
                  <label className="grid gap-2 text-sm font-bold text-foreground">
                    {isEnglish ? "Referral / source (optional)" : "推荐人 / 来源（可选）"}
                    <input
                      value={referral}
                      onChange={(event) => setReferral(event.target.value)}
                      placeholder={isEnglish ? "KOL, community, friend..." : "KOL、社群、朋友……"}
                      disabled={Boolean(reservation) || reservationPending}
                      className="min-h-12 rounded-sm border border-line/70 bg-background/60 px-4 text-base font-semibold outline-none transition-colors focus:border-primary/50 disabled:opacity-60"
                    />
                  </label>
                  <div className="rounded-sm border border-line/70 bg-background/42 px-4 py-3 text-xs leading-5 text-muted-foreground">
                    {isEnglish
                      ? `Current stage: Early Access reservation. Submit once for +1 lottery code; valid invited reservations add +1 each; the group share task adds +2 once. Lottery pool: ${LOTTERY_POOL_LABEL} 72H, paid later by wallet transfer. No funds are accepted here.`
                      : `当前阶段：Early Access 白名单预约。提交成功 +1 个抽奖码；每个有效邀请预约 +1；群分享任务每人限一次 +2。抽奖奖池：${LOTTERY_POOL_LABEL} 72H，后续通过钱包转账发放；本页不收取资金。`}
                  </div>
                  <button
                    type="submit"
                    disabled={Boolean(reservation) || reservationPending}
                    className="page-action w-full disabled:pointer-events-none disabled:opacity-60"
                  >
                    {reservation
                      ? isEnglish ? "Reservation recorded" : "预约已记录"
                      : reservationPending
                        ? isEnglish ? "Submitting" : "提交中"
                        : isEnglish ? "Reserve whitelist" : "预约白名单"}
                  </button>
                </form>

                {reservationFeedback ? (
                  <div className="mt-4 rounded-sm border border-primary/20 bg-primary/8 px-4 py-3 text-sm leading-6 text-foreground/90">
                    {reservationFeedback}
                  </div>
                ) : null}
              </div>

              <div className="rounded-md border border-line/70 bg-surface/72 p-5 sm:p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-black tracking-normal text-foreground">
                      {isEnglish ? "What do you need?" : "你现在需要什么？"}
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {isEnglish
                        ? "These choices help the team follow up on your reservation and reminders."
                        : "这些选择会用于预约与提醒跟进，不会生成交易。"}
                    </p>
                  </div>
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <QuickAction
                    icon={<CircleDollarSign className="h-4 w-4" />}
                    label={isEnglish ? "Remind me when opening starts" : "开售时提醒我"}
                    onClick={() => recordBuyerSignal("buy_interest")}
                  />
                  <QuickAction
                    icon={<Wallet className="h-4 w-4" />}
                    label={isEnglish ? "Wallet help" : "钱包问题"}
                    onClick={() => recordBuyerSignal("wallet_help")}
                  />
                  <QuickAction
                    icon={<ShieldCheck className="h-4 w-4" />}
                    label={isEnglish ? "Verify evidence" : "安全核验"}
                    onClick={() => recordBuyerSignal("contract_check")}
                  />
                  <QuickAction
                    icon={<LifeBuoy className="h-4 w-4" />}
                    label={isEnglish ? "Human follow-up" : "人工跟进"}
                    onClick={() => recordBuyerSignal("human_followup")}
                  />
                </div>

                {signalFeedback ? (
                  <div className="mt-4 rounded-sm border border-primary/20 bg-primary/8 px-4 py-3 text-sm leading-6 text-foreground/90">
                    {signalFeedback}
                  </div>
                ) : null}
              </div>

              <div className="rounded-md border border-line/70 bg-surface/72 p-5 sm:p-6">
                <h2 className="text-xl font-black tracking-normal text-foreground">
                  {isEnglish ? "Planned stage rules" : "计划阶段规则"}
                </h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {isEnglish
                    ? "Not currently purchasable. These are planned rules for official review only."
                    : "当前不可购买、不承诺链上额度。以下仅为开售前规则核对。"}
                </p>
                <div className="mt-5 overflow-hidden rounded-sm border border-line/70">
                  {presale.stageRules.map((item) => (
                    <StagePriceRow
                      key={item.publicStage}
                      stage={item}
                      active={item.publicStage === liveStage}
                      isEnglish={isEnglish}
                    />
                  ))}
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <MetricCard
                    label={isEnglish ? "Planned total cap" : "计划总上限"}
                    value={presale.totalCap72H}
                    detail="72H"
                  />
                  <MetricCard
                    label={isEnglish ? "Wallet cap" : "单钱包上限"}
                    value={presale.walletCap72H}
                    detail="72H"
                  />
                </div>
              </div>
            </div>

            <aside className="grid h-fit gap-5">
              <div className="rounded-md border border-line/70 bg-surface/72 p-5">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-black tracking-normal text-foreground">
                    {isEnglish ? "Official on-chain evidence" : "官方链上证据"}
                  </h2>
                </div>
                <div className="mt-4 overflow-hidden rounded-sm border border-line/70">
                  <ContractLink label="PresaleVault" value={presale.presaleVaultAddress} />
                  <ContractLink label="72H Jetton" value={presale.jettonMasterAddress} />
                </div>
              </div>

              <div className="rounded-md border border-line/70 bg-surface/72 p-5">
                <h2 className="text-lg font-black tracking-normal text-foreground">
                  {isEnglish ? "Safety rule" : "安全规则"}
                </h2>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  {isEnglish
                    ? "Before opening, only off-chain reservations, whitelist status, reminders, community task status, and user segments are recorded. Lottery rewards come from official/private wallet transfers; no new contract is added."
                    : "开放前只记录链下预约、白名单状态、开售提醒、社群任务状态和用户分层。抽奖奖励由官方/私人钱包转账发放，不新增合约。"}
                </p>
                <a
                  href="https://t.me/the72hbot?start=human"
                  target="_blank"
                  rel="noreferrer"
                  className="page-action-muted mt-4 w-full"
                >
                  {isEnglish ? "Talk to bot" : "回到 Bot 咨询"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </div>

              {state.status === "error" ? (
                <div className="rounded-sm border border-gold/25 bg-gold/8 px-4 py-3 text-sm leading-6 text-foreground/86">
                  {isEnglish
                    ? "Live status is temporarily unavailable. Official on-chain evidence remains visible."
                    : "链上状态暂时不可用，官方链上证据地址仍可核验。"}
                </div>
              ) : null}
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}
