import { ArrowRight, Coins, Fingerprint, ShieldCheck } from "lucide-react";
import { LocalizedLink as Link } from "../components/LocalizedLink";
import { SpotlightCard } from "../components/SpotlightCard";
import { getGlossary } from "../content/glossary";
import { getHoursContent } from "../content/hours";
import { useLocale } from "../lib/locale";

const hourSignalsZh = ["产品", "参与", "学习"] as const;
const hourSignalsEn = ["Product", "Participation", "Learning"] as const;

export default function Hours() {
  const { locale } = useLocale();
  const isEnglish = locale === "en-US";
  const glossary = getGlossary(locale);
  const hoursContent = getHoursContent(locale);
  const hourSignals = isEnglish ? hourSignalsEn : hourSignalsZh;

  return (
    <div className="page-shell pt-20 sm:pt-24">
      <div className="absolute top-0 right-1/4 w-1/3 h-[400px] bg-primary/5 blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute top-0 left-0 w-[35vw] h-[30vh] bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.08)_0,transparent_65%)] pointer-events-none z-0"></div>

      <section className="page-hero border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.05)_1px,transparent_1px)] bg-[size:15px_15px] opacity-20 pointer-events-none"></div>
        <div className="page-container page-container-narrow max-w-4xl flex flex-col gap-6 sm:gap-8 text-left relative z-10">
          <div className="page-kicker w-fit">{glossary.pageLabels.use72H}</div>
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="flex flex-col gap-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary/10 text-primary flex items-center justify-center rounded-sm shadow-[0_0_20px_rgba(34,197,94,0.2)]">
                <Fingerprint size={24} className="sm:hidden" />
                <Fingerprint size={32} className="hidden sm:block" />
              </div>
              <h1 className="page-title page-title-compact max-w-[11ch] drop-shadow-[0_0_15px_rgba(34,197,94,0.15)]">
                {hoursContent.title.split("\n").map((line, index) => (
                  <span key={line}>
                    {line}
                    {index === 0 ? <br className="md:hidden" /> : null}
                  </span>
                ))}
              </h1>
              <p className="page-lead max-w-2xl">{hoursContent.subtitle}</p>
            </div>

            <div className="hidden lg:flex flex-col items-end gap-2 text-right">
              <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-primary/60">
                {isEnglish ? "Official role" : "官方角色"}
              </span>
              <span className="text-sm text-muted-foreground leading-relaxed max-w-[16ch]">
                {isEnglish ? "Use / participate / learn" : "使用 / 参与 / 学习"}
              </span>
            </div>
          </div>

          <div className="page-chip-row pt-2">
            {hourSignals.map((signal) => (
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

      <section className="page-section-tight">
        <div className="page-container page-container-wide max-w-5xl flex flex-col gap-12 sm:gap-14">
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] items-start">
            <SpotlightCard className="page-card page-card-lg border-l-4 !border-l-primary bg-primary/5 flex flex-col gap-4 sm:gap-5">
              <p className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.32em] text-primary/70">
                {hoursContent.roleTitle}
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                {hoursContent.roleBody}
              </h2>
              <p className="text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed font-light">
                {hoursContent.closingBody}
              </p>
            </SpotlightCard>

            <div className="flex flex-col gap-4 border-t border-white/10 pt-6">
              <div className="flex items-center gap-3">
                <ShieldCheck className="text-primary" size={24} />
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                  {hoursContent.usageIntro}
                </h2>
              </div>
              <div className="grid gap-0 border border-white/10 rounded-md overflow-hidden bg-secondary/10">
                {hoursContent.uses.map((use, index) => {
                  const Icon = index === 0 ? ShieldCheck : index === 1 ? Coins : Fingerprint;

                  return (
                    <div
                      key={use.title}
                      className={`grid gap-4 p-5 sm:p-6 lg:p-7 md:grid-cols-[88px_1fr_170px] items-start ${
                        index !== hoursContent.uses.length - 1 ? "border-b border-white/10" : ""
                      } ${use.featured ? "bg-primary/5" : "bg-background/20"}`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center rounded-sm ${
                            use.featured ? "bg-primary text-primary-foreground shadow-[0_0_20px_rgba(34,197,94,0.35)]" : "bg-primary/10 text-primary"
                          }`}
                        >
                          <Icon size={22} />
                        </div>
                        <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-primary/60">
                          0{index + 1}
                        </span>
                      </div>
                      <div className="flex flex-col gap-2">
                        <h3 className="text-lg sm:text-xl font-bold tracking-tight">{use.title}</h3>
                        <p className="text-sm sm:text-base text-muted-foreground font-light leading-relaxed">
                          {use.body}
                        </p>
                      </div>
                      <div className="flex md:justify-end">
                        <span
                          className={`inline-flex items-center px-3 py-2 rounded-sm text-[10px] sm:text-xs font-bold tracking-widest uppercase border ${
                            use.featured
                              ? "border-primary/30 bg-primary/15 text-primary"
                              : "border-white/10 bg-background/20 text-muted-foreground"
                          }`}
                        >
                          {use.accent}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <SpotlightCard className="page-card page-card-lg bg-foreground text-background flex flex-col gap-5 sm:gap-6 border-none shadow-[0_0_40px_rgba(34,197,94,0.1)]">
            <div className="flex flex-col gap-3">
              <p className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.32em] text-background/60">
                {isEnglish ? "Next step" : "下一步"}
              </p>
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight max-w-2xl">
                {hoursContent.closingBody}
              </h3>
              <p className="text-sm sm:text-base text-background/70 leading-relaxed max-w-2xl">
                {isEnglish
                  ? "Review the use cases first, then return to the community."
                  : "先看用途，再回社区。"}
              </p>
            </div>
            <div className="page-chip-row pt-1">
              <Link
                to="/ecosystem"
                className="inline-flex min-h-11 items-center justify-center px-5 sm:px-6 py-3 bg-background text-foreground text-xs sm:text-sm font-bold tracking-widest uppercase rounded-sm active:scale-95 transition-all hover:bg-background/90"
              >
                {isEnglish ? "Browse ecosystem" : "浏览生态应用"}
                <ArrowRight size={16} className="ml-2" />
              </Link>
              <Link
                to="/join"
                className="inline-flex min-h-11 items-center justify-center px-5 sm:px-6 py-3 border border-background/20 text-background text-xs sm:text-sm font-bold tracking-widest uppercase rounded-sm active:scale-95 transition-all hover:bg-background/10"
              >
                {isEnglish ? "Join community" : "加入社区"}
                <ArrowRight size={16} className="ml-2" />
              </Link>
            </div>
          </SpotlightCard>
        </div>
      </section>
    </div>
  );
}
