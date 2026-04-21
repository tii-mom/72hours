import { Link } from "react-router-dom";
import { ArrowRight, Fingerprint, Coins, ShieldCheck } from "lucide-react";
import { SpotlightCard } from "../components/SpotlightCard";

export default function Hours() {
  return (
    <div className="flex-1 flex flex-col pt-24 font-sora relative">
      <div className="absolute top-0 right-1/3 w-1/3 h-[400px] bg-primary/5 blur-[120px] pointer-events-none z-0"></div>

      <section className="px-8 lg:px-16 py-20 relative z-10 border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.05)_1px,transparent_1px)] bg-[size:15px_15px] opacity-20 pointer-events-none"></div>
        <div className="container mx-auto max-w-4xl flex flex-col gap-6 text-center items-center relative z-10">
          <div className="w-16 h-16 bg-primary/10 text-primary flex items-center justify-center rounded-full mb-2 shadow-[0_0_20px_rgba(34,197,94,0.2)]">
            <Fingerprint size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter drop-shadow-[0_0_15px_rgba(34,197,94,0.15)]">
            <span className="glitch-text" data-text="信任介质：hours">信任介质：hours</span>
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl font-light">
            我们不售卖虚拟资产。hours 仅仅是连接生态系统中不同角色间的信任媒介与工作量证明。
          </p>
        </div>
      </section>

      <section className="px-8 lg:px-16 py-16 relative z-10">
        <div className="container mx-auto max-w-4xl flex flex-col gap-12">
          
          <SpotlightCard className="p-8 border-l-4 !border-l-primary flex flex-col gap-4">
            <h2 className="text-2xl font-bold tracking-widest">身份解析映射</h2>
            <p className="text-muted-foreground text-lg leading-relaxed font-light">
              如果你是一个<span className="text-foreground font-bold">“漫游者”</span>，hours 是你为心仪的生态应用投票的治理选票；<br />
              如果你是一个<span className="text-foreground font-bold">“共建者”</span>，hours 是你在社区答疑解惑、贡献 Vibe Code 被合并后的链上勋章。
            </p>
          </SpotlightCard>

          <div className="flex flex-col gap-8 mt-4">
            <h2 className="text-2xl font-bold tracking-widest border-b border-white/10 pb-4 text-center sm:text-left"><span className="glitch-text" data-text="拓扑流转场景">拓扑流转场景</span></h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <SpotlightCard className="p-10 flex flex-col gap-6 group">
                <div className="w-12 h-12 bg-primary/10 text-primary flex items-center justify-center rounded-sm">
                  <ShieldCheck size={24} />
                </div>
                <div className="flex flex-col gap-2">
                  <div className="text-xs uppercase text-primary font-bold tracking-widest bg-primary/10 w-fit px-2 py-1 rounded">应用场景 1</div>
                  <h3 className="text-xl font-bold tracking-widest mt-2">生态治理与决策</h3>
                  <p className="text-muted-foreground font-light leading-relaxed">在体验生态应用时，你可以支付 hours 为特定的特性请求（Feature Request）投出赞成票，利用共识引力引导开发者的构建方向。</p>
                </div>
              </SpotlightCard>

              <SpotlightCard className="p-10 flex flex-col gap-6 group">
                <div className="w-12 h-12 bg-primary/10 text-primary flex items-center justify-center rounded-sm">
                  <Coins size={24} />
                </div>
                <div className="flex flex-col gap-2">
                  <div className="text-xs uppercase text-primary font-bold tracking-widest bg-primary/10 w-fit px-2 py-1 rounded">应用场景 2</div>
                  <h3 className="text-xl font-bold tracking-widest mt-2">打赏与互助网络</h3>
                  <p className="text-muted-foreground font-light leading-relaxed">当你在社区里遇到困惑卡点，其他高级协作者通过 Vibe coding 帮助了你，你可以跨应用将 hours 点对点赠予他们以表最直接的感谢。</p>
                </div>
              </SpotlightCard>

              <SpotlightCard className="p-10 flex flex-col gap-6 md:col-span-2 relative overflow-hidden group border-primary/30 bg-primary/5">
                <div className="absolute right-0 top-0 w-1/2 h-full bg-primary/10 blur-[80px] pointer-events-none group-hover:opacity-100 opacity-50 transition-opacity"></div>
                <div className="relative z-10 w-12 h-12 bg-primary text-primary-foreground flex items-center justify-center rounded-sm shadow-[0_0_20px_rgba(34,197,94,0.4)]">
                  <Fingerprint size={24} />
                </div>
                <div className="relative z-10 flex flex-col gap-2">
                  <div className="text-xs uppercase text-primary font-bold tracking-widest bg-primary/20 border border-primary/30 w-fit px-2 py-1 rounded">宏大愿景 (Endgame)</div>
                  <h3 className="text-2xl font-bold tracking-widest mt-2 text-foreground">零信任协议层</h3>
                  <p className="text-muted-foreground font-light leading-relaxed max-w-2xl">
                    随着外围生态的爆发式扩展，所有的社区资源会趋于紧缺。未来由 72hours 社区成员使用 Vibe coding 建立的项目，都会被推崇原生集成 hours 作为其默认的防 API 滥用、限流以及高阶权限验证的准入钥匙。
                  </p>
                </div>
              </SpotlightCard>
            </div>
          </div>

          <div className="mt-8 border-t border-white/10 pt-10 flex flex-col items-center sm:items-start">
            <p className="text-muted-foreground font-light">想要体验真实场景的运转？深入协议第一张网：</p>
            <Link to="/ecosystem" className="inline-flex items-center text-primary font-bold tracking-widest uppercase mt-4 hover:brightness-125 transition-all text-sm group">
              扫描生态应用 <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
