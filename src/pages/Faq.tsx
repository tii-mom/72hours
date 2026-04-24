import { BookOpen, LifeBuoy, MessagesSquare, ShieldCheck } from "lucide-react";
import { LocalizedLink as Link } from "../components/LocalizedLink";
import { InfoCallout } from "../components/InfoCallout";
import { InfoPageHero } from "../components/InfoPageHero";
import { getFaqItems } from "../content/faqs";
import { getGlossary } from "../content/glossary";
import { useLocale } from "../lib/locale";

const ICONS = {
  start: <MessagesSquare size={22} />,
  official: <ShieldCheck size={22} />,
  learn: <BookOpen size={22} />,
  hours: <LifeBuoy size={22} />,
} as const;

export default function Faq() {
  const { locale } = useLocale();
  const isEnglish = locale === "en-US";
  const glossary = getGlossary(locale);
  const faqHighlights = getFaqItems(locale).filter((item) => item.isPinned ?? true);
  const chips = [
    glossary.quickIndex.gettingStarted,
    glossary.quickIndex.safety,
    glossary.quickIndex.learning,
    glossary.quickIndex.use72H,
  ];

  return (
    <div className="page-shell pt-20 sm:pt-24">
      <InfoPageHero
        kicker={isEnglish ? "FAQ" : "常见问题"}
        icon={<MessagesSquare size={30} />}
        title={isEnglish ? "Questions, entry points, learning, and 72H Use." : "常见问题、入口、学习与 72H 用途。"}
        lead={isEnglish ? "Covers getting started, entry points, learning, and 72H Use." : "只回答开始、官方入口、学习和 72H 用途。"}
        noteLabel={isEnglish ? "Quick index" : "快速索引"}
        noteTitle={isEnglish ? "Information index" : "信息索引"}
        noteBody={chips.join(" / ")}
        chips={chips.map((label) => (
          <span
            key={label}
            className="inline-flex items-center rounded-sm border border-line/70 bg-background/30 px-3 py-2 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground"
          >
            {label}
          </span>
        ))}
      />

      <section className="page-section">
        <div className="page-container page-container-narrow">
          <div className="overflow-hidden rounded-md border border-line/70 bg-surface/18">
            {faqHighlights.map((item, index) => (
              <article
                key={item.id}
                className={`grid gap-5 p-5 sm:p-6 lg:p-7 ${
                  index !== faqHighlights.length - 1 ? "border-b border-line/70" : ""
                }`}
              >
                <div className="flex flex-wrap items-center gap-3">
                  <span className="page-kicker">
                    {String(index + 1).padStart(2, "0")} / {item.category}
                  </span>
                  <div className="w-11 h-11 sm:w-12 sm:h-12 bg-primary/10 text-primary flex items-center justify-center rounded-sm">
                    {ICONS[item.id as keyof typeof ICONS]}
                  </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-start">
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                    {item.question}
                  </h2>
                  <div className="flex flex-col gap-3">
                    <p className="text-sm sm:text-base text-muted-foreground font-light leading-relaxed">
                      {item.answer}
                    </p>
                    {item.relatedLinks?.length ? (
                      <div className="page-chip-row pt-1">
                        {item.relatedLinks.map((link) => (
                          <Link
                            key={link.label}
                            to={link.href}
                            className="page-action-muted"
                          >
                            {link.label}
                          </Link>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="page-section-tight pb-20 sm:pb-28">
        <div className="page-container page-container-narrow">
          <InfoCallout
            tone="dark"
            kicker={isEnglish ? "More context" : "更多上下文"}
            title={isEnglish ? "FAQ, Green Book, and ecosystem are the main references." : "FAQ、绿皮书和生态应用是主要参考。"}
            body={isEnglish ? "Use official entries and marked channels for verification." : "请以官方入口和已标记渠道核对信息。"}
            actions={[
              { label: isEnglish ? "Join community" : "加入社区", href: "/join", variant: "primary" },
              { label: isEnglish ? "Read Green Book" : "看绿皮书", href: "/greenbook" },
              { label: isEnglish ? "Browse ecosystem" : "看生态", href: "/ecosystem" },
            ]}
            align="left"
          />
        </div>
      </section>
    </div>
  );
}
