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
import {
  directoryProjects,
  featuredProjects,
  formatAudienceTags,
  formatParticipationModes,
  secondaryProjects,
} from "../lib/content";
import type { Project } from "../lib/content-types";

const projectIcons: Record<NonNullable<Project["iconKey"]>, ReactNode> = {
  box: <Box size={24} />,
  beaker: <Beaker size={24} />,
  check: <CheckCircle size={24} />,
  spark: <Sparkles size={24} />,
  shield: <ShieldCheck size={24} />,
  relay: <GitBranch size={24} />,
};

function ProjectCard({ project }: { project: Project }) {
  const isExternal = project.externalLink.url.startsWith("http");
  const icon = project.iconKey ? projectIcons[project.iconKey] : <Box size={24} />;

  return (
    <SpotlightCard className={`p-8 md:p-10 flex flex-col gap-6 group ${project.featured ? "bg-[#0c0f10]" : ""}`}>
      <div className="flex items-center gap-4 border-b border-white/5 pb-4">
        <div className="w-12 h-12 bg-primary/10 text-primary flex items-center justify-center rounded-sm shadow-[0_0_15px_rgba(34,197,94,0.15)] group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
          {icon}
        </div>
        <h2 className="text-3xl font-bold tracking-widest">{project.name}</h2>
        <span className="ml-auto px-3 py-1 text-xs font-bold tracking-widest bg-primary/10 text-primary border border-primary/30 rounded-sm uppercase group-hover:border-primary transition-colors">
          {project.status}
        </span>
      </div>

      <p className="text-lg text-muted-foreground font-light leading-relaxed">{project.oneLineValue}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-2 bg-black/10 p-6 border border-white/5 rounded-md">
        <div className="flex flex-col gap-2">
          <span className="text-xs font-mono text-primary/70 flex items-center gap-2 uppercase tracking-wide">
            [适合谁]
          </span>
          <span className="text-sm font-light text-muted-foreground leading-relaxed">
            {project.audienceFit.length > 0 ? formatAudienceTags(project.audienceFit).join(" / ") : "先加入社区再判断"}
          </span>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-xs font-mono text-primary/70 flex items-center gap-2 uppercase tracking-wide">
            [怎么参与]
          </span>
          <span className="text-sm font-light text-muted-foreground leading-relaxed">
            {formatParticipationModes(project.participationMode).join(" / ")}
          </span>
        </div>
        <div className="flex flex-col gap-2 sm:col-span-2 mt-2 pt-4 border-t border-white/5">
          <span className="text-xs font-mono text-primary/70 flex items-center gap-2 uppercase tracking-wide">
            [生态关系]
          </span>
          <span className="text-sm font-light text-muted-foreground leading-relaxed">
            {project.hoursRelation?.summary ?? project.learnRelation?.summary ?? "先进入社区，再决定是否继续深入。"}
          </span>
        </div>
      </div>

      <div className="mt-auto flex items-center gap-4">
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
  return (
    <div className="flex-1 flex flex-col pt-24 font-sora relative">
      <div className="absolute top-0 right-0 w-full h-[50vh] bg-[linear-gradient(to_bottom,rgba(34,197,94,0.02)_1px,transparent_1px),linear-gradient(to_right,rgba(34,197,94,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] z-0"></div>
      <div className="absolute top-0 right-1/4 w-1/3 h-[400px] bg-primary/5 blur-[120px] pointer-events-none z-0"></div>

      <section className="px-8 lg:px-16 py-20 relative z-10 border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.05)_1px,transparent_1px)] bg-[size:15px_15px] opacity-20 pointer-events-none"></div>
        <div className="container mx-auto max-w-5xl flex flex-col gap-6 text-center items-center relative z-10">
          <Reveal>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-primary text-xs font-bold tracking-widest uppercase mb-4">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              生态应用
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter drop-shadow-[0_0_15px_rgba(34,197,94,0.15)] text-balance">
              <span className="glitch-text" data-text="先看哪些入口已经真实存在">先看哪些入口已经真实存在</span>
              <span className="text-[10px] font-mono text-primary/40 align-top ml-2 hidden md:inline-block tracking-normal">// live entries</span>
            </h1>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl font-light text-balance">
              这里不是为了把项目排成目录，而是让你更快判断：现在有哪些东西能看、能进、能继续跟。
              先从最值得进入的几个切口开始，再理解整个生态。
            </p>
          </Reveal>
        </div>
      </section>

      <section className="px-8 lg:px-16 py-16 relative z-10 border-b border-white/5">
        <div className="container mx-auto max-w-5xl">
          <div className="flex flex-wrap gap-3 justify-center">
            {["全部项目", "可以立即进入", "先加入社区", "先轻量关注", "更深参与"].map((label, index) => (
              <button
                key={label}
                className={`px-4 py-2 rounded-sm text-xs font-bold tracking-widest uppercase border transition-all ${
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

      <section className="px-8 lg:px-16 py-16 relative z-10">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-8 items-start">
            <Reveal>
              <ProjectCard project={featuredProjects[0]!} />
            </Reveal>

            <div className="grid gap-8">
              {secondaryProjects.map((project) => (
                <Reveal key={project.name}>
                  <ProjectCard project={project} />
                </Reveal>
              ))}
            </div>
          </div>

          <div className="mt-8 grid gap-8">
            <Reveal delay={0.1}>
              <h2 className="text-2xl font-bold tracking-widest border-b border-white/10 pb-4">
                每张卡都应该让你立刻看懂：适合谁、状态如何、现在怎么参与。
              </h2>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {directoryProjects.map((project) => (
                <Reveal key={project.name}>
                  <ProjectCard project={project} />
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal delay={0.4}>
            <SpotlightCard className="mt-12 p-10 flex flex-col items-center text-center gap-6 !border-primary/20 bg-primary/5 shadow-[0_0_30px_rgba(34,197,94,0.05)] relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 text-[10px] font-mono text-primary/30 uppercase">// join.entrypoint</div>
              <h3 className="font-bold text-3xl tracking-tighter text-foreground mt-2">先参与，后理解；先进入，后深入。</h3>
              <p className="text-muted-foreground max-w-xl font-light leading-relaxed text-balance">
                如果你第一次来到 72hours，不必一下子看完全部项目。先从最有代表性的入口开始，通常更容易找到自己的位置。
              </p>
              <Link
                to="/join"
                className="inline-flex items-center justify-center mt-4 px-8 py-4 bg-primary text-primary-foreground font-bold tracking-widest uppercase text-sm rounded-sm hover:brightness-110 shadow-[0_0_20px_rgba(34,197,94,0.2)] transition-all active:scale-95 hover:gap-4 duration-300"
              >
                加入社区 <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </SpotlightCard>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
