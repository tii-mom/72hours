import { Coins, Fingerprint, ShieldCheck } from "lucide-react";
import { InfoCallout } from "../components/InfoCallout";
import { InfoPageHero } from "../components/InfoPageHero";
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
      <InfoPageHero
        kicker={glossary.pageLabels.use72H}
        icon={<Fingerprint size={30} />}
        title={hoursContent.title.split("\n").map((line, index) => (
          <span key={line}>
            {line}
            {index === 0 ? <br className="md:hidden" /> : null}
          </span>
        ))}
        lead={hoursContent.subtitle}
        noteLabel={isEnglish ? "Official role" : "官方角色"}
        noteTitle={hoursContent.roleTitle}
        noteBody={hoursContent.roleBody}
        chips={hourSignals.map((signal) => (
          <span
            key={signal}
            className="inline-flex items-center rounded-sm border border-line/70 bg-background/30 px-3 py-2 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground"
          >
            {signal}
          </span>
        ))}
      />

      <section className="page-section-tight">
        <div className="page-container page-container-wide max-w-5xl flex flex-col gap-12 sm:gap-14">
          <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr] items-start">
            <SpotlightCard className="page-card page-card-lg border-l-4 !border-l-primary bg-primary/5 flex flex-col gap-4 sm:gap-5">
              <p className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.24em] text-primary/70">
                {hoursContent.roleTitle}
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                {hoursContent.roleBody}
              </h2>
              <p className="text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed font-light">
                {hoursContent.closingBody}
              </p>
            </SpotlightCard>

            <div className="flex flex-col gap-4 border-t border-line/70 pt-6">
              <div className="flex items-center gap-3">
                <ShieldCheck className="text-primary" size={24} />
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                  {hoursContent.usageIntro}
                </h2>
              </div>
              <div className="grid gap-0 overflow-hidden rounded-md border border-line/70 bg-surface/18">
                {hoursContent.uses.map((use, index) => {
                  const Icon = index === 0 ? ShieldCheck : index === 1 ? Coins : Fingerprint;

                  return (
                    <div
                      key={use.title}
                      className={`grid gap-4 p-5 sm:p-6 lg:p-7 md:grid-cols-[88px_1fr_170px] items-start ${
                        index !== hoursContent.uses.length - 1 ? "border-b border-line/70" : ""
                      } ${use.featured ? "bg-primary/5" : "bg-background/18"}`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center rounded-sm ${
                            use.featured
                              ? "bg-primary text-primary-foreground shadow-[0_0_20px_rgba(34,197,94,0.35)]"
                              : "bg-primary/10 text-primary"
                          }`}
                        >
                          <Icon size={22} />
                        </div>
                        <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-primary/60">
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
                          className={`inline-flex items-center rounded-sm border px-3 py-2 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.12em] ${
                            use.featured
                              ? "border-primary/30 bg-primary/15 text-primary"
                              : "border-line/70 bg-background/25 text-muted-foreground"
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

          <InfoCallout
            tone="dark"
            kicker={isEnglish ? "Use" : "用途"}
            title={isEnglish ? "Use cases, role, and boundaries stay aligned." : "用途、角色和边界保持统一。"}
            body={isEnglish ? "The use layer sits alongside the ecosystem and community." : "用途层与生态和社区并列呈现。"}
            actions={[
              { label: isEnglish ? "Browse ecosystem" : "浏览生态应用", href: "/ecosystem", variant: "primary" },
              { label: isEnglish ? "Join community" : "加入社区", href: "/join" },
            ]}
          />
        </div>
      </section>
    </div>
  );
}
