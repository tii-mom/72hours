import { BookOpen, Code2, MapPinned, MonitorSmartphone } from "lucide-react";
import { InfoPageHero } from "../components/InfoPageHero";
import { SpotlightCard } from "../components/SpotlightCard";
import { getLearnPaths } from "../content/learn-paths";
import { useLocale } from "../lib/locale";

const phaseIcons = [MonitorSmartphone, MapPinned, Code2] as const;

export default function Learn() {
  const { locale } = useLocale();
  const isEnglish = locale === "en-US";
  const learnPaths = getLearnPaths(locale);
  const learnPath = learnPaths.find((path) => path.featured) ?? learnPaths[0];

  return (
    <div className="page-shell pt-20 sm:pt-24">
      <InfoPageHero
        kicker={isEnglish ? "Learning application" : "学习报名"}
        icon={<BookOpen size={30} />}
        title={learnPath.title.split("\n").map((line, index) => (
          <span key={`${line}-${index}`}>
            {line}
            {index === 0 ? <br className="md:hidden" /> : null}
          </span>
        ))}
        lead={learnPath.startingThreshold}
        noteLabel={isEnglish ? "Entry" : "入口"}
        noteTitle={learnPath.entryMethod}
        noteBody={isEnglish ? "Build with 72H." : "学习 72H 类应用开发。"}
        chips={learnPath.outcome.map((item) => (
          <span
            key={item}
            className="inline-flex items-center rounded-sm border border-line/70 bg-background/30 px-3 py-2 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground"
          >
            {item}
          </span>
        ))}
      />

      <section className="page-section">
        <div className="page-container page-container-narrow flex flex-col gap-12 sm:gap-14">
          <div className="grid gap-6 lg:grid-cols-[0.96fr_1.04fr] items-start">
            <SpotlightCard className="page-card page-card-lg border-l-4 !border-l-primary bg-primary/5 flex flex-col gap-5 sm:gap-6">
              <p className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.24em] text-primary/70">
                {isEnglish ? "Learning application" : "学习报名"}
              </p>
              <div className="flex flex-col gap-3">
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                {isEnglish ? "Apply first, then enter the right learning room." : "先报名核对，再进入合适的学习安排。"}
                </h2>
                <p className="page-lead text-base sm:text-lg">
                  {learnPath.audience.join(isEnglish ? " / " : "；")}
                </p>
              </div>
              <div className="border-t border-line/70 pt-4">
                <p className="text-sm sm:text-base text-muted-foreground font-light leading-relaxed">
                  {learnPath.proofOrExpectation ?? learnPath.startingThreshold}
                </p>
              </div>
            </SpotlightCard>

            <div className="flex flex-col gap-4 border-t border-line/70 pt-6">
              <div className="flex items-center gap-3">
                <BookOpen className="text-primary" size={24} />
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                  {isEnglish ? "Applications and focus" : "报名方式与学习方向"}
                </h2>
              </div>
              <div className="grid gap-3">
                {learnPath.stages.map((stage, index) => {
                  const Icon = phaseIcons[index] ?? BookOpen;

                  return (
                    <div
                      key={stage.name}
                      className="grid gap-4 rounded-md border border-line/70 bg-[linear-gradient(135deg,rgba(34,197,94,0.07),rgba(7,14,10,0.42)_48%,rgba(185,157,87,0.06))] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] sm:p-6 lg:p-7 md:grid-cols-[96px_1fr_180px] items-start"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 sm:w-12 sm:h-12 bg-primary/10 text-primary flex items-center justify-center rounded-sm">
                          <Icon size={22} />
                        </div>
                        <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-primary/60">
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
                      </div>
                      <div className="flex flex-col gap-2 md:justify-self-end">
                        <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-primary/60">
                          {isEnglish ? "Mode" : "方式"}
                        </span>
                        <span className="inline-flex items-center rounded-sm border border-line/70 bg-background/25 px-3 py-2 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground w-fit">
                          {stage.estimatedCommitment ?? (isEnglish ? "Learn more" : "了解")}
                        </span>
                        {stage.exampleActivities?.length ? (
                          <div className="flex flex-wrap gap-2 pt-1">
                            {stage.exampleActivities.map((item) => (
                              <span
                                key={item}
                                className="inline-flex items-center rounded-sm border border-line/70 bg-background/12 px-3 py-2 text-[10px] sm:text-xs font-medium text-muted-foreground"
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

        </div>
      </section>
    </div>
  );
}
