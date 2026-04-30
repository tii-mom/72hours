import { AlertTriangle, ArrowRight, ExternalLink, Fingerprint, Landmark, Wallet } from "lucide-react";
import { useParams } from "react-router-dom";
import { InfoCallout } from "../components/InfoCallout";
import { LocalizedLink as Link } from "../components/LocalizedLink";
import { PageLoader } from "../components/PageLoader";
import { SpotlightCard } from "../components/SpotlightCard";
import { CapitalIdentityCard } from "../components/capital/CapitalIdentityCard";
import { CapitalIntentConsole } from "../components/capital/CapitalIntentConsole";
import { CapitalMetricGrid } from "../components/capital/CapitalMetricGrid";
import { CapitalSectionHeading } from "../components/capital/CapitalSectionHeading";
import { CapitalSeatPanel } from "../components/capital/CapitalSeatPanel";
import { isCapitalAppSlug } from "../content/capital";
import { getDefaultSeatAmount72H, useCapitalIntentController } from "../lib/capital-intents";
import { useLocale } from "../lib/locale";
import { useCapitalAppPage } from "../lib/use-capital-data";

function ActionLink({
  href,
  label,
  external,
}: {
  href: string;
  label: string;
  external?: boolean;
}) {
  return external ? (
    <a href={href} target="_blank" rel="noreferrer" className="page-action">
      {label}
      <ExternalLink className="ml-2 h-4 w-4" />
    </a>
  ) : (
    <Link to={href} className="page-action">
      {label}
      <ArrowRight className="ml-2 h-4 w-4" />
    </Link>
  );
}

function TierCard({
  title,
  eyebrow,
  items,
}: {
  title: string;
  eyebrow: string;
  items: { label: string; threshold: string; note: string }[];
}) {
  return (
    <SpotlightCard className="page-card flex h-full flex-col gap-5 border-line/70 bg-surface/72">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-primary/70">
          {eyebrow}
        </p>
        <h3 className="mt-3 text-2xl font-bold tracking-tight text-foreground">
          {title}
        </h3>
      </div>

      <div className="grid gap-px overflow-hidden rounded-md border border-line/70 bg-line/70">
        {items.map((item) => (
          <div key={item.label} className="bg-background/55 px-4 py-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-semibold text-foreground sm:text-base">{item.label}</p>
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-primary/70">
                {item.threshold}
              </p>
            </div>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              {item.note}
            </p>
          </div>
        ))}
      </div>
    </SpotlightCard>
  );
}

function MissingCapitalApp({ isEnglish }: { isEnglish: boolean }) {
  return (
    <div className="page-shell pt-20 sm:pt-24">
      <section className="page-section">
        <div className="page-container page-container-narrow">
          <InfoCallout
            tone="dark"
            kicker="72H Capital"
            title={isEnglish ? "This Capital page is unavailable." : "该 Capital 页面暂不可用。"}
            body={isEnglish
              ? "This application is not included in the current public Capital release."
              : "当前公开 Capital 批次中不包含该应用。"}
            actions={[
              { label: isEnglish ? "Browse Capital" : "返回 Capital", href: "/capital", variant: "primary" },
              { label: isEnglish ? "Open My Capital" : "打开我的 Capital", href: "/capital/me" },
            ]}
          />
        </div>
      </section>
    </div>
  );
}

export default function CapitalApp() {
  const { locale } = useLocale();
  const isEnglish = locale === "en-US";
  const { slug } = useParams();
  const {
    intentState,
    executionState,
    trackingState,
    requestIntent,
    sendPreparedIntent,
    refreshIntentTracking,
  } = useCapitalIntentController(locale);

  if (!isCapitalAppSlug(slug)) {
    return <MissingCapitalApp isEnglish={isEnglish} />;
  }

  const appState = useCapitalAppPage(locale, slug);

  if (appState.status === "missing") {
    return <MissingCapitalApp isEnglish={isEnglish} />;
  }

  const app =
    appState.status === "ready" || (appState.status === "error" && appState.data)
      ? appState.data
      : undefined;

  if (!app) {
    return (
      <div className="page-shell pt-20 sm:pt-24">
        <section className="page-section">
          <div className="page-container page-container-narrow">
            {appState.status === "error" ? (
              <InfoCallout
                tone="dark"
                kicker="72H Capital"
                title={isEnglish ? "This Capital page failed to load." : "这个 Capital 页面加载失败。"}
                body={isEnglish
                  ? "This application route is valid, but the current service did not return a verifiable Capital record. Seat actions remain closed until the record is available."
                  : "该应用路由有效，但当前服务没有返回可核对的 Capital 记录。在记录可用前，席位动作保持关闭。"}
                actions={[
                  { label: isEnglish ? "Retry Capital page" : "重新打开页面", href: `/capital/${slug}`, variant: "primary" },
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

  return (
    <div className="page-shell pt-20 sm:pt-24">
      <section className="page-section-tight border-b border-line/70 pt-4 sm:pt-10">
        <div className="page-container page-container-wide grid gap-5 lg:grid-cols-[minmax(0,1fr)_23rem] lg:items-end">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-sm border border-primary/25 bg-primary/10 text-primary">
                <Fingerprint size={24} />
              </div>
              <div className="page-kicker w-fit">{app.hero.kicker}</div>
            </div>
            <h1 className="mt-5 max-w-4xl text-[2.55rem] font-black leading-[0.98] tracking-normal text-foreground sm:text-6xl">
              {app.name} {isEnglish ? "reference page" : "参考页"}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
              {app.hero.lead}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {app.hero.chips.map((chip) => (
                <span
                  key={chip}
                  className="inline-flex items-center rounded-sm border border-line/70 bg-background/30 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground sm:text-xs"
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-md border border-line/70 bg-surface/72 p-4 shadow-[0_24px_90px_rgba(0,0,0,0.2)] sm:p-5">
            <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-primary/70">
              {isEnglish ? "Current boundary" : "当前边界"}
            </div>
            <div className="mt-4 grid gap-2">
              <button
                type="button"
                disabled
                className="page-action w-full cursor-not-allowed opacity-60"
              >
                <Landmark className="mr-2 h-4 w-4" />
                {isEnglish ? "No seat setup" : "无席位配置"}
              </button>
              <button
                type="button"
                disabled
                className="page-action-muted w-full cursor-not-allowed opacity-60"
              >
                <AlertTriangle className="mr-2 h-4 w-4" />
                {isEnglish ? "No on-chain action" : "无链上动作"}
              </button>
              <Link to="/ecosystem" className="page-action-muted w-full">
                <Wallet className="mr-2 h-4 w-4" />
                {isEnglish ? "Back to ecosystem" : "返回生态应用"}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="page-section-tight">
        <div className="page-container page-container-wide flex flex-col gap-12 sm:gap-16">
          <CapitalMetricGrid items={app.overviewMetrics} columns={3} />

          <div className="grid gap-6 lg:grid-cols-[0.94fr_1.06fr]">
            <SpotlightCard className="page-card page-card-lg border-l-4 !border-l-primary bg-primary/5">
              <CapitalSectionHeading
                eyebrow={isEnglish ? "Positioning" : "定位"}
                title={isEnglish ? "What this reference page emphasizes." : "这个参考页的重点。"}
                body={isEnglish
                  ? "This page summarizes historical/illustrative Capital rules and keeps every wallet, setup, and claim action closed for ordinary visitors."
                  : "本页只汇总历史/示例性的 Capital 规则；普通访客不可在这里配置席位、连接动作或领取奖励。"}
              />

              <div className="mt-6 grid gap-3">
                {app.highlights.map((highlight) => (
                  <div
                    key={highlight}
                    className="rounded-sm border border-line/70 bg-background/38 px-4 py-3 text-sm leading-7 text-foreground/88"
                  >
                    {highlight}
                  </div>
                ))}
              </div>
            </SpotlightCard>

            <SpotlightCard className="page-card page-card-lg flex flex-col gap-5 border-line/70 bg-surface/78">
              <CapitalSectionHeading
                eyebrow={isEnglish ? "Application entry" : "应用入口"}
                title={isEnglish ? "Open the application or read the boundary." : "打开应用主场，或阅读边界说明。"}
                body={isEnglish
                  ? "The application entry stays separate from the seat identity layer. Capital remains a read-only reference layer on the public site; use the application entry for non-Capital product usage."
                  : "应用主场与席位身份层保持分离。官网上的 Capital 仅为只读参考层；非 Capital 的实际产品使用请从应用入口进入。"}
              />

              <div className="rounded-md border border-line/70 bg-background/45 p-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                  {isEnglish ? "Entry action" : "入口动作"}
                </p>
                <div className="mt-4">
                  <ActionLink
                    href={app.surfaceAction.href}
                    label={app.surfaceAction.label}
                    external={app.surfaceAction.external}
                  />
                </div>
              </div>

              <div className="rounded-md border border-line/70 bg-background/45 p-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                  {app.policyNote.eyebrow}
                </p>
                <h3 className="mt-3 text-xl font-bold tracking-tight text-foreground">
                  {app.policyNote.title}
                </h3>
                {app.policyNote.body ? (
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    {app.policyNote.body}
                  </p>
                ) : null}
              </div>
            </SpotlightCard>
          </div>

          <details className="rounded-md border border-line/70 bg-surface/42 p-4 sm:p-5">
            <summary className="cursor-pointer text-base font-black text-foreground sm:text-lg">
              {isEnglish ? "Advanced Capital rule reference (closed by default)" : "Capital 进阶规则参考（默认折叠）"}
            </summary>
            <div className="mt-6 flex flex-col gap-12 sm:gap-16">
          <div className="flex flex-col gap-6">
            <CapitalSectionHeading
              eyebrow={isEnglish ? "Advanced reference" : "进阶参考"}
              title={isEnglish ? "Reserve and Alpha details are folded by default." : "Reserve 与 Alpha 细节默认折叠。"}
              body={isEnglish
                ? "These details are kept for reviewers who need rule context; they are not an offer, purchase page, or setup flow."
                : "这些细节仅供需要核对规则的人阅读；不是购买页、报价页或配置流程。"}
            />

            <div className="grid gap-6 xl:grid-cols-2">
              <CapitalSeatPanel
                program={app.reserveProgram}
                locale={locale}
                primaryAction={{
                  label: isEnglish ? "Reserve not open" : "Reserve 暂不开放",
                  disabled: true,
                  onClick: () =>
                    requestIntent("reserve.allocate", {
                      appSlug: app.slug,
                      seatType: "reserve",
                      amount: getDefaultSeatAmount72H(app.slug, "reserve"),
                    }),
                }}
              />
              <CapitalSeatPanel
                program={app.alphaProgram}
                locale={locale}
                primaryAction={{
                  label: isEnglish ? "Alpha closed for v1" : "Alpha v1 暂不开放",
                  disabled: true,
                  onClick: () =>
                    requestIntent("alpha.allocate", {
                      appSlug: app.slug,
                      seatType: "alpha",
                      amount: getDefaultSeatAmount72H(app.slug, "alpha"),
                    }),
                }}
              />
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <CapitalSectionHeading
              eyebrow={isEnglish ? "Action boundary" : "动作边界"}
              title={isEnglish ? "Capital seat actions open only after the official signing window." : "Capital 席位动作将在官方签名窗口开放后启用。"}
              body={isEnglish
                ? "This page is currently for status review. TON contract signing and on-chain submission will only open after the official release."
                : "本页当前用于状态核对。Capital 席位配置、TON 签名与链上提交只会在官方开放后启用。"}
            />

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
          </div>

          <div className="flex flex-col gap-6">
            <CapitalSectionHeading
              eyebrow={isEnglish ? "Seat ladder" : "席位等级"}
              title={isEnglish ? "Tier labels remain explicit and threshold-driven." : "席位等级以明确门槛驱动，不使用模糊叙述。"}
              body={isEnglish
                ? "Reserve uses the same 720-based ladder across every application. Alpha tiers scale directly from the application's own Alpha threshold."
                : "Reserve 在所有应用中共享同一套 720 级别阶梯。Alpha 则直接按该应用自身的 Alpha 门槛倍数递进。"}
            />

            <div className="grid gap-6 xl:grid-cols-2">
              <TierCard
                eyebrow={isEnglish ? "Reserve tiers" : "Reserve 等级"}
                title={isEnglish ? "Reserve ladder" : "Reserve 梯度"}
                items={app.reserveTiers}
              />
              <TierCard
                eyebrow={isEnglish ? "Alpha tiers" : "Alpha 等级"}
                title={isEnglish ? "Alpha ladder" : "Alpha 梯度"}
                items={app.alphaTiers}
              />
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <CapitalSectionHeading
              eyebrow={isEnglish ? "Identity review" : "身份核对"}
              title={isEnglish ? "Each application keeps Reserve and Alpha verification pages." : "每个应用都同时展示 Reserve 与 Alpha 验证页。"}
              body={isEnglish
                ? "Identity cards are English-first on the title line, with Chinese support text underneath, matching the sharing spec."
                : "身份卡片主标题保持英文，副标题提供中文说明，以符合分享传播规范。"}
            />

            <div className="grid gap-6 xl:grid-cols-2">
              {app.showcaseSeats.map((seat) => (
                <CapitalIdentityCard key={seat.key} identity={seat} locale={locale} />
              ))}
            </div>
          </div>

          <InfoCallout
            tone="dark"
            kicker={app.policyNote.eyebrow}
            title={app.policyNote.title}
            body={app.policyNote.body ?? ""}
            actions={[
              {
                label: app.surfaceAction.label,
                href: app.surfaceAction.href,
                external: app.surfaceAction.external,
                variant: "primary",
              },
              {
                label: isEnglish ? "Back to ecosystem" : "返回生态应用",
                href: "/ecosystem",
              },
            ]}
          />
            </div>
          </details>
        </div>
      </section>
    </div>
  );
}
