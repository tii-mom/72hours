import { Link, useParams } from "react-router-dom";
import { ShieldAlert, FileText, Scale } from "lucide-react";
import { SpotlightCard } from "../components/SpotlightCard";
import { Reveal } from "../components/Reveal";
import { getLegalDoc } from "../lib/content";

const ICONS = {
  shield: <ShieldAlert size={22} />,
  file: <FileText size={22} />,
  scale: <Scale size={22} />,
} as const;

export default function Legal() {
  const { slug } = useParams();
  const doc = getLegalDoc(slug);

  if (!doc) {
    return (
      <div className="flex-1 flex items-center justify-center px-8 lg:px-16 py-24 font-sora">
        <SpotlightCard className="p-8 md:p-10 max-w-xl text-center flex flex-col gap-4">
          <h1 className="text-3xl font-bold tracking-tighter">这个法律说明暂时不存在。</h1>
          <p className="text-muted-foreground font-light leading-relaxed">
            你可以返回首页，或者先进入社区确认当前可用的官方说明。
          </p>
          <div className="flex flex-wrap gap-4 justify-center pt-2">
            <Link to="/" className="inline-flex px-5 py-3 bg-primary text-primary-foreground text-sm font-bold tracking-widest uppercase rounded-sm">
              返回首页
            </Link>
            <Link to="/join" className="inline-flex px-5 py-3 border border-white/10 text-foreground text-sm font-bold tracking-widest uppercase rounded-sm">
              加入社区
            </Link>
          </div>
        </SpotlightCard>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col pt-24 font-sora relative">
      <section className="px-8 lg:px-16 py-20 relative z-10 border-b border-white/5">
        <div className="container mx-auto max-w-4xl flex flex-col gap-6">
          <Reveal>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-primary text-xs font-bold tracking-widest uppercase mb-4">
              法律说明
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="w-16 h-16 bg-primary/10 text-primary flex items-center justify-center rounded-sm shadow-[0_0_20px_rgba(34,197,94,0.15)]">
              {ICONS[doc.icon]}
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-balance">{doc.title}</h1>
          </Reveal>
          <Reveal delay={0.3}>
            <p className="text-xl text-muted-foreground leading-relaxed font-light max-w-2xl">{doc.intro}</p>
          </Reveal>
        </div>
      </section>

      <section className="px-8 lg:px-16 py-20 relative z-10">
        <div className="container mx-auto max-w-4xl flex flex-col gap-8">
          {doc.sections.map((section, index) => (
            <Reveal key={section.heading} delay={0.1 * index}>
              <SpotlightCard className="p-8 md:p-10 flex flex-col gap-4">
                <h2 className="text-2xl font-bold tracking-widest">{section.heading}</h2>
                <p className="text-muted-foreground font-light leading-relaxed">{section.body}</p>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="px-8 lg:px-16 pb-28 relative z-10">
        <div className="container mx-auto max-w-4xl">
          <Reveal>
            <SpotlightCard className="p-8 md:p-10 text-center flex flex-col gap-5 border-primary/20 bg-primary/5">
              <h3 className="text-3xl font-bold tracking-tighter">如果你需要更多上下文，请先进入社区。</h3>
              <p className="text-muted-foreground font-light leading-relaxed max-w-2xl mx-auto">
                法律说明只负责边界。真正的入口、生态和参与方式，还是以首页、Join 和 Ecosystem 的当前内容为准。
              </p>
              <div className="flex flex-wrap gap-4 justify-center pt-2">
                <Link to="/join" className="inline-flex px-6 py-3 bg-primary text-primary-foreground text-sm font-bold tracking-widest uppercase rounded-sm">
                  加入社区
                </Link>
                <Link to="/ecosystem" className="inline-flex px-6 py-3 border border-white/10 text-foreground text-sm font-bold tracking-widest uppercase rounded-sm">
                  浏览生态应用
                </Link>
              </div>
            </SpotlightCard>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
