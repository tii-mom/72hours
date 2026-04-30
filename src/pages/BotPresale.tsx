import { useEffect, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  Gift,
  LifeBuoy,
  Share2,
  ShieldCheck,
} from "lucide-react";
import { officialLinkNote, officialLinks } from "../content/official-links";
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
  actionFlowStatus: "read_only" | "intent_only";
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
const WARMUP_MODE_LABEL = "Early Reservation";

const FALLBACK_PRESALE: PresaleRuntime = {
  configured: true,
  enabled: false,
  networkMode: "mainnet",
  presaleVaultAddress: "EQCj56OaGFtIBgdtQjIacb7s1jlEy93vh-93PU07MDR1vpE9",
  jettonMasterAddress: "EQBGIzEDvvKObStrcVb6i5Z1-8uYZYtUrYzF2rFZU7xUAXVg",
  tonRpcConfigured: false,
  tonApiKeyConfigured: false,
  storageConfigured: false,
  actionFlowStatus: "read_only",
  configStatus: "configured",
  tradingStatus: "disabled",
  chainGetterStatus: "disabled",
  chainVerifierStatus: "disabled",
  chainGetterMessage: "Contract evidence is syncing.",
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
  if (ms <= 0) return isEnglish ? "update window reached" : "已到计划节点";
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
          {isEnglish ? "not live · not a quote · cap evidence" : "未开放 · 非报价 · 上限证据"} {stage.cap72H} 72H
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

function displayDrawStatus(status: string | undefined, isEnglish: boolean) {
  const labels: Record<string, string> = isEnglish ? {
    eligible_pending_draw: "Not drawn yet",
    pending_draw: "Not drawn yet",
    in_progress: "Drawing in progress",
    finalized: "Draw completed",
    ineligible: "Not eligible",
    review: "Under review",
  } : {
    eligible_pending_draw: "未开奖",
    pending_draw: "未开奖",
    in_progress: "开奖中",
    finalized: "已开奖",
    ineligible: "资格未通过",
    review: "资格复核中",
  };
  return status ? (labels[status] || status) : isEnglish ? "Not drawn yet" : "未开奖";
}

function displayPayoutStatus(status: string | undefined, isEnglish: boolean) {
  const labels: Record<string, string> = isEnglish ? {
    pending_manual_transfer: "Waiting for official wallet transfer",
    pending: "Waiting for official wallet transfer",
    processing: "Transfer in progress",
    transferred: "Transferred",
    paid: "Transferred",
    failed: "Needs follow-up",
    not_required: "No transfer needed",
    not_awarded: "Waiting for draw",
    rejected: "Not eligible",
  } : {
    pending_manual_transfer: "待官方钱包发放",
    pending: "待官方钱包发放",
    processing: "发放处理中",
    transferred: "已发放",
    paid: "已发放",
    failed: "待复核处理",
    not_required: "无需发放",
    not_awarded: "等待开奖",
    rejected: "资格未通过",
  };
  return status ? (labels[status] || status) : isEnglish ? "Waiting for draw" : "等待开奖";
}

function displayWhitelistStatus(status: string | undefined, isEnglish: boolean) {
  const labels: Record<string, string> = isEnglish ? {
    registered_pending_review: "Registered, pending review",
    approved: "Reviewed",
    rejected: "Not eligible",
  } : {
    registered_pending_review: "已登记，待复核",
    approved: "已复核",
    rejected: "资格未通过",
  };
  return status ? (labels[status] || status) : undefined;
}

function displayUserSegment(segment: string | undefined, isEnglish: boolean) {
  const labels: Record<string, string> = isEnglish ? {
    priority_whale: "Priority follow-up",
    priority_core: "Priority follow-up",
    telegram_premium: "Telegram Premium user",
    warmup_waitlist: "Early reservation list",
  } : {
    priority_whale: "优先跟进",
    priority_core: "优先跟进",
    telegram_premium: "Telegram Premium 用户",
    warmup_waitlist: "早期预约名单",
  };
  return segment ? (labels[segment] || segment) : undefined;
}

export default function BotPresale() {
  const { locale } = useLocale();
  const isEnglish = locale === "en-US";
  const [state, setState] = useState<PresaleStatusState>({ status: "loading" });
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
        const response = await fetch("/api/telegram/presale-status", {
          headers: { Accept: "application/json" },
        });

        if (!response.ok) {
          throw new Error("presale_status_unavailable");
        }

        const payload = (await response.json()) as { ok?: boolean; presale?: PresaleRuntime };
        if (!payload.ok || !payload.presale) {
          throw new Error("presale_status_invalid");
        }

        if (!cancelled) {
          setState({ status: "ready", presale: payload.presale });
        }
      } catch (error) {
        console.warn("Presale status sync failed", error);
        if (!cancelled) {
          setState({
            status: "error",
            message: isEnglish
              ? "Contract evidence is syncing. Early reservation remains available."
              : "合约证据正在同步，早期预约仍可继续。",
            presale: FALLBACK_PRESALE,
          });
        }
      }
    }

    void loadStatus();

    return () => {
      cancelled = true;
    };
  }, [isEnglish]);

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

  const presale = state.status === "ready" || state.status === "error" ? state.presale : FALLBACK_PRESALE;
  const liveStage = presale.chainSnapshot?.publicStage;
  const reservationStatus = isEnglish ? "Early reservation only · info record / wallet actions closed" : "早期预约阶段 · 仅登记信息 / 钱包动作关闭";
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
        throw new Error("reservation_unavailable");
      }
      setReservation(payload.reservation);
      setReservationFeedback(payload.duplicate
        ? isEnglish ? "You are already on the early reservation list." : "你已经在早期预约名单中。"
        : isEnglish ? "Reservation recorded. You received 1 raffle code. Valid invites add +1; community sharing can add +2 only after review." : "预约已记录。你已获得 1 个抽奖码；有效邀请 +1，社群分享任务待复核通过后才可能 +2。"
      );
    } catch (error) {
      console.warn("Reservation submission failed", error);
      setReservationFeedback(isEnglish ? "Reservation could not be recorded right now. Please try again in the official Mini App." : "预约暂时无法记录，请稍后在官方 Mini App 内重试。");
    } finally {
      setReservationPending(false);
    }
  };

  const completeShareTask = async () => {
    setReservationFeedback(undefined);
    if (!initData || !reservation) return;

    const shareText = reservation.inviteLink
      ? isEnglish
        ? `I just completed my 72H early reservation. Wallet actions stay closed — this phase is only for reservation and raffle codes. Reserve through my link to get your raffle code: ${reservation.inviteLink}`
        : `我刚完成了 72H 早期预约。当前钱包动作关闭，只是预约并获得抽奖码。通过我的链接预约，你也可以获得抽奖码：${reservation.inviteLink}`
      : isEnglish
        ? "I just completed my 72H early reservation. Wallet actions stay closed — search the official 72H Bot to join."
        : "我刚完成了 72H 早期预约。当前钱包动作关闭；搜索官方 72H Bot 加入。";

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
        throw new Error("share_task_unavailable");
      }
      setReservation(payload.reservation);
      setReservationFeedback(payload.duplicate
        ? isEnglish ? "Share task is already pending review. Invite text copied again." : "社群分享任务已在待复核中；邀请文案已再次复制。"
        : isEnglish ? "Share task submitted for review. +2 remains pending until approved. Invite text copied." : "社群分享任务已提交复核；+2 待审核通过后才生效。邀请文案已复制。"
      );
    } catch (error) {
      console.warn("Share task recording failed", error);
      setReservationFeedback(isEnglish ? "Share task could not be recorded right now. Invite text was prepared; please try again later." : "社群分享任务暂时无法记录；邀请文案已准备好，请稍后重试。");
    } finally {
      setShareTaskPending(false);
    }
  };

  const recordBuyerSignal = (type: BuyerSignal) => {
    const messages: Record<BuyerSignal, string> = {
      buy_interest: isEnglish
        ? "Official update reminder recorded. Funds movement and asset-receipt steps are not open."
        : "官方更新提醒已记录。资金动作与资产接收步骤尚未开放。",
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
      presaleEnabled: presale.enabled,
    }).catch(() => undefined);
  };

  return (
    <div className="page-shell min-h-dvh">
      <section className="page-section-tight pt-[calc(1rem+var(--safe-top))]">
        <div className="page-container mx-auto grid max-w-5xl gap-5">
          <div className="rounded-md border border-line/70 bg-surface/72 p-5 shadow-[0_24px_90px_rgba(0,0,0,0.18)] sm:p-6">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge tone={presale.enabled ? "primary" : "gold"}>{reservationStatus}</StatusBadge>
              <StatusBadge tone={presale.chainGetterStatus === "configured" ? "primary" : "neutral"}>
                {presale.chainGetterStatus === "configured"
                  ? isEnglish ? "Public evidence ready" : "公开证据已同步"
                  : isEnglish ? "Public evidence pending" : "公开证据待同步"}
              </StatusBadge>
            </div>

            <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)] lg:items-end">
              <div>
                <h1 className="text-4xl font-black leading-[1.02] tracking-normal text-foreground sm:text-5xl">
                  {isEnglish ? "72H Early Reservation" : "72H 早期预约通道"}
                </h1>
                <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
                  {isEnglish
                    ? "This phase is for reservations and raffle-code accumulation only: reserve +1, valid invited reservation +1, approved community sharing task +2. Funds movement, wallet actions, private transfers, and quota commitments are not handled here."
                    : "当前阶段仅开放预约与抽奖码累计：完成预约 +1，邀请新用户完成预约 +1，社群分享任务复核通过后才可能 +2。本页不处理资金动作、钱包动作、私下转账或额度承诺。"}
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <MetricCard
                label={isEnglish ? "Official update window" : "预约阶段计划节点"}
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
                    {isEnglish ? "Reservation and draw rules" : "预约与开奖规则"}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {isEnglish
                      ? "This is a reservation record only. It records information for later prize review; it does not confirm eligibility, quota, funds movement, wallet authorization, or instant reward receipt."
                      : "当前只是预约记录。它会记录后续发奖复核所需的信息；不确认资格、额度、资金动作、钱包授权或即时奖励接收。"}
                  </p>
                </div>
                <Gift className="h-5 w-5 shrink-0 text-gold" />
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                <RuleStep
                  index="01"
                  title={isEnglish ? "Reservation gives 1 code" : "预约获得 1 个抽奖码"}
                  body={isEnglish
                    ? "Complete one valid reservation in the official Mini App and receive 1 raffle code. Raffle codes are entries for this reservation-phase draw only."
                    : "在官方 Mini App 完成一次有效预约，即获得 1 个抽奖码。抽奖码仅用于本次预约阶段开奖。"}
                />
                <RuleStep
                  index="02"
                  title={isEnglish ? "How codes become reviewable" : "抽奖码如何进入复核"}
                  body={isEnglish
                    ? "Reservation success gives +1 code. Each valid new user invited through your code gives +1. A group/community sharing task can add +2 once per user only after review."
                    : "预约成功 +1 个抽奖码；通过你的邀请码成功邀请 1 个有效新用户 +1；群/社群分享任务需复核通过后才可能一次性 +2。"}
                />
                <RuleStep
                  index="03"
                  title={isEnglish ? "Transparent draw and prize transfer" : "透明开奖与发奖"}
                  body={isEnglish
                    ? `Each lottery code is one ticket. The draw uses public parameters: TON block hash + activity ID + draw time, so the result can be reviewed after publication. Prize tiers: first, second, third, and participation (${PARTICIPATION_REWARD_RANGE_LABEL} 72H random range). One user can win at most one major prize; participation rewards may cover more users. Rewards are later sent from the official prize wallet. No gas or instant asset-receipt step is needed here.`
                    : `每个抽奖码就是一张票。开奖使用公开参数：TON 区块哈希 + 活动 ID + 开奖时间，结果公布后可复核。奖项分为一等奖、二等奖、三等奖、参与奖；参与奖为 ${PARTICIPATION_REWARD_RANGE_LABEL} 72H 随机区间。同一用户最多中一次大奖，参与奖可覆盖更多用户。奖励后续由官方奖池钱包转账发放，本页无需 gas，也没有即时资产接收入口。`}
                />
              </div>
            </div>


            <div className="mt-4 rounded-sm border border-gold/25 bg-gold/8 px-4 py-3 text-sm leading-6 text-foreground/88">
              {isEnglish
                ? "Safety reminder: the Bot will not ask for funds movement, wallet authorization, seed phrases/private keys, or asset-receipt steps at this stage."
                : "安全提醒：当前阶段 Bot 不会要求资金动作、钱包授权、输入助记词/私钥或资产接收步骤。"}
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_20rem]">
            <div className="grid gap-5">
              <div className="rounded-md border border-line/70 bg-surface/72 p-5 sm:p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-black tracking-normal text-foreground">
                      {isEnglish ? "Join early reservation list" : "加入早期预约名单"}
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {isEnglish
                        ? "Submit once to join the early reservation list and receive 1 raffle code. Your interest range is not quota, eligibility, price, or a funding commitment."
                        : "提交一次即可加入早期预约名单并获得 1 个抽奖码。关注区间不代表额度、资格、价格或资金承诺。"}
                    </p>
                  </div>
                  <Gift className="h-5 w-5 text-gold" />
                </div>

                {reservation ? (
                  <div className="mt-5 grid gap-3 rounded-sm border border-primary/20 bg-primary/8 px-4 py-3 text-sm leading-6 text-foreground/90">
                    <div>
                      {isEnglish ? "Interest range" : "关注区间"}: {reservation.desiredAllocation72H} 72H
                      {reservation.whitelistStatus ? ` · ${displayWhitelistStatus(reservation.whitelistStatus, isEnglish)}` : ""}
                      {reservation.userSegment ? ` · ${displayUserSegment(reservation.userSegment, isEnglish)}` : ""}
                      {reservation.rewardStatus ? ` · ${isEnglish ? "Reward status" : "发奖状态"}: ${displayPayoutStatus(reservation.rewardStatus, isEnglish)}` : ""}
                    </div>
                    <div className="grid gap-2 sm:grid-cols-3">
                      <MetricCard
                        label={isEnglish ? "Your lottery codes" : "当前抽奖码"}
                        value={String(reservation.lotteryCodeCount ?? (reservation.lotteryEligible ? 1 : 0))}
                        detail={isEnglish ? "+1 reserve · +1 per valid invite · +2 share pending review" : "预约 +1；有效邀请 +1；分享 +2 待复核"}
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
                            : isEnglish ? "Submit share for +2 review" : "提交分享 +2 复核"}
                      </button>
                    </div>
                    {reservation.drawStatus ? (
                      <div className="rounded-sm border border-line/60 bg-background/35 px-3 py-2 text-xs leading-5 text-muted-foreground">
                        {isEnglish ? "Draw" : "开奖"}: {displayDrawStatus(reservation.drawStatus, isEnglish)}
                        {reservation.winningTier && reservation.winningTier !== "none" ? ` · ${reservation.winningTierLabel || reservation.winningTier} · ${reservation.rewardAmount72H || "0"} 72H` : ""}
                        {reservation.payoutStatus ? ` · ${isEnglish ? "Reward status" : "发奖状态"}: ${displayPayoutStatus(reservation.payoutStatus, isEnglish)}` : ""}
                        {reservation.payoutTx ? ` · ${isEnglish ? "Transfer record" : "转账记录"}: ${reservation.payoutTx}` : ""}
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
                    {isEnglish ? "Interest range (72H)" : "关注区间（72H）"}
                    <input
                      value={desiredAllocation72H}
                      onChange={(event) => setDesiredAllocation72H(event.target.value)}
                      inputMode="decimal"
                      placeholder={isEnglish ? "Example only, not quota" : "仅示例，不代表额度"}
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
                      ? `Current phase: early reservation only. The interest range is not quota, eligibility, price, or a funding commitment. Submit once for +1 raffle code; valid invited reservations add +1 each; the group/community sharing task can add +2 only after review. Funds movement, wallet actions, and asset-receipt steps are not accepted here.`
                      : `当前阶段：仅早期预约。关注区间不代表额度、资格、价格或资金承诺。提交成功 +1 个抽奖码；每个有效邀请预约 +1；群/社群分享任务审核通过后才可能 +2。本页不处理资金动作、钱包动作或资产接收步骤。`}
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
                        : isEnglish ? "Join reservation list" : "加入预约名单"}
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
                        ? "These choices help the team follow up on your reservation and official update reminders."
                        : "这些选择会用于预约与官方更新提醒跟进，不会生成交易。"}
                    </p>
                  </div>
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <QuickAction
                    icon={<Gift className="h-4 w-4" />}
                    label={isEnglish ? "Remind me about official updates" : "官方更新时提醒我"}
                    onClick={() => recordBuyerSignal("buy_interest")}
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
                  {isEnglish ? "Contract rule evidence (not live)" : "合约规则证据（未开放）"}
                </h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {isEnglish
                    ? "Not live, not a quote, not a funding commitment. Shown only as contract-rule evidence for review."
                    : "未开放、不是报价、不是资金承诺。以下仅作为合约规则证据供核对。"}
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
                    label={isEnglish ? "Rule cap evidence" : "规则上限证据"}
                    value={presale.totalCap72H}
                    detail="72H"
                  />
                  <MetricCard
                    label={isEnglish ? "Wallet cap evidence" : "单钱包上限证据"}
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
                  <ContractLink label={isEnglish ? "PresaleVault evidence · closed" : "PresaleVault 链上证据（关闭状态）"} value={presale.presaleVaultAddress} />
                  <ContractLink label={isEnglish ? "72H token address" : "72H 代币地址"} value={presale.jettonMasterAddress} />
                </div>
              </div>

              <div className="rounded-md border border-line/70 bg-surface/72 p-5">
                <h2 className="text-lg font-black tracking-normal text-foreground">
                  {isEnglish ? "Safety rule" : "安全规则"}
                </h2>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  {isEnglish
                    ? "At this stage, 72H Bot will never ask for funds movement, wallet authorization, seed phrases/private keys, or asset-receipt steps. Follow official Bot and group announcements only."
                    : "当前阶段，72H Bot 不会要求资金动作、钱包授权、输入助记词/私钥或资产接收步骤。请只以官方 Bot 与官方群公告为准。"}
                </p>
                <p className="mt-3 text-xs font-semibold leading-5 text-gold">
                  {isEnglish ? officialLinkNote.en : officialLinkNote.zh}
                </p>
                <a
                  href={officialLinks.telegramBotHuman}
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
                    ? "Contract evidence is syncing. Early reservation remains available."
                    : "合约证据正在同步，早期预约仍可继续。"}
                </div>
              ) : null}
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}
