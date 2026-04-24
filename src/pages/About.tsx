import { ArrowLeftRight, TerminalSquare } from "lucide-react";
import { InfoCallout } from "../components/InfoCallout";
import { InfoPageHero } from "../components/InfoPageHero";
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
      <InfoPageHero
        kicker={isEnglish ? "About 72hours" : "关于 72hours"}
        icon={<ArrowLeftRight size={30} />}
        title={aboutContent.title}
        lead={aboutContent.subtitle}
        noteLabel={isEnglish ? "Official note" : "官方说明"}
        noteTitle={glossary.coreDefinition}
        noteBody={aboutContent.methodBody}
        chips={aboutSignals.map((signal) => (
          <span
            key={signal}
            className="inline-flex items-center rounded-sm border border-line/70 bg-background/30 px-3 py-2 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground"
          >
            {signal}
          </span>
        ))}
      />

      <section className="page-section">
        <div className="page-container page-container-narrow flex flex-col gap-12 sm:gap-16">
          <div className="grid gap-6 lg:grid-cols-[0.96fr_1.04fr] items-start">
            <SpotlightCard className="page-card page-card-lg border-l-4 !border-l-primary bg-primary/5 flex flex-col gap-5 sm:gap-6">
              <p className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.24em] text-primary/70">
                {aboutContent.whyTitle}
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                {aboutContent.whyBody}
              </h2>
              <p className="page-lead text-base sm:text-lg">{aboutContent.methodBody}</p>
              <div className="border-t border-line/70 pt-4">
                <p className="text-sm sm:text-base text-muted-foreground italic leading-relaxed">
                  “{aboutContent.principleQuote}”
                </p>
              </div>
            </SpotlightCard>

            <div className="flex flex-col gap-4 border-t border-line/70 pt-6">
              <div className="flex items-center gap-3">
                <TerminalSquare className="text-primary" size={24} />
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                  {aboutContent.relationTitle}
                </h2>
              </div>
              <div className="grid gap-0 overflow-hidden rounded-md border border-line/70 bg-surface/18">
                {aboutContent.relationCards.map((card, index) => (
                  <div
                    key={card.title}
                    className={`grid gap-3 p-5 sm:p-6 lg:p-7 md:grid-cols-[140px_1fr] items-start ${
                      index !== aboutContent.relationCards.length - 1 ? "border-b border-line/70" : ""
                    } ${card.featured ? "bg-primary/5" : "bg-background/20"}`}
                  >
                    <div className="flex flex-col gap-2">
                      <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-primary/60">
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
            <div className="flex items-center gap-3 border-b border-line/70 pb-4">
              <TerminalSquare className="text-primary" size={24} />
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                {aboutContent.principlesTitle}
              </h2>
            </div>
            <div className="grid gap-0 overflow-hidden rounded-md border border-line/70 bg-background/40">
              {aboutContent.principles.map((principle, index) => (
                <div
                  key={principle.title}
                  className={`grid gap-3 p-5 sm:p-6 lg:p-7 md:grid-cols-[140px_1fr] items-start ${
                    index !== aboutContent.principles.length - 1 ? "border-b border-line/70" : ""
                  }`}
                >
                  <div className="flex flex-col gap-2">
                    <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-primary/60">
                      0{index + 1}
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold tracking-tight">{principle.title}</h3>
                  </div>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{principle.body}</p>
                </div>
              ))}
            </div>
          </div>

          <InfoCallout
            tone="dark"
            kicker={aboutContent.rejectTitle}
            title={aboutContent.rejectBody}
            body={isEnglish ? "The entry, the ecosystem, and the boundary notes stay together." : "入口、生态和边界说明集中在同一处。"}
            actions={[
              { label: isEnglish ? "Join community" : "加入社区", href: "/join", variant: "primary" },
              { label: isEnglish ? "View 72H Use" : "查看 72H 用途", href: "/hours" },
            ]}
          />
        </div>
      </section>
    </div>
  );
}
