import { ArrowRight, Eye, GitMerge, RefreshCw } from "lucide-react";
import { LocalizedLink as Link } from "../components/LocalizedLink";
import { SpotlightCard } from "../components/SpotlightCard";
import { Reveal } from "../components/Reveal";
import { getLearnPaths } from "../content/learn-paths";
import { useLocale } from "../lib/locale";

const phaseIcons = [Eye, RefreshCw, GitMerge] as const;

export default function Learn() {
  const { locale } = useLocale();
  const isEnglish = locale === "en-US";
  const learnPaths = getLearnPaths(locale);
  const learnPath = learnPaths.find((path) => path.featured) ?? learnPaths[0];

  return (
    <div className="page-shell pt-20 sm:pt-24">
      <section className="page-hero border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,0.08)_0,transparent_42%)] pointer-events-none" />
        <div className="page-container page-container-narrow flex flex-col gap-5 sm:gap-6 relative z-10">
          <Reveal>
            <div className="page-kicker w-fit">{isEnglish ? "Learning path" : "学习路径"}</div>
          </Reveal>

          <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="flex flex-col gap-4">
              <Reveal delay={0.05}>
                <h1 className="page-title page-title-compact max-w-[10ch] drop-shadow-[0_0_15px_rgba(34,197,94,0.15)]">
                  {learnPath.title.split("\n").map((line, index) => (
                    <span key={`${line}-${index}`}>
                      {line}
                      {index === 0 ? <br className="md:hidden" /> : null}
                    </span>
                  ))}
                </h1>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="page-lead max-w-2xl">
                  {learnPath.startingThreshold}
                </p>
              </Reveal>
            </div>

            <Reveal delay={0.15}>
              <div className="hidden lg:flex flex-col items-end gap-2 text-right">
                <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-primary/60">
                  {isEnglish ? "Learning order" : "先学顺序"}
                </span>
                <span className="text-sm text-muted-foreground leading-relaxed max-w-[24ch]">
                  {isEnglish ? "See the project / learn by doing / enter development" : "看项目 / 学动手 / 进开发"}
                </span>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.2}>
            <div className="page-chip-row pt-2">
              {learnPath.outcome.map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center px-3 py-2 rounded-sm border border-white/10 bg-secondary/10 text-[10px] sm:text-xs font-bold tracking-widest uppercase text-muted-foreground"
                >
                  {item}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="page-section">
        <div className="page-container page-container-narrow flex flex-col gap-12 sm:gap-14">
          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] items-start">
            <Reveal>
              <SpotlightCard className="page-card page-card-lg border-l-4 !border-l-primary bg-primary/5 flex flex-col gap-5 sm:gap-6">
                <p className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.32em] text-primary/70">
                  {isEnglish ? "Who it fits" : "适合谁"}
                </p>
                <div className="flex flex-col gap-3">
                  <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                    {isEnglish ? "See the project first, then build." : "先看项目，再动手。"}
                  </h2>
                  <p className="page-lead text-base sm:text-lg">
                    {learnPath.audience.join(isEnglish ? " / " : "；")}
                  </p>
                </div>
                <div className="border-t border-white/10 pt-4">
                  <p className="text-sm sm:text-base text-muted-foreground font-light leading-relaxed">
                    {learnPath.proofOrExpectation ?? learnPath.startingThreshold}
                  </p>
                </div>
              </SpotlightCard>
            </Reveal>

            <div className="flex flex-col gap-4 border-t border-white/10 pt-6">
              <div className="flex items-center gap-3">
                <Eye className="text-primary" size={24} />
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                  {isEnglish ? "Three learning steps" : "先学三步"}
                </h2>
              </div>
              <div className="grid gap-0 border border-white/10 rounded-md overflow-hidden bg-secondary/10">
                {learnPath.stages.map((stage, index) => {
                  const Icon = phaseIcons[index] ?? Eye;

                  return (
                    <div
                      key={stage.name}
                      className={`grid gap-4 p-5 sm:p-6 lg:p-7 md:grid-cols-[100px_1fr_180px] items-start ${
                        index !== learnPath.stages.length - 1 ? "border-b border-white/10" : ""
                      } bg-background/20`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 sm:w-12 sm:h-12 bg-primary/10 text-primary flex items-center justify-center rounded-sm">
                          <Icon size={22} />
                        </div>
                        <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-primary/60">
                          0{index + 1}
                        </span>
                      </div>
                      <div className="flex flex-col gap-2">
                        <h3 className="text-lg sm:text-xl font-bold tracking-tight">
                          {stage.name}
                        </h3>
                        <p className="text-sm sm:text-base text-muted-foreground font-light leading-relaxed">
                          {stage.goal}
                        </p>
                        <p className="text-sm sm:text-base text-muted-foreground font-light leading-relaxed">
                          {stage.description}
                        </p>
                      </div>
                      <div className="flex flex-col gap-2 md:justify-self-end">
                        <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-primary/60">
                          {isEnglish ? "Commitment" : "投入"}
                        </span>
                        <span className="inline-flex items-center px-3 py-2 rounded-sm text-[10px] sm:text-xs font-bold tracking-widest uppercase border border-white/10 bg-background/20 text-muted-foreground w-fit">
                          {stage.estimatedCommitment ?? (isEnglish ? "See first" : "先看再说")}
                        </span>
                        {stage.exampleActivities?.length ? (
                          <div className="flex flex-wrap gap-2 pt-1">
                            {stage.exampleActivities.map((item) => (
                              <span
                                key={item}
                                className="inline-flex items-center px-3 py-2 rounded-sm border border-white/10 bg-background/10 text-[10px] sm:text-xs font-medium text-muted-foreground"
                              >
                                {item}
                              </span>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <Reveal delay={0.2}>
            <SpotlightCard className="page-card page-card-lg bg-foreground text-background flex flex-col gap-5 sm:gap-6 border-none shadow-[0_0_40px_rgba(34,197,94,0.1)]">
              <div className="flex flex-col gap-3">
                <p className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.32em] text-background/60">
                  {isEnglish ? "Next step" : "下一步"}
                </p>
                <h3 className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight max-w-2xl">
                  {isEnglish ? "Participate first, then learn." : "先参与，再学习。"}
                </h3>
              <p className="text-sm sm:text-base text-background/70 leading-relaxed max-w-2xl">
                  {isEnglish ? "Read Green Book first, then decide whether to go deeper." : "先看绿皮书，再决定要不要进。"}
                </p>
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
                  to="/greenbook"
                  className="inline-flex min-h-11 items-center justify-center px-5 sm:px-6 py-3 border border-background/20 text-background text-xs sm:text-sm font-bold tracking-widest uppercase rounded-sm active:scale-95 transition-all hover:bg-background/10"
                >
                  {isEnglish ? "Read Green Book" : "看绿皮书"}
                </Link>
              </div>
            </SpotlightCard>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
