import { Link } from "react-router-dom";
import { ArrowRight, Box, Beaker, CheckCircle } from "lucide-react";
import { SpotlightCard } from "../components/SpotlightCard";
import { Reveal } from "../components/Reveal";

const PROJECTS = [
  {
    name: "0xBoard",
    status: "内测中",
    description: "一个无需编写复杂智能合约即可体验去中心化社交实验的入口应用。",
    who: "适合愿意每天花 5 分钟浏览信息并进行点赞交互的早期用户。",
    how: "在 Telegram 社区频道发送“申请 0xBoard”即可获得内测链接。",
    relation: "验证 hours 作为价值流转介质的第一个高频实验田。",
    icon: <Box size={24} />,
  },
  {
    name: "Vibe Sandbox",
    status: "开发中",
    description: "内置 AI 辅助的极简代码沙盒。在这里，你可以用人类语言直接修改界面的颜色、排版，并实时预览，无需配置任何本地开发环境。",
    who: "完全没有代码基础，但想体验“一句话生成网页”快感的新手。",
    how: "即将开放。你可以先在社区围观其他人的沙盒作品。",
    relation: "是将 Vibe Coding 理念产品化的核心训练营。",
    icon: <Beaker size={24} />,
  },
];

export default function Ecosystem() {
  return (
    <div className="flex-1 flex flex-col pt-24 font-sora relative">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-full h-[50vh] bg-[linear-gradient(to_bottom,rgba(34,197,94,0.02)_1px,transparent_1px),linear-gradient(to_right,rgba(34,197,94,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] z-0"></div>
      <div className="absolute top-0 right-1/4 w-1/3 h-[400px] bg-primary/5 blur-[120px] pointer-events-none z-0"></div>

      <section className="px-8 lg:px-16 py-20 relative z-10 border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.05)_1px,transparent_1px)] bg-[size:15px_15px] opacity-20 pointer-events-none"></div>
        <div className="container mx-auto max-w-5xl flex flex-col gap-6 text-center items-center relative z-10">
          <Reveal>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-primary text-xs font-bold tracking-widest uppercase mb-4">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              Ecosystem Radar
            </div>
          </Reveal>
          
          <Reveal delay={0.1}>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter drop-shadow-[0_0_15px_rgba(34,197,94,0.15)] text-balance">
              <span className="glitch-text" data-text="真实运作的生态矩阵">真实运作的生态矩阵</span>
              <span className="text-[10px] font-mono text-primary/40 align-top ml-2 hidden md:inline-block tracking-normal">// env.production = true</span>
            </h1>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl font-light text-balance">
              我们不售卖愿景空壳。这里的每一个应用都在真实运作，并向所有社区成员开放测试、反馈和共建。
            </p>
          </Reveal>
        </div>
      </section>

      <section className="px-8 lg:px-16 py-20 relative z-10">
        <div className="container mx-auto max-w-4xl flex flex-col gap-12">
          {PROJECTS.map((proj, idx) => (
            <Reveal key={idx} delay={0.1 * (idx + 1)}>
              <SpotlightCard className="p-8 md:p-10 flex flex-col md:flex-row gap-8 group">
                <div className="flex-1 flex flex-col gap-6 relative">
                  <div className="flex items-center gap-4 border-b border-white/5 pb-4">
                    <div className="w-12 h-12 bg-primary/10 text-primary flex items-center justify-center rounded-sm shadow-[0_0_15px_rgba(34,197,94,0.15)] group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                      {proj.icon}
                    </div>
                    <h2 className="text-3xl font-bold tracking-widest">{proj.name}</h2>
                    <span className="ml-auto px-3 py-1 text-xs font-bold tracking-widest bg-primary/10 text-primary border border-primary/30 rounded-sm uppercase group-hover:border-primary transition-colors">
                      {proj.status}
                    </span>
                  </div>
                  
                  <p className="text-lg text-muted-foreground font-light leading-relaxed">{proj.description}</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-4 bg-black/10 p-6 border border-white/5 rounded-md">
                    <div className="flex flex-col gap-2">
                      <span className="text-xs font-mono text-primary/70 flex items-center gap-2 uppercase tracking-wide">
                        [audience.target]
                      </span>
                      <span className="text-sm font-light text-muted-foreground leading-relaxed">{proj.who}</span>
                    </div>
                    <div className="flex flex-col gap-2">
                      <span className="text-xs font-mono text-primary/70 flex items-center gap-2 uppercase tracking-wide">
                        [path.execute]
                      </span>
                      <span className="text-sm font-light text-muted-foreground leading-relaxed">{proj.how}</span>
                    </div>
                    <div className="flex flex-col gap-2 sm:col-span-2 mt-2 pt-4 border-t border-white/5">
                      <span className="text-xs font-mono text-primary/70 flex items-center gap-2 uppercase tracking-wide">
                        [node.relation]
                      </span>
                      <span className="text-sm font-light text-muted-foreground leading-relaxed">{proj.relation}</span>
                    </div>
                  </div>
                </div>
              </SpotlightCard>
            </Reveal>
          ))}

          <Reveal delay={0.4}>
            <SpotlightCard className="mt-12 p-10 flex flex-col items-center text-center gap-6 !border-primary/20 bg-primary/5 shadow-[0_0_30px_rgba(34,197,94,0.05)] relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 text-[10px] font-mono text-primary/30 uppercase">// init.dev_mode</div>
              <h3 className="font-bold text-3xl tracking-tighter text-foreground mt-2">也有自己的开发想法？</h3>
              <p className="text-muted-foreground max-w-xl font-light leading-relaxed text-balance">
                完成学习路径后，你可以使用 Vibe coding 将自己构建的应用零缝隙地接入 72hours 生态网络中心。我们欢迎构建者主动跨入。
              </p>
              <Link to="/join" className="inline-flex items-center justify-center mt-4 px-8 py-4 bg-primary text-primary-foreground font-bold tracking-widest uppercase text-sm rounded-sm hover:brightness-110 shadow-[0_0_20px_rgba(34,197,94,0.2)] transition-all active:scale-95 hover:gap-4 duration-300">
                接入开发者网络 <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </SpotlightCard>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
