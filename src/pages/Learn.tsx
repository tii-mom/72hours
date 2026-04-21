import { Link } from "react-router-dom";
import { ArrowRight, Eye, RefreshCw, GitMerge } from "lucide-react";
import { motion } from "motion/react";
import { SpotlightCard } from "../components/SpotlightCard";
import { Reveal } from "../components/Reveal";
import { featuredLearnPath } from "../lib/content";

const phaseIcons = [Eye, RefreshCw, GitMerge] as const;
const phaseLabels = ["Phase_01: Immersion", "Phase_02: Iteration", "Phase_03: Contribution"] as const;

export default function Learn() {
  const learnPath = featuredLearnPath;

  return (
    <div className="flex-1 flex flex-col pt-24 font-sora relative">
      <div className="absolute top-0 right-1/4 w-1/3 h-[500px] bg-primary/5 blur-[150px] pointer-events-none z-0"></div>
      <div className="absolute top-32 left-10 w-32 h-32 bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.1)_1px,transparent_1px)] bg-[size:10px_10px] pointer-events-none z-0 opacity-40"></div>

      <section className="px-8 lg:px-16 py-20 relative z-10 border-b border-white/5">
        <div className="container mx-auto max-w-4xl flex flex-col gap-6">
          <Reveal>
            <div className="inline-flex w-fit items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-primary text-[10px] font-mono tracking-widest uppercase mb-4 magnetic-target">
              [Path: <span className="glitch-text" data-text="Vibe_Coding">Vibe_Coding</span>]
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tighter drop-shadow-[0_0_15px_rgba(34,197,94,0.15)] text-balance">
              {learnPath.title}
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed font-light text-balance mt-4">
              学习不是第一步。先看懂真实项目，再学会用自然语言和 AI 参与构建，最后进入加密项目开发的更深层协作。
            </p>
          </Reveal>
        </div>
      </section>

      <section className="px-8 lg:px-16 py-20 relative z-10">
        <div className="container mx-auto max-w-4xl flex flex-col gap-20">
          <Reveal>
            <SpotlightCard className="p-8 md:p-10 flex flex-col gap-6 border-l-4 !border-l-primary relative">
              <span className="absolute top-4 right-6 font-mono text-[10px] text-primary/40 uppercase">// access.check()</span>
              <h2 className="text-3xl font-bold tracking-tighter text-foreground">谁适合进入这条路径？</h2>
              <p className="text-muted-foreground text-xl font-light leading-relaxed">
                {learnPath.audience.join("；")}
              </p>
            </SpotlightCard>
          </Reveal>

          <div className="flex flex-col gap-16 relative pl-4 sm:pl-0 mt-8">
            <motion.div
              initial={{ height: 0 }}
              whileInView={{ height: "100%" }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="absolute left-[8px] sm:left-[31px] top-8 bottom-0 w-px bg-gradient-to-b from-primary via-primary/30 to-transparent z-0"
            />

            {learnPath.stages.map((stage, index) => {
              const PhaseIcon = phaseIcons[index] ?? Eye;
              const phaseLabel = phaseLabels[index] ?? "Phase";

              return (
                <Reveal key={stage.name} delay={0.1 * index}>
                  <div className="flex flex-col sm:flex-row gap-8 items-start relative z-10 group mt-4">
                    <div className="w-16 h-16 flex-shrink-0 bg-secondary border border-primary/30 text-primary flex items-center justify-center font-bold text-xl rounded-sm shadow-[0_0_20px_rgba(34,197,94,0.15)] group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 transform group-hover:-translate-y-1">
                      <PhaseIcon size={28} />
                    </div>
                    <div className="flex flex-col gap-3 pt-1">
                      <h3 className="text-2xl font-bold tracking-tighter flex items-center gap-4 text-foreground">
                        {stage.name}
                        <span className="font-mono text-[10px] uppercase tracking-widest text-primary/50 border border-primary/20 bg-primary/5 px-2 py-1 rounded hidden sm:inline-block">
                          {phaseLabel}
                        </span>
                      </h3>
                      <p className="text-muted-foreground font-light leading-relaxed text-lg max-w-3xl mt-2">
                        {stage.description}
                      </p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>

          <Reveal delay={0.5}>
            <SpotlightCard className="mt-16 p-12 flex flex-col items-center text-center gap-8 shadow-[0_0_40px_rgba(34,197,94,0.08)] !border-primary/30 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent">
              <h3 className="text-3xl font-bold tracking-tighter text-foreground">学习是第二阶段，不是入场门槛。</h3>
              <p className="text-muted-foreground text-xl font-light max-w-2xl leading-relaxed text-balance">
                {learnPath.proofOrExpectation}
              </p>
              <Link to="/join" className="mt-4 px-10 py-4 bg-primary text-primary-foreground tracking-widest uppercase font-bold w-fit rounded-sm active:scale-95 transition-all hover:brightness-110 shadow-[0_0_20px_rgba(34,197,94,0.2)] flex items-center gap-3 group">
                {learnPath.entryMethod} <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </SpotlightCard>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
