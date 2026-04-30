import { useMemo, useState, type ReactNode } from "react";
import { useIsConnectionRestored, useTonAddress, useTonConnectUI } from "@tonconnect/ui-react";
import {
  ArrowRight,
  BadgeCheck,
  CalendarClock,
  CircleDollarSign,
  GraduationCap,
  Landmark,
  ShieldCheck,
  Sparkles,
  Users,
  Wallet,
} from "lucide-react";
import { LocalizedLink as Link } from "../components/LocalizedLink";
import { verifyHoursBalance } from "../lib/hours-balance";
import { useLocale } from "../lib/locale";
import { cn } from "../lib/utils";
import { recordHoursVerification, type HoursVerificationSubject } from "../lib/verification-records";

const TOKEN_CONTRACT = "EQBGIzEDvvKObStrcVb6i5Z1-8uYZYtUrYzF2rFZU7xUAXVg";
const LEARN_THRESHOLD = 720;
const RESERVE_THRESHOLD = 720;
const ALPHA_THRESHOLD = 72_000;
const ONLINE_THRESHOLD = 1_000_000;
const OFFLINE_THRESHOLD = 10_000_000;
const AUCTION_PROOF_THRESHOLD = 100_000;
const AUCTION_START = 10_000;
const AUCTION_STEP = 500;
const AUCTION_DEADLINE = "2026-07-31";

type ParticipationPathId = "learn" | "reserve" | "alpha" | "online" | "offline";
type SubmissionType = ParticipationPathId | "auction";
type VerificationStatus = "idle" | "checking" | "eligible" | "insufficient" | "manual_review";

type VerificationState = {
  balance?: number;
  message?: string;
  status: VerificationStatus;
  threshold?: number;
};

type ParticipationPath = {
  body: string;
  href: string;
  icon: ReactNode;
  id: ParticipationPathId;
  label: string;
  meta: { label: string; value: string }[];
  nextLabel: string;
  risk: string;
  subject: HoursVerificationSubject;
  threshold: number;
  title: string;
  telegramLabel: string;
};

function format72H(value: number) {
  return `${new Intl.NumberFormat("en-US").format(value)} 72H`;
}

function shortAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-6)}`;
}

function encodeTelegramText(text: string) {
  return `https://t.me/the_72h?text=${encodeURIComponent(text)}`;
}

function PanelMetric({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-sm border border-line/70 bg-background/42 px-3 py-3">
      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-primary/75">
        {icon}
        {label}
      </div>
      <div className="mt-2 break-words text-sm font-semibold leading-5 text-foreground">{value}</div>
    </div>
  );
}

function PathButton({
  active,
  icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex min-h-11 min-w-[8rem] shrink-0 items-center justify-center gap-2 rounded-sm border px-3 text-xs font-bold transition-colors active:scale-[0.99] sm:min-w-0",
        active
          ? "border-primary/35 bg-primary/12 text-primary"
          : "border-line/70 bg-background/38 text-muted-foreground hover:border-primary/25 hover:text-foreground",
      )}
    >
      {icon}
      <span className="truncate">{label}</span>
    </button>
  );
}

export default function Join() {
  const { locale } = useLocale();
  const isEnglish = locale === "en-US";
  const [tonConnectUI] = useTonConnectUI();
  const address = useTonAddress(true);
  const isConnectionRestored = useIsConnectionRestored();
  const [selectedPathId, setSelectedPathId] = useState<ParticipationPathId>("learn");
  const [submitted, setSubmitted] = useState<SubmissionType | null>(null);
  const [verification, setVerification] = useState<VerificationState>({ status: "idle" });

  const paths = useMemo<ParticipationPath[]>(
    () => [
      {
        id: "learn",
        label: isEnglish ? "Learn" : "学习",
        title: isEnglish ? "Learning application" : "学习报名",
        body: isEnglish
          ? "Apply online or offline to learn how 72H-style crypto apps are built: wallet connection, product rules, frontend delivery, and project collaboration."
          : "支持线上或线下报名，学习 72H 类加密应用开发：钱包连接、产品规则、前端交付与项目协作。",
        threshold: LEARN_THRESHOLD,
        subject: "learn_entry",
        href: "/learn",
        nextLabel: isEnglish ? "View application path" : "查看学习报名",
        telegramLabel: isEnglish ? "Learning application" : "学习报名",
        risk: isEnglish
          ? "Apply, review, then enter the learning room."
          : "报名核对后进入学习安排。",
        icon: <GraduationCap className="h-4 w-4" />,
        meta: [
          { label: isEnglish ? "Online" : "线上报名", value: isEnglish ? "Telegram application check" : "Telegram 提交报名信息" },
          { label: isEnglish ? "Offline" : "线下报名", value: isEnglish ? "Book an in-person slot" : "预约现场学习" },
          { label: isEnglish ? "Learn" : "能学到", value: isEnglish ? "From user to builder" : "从用户到开发者" },
        ],
      },
      {
        id: "reserve",
        label: "Reserve",
        title: isEnglish ? "Reserve capital seat" : "Reserve 投资席位",
        body: isEnglish
          ? "Principal-custodied participation with a 72-day lock-up and batch-based redemption boundary."
          : "本金托管型参与，72 天锁定，并保留批次化赎回边界。",
        threshold: RESERVE_THRESHOLD,
        subject: "capital_reserve",
        href: "/capital/72hours",
        nextLabel: isEnglish ? "Review Reserve seat" : "核对 Reserve 席位",
        telegramLabel: "Reserve Seat",
        risk: isEnglish ? "Rewards may be 0. Network fees are paid by the wallet." : "奖励可为 0，链上网络费用由钱包承担。",
        icon: <Landmark className="h-4 w-4" />,
        meta: [
          { label: isEnglish ? "Minimum" : "最低门槛", value: format72H(RESERVE_THRESHOLD) },
          { label: isEnglish ? "Lock-up" : "锁定", value: isEnglish ? "72 days" : "72 天" },
        ],
      },
      {
        id: "alpha",
        label: "Alpha",
        title: isEnglish ? "Alpha long-horizon seat" : "Alpha 长期席位",
        body: isEnglish
          ? "High-conviction allocation for people who understand the 72-week, non-redeemable risk boundary."
          : "面向理解 72 周周期与本金不可赎回边界的高信念参与者。",
        threshold: ALPHA_THRESHOLD,
        subject: "capital_alpha",
        href: "/capital/72hours",
        nextLabel: isEnglish ? "Review Alpha rules" : "核对 Alpha 规则",
        telegramLabel: "Alpha Seat",
        risk: isEnglish ? "Principal is non-redeemable and can be fully lost." : "本金不可赎回，并可能产生全部损失。",
        icon: <CircleDollarSign className="h-4 w-4" />,
        meta: [
          { label: isEnglish ? "Minimum" : "最低门槛", value: format72H(ALPHA_THRESHOLD) },
          { label: isEnglish ? "Mandate" : "周期", value: isEnglish ? "72 weeks" : "72 周" },
        ],
      },
      {
        id: "online",
        label: isEnglish ? "Online" : "线上",
        title: isEnglish ? "Online build room" : "线上共创",
        body: isEnglish
          ? "Remote participation for users who already hold enough 72H and want to enter task work."
          : "面向已经持有足额 72H、希望进入任务协作的远程参与者。",
        threshold: ONLINE_THRESHOLD,
        subject: "vibe_online",
        href: "/ecosystem",
        nextLabel: isEnglish ? "Browse active apps" : "浏览可用应用",
        telegramLabel: isEnglish ? "Online build room" : "线上共创",
        risk: isEnglish ? "Admission remains manually confirmed." : "最终入场以人工确认为准。",
        icon: <Sparkles className="h-4 w-4" />,
        meta: [
          { label: isEnglish ? "Proof" : "验资", value: format72H(ONLINE_THRESHOLD) },
          { label: isEnglish ? "Mode" : "模式", value: isEnglish ? "Remote" : "远程" },
        ],
      },
      {
        id: "offline",
        label: isEnglish ? "Offline" : "线下",
        title: isEnglish ? "Offline review room" : "线下深度参与",
        body: isEnglish
          ? "Small-room review, demos, and high-context collaboration for qualified holders."
          : "面向合格持币者的小组现场、Demo 反馈与高语境协作。",
        threshold: OFFLINE_THRESHOLD,
        subject: "vibe_offline",
        href: "/contact",
        nextLabel: isEnglish ? "Open contact path" : "打开联系路径",
        telegramLabel: isEnglish ? "Offline review room" : "线下深度参与",
        risk: isEnglish ? "Venue and timing are confirmed manually." : "地点与时间以人工确认结果为准。",
        icon: <Users className="h-4 w-4" />,
        meta: [
          { label: isEnglish ? "Proof" : "验资", value: format72H(OFFLINE_THRESHOLD) },
          { label: isEnglish ? "Mode" : "模式", value: isEnglish ? "Small room" : "小组现场" },
        ],
      },
    ],
    [isEnglish],
  );

  const selectedPath = paths.find((path) => path.id === selectedPathId) ?? paths[0];
  const walletState = !isConnectionRestored
    ? isEnglish ? "Restoring wallet" : "钱包恢复中"
    : address
      ? shortAddress(address)
      : isEnglish ? "Connect TON wallet" : "连接 TON 钱包";

  const telegramHref = useMemo(() => {
    const addressLine = address ? `钱包：${address}` : "钱包：未连接";
    const riskLine = `边界：${selectedPath.risk}`;

    return encodeTelegramText(
      [
        `我想参与 ${selectedPath.telegramLabel}`,
        `门槛：${format72H(selectedPath.threshold)}`,
        riskLine,
        addressLine,
        `72H 链上证据：${TOKEN_CONTRACT}`,
      ].join("\n"),
    );
  }, [address, selectedPath]);

  const auctionHref = useMemo(() => {
    const addressLine = address ? `钱包：${address}` : "钱包：未连接";

    return encodeTelegramText(
      [
        "我想参与 72H Founder Dinner 竞拍",
        `起拍价：${format72H(AUCTION_START)}`,
        `最低加价：${format72H(AUCTION_STEP)}`,
        `核对门槛：${format72H(AUCTION_PROOF_THRESHOLD)}`,
        `截止：${AUCTION_DEADLINE}`,
        addressLine,
      ].join("\n"),
    );
  }, [address]);

  const connectWallet = () => {
    if (address) return;
    void tonConnectUI.openModal();
  };

  const verify72HBalance = async (threshold: number, subject: HoursVerificationSubject): Promise<VerificationStatus> => {
    if (!address) {
      connectWallet();
      return "idle";
    }

    setVerification({ status: "checking", threshold });

    try {
      const result = await verifyHoursBalance({
        address,
        isEnglish,
        threshold,
        tokenContract: TOKEN_CONTRACT,
      });

      setVerification({
        balance: result.balance,
        status: result.status,
        threshold,
        message: result.message,
      });
      void recordHoursVerification({
        address,
        result,
        subject,
        threshold,
        tokenContract: TOKEN_CONTRACT,
      });

      return result.status;
    } catch {
      setVerification({
        status: "manual_review",
        threshold,
        message: isEnglish
          ? "On-chain balance check is temporarily unavailable. Send request for manual check."
          : "链上验资暂不可用，可发送意向进入人工确认。",
      });
      return "manual_review";
    }
  };

  const handleSubmit = async (type: SubmissionType) => {
    if (!address) {
      connectWallet();
      return;
    }

    const threshold = type === "auction" ? AUCTION_PROOF_THRESHOLD : selectedPath.threshold;
    const subject: HoursVerificationSubject = type === "auction" ? "founder_dinner_auction" : selectedPath.subject;
    const status = await verify72HBalance(threshold, subject);
    if (status !== "eligible" && status !== "manual_review") return;

    setSubmitted(type);
  };

  const isChecking = verification.status === "checking";
  const canOpenTelegram = submitted === selectedPath.id && address;
  const isLearningPath = selectedPath.id === "learn";

  return (
    <div className="page-shell pt-20 sm:pt-24">
      <section className="page-section-tight pt-4 sm:pt-10">
        <div className="page-container page-container-wide">
          <div className="mb-6 flex items-center justify-between gap-3">
            <div className="page-kicker w-fit">{isEnglish ? "Official entry" : "官方入口"}</div>
            <div className="hidden items-center gap-2 rounded-sm border border-line/70 bg-surface/58 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground sm:flex">
              <BadgeCheck className="h-3.5 w-3.5 text-primary" />
              72H / TON
            </div>
          </div>

          <div className="grid min-h-[calc(100svh-11rem)] gap-5">
            <div className="flex min-w-0 flex-col gap-5">
              <div className="max-w-4xl">
                <h1 className="text-[2.65rem] font-black leading-[0.98] tracking-normal text-foreground sm:text-6xl lg:text-7xl">
                  {isEnglish ? "Enter 72hours." : "进入 72hours。"}
                </h1>
                <p className="mt-4 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
                  {isEnglish
                    ? "Start from the official app map, community, or Green Book. Some deeper paths may ask for wallet-aware eligibility check later."
                    : "从官方应用地图、社区或绿皮书开始。更深层的学习、协作或席位入口，后续可能需要钱包参与核对。"}
                </p>
                <div className="mt-4 max-w-3xl rounded-sm border border-gold/25 bg-gold/8 px-4 py-3 text-sm leading-7 text-foreground/88">
                  {isEnglish
                    ? "This is the public entry page for the 72H ecosystem. 72H cannot be purchased here, SeasonClaim cannot be claimed here, and real Capital seats cannot be configured here."
                    : "这里是 72H 生态的对外入口页。当前不可购买 72H，不可领取 SeasonClaim，也不可配置真实 Capital 席位。"}
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  {[
                    {
                      href: "/ecosystem",
                      label: isEnglish ? "Open app map" : "打开应用地图",
                      body: isEnglish ? "Find live 72H entries." : "查看当前可用的 72H 界面。",
                    },
                    {
                      href: "/greenbook",
                      label: isEnglish ? "Read Green Book" : "阅读绿皮书",
                      body: isEnglish ? "Understand rules, on-chain facts, and boundaries." : "理解规则、链上事实与风险边界。",
                    },
                    {
                      href: "https://t.me/the_72h",
                      label: isEnglish ? "Join community" : "加入社区",
                      body: isEnglish ? "Follow updates and ask questions." : "获取更新并提问。",
                      external: true,
                    },
                  ].map((entry) => {
                    const className = "group flex min-h-28 flex-col justify-between rounded-sm border border-line/70 bg-background/42 p-4 text-left transition-colors hover:border-primary/30 hover:bg-surface/74";
                    const content = (
                      <>
                        <div>
                          <div className="text-base font-black text-foreground">{entry.label}</div>
                          <p className="mt-2 text-sm leading-6 text-muted-foreground">{entry.body}</p>
                        </div>
                        <ArrowRight className="mt-4 h-4 w-4 text-gold transition-transform group-hover:translate-x-1" />
                      </>
                    );

                    return entry.external ? (
                      <a key={entry.href} href={entry.href} target="_blank" rel="noreferrer" className={className}>
                        {content}
                      </a>
                    ) : (
                      <Link key={entry.href} to={entry.href} className={className}>
                        {content}
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-md border border-line/70 bg-surface/72 p-3 shadow-[0_24px_90px_rgba(0,0,0,0.22)] sm:p-4">
                <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:grid sm:grid-cols-5 sm:overflow-visible sm:pb-0 [&::-webkit-scrollbar]:hidden">
                  {paths.map((path) => (
                    <PathButton
                      key={path.id}
                      active={selectedPathId === path.id}
                      icon={path.icon}
                      label={path.label}
                      onClick={() => {
                        setSelectedPathId(path.id);
                        setSubmitted(null);
                      }}
                    />
                  ))}
                </div>

                <div className="mt-4 grid gap-4 rounded-sm border border-line/70 bg-[linear-gradient(135deg,rgba(34,197,94,0.08),rgba(7,14,10,0.52)_38%,rgba(185,157,87,0.06))] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] lg:grid-cols-[minmax(0,1fr)_18rem]">
                  <div className="min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-primary/75">
                          {isEnglish ? "Selected path" : "当前路径"}
                        </div>
                        <h2 className="mt-3 text-2xl font-black leading-tight text-foreground sm:text-3xl">
                          {selectedPath.title}
                        </h2>
                      </div>
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-sm border border-primary/25 bg-primary/10 text-primary">
                        {selectedPath.icon}
                      </div>
                    </div>

                    <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">
                      {selectedPath.body}
                    </p>

                    <div className={cn("mt-4 grid gap-2", isLearningPath ? "sm:grid-cols-3" : "sm:grid-cols-2")}>
                      {selectedPath.meta.map((item) => (
                        <PanelMetric
                          key={item.label}
                          icon={<ShieldCheck className="h-3.5 w-3.5" />}
                          label={item.label}
                          value={item.value}
                        />
                      ))}
                    </div>

                    {!isLearningPath ? (
                      <div className="mt-4 rounded-sm border border-gold/20 bg-gold/8 px-4 py-3 text-sm leading-7 text-foreground/88">
                        {selectedPath.risk}
                      </div>
                    ) : null}
                  </div>

                  <div className="flex flex-col gap-3 rounded-sm border border-line/70 bg-surface/78 p-3 shadow-[0_18px_50px_rgba(0,0,0,0.18)]">
                    <PanelMetric
                      icon={<Wallet className="h-3.5 w-3.5" />}
                      label={isEnglish ? "Wallet" : "钱包"}
                      value={walletState}
                    />
                    <PanelMetric
                      icon={<CircleDollarSign className="h-3.5 w-3.5" />}
                      label={isLearningPath ? (isEnglish ? "Review gate" : "报名门槛") : (isEnglish ? "Required" : "所需 72H")}
                      value={format72H(selectedPath.threshold)}
                    />

                    {verification.status !== "idle" ? (
                      <div
                        className={cn(
                          "rounded-sm border px-3 py-3 text-sm leading-6",
                          verification.status === "eligible"
                            ? "border-primary/25 bg-primary/10 text-primary"
                            : verification.status === "insufficient"
                              ? "border-gold/25 bg-gold/10 text-gold"
                              : "border-line/70 bg-background/42 text-muted-foreground",
                        )}
                      >
                        <div className="font-mono text-[10px] uppercase tracking-[0.2em]">
                          {verification.status === "checking"
                            ? isEnglish ? "Checking" : "正在验资"
                            : verification.status === "manual_review"
                              ? isEnglish ? "Manual check" : "人工确认"
                              : isEnglish ? "Balance proof" : "验资结果"}
                        </div>
                        <div className="mt-2">
                          {verification.status === "checking"
                            ? isEnglish ? "Reading 72H balance on TON..." : "正在读取 TON 钱包中的 72H 余额..."
                            : verification.balance !== undefined
                              ? `${isEnglish ? "Balance" : "余额"}: ${format72H(Math.floor(verification.balance))}`
                              : verification.message}
                        </div>
                        {verification.message && verification.balance !== undefined ? (
                          <div className="mt-1 text-xs opacity-80">{verification.message}</div>
                        ) : null}
                      </div>
                    ) : null}

                    <button
                      type="button"
                      onClick={() => void handleSubmit(selectedPath.id)}
                      disabled={!isConnectionRestored || isChecking}
                      className="premium-button w-full disabled:cursor-wait disabled:opacity-60"
                    >
                      {isChecking
                        ? isEnglish ? "Checking" : "正在验资"
                        : address
                          ? isLearningPath
                            ? isEnglish ? "Verify application" : "确认报名条件"
                            : isEnglish ? "Verify entry" : "核对后进入"
                          : isLearningPath
                            ? isEnglish ? "Connect and apply" : "连接钱包并报名"
                            : isEnglish ? "Connect wallet" : "连接钱包"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </button>

                    {canOpenTelegram ? (
                      <a href={telegramHref} target="_blank" rel="noreferrer" className="premium-button-muted w-full">
                        {verification.status === "manual_review"
                          ? isEnglish ? "Send for review" : "发送人工确认"
                          : isEnglish ? "Send request" : "发送参与信息"}
                      </a>
                    ) : null}

                    <Link to={selectedPath.href} className="page-action-muted w-full">
                      {isLearningPath ? (isEnglish ? "View application" : "查看学习报名") : selectedPath.nextLabel}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="page-section-tight pt-0 pb-20 sm:pb-28">
        <div className="page-container page-container-wide">
          <div className="rounded-md border border-gold/25 bg-[linear-gradient(180deg,rgba(185,157,87,0.12),rgba(7,14,10,0.72))] p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-gold">
                  {isEnglish ? "Special entry" : "特别入口"}
                </div>
                <h2 className="mt-3 text-2xl font-black leading-tight text-foreground">
                  {isEnglish ? "Founder Dinner" : "创始人见面晚餐"}
                </h2>
              </div>
              <CalendarClock className="h-6 w-6 shrink-0 text-gold" />
            </div>
            <div className="mt-4 grid gap-2">
              <PanelMetric icon={<CircleDollarSign className="h-3.5 w-3.5" />} label={isEnglish ? "Start" : "起拍"} value={format72H(AUCTION_START)} />
              <PanelMetric icon={<ArrowRight className="h-3.5 w-3.5" />} label={isEnglish ? "Step" : "加价"} value={format72H(AUCTION_STEP)} />
              <PanelMetric icon={<ShieldCheck className="h-3.5 w-3.5" />} label={isEnglish ? "Proof" : "验资"} value={format72H(AUCTION_PROOF_THRESHOLD)} />
            </div>
            <button
              type="button"
              onClick={() => void handleSubmit("auction")}
              disabled={!isConnectionRestored || isChecking}
              className="premium-button mt-4 w-full disabled:cursor-wait disabled:opacity-60"
            >
              {isChecking
                ? isEnglish ? "Checking" : "正在验资"
                : address
                  ? isEnglish ? "Verify and bid" : "核对并竞拍"
                  : isEnglish ? "Connect wallet" : "连接钱包"}
            </button>
            {submitted === "auction" && address ? (
              <a href={auctionHref} target="_blank" rel="noreferrer" className="premium-button-muted mt-3 w-full">
                {verification.status === "manual_review"
                  ? isEnglish ? "Send bid for review" : "发送竞拍核对"
                  : isEnglish ? "Send bid" : "发送竞拍信息"}
              </a>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
}
