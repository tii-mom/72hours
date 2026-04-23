import { Sparkles } from "lucide-react";
import { cn } from "../lib/utils";
import { getGreenBookContent } from "../content/greenbook";
import { useLocale, type Locale } from "../lib/locale";

export function GreenBookPoster({ className, locale: localeProp }: { className?: string; locale?: Locale }) {
  const { locale: contextLocale } = useLocale();
  const locale = localeProp ?? contextLocale;
  const content = getGreenBookContent(locale);
  const { hero, quickFacts, share } = content;
  const featuredBullets = share.bullets.slice(0, 3);

  return (
    <article
      className={cn(
        "relative isolate aspect-[4/5] w-full overflow-hidden rounded-[32px] bg-[linear-gradient(180deg,rgba(4,8,5,0.98),rgba(2,4,3,0.96))] text-foreground shadow-[0_26px_90px_rgba(0,0,0,0.45)]",
        className
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_16%,rgba(124,255,102,0.24),transparent_28%),radial-gradient(circle_at_12%_86%,rgba(89,255,138,0.14),transparent_30%),linear-gradient(135deg,rgba(255,255,255,0.05),transparent_36%)]" />
      <div className="absolute inset-0 opacity-28 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:42px_42px]" />
      <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,transparent,rgba(124,255,102,0.95),transparent)] opacity-80" />

      <div className="relative flex h-full flex-col p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.28em] text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            {locale === "en-US" ? "Share Ready" : "可分享"}
          </span>
          <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/60">
            1600 × 2000
          </span>
        </div>

        <div className="mt-4 flex flex-1 flex-col gap-4">
          <section className="space-y-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.42em] text-primary/75">
              {locale === "en-US" ? "72H GREEN BOOK" : "72H 绿皮书"}
            </p>
            <h3 className="text-[clamp(3rem,13vw,5.4rem)] font-bold leading-[0.88] tracking-[-0.08em]">
              <span className="block text-foreground drop-shadow-[0_0_16px_rgba(124,255,102,0.12)]">
                72H
              </span>
              <span className="block text-primary drop-shadow-[0_0_16px_rgba(124,255,102,0.28)]">
                {locale === "en-US" ? "Green Book" : "绿皮书"}
              </span>
            </h3>
            <p className="max-w-[28ch] text-[14px] leading-relaxed text-white/74 sm:max-w-[30ch] sm:text-[15px]">
              {share.subtitle}
            </p>
          </section>

          <section className="grid grid-cols-2 gap-2.5">
            {quickFacts.map((fact, index) => (
              <div
                key={fact.label}
                className={cn(
                  "rounded-[22px] border border-white/8 bg-white/4 px-3 py-3",
                  index === 2 && "col-span-2"
                )}
              >
                <p className="text-[10px] font-bold tracking-[0.12em] text-white/45">
                  {fact.label}
                </p>
                <p
                  className={cn(
                    "mt-1.5 font-semibold leading-tight text-foreground",
                    fact.label === (locale === "en-US" ? "Total supply" : "总量")
                      ? "break-all text-[11px] sm:text-[13px]"
                      : "break-words text-[13px] sm:text-[14px]"
                  )}
                >
                  {fact.value}
                </p>
              </div>
            ))}
          </section>

          <section className="grid gap-2.5">
            {featuredBullets.map((bullet) => (
              <div
                key={bullet}
                className="flex gap-3 rounded-[22px] border border-white/8 bg-black/24 px-3.5 py-3"
              >
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary shadow-[0_0_12px_rgba(124,255,102,0.8)]" />
                <span className="text-[13px] leading-relaxed text-white/82 sm:text-[14px]">{bullet}</span>
              </div>
            ))}
          </section>

          <footer className="mt-auto flex items-center justify-between gap-3 border-t border-white/10 pt-3">
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-white/42">
                {locale === "en-US" ? "72hours" : "72hours"}
              </p>
              <p className="mt-1 text-[11px] leading-relaxed text-white/58">
                {share.footerNote}
              </p>
            </div>
            <div className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
              {locale === "en-US" ? "Ready" : "就绪"}
            </div>
          </footer>
        </div>
      </div>
    </article>
  );
}

export default GreenBookPoster;
