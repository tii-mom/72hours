import { Link } from "react-router-dom";
import { ArrowRight, Eye, RefreshCw, GitMerge } from "lucide-react";
import { motion } from "motion/react";
import { SpotlightCard } from "../components/SpotlightCard";
import { Reveal } from "../components/Reveal";

export default function Learn() {
  return (
    <div className="flex-1 flex flex-col pt-24 font-sora relative">
      <div className="absolute top-0 right-1/4 w-1/3 h-[500px] bg-primary/5 blur-[150px] pointer-events-none z-0"></div>
      <div className="absolute top-32 left-10 w-32 h-32 bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.1)_1px,transparent_1px)] bg-[size:10px_10px] pointer-events-none z-0 opacity-40"></div>

      <section className="px-8 lg:px-16 py-20 relative z-10 border-b border-white/5">
        <div className="container mx-auto max-w-4xl flex flex-col gap-6">
          <Reveal>
            <div className="inline-flex w-fit items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-primary text-[10px] font-mono tracking-widest uppercase mb-4 magnetic-target">
              [Protocol_Injection: <span className="glitch-text" data-text="Vibe_Coding">Vibe_Coding</span>]
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tighter drop-shadow-[0_0_15px_rgba(34,197,94,0.15)] text-balance">
              从旁观到构建的<br className="md:hidden"/><span className="glitch-text" data-text="非线性跨越">非线性跨越</span>
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed font-light text-balance mt-4">
              在 72hours，学习不是考卷，学习是为了获取进入加密生态的<span className="text-foreground font-medium underline decoration-primary/50 underline-offset-4">技术凭证</span>。<br/>
              我们利用 AI 还原了编程的真实维度：<span className="text-foreground font-medium text-primary/90">用人类通用语言支配底层系统逻辑。</span>
            </p>
          </Reveal>
        </div>
      </section>

      <section className="px-8 lg:px-16 py-20 relative z-10">
        <div className="container mx-auto max-w-4xl flex flex-col gap-20">
          
          <Reveal>
            <SpotlightCard className="p-8 md:p-10 flex flex-col gap-6 border-l-4 !border-l-primary relative">
              <span className="absolute top-4 right-6 font-mono text-[10px] text-primary/40 uppercase">// access.check()</span>
              <h2 className="text-3xl font-bold tracking-tighter text-foreground">谁应该启动该序列？</h2>
              <p className="text-muted-foreground text-xl font-light leading-relaxed">
                完全没有技术背景，但对加密生态和互联网产品堆栈充满好奇的人；<br/>
                已经通过体验生态网络跑通了基础认知，现在迫切想掌握构建与修正能力的参与者。
              </p>
            </SpotlightCard>
          </Reveal>

          <div className="flex flex-col gap-16 relative pl-4 sm:pl-0 mt-8">
            {/* Vertical timeline connecting line with Scroll Animation */}
            <motion.div 
              initial={{ height: 0 }}
              whileInView={{ height: "100%" }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="absolute left-[8px] sm:left-[31px] top-8 bottom-0 w-px bg-gradient-to-b from-primary via-primary/30 to-transparent z-0"
            />

            <Reveal delay={0.1}>
              <div className="flex flex-col sm:flex-row gap-8 items-start relative z-10 group">
                <div className="w-16 h-16 flex-shrink-0 bg-secondary border border-primary/30 text-primary flex items-center justify-center font-bold text-xl rounded-sm shadow-[0_0_20px_rgba(34,197,94,0.15)] group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 transform group-hover:-translate-y-1">
                  <Eye size={28} />
                </div>
                <div className="flex flex-col gap-3 pt-1">
                  <h3 className="text-2xl font-bold tracking-tighter flex items-center gap-4 text-foreground">
                    观察与体感 
                    <span className="font-mono text-[10px] uppercase tracking-widest text-primary/50 border border-primary/20 bg-primary/5 px-2 py-1 rounded hidden sm:inline-block">Phase_01: Immersion</span>
                  </h3>
                  <p className="text-muted-foreground font-light leading-relaxed text-lg max-w-3xl mt-2">
                    抛弃传统的冗长视频教程。你需要做的是深入社区对话底层，看别人如何探讨控制指令，看他们如何将 AI 生成的大量逻辑层代码粗暴地粘贴回测试器并跑起来。
                    <br/><span className="text-primary/80 block mt-2">// 在杂乱的现场中提取“默会手感”，这比任何教科书切入得更深。</span>
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="flex flex-col sm:flex-row gap-8 items-start relative z-10 group mt-4">
                <div className="w-16 h-16 flex-shrink-0 bg-secondary border border-primary/30 text-primary flex items-center justify-center font-bold text-xl rounded-sm shadow-[0_0_20px_rgba(34,197,94,0.15)] group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 transform group-hover:-translate-y-1">
                  <RefreshCw size={28} />
                </div>
                <div className="flex flex-col gap-3 pt-1">
                  <h3 className="text-2xl font-bold tracking-tighter flex items-center gap-4 text-foreground">
                    模仿与微调
                    <span className="font-mono text-[10px] uppercase tracking-widest text-primary/50 border border-primary/20 bg-primary/5 px-2 py-1 rounded hidden sm:inline-block">Phase_02: Iteration</span>
                  </h3>
                  <p className="text-muted-foreground font-light leading-relaxed text-lg max-w-3xl mt-2">
                    克隆一份由社区维护的基础模板工坊。尝试给模型大脑抛出一个直觉指令：“把侧边栏隐掉，然后把按钮变红”。盯着屏幕在三秒内完成架构热重载，你的大脑会自然接驳其底层的参数映射图。
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.3}>
              <div className="flex flex-col sm:flex-row gap-8 items-start relative z-10 group mt-4">
                <div className="w-16 h-16 flex-shrink-0 bg-secondary border border-primary/30 text-primary flex items-center justify-center font-bold text-xl rounded-sm shadow-[0_0_20px_rgba(34,197,94,0.15)] group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 transform group-hover:-translate-y-1">
                  <GitMerge size={28} />
                </div>
                <div className="flex flex-col gap-3 pt-1">
                  <h3 className="text-2xl font-bold tracking-tighter flex items-center gap-4 text-foreground">
                    协作与合并
                    <span className="font-mono text-[10px] uppercase tracking-widest text-primary/50 border border-primary/20 bg-primary/5 px-2 py-1 rounded hidden sm:inline-block">Phase_03: Contribution</span>
                  </h3>
                  <p className="text-muted-foreground font-light leading-relaxed text-lg max-w-3xl mt-2">
                    利用 AI 完成 72hours 某个前沿生态应用中真实的低级故障修正，或者强行提交你的第一个个人特性 Pull Request。不要担心失败，高级节点守门人会在此处为你提供毁灭级的审查与安全兜底。
                  </p>
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.5}>
            <SpotlightCard className="mt-16 p-12 flex flex-col items-center text-center gap-8 shadow-[0_0_40px_rgba(34,197,94,0.08)] !border-primary/30 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent">
              <h3 className="text-3xl font-bold tracking-tighter text-foreground">准备好获取系统掌控权了吗？</h3>
              <p className="text-muted-foreground text-xl font-light max-w-2xl leading-relaxed text-balance">
                连接进入核心频道，向世界发起你的第一个异步突发宣告：“新节点加入矩阵，我正在请求测试环境克隆！”
              </p>
              <Link to="/join" className="mt-4 px-10 py-4 bg-primary text-primary-foreground tracking-widest uppercase font-bold w-fit rounded-sm active:scale-95 transition-all hover:brightness-110 shadow-[0_0_20px_rgba(34,197,94,0.2)] flex items-center gap-3 group">
                执行引擎点火 <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </SpotlightCard>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
