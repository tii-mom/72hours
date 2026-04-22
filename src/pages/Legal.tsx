import { Link, useParams } from "react-router-dom";
import { ShieldAlert, FileText, Scale } from "lucide-react";
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
      <div className="page-shell items-center justify-center px-5 sm:px-8 lg:px-16 py-20 sm:py-24">
        <SpotlightCard className="page-card page-card-lg max-w-xl text-center flex flex-col gap-4">
          <h1 className="page-title page-title-compact">{isEnglish ? "Page not found." : "页面不存在。"}</h1>
          <p className="page-lead">{isEnglish ? "Return home, or check the notes." : "先返回首页，或看说明。"}</p>
          <div className="page-chip-row justify-center pt-2">
            <Link to="/" className="inline-flex px-5 py-3 bg-primary text-primary-foreground text-xs sm:text-sm font-bold tracking-widest uppercase rounded-sm">
              {isEnglish ? "Back home" : "返回首页"}
            </Link>
            <Link to="/join" className="inline-flex px-5 py-3 border border-white/10 text-foreground text-xs sm:text-sm font-bold tracking-widest uppercase rounded-sm">
              {isEnglish ? "Join community" : "加入社区"}
            </Link>
          </div>
        </SpotlightCard>
      </div>
    );
  }

  return (
    <div className="page-shell pt-20 sm:pt-24">
      <section className="page-hero border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,0.06)_0,transparent_42%)] pointer-events-none"></div>
        <div className="page-container page-container-narrow flex flex-col gap-6 sm:gap-8 relative z-10">
          <div className="page-kicker w-fit">
            {isEnglish ? "Legal" : "法律说明"}
          </div>
          <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="flex flex-col gap-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 text-primary flex items-center justify-center rounded-sm shadow-[0_0_20px_rgba(34,197,94,0.15)]">
                {ICONS[doc.icon]}
              </div>
              <h1 className="page-title page-title-compact">{doc.title}</h1>
              <p className="page-lead max-w-2xl">{doc.intro}</p>
            </div>
            <div className="hidden lg:flex flex-col items-end gap-2 text-right">
              <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-primary/60">
                {isEnglish ? "Site note" : "站点说明"}
              </span>
              <span className="text-sm text-muted-foreground leading-relaxed max-w-[18ch]">
                {doc.summary}
              </span>
            </div>
          </div>
          <div className="page-chip-row pt-2">
            <span className="inline-flex items-center px-3 py-2 rounded-sm border border-white/10 bg-secondary/10 text-[10px] sm:text-xs font-bold tracking-widest uppercase text-muted-foreground">
              {isEnglish ? "Effective" : "生效"} {doc.effectiveDate}
            </span>
            <span className="inline-flex items-center px-3 py-2 rounded-sm border border-white/10 bg-secondary/10 text-[10px] sm:text-xs font-bold tracking-widest uppercase text-muted-foreground">
              {doc.version ?? "v1"}
            </span>
            <span className="inline-flex items-center px-3 py-2 rounded-sm border border-white/10 bg-secondary/10 text-[10px] sm:text-xs font-bold tracking-widest uppercase text-muted-foreground">
              {siteConfig.siteName}
            </span>
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="page-container page-container-narrow flex flex-col gap-5 sm:gap-8">
          <div className="border-t border-white/10">
            {doc.sections.map((section, index) => (
              <article
                key={section.heading}
                className={`grid gap-4 py-6 sm:py-8 ${
                  index !== doc.sections.length - 1 ? "border-b border-white/10" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-primary/60">
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
          <SpotlightCard className="page-card page-card-lg text-center flex flex-col gap-5 border-primary/20 bg-primary/5">
            <p className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.32em] text-primary/70">
              {isEnglish ? "Need context" : "需要上下文"}
            </p>
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">
              {isEnglish ? "Return to the main entry first, then keep reading." : "先回到主入口，再继续看说明。"}
            </h3>
            <p className="page-lead max-w-2xl mx-auto">{isEnglish ? "This page only handles boundaries." : "法律页只负责边界。"}</p>
            <div className="page-chip-row justify-center pt-2">
              <Link to="/join" className="inline-flex px-6 py-3 bg-primary text-primary-foreground text-xs sm:text-sm font-bold tracking-widest uppercase rounded-sm">
                {isEnglish ? "Join community" : "加入社区"}
              </Link>
              <Link to="/ecosystem" className="inline-flex px-6 py-3 border border-white/10 text-foreground text-xs sm:text-sm font-bold tracking-widest uppercase rounded-sm">
                {isEnglish ? "Browse ecosystem" : "看生态"}
              </Link>
            </div>
          </SpotlightCard>
        </div>
      </section>
    </div>
  );
}
