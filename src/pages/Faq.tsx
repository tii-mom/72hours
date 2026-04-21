import { Link } from "react-router-dom";
import { ShieldCheck, MessagesSquare, LifeBuoy, BookOpen } from "lucide-react";
import { SpotlightCard } from "../components/SpotlightCard";
import { Reveal } from "../components/Reveal";
import { faqHighlights } from "../lib/content";

const ICONS = {
  start: <MessagesSquare size={22} />,
  official: <ShieldCheck size={22} />,
  learn: <BookOpen size={22} />,
  hours: <LifeBuoy size={22} />,
} as const;

export default function Faq() {
  return (
    <div className="flex-1 flex flex-col pt-24 font-sora relative">
      <section className="px-8 lg:px-16 py-20 relative z-10 border-b border-white/5">
        <div className="container mx-auto max-w-4xl flex flex-col gap-6">
          <Reveal>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-primary text-xs font-bold tracking-widest uppercase mb-4">
              常见问题
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-balance">
              先消除疑虑，再做决定。
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-xl text-muted-foreground leading-relaxed font-light max-w-2xl">
              这里先回答最影响判断的问题：如何开始、如何确认官方入口、学习和参与是什么关系，以及 hours 到底承担什么角色。
            </p>
          </Reveal>
        </div>
      </section>

      <section className="px-8 lg:px-16 py-20 relative z-10">
        <div className="container mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8">
          {faqHighlights.map((item, index) => (
            <Reveal key={item.id} delay={0.1 * index}>
              <SpotlightCard className="p-8 md:p-10 flex flex-col gap-5 h-full">
                <div className="w-12 h-12 bg-primary/10 text-primary flex items-center justify-center rounded-sm">
                  {ICONS[item.id as keyof typeof ICONS]}
                </div>
                <h2 className="text-2xl font-bold tracking-widest">{item.question}</h2>
                <p className="text-muted-foreground font-light leading-relaxed">{item.answer}</p>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="px-8 lg:px-16 pb-28 relative z-10">
        <div className="container mx-auto max-w-4xl">
          <Reveal>
            <SpotlightCard className="p-8 md:p-10 text-center flex flex-col gap-5 border-primary/20 bg-primary/5">
              <h3 className="text-3xl font-bold tracking-tighter">如果你还是不确定，就先进入社区。</h3>
              <p className="text-muted-foreground font-light leading-relaxed max-w-2xl mx-auto">
                72hours 的顺序很简单：先看入口，再看生态，再决定要不要深入。FAQ 的作用只是帮你少走弯路。
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
