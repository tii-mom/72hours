import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Beaker,
  Box,
  CheckCircle,
  CircleDollarSign,
  Gamepad2,
  GitBranch,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Wrench,
} from "lucide-react";
import { LocalizedLink as Link } from "../components/LocalizedLink";
import { getProjects } from "../content/projects";
import { fetchBotAppDiscovery, mergeAppDiscoveryProjects } from "../lib/app-discovery-client";
import { useLocale } from "../lib/locale";
import type { Project, ProjectAppCategory, ProjectChain, ProjectDevelopmentStage, TelegramBotProjectPayload } from "../lib/content-types";
import { cn } from "../lib/utils";

type PrimaryFilter = "all" | "new" | "live" | "building";
type SecondaryFilter = "all" | ProjectChain | ProjectAppCategory;

const projectIcons: Record<NonNullable<Project["iconKey"]>, ReactNode> = {
  box: <Box size={20} />,
  beaker: <Beaker size={20} />,
  check: <CheckCircle size={20} />,
  spark: <Sparkles size={20} />,
  shield: <ShieldCheck size={20} />,
  relay: <GitBranch size={20} />,
};

const categoryIcons: Record<ProjectAppCategory, ReactNode> = {
  tool: <Wrench size={14} strokeWidth={1.75} />,
  game: <Gamepad2 size={14} strokeWidth={1.75} />,
  social: <MessageCircle size={14} strokeWidth={1.75} />,
  capital: <CircleDollarSign size={14} strokeWidth={1.75} />,
  content: <Sparkles size={14} strokeWidth={1.75} />,
};

const featuredSlugs = ["wan", "distribution", "72hours-control-room"];

function categoryLabel(category: ProjectAppCategory, isEnglish: boolean) {
  const labels: Record<ProjectAppCategory, string> = isEnglish
    ? { tool: "Tools", game: "Games", social: "Social", capital: "Reference", content: "Content" }
    : { tool: "工具", game: "游戏", social: "社交", capital: "参考", content: "内容" };
  return labels[category];
}

function stageLabel(stage: ProjectDevelopmentStage, isEnglish: boolean) {
  const labels: Record<ProjectDevelopmentStage, string> = isEnglish
    ? { new: "New", live: "Live", building: "Building", investable: "Live" }
    : { new: "新上线", live: "可用", building: "开发中", investable: "可用" };
  return labels[stage];
}

function AppIcon({ project }: { project: Project }) {
  if (project.slug === "wan") return <ShieldCheck size={20} strokeWidth={1.75} />;
  if (project.slug === "distribution") return <GitBranch size={20} strokeWidth={1.75} />;
  if (project.slug === "multi-millionaire") return <CircleDollarSign size={20} strokeWidth={1.75} />;
  if (project.slug === "72hours-control-room") return <CheckCircle size={20} strokeWidth={1.75} />;
  if (project.slug === "daily-pulse-vote") return <MessageCircle size={20} strokeWidth={1.75} />;
  if (project.slug === "meme-court") return <Gamepad2 size={20} strokeWidth={1.75} />;
  if (project.slug === "chain-relay-canvas") return <GitBranch size={20} strokeWidth={1.75} />;
  return project.iconKey ? projectIcons[project.iconKey] : <Box size={20} />;
}

function ProjectLink({ project, className, children }: { project: Project; className: string; children: ReactNode }) {
  const href = project.externalLink.url;

  if (href.startsWith("http")) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={className}>
        {children}
      </a>
    );
  }

  return (
    <Link to={href} className={className}>
      {children}
    </Link>
  );
}

function AppBadge({ project, size = "md" }: { project: Project; size?: "sm" | "md" }) {
  const categories = project.appCategories ?? ["tool"];
  const isCapital = categories.includes("capital");
  const isGame = categories.includes("game");

  return (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden rounded-sm border bg-background/64",
        isCapital ? "border-gold/35 text-gold" : isGame ? "border-gold/25 text-gold" : "border-primary/30 text-primary",
        size === "sm" ? "h-10 w-10" : "h-11 w-11",
      )}
    >
      <div className="absolute inset-x-2 bottom-1 h-px bg-gradient-to-r from-transparent via-current to-transparent opacity-55" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_72%,currentColor,transparent_42%)] opacity-[0.09]" />
      <AppIcon project={project} />
    </div>
  );
}

function StatusPill({ project, isEnglish }: { project: Project; isEnglish: boolean }) {
  const stage = project.developmentStage ?? "building";
  const label = stage === "investable" ? stageLabel("live", isEnglish) : stageLabel(stage, isEnglish);

  return (
    <span className="shrink-0 rounded-sm border border-line/70 bg-background/42 px-2 py-1 text-[10px] font-bold text-muted-foreground">
      {label}
    </span>
  );
}

function FilterChip({ active, children, onClick }: { active: boolean; children: ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex min-h-8 shrink-0 items-center gap-1.5 rounded-full border px-3 text-xs font-bold transition-colors active:scale-[0.98]",
        active
          ? "border-primary/35 bg-primary/12 text-primary"
          : "border-line/70 bg-surface/58 text-muted-foreground hover:border-primary/30 hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

function FeaturedApp({ project, isEnglish }: { project: Project; isEnglish: boolean }) {
  const chain = (project.chains ?? ["TON"])[0];

  return (
    <ProjectLink
      project={project}
      className="flex min-h-[4.05rem] w-[64vw] max-w-[17rem] shrink-0 snap-start items-center gap-3 rounded-md border border-line/70 bg-surface/64 p-3 text-left shadow-[0_18px_48px_rgba(0,0,0,0.22)] sm:w-[18rem]"
    >
      <AppBadge project={project} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h2 className="truncate text-base font-black text-foreground">{project.name}</h2>
          {project.externalLink.url.startsWith("http") ? <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-primary" /> : null}
        </div>
        <p className="mt-1 line-clamp-1 text-[11px] leading-5 text-muted-foreground">{project.oneLineValue}</p>
        <div className="mt-1.5 flex items-center gap-2">
          <span className="rounded-sm border border-primary/25 bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">{chain}</span>
          <StatusPill project={project} isEnglish={isEnglish} />
        </div>
      </div>
    </ProjectLink>
  );
}

function AppRow({ project, isEnglish }: { project: Project; isEnglish: boolean }) {
  const categories = project.appCategories ?? ["tool"];
  const chain = (project.chains ?? ["TON"])[0];

  return (
    <ProjectLink
      project={project}
      className="grid min-h-[5.05rem] grid-cols-[2.65rem_minmax(0,1fr)_auto] items-center gap-3 rounded-md border border-line/70 bg-surface/54 p-3 text-left transition-colors hover:border-primary/25 hover:bg-surface/70 active:scale-[0.995]"
    >
      <AppBadge project={project} size="sm" />
      <div className="min-w-0">
        <div className="flex min-w-0 items-center gap-2">
          <h3 className="truncate text-[15px] font-black text-foreground sm:text-base">{project.name}</h3>
          <span className="shrink-0 rounded-sm border border-primary/25 bg-primary/10 px-1.5 py-0.5 text-[9px] font-bold text-primary">{chain}</span>
        </div>
        <p className="mt-1 line-clamp-1 text-xs leading-5 text-muted-foreground sm:line-clamp-2">{project.oneLineValue}</p>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {categories.slice(0, 2).map((category) => (
            <span key={category} className="inline-flex items-center gap-1 rounded-sm border border-line/70 bg-background/36 px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
              {categoryIcons[category]}
              {categoryLabel(category, isEnglish)}
            </span>
          ))}
          <StatusPill project={project} isEnglish={isEnglish} />
        </div>
      </div>
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border border-line/70 bg-background/36 text-muted-foreground">
        {project.externalLink.url.startsWith("http") ? <ArrowUpRight className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
      </div>
    </ProjectLink>
  );
}

function Section({ isEnglish, projects, title }: { isEnglish: boolean; projects: Project[]; title: string }) {
  if (!projects.length) return null;

  return (
    <section className="page-section-tight pt-0">
      <div className="page-container page-container-wide">
        <div className="mb-3 flex items-center justify-between gap-3 border-b border-line/70 pb-3">
          <h2 className="text-xl font-black text-foreground">{title}</h2>
          <span className="font-mono text-[10px] text-primary">{String(projects.length).padStart(2, "0")}</span>
        </div>
        <div className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <AppRow key={project.slug} project={project} isEnglish={isEnglish} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Ecosystem() {
  const { locale } = useLocale();
  const isEnglish = locale === "en-US";
  const baseProjects = useMemo(() => getProjects(locale), [locale]);
  const [botProjects, setBotProjects] = useState<TelegramBotProjectPayload[]>([]);
  const projects = useMemo(
    () => mergeAppDiscoveryProjects(baseProjects, botProjects).filter((project) => project.visibility !== "hidden"),
    [baseProjects, botProjects],
  );
  const [primaryFilter, setPrimaryFilter] = useState<PrimaryFilter>("all");
  const [secondaryFilter, setSecondaryFilter] = useState<SecondaryFilter>("all");

  useEffect(() => {
    let cancelled = false;

    fetchBotAppDiscovery(locale)
      .then((payloads) => {
        if (!cancelled) setBotProjects(payloads);
      })
      .catch(() => {
        if (!cancelled) setBotProjects([]);
      });

    return () => {
      cancelled = true;
    };
  }, [locale]);

  const featuredProjects = useMemo(
    () => featuredSlugs
      .map((slug) => projects.find((project) => project.slug === slug))
      .filter((project): project is Project => Boolean(project)),
    [projects],
  );

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const stage = project.developmentStage ?? "building";
      const primaryMatch =
        primaryFilter === "all" ||
        (primaryFilter === "live" ? stage === "live" || stage === "investable" : stage === primaryFilter);
      const secondaryMatch =
        secondaryFilter === "all"
          ? true
          : (["TON", "BSC", "BASE", "ETH"] as string[]).includes(secondaryFilter)
            ? (project.chains ?? ["TON"]).includes(secondaryFilter as ProjectChain)
            : (project.appCategories ?? ["tool"]).includes(secondaryFilter as ProjectAppCategory);

      return primaryMatch && secondaryMatch;
    });
  }, [primaryFilter, projects, secondaryFilter]);

  const sections = [
    {
      title: isEnglish ? "New launch" : "新上线",
      projects: filteredProjects.filter((project) => project.developmentStage === "new"),
    },
    {
      title: isEnglish ? "Available" : "可用应用",
      projects: filteredProjects.filter((project) => {
        const stage = project.developmentStage ?? "building";
        return stage === "live" || stage === "investable";
      }),
    },
    {
      title: isEnglish ? "Building" : "正在开发中",
      projects: filteredProjects.filter((project) => (project.developmentStage ?? "building") === "building"),
    },
  ];

  const primaryFilters: Array<{ id: PrimaryFilter; label: string }> = [
    { id: "all", label: isEnglish ? "All" : "全部" },
    { id: "new", label: isEnglish ? "New" : "新上线" },
    { id: "live", label: isEnglish ? "Live" : "可用" },
    { id: "building", label: isEnglish ? "Building" : "开发中" },
  ];
  const secondaryFilters: Array<{ id: SecondaryFilter; label: string; icon?: ReactNode }> = [
    { id: "all", label: isEnglish ? "All" : "全部" },
    { id: "TON", label: "TON" },
    { id: "capital", label: categoryLabel("capital", isEnglish), icon: categoryIcons.capital },
    { id: "tool", label: categoryLabel("tool", isEnglish), icon: categoryIcons.tool },
    { id: "game", label: categoryLabel("game", isEnglish), icon: categoryIcons.game },
    { id: "social", label: categoryLabel("social", isEnglish), icon: categoryIcons.social },
    { id: "content", label: categoryLabel("content", isEnglish), icon: categoryIcons.content },
  ];

  return (
    <div className="page-shell pt-20 sm:pt-24">
      <section className="page-section-tight pb-2 sm:pb-8">
        <div className="page-container page-container-wide">
          <div className="mb-2 flex items-center justify-between gap-3">
            <div className="page-kicker w-fit">{isEnglish ? "Apps" : "应用"}</div>
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              {String(projects.length).padStart(2, "0")}
            </div>
          </div>

          <div className="-mx-5 flex snap-x snap-mandatory gap-2.5 overflow-x-auto px-5 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden">
            {featuredProjects.map((project) => (
              <FeaturedApp key={project.slug} project={project} isEnglish={isEnglish} />
            ))}
          </div>
        </div>
      </section>

      <section className="sticky top-[calc(3.95rem+var(--safe-top))] z-30 border-y border-line/70 bg-background/94 py-1.5 backdrop-blur-xl md:top-[calc(4.9rem+var(--safe-top))]">
        <div className="page-container page-container-wide grid gap-1.5">
          <div className="flex gap-2 overflow-x-auto px-5 [-ms-overflow-style:none] [scrollbar-width:none] sm:px-8 lg:px-16 [&::-webkit-scrollbar]:hidden">
            {primaryFilters.map((item) => (
              <FilterChip key={item.id} active={primaryFilter === item.id} onClick={() => setPrimaryFilter(item.id)}>
                {item.label}
              </FilterChip>
            ))}
          </div>
          <div className="flex gap-2 overflow-x-auto px-5 [-ms-overflow-style:none] [scrollbar-width:none] sm:px-8 lg:px-16 [&::-webkit-scrollbar]:hidden">
            {secondaryFilters.map((item) => (
              <FilterChip key={item.id} active={secondaryFilter === item.id} onClick={() => setSecondaryFilter(item.id)}>
                {item.icon}
                {item.label}
              </FilterChip>
            ))}
          </div>
        </div>
      </section>

      {sections.map((section) => (
        <Section key={section.title} title={section.title} projects={section.projects} isEnglish={isEnglish} />
      ))}
    </div>
  );
}
