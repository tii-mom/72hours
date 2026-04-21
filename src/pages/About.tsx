import { Link } from "react-router-dom";
import { ArrowLeftRight, TerminalSquare } from "lucide-react";
import { SpotlightCard } from "../components/SpotlightCard";

export default function About() {
  return (
    <div className="flex-1 flex flex-col pt-24 font-sora relative">
      <div className="absolute top-[20%] left-0 w-1/4 h-[600px] bg-primary/5 blur-[150px] pointer-events-none z-0"></div>

      <section className="px-8 lg:px-16 py-20 relative z-10 border-b border-white/5">
        <div className="container mx-auto max-w-4xl flex flex-col gap-8">
          <div className="w-16 h-16 bg-primary/10 text-primary flex items-center justify-center rounded-sm shadow-[0_0_20px_rgba(34,197,94,0.15)]">
            <ArrowLeftRight size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter drop-shadow-[0_0_15px_rgba(34,197,94,0.15)]">
            打破围墙的<span className="glitch-text" data-text="隐性实验">隐性实验</span>
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed font-light">
            加密网络的核心是去中心化的参与，但现实是：阅读白皮书与编写智能合约的高悬壁垒，将大部分普通人阻挡在了“只允许买卖”的观望台。<br/>
            <span className="text-foreground">这是病态的。行业需要真实的创造者。</span>
          </p>
        </div>
      </section>

      <section className="px-8 lg:px-16 py-20 relative z-10">
        <div className="container mx-auto max-w-4xl flex flex-col gap-16">
          
          <div className="flex flex-col gap-8">
            <div className="flex items-center gap-4 border-b border-white/10 pb-4">
              <TerminalSquare className="text-primary" size={24} />
              <h2 className="text-2xl font-bold tracking-widest">不售卖跑鞋，只铺设跑道</h2>
            </div>
            <p className="text-muted-foreground font-light text-lg leading-relaxed">
              72hours 绝对不是一个常规的代币项目方。我们不宣发虚无缥缈的技术神话。我们相信提供工具远不如提供氛围。
            </p>
            
            {/* Tacit Knowledge Highlight Quote */}
            <SpotlightCard className="p-8 !border-primary/20 bg-primary/5 shadow-[0_0_30px_rgba(34,197,94,0.05)] border-l-4 !border-l-primary my-4">
              <p className="text-primary/80 font-mono text-sm mb-2 uppercase tracking-widest">Philosophy: Tacit Knowledge</p>
              <p className="text-foreground text-xl md:text-2xl font-light italic leading-relaxed">
                "你可以学一千遍如何踩水，但这远不如直接把你扔进浅水区。"
              </p>
            </SpotlightCard>

            <p className="text-muted-foreground font-light text-lg leading-relaxed">
              我们是 <strong className="glitch-text" data-text="Michael Polanyi 默会知识理论">Michael Polanyi 默会知识理论</strong> 的绝对信奉者。真正能将想法变为现实的直觉、手感和暗默技巧，根本无法仅仅通过阅读生硬的技术文档传授。
              在 72hours 社区里，我们重构了学习范式：你只需要看着别人怎么给 AI 输入提示词 (<span className="glitch-text font-bold text-primary" data-text="Vibe Coding">Vibe Coding</span>)，你去粗暴地模仿。复杂的开发语境被暴力降维到了“人类自然语言沟通”。
            </p>
          </div>

          <div className="flex flex-col gap-8">
            <h2 className="text-2xl font-bold tracking-widest border-b border-white/10 pb-4"><span className="glitch-text" data-text="引擎链条解析">引擎链条解析</span></h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-6 border border-white/5 bg-secondary/10 rounded-sm">
                <h3 className="text-primary font-bold tracking-widest uppercase mb-2">1. 节点社区</h3>
                <p className="text-sm text-muted-foreground font-light leading-relaxed">提供沉浸式的氛围液池，它是解决你在实战中遇到所有意外 Bug 的最后堡垒。</p>
              </div>
              <div className="p-6 border border-white/5 bg-secondary/10 rounded-sm">
                <h3 className="text-primary font-bold tracking-widest uppercase mb-2">2. 生态靶场</h3>
                <p className="text-sm text-muted-foreground font-light leading-relaxed">真实运作的 Dapp 应用组，让你直观看到依靠自然语言生成的代码片段能在哪里发挥实际价值。</p>
              </div>
              <div className="p-6 border border-white/5 bg-secondary/10 rounded-sm">
                <h3 className="text-primary font-bold tracking-widest uppercase mb-2">3. Vibe 学习径</h3>
                <p className="text-sm text-muted-foreground font-light leading-relaxed">拒绝枯燥，将你强行扶上战马的具体动手序列。</p>
              </div>
              <div className="p-6 border border-primary/20 bg-primary/5 rounded-sm">
                <h3 className="text-primary font-bold tracking-widest uppercase mb-2">4. Hours 介质</h3>
                <p className="text-sm text-foreground font-light leading-relaxed">非金融属性的刻度尺。记录上述整个认知跃迁过程的防篡改证明材料。</p>
              </div>
            </div>
          </div>

          <SpotlightCard className="mt-8 p-12 text-center bg-foreground text-background flex flex-col items-center gap-6">
            <p className="font-bold text-2xl tracking-tighter max-w-xl leading-tight">
              这个系统不需要只会旁观的评论家。<br />拔掉旧世界的插头，成为建造者。
            </p>
            <Link to="/join" className="mt-4 px-8 py-3 bg-background text-foreground text-sm uppercase tracking-widest font-bold border-2 border-background hover:bg-transparent hover:text-background transition-colors rounded-none">
              申请接入链接
            </Link>
          </SpotlightCard>

        </div>
      </section>
    </div>
  );
}
