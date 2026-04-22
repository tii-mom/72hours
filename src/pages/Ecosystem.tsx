import { Link } from "react-router-dom";
import type { ReactNode } from "react";
import {
  ArrowRight,
  Beaker,
  Box,
  CheckCircle,
  GitBranch,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { SpotlightCard } from "../components/SpotlightCard";
import { Reveal } from "../components/Reveal";
import { getProjects } from "../content/projects";
import {
  formatAudienceTags,
  formatParticipationModes,
} from "../lib/content";
import { useLocale } from "../lib/locale";
import type { Project } from "../lib/content-types";

const projectIcons: Record<NonNullable<Project["iconKey"]>, ReactNode> = {
  box: <Box size={24} />,
  beaker: <Beaker size={24} />,
  check: <CheckCircle size={24} />,
  spark: <Sparkles size={24} />,
  shield: <ShieldCheck size={24} />,
  relay: <GitBranch size={24} />,
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

function ProjectCard({ project, locale }: { project: Project; locale: "zh-CN" | "en-US" }) {
  const isEnglish = locale === "en-US";
  const isExternal = project.externalLink.url.startsWith("http");
  const icon = project.iconKey ? projectIcons[project.iconKey] : <Box size={24} />;
  const statusLabel = isEnglish ? projectStatusLabelsEn[project.status] : projectStatusLabels[project.status];

  return (
    <SpotlightCard className={`page-card page-card-lg flex flex-col gap-5 sm:gap-6 group ${project.featured ? "bg-[#0c0f10]" : ""}`}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 border-b border-white/5 pb-4">
        <div className="w-11 h-11 sm:w-12 sm:h-12 bg-primary/10 text-primary flex items-center justify-center rounded-sm shadow-[0_0_15px_rgba(34,197,94,0.15)] group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
          {icon}
        </div>
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight">{project.name}</h2>
        <span className="sm:ml-auto px-3 py-1 text-[10px] sm:text-xs font-bold tracking-widest bg-primary/10 text-primary border border-primary/30 rounded-sm uppercase group-hover:border-primary transition-colors">
          {statusLabel}
        </span>
      </div>

      <p className="text-sm sm:text-base lg:text-lg text-muted-foreground font-light leading-relaxed">{project.oneLineValue}</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-1 pt-5 border-t border-white/10">
        <div className="flex flex-col gap-2">
          <span className="text-xs font-mono text-primary/70 uppercase tracking-wide">
            {isEnglish ? "Audience" : "人群"}
          </span>
          <span className="text-sm sm:text-base font-light text-muted-foreground leading-relaxed">
            {project.audienceFit.length > 0 ? formatAudienceTags(project.audienceFit, locale).join(" / ") : isEnglish ? "Read Green Book first" : "先看绿书再判断"}
          </span>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-xs font-mono text-primary/70 uppercase tracking-wide">
            {isEnglish ? "Participation" : "参与"}
          </span>
          <span className="text-sm sm:text-base font-light text-muted-foreground leading-relaxed">
            {formatParticipationModes(project.participationMode, locale).join(" / ")}
          </span>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-xs font-mono text-primary/70 uppercase tracking-wide">
            {isEnglish ? "Relation" : "关系"}
          </span>
          <span className="text-sm sm:text-base font-light text-muted-foreground leading-relaxed">
            {project.hoursRelation?.summary ?? project.learnRelation?.summary ?? (isEnglish ? "Read Green Book first, then decide the next step." : "先看绿书，再判断下一步。")}
          </span>
        </div>
      </div>

      <div className="mt-auto flex items-center gap-4 pt-2">
        {isExternal ? (
          <a
            href={project.externalLink.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground font-bold tracking-widest uppercase text-sm rounded-sm hover:brightness-110 shadow-[0_0_20px_rgba(34,197,94,0.2)] transition-all active:scale-95"
          >
            {project.externalLink.label}
          </a>
        ) : (
          <Link
            to={project.externalLink.url}
            className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground font-bold tracking-widest uppercase text-sm rounded-sm hover:brightness-110 shadow-[0_0_20px_rgba(34,197,94,0.2)] transition-all active:scale-95"
          >
            {project.externalLink.label}
          </Link>
        )}
      </div>
    </SpotlightCard>
  );
}

export default function Ecosystem() {
  const { locale } = useLocale();
  const isEnglish = locale === "en-US";
  const projects = getProjects(locale);
  const featuredProjects = projects.filter((project) => project.featured).sort((left, right) => left.priority - right.priority);
  const secondaryProjects = projects.filter((project) => !project.featured && project.status !== "coming_soon").sort((left, right) => left.priority - right.priority);
  const directoryProjects = projects.filter((project) => project.status === "coming_soon" || project.name === "72hours").sort((left, right) => left.priority - right.priority);

  return (
    <div className="page-shell pt-20 sm:pt-24">
      <div className="absolute top-0 right-0 w-full h-[50vh] bg-[linear-gradient(to_bottom,rgba(34,197,94,0.02)_1px,transparent_1px),linear-gradient(to_right,rgba(34,197,94,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] z-0"></div>
      <div className="absolute top-0 right-1/4 w-1/3 h-[400px] bg-primary/5 blur-[120px] pointer-events-none z-0"></div>

      <section className="page-hero border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.05)_1px,transparent_1px)] bg-[size:15px_15px] opacity-20 pointer-events-none"></div>
        <div className="page-container page-container-wide max-w-5xl flex flex-col gap-5 sm:gap-6 text-center items-center relative z-10">
          <Reveal>
            <div className="page-kicker mb-4">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              {isEnglish ? "Ecosystem entry" : "生态入口"}
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <h1 className="page-title page-title-compact max-w-[10ch] drop-shadow-[0_0_15px_rgba(34,197,94,0.15)]">
              <span className="glitch-text" data-text={isEnglish ? "Start from the entry" : "先看入口"}>
                {isEnglish ? "Start from the entry" : "先看入口"}
              </span>
            </h1>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="page-lead max-w-2xl">
              {isEnglish ? "Check the entry first, then decide whether to join." : "先看入口，再决定要不要进。"}
            </p>
          </Reveal>
          <div className="page-chip-row justify-center pt-2">
              <span className="inline-flex items-center px-3 py-2 rounded-sm border border-white/10 bg-secondary/10 text-[10px] sm:text-xs font-bold tracking-widest uppercase text-muted-foreground">
              {isEnglish ? "Entry" : "入口"}
            </span>
            <span className="inline-flex items-center px-3 py-2 rounded-sm border border-white/10 bg-secondary/10 text-[10px] sm:text-xs font-bold tracking-widest uppercase text-muted-foreground">
              {isEnglish ? "Status" : "状态"}
            </span>
            <span className="inline-flex items-center px-3 py-2 rounded-sm border border-white/10 bg-secondary/10 text-[10px] sm:text-xs font-bold tracking-widest uppercase text-muted-foreground">
              {isEnglish ? "Next step" : "下一步"}
            </span>
          </div>
        </div>
      </section>

      <section className="page-section-tight border-b border-white/5">
        <div className="page-container page-container-wide max-w-5xl">
          <div className="page-chip-row justify-start sm:justify-center overflow-x-auto sm:overflow-visible flex-nowrap sm:flex-wrap pb-1 sm:pb-0 -mx-5 px-5 sm:mx-0 sm:px-0">
            {(isEnglish ? ["All", "Open", "Community", "Follow", "Deep"] : ["全部", "可进", "社区", "关注", "深入"]).map((label, index) => (
              <button
                key={label}
                className={`shrink-0 px-4 py-2 rounded-sm text-[10px] sm:text-xs font-bold tracking-widest uppercase border transition-all ${
                  index === 0
                    ? "bg-primary/10 text-primary border-primary/20"
                    : "bg-secondary/10 text-muted-foreground border-white/5 hover:border-primary/30 hover:text-foreground"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="page-section-tight">
        <div className="page-container page-container-wide max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-4 sm:gap-6 lg:gap-8 items-start">
            <Reveal>
              <ProjectCard project={featuredProjects[0]!} locale={locale} />
            </Reveal>

            <div className="grid gap-4 sm:gap-6 lg:gap-8">
              {secondaryProjects.map((project) => (
                <Reveal key={project.name}>
                  <ProjectCard project={project} locale={locale} />
                </Reveal>
              ))}
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:gap-6 lg:gap-8">
            <Reveal delay={0.1}>
              <div className="flex flex-col gap-3 border-b border-white/10 pb-4">
                <span className="page-kicker w-fit">
                  {isEnglish ? "Directory" : "目录"}
                </span>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                  {isEnglish ? "Each card shows only three things." : "每张卡只看三件事。"}
                </h2>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {directoryProjects.map((project) => (
                <Reveal key={project.name}>
                  <ProjectCard project={project} locale={locale} />
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal delay={0.4}>
            <SpotlightCard className="mt-10 sm:mt-12 page-card page-card-lg flex flex-col items-center text-center gap-5 sm:gap-6 !border-primary/20 bg-primary/5 shadow-[0_0_30px_rgba(34,197,94,0.05)] relative overflow-hidden">
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mt-2">
                {isEnglish ? "Participate first, then understand." : "先参与，再看懂。"}
              </h3>
              <p className="page-lead max-w-xl">
                {isEnglish ? "Start from the representative entry points first." : "先从代表性入口开始。"}
              </p>
              <div className="page-chip-row justify-center">
                <span className="inline-flex items-center px-3 py-2 rounded-sm border border-white/10 bg-background/20 text-[10px] sm:text-xs font-bold tracking-widest uppercase text-muted-foreground">
                  {isEnglish ? "Read Green Book first" : "先看绿书"}
                </span>
                <span className="inline-flex items-center px-3 py-2 rounded-sm border border-white/10 bg-background/20 text-[10px] sm:text-xs font-bold tracking-widest uppercase text-muted-foreground">
                  {isEnglish ? "Then review entry status" : "再看入口状态"}
                </span>
              </div>
              <Link
                to="/join"
                className="inline-flex items-center justify-center mt-4 px-7 sm:px-8 py-4 bg-primary text-primary-foreground font-bold tracking-widest uppercase text-xs sm:text-sm rounded-sm hover:brightness-110 shadow-[0_0_20px_rgba(34,197,94,0.2)] transition-all active:scale-95 hover:gap-4 duration-300"
              >
                {isEnglish ? "Join community" : "加入社区"} <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </SpotlightCard>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
