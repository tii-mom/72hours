import { BookOpen, Eye, GitMerge, RefreshCw } from "lucide-react";
import { InfoCallout } from "../components/InfoCallout";
import { InfoPageHero } from "../components/InfoPageHero";
import { SpotlightCard } from "../components/SpotlightCard";
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
      <InfoPageHero
        kicker={isEnglish ? "Learning path" : "学习路径"}
        icon={<BookOpen size={30} />}
        title={learnPath.title.split("\n").map((line, index) => (
          <span key={`${line}-${index}`}>
            {line}
            {index === 0 ? <br className="md:hidden" /> : null}
          </span>
        ))}
        lead={learnPath.startingThreshold}
        noteLabel={isEnglish ? "Learning guide" : "学习说明"}
        noteTitle={learnPath.entryMethod}
        noteBody={learnPath.proofOrExpectation ?? learnPath.startingThreshold}
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
                {isEnglish ? "Who it fits" : "适合谁"}
              </p>
              <div className="flex flex-col gap-3">
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                  {isEnglish ? "Understand the project and build with it." : "理解项目与动手协作。"}
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
                <Eye className="text-primary" size={24} />
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                  {isEnglish ? "Three phases" : "三段进展"}
                </h2>
              </div>
              <div className="grid gap-0 overflow-hidden rounded-md border border-line/70 bg-surface/18">
                {learnPath.stages.map((stage, index) => {
                  const Icon = phaseIcons[index] ?? Eye;

                  return (
                    <div
                      key={stage.name}
                      className={`grid gap-4 p-5 sm:p-6 lg:p-7 md:grid-cols-[100px_1fr_180px] items-start ${
                        index !== learnPath.stages.length - 1 ? "border-b border-line/70" : ""
                      } ${index === 0 ? "bg-background/20" : "bg-background/12"}`}
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
                        <p className="text-sm sm:text-base text-muted-foreground font-light leading-relaxed">
                          {stage.description}
                        </p>
                      </div>
                      <div className="flex flex-col gap-2 md:justify-self-end">
                        <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-primary/60">
                          {isEnglish ? "Commitment" : "投入"}
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

          <InfoCallout
            tone="dark"
            kicker={isEnglish ? "Learning" : "学习"}
            title={isEnglish ? "Learning and collaboration stay connected." : "学习与协作相互连接。"}
            body={
              isEnglish
                ? "Green Book gives the shared context, and community work keeps it practical."
                : "绿皮书提供共同语境，社区协作让它落到实际行动。"
            }
            actions={[
              { label: isEnglish ? "Join community" : "加入社区", href: "/join", variant: "primary" },
              { label: isEnglish ? "Read Green Book" : "看绿皮书", href: "/greenbook" },
            ]}
          />
        </div>
      </section>
    </div>
  );
}
