import { ArrowRight, Wallet } from "lucide-react";
import { InfoCallout } from "../components/InfoCallout";
import { InfoPageHero } from "../components/InfoPageHero";
import { LocalizedLink as Link } from "../components/LocalizedLink";
import { PageLoader } from "../components/PageLoader";
import { SpotlightCard } from "../components/SpotlightCard";
import { CapitalIdentityCard } from "../components/capital/CapitalIdentityCard";
import { CapitalIntentConsole } from "../components/capital/CapitalIntentConsole";
import { CapitalMetricGrid } from "../components/capital/CapitalMetricGrid";
import { CapitalSectionHeading } from "../components/capital/CapitalSectionHeading";
import { CapitalWalletPanel } from "../components/capital/CapitalWalletPanel";
import { parseCapitalSeatKey, useCapitalIntentController } from "../lib/capital-intents";
import { useLocale } from "../lib/locale";
import { useCapitalPortfolio } from "../lib/use-capital-data";

function PortfolioSupplement({
  position,
  claimableYield,
  privateNote,
  isEnglish,
}: {
  position: string;
  claimableYield: string;
  privateNote: string;
  isEnglish: boolean;
}) {
  return (
    <SpotlightCard className="page-card flex flex-col gap-4 border-line/70 bg-background/46">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            {isEnglish ? "Position" : "持仓"}
          </p>
          <p className="mt-2 text-sm font-semibold leading-7 text-foreground">
            {position}
          </p>
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            {isEnglish ? "Claimable yield" : "可领取收益"}
          </p>
          <p className="mt-2 text-sm font-semibold leading-7 text-foreground">
            {claimableYield}
          </p>
        </div>
      </div>
      <div className="rounded-sm border border-line/70 bg-surface/72 px-4 py-3 text-sm leading-7 text-muted-foreground">
        {privateNote}
      </div>
    </SpotlightCard>
  );
}

function LedgerCard({
  title,
  meta,
}: {
  title: string;
  meta: { label: string; value: string }[];
}) {
  return (
    <SpotlightCard className="page-card flex h-full flex-col gap-4 border-line/70 bg-surface/72">
      <h3 className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
        {title}
      </h3>
      <div className="grid gap-px overflow-hidden rounded-md border border-line/70 bg-line/70 sm:grid-cols-2">
        {meta.map((item) => (
          <div key={`${title}-${item.label}`} className="bg-background/52 px-4 py-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              {item.label}
            </p>
            <p className="mt-2 text-sm font-semibold leading-7 text-foreground">
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </SpotlightCard>
  );
}

const credentialToneClasses = {
  primary: "border-primary/20 bg-primary/5",
  gold: "border-gold/20 bg-gold/5",
  muted: "border-line/70 bg-surface/70",
} as const;

export default function CapitalIdentity() {
  const { locale } = useLocale();
  const isEnglish = locale === "en-US";
  const portfolioState = useCapitalPortfolio(locale);
  const {
    intentState,
    executionState,
    trackingState,
    requestIntent,
    sendPreparedIntent,
    refreshIntentTracking,
  } = useCapitalIntentController(locale);
  const portfolio =
    portfolioState.status === "ready" || (portfolioState.status === "error" && portfolioState.data)
      ? portfolioState.data
      : undefined;

  if (!portfolio) {
    return (
      <div className="page-shell pt-20 sm:pt-24">
        <section className="page-section">
          <div className="page-container page-container-narrow">
            {portfolioState.status === "error" ? (
              <InfoCallout
                tone="dark"
                kicker="72H Capital"
                title={isEnglish ? "Portfolio is unavailable." : "组合页当前不可用。"}
                body={isEnglish
                  ? "The current service did not return a verifiable portfolio record. Redeem, yield, and signing actions remain closed until the record is available."
                  : "当前服务没有返回可核对的组合记录。在记录可用前，赎回、收益领取与签名动作保持关闭。"}
                actions={[
                  { label: isEnglish ? "Retry portfolio" : "重新打开组合页", href: "/capital/me", variant: "primary" },
                  { label: isEnglish ? "Browse Capital" : "返回 Capital", href: "/capital" },
                ]}
              />
            ) : (
              <PageLoader />
            )}
          </div>
        </section>
      </div>
    );
  }

  const reserveHolding = portfolio.holdings.find((holding) => parseCapitalSeatKey(holding.key)?.seatType === "reserve");
  const yieldHolding = portfolio.holdings.find((holding) => Boolean(parseCapitalSeatKey(holding.key)));
  const reserveSeat = reserveHolding ? parseCapitalSeatKey(reserveHolding.key) : undefined;
  const yieldSeat = yieldHolding ? parseCapitalSeatKey(yieldHolding.key) : undefined;

  return (
    <div className="page-shell pt-20 sm:pt-24">
      <InfoPageHero
        kicker={portfolio.hero.kicker}
        icon={<Wallet size={30} />}
        title={portfolio.hero.title}
        lead={portfolio.hero.lead}
        noteLabel={portfolio.hero.noteLabel}
        noteTitle={portfolio.hero.noteTitle}
        noteBody={portfolio.hero.noteBody}
        chips={portfolio.hero.chips.map((chip) => (
          <span
            key={chip}
            className="inline-flex items-center rounded-sm border border-line/70 bg-background/30 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground sm:text-xs"
          >
            {chip}
          </span>
        ))}
      />

      <section className="page-section-tight">
        <div className="page-container page-container-wide flex flex-col gap-12 sm:gap-16">
          <CapitalMetricGrid items={portfolio.summaryMetrics} columns={5} />

          <div className="flex flex-col gap-6">
            <CapitalSectionHeading
              eyebrow={isEnglish ? "My seats" : "我的席位"}
              title={isEnglish ? "Active, historical, and completed identity stay in the same portfolio view." : "Active、Historical 与 Completed 身份集中在同一组合页。"}
              body={isEnglish
                ? "Public identity cards remain shareable, while the private layer below each card carries position and yield context."
                : "公开身份卡保持可分享，而卡片下方的私有层则补充持仓与收益信息。"}
            />

            <div className="grid gap-8 xl:grid-cols-2">
              {portfolio.holdings.map((holding) => (
                <div key={holding.key} className="flex flex-col gap-4">
                  <CapitalIdentityCard identity={holding} locale={locale} />
                  <PortfolioSupplement
                    position={holding.position}
                    claimableYield={holding.claimableYield}
                    privateNote={holding.privateNote}
                    isEnglish={isEnglish}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-10 xl:grid-cols-2">
            <div className="flex flex-col gap-6">
              <CapitalSectionHeading
                eyebrow={isEnglish ? "Reserve lots" : "Reserve 批次"}
                title={isEnglish ? "Reserve stays batch-based all the way to redemption." : "Reserve 从追加到赎回都保持批次化管理。"}
              />
              <div className="grid gap-4">
                {portfolio.reserveLots.map((entry) => (
                  <LedgerCard key={entry.title} title={entry.title} meta={entry.meta} />
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <CapitalSectionHeading
                eyebrow={isEnglish ? "Alpha cycles" : "Alpha 周期"}
                title={isEnglish ? "Alpha tracks settlement windows instead of redemption states." : "Alpha 只跟踪结算周期，不出现本金赎回状态。"}
              />
              <div className="grid gap-4">
                {portfolio.alphaCycles.map((entry) => (
                  <LedgerCard key={entry.title} title={entry.title} meta={entry.meta} />
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-10 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="flex flex-col gap-6">
              <CapitalSectionHeading
                eyebrow={isEnglish ? "Credentials" : "Credential"}
                title={isEnglish ? "Credentials describe identity progress, not financial promises." : "Credential 用于描述身份进度，而不是金融承诺。"}
                body={isEnglish
                  ? "The current portfolio keeps allocation, mandate, completion, and network credentials visible without tying them to guaranteed returns."
                  : "当前组合页展示 Allocation、Mandate、Completed 与 Network Credential，但不会把它们绑定为收益承诺。"}
              />

              <div className="grid gap-4 md:grid-cols-2">
                {portfolio.credentials.map((credential) => (
                  <SpotlightCard
                    key={credential.title}
                    className={`page-card flex h-full flex-col gap-4 ${credentialToneClasses[credential.tone]}`}
                  >
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                        {isEnglish ? "Credential" : "Credential"}
                      </p>
                      <h3 className="mt-3 text-xl font-bold tracking-tight text-foreground">
                        {credential.title}
                      </h3>
                    </div>
                    <p className="text-sm leading-7 text-muted-foreground">
                      {credential.body}
                    </p>
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary/70">
                      {credential.achievedOn}
                    </p>
                  </SpotlightCard>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <CapitalSectionHeading
                eyebrow={isEnglish ? "Action boundary" : "动作边界"}
                title={isEnglish ? "Redeem and yield requests are review-only until signing opens." : "赎回与收益请求仅供核对，正式开放前暂不可签名。"}
                body={isEnglish
                  ? "Portfolio actions can prepare a wallet-aware record for review. Reserve redemption and yield claim cannot be signed or submitted on-chain until the official contract flow is live."
                  : "组合页动作可生成带钱包上下文的核对记录。Reserve 赎回与收益领取在正式合约流程开放前不可签名，也不可链上提交。"}
              />

              <SpotlightCard className="page-card page-card-lg flex flex-col gap-4 border-line/70 bg-surface/78">
                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    className="page-action"
                    disabled={!reserveSeat}
                    onClick={() => {
                      if (!reserveSeat) return;
                      void requestIntent("reserve.redeem", {
                        appSlug: reserveSeat.appSlug,
                        seatType: "reserve",
                        seatNumber: reserveSeat.seatNumber,
                        amount: 720,
                      });
                    }}
                  >
                    {isEnglish ? "Request Reserve Redemption" : "请求 Reserve 赎回"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    className="page-action-muted"
                    disabled={!yieldSeat}
                    onClick={() => {
                      if (!yieldSeat) return;
                      void requestIntent("yield.claim", {
                        appSlug: yieldSeat.appSlug,
                        seatType: yieldSeat.seatType,
                        seatNumber: yieldSeat.seatNumber,
                      });
                    }}
                  >
                    {isEnglish ? "Request Yield Claim" : "请求收益领取"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </button>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-sm border border-line/70 bg-background/42 px-4 py-3 text-sm leading-7 text-muted-foreground">
                    {reserveSeat
                      ? `${reserveSeat.appSlug} / Reserve / #${reserveSeat.seatNumber}`
                      : isEnglish
                        ? "No Reserve seat is available in the current portfolio sample."
                        : "当前组合样例中没有可用的 Reserve 席位。"}
                  </div>
                  <div className="rounded-sm border border-line/70 bg-background/42 px-4 py-3 text-sm leading-7 text-muted-foreground">
                    {yieldSeat
                      ? `${yieldSeat.appSlug} / ${yieldSeat.seatType} / #${yieldSeat.seatNumber}`
                      : isEnglish
                        ? "No claimable seat is available in the current portfolio sample."
                        : "当前组合样例中没有可发起收益领取的席位。"}
                  </div>
                </div>
              </SpotlightCard>

              <CapitalIntentConsole
                locale={locale}
                state={intentState}
                executionState={executionState}
                trackingState={trackingState}
                onSend={() => {
                  void sendPreparedIntent();
                }}
                onRefresh={() => {
                  if (intentState.status !== "ready") return;
                  void refreshIntentTracking(intentState.response.intentId);
                }}
              />

              <CapitalSectionHeading
                eyebrow={isEnglish ? "Invite status" : "邀请状态"}
                title={isEnglish ? "Network progress remains identity-only." : "邀请进度只影响身份层，不进入金融层。"}
              />
              <CapitalMetricGrid items={portfolio.inviteMetrics} columns={3} />
              <CapitalWalletPanel locale={locale} />

              <SpotlightCard className="page-card page-card-lg flex flex-col gap-5 border-line/70 bg-surface/78">
                <CapitalSectionHeading
                  eyebrow={isEnglish ? "Share card" : "分享卡"}
                  title={isEnglish ? "Keep one identity card ready for verification and distribution." : "保留一张可直接用于验证与传播的身份卡。"}
                  body={isEnglish
                    ? "The share card stays amount-private and points directly to its verification route."
                    : "分享卡保持金额私有，并直接指向公开验证页。"}
                />

                <CapitalIdentityCard identity={portfolio.shareCard} locale={locale} compact />

                <div className="flex flex-col gap-3 sm:flex-row">
                  {portfolio.shareActions.map((action) => (
                    <Link
                      key={`${action.label}-${action.href}`}
                      to={action.href}
                      className={action.variant === "primary" ? "page-action flex-1" : "page-action-muted flex-1"}
                    >
                      {action.label}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  ))}
                </div>
              </SpotlightCard>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
