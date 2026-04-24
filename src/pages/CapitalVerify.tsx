import { ArrowRight, BadgeCheck } from "lucide-react";
import { useParams } from "react-router-dom";
import { InfoCallout } from "../components/InfoCallout";
import { InfoPageHero } from "../components/InfoPageHero";
import { LocalizedLink as Link } from "../components/LocalizedLink";
import { PageLoader } from "../components/PageLoader";
import { SpotlightCard } from "../components/SpotlightCard";
import { CapitalIdentityCard } from "../components/capital/CapitalIdentityCard";
import { CapitalMetricGrid } from "../components/capital/CapitalMetricGrid";
import { CapitalSectionHeading } from "../components/capital/CapitalSectionHeading";
import { isCapitalAppSlug } from "../content/capital";
import { useLocale } from "../lib/locale";
import { useCapitalVerification } from "../lib/use-capital-data";

function MissingVerification({ isEnglish }: { isEnglish: boolean }) {
  return (
    <div className="page-shell pt-20 sm:pt-24">
      <section className="page-section">
        <div className="page-container page-container-narrow">
          <InfoCallout
            tone="dark"
            kicker="72H Capital"
            title={isEnglish ? "This verification record was not found." : "未找到对应的验证记录。"}
            body={isEnglish
              ? "The application, seat type, or seat number is not part of the current public Capital records."
              : "当前公开 Capital 记录中不存在对应的应用、席位类型或编号。"}
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

export default function CapitalVerify() {
  const { locale } = useLocale();
  const isEnglish = locale === "en-US";
  const { slug, type, seatNumber } = useParams();

  if (!isCapitalAppSlug(slug) || (type !== "reserve" && type !== "alpha")) {
    return <MissingVerification isEnglish={isEnglish} />;
  }

  const seatId = Number(seatNumber);

  if (!Number.isInteger(seatId) || seatId <= 0) {
    return <MissingVerification isEnglish={isEnglish} />;
  }

  const verificationState = useCapitalVerification(locale, slug, type, seatId);

  if (verificationState.status === "missing") {
    return <MissingVerification isEnglish={isEnglish} />;
  }

  const verification =
    verificationState.status === "ready" ||
    (verificationState.status === "error" && verificationState.data)
      ? verificationState.data
      : undefined;

  if (!verification) {
    return (
      <div className="page-shell pt-20 sm:pt-24">
        <section className="page-section">
          <div className="page-container page-container-narrow">
            {verificationState.status === "error" ? (
              <InfoCallout
                tone="dark"
                kicker="72H Capital"
                title={isEnglish ? "The verification surface failed to load." : "验证页加载失败。"}
                body={isEnglish
                  ? "The route is valid, but the current service did not return a public verification record for this seat."
                  : "当前路由有效，但服务没有返回该席位的公开验证记录。"}
                actions={[
                  { label: isEnglish ? "Retry verification" : "重新打开验证页", href: `/capital/${slug}/${type}/${seatId}`, variant: "primary" },
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
      <InfoPageHero
        kicker={verification.hero.kicker}
        icon={<BadgeCheck size={30} />}
        title={verification.hero.title}
        lead={verification.hero.lead}
        noteLabel={verification.hero.noteLabel}
        noteTitle={verification.hero.noteTitle}
        noteBody={verification.hero.noteBody}
        chips={verification.hero.chips.map((chip) => (
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
          <div className="grid gap-6 xl:grid-cols-[1fr_0.96fr]">
            <CapitalIdentityCard identity={verification.seat} locale={locale} />

            <div className="flex flex-col gap-6">
              <SpotlightCard className="page-card page-card-lg flex flex-col gap-5 border-line/70 bg-surface/78">
                <CapitalSectionHeading
                  eyebrow={isEnglish ? "Public seat record" : "公开席位记录"}
                  title={isEnglish ? "Only public identity data appears here." : "此页只展示公开身份数据。"}
                  body={isEnglish
                    ? "The verification page confirms application, seat type, sequence, current state, wallet alias, date, and transaction reference."
                    : "验证页只确认应用、席位类型、编号顺序、当前状态、钱包别名、日期与交易引用。"}
                />
                <CapitalMetricGrid items={verification.publicMetrics} columns={2} compact />
              </SpotlightCard>

              <SpotlightCard className="page-card page-card-lg flex flex-col gap-5 border-line/70 bg-background/46">
                <CapitalSectionHeading
                  eyebrow={verification.riskNote.eyebrow}
                  title={verification.riskNote.title}
                  body={verification.riskNote.body}
                />

                <div className="flex flex-col gap-3 sm:flex-row">
                  {verification.actions.map((action) => (
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
