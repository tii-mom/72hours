import { Link } from "react-router-dom";
import { ArrowRight, Fingerprint, Coins, ShieldCheck } from "lucide-react";
import { SpotlightCard } from "../components/SpotlightCard";
import { hoursContent } from "../content/hours";

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
            {hoursContent.title.split("\n").map((line, index) => (
              <span key={line}>
                {line}
                {index === 0 ? <br className="md:hidden" /> : null}
              </span>
            ))}
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl font-light">
            {hoursContent.subtitle}
          </p>
        </div>
      </section>

      <section className="px-8 lg:px-16 py-16 relative z-10">
        <div className="container mx-auto max-w-5xl flex flex-col gap-12">
          <SpotlightCard className="p-8 border-l-4 !border-l-primary flex flex-col gap-4">
            <h2 className="text-2xl font-bold tracking-widest">{hoursContent.roleTitle}</h2>
            <p className="text-muted-foreground text-lg leading-relaxed font-light">
              {hoursContent.roleBody}
            </p>
          </SpotlightCard>

          <div className="flex flex-col gap-8 mt-4">
            <h2 className="text-2xl font-bold tracking-widest border-b border-white/10 pb-4 text-center sm:text-left">
              <span className="glitch-text" data-text={hoursContent.usageIntro}>
                {hoursContent.usageIntro}
              </span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <SpotlightCard className="p-10 flex flex-col gap-6 group">
                <div className="w-12 h-12 bg-primary/10 text-primary flex items-center justify-center rounded-sm">
                  <ShieldCheck size={24} />
                </div>
                <div className="flex flex-col gap-2">
                  <div className="text-xs uppercase text-primary font-bold tracking-widest bg-primary/10 w-fit px-2 py-1 rounded">
                    {hoursContent.uses[0].accent}
                  </div>
                  <h3 className="text-xl font-bold tracking-widest mt-2">{hoursContent.uses[0].title}</h3>
                  <p className="text-muted-foreground font-light leading-relaxed">
                    {hoursContent.uses[0].body}
                  </p>
                </div>
              </SpotlightCard>

              <SpotlightCard className="p-10 flex flex-col gap-6 group">
                <div className="w-12 h-12 bg-primary/10 text-primary flex items-center justify-center rounded-sm">
                  <Coins size={24} />
                </div>
                <div className="flex flex-col gap-2">
                  <div className="text-xs uppercase text-primary font-bold tracking-widest bg-primary/10 w-fit px-2 py-1 rounded">
                    {hoursContent.uses[1].accent}
                  </div>
                  <h3 className="text-xl font-bold tracking-widest mt-2">{hoursContent.uses[1].title}</h3>
                  <p className="text-muted-foreground font-light leading-relaxed">
                    {hoursContent.uses[1].body}
                  </p>
                </div>
              </SpotlightCard>

              <SpotlightCard className="p-10 flex flex-col gap-6 md:col-span-2 relative overflow-hidden group border-primary/30 bg-primary/5">
                <div className="absolute right-0 top-0 w-1/2 h-full bg-primary/10 blur-[80px] pointer-events-none group-hover:opacity-100 opacity-50 transition-opacity"></div>
                <div className="relative z-10 w-12 h-12 bg-primary text-primary-foreground flex items-center justify-center rounded-sm shadow-[0_0_20px_rgba(34,197,94,0.4)]">
                  <Fingerprint size={24} />
                </div>
                <div className="relative z-10 flex flex-col gap-2">
                  <div className="text-xs uppercase text-primary font-bold tracking-widest bg-primary/20 border border-primary/30 w-fit px-2 py-1 rounded">
                    {hoursContent.uses[2].accent}
                  </div>
                  <h3 className="text-2xl font-bold tracking-widest mt-2 text-foreground">{hoursContent.uses[2].title}</h3>
                  <p className="text-muted-foreground font-light leading-relaxed max-w-2xl">
                    {hoursContent.uses[2].body}
                  </p>
                </div>
              </SpotlightCard>
            </div>
          </div>

          <div className="mt-8 border-t border-white/10 pt-10 flex flex-col items-center sm:items-start gap-4">
            <p className="text-muted-foreground font-light">
              {hoursContent.closingBody}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/ecosystem" className="inline-flex items-center text-primary font-bold tracking-widest uppercase hover:brightness-125 transition-all text-sm group">
                浏览生态应用 <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/join" className="inline-flex items-center text-foreground font-bold tracking-widest uppercase hover:text-primary transition-all text-sm group">
                加入社区 <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
