import { useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";
import { motion, useScroll, useSpring } from "motion/react";
import GreenBookSharePanel from "../components/GreenBookSharePanel";
import { LocalizedLink as Link } from "../components/LocalizedLink";
import { getGreenBookContent } from "../content/greenbook";
import { useLocale } from "../lib/locale";
import { cn } from "../lib/utils";

type GreenBookContent = ReturnType<typeof getGreenBookContent>;
type Chapter = GreenBookContent["chapters"][number];
type QuickFact = GreenBookContent["quickFacts"][number];
type EconomyTable = GreenBookContent["economyTable"];
type ClaimUnlock = GreenBookContent["claimUnlock"];
type PathSteps = GreenBookContent["pathSteps"];

const ease = [0.16, 1, 0.3, 1] as const;
const sectionReveal = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.68, ease },
  },
} as const;

const chapterScrollMargin = "scroll-mt-[8.5rem] sm:scroll-mt-[9.75rem] lg:scroll-mt-32";

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
    <div className="flex max-w-3xl flex-col gap-3">
      {eyebrow ? (
        <div className="page-kicker w-fit">
          <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          {eyebrow}
        </div>
      ) : null}
      <h2 className="text-[clamp(1.55rem,3vw,2.55rem)] font-black leading-[1.04] tracking-normal text-foreground text-balance">
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
      animate="visible"
      className="border-y border-line/70 py-5 sm:py-6"
    >
      <div className="mb-4 flex flex-col gap-2 sm:mb-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="page-kicker w-fit">
          <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          {isEnglish ? "72-hour window" : "72 小时窗口"}
        </div>
        <div className="font-mono text-2xl font-bold leading-none text-primary sm:text-3xl">
          72:00:00
        </div>
      </div>

      <div className="grid grid-cols-1 gap-px overflow-hidden rounded-md border border-line/70 bg-line/70 sm:grid-cols-2 xl:grid-cols-4">
        {facts.map((fact, index) => (
          <article key={fact.label} className="min-h-[10.5rem] bg-read-panel/95 p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.28em] text-primary/75">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-muted-foreground">
                {fact.label}
              </span>
            </div>
            <h3 className="mt-5 text-xl font-black leading-tight tracking-normal text-foreground sm:text-2xl">
              {fact.value}
            </h3>
            <p className="mt-3 text-sm leading-6 text-muted-foreground sm:leading-7">
              {fact.body}
            </p>
          </article>
        ))}
      </div>
    </motion.section>
  );
}

function HeroTitle({ title, isEnglish }: { title: string; isEnglish: boolean }) {
  if (!isEnglish && title.includes("，")) {
    const [first, second] = title.split("，");

    return (
      <>
        <span className="block whitespace-nowrap">{first}，</span>
        <span className="block whitespace-nowrap">{second}</span>
      </>
    );
  }

  if (isEnglish && title.includes(". ")) {
    const [first, second] = title.split(". ");

    return (
      <>
        <span className="block">{first}.</span>
        {" "}
        <span className="block">{second}</span>
      </>
    );
  }

  return title;
}

function ChapterRail({
  chapters,
  activeChapter,
  progress,
  isEnglish,
}: {
  chapters: readonly Chapter[];
  activeChapter: string;
  progress: ReturnType<typeof useSpring>;
  isEnglish: boolean;
}) {
  const activeIndex = Math.max(
    chapters.findIndex((chapter) => chapter.id === activeChapter),
    0
  );
  const activeLabel = chapters[activeIndex]?.title ?? chapters[0]?.title ?? "";
  const activeNumber = String(activeIndex + 1).padStart(2, "0");
  const totalNumber = String(chapters.length).padStart(2, "0");

  return (
    <aside className="sticky top-16 z-30 -mx-5 border-y border-line/70 bg-background/92 px-5 py-2.5 backdrop-blur-xl sm:-mx-8 sm:px-8 sm:py-3 sm:top-[4.75rem] lg:mx-0 lg:top-24 lg:z-auto lg:border-0 lg:bg-transparent lg:px-0 lg:py-0 lg:self-start">
      <div className="hidden items-center justify-between gap-3 sm:flex">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.28em] text-primary/80">
            <span className="h-2 w-2 rounded-full bg-primary" />
            {isEnglish ? "Chapters" : "章节"}
          </div>
          <div className="mt-1 truncate text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            {activeLabel}
          </div>
        </div>
        <div className="text-[10px] font-bold uppercase tracking-[0.28em] text-muted-foreground">
          {activeNumber}/{totalNumber}
        </div>
      </div>

      <div className="h-px overflow-hidden rounded-full bg-line/70 sm:mt-3 lg:mt-4">
        <motion.div className="h-full w-full origin-left bg-primary" style={{ scaleX: progress }} />
      </div>

      <nav
        aria-label={isEnglish ? "Green Book chapters" : "绿皮书章节"}
        className="mt-2 flex snap-x snap-mandatory gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:mt-3 [&::-webkit-scrollbar]:hidden lg:mt-4 lg:flex-col lg:overflow-visible lg:pb-0"
      >
        {chapters.map((chapter, index) => {
          const isActive = activeChapter === chapter.id;

          return (
            <a
              key={chapter.id}
              href={`#${chapter.id}`}
              aria-current={isActive ? "location" : undefined}
              className={cn(
                "group inline-flex min-h-10 shrink-0 snap-start items-center gap-2 rounded-full border px-3 py-2 text-sm font-semibold tracking-normal transition-colors transition-transform sm:min-h-11 sm:gap-3 sm:px-4 sm:py-3 lg:grid lg:w-full lg:grid-cols-[2rem_minmax(0,1fr)] lg:gap-3 lg:rounded-md lg:px-4 lg:py-3",
                isActive
                  ? "border-primary/30 bg-primary/10 text-primary shadow-[0_0_20px_rgba(34,197,94,0.08)]"
                  : "border-line/70 bg-surface/60 text-muted-foreground hover:border-primary/30 hover:text-foreground"
              )}
            >
              <span
                className={cn(
                  "font-mono text-[10px] font-bold uppercase tracking-[0.2em]",
                  isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary"
                )}
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="max-w-[12rem] truncate lg:max-w-none">{chapter.title}</span>
            </a>
          );
        })}
      </nav>
    </aside>
  );
}

function EconomyTables({
  economyTable,
  isEnglish,
}: {
  economyTable: EconomyTable;
  isEnglish: boolean;
}) {
  return (
    <div className="grid gap-5 pt-2">
      <div className="max-w-3xl">
        <h3 className="text-xl font-black tracking-normal text-foreground sm:text-2xl">
          {economyTable.title}
        </h3>
        <p className="mt-2 text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">
          {economyTable.summary}
        </p>
      </div>

      <div className="grid gap-5 2xl:grid-cols-2">
        <div className="overflow-hidden rounded-md border border-line/70 bg-read-panel/70">
          <div className="border-b border-line/70 px-4 py-3 text-[10px] font-bold uppercase tracking-[0.28em] text-primary/80 sm:px-5">
            {economyTable.allocationTitle}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] border-collapse text-left">
              <thead>
                <tr className="border-b border-line/70 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                  <th className="px-4 py-3 font-bold sm:px-5">{isEnglish ? "Module" : "模块"}</th>
                  <th className="px-4 py-3 font-bold">{isEnglish ? "Amount" : "数量"}</th>
                  <th className="px-4 py-3 font-bold">{isEnglish ? "Share" : "占比"}</th>
                  <th className="px-4 py-3 font-bold sm:px-5">{isEnglish ? "Role" : "作用"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/70">
                {economyTable.allocations.map((row) => (
                  <tr key={row.name} className="align-top text-sm leading-6 text-foreground/90">
                    <td className="px-4 py-4 font-bold text-foreground sm:px-5">{row.name}</td>
                    <td className="px-4 py-4 font-mono text-primary">{row.amount}</td>
                    <td className="px-4 py-4 font-mono text-foreground">{row.share}</td>
                    <td className="px-4 py-4 text-muted-foreground sm:px-5">{row.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="overflow-hidden rounded-md border border-line/70 bg-read-panel/70">
          <div className="border-b border-line/70 px-4 py-3 text-[10px] font-bold uppercase tracking-[0.28em] text-primary/80 sm:px-5">
            {economyTable.roundTitle}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px] border-collapse text-left">
              <thead>
                <tr className="border-b border-line/70 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                  <th className="px-4 py-3 font-bold sm:px-5">{isEnglish ? "Lane" : "战线"}</th>
                  <th className="px-4 py-3 font-bold">{isEnglish ? "Share" : "比例"}</th>
                  <th className="px-4 py-3 font-bold">{isEnglish ? "Amount" : "数量"}</th>
                  <th className="px-4 py-3 font-bold sm:px-5">{isEnglish ? "Meaning" : "意义"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/70">
                {economyTable.roundAllocations.map((row) => (
                  <tr key={row.lane} className="align-top text-sm leading-6 text-foreground/90">
                    <td className="px-4 py-4 font-bold text-foreground sm:px-5">{row.lane}</td>
                    <td className="px-4 py-4 font-mono text-primary">{row.share}</td>
                    <td className="px-4 py-4 font-mono text-foreground">{row.amount}</td>
                    <td className="px-4 py-4 text-muted-foreground sm:px-5">{row.meaning}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function ClaimUnlockPanel({
  claimUnlock,
  isEnglish,
}: {
  claimUnlock: ClaimUnlock;
  isEnglish: boolean;
}) {
  return (
    <div className="grid gap-5 pt-2">
      <div className="max-w-4xl">
        <h3 className="text-xl font-black tracking-normal text-foreground sm:text-2xl">
          {claimUnlock.title}
        </h3>
        <p className="mt-2 text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">
          {claimUnlock.summary}
        </p>
      </div>

      <div className="grid gap-px overflow-hidden rounded-md border border-line/70 bg-line/70 md:grid-cols-2">
        <article className="bg-read-panel/90 p-4 sm:p-5">
          <div className="text-[10px] font-bold uppercase tracking-[0.28em] text-primary/80">
            {claimUnlock.routeTitle}
          </div>
          <p className="mt-3 font-mono text-sm leading-7 text-foreground sm:text-base">
            {claimUnlock.route}
          </p>
        </article>
        <article className="bg-read-panel/90 p-4 sm:p-5">
          <div className="text-[10px] font-bold uppercase tracking-[0.28em] text-primary/80">
            {claimUnlock.timingTitle}
          </div>
          <p className="mt-3 text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">
            {claimUnlock.timing}
          </p>
        </article>
      </div>

      <div className="overflow-hidden rounded-md border border-line/70 bg-read-panel/70">
        <div className="border-b border-line/70 px-4 py-3 text-[10px] font-bold uppercase tracking-[0.28em] text-primary/80 sm:px-5">
          {claimUnlock.scheduleTitle}
        </div>
        <p className="border-b border-line/70 px-4 py-3 text-xs leading-6 text-foreground/85 sm:px-5 sm:text-sm">
          {claimUnlock.scheduleNotice}
        </p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] border-collapse text-left">
            <thead>
              <tr className="border-b border-line/70 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                <th className="px-4 py-3 font-bold sm:px-5">{isEnglish ? "Mechanism threshold" : "机制阈值"}</th>
                <th className="px-4 py-3 font-bold">{isEnglish ? "Unlocked" : "解锁"}</th>
                <th className="px-4 py-3 font-bold sm:px-5">{isEnglish ? "Rule" : "规则"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/70">
              {claimUnlock.schedule.map((row) => (
                <tr key={row.price} className="align-top text-sm leading-6 text-foreground/90">
                  <td className="px-4 py-4 font-mono text-primary sm:px-5">{row.price}</td>
                  <td className="px-4 py-4 font-bold text-foreground">{row.unlock}</td>
                  <td className="px-4 py-4 text-muted-foreground sm:px-5">{row.detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="border-y border-line/70 py-4 text-sm leading-7 text-foreground/88 sm:text-base sm:leading-8">
        {claimUnlock.note}
      </p>
    </div>
  );
}

function PathStepCards({ pathSteps }: { pathSteps: PathSteps }) {
  return (
    <div className="grid gap-4 pt-2">
      <div className="max-w-3xl">
        <h3 className="text-xl font-black tracking-normal text-foreground sm:text-2xl">
          {pathSteps.title}
        </h3>
        <p className="mt-2 text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">
          {pathSteps.summary}
        </p>
      </div>
      <div className="grid grid-cols-1 gap-px overflow-hidden rounded-md border border-line/70 bg-line/70 md:grid-cols-2 xl:grid-cols-4">
        {pathSteps.steps.map((step) => (
          <article key={step.title} className="min-h-[13rem] bg-read-panel/90 p-4 sm:p-5">
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.28em] text-primary">
              {step.kicker}
            </span>
            <h4 className="mt-4 text-lg font-black tracking-normal text-foreground">{step.title}</h4>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">{step.body}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

function ChapterDisclosure({
  chapter,
  registerChapter,
  children,
}: {
  chapter: Chapter;
  registerChapter: (node: HTMLElement | null) => void;
  children?: React.ReactNode;
}) {
  return (
    <details
      id={chapter.id}
      data-chapter={chapter.id}
      ref={registerChapter}
      open={chapter.defaultOpen}
      className={cn(
        chapterScrollMargin,
        "group overflow-hidden rounded-md border border-line/70 bg-read-panel/65"
      )}
    >
      <summary className="grid cursor-pointer list-none gap-4 px-4 py-5 outline-none transition-colors hover:bg-surface/45 focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:px-5 sm:py-6 [&::-webkit-details-marker]:hidden">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="text-[10px] font-bold uppercase tracking-[0.28em] text-primary/80">
              {chapter.eyebrow}
            </div>
            <h2 className="mt-2 text-[clamp(1.35rem,2.8vw,2.2rem)] font-black leading-tight tracking-normal text-foreground text-balance">
              {chapter.title}
            </h2>
          </div>
          <span className="mt-1 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-line/70 bg-surface/70 text-primary">
            <ChevronDown className="h-5 w-5 transition-transform duration-200 group-open:rotate-180" />
          </span>
        </div>
        <p className="max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">
          {chapter.summary}
        </p>
      </summary>

      <div className="border-t border-line/70 px-4 py-5 sm:px-5 sm:py-6">
        <div className="grid gap-4">
          {chapter.paragraphs.map((paragraph) => (
            <p key={paragraph} className="max-w-4xl text-sm leading-7 text-foreground/88 sm:text-base sm:leading-8">
              {paragraph}
            </p>
          ))}
        </div>

        {chapter.bullets.length > 0 ? (
          <ul className="mt-5 grid gap-2 border-y border-line/70 py-4 sm:grid-cols-3">
            {chapter.bullets.map((bullet) => (
              <li key={bullet} className="flex items-start gap-3 text-sm leading-6 text-foreground/90">
                <span className="mt-[0.45rem] h-1.5 w-1.5 shrink-0 rounded-full bg-primary shadow-[0_0_10px_rgba(34,197,94,0.35)]" />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        ) : null}

        {children ? <div className="mt-6">{children}</div> : null}
      </div>
    </details>
  );
}

export default function GreenBook() {
  const { locale } = useLocale();
  const isEnglish = locale === "en-US";
  const greenbookContent = getGreenBookContent(locale);
  const chapterRefs = useRef<Record<string, HTMLElement | null>>({});
  const [activeChapter, setActiveChapter] = useState(greenbookContent.chapters[0]?.id ?? "");
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 28,
    mass: 0.15,
  });

  useEffect(() => {
    setActiveChapter(getGreenBookContent(locale).chapters[0]?.id ?? "");
  }, [locale]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => right.intersectionRatio - left.intersectionRatio)[0];

        const nextId = visible?.target.getAttribute("data-chapter");
        if (nextId) {
          setActiveChapter(nextId);
        }
      },
      {
        rootMargin: "-28% 0px -58% 0px",
        threshold: [0.12, 0.28, 0.48, 0.72],
      }
    );

    Object.values(chapterRefs.current).forEach((node) => {
      if (node) observer.observe(node);
    });

    return () => observer.disconnect();
  }, [locale]);

  const registerChapter = (id: string) => (node: HTMLElement | null) => {
    chapterRefs.current[id] = node;
  };

  return (
    <div className="page-shell pt-20 sm:pt-24">
      <section className="relative isolate overflow-hidden border-b border-line/70 px-5 sm:px-8 lg:px-16">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,color-mix(in_srgb,hsl(var(--foreground))_4%,transparent)_0%,transparent_42%),radial-gradient(circle_at_16%_18%,color-mix(in_srgb,hsl(var(--primary))_14%,transparent),transparent_30%),radial-gradient(circle_at_84%_12%,color-mix(in_srgb,hsl(var(--gold))_10%,transparent),transparent_26%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(color-mix(in_srgb,hsl(var(--foreground))_7%,transparent)_1px,transparent_1px),linear-gradient(90deg,color-mix(in_srgb,hsl(var(--foreground))_7%,transparent)_1px,transparent_1px)] bg-[size:56px_56px] opacity-20" />
        <div className="absolute inset-0 bg-noise opacity-[0.08] sm:opacity-[0.12]" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-transparent to-background/35" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/35 to-transparent" />

        <motion.div
          aria-hidden="true"
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.95, ease, delay: 0.04 }}
          className="pointer-events-none absolute right-[-0.08em] top-[18%] select-none text-[7rem] font-black leading-none tracking-normal text-primary/10 sm:text-[clamp(8rem,30vw,22rem)] lg:top-[42%] lg:-translate-y-1/2"
        >
          72H
        </motion.div>

        <div className="relative z-10 page-container page-container-wide max-w-7xl">
          <div className="grid gap-7 py-9 sm:gap-8 sm:py-11 lg:min-h-[calc(100svh-5rem)] lg:content-center lg:py-14">
            <div className="flex max-w-4xl flex-col gap-5 sm:gap-6 lg:gap-7">
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
                className="max-w-[12ch] text-[clamp(3rem,12vw,8.5rem)] font-black leading-[0.92] tracking-normal text-foreground"
              >
                <HeroTitle title={greenbookContent.hero.title} isEnglish={isEnglish} />
              </motion.h1>

              <motion.p
                variants={sectionReveal}
                initial="hidden"
                animate="visible"
                className="max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8 md:text-xl md:leading-9"
              >
                {greenbookContent.hero.lead}
              </motion.p>

              <motion.div
                variants={sectionReveal}
                initial="hidden"
                animate="visible"
                className="border-y border-line/70 py-4 sm:py-5"
              >
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.28em] text-primary/80">
                  {greenbookContent.manifesto.kicker}
                </p>
                <h2 className="mt-3 max-w-3xl text-xl font-black leading-tight tracking-normal text-foreground sm:text-2xl">
                  {greenbookContent.manifesto.title}
                </h2>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">
                  {greenbookContent.manifesto.body}
                </p>
              </motion.div>

              <motion.div
                variants={sectionReveal}
                initial="hidden"
                animate="visible"
                className="flex flex-col gap-3 pt-1 sm:flex-row sm:flex-wrap"
              >
                <Link to={greenbookContent.hero.ctaPrimary.href} className="premium-button w-full sm:w-auto">
                  {greenbookContent.hero.ctaPrimary.label}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link to={greenbookContent.hero.ctaSecondary.href} className="premium-button-muted w-full sm:w-auto">
                  {greenbookContent.hero.ctaSecondary.label}
                </Link>
              </motion.div>
            </div>

            <QuickFactsPanel facts={greenbookContent.quickFacts} isEnglish={isEnglish} />
          </div>
        </div>
      </section>

      <section className="page-section-tight relative pt-5 sm:pt-12">
        <div className="page-container page-container-wide max-w-7xl">
          <div className="relative grid grid-cols-1 gap-8 lg:grid-cols-[minmax(240px,280px)_minmax(0,1fr)] lg:gap-12">
            <ChapterRail
              chapters={greenbookContent.chapters}
              activeChapter={activeChapter}
              progress={progress}
              isEnglish={isEnglish}
            />

            <div className="flex flex-col gap-5 sm:gap-6 lg:gap-8">
              {greenbookContent.chapters.map((chapter) => (
                <ChapterDisclosure
                  key={chapter.id}
                  chapter={chapter}
                  registerChapter={registerChapter(chapter.id)}
                >
                  {chapter.id === "economy" ? (
                    <div className="grid gap-6">
                      <EconomyTables economyTable={greenbookContent.economyTable} isEnglish={isEnglish} />
                      <ClaimUnlockPanel claimUnlock={greenbookContent.claimUnlock} isEnglish={isEnglish} />
                    </div>
                  ) : null}
                  {chapter.id === "path" ? <PathStepCards pathSteps={greenbookContent.pathSteps} /> : null}
                </ChapterDisclosure>
              ))}

              <motion.section
                variants={sectionReveal}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.22 }}
                className="border-y border-line/70 py-7 sm:py-9"
              >
                <div className="grid gap-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-10">
                  <SectionHeader
                    eyebrow={isEnglish ? "Closing" : "结语"}
                    title={greenbookContent.closing.title}
                    body={greenbookContent.closing.body}
                  />
                  <div className="grid gap-4">
                    <ul className="grid gap-2">
                      {greenbookContent.closing.bullets.map((bullet) => (
                        <li key={bullet} className="flex items-start gap-3 text-sm leading-7 text-foreground/90 sm:text-base">
                          <span className="mt-[0.55rem] h-1.5 w-1.5 shrink-0 rounded-full bg-primary shadow-[0_0_10px_rgba(34,197,94,0.35)]" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="border-t border-line/70 pt-4 text-xs leading-6 text-muted-foreground sm:text-sm sm:leading-7">
                      {greenbookContent.closing.footerNote}
                    </p>
                  </div>
                </div>
              </motion.section>

              <motion.section
                variants={sectionReveal}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.18 }}
                className="pb-10 sm:pb-16"
              >
                <div className="border-t border-line/70 pt-8 sm:pt-10">
                  <div className="grid gap-5 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] lg:items-start">
                    <div className="flex flex-col gap-4 sm:gap-5">
                      <div className="page-kicker w-fit">
                        <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                        {isEnglish ? "Share" : "分享"}
                      </div>
                      <h2 className="text-[clamp(1.7rem,4vw,2.8rem)] font-black tracking-normal text-foreground text-balance">
                        {isEnglish ? "Share the short version" : "分享短版传播点"}
                      </h2>
                      <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
                        {isEnglish
                          ? "The card keeps the public message short while the page carries the full reading experience."
                          : "分享卡只保留短版传播点，完整长文留在页面里阅读。"}
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
