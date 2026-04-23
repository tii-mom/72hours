import type { ReactNode } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Beaker,
  Box,
  CheckCircle,
  GitBranch,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { LocalizedLink as Link } from "../components/LocalizedLink";
import { SpotlightCard } from "../components/SpotlightCard";
import { Reveal } from "../components/Reveal";
import { getProjects } from "../content/projects";
import { useLocale } from "../lib/locale";
import type { Project, ProjectSignalTone } from "../lib/content-types";
import { cn } from "../lib/utils";

const projectIcons: Record<NonNullable<Project["iconKey"]>, ReactNode> = {
  box: <Box size={22} />,
  beaker: <Beaker size={22} />,
  check: <CheckCircle size={22} />,
  spark: <Sparkles size={22} />,
  shield: <ShieldCheck size={22} />,
  relay: <GitBranch size={22} />,
};

const signalToneClasses: Record<ProjectSignalTone, string> = {
  new: "border-primary/30 bg-primary/10 text-primary",
  hot: "border-sky-400/20 bg-sky-400/10 text-sky-200",
  core: "border-white/[0.14] bg-white/[0.06] text-foreground",
  guide: "border-white/10 bg-white/[0.04] text-muted-foreground",
};

const projectStatusLabels: Record<Project["status"], string> = {
  live: "在线",
  beta: "测试",
  waitlist: "候补",
  community_pilot: "试点",
  coming_soon: "即将",
  archived: "归档",
};

const projectStatusLabelsEn: Record<Project["status"], string> = {
  live: "Live",
  beta: "Beta",
  waitlist: "Waitlist",
  community_pilot: "Pilot",
  coming_soon: "Coming soon",
  archived: "Archived",
};

function getDomain(url: string) {
  if (!url.startsWith("http")) {
    return undefined;
  }

  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return undefined;
  }
}

function ProjectSignals({
  project,
  variant = "pill",
}: {
  project: Project;
  variant?: "pill" | "inline";
}) {
  if (!project.signals?.length) {
    return null;
  }

  if (variant === "inline") {
    return (
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        {project.signals.map((signal) => (
          <span
            key={`${project.slug}-${signal.label}`}
            className={cn(
              "inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em]",
              signal.tone === "new"
                ? "text-primary"
                : signal.tone === "hot"
                  ? "text-sky-200"
                  : "text-muted-foreground"
            )}
          >
            <span
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                signal.tone === "new"
                  ? "bg-primary"
                  : signal.tone === "hot"
                    ? "bg-sky-300"
                    : "bg-white/25"
              )}
            />
            {signal.label}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {project.signals.map((signal) => (
        <span
          key={`${project.slug}-${signal.label}`}
          className={`inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] ${signalToneClasses[signal.tone]}`}
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
  const className = compact
    ? "inline-flex min-h-11 items-center gap-2 rounded-sm border border-white/10 px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-foreground transition-all hover:border-primary/30 hover:text-primary"
    : "inline-flex min-h-11 items-center gap-2 rounded-sm bg-primary px-5 py-3 text-xs font-bold uppercase tracking-widest text-primary-foreground transition-all hover:brightness-110";

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

function ProjectBadge({ project, locale }: { project: Project; locale: "zh-CN" | "en-US" }) {
  const label = locale === "en-US" ? projectStatusLabelsEn[project.status] : projectStatusLabels[project.status];

  return (
    <span className="inline-flex items-center rounded-full border border-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
      {label}
    </span>
  );
}

function AppIcon({ project }: { project: Project }) {
  const icon = project.iconKey ? projectIcons[project.iconKey] : <Box size={22} />;

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

function EditorialCard({
  project,
  locale,
  density = "featured",
}: {
  project: Project;
  locale: "zh-CN" | "en-US";
  density?: "featured" | "compact";
}) {
  const domain = getDomain(project.externalLink.url);
  const isCompact = density === "compact";
  const isFeatured = density === "featured";

  return (
    <SpotlightCard
      className={cn(
        "page-card page-card-lg flex h-full min-w-[82vw] snap-start flex-col border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0.01))] sm:min-w-[27rem] lg:min-w-0",
        isFeatured ? "!p-3 gap-2 sm:!p-5 sm:gap-4 md:!p-6" : isCompact ? "gap-4" : "gap-5"
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <ProjectSignals project={project} variant={isFeatured ? "inline" : "pill"} />
        <ProjectBadge project={project} locale={locale} />
      </div>

      {project.brandStripSrc ? (
        <div
          className={cn(
            "relative overflow-hidden rounded-md border border-white/10 bg-[radial-gradient(circle_at_14%_18%,rgba(34,197,94,0.12)_0,transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))]",
            isFeatured ? "aspect-[16/4.75] sm:aspect-[16/7.2]" : "aspect-[16/9]"
          )}
        >
          <img
            src={project.brandStripSrc}
            alt={project.brandStripAlt ?? `${project.name} brand logo`}
            loading="lazy"
            decoding="async"
            className={cn(
              "absolute left-1/2 top-1/2 max-w-none -translate-x-1/2 object-contain",
              isFeatured
                ? "h-[100%] w-[100%] -translate-y-[34%] sm:h-[144%] sm:w-[144%]"
                : "h-[128%] w-[128%] -translate-y-[42%]"
            )}
          />
        </div>
      ) : (
        <div
          className={cn(
            "relative overflow-hidden rounded-md border border-white/10 bg-[radial-gradient(circle_at_18%_22%,rgba(34,197,94,0.15),transparent_26%),linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))]",
            isFeatured ? "aspect-[16/6.5] sm:aspect-[16/7.2]" : "aspect-[16/9]"
          )}
        >
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:28px_28px] opacity-28" />
          <div className="absolute right-4 top-3 text-[clamp(2.6rem,7vw,4.6rem)] font-black leading-none tracking-[-0.08em] text-white/[0.05]">
            {project.name}
          </div>
          <div className="absolute bottom-4 left-4 flex h-14 w-14 items-center justify-center rounded-sm border border-primary/20 bg-primary/10 text-primary shadow-[0_0_24px_rgba(34,197,94,0.08)]">
            <AppIcon project={project} />
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3">
        <div className={cn("flex flex-col", isCompact ? "gap-2" : "gap-3")}>
          <h3
            className={cn(
              "font-bold tracking-tight text-foreground",
              isFeatured ? "text-[15px] sm:text-2xl" : "text-2xl sm:text-3xl"
            )}
          >
            {project.name}
          </h3>
          {domain ? (
            <span
              className={cn(
                "w-fit font-mono uppercase tracking-[0.28em] text-muted-foreground",
                isCompact || isFeatured
                  ? isFeatured
                    ? "hidden text-[10px] sm:inline-flex"
                    : "text-[10px]"
                  : "inline-flex items-center rounded-full border border-white/10 px-3 py-1 text-[10px] font-bold"
              )}
            >
              {domain}
            </span>
          ) : null}
        </div>
        <p
          className={cn(
            "tracking-tight text-foreground",
            isFeatured
              ? "hidden text-[13px] leading-[1.4] sm:block sm:text-lg"
              : isCompact
              ? "text-base leading-[1.45] sm:text-lg"
              : "text-lg sm:text-xl leading-[1.35]"
          )}
        >
          {project.oneLineValue}
        </p>
        {project.summary && !isCompact && !isFeatured ? (
          <p className="hidden text-sm leading-relaxed text-muted-foreground sm:block">
            {project.summary}
          </p>
        ) : null}
      </div>

      <div
        className={cn(
          "mt-auto flex items-center gap-4 border-t border-white/10 pt-4",
          isCompact || isFeatured ? "justify-end pt-2.5" : "justify-between"
      )}
    >
        {!isCompact && !isFeatured ? (
          <span className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground sm:text-xs">
            {domain ?? project.name}
          </span>
        ) : null}
        <ProjectAction project={project} />
      </div>
    </SpotlightCard>
  );
}

function AppCard({
  project,
  locale,
  compact = false,
}: {
  project: Project;
  locale: "zh-CN" | "en-US";
  compact?: boolean;
}) {
  const domain = getDomain(project.externalLink.url);

  return (
    <SpotlightCard
      className={cn(
        "page-card flex h-full flex-col gap-4 border-white/8 bg-black/20",
        compact ? "sm:p-6" : ""
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 flex-1 items-start gap-4">
          <div
            className={cn(
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-sm border",
              compact
                ? "border-white/8 bg-white/[0.03] text-white/72"
                : "border-primary/16 bg-primary/10 text-primary"
            )}
          >
            <AppIcon project={project} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="text-xl font-bold tracking-tight text-foreground">
                  {project.name}
                </h3>
                {domain ? (
                  <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
                    {domain}
                  </p>
                ) : null}
              </div>
              <ProjectBadge project={project} locale={locale} />
            </div>
            <p className="mt-3 text-sm leading-relaxed text-foreground/84 sm:text-[15px]">
              {project.oneLineValue}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-white/8 pt-3">
        <ProjectSignals project={project} variant="inline" />
        <ProjectAction project={project} compact />
      </div>
    </SpotlightCard>
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
      className="flex flex-col gap-2.5 border-b border-white/10 pb-3.5 sm:flex-row sm:items-end sm:justify-between sm:gap-3"
    >
      <div className="flex items-end gap-3">
        <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-3xl">
          {title}
        </h2>
        <span className="pb-1 font-mono text-[10px] uppercase tracking-[0.32em] text-primary/60 sm:text-xs">
          {String(count).padStart(2, "0")}
        </span>
      </div>
      <p className="max-w-[28ch] text-[11px] leading-relaxed text-muted-foreground sm:max-w-none sm:text-sm">
        {description}
      </p>
    </div>
  );
}

export default function Ecosystem() {
  const { locale } = useLocale();
  const isEnglish = locale === "en-US";
  const projects = getProjects(locale);

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

  const categories = [
    { id: "new-launch", label: isEnglish ? "New launch" : "新上线", count: newLaunchProjects.length },
    { id: "main-entry", label: isEnglish ? "Main entry" : "主入口", count: mainEntryProjects.length },
    { id: "tools", label: isEnglish ? "Tools" : "工具", count: toolProjects.length },
    { id: "coming-soon", label: isEnglish ? "Coming soon" : "即将上线", count: upcomingProjects.length },
  ].filter((category) => category.count > 0);

  return (
    <div className="page-shell pt-20 sm:pt-24">
      <div className="pointer-events-none absolute left-0 top-[18%] z-0 h-[540px] w-1/3 bg-primary/5 blur-[140px]" />
      <div className="pointer-events-none absolute right-0 top-0 z-0 h-[36vh] w-[40vw] bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.08)_0,transparent_68%)]" />

      <section className="overflow-hidden border-b border-white/5 px-5 py-5 sm:px-8 sm:py-8 lg:px-16">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,0.08)_0,transparent_36%),linear-gradient(to_bottom,rgba(255,255,255,0.03),transparent_34%)]" />
        <div className="page-container page-container-wide relative z-10 flex max-w-6xl flex-col gap-2.5 sm:gap-4">
          <Reveal>
            <div className="page-kicker w-fit">{isEnglish ? "Ecosystem" : "生态应用"}</div>
          </Reveal>
          <Reveal>
            <h1 className="sr-only">{isEnglish ? "Ecosystem apps" : "生态应用"}</h1>
          </Reveal>
          <Reveal>
            <nav
              aria-label={isEnglish ? "Ecosystem categories" : "生态应用分类"}
              className="page-chip-row overflow-x-auto pb-1 sm:overflow-visible"
            >
              {categories.map((category) => (
                <a
                  key={category.id}
                  href={`#${category.id}`}
                  className="inline-flex shrink-0 min-h-11 items-center gap-3 rounded-sm border border-white/10 bg-secondary/10 px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground sm:text-xs"
                >
                  <span>{category.label}</span>
                  <span className="font-mono text-[10px] text-primary/70">
                    {String(category.count).padStart(2, "0")}
                  </span>
                </a>
              ))}
            </nav>
          </Reveal>
        </div>
      </section>

      {newLaunchProjects.length > 0 ? (
        <section className="page-section-tight pt-8 pb-12 sm:pt-10 sm:pb-16">
          <div className="page-container page-container-wide flex max-w-6xl flex-col gap-6">
            <SectionHeader
              id="new-launch"
              title={isEnglish ? "New launch" : "新上线"}
              description={isEnglish ? "Latest app." : "最近上线。"}
              count={newLaunchProjects.length}
            />
            <div className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 sm:mx-0 sm:px-0 lg:grid lg:grid-cols-1 lg:overflow-visible">
              {newLaunchProjects.map((project) => (
                <Reveal key={project.slug} className="contents">
                  <EditorialCard project={project} locale={locale} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {mainEntryProjects.length > 0 ? (
        <section className="page-section-tight pt-0">
          <div className="page-container page-container-wide flex max-w-6xl flex-col gap-6">
            <SectionHeader
              id="main-entry"
              title={isEnglish ? "Main entry" : "主入口"}
              description={isEnglish ? "Start here." : "先看这里。"}
              count={mainEntryProjects.length}
            />
            <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
              {mainEntryProjects.map((project) => (
                <Reveal key={project.slug}>
                  <EditorialCard project={project} locale={locale} density="compact" />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {toolProjects.length > 0 ? (
        <section className="page-section-tight pt-0">
          <div className="page-container page-container-wide flex max-w-6xl flex-col gap-6">
            <SectionHeader
              id="tools"
              title={isEnglish ? "Tools" : "工具"}
              description={isEnglish ? "Current apps." : "当前可用。"}
              count={toolProjects.length}
            />
            <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-2">
              {toolProjects.map((project) => (
                <Reveal key={project.slug}>
                  <AppCard project={project} locale={locale} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {upcomingProjects.length > 0 ? (
        <section className="page-section pt-0">
          <div className="page-container page-container-wide flex max-w-6xl flex-col gap-6">
            <SectionHeader
              id="coming-soon"
              title={isEnglish ? "Coming soon" : "即将上线"}
              description={isEnglish ? "Stay tuned." : "保持关注。"}
              count={upcomingProjects.length}
            />
            <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 xl:grid-cols-3">
              {upcomingProjects.map((project) => (
                <Reveal key={project.slug}>
                  <AppCard project={project} locale={locale} compact />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
