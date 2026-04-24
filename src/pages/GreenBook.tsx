import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { motion, useScroll, useSpring } from "motion/react";
import GreenBookSharePanel from "../components/GreenBookSharePanel";
import { LocalizedLink as Link } from "../components/LocalizedLink";
import { getGreenBookContent } from "../content/greenbook";
import { useLocale } from "../lib/locale";
import { cn } from "../lib/utils";

const chapterItemsZh = [
  { id: "holdings", label: "持有" },
  { id: "useCases", label: "场景" },
  { id: "businessModel", label: "商业" },
  { id: "supply", label: "供给" },
  { id: "boundaries", label: "边界" },
  { id: "goal", label: "目标" },
  { id: "share", label: "分享" },
] as const;

const chapterItemsEn = [
  { id: "holdings", label: "Holding" },
  { id: "useCases", label: "Scenarios" },
  { id: "businessModel", label: "Business" },
  { id: "supply", label: "Supply" },
  { id: "boundaries", label: "Boundaries" },
  { id: "goal", label: "Goal" },
  { id: "share", label: "Share" },
] as const;

type ChapterId = (typeof chapterItemsZh)[number]["id"];
type ChapterItem = { id: ChapterId; label: string };
type QuickFact = {
  label: string;
  value: string;
  body: string;
};

const ease = [0.16, 1, 0.3, 1] as const;
const sectionReveal = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.68, ease },
  },
} as const;

const chapterScrollMargin = "scroll-mt-[8.75rem] sm:scroll-mt-[9.5rem] lg:scroll-mt-32";

function SectionHeader({
  eyebrow,
  title,
  body,
}: {
  eyebrow?: string;
  title: string;
  body?: string;
}) {
  return (
    <div className="flex max-w-3xl flex-col gap-2.5 sm:gap-3">
      {eyebrow ? (
        <div className="page-kicker w-fit">
          <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          {eyebrow}
        </div>
      ) : null}
      <h2 className="text-[clamp(1.45rem,3.1vw,2.3rem)] font-bold leading-[1.08] tracking-tight text-foreground text-balance">
        {title}
      </h2>
      {body ? (
        <p className="max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">
          {body}
        </p>
      ) : null}
    </div>
  );
}

function QuickFactsPanel({
  facts,
  isEnglish,
}: {
  facts: readonly QuickFact[];
  isEnglish: boolean;
}) {
  return (
    <motion.section
      variants={sectionReveal}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      className="flex flex-col gap-4 sm:gap-5"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="page-kicker w-fit">
          <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          {isEnglish ? "Quick facts" : "关键事实"}
        </div>
        <div className="text-[10px] font-bold uppercase tracking-[0.28em] text-muted-foreground">
          {isEnglish ? "Essentials" : "要点"}
        </div>
      </div>

      <div className="overflow-hidden rounded-md border border-line/70 bg-read-panel/90">
        <div className="divide-y divide-line/70">
          {facts.map((fact, index) => (
            <div
              key={fact.label}
              className="grid gap-3 px-4 py-4 sm:grid-cols-[minmax(7.5rem,0.84fr)_minmax(0,1.16fr)] sm:gap-5 sm:px-5 sm:py-5"
            >
              <div className="flex items-start justify-between gap-3 sm:flex-col sm:items-start sm:gap-1">
                <span className="text-[10px] font-bold uppercase tracking-[0.32em] text-primary/75">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-muted-foreground">
                  {fact.label}
                </span>
              </div>
              <div className="space-y-1.5">
                <div className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">
                  {fact.value}
                </div>
                <p className="text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">
                  {fact.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

function ChapterRail({
  chapterItems,
  activeChapter,
  progress,
  isEnglish,
}: {
  chapterItems: readonly ChapterItem[];
  activeChapter: ChapterId;
  progress: ReturnType<typeof useSpring>;
  isEnglish: boolean;
}) {
  const activeIndex = Math.max(
    chapterItems.findIndex((item) => item.id === activeChapter),
    0
  );
  const activeLabel = chapterItems[activeIndex]?.label ?? chapterItems[0]?.label ?? "";
  const activeNumber = String(activeIndex + 1).padStart(2, "0");
  const totalNumber = String(chapterItems.length).padStart(2, "0");

  return (
    <aside className="sticky top-16 z-30 -mx-5 border-y border-line/70 bg-background/90 px-5 py-3 backdrop-blur-xl sm:-mx-8 sm:px-8 sm:top-[4.75rem] lg:mx-0 lg:top-24 lg:z-auto lg:border-0 lg:bg-transparent lg:px-0 lg:py-0 lg:self-start">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.32em] text-primary/80">
            <span className="h-2 w-2 rounded-full bg-primary" />
            {isEnglish ? "Chapters" : "章节"}
          </div>
          <div className="mt-1 truncate text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            {activeLabel}
          </div>
        </div>
        <div className="text-[10px] font-bold uppercase tracking-[0.28em] text-muted-foreground">
          {activeNumber}/{totalNumber}
        </div>
      </div>

      <div className="mt-3 h-px overflow-hidden rounded-full bg-line/70 lg:mt-4">
        <motion.div
          className="h-full w-full origin-left bg-primary"
          style={{ scaleX: progress }}
        />
      </div>

      <nav
        aria-label={isEnglish ? "Green Book chapters" : "绿皮书章节"}
        className="mt-3 flex snap-x snap-mandatory gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:mt-4 lg:flex-col lg:overflow-visible lg:pb-0"
      >
        {chapterItems.map((item, index) => {
          const isActive = activeChapter === item.id;

          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              aria-current={isActive ? "location" : undefined}
              className={cn(
                "group inline-flex min-h-11 shrink-0 snap-start items-center gap-3 rounded-full border px-4 py-3 text-sm font-semibold tracking-tight transition-colors transition-transform lg:grid lg:w-full lg:grid-cols-[2rem_minmax(0,1fr)] lg:gap-3 lg:rounded-md lg:px-4 lg:py-3",
                isActive
                  ? "border-primary/30 bg-primary/10 text-primary shadow-[0_0_20px_rgba(34,197,94,0.08)]"
                  : "border-line/70 bg-surface/60 text-muted-foreground hover:border-primary/30 hover:text-foreground"
              )}
            >
              <span
                className={cn(
                  "font-mono text-[10px] font-bold uppercase tracking-[0.24em]",
                  isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary"
                )}
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="whitespace-nowrap">{item.label}</span>
            </a>
          );
        })}
      </nav>
    </aside>
  );
}

export default function GreenBook() {
  const { locale } = useLocale();
  const isEnglish = locale === "en-US";
  const greenbookContent = getGreenBookContent(locale);
  const chapterItems = isEnglish ? chapterItemsEn : chapterItemsZh;
  const contentRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Record<ChapterId, HTMLElement | null>>({
    holdings: null,
    useCases: null,
    businessModel: null,
    supply: null,
    boundaries: null,
    goal: null,
    share: null,
  });
  const [activeChapter, setActiveChapter] = useState<ChapterId>("holdings");
  const { scrollYProgress } = useScroll({
    target: contentRef,
    offset: ["start start", "end end"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 28,
    mass: 0.15,
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => right.intersectionRatio - left.intersectionRatio)[0];

        const nextId = visible?.target.getAttribute("data-chapter") as ChapterId | null;
        if (nextId) {
          setActiveChapter(nextId);
        }
      },
      {
        rootMargin: "-28% 0px -58% 0px",
        threshold: [0.15, 0.3, 0.5, 0.75],
      }
    );

    Object.values(sectionRefs.current).forEach((node) => {
      if (node) observer.observe(node);
    });

    return () => observer.disconnect();
  }, []);

  const registerSection = (id: ChapterId) => (node: HTMLElement | null) => {
    sectionRefs.current[id] = node;
  };

  return (
    <div className="page-shell pt-20 sm:pt-24">
      <section className="relative isolate overflow-hidden border-b border-line/70 px-5 sm:px-8 lg:px-16">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,color-mix(in_srgb,hsl(var(--foreground))_4%,transparent)_0%,transparent_42%),radial-gradient(circle_at_16%_18%,color-mix(in_srgb,hsl(var(--primary))_14%,transparent),transparent_30%),radial-gradient(circle_at_84%_12%,color-mix(in_srgb,hsl(var(--gold))_10%,transparent),transparent_26%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(color-mix(in_srgb,hsl(var(--foreground))_7%,transparent)_1px,transparent_1px),linear-gradient(90deg,color-mix(in_srgb,hsl(var(--foreground))_7%,transparent)_1px,transparent_1px)] bg-[size:56px_56px] opacity-20" />
        <div className="absolute inset-0 bg-noise opacity-[0.08] sm:opacity-[0.12]" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-transparent to-background/30" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/35 to-transparent" />

        <motion.div
          aria-hidden="true"
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.95, ease, delay: 0.04 }}
          className="pointer-events-none absolute right-[-0.08em] top-[16%] hidden select-none text-[10rem] font-black leading-none tracking-normal text-primary/10 sm:block sm:text-[clamp(8rem,30vw,22rem)] lg:top-[40%] lg:-translate-y-1/2"
        >
          72H
        </motion.div>

        <div className="relative z-10 page-container page-container-wide max-w-7xl">
          <div className="grid grid-cols-1 gap-8 py-8 sm:py-10 lg:min-h-[calc(100svh-5rem)] lg:items-center lg:gap-12 lg:py-14">
            <div className="flex max-w-3xl flex-col gap-5 sm:gap-6 lg:gap-7">
              <motion.div
                variants={sectionReveal}
                initial="hidden"
                animate="visible"
                className="page-kicker w-fit"
              >
                <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                {greenbookContent.hero.eyebrow}
              </motion.div>

              <motion.h1
                variants={sectionReveal}
                initial="hidden"
                animate="visible"
                className="max-w-[10ch] whitespace-pre-line text-[clamp(3.35rem,14vw,9.5rem)] font-black leading-[0.9] tracking-normal text-foreground"
              >
                {greenbookContent.hero.title}
              </motion.h1>

              <motion.p
                variants={sectionReveal}
                initial="hidden"
                animate="visible"
                className="max-w-xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8 md:text-xl md:leading-8"
              >
                {greenbookContent.hero.lead}
              </motion.p>

              <motion.div
                variants={sectionReveal}
                initial="hidden"
                animate="visible"
                className="flex flex-col gap-3 pt-2 sm:flex-row sm:flex-wrap sm:gap-3"
              >
                <Link
                  to={greenbookContent.hero.ctaPrimary.href}
                  className="premium-button w-full sm:w-auto"
                >
                  {greenbookContent.hero.ctaPrimary.label}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link
                  to={greenbookContent.hero.ctaSecondary.href}
                  className="premium-button-muted w-full sm:w-auto"
                >
                  {greenbookContent.hero.ctaSecondary.label}
                </Link>
              </motion.div>

              <div className="max-w-xl text-xs leading-6 text-muted-foreground sm:text-sm sm:leading-7">
                {greenbookContent.share.footerNote}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="page-section-tight relative pt-8 sm:pt-12">
        <div className="page-container page-container-wide max-w-7xl">
          <div
            ref={contentRef}
            className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(240px,280px)_minmax(0,1fr)] lg:gap-12"
          >
            <ChapterRail
              chapterItems={chapterItems}
              activeChapter={activeChapter}
              progress={progress}
              isEnglish={isEnglish}
            />

            <div className="flex flex-col gap-8 sm:gap-10 lg:gap-14">
              <QuickFactsPanel facts={greenbookContent.quickFacts} isEnglish={isEnglish} />

              <motion.section
                id="holdings"
                data-chapter="holdings"
                ref={registerSection("holdings")}
                variants={sectionReveal}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.24 }}
                className={cn(chapterScrollMargin, "flex flex-col gap-5 sm:gap-6")}
              >
                <SectionHeader
                  eyebrow={isEnglish ? "01 / Holding" : "01 / 持有"}
                  title={isEnglish ? "What does holding `72H` give you?" : "持有 `72H` 能获得什么"}
                  body={isEnglish ? "Holding means access and participation, not governance." : "持有的意义是进入和参与，不是治理。"}
                />
                <div className="border-t border-line/70">
                  {greenbookContent.holdings.map((item, index) => (
                    <article
                      key={item.title}
                      className="grid gap-4 border-b border-line/70 py-5 sm:py-6 lg:grid-cols-[160px_minmax(0,1fr)] lg:gap-8"
                    >
                      <div className="flex items-center justify-between gap-4 lg:flex-col lg:items-start">
                        <span className="text-[10px] font-bold uppercase tracking-[0.32em] text-primary/75">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <h3 className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
                          {item.title}
                        </h3>
                      </div>
                      <p className="max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">
                        {item.body}
                      </p>
                    </article>
                  ))}
                </div>
              </motion.section>

              <motion.section
                id="useCases"
                data-chapter="useCases"
                ref={registerSection("useCases")}
                variants={sectionReveal}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.24 }}
                className={chapterScrollMargin}
              >
                <div className="grid grid-cols-1 gap-0 border-y border-line/70 lg:grid-cols-3">
                  {greenbookContent.useCases.map((item, index) => (
                    <article
                      key={item.title}
                      className={cn(
                        "flex flex-col gap-4 py-5 sm:py-6 lg:px-6",
                        index < greenbookContent.useCases.length - 1 && "border-b border-line/70 lg:border-b-0",
                        index > 0 && "lg:border-l lg:border-line/70",
                        index === 0 && "lg:pl-0",
                        index === greenbookContent.useCases.length - 1 && "lg:pr-0"
                      )}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-primary/80">
                          {item.kicker}
                        </span>
                        <span className="text-[10px] font-mono text-muted-foreground">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
                        {item.title}
                      </h3>
                      <p className="text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">
                        {item.body}
                      </p>
                      <ul className="mt-auto flex flex-col gap-2 border-t border-line/70 pt-3">
                        {item.bullets.map((bullet) => (
                          <li
                            key={bullet}
                            className="flex items-start gap-2 text-sm leading-relaxed text-foreground/90 sm:text-base"
                          >
                            <span className="mt-[0.45rem] h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_10px_rgba(34,197,94,0.35)]" />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </article>
                  ))}
                </div>
              </motion.section>

              <motion.section
                id="businessModel"
                data-chapter="businessModel"
                ref={registerSection("businessModel")}
                variants={sectionReveal}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.24 }}
                className={chapterScrollMargin}
              >
                <div className="grid gap-6 border-y border-line/70 py-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(260px,0.85fr)] lg:gap-10">
                  <div className="flex flex-col gap-4 sm:gap-5">
                    <SectionHeader
                      eyebrow={isEnglish ? "03 / Business" : "03 / 商业"}
                      title={greenbookContent.businessModel.title}
                      body={greenbookContent.businessModel.summary}
                    />
                  </div>

                  <div className="flex flex-col divide-y divide-line/70">
                    {greenbookContent.businessModel.streams.map((stream, index) => (
                      <div
                        key={stream}
                        className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-3 py-4 sm:py-5"
                      >
                        <span className="pt-1 font-mono text-sm text-primary/70">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className="text-sm leading-7 text-foreground/90 sm:text-base sm:leading-8">
                          {stream}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.section>

              <motion.section
                id="supply"
                data-chapter="supply"
                ref={registerSection("supply")}
                variants={sectionReveal}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.24 }}
                className={chapterScrollMargin}
              >
                <div className="grid gap-6 border-y border-line/70 py-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-10">
                  <div className="flex flex-col gap-4 sm:gap-5">
                    <SectionHeader
                      eyebrow={isEnglish ? "04 / Supply" : "04 / 供给"}
                      title={greenbookContent.supply.title}
                      body={greenbookContent.supply.summary}
                    />

                    <div className="border-t border-line/70 pt-4 sm:pt-5">
                      <div className="text-[10px] font-bold uppercase tracking-[0.32em] text-primary/70">
                        {greenbookContent.supply.totalLabel}
                      </div>
                      <div className="mt-2 text-[clamp(2.1rem,5vw,3.3rem)] font-black leading-none tracking-[-0.06em] text-foreground">
                        {greenbookContent.supply.totalSupply}
                      </div>
                      <div className="mt-3 text-xs uppercase tracking-[0.28em] text-muted-foreground sm:text-sm">
                        {greenbookContent.supply.fixedLabel}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <div className="pb-4 text-[10px] font-bold uppercase tracking-[0.32em] text-primary/80 sm:pb-5">
                      {greenbookContent.supply.bucketsLabel}
                    </div>
                    <div className="border-y border-line/70">
                      {greenbookContent.supply.buckets.map((bucket, index) => (
                        <div
                          key={bucket.name}
                          className={cn(
                            "grid grid-cols-1 gap-2 py-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-4 sm:py-5",
                            index < greenbookContent.supply.buckets.length - 1 && "border-b border-line/70"
                          )}
                        >
                          <div className="flex flex-col gap-1">
                            <div className="font-bold tracking-tight text-foreground">
                              {bucket.name}
                            </div>
                            <div className="text-sm leading-7 text-muted-foreground">
                              {bucket.note}
                            </div>
                          </div>
                          <div className="font-mono text-sm text-primary sm:text-right sm:text-base">
                            {bucket.amount}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.section>

              <motion.section
                id="boundaries"
                data-chapter="boundaries"
                ref={registerSection("boundaries")}
                variants={sectionReveal}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.24 }}
                className={chapterScrollMargin}
              >
                <div className="grid gap-6 border-y border-line/70 py-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-10">
                  <SectionHeader
                    eyebrow={isEnglish ? "05 / Boundaries" : "05 / 边界"}
                    title={isEnglish ? "Boundaries" : "边界"}
                    body={isEnglish ? "Public notes clarify scope and expectations." : "公开说明用于明确范围与预期。"}
                  />
                  <div className="grid grid-cols-1 gap-0 border-y border-line/70">
                    {greenbookContent.boundaries.map((item, index) => (
                      <div
                        key={item}
                        className={cn(
                          "flex items-start gap-3 py-4 sm:py-5",
                          index < greenbookContent.boundaries.length - 1 && "border-b border-line/70"
                        )}
                      >
                        <span className="mt-[0.45rem] h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_10px_rgba(34,197,94,0.35)]" />
                        <span className="text-sm leading-7 text-foreground/90 sm:text-base sm:leading-8">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.section>

              <motion.section
                id="goal"
                data-chapter="goal"
                ref={registerSection("goal")}
                variants={sectionReveal}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.24 }}
                className={chapterScrollMargin}
              >
                <div className="border-y border-line/70 py-6 sm:py-8">
                  <div className="grid gap-5 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-10">
                    <SectionHeader
                      eyebrow={isEnglish ? "06 / Goal" : "06 / 目标"}
                      title={isEnglish ? "Goal" : "目标"}
                      body={isEnglish ? "Keep use, participation, and business loops connected." : "让使用、参与和商业循环连在一起。"}
                    />
                    <p className="max-w-4xl text-[clamp(1.15rem,2.5vw,1.9rem)] leading-[1.3] font-normal tracking-tight text-foreground/92">
                      {greenbookContent.goal}
                    </p>
                  </div>
                </div>
              </motion.section>

              <motion.section
                id="share"
                data-chapter="share"
                ref={registerSection("share")}
                variants={sectionReveal}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.18 }}
                className={cn(chapterScrollMargin, "pb-10 sm:pb-16")}
              >
                <div className="border-t border-line/70 pt-8 sm:pt-10">
                  <div className="grid gap-5 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] lg:items-start">
                    <div className="flex flex-col gap-4 sm:gap-5">
                      <div className="page-kicker w-fit">
                        <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                        {isEnglish ? "07 / Share" : "07 / 出口"}
                      </div>
                      <h2 className="text-[clamp(1.7rem,4vw,2.8rem)] font-black tracking-tight text-foreground text-balance">
                        {isEnglish ? "Share Green Book" : "分享绿皮书"}
                      </h2>
                      <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
                        {isEnglish ? "Keep one clean card ready for public sharing." : "保留一张干净的卡片，用来公开分享。"}
                      </p>

                      <p className="max-w-xl text-xs leading-6 text-muted-foreground sm:text-sm sm:leading-7">
                        {isEnglish
                          ? "Generate a clean public card for sharing."
                          : "生成一张干净的公开分享卡。"}
                      </p>
                    </div>

                    <div className="relative">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(34,197,94,0.12),transparent_55%)]" />
                      <div className="relative border-y border-line/70 py-4 sm:py-5">
                        <GreenBookSharePanel className="w-full" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.section>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
