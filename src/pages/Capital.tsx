import { ArrowRight, CircleDollarSign, Landmark, ShieldAlert, Wallet } from "lucide-react";
import { InfoCallout } from "../components/InfoCallout";
import { LocalizedLink as Link } from "../components/LocalizedLink";
import { PageLoader } from "../components/PageLoader";
import { Reveal } from "../components/Reveal";
import { SpotlightCard } from "../components/SpotlightCard";
import { CapitalBrandMark } from "../components/capital/CapitalBrandMark";
import { CapitalWalletPanel } from "../components/capital/CapitalWalletPanel";
import { useLocale } from "../lib/locale";
import { useCapitalOverview } from "../lib/use-capital-data";

export default function Capital() {
  const { locale } = useLocale();
  const isEnglish = locale === "en-US";
  const overviewState = useCapitalOverview(locale);
  const overview =
    overviewState.status === "ready" || (overviewState.status === "error" && overviewState.data)
      ? overviewState.data
      : undefined;

  if (!overview) {
    return (
      <div className="page-shell pt-20 sm:pt-24">
        <section className="page-section">
          <div className="page-container page-container-narrow">
            {overviewState.status === "error" ? (
              <InfoCallout
                tone="dark"
                kicker="72H Capital"
                title={isEnglish ? "Capital is temporarily unavailable." : "Capital 当前暂不可用。"}
                body={isEnglish
                  ? "The current Capital overview did not return valid public data. Seat actions remain unavailable until the service returns a verified state."
                  : "当前 Capital 概览没有返回有效公开数据。在服务返回可核对状态前，席位动作保持不可用。"}
                actions={[
                  { label: isEnglish ? "Retry Capital" : "重新打开 Capital", href: "/capital", variant: "primary" },
                  { label: isEnglish ? "Browse ecosystem" : "返回生态", href: "/ecosystem" },
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

  return (
    <div className="page-shell pt-20 sm:pt-24">
      <section className="page-section-tight border-b border-line/70 pt-4 sm:pt-10">
        <div className="page-container page-container-wide grid gap-5 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-end">
          <div>
            <div className="page-kicker w-fit">{overview.hero.kicker}</div>
            <h1 className="mt-5 max-w-4xl text-[2.55rem] font-black leading-[0.98] tracking-normal text-foreground sm:text-6xl">
              {isEnglish ? "Review Capital status." : "查看 Capital 状态。"}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
              {overview.hero.lead}
            </p>
            <div className="mt-4 max-w-3xl rounded-sm border border-gold/25 bg-gold/8 px-4 py-3 text-sm leading-7 text-foreground/88">
              {isEnglish
                ? "Current status: no 72H purchase, no SeasonClaim claim, and no real Capital seat configuration is open on this site."
                : "当前状态：本站不可购买 72H，不可领取 SeasonClaim，也不可配置真实 Capital 席位。"}
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {overview.hero.chips.map((chip) => (
                <span
                  key={chip}
                  className="inline-flex min-h-9 items-center rounded-sm border border-line/70 bg-background/48 px-3 text-xs font-semibold text-foreground"
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-md border border-line/70 bg-surface/72 p-4 shadow-[0_24px_90px_rgba(0,0,0,0.2)] sm:p-5">
            <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-primary/70">
              {isEnglish ? "Capital status" : "Capital 状态"}
            </div>
            <div className="mt-4 grid gap-2">
              {[
                { icon: <Wallet className="h-4 w-4" />, label: isEnglish ? "Connect wallet" : "连接钱包" },
                { icon: <Landmark className="h-4 w-4" />, label: isEnglish ? "Reserve not configurable" : "Reserve 暂不可配置" },
                { icon: <CircleDollarSign className="h-4 w-4" />, label: isEnglish ? "Alpha closed" : "Alpha 暂不开放" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3 rounded-sm border border-line/70 bg-background/42 px-3 py-3 text-sm font-semibold text-foreground">
                  <span className="text-primary">{item.icon}</span>
                  {item.label}
                </div>
              ))}
            </div>
            <div className="mt-4 grid gap-2">
              <Link to="/capital/72hours" className="page-action w-full">
                {isEnglish ? "View 72hours status" : "查看 72hours 状态"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link to="/capital/me" className="page-action-muted w-full">
                {isEnglish ? "My Capital" : "我的 Capital"}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="page-section-tight pb-6 sm:pb-12">
        <div className="page-container page-container-wide grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-5">
          {overview.summaryMetrics.map((metric) => (
            <Reveal key={metric.label}>
              <SpotlightCard className="page-card flex h-full flex-col gap-2 border-line/70 bg-surface/72 p-4 sm:gap-3 sm:p-5">
                <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground sm:text-[10px] sm:tracking-[0.24em]">
                  {metric.label}
                </div>
                <div className="text-xl font-black tracking-normal text-foreground sm:text-2xl">{metric.value}</div>
                {metric.hint ? <div className="hidden text-xs leading-6 text-muted-foreground sm:block">{metric.hint}</div> : null}
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="page-section-tight pt-0">
        <div className="page-container page-container-wide grid gap-5 lg:grid-cols-2">
          {overview.programs.map((program) => (
            <Reveal key={program.type}>
              <SpotlightCard
                className={`page-card page-card-lg flex h-full flex-col gap-3 border-line/70 bg-surface/72 p-4 sm:gap-5 sm:p-6 ${
                  program.tone === "gold"
                    ? "border-gold/20 bg-[linear-gradient(180deg,rgba(191,165,92,0.05),rgba(15,20,18,0.72))]"
                    : ""
                }`}
              >
                <div className={`flex items-center gap-3 ${program.tone === "gold" ? "text-gold" : "text-primary"}`}>
                  <ShieldAlert className="h-5 w-5" />
                  <span className="font-mono text-[10px] uppercase tracking-[0.24em]">{program.formalLabel}</span>
                </div>
                <h2 className="text-xl font-black tracking-normal text-foreground sm:text-3xl">{program.title}</h2>
                <p className="line-clamp-2 text-sm leading-6 text-muted-foreground sm:line-clamp-none sm:text-base sm:leading-8">{program.body}</p>
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  {program.metrics.map((metric) => (
                    <div key={metric.label} className="rounded-sm border border-line/70 bg-background/42 px-3 py-2.5 sm:px-4 sm:py-3">
                      <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground sm:text-[10px] sm:tracking-[0.2em]">{metric.label}</div>
                      <div className="mt-1.5 text-xs font-semibold text-foreground sm:mt-2 sm:text-sm">{metric.value}</div>
                    </div>
                  ))}
                </div>
                <div className="hidden gap-3 sm:grid">
                  {program.bullets.map((bullet) => (
                    <div key={bullet} className="rounded-sm border border-line/70 bg-background/42 px-4 py-3 text-sm leading-7 text-foreground/88">
                      {bullet}
                    </div>
                  ))}
                </div>
                <div className="hidden rounded-sm border border-gold/20 bg-gold/8 px-4 py-3 sm:block">
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold">
                    {isEnglish ? "Risk disclosure" : "风险披露"}
                  </div>
                  <p className="mt-2 text-sm leading-7 text-foreground/86">{program.riskDisclosure}</p>
                </div>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="page-section-tight pt-0">
        <div className="page-container page-container-wide grid gap-5 xl:grid-cols-3">
          {overview.apps.map((app) => (
            <Reveal key={app.slug}>
              <SpotlightCard className="page-card flex h-full flex-col gap-3 border-line/70 bg-surface/72 p-4 sm:gap-5 sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <CapitalBrandMark brand={app.brand} size="md" />
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-gold/80">{app.statusLabel}</p>
                      <h2 className="mt-1.5 text-2xl font-black tracking-normal text-foreground sm:mt-2 sm:text-3xl">{app.name}</h2>
                    </div>
                  </div>
                  <span className="inline-flex min-h-8 items-center rounded-sm border border-line/70 bg-background/48 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-foreground">
                    {app.riskBand}
                  </span>
                </div>
                <p className="line-clamp-2 text-sm leading-6 text-muted-foreground sm:line-clamp-none sm:leading-7">{app.summary}</p>
                <div className="grid gap-2 border-y border-line/70 py-3 sm:gap-3 sm:py-4">
                  {app.metrics.map((metric) => (
                    <div key={metric.label} className="flex items-center justify-between gap-4 text-xs sm:text-sm">
                      <span className="text-muted-foreground">{metric.label}</span>
                      <span className="font-semibold text-foreground">{metric.value}</span>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex min-h-8 items-center rounded-sm border border-primary/20 bg-primary/10 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
                    {app.reserveLabel}
                  </span>
                  <span className="inline-flex min-h-8 items-center rounded-sm border border-gold/20 bg-gold/10 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-gold">
                    {app.alphaLabel}
                  </span>
                </div>
                <div className="mt-auto flex flex-wrap gap-3">
                  <Link to={app.detailHref} className="page-action w-full sm:w-auto">
                    {isEnglish ? "Open Capital page" : "进入 Capital 页面"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                  <Link to={app.verifyHref} className="page-action-muted hidden sm:inline-flex">
                    {isEnglish ? "View verification" : "查看验证页"}
                  </Link>
                </div>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="page-section-tight pt-0">
        <div className="page-container page-container-wide grid gap-5 lg:grid-cols-[1.02fr_0.98fr]">
          <div className="hidden sm:block">
            <Reveal>
              <CapitalWalletPanel locale={locale} />
            </Reveal>
          </div>
          <Reveal>
            <InfoCallout
              kicker={overview.portfolioCallout.kicker}
              title={overview.portfolioCallout.title}
              body={overview.portfolioCallout.body}
              actions={overview.portfolioCallout.actions}
            />
          </Reveal>
        </div>
      </section>
    </div>
  );
}
