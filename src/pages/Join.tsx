import { Link } from "react-router-dom";
import { SpotlightCard } from "../components/SpotlightCard";

export default function Join() {
  return (
    <div className="flex-1 flex flex-col pt-24 font-sora relative">
      <section className="px-8 lg:px-16 py-24 relative z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.05)_1px,transparent_1px)] bg-[size:20px_20px] opacity-30 pointer-events-none"></div>
        <div className="container mx-auto max-w-4xl flex flex-col items-center text-center gap-8 relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter drop-shadow-[0_0_20px_rgba(34,197,94,0.2)]">
            解除焦虑：<br />你需要的只是<span className="glitch-text" data-text="推门进入">推门进入</span>
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed font-light max-w-2xl">
            没有人会在这里审视你的技术水平。先以非官方旁观者的身份挂在此处，潜水监听，这就是启动整个系统的第一周目。
          </p>
        </div>
      </section>

      <section className="px-8 lg:px-16 pb-32 relative z-10">
        <div className="container mx-auto max-w-3xl flex flex-col gap-8">
          
          {/* Main Channel */}
          <SpotlightCard className="p-8 md:p-10 flex flex-col sm:flex-row gap-8 items-start sm:items-center">
            <div className="bg-[#24A1DE]/10 p-5 rounded-full flex-shrink-0 shadow-[0_0_20px_rgba(36,161,222,0.2)]">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21.198 1.80214C20.9328 1.63737 20.5985 1.58334 20.2917 1.65681L1.24641 5.99824C0.840742 6.09062 0.540166 6.38833 0.444983 6.79093C0.3498 7.19354 0.478951 7.61637 0.789182 7.91717L7.49624 14.4177L13.8821 7.42065L8.98972 15.3556L15.3031 21.4398C15.5459 21.6738 15.8856 21.7824 16.2163 21.7317C16.547 21.6811 16.8291 21.4771 16.9744 21.1837L22.6841 3.23849C22.8252 2.91572 22.802 2.54418 22.6206 2.23932C22.4392 1.93446 22.1226 1.73719 21.767 1.70588" fill="#24A1DE"/>
              </svg>
            </div>
            <div className="flex-1 flex flex-col gap-3">
              <h2 className="text-2xl font-bold tracking-widest text-[#24A1DE]"><span className="glitch-text" data-text="主调度阵地：Telegram">主调度阵地：Telegram</span></h2>
              <p className="text-muted-foreground font-light leading-relaxed">
                这里是活跃度极高的数据流集散地。有任何疑问直接扔出来，会有高级节点指导你修改代码结构。氛围轻盈，首次连接仅需发送一条协议：“Hi”。
              </p>
              <div className="mt-4">
                <a href="https://t.me/the_72h" target="_blank" rel="noreferrer" className="inline-flex px-8 py-3 bg-[#24A1DE] hover:bg-[#24A1DE]/90 text-white font-bold tracking-widest uppercase rounded-sm text-sm active:scale-95 transition-all shadow-[0_0_15px_rgba(36,161,222,0.3)]">
                  请求连接电报节点
                </a>
              </div>
            </div>
          </SpotlightCard>

          {/* Social Channel */}
          <SpotlightCard className="p-8 md:p-10 flex flex-col sm:flex-row gap-8 items-start sm:items-center">
            <div className="bg-foreground/10 p-5 text-foreground text-4xl font-black rounded-full flex-shrink-0 w-[76px] h-[76px] flex items-center justify-center">
              X
            </div>
            <div className="flex-1 flex flex-col gap-3">
              <h2 className="text-2xl font-bold tracking-widest"><span className="glitch-text" data-text="异步广播站：X (Twitter)">异步广播站：X (Twitter)</span></h2>
              <p className="text-muted-foreground font-light leading-relaxed">
                不想处理双向网络通信？只想被动接收系统级的大规模生态更新、版本发布与深层逻辑解析？这是观察高层架构的最佳位置。
              </p>
              <div className="mt-4">
                <a href="https://x.com/taichi2077" target="_blank" rel="noreferrer" className="inline-flex px-8 py-3 border-2 border-foreground hover:bg-foreground hover:text-background text-foreground font-bold tracking-widest uppercase rounded-sm text-sm active:scale-95 transition-all">
                  侦听 @taichi2077
                </a>
              </div>
            </div>
          </SpotlightCard>

          {/* Fallback Channel */}
          <div className="p-8 mt-4 border border-white/5 bg-secondary/10 flex flex-col items-center text-center gap-4 border-dashed rounded-md">
            <span className="text-primary font-mono text-sm tracking-widest uppercase border border-primary/20 bg-primary/10 px-3 py-1">Fallback</span>
            <p className="text-muted-foreground font-light max-w-lg">
              遇到严重的网络环境封锁无法连接境外传输协议？<br/>请发送内部审核凭证至 fallback 邮箱：<a href="mailto:hello@72hours.org" className="text-foreground hover:text-primary transition-colors border-b border-primary/30">hello@72hours.org</a>
            </p>
          </div>

          <div className="mt-12 text-center p-6 border-b border-white/5 pb-12">
             <div className="mx-auto w-12 h-1 bg-red-500/50 mb-6"></div>
             <p className="text-muted-foreground font-light text-sm max-w-lg mx-auto leading-relaxed">
               <span className="text-red-400 font-bold tracking-widest">SEVERE WARNING: </span><br/>
               72hours 唯一的目的为共建共创。系统永远不会发出让你签署敏感代币空投权限或转移主网资产的网络指令。警惕伪造标识的虚假克隆节点。
             </p>
          </div>
        </div>
      </section>
    </div>
  );
}
