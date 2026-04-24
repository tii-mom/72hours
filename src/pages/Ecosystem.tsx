import { useState, type ReactNode } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Beaker,
  Box,
  CheckCircle,
  ChevronDown,
  GitBranch,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { LocalizedLink as Link } from "../components/LocalizedLink";
import { Reveal } from "../components/Reveal";
import { getProjects } from "../content/projects";
import { useLocale } from "../lib/locale";
import type { Project, ProjectSignalTone } from "../lib/content-types";
import { cn } from "../lib/utils";

const projectIcons: Record<NonNullable<Project["iconKey"]>, ReactNode> = {
  box: <Box size={20} />,
  beaker: <Beaker size={20} />,
  check: <CheckCircle size={20} />,
  spark: <Sparkles size={20} />,
  shield: <ShieldCheck size={20} />,
  relay: <GitBranch size={20} />,
};

const statusLabels = {
  "zh-CN": {
    live: "在线",
    beta: "测试",
    waitlist: "候补",
    community_pilot: "试点",
    coming_soon: "即将",
    archived: "归档",
  },
  "en-US": {
    live: "Live",
    beta: "Beta",
    waitlist: "Waitlist",
    community_pilot: "Pilot",
    coming_soon: "Soon",
    archived: "Archived",
  },
} as const;

const statusBadgeClasses: Record<Project["status"], string> = {
  live: "border-primary/25 bg-primary/10 text-primary",
  beta: "border-cyan-500/20 bg-cyan-500/10 text-cyan-400",
  waitlist: "border-line/70 bg-background/40 text-muted-foreground",
  community_pilot: "border-gold/30 bg-gold/10 text-gold",
  coming_soon: "border-line/70 bg-background/40 text-muted-foreground",
  archived: "border-line/70 bg-background/40 text-muted-foreground",
};

const signalToneClasses: Record<ProjectSignalTone, string> = {
  new: "border-primary/25 bg-primary/10 text-primary",
  hot: "border-gold/35 bg-gold/10 text-gold",
  core: "border-line/80 bg-surface text-foreground",
  guide: "border-line/70 bg-background/40 text-muted-foreground",
};

function getDomain(url: string) {
  if (!url.startsWith("http")) return undefined;

  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return undefined;
  }
}

function AppIcon({ project }: { project: Project }) {
  const icon = project.iconKey ? projectIcons[project.iconKey] : <Box size={20} />;

  if (project.logoSrc) {
    return (
      <img
        src={project.logoSrc}
        alt={project.logoAlt ?? `${project.name} logo`}
        loading="lazy"
        decoding="async"
        className="h-full w-full object-contain p-1.5"
      />
    );
  }

  return icon;
}

function StatusBadge({ project, locale }: { project: Project; locale: "zh-CN" | "en-US" }) {
  return (
    <span
      className={cn(
        "inline-flex min-h-8 items-center rounded-sm border px-2.5 text-[10px] font-bold uppercase tracking-widest",
        statusBadgeClasses[project.status],
      )}
    >
      {statusLabels[locale][project.status]}
    </span>
  );
}

function ProjectSignals({ project }: { project: Project }) {
  if (!project.signals?.length) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {project.signals.map((signal) => (
        <span
          key={`${project.slug}-${signal.label}`}
          className={cn(
            "inline-flex min-h-7 items-center rounded-sm border px-2.5 text-[10px] font-bold uppercase tracking-widest",
            signalToneClasses[signal.tone],
          )}
        >
          {signal.label}
        </span>
      ))}
    </div>
  );
}

function ProjectAction({ project, compact = false }: { project: Project; compact?: boolean }) {
  const isExternal = project.externalLink.url.startsWith("http");
  const icon = isExternal ? <ArrowUpRight className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />;
  const className = compact ? "premium-button-muted min-h-11 px-4 py-2 text-xs" : "premium-button";

  if (isExternal) {
    return (
      <a href={project.externalLink.url} target="_blank" rel="noreferrer" className={className}>
        {project.externalLink.label}
        {icon}
      </a>
    );
  }

  return (
    <Link to={project.externalLink.url} className={className}>
      {project.externalLink.label}
      {icon}
    </Link>
  );
}

function ProjectVisual({ project, featured = false }: { project: Project; featured?: boolean }) {
  if (project.brandStripSrc) {
    return (
      <div
        className={cn(
          "relative overflow-hidden rounded-md border border-line/70 bg-surface",
          featured ? "aspect-[16/8.2] sm:aspect-[16/6]" : "aspect-[16/8]",
        )}
      >
        <div className="absolute inset-0 bg-[linear-gradient(color-mix(in_srgb,hsl(var(--foreground))_6%,transparent)_1px,transparent_1px),linear-gradient(90deg,color-mix(in_srgb,hsl(var(--foreground))_6%,transparent)_1px,transparent_1px)] bg-[size:28px_28px] opacity-20" />
        <img
          src={project.brandStripSrc}
          alt={project.brandStripAlt ?? `${project.name} brand logo`}
          loading={featured ? "eager" : "lazy"}
          decoding="async"
          className="absolute inset-0 h-full w-full object-contain p-8 sm:p-10"
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-md border border-line/70 bg-surface",
        featured ? "aspect-[16/8.2] sm:aspect-[16/6]" : "aspect-[16/8]",
      )}
    >
      <div className="absolute inset-0 bg-[linear-gradient(color-mix(in_srgb,hsl(var(--foreground))_6%,transparent)_1px,transparent_1px),linear-gradient(90deg,color-mix(in_srgb,hsl(var(--foreground))_6%,transparent)_1px,transparent_1px)] bg-[size:28px_28px] opacity-20" />
      <div className="absolute right-4 top-4 max-w-[65%] truncate text-5xl font-black leading-none tracking-normal text-foreground/[0.04]">
        {project.name}
      </div>
      <div className="absolute bottom-4 left-4 flex h-14 w-14 items-center justify-center rounded-sm border border-primary/20 bg-primary/10 text-primary">
        <AppIcon project={project} />
      </div>
    </div>
  );
}

function FeaturedProject({ project, locale }: { project: Project; locale: "zh-CN" | "en-US" }) {
  const isEnglish = locale === "en-US";
  const domain = getDomain(project.externalLink.url);

  return (
    <article className="grid gap-5 rounded-md border border-line/70 bg-surface/72 p-4 backdrop-blur sm:p-5 lg:grid-cols-[minmax(0,0.96fr)_minmax(0,1.04fr)] lg:gap-7 lg:p-6">
      <ProjectVisual project={project} featured />

      <div className="flex flex-col gap-5">
        <div className="flex items-start justify-between gap-4">
          <ProjectSignals project={project} />
          <StatusBadge project={project} locale={locale} />
        </div>

        <div>
          <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-gold">
            {isEnglish ? "Current front door" : "当前优先入口"}
          </p>
          <h2 className="text-4xl font-black leading-none tracking-normal text-foreground sm:text-5xl">
            {project.name}
          </h2>
          {domain ? (
            <p className="mt-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              {isEnglish ? "Official domain" : "官方域名"} · {domain}
            </p>
          ) : null}
        </div>

        <div className="grid gap-4 border-y border-line/70 py-4">
          <p className="text-xl leading-snug text-foreground sm:text-2xl">
            {project.oneLineValue}
          </p>
          {project.summary ? (
            <p className="text-sm leading-7 text-muted-foreground sm:text-base">
              {project.summary}
            </p>
          ) : null}
        </div>

        <div className="mt-auto flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="grid gap-1 text-xs leading-6 text-muted-foreground">
            {project.hoursRelation ? <span>{project.hoursRelation.summary}</span> : null}
            {project.learnRelation ? <span>{project.learnRelation.summary}</span> : null}
          </div>
          <ProjectAction project={project} />
        </div>
      </div>
    </article>
  );
}

function ProjectDetailPanel({ project, locale }: { project: Project; locale: "zh-CN" | "en-US" }) {
  const isEnglish = locale === "en-US";
  const domain = getDomain(project.externalLink.url);

  return (
    <div className="mt-4 grid gap-4 rounded-md border border-line/70 bg-background/50 p-4 sm:grid-cols-[minmax(0,1.12fr)_minmax(260px,0.88fr)] sm:p-5">
      <div className="flex flex-col gap-3">
        {project.summary ? (
          <p className="text-sm leading-7 text-foreground/90 sm:text-base">
            {project.summary}
          </p>
        ) : null}
        {project.detailIntro ? (
          <p className="text-sm leading-7 text-muted-foreground sm:text-base">
            {project.detailIntro}
          </p>
        ) : null}
        {domain ? (
          <div className="font-mono text-[10px] uppercase tracking-widest text-gold">
            {isEnglish ? "Official domain" : "官方域名"} · {domain}
          </div>
        ) : null}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {project.hoursRelation ? (
          <div className="rounded-sm border border-line/70 bg-surface/70 px-4 py-3">
            <div className="text-[10px] font-bold uppercase tracking-widest text-primary/75">
              {isEnglish ? "72H relation" : "72H 关系"}
            </div>
            <p className="mt-2 text-sm leading-6 text-foreground/88">
              {project.hoursRelation.summary}
            </p>
          </div>
        ) : null}
        {project.learnRelation ? (
          <div className="rounded-sm border border-line/70 bg-surface/70 px-4 py-3">
            <div className="text-[10px] font-bold uppercase tracking-widest text-gold/80">
              {isEnglish ? "Learning relation" : "学习关系"}
            </div>
            <p className="mt-2 text-sm leading-6 text-foreground/88">
              {project.learnRelation.summary}
            </p>
          </div>
        ) : null}
      </div>

      {project.signals?.length ? (
        <div className="flex flex-wrap gap-2 sm:col-span-2">
          <ProjectSignals project={project} />
        </div>
      ) : null}
    </div>
  );
}

function ProjectRow({
  project,
  locale,
  index,
  compact = false,
  expanded,
  onToggle,
}: {
  project: Project;
  locale: "zh-CN" | "en-US";
  index: number;
  compact?: boolean;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <article className="group grid gap-4 border-b border-line/70 py-5 last:border-b-0 sm:grid-cols-[3.5rem_minmax(0,1fr)_auto] sm:items-start sm:gap-5">
      <div className="flex items-center justify-between gap-4 sm:block">
        <div className="flex h-12 w-12 items-center justify-center rounded-sm border border-line/70 bg-surface text-primary transition-colors group-hover:border-gold/40 group-hover:text-gold">
          <AppIcon project={project} />
        </div>
        <span className="font-mono text-[10px] uppercase tracking-widest text-gold sm:mt-4 sm:block">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-2xl font-bold leading-tight tracking-normal text-foreground">
            {project.name}
          </h3>
          <StatusBadge project={project} locale={locale} />
        </div>
        <p className={cn("mt-3 leading-7 text-foreground/86", compact ? "text-sm" : "text-base")}>
          {project.oneLineValue}
        </p>
      </div>

      <div className="flex flex-row items-center gap-2 sm:flex-col sm:items-end sm:justify-self-end">
        <ProjectAction project={project} compact />
        <button
          type="button"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-sm border border-line/70 bg-background/40 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground"
          onClick={onToggle}
          aria-expanded={expanded}
          aria-controls={`project-detail-${project.slug}`}
        >
          <span>{expanded ? (locale === "en-US" ? "Hide" : "收起") : locale === "en-US" ? "Details" : "详情"}</span>
          <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", expanded ? "rotate-180" : "rotate-0")} />
        </button>
      </div>

      {expanded ? (
        <div id={`project-detail-${project.slug}`} className="sm:col-span-3">
          <ProjectDetailPanel project={project} locale={locale} />
        </div>
      ) : null}
    </article>
  );
}

function CapitalSeatRow({
  entry,
  locale,
  index,
}: {
  entry: {
    project: Project;
    href: string;
    path: string;
    summary: string;
    note: string;
  };
  locale: "zh-CN" | "en-US";
  index: number;
}) {
  const isEnglish = locale === "en-US";

  return (
    <article className="group grid gap-4 border-b border-line/70 py-5 last:border-b-0 sm:grid-cols-[3.5rem_minmax(0,1fr)_auto] sm:items-start sm:gap-5">
      <div className="flex items-center justify-between gap-4 sm:block">
        <div className="flex h-12 w-12 items-center justify-center rounded-sm border border-line/70 bg-surface text-primary transition-colors group-hover:border-gold/40 group-hover:text-gold">
          <AppIcon project={entry.project} />
        </div>
        <span className="font-mono text-[10px] uppercase tracking-widest text-gold sm:mt-4 sm:block">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-2xl font-bold leading-tight tracking-normal text-foreground">
            {entry.project.name}
          </h3>
          <StatusBadge project={entry.project} locale={locale} />
        </div>
        <p className="mt-3 font-mono text-[10px] uppercase tracking-widest text-primary/80">
          {isEnglish ? "Capital entry" : "资本入口"} · {entry.path}
        </p>
        <p className="mt-3 text-base leading-7 text-foreground/86">
          {entry.summary}
        </p>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          {entry.note}
        </p>
      </div>

      <div className="flex flex-row items-center gap-2 sm:flex-col sm:items-end sm:justify-self-end">
        <Link to={entry.href} className="premium-button-muted min-h-11 px-4 py-2 text-xs">
          {isEnglish ? "Capital Seat" : "资本席位"}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}

function SectionHeader({
  id,
  title,
  description,
  count,
}: {
  id: string;
  title: string;
  description: string;
  count: number;
}) {
  return (
    <div
      id={id}
      className="scroll-mt-[calc(7.5rem+var(--safe-top))] flex flex-col gap-3 border-b border-line/70 pb-4 sm:flex-row sm:items-end sm:justify-between"
    >
      <div className="flex items-end gap-3">
        <h2 className="text-3xl font-black tracking-normal text-foreground sm:text-4xl">
          {title}
        </h2>
        <span className="pb-1 font-mono text-[10px] uppercase tracking-widest text-primary">
          {String(count).padStart(2, "0")}
        </span>
      </div>
      <p className="max-w-[34ch] text-sm leading-6 text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

export default function Ecosystem() {
  const { locale } = useLocale();
  const isEnglish = locale === "en-US";
  const projects = getProjects(locale);
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);

  const newLaunchProjects = projects
    .filter((project) => project.category === "new_launch")
    .sort((left, right) => left.priority - right.priority);
  const mainEntryProjects = projects
    .filter((project) => project.category === "main_entry")
    .sort((left, right) => left.priority - right.priority);
  const toolProjects = projects
    .filter((project) => project.category === "tools")
    .sort((left, right) => left.priority - right.priority);
  const upcomingProjects = projects
    .filter((project) => project.category === "coming_soon")
    .sort((left, right) => left.priority - right.priority);
  const featuredProject =
    projects.find((project) => project.slug === "wan") ?? newLaunchProjects[0] ?? mainEntryProjects[0];
  const remainingNewLaunchProjects = newLaunchProjects.filter((project) => project.slug !== featuredProject?.slug);
  const capitalSeatEntries = [
    {
      slug: "wan",
      href: "/capital/wan",
      path: "/capital/wan",
      summary: isEnglish
        ? "Reserve / Alpha capital seat entry and verified identity surface for WAN."
        : "WAN 的 Reserve / Alpha 资本席位与验证身份入口。",
      note: isEnglish
        ? "WAN thresholds, remaining seats, and identity surface."
        : "适合查看 WAN 的门槛、剩余席位与身份展示。",
    },
    {
      slug: "72hours-control-room",
      href: "/capital/72hours",
      path: "/capital/72hours",
      summary: isEnglish
        ? "Reserve / Alpha capital seat entry and verified identity surface for 72hours."
        : "72hours 的 Reserve / Alpha 资本席位与验证身份入口。",
      note: isEnglish
        ? "72hours thresholds, batches, and identity surface."
        : "适合查看 72hours 的席位条件、批次与身份界面。",
    },
    {
      slug: "multi-millionaire",
      href: "/capital/multi-millionaire",
      path: "/capital/multi-millionaire",
      summary: isEnglish
        ? "Reserve / Alpha capital seat entry and verified identity surface for multi-millionaire."
        : "multi-millionaire 的 Reserve / Alpha 资本席位与验证身份入口。",
      note: isEnglish
        ? "Alpha threshold, remaining seats, and application-side capital notes."
        : "适合查看 Alpha 门槛、剩余席位与应用侧资本说明。",
    },
  ] as const;
  const capitalSeatProjects = capitalSeatEntries.flatMap((entry) => {
    const project = projects.find((candidate) => candidate.slug === entry.slug);
    return project ? [{ project, ...entry }] : [];
  });
  const liveCount = projects.filter((project) => project.status === "live").length;
  const activeCount = projects.filter((project) => project.status !== "coming_soon" && project.status !== "archived").length;

  const categories = [
    { id: "front-door", label: isEnglish ? "Current launch" : "当前上线", count: featuredProject ? 1 : 0 },
    { id: "main-entry", label: isEnglish ? "Core ecosystem" : "生态主场", count: mainEntryProjects.length },
    { id: "capital-seat", label: isEnglish ? "Capital Seat" : "资本席位", count: capitalSeatProjects.length },
    { id: "tools", label: isEnglish ? "Tools" : "工具", count: toolProjects.length },
    { id: "coming-soon", label: isEnglish ? "Coming soon" : "即将上线", count: upcomingProjects.length },
  ].filter((category) => category.count > 0);

  return (
    <div className="page-shell pt-20 sm:pt-24">
      <section className="relative overflow-hidden border-b border-line/70 px-5 py-8 sm:px-8 sm:py-12 lg:px-16">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(color-mix(in_srgb,hsl(var(--foreground))_6%,transparent)_1px,transparent_1px),linear-gradient(90deg,color-mix(in_srgb,hsl(var(--foreground))_6%,transparent)_1px,transparent_1px)] bg-[size:44px_44px] opacity-20" />
        <div className="page-container page-container-wide relative z-10 grid max-w-7xl gap-8 lg:grid-cols-[minmax(0,0.86fr)_minmax(320px,0.5fr)] lg:items-end">
          <Reveal>
            <div className="flex flex-col gap-5">
              <div className="page-kicker w-fit">{isEnglish ? "Ecosystem" : "生态应用"}</div>
              <h1 className="text-5xl font-black leading-none tracking-normal text-foreground sm:text-7xl">
                {isEnglish ? "Live apps, official entries." : "在线应用与官方入口。"}
              </h1>
              <p className="max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
                {isEnglish
                  ? "Official entries, live apps, and experiments arranged by current use."
                  : "官方入口、在线应用和实验工具，按当前用途排列。"}
              </p>
            </div>
          </Reveal>

          <Reveal>
            <div className="grid grid-cols-3 overflow-hidden rounded-md border border-line/70 bg-line/70">
              {[
                { label: isEnglish ? "Active" : "可用", value: activeCount },
                { label: isEnglish ? "Live" : "在线", value: liveCount },
                { label: isEnglish ? "Total" : "总数", value: projects.length },
              ].map((stat) => (
                <div key={stat.label} className="bg-background/78 p-4 sm:p-5">
                  <div className="font-mono text-2xl font-bold text-foreground">{String(stat.value).padStart(2, "0")}</div>
                  <div className="mt-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal className="lg:col-span-2">
            <nav
              aria-label={isEnglish ? "Ecosystem categories" : "生态应用分类"}
              className="sticky top-[calc(4.75rem+var(--safe-top))] z-30 -mx-5 flex gap-1 overflow-x-auto border-y border-line/70 bg-background/92 px-5 py-3 backdrop-blur-md [-ms-overflow-style:none] [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:rounded-md sm:border sm:bg-line/70 sm:p-1 [&::-webkit-scrollbar]:hidden"
            >
              {categories.map((category) => (
                <a
                  key={category.id}
                  href={`#${category.id}`}
                  className="inline-flex min-h-11 shrink-0 items-center gap-3 rounded-sm border border-line/70 bg-surface/72 px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground transition-colors hover:border-primary/30 hover:bg-background/72 hover:text-foreground sm:border-transparent sm:bg-background/72 sm:text-xs"
                >
                  <span>{category.label}</span>
                  <span className="font-mono text-[10px] text-primary">
                    {String(category.count).padStart(2, "0")}
                  </span>
                </a>
              ))}
            </nav>
          </Reveal>
        </div>
      </section>

      {featuredProject ? (
        <section id="front-door" className="page-section-tight scroll-mt-[calc(7.5rem+var(--safe-top))]">
          <div className="page-container page-container-wide flex max-w-7xl flex-col gap-6">
            <SectionHeader
              id="front-door-heading"
              title={isEnglish ? "Current launch" : "当前上线"}
              description={isEnglish ? "The main live app currently highlighted." : "当前重点展示的在线应用。"}
              count={1}
            />
            <Reveal>
              <FeaturedProject project={featuredProject} locale={locale} />
            </Reveal>
          </div>
        </section>
      ) : null}

      {remainingNewLaunchProjects.length > 0 ? (
        <section className="page-section-tight pt-0 scroll-mt-[calc(7.5rem+var(--safe-top))]">
          <div className="page-container page-container-wide max-w-7xl rounded-md border border-line/70 bg-surface/54 px-4 sm:px-6">
            {remainingNewLaunchProjects.map((project, index) => (
              <Reveal key={project.slug}>
                <ProjectRow
                  project={project}
                  locale={locale}
                  index={index}
                  expanded={expandedSlug === project.slug}
                  onToggle={() =>
                    setExpandedSlug((current) => (current === project.slug ? null : project.slug))
                  }
                />
              </Reveal>
            ))}
          </div>
        </section>
      ) : null}

      {mainEntryProjects.length > 0 ? (
        <section className="page-section-tight pt-0 scroll-mt-[calc(7.5rem+var(--safe-top))]">
          <div className="page-container page-container-wide flex max-w-7xl flex-col gap-5">
            <SectionHeader
              id="main-entry"
              title={isEnglish ? "Core ecosystem" : "生态主场"}
              description={isEnglish ? "Core entries for understanding and participation." : "理解和参与的核心入口。"}
              count={mainEntryProjects.length}
            />
            <div className="rounded-md border border-line/70 bg-surface/54 px-4 sm:px-6">
              {mainEntryProjects.map((project, index) => (
                <Reveal key={project.slug}>
                  <ProjectRow
                    project={project}
                    locale={locale}
                    index={index}
                    expanded={expandedSlug === project.slug}
                    onToggle={() =>
                      setExpandedSlug((current) => (current === project.slug ? null : project.slug))
                    }
                  />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {capitalSeatProjects.length > 0 ? (
        <section className="page-section-tight pt-0 scroll-mt-[calc(7.5rem+var(--safe-top))]">
          <div className="page-container page-container-wide flex max-w-7xl flex-col gap-5">
            <SectionHeader
              id="capital-seat"
              title={isEnglish ? "Capital Seat" : "资本席位"}
              description={
                isEnglish
                  ? "Only the apps with dedicated capital seat entries."
                  : "只列出已开通资本席位入口的应用。"
              }
              count={capitalSeatProjects.length}
            />
            <div className="rounded-md border border-line/70 bg-background/45 px-4 sm:px-6">
              {capitalSeatProjects.map((entry, index) => (
                <Reveal key={entry.project.slug}>
                  <CapitalSeatRow entry={entry} locale={locale} index={index} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {toolProjects.length > 0 ? (
        <section className="page-section-tight pt-0 scroll-mt-[calc(7.5rem+var(--safe-top))]">
          <div className="page-container page-container-wide flex max-w-7xl flex-col gap-5">
            <SectionHeader
              id="tools"
              title={isEnglish ? "Tools" : "工具"}
              description={isEnglish ? "Useful surfaces around proof, content, and coordination." : "围绕证明、内容和协作的可用界面。"}
              count={toolProjects.length}
            />
            <div className="rounded-md border border-line/70 bg-surface/54 px-4 sm:px-6">
              {toolProjects.map((project, index) => (
                <Reveal key={project.slug}>
                  <ProjectRow
                    project={project}
                    locale={locale}
                    index={index}
                    compact
                    expanded={expandedSlug === project.slug}
                    onToggle={() =>
                      setExpandedSlug((current) => (current === project.slug ? null : project.slug))
                    }
                  />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {upcomingProjects.length > 0 ? (
        <section className="page-section-tight pt-0 pb-20 sm:pb-28 scroll-mt-[calc(7.5rem+var(--safe-top))]">
          <div className="page-container page-container-wide flex max-w-7xl flex-col gap-5">
            <SectionHeader
              id="coming-soon"
              title={isEnglish ? "Coming soon" : "即将上线"}
              description={isEnglish ? "Upcoming experiments and public signals." : "即将开放的实验和公开信号。"}
              count={upcomingProjects.length}
            />
            <div className="rounded-md border border-line/70 bg-background/45 px-4 sm:px-6">
              {upcomingProjects.map((project, index) => (
                <Reveal key={project.slug}>
                  <ProjectRow
                    project={project}
                    locale={locale}
                    index={index}
                    compact
                    expanded={expandedSlug === project.slug}
                    onToggle={() =>
                      setExpandedSlug((current) => (current === project.slug ? null : project.slug))
                    }
                  />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
