import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion, useScroll, useSpring } from "motion/react";
import GreenBookSharePanel from "../components/GreenBookSharePanel";
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

const ease = [0.16, 1, 0.3, 1] as const;
const sectionReveal = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.72, ease },
  },
} as const;

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
    <div className="flex max-w-3xl flex-col gap-3 sm:gap-4">
      {eyebrow ? (
        <div className="page-kicker w-fit">
          <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          {eyebrow}
        </div>
      ) : null}
      <h2 className="text-[clamp(1.4rem,3.4vw,2.35rem)] font-bold tracking-tight text-foreground text-balance">
        {title}
      </h2>
      {body ? <p className="page-lead max-w-2xl">{body}</p> : null}
    </div>
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
      <section className="relative isolate overflow-hidden border-b border-white/6">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.03)_0%,rgba(255,255,255,0.01)_18%,transparent_52%),radial-gradient(circle_at_16%_18%,rgba(34,197,94,0.14),transparent_30%),radial-gradient(circle_at_84%_12%,rgba(34,197,94,0.08),transparent_26%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:56px_56px] opacity-14 mix-blend-overlay" />
        <div className="absolute inset-0 bg-noise opacity-[0.08] sm:opacity-[0.12]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/30" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/35 to-transparent" />

        <motion.div
          aria-hidden="true"
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.95, ease, delay: 0.04 }}
          className="pointer-events-none absolute left-1/2 top-[15%] -translate-x-1/2 select-none text-[clamp(8rem,30vw,22rem)] font-black leading-none tracking-[-0.1em] text-primary/10 sm:left-auto sm:right-[-0.06em] sm:top-[48%] sm:-translate-y-1/2"
        >
          72H
        </motion.div>

        <div className="relative z-10 page-container page-container-wide max-w-7xl">
          <div className="grid min-h-[auto] grid-cols-1 gap-7 py-6 sm:py-10 lg:min-h-[calc(100svh-5rem)] lg:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.92fr)] lg:items-end lg:gap-12 lg:py-14">
            <div className="flex flex-col gap-8 pt-1 sm:pt-3 lg:min-h-full lg:justify-between lg:pt-0">
              <div className="flex max-w-3xl flex-col gap-4 sm:gap-5">
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
                  className="text-[clamp(3.5rem,15vw,10.5rem)] font-black leading-[0.9] tracking-[-0.08em] text-foreground drop-shadow-[0_0_20px_rgba(34,197,94,0.12)] sm:text-[clamp(4.25rem,18vw,10.5rem)]"
                >
                  {greenbookContent.hero.title}
                </motion.h1>

                <motion.p
                  variants={sectionReveal}
                  initial="hidden"
                  animate="visible"
                  className="max-w-xl text-base leading-[1.75] text-white/68 sm:text-lg sm:leading-relaxed md:text-xl"
                >
                  {greenbookContent.hero.lead}
                </motion.p>
              </div>

              <motion.div
                variants={sectionReveal}
                initial="hidden"
                animate="visible"
                className="flex flex-col gap-4 sm:gap-5"
              >
                <div className="h-px w-full bg-white/10" />
                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-3">
                  <Link
                    to={greenbookContent.hero.ctaPrimary.href}
                    className="inline-flex min-h-12 w-full items-center justify-center rounded-full border border-primary/25 bg-primary px-6 py-3 text-xs font-bold uppercase tracking-[0.24em] text-primary-foreground shadow-[0_0_24px_rgba(34,197,94,0.22)] transition-transform hover:scale-[1.01] active:scale-95 sm:min-h-0 sm:w-auto sm:rounded-sm sm:text-sm sm:tracking-widest"
                  >
                    {greenbookContent.hero.ctaPrimary.label}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                  <Link
                    to={greenbookContent.hero.ctaSecondary.href}
                    className="inline-flex min-h-12 w-full items-center justify-center rounded-full border border-white/10 bg-secondary/10 px-6 py-3 text-xs font-bold uppercase tracking-[0.18em] text-foreground transition-colors hover:border-primary/30 hover:text-primary sm:min-h-0 sm:w-auto sm:rounded-sm sm:text-sm sm:tracking-widest"
                  >
                    {greenbookContent.hero.ctaSecondary.label}
                  </Link>
                </div>
                <div className="max-w-xl text-xs leading-relaxed text-muted-foreground sm:text-sm">
                  {greenbookContent.share.footerNote}
                </div>
              </motion.div>
            </div>

            <motion.div
              variants={sectionReveal}
              initial="hidden"
              animate="visible"
              className="relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/28 px-4 py-5 shadow-[0_0_40px_rgba(0,0,0,0.18)] backdrop-blur-[2px] sm:px-5 sm:py-6 lg:rounded-[1.75rem] lg:px-6 lg:py-7"
            >
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.022)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.022)_1px,transparent_1px)] bg-[size:24px_24px] opacity-20" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(34,197,94,0.14),transparent_58%)]" />

              <div className="relative z-10 flex flex-col gap-5">
                <div className="flex items-center justify-between gap-4 px-1 sm:px-0">
                  <div className="text-[10px] font-bold uppercase tracking-[0.36em] text-primary/80 sm:text-xs">
                    {greenbookContent.hero.eyebrow}
                  </div>
                  <div className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
                  {isEnglish ? "72H / Green Book" : "72H / 绿书"}
                </div>
                </div>

                <div className="relative overflow-hidden border-y border-white/10">
                  <div className="pointer-events-none absolute right-[-0.06em] bottom-[-0.08em] select-none text-[clamp(7rem,24vw,19rem)] font-black leading-none tracking-[-0.1em] text-primary/10">
                    72H
                  </div>
                  <div className="grid gap-0">
                    {greenbookContent.quickFacts.map((fact, index) => (
                      <div
                        key={fact.label}
                        className="grid gap-3 border-b border-white/10 px-1 py-4 sm:grid-cols-[110px_minmax(0,1fr)] sm:gap-5 sm:px-0 lg:py-5"
                      >
                        <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-start">
                          <span className="text-[10px] font-bold uppercase tracking-[0.32em] text-primary/75">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <span className="text-[10px] font-bold uppercase tracking-[0.32em] text-muted-foreground">
                            {fact.label}
                          </span>
                        </div>
                        <div className="flex flex-col gap-2">
                          <div className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
                            {fact.value}
                          </div>
                          <p className="text-sm leading-relaxed text-white/72 sm:text-base">
                            {fact.body}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="page-section-tight relative">
        <div className="page-container page-container-wide max-w-7xl flex flex-col gap-8 lg:gap-10">
          <div
            ref={contentRef}
            className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(240px,280px)_minmax(0,1fr)] lg:gap-12"
          >
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <div className="hidden items-center justify-between gap-4 border-b border-white/10 pb-4 lg:flex">
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.32em] text-primary/70">
                  <span className="h-2 w-2 rounded-full bg-primary" />
                  {isEnglish ? "Chapters" : "章节"}
                </div>
                <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                  {isEnglish ? "Scroll" : "滚动"}
                </div>
              </div>

              <div className="mb-4 hidden lg:block">
                <div className="h-px w-full overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    className="h-full w-full origin-left bg-primary"
                    style={{ scaleX: progress }}
                  />
                </div>
              </div>

              <nav
                aria-label={isEnglish ? "Green Book chapters" : "绿书章节"}
                className="scrollbar-none -mx-5 flex snap-x snap-mandatory gap-2 overflow-x-auto pb-2 px-5 sm:-mx-8 sm:px-8 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0"
              >
                {chapterItems.map((item, index) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className={cn(
                      "shrink-0 snap-start rounded-full border px-4 py-3 text-xs font-bold uppercase tracking-widest transition-all lg:rounded-sm sm:text-sm",
                      activeChapter === item.id
                        ? "border-primary/30 bg-primary/12 text-primary shadow-[0_0_20px_rgba(34,197,94,0.08)]"
                        : "border-white/10 bg-secondary/10 text-muted-foreground hover:border-primary/20 hover:text-foreground"
                    )}
                  >
                    <span className="mr-2 text-[10px] font-mono text-muted-foreground">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {item.label}
                  </a>
                ))}
              </nav>
            </aside>

            <div className="flex flex-col gap-10 sm:gap-12 lg:gap-14">
              <motion.section
                id="holdings"
                data-chapter="holdings"
                ref={registerSection("holdings")}
                variants={sectionReveal}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.24 }}
                className="scroll-mt-28 flex flex-col gap-5 sm:gap-6"
              >
                <SectionHeader
                  eyebrow={isEnglish ? "01 / Holding" : "01 / 持有"}
                  title={isEnglish ? "What does holding `72H` give you?" : "持有 `72H` 能获得什么"}
                  body={isEnglish ? "Holding means access and participation, not governance." : "持有的意义是进入和参与，不是治理。"}
                />
                <div className="border-t border-white/10">
                  {greenbookContent.holdings.map((item, index) => (
                    <article
                      key={item.title}
                      className="grid gap-4 border-b border-white/10 py-5 sm:py-6 lg:grid-cols-[160px_minmax(0,1fr)] lg:gap-8"
                    >
                      <div className="flex items-center justify-between gap-4 lg:flex-col lg:items-start">
                        <span className="text-[10px] font-bold uppercase tracking-[0.32em] text-primary/75">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <h3 className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
                          {item.title}
                        </h3>
                      </div>
                      <p className="max-w-3xl text-sm font-light leading-relaxed text-muted-foreground sm:text-base">
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
                className="scroll-mt-28 flex flex-col gap-5 sm:gap-6"
              >
                <SectionHeader
                  eyebrow={isEnglish ? "02 / Scenarios" : "02 / 场景"}
                  title={isEnglish ? "Three use scenarios" : "三大使用场景"}
                  body={isEnglish ? "`72H` is not an abstract story. It is built around real use, participation, and learning." : "`72H` 不是抽象叙事，它围绕真实使用、参与和学习展开。"}
                />

                <div className="grid grid-cols-1 border-y border-white/10 lg:grid-cols-3">
                  {greenbookContent.useCases.map((item, index) => (
                    <article
                      key={item.title}
                      className={cn(
                        "flex flex-col gap-4 py-5 sm:py-6 lg:px-6",
                        index < greenbookContent.useCases.length - 1 && "border-b border-white/10 lg:border-b-0",
                        index > 0 && "lg:border-l lg:border-white/10",
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
                      <p className="text-sm font-light leading-relaxed text-muted-foreground sm:text-base">
                        {item.body}
                      </p>
                      <ul className="mt-auto flex flex-col gap-2 border-t border-white/10 pt-3">
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
                className="scroll-mt-28"
              >
                <div className="grid gap-6 border-y border-white/10 py-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(260px,0.85fr)] lg:gap-10">
                  <div className="flex flex-col gap-4 sm:gap-5">
                    <SectionHeader
                      eyebrow={isEnglish ? "03 / Business" : "03 / 商业"}
                      title={greenbookContent.businessModel.title}
                      body={greenbookContent.businessModel.summary}
                    />
                  </div>

                  <div className="flex flex-col divide-y divide-white/10">
                    {greenbookContent.businessModel.streams.map((stream, index) => (
                      <div
                        key={stream}
                        className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-3 py-4 sm:py-5"
                      >
                        <span className="text-[10px] font-mono text-primary/70 pt-1">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className="text-sm leading-relaxed text-foreground/90 sm:text-base">
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
                className="scroll-mt-28"
              >
                <div className="grid gap-6 border-y border-white/10 py-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-10">
                  <div className="flex flex-col gap-4 sm:gap-5">
                    <SectionHeader
                      eyebrow={isEnglish ? "04 / Supply" : "04 / 供给"}
                      title={greenbookContent.supply.title}
                      body={greenbookContent.supply.summary}
                    />

                    <div className="border-t border-white/10 pt-4 sm:pt-5">
                      <div className="text-[10px] font-bold uppercase tracking-[0.32em] text-primary/70">
                        {isEnglish ? "Total supply" : "Total Supply"}
                      </div>
                      <div className="mt-2 text-[clamp(2.1rem,5vw,3.3rem)] font-black leading-none tracking-[-0.06em] text-foreground">
                        {greenbookContent.supply.totalSupply}
                      </div>
                      <div className="mt-3 text-xs uppercase tracking-[0.28em] text-muted-foreground sm:text-sm">
                        {isEnglish ? "Fixed supply" : "Fixed supply"}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <div className="pb-4 text-[10px] font-bold uppercase tracking-[0.32em] text-primary/80 sm:pb-5">
                      {isEnglish ? "Buckets" : "Buckets"}
                    </div>
                    <div className="border-y border-white/10">
                      {greenbookContent.supply.buckets.map((bucket, index) => (
                        <div
                          key={bucket.name}
                          className={cn(
                            "grid grid-cols-1 gap-2 py-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-4 sm:py-5",
                            index < greenbookContent.supply.buckets.length - 1 && "border-b border-white/10"
                          )}
                        >
                          <div className="flex flex-col gap-1">
                            <div className="font-bold tracking-tight text-foreground">
                              {bucket.name}
                            </div>
                            <div className="text-sm leading-relaxed text-muted-foreground">
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
                className="scroll-mt-28"
              >
                <div className="grid gap-6 border-y border-white/10 py-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-10">
                  <SectionHeader
                    eyebrow={isEnglish ? "05 / Boundaries" : "05 / 边界"}
                    title={isEnglish ? "Boundaries" : "边界"}
                    body={isEnglish ? "Public notes only explain the scope clearly." : "公开说明只负责把范围说清楚。"}
                  />
                  <div className="grid grid-cols-1 gap-0 border-y border-white/10">
                    {greenbookContent.boundaries.map((item, index) => (
                      <div
                        key={item}
                        className={cn(
                          "flex items-start gap-3 py-4 sm:py-5",
                          index < greenbookContent.boundaries.length - 1 && "border-b border-white/10"
                        )}
                      >
                        <span className="mt-[0.45rem] h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_10px_rgba(34,197,94,0.35)]" />
                        <span className="text-sm leading-relaxed text-foreground/90 sm:text-base">
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
                className="scroll-mt-28"
              >
                <div className="border-y border-white/10 py-6 sm:py-8">
                  <div className="grid gap-5 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-10">
                    <SectionHeader
                      eyebrow={isEnglish ? "06 / Goal" : "06 / 目标"}
                      title={isEnglish ? "Goal" : "目标"}
                      body={isEnglish ? "Keep use, participation, and business loops connected." : "让使用、参与和商业循环连在一起。"}
                    />
                    <p className="max-w-4xl text-[clamp(1.15rem,2.5vw,1.9rem)] leading-[1.28] font-light tracking-tight text-foreground/92">
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
                className="scroll-mt-28 pb-10 sm:pb-16"
              >
                <div className="border-t border-white/10 pt-8 sm:pt-10">
                  <div className="grid gap-5 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] lg:items-start">
                    <div className="flex flex-col gap-4 sm:gap-5">
                      <div className="page-kicker w-fit">
                        <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                        {isEnglish ? "07 / Share" : "07 / 出口"}
                      </div>
                      <h2 className="text-[clamp(1.7rem,4vw,2.8rem)] font-black tracking-tight text-foreground text-balance">
                        {isEnglish ? "Share Green Book" : "分享绿书"}
                      </h2>
                      <p className="page-lead max-w-2xl">
                        {isEnglish ? "Keep one clean card ready for public sharing." : "保留一张干净的卡片，用来公开分享。"}
                      </p>

                      <p className="max-w-xl text-xs leading-relaxed text-muted-foreground sm:text-sm">
                        {isEnglish
                          ? "This section exists for distribution, not for adding extra explanation."
                          : "这一块只负责传播，不再增加额外说明。"}
                      </p>
                    </div>

                    <div className="relative">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(34,197,94,0.12),transparent_55%)]" />
                      <div className="relative border-y border-white/10 py-4 sm:py-5">
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
