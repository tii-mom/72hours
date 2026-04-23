import { ArrowLeftRight, ArrowRight, TerminalSquare } from "lucide-react";
import { LocalizedLink as Link } from "../components/LocalizedLink";
import { SpotlightCard } from "../components/SpotlightCard";
import { getAboutContent } from "../content/about";
import { getGlossary } from "../content/glossary";
import { useLocale } from "../lib/locale";

const aboutSignalsZh = ["入口", "方法", "边界"] as const;
const aboutSignalsEn = ["Entry", "Method", "Boundary"] as const;

export default function About() {
  const { locale } = useLocale();
  const isEnglish = locale === "en-US";
  const glossary = getGlossary(locale);
  const aboutContent = getAboutContent(locale);
  const aboutSignals = isEnglish ? aboutSignalsEn : aboutSignalsZh;

  return (
    <div className="page-shell pt-20 sm:pt-24">
      <div className="absolute top-[18%] left-0 w-1/3 h-[560px] bg-primary/5 blur-[150px] pointer-events-none z-0"></div>
      <div className="absolute top-0 right-0 w-[40vw] h-[35vh] bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.08)_0,transparent_65%)] pointer-events-none z-0"></div>

      <section className="page-hero border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,0.08)_0,transparent_38%),linear-gradient(to_bottom,rgba(255,255,255,0.03),transparent_38%)] pointer-events-none"></div>
        <div className="page-container page-container-narrow relative z-10 flex flex-col gap-6 sm:gap-8">
          <div className="page-kicker w-fit">{isEnglish ? "About 72hours" : "关于 72hours"}</div>
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="flex flex-col gap-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 text-primary flex items-center justify-center rounded-sm shadow-[0_0_20px_rgba(34,197,94,0.15)]">
                <ArrowLeftRight size={24} className="sm:hidden" />
                <ArrowLeftRight size={32} className="hidden sm:block" />
              </div>
              <h1 className="page-title page-title-compact max-w-[12ch] sm:max-w-none drop-shadow-[0_0_15px_rgba(34,197,94,0.15)]">
                {aboutContent.title}
              </h1>
              <p className="page-lead max-w-2xl">{aboutContent.subtitle}</p>
            </div>

            <div className="hidden lg:flex flex-col items-end gap-2 text-right">
              <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-primary/60">
                {isEnglish ? "Official note" : "官方说明"}
              </span>
              <span className="text-sm text-muted-foreground leading-relaxed max-w-[18ch]">
                {glossary.pageLabels.use72H} / {isEnglish ? "Use / participation / learning" : "使用 / 参与 / 学习"}
              </span>
            </div>
          </div>

          <div className="page-chip-row pt-2">
            {aboutSignals.map((signal) => (
              <span
                key={signal}
                className="inline-flex items-center px-3 py-2 rounded-sm border border-white/10 bg-secondary/10 text-[10px] sm:text-xs font-bold tracking-widest uppercase text-muted-foreground"
              >
                {signal}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="page-container page-container-narrow flex flex-col gap-14 sm:gap-16">
          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] items-start">
            <SpotlightCard className="page-card page-card-lg border-l-4 !border-l-primary bg-primary/5 flex flex-col gap-5 sm:gap-6">
              <p className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.32em] text-primary/70">
                {aboutContent.whyTitle}
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                {aboutContent.whyBody}
              </h2>
              <p className="page-lead text-base sm:text-lg">{aboutContent.methodBody}</p>
              <div className="border-t border-white/10 pt-4">
                <p className="text-sm sm:text-base text-muted-foreground italic leading-relaxed">
                  “{aboutContent.principleQuote}”
                </p>
              </div>
            </SpotlightCard>

            <div className="flex flex-col gap-4 border-t border-white/10 pt-6">
              <div className="flex items-center gap-3">
                <TerminalSquare className="text-primary" size={24} />
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                  {aboutContent.relationTitle}
                </h2>
              </div>
              <div className="grid gap-0 border border-white/10 rounded-md overflow-hidden bg-secondary/10">
                {aboutContent.relationCards.map((card, index) => (
                  <div
                    key={card.title}
                    className={`grid gap-3 p-5 sm:p-6 lg:p-7 md:grid-cols-[140px_1fr] items-start ${
                      index !== aboutContent.relationCards.length - 1 ? "border-b border-white/10" : ""
                    } ${card.featured ? "bg-primary/5" : "bg-background/20"}`}
                  >
                    <div className="flex flex-col gap-2">
                      <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-primary/60">
                        {isEnglish ? "Relation" : "关系"} {String(index + 1).padStart(2, "0")}
                      </span>
                      <h3 className="text-lg sm:text-xl font-bold tracking-tight">{card.title}</h3>
                    </div>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{card.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <TerminalSquare className="text-primary" size={24} />
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                {aboutContent.principlesTitle}
              </h2>
            </div>
            <div className="grid gap-0 border border-white/10 rounded-md overflow-hidden bg-background/40">
              {aboutContent.principles.map((principle, index) => (
                <div
                  key={principle.title}
                  className={`grid gap-3 p-5 sm:p-6 lg:p-7 md:grid-cols-[140px_1fr] items-start ${
                    index !== aboutContent.principles.length - 1 ? "border-b border-white/10" : ""
                  }`}
                >
                  <div className="flex flex-col gap-2">
                    <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-primary/60">
                      0{index + 1}
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold tracking-tight">{principle.title}</h3>
                  </div>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{principle.body}</p>
                </div>
              ))}
            </div>
          </div>

          <SpotlightCard className="page-card page-card-lg bg-foreground text-background flex flex-col gap-5 sm:gap-6 border-none shadow-[0_0_40px_rgba(34,197,94,0.1)]">
            <div className="flex flex-col gap-3">
              <p className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.32em] text-background/60">
                {aboutContent.rejectTitle}
              </p>
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight max-w-2xl">
                {aboutContent.rejectBody}
              </h3>
            </div>
            <div className="page-chip-row pt-1">
              <Link
                to="/join"
                className="inline-flex min-h-11 items-center justify-center px-5 sm:px-6 py-3 bg-background text-foreground text-xs sm:text-sm font-bold tracking-widest uppercase rounded-sm active:scale-95 transition-all hover:bg-background/90"
              >
                {isEnglish ? "Join community" : "加入社区"}
                <ArrowRight size={16} className="ml-2" />
              </Link>
              <Link
                to="/hours"
                className="inline-flex min-h-11 items-center justify-center px-5 sm:px-6 py-3 border border-background/20 text-background text-xs sm:text-sm font-bold tracking-widest uppercase rounded-sm active:scale-95 transition-all hover:bg-background/10"
              >
                {isEnglish ? "View 72H Use" : "查看 72H 用途"}
                <ArrowRight size={16} className="ml-2" />
              </Link>
            </div>
          </SpotlightCard>
        </div>
      </section>
    </div>
  );
}
