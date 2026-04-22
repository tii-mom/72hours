import { Link } from "react-router-dom";
import { BookOpen, LifeBuoy, MessagesSquare, ShieldCheck } from "lucide-react";
import { SpotlightCard } from "../components/SpotlightCard";
import { getFaqItems } from "../content/faqs";
import { useLocale } from "../lib/locale";

const ICONS = {
  start: <MessagesSquare size={22} />,
  official: <ShieldCheck size={22} />,
  learn: <BookOpen size={22} />,
  hours: <LifeBuoy size={22} />,
} as const;

const labelsZh = ["入门", "安全", "学习", "小时"] as const;
const labelsEn = ["Getting started", "Safety", "Learning", "Hours"] as const;

export default function Faq() {
  const { locale } = useLocale();
  const isEnglish = locale === "en-US";
  const faqHighlights = getFaqItems(locale).filter((item) => item.isPinned ?? true);
  const chips = isEnglish ? labelsEn : labelsZh;

  return (
    <div className="page-shell pt-20 sm:pt-24">
      <div className="absolute top-0 right-1/4 w-1/3 h-[360px] bg-primary/5 blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute top-20 left-0 w-[32vw] h-[26vh] bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.08)_0,transparent_64%)] pointer-events-none z-0"></div>

      <section className="page-hero border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.05)_1px,transparent_1px)] bg-[size:16px_16px] opacity-20 pointer-events-none"></div>
        <div className="page-container page-container-narrow flex flex-col gap-6 sm:gap-8 relative z-10">
          <div className="page-kicker w-fit">{isEnglish ? "FAQ" : "常见问题"}</div>
          <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="flex flex-col gap-4">
              <h1 className="page-title page-title-compact max-w-[10ch]">
                {isEnglish ? "Read the questions first, then decide." : "先看问题，再决定。"}
              </h1>
              <p className="page-lead max-w-2xl">
                {isEnglish ? "Covers getting started, entry points, learning, and Hours." : "只回答开始、官方入口、学习和小时。"}
              </p>
            </div>

            <div className="hidden lg:flex flex-col items-end gap-2 text-right">
              <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-primary/60">
                {isEnglish ? "Quick index" : "快速索引"}
              </span>
              <span className="text-sm text-muted-foreground leading-relaxed max-w-[18ch]">
                {isEnglish ? "Getting started / Safety / Learning / Hours" : "入门 / 安全 / 学习 / 小时"}
              </span>
            </div>
          </div>

          <div className="page-chip-row pt-2">
            {chips.map((label) => (
              <span
                key={label}
                className="inline-flex items-center px-3 py-2 rounded-sm border border-white/10 bg-secondary/10 text-[10px] sm:text-xs font-bold tracking-widest uppercase text-muted-foreground"
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="page-container page-container-narrow">
          <div className="border-t border-white/10">
            {faqHighlights.map((item, index) => (
              <article
                key={item.id}
                className={`grid gap-5 py-6 sm:py-8 ${
                  index !== faqHighlights.length - 1 ? "border-b border-white/10" : ""
                }`}
              >
                <div className="flex flex-wrap items-center gap-3">
                  <span className="page-kicker">
                    {String(index + 1).padStart(2, "0")} / {item.category}
                  </span>
                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-primary/10 text-primary flex items-center justify-center rounded-sm">
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
                            className="inline-flex px-4 py-2 border border-white/10 text-foreground text-[10px] sm:text-xs font-bold tracking-widest uppercase rounded-sm hover:border-primary/30 hover:text-primary transition-colors"
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
          <SpotlightCard className="page-card page-card-lg border-primary/20 bg-primary/5 flex flex-col gap-5 sm:gap-6">
            <div className="flex flex-col gap-3">
              <p className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.32em] text-primary/70">
                {isEnglish ? "Still unsure" : "还不确定"}
              </p>
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight">
                {isEnglish ? "Review the main entry first, then decide whether to go deeper." : "先看主入口，再决定要不要深入。"}
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground font-light leading-relaxed max-w-2xl">
                {isEnglish ? "Read Green Book first, or return to the entry." : "先看绿书，或者直接回到入口。"}
              </p>
            </div>
            <div className="page-chip-row">
              <Link
                to="/join"
                className="inline-flex items-center justify-center px-5 sm:px-6 py-3 bg-primary text-primary-foreground text-xs sm:text-sm font-bold tracking-widest uppercase rounded-sm active:scale-95 transition-all hover:brightness-110"
              >
                {isEnglish ? "Join community" : "加入社区"}
              </Link>
              <Link
                to="/greenbook"
                className="inline-flex items-center justify-center px-5 sm:px-6 py-3 border border-white/10 text-foreground text-xs sm:text-sm font-bold tracking-widest uppercase rounded-sm active:scale-95 transition-all hover:border-primary/30 hover:text-primary"
              >
                {isEnglish ? "Read Green Book" : "看绿书"}
              </Link>
              <Link
                to="/ecosystem"
                className="inline-flex items-center justify-center px-5 sm:px-6 py-3 border border-white/10 text-foreground text-xs sm:text-sm font-bold tracking-widest uppercase rounded-sm active:scale-95 transition-all hover:border-primary/30 hover:text-primary"
              >
                {isEnglish ? "Browse ecosystem" : "看生态"}
              </Link>
            </div>
          </SpotlightCard>
        </div>
      </section>
    </div>
  );
}
