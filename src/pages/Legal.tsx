import { useParams } from "react-router-dom";
import { FileText, Scale, ShieldAlert } from "lucide-react";
import { LocalizedLink as Link } from "../components/LocalizedLink";
import { InfoCallout } from "../components/InfoCallout";
import { InfoPageHero } from "../components/InfoPageHero";
import { SpotlightCard } from "../components/SpotlightCard";
import { getLegalDoc } from "../lib/content";
import { getSiteConfig } from "../content/site-config";
import { useLocale } from "../lib/locale";

const ICONS = {
  shield: <ShieldAlert size={22} />,
  file: <FileText size={22} />,
  scale: <Scale size={22} />,
} as const;

export default function Legal() {
  const { slug } = useParams();
  const { locale } = useLocale();
  const isEnglish = locale === "en-US";
  const doc = getLegalDoc(locale, slug);
  const siteConfig = getSiteConfig(locale);

  if (!doc) {
    return (
      <div className="page-shell pt-20 sm:pt-24">
        <section className="page-hero border-b border-line/70 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,0.08)_0,transparent_42%),linear-gradient(to_bottom,rgba(255,255,255,0.03),transparent_42%)]" />
          <div className="page-container page-container-narrow relative z-10">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(18rem,0.82fr)] lg:items-end">
              <div className="flex flex-col gap-4">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary/10 text-primary flex items-center justify-center rounded-sm shadow-[0_0_20px_rgba(34,197,94,0.15)]">
                  <ShieldAlert size={30} />
                </div>
                <div className="page-kicker w-fit">{isEnglish ? "Legal" : "法律说明"}</div>
                <h1 className="page-title page-title-compact max-w-[10ch]">
                  {isEnglish ? "Note not found." : "说明不存在。"}
                </h1>
                <p className="page-lead max-w-2xl">{isEnglish ? "This address is missing or has moved." : "这个地址已缺失或已迁移。"}</p>
              </div>

              <SpotlightCard className="page-card page-card-lg border-line/70 bg-surface/72 flex flex-col gap-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-primary/60">
                  {isEnglish ? "Suggested entries" : "建议入口"}
                </p>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                  {isEnglish ? "Choose a valid note." : "请选择有效说明。"}
                </h2>
                <p className="text-sm sm:text-base leading-relaxed text-muted-foreground">
                  {isEnglish ? "Legal notes sit with the official entries." : "法律说明随官方入口一并提供。"}
                </p>
                <div className="page-chip-row pt-1">
                  <Link to="/" className="page-action-muted">
                    {isEnglish ? "Back home" : "返回首页"}
                  </Link>
                  <Link to="/join" className="page-action-muted">
                    {isEnglish ? "Join community" : "加入社区"}
                  </Link>
                </div>
              </SpotlightCard>
            </div>
          </div>
        </section>

        <section className="page-section-tight pb-20 sm:pb-28">
          <div className="page-container page-container-narrow">
            <InfoCallout
              tone="dark"
              kicker={isEnglish ? "Boundary notes" : "边界说明"}
              title={isEnglish ? "Legal notes define scope and boundaries." : "法律说明定义范围与边界。"}
              body={isEnglish ? "Legal notes define the boundary only." : "法律说明只界定边界。"}
              actions={[
                { label: isEnglish ? "Back home" : "返回首页", href: "/", variant: "primary" },
                { label: isEnglish ? "Join community" : "加入社区", href: "/join" },
              ]}
              align="center"
            />
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="page-shell pt-20 sm:pt-24">
      <InfoPageHero
        kicker={isEnglish ? "Legal" : "法律说明"}
        icon={ICONS[doc.icon]}
        title={doc.title}
        lead={doc.intro}
        noteLabel={isEnglish ? "Site note" : "站点说明"}
        noteTitle={siteConfig.siteName}
        noteBody={doc.summary}
        chips={[
          `${isEnglish ? "Effective" : "生效"} ${doc.effectiveDate}`,
          doc.version ?? "v1",
          siteConfig.siteName,
        ].map((label) => (
          <span
            key={label}
            className="inline-flex items-center rounded-sm border border-line/70 bg-background/30 px-3 py-2 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground"
          >
            {label}
          </span>
        ))}
      />

      <section className="page-section">
        <div className="page-container page-container-narrow flex flex-col gap-5 sm:gap-8">
          <div className="overflow-hidden rounded-md border border-line/70 bg-surface/18">
            {doc.sections.map((section, index) => (
              <article
                key={section.heading}
                className={`grid gap-4 p-5 sm:p-6 lg:p-7 ${
                  index !== doc.sections.length - 1 ? "border-b border-line/70" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-primary/60">
                    0{index + 1}
                  </span>
                  <h2 className="text-lg sm:text-2xl font-bold tracking-tight">{section.heading}</h2>
                </div>
                <p className="text-sm sm:text-base text-muted-foreground font-light leading-relaxed max-w-3xl">
                  {section.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="page-section-tight pb-20 sm:pb-28">
        <div className="page-container page-container-narrow">
          <InfoCallout
            tone="dark"
            kicker={isEnglish ? "Boundary notes" : "边界说明"}
            title={isEnglish ? "Legal notes define scope and boundaries." : "法律说明定义范围与边界。"}
            body={isEnglish ? "Legal notes define the boundary only." : "法律说明只界定边界。"}
            actions={[
              { label: isEnglish ? "Join community" : "加入社区", href: "/join", variant: "primary" },
              { label: isEnglish ? "Browse ecosystem" : "看生态", href: "/ecosystem" },
            ]}
          />
        </div>
      </section>
    </div>
  );
}
