import { Link } from "react-router-dom";
import { ArrowLeftRight, TerminalSquare } from "lucide-react";
import { SpotlightCard } from "../components/SpotlightCard";
import { aboutContent } from "../content/about";

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
            {aboutContent.title}
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed font-light">
            {aboutContent.subtitle}
          </p>
        </div>
      </section>

      <section className="px-8 lg:px-16 py-20 relative z-10">
        <div className="container mx-auto max-w-4xl flex flex-col gap-16">
          <div className="flex flex-col gap-8">
            <div className="flex items-center gap-4 border-b border-white/10 pb-4">
              <TerminalSquare className="text-primary" size={24} />
              <h2 className="text-2xl font-bold tracking-widest">{aboutContent.whyTitle}</h2>
            </div>
            <p className="text-muted-foreground font-light text-lg leading-relaxed">
              {aboutContent.whyBody}
            </p>

            <SpotlightCard className="p-8 !border-primary/20 bg-primary/5 shadow-[0_0_30px_rgba(34,197,94,0.05)] border-l-4 !border-l-primary my-4">
              <p className="text-primary/80 font-mono text-sm mb-2 uppercase tracking-widest">Principle: Tacit Knowledge</p>
              <p className="text-foreground text-xl md:text-2xl font-light italic leading-relaxed">
                “{aboutContent.principleQuote}”
              </p>
            </SpotlightCard>

            <p className="text-muted-foreground font-light text-lg leading-relaxed">
              {aboutContent.methodBody}
            </p>
          </div>

          <div className="flex flex-col gap-8">
            <h2 className="text-2xl font-bold tracking-widest border-b border-white/10 pb-4">
              {aboutContent.relationTitle}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {aboutContent.relationCards.map((card) => (
                <div
                  key={card.title}
                  className={`p-6 border rounded-sm ${
                    card.featured ? "border-primary/20 bg-primary/5" : "border-white/5 bg-secondary/10"
                  }`}
                >
                  <h3 className="text-primary font-bold tracking-widest uppercase mb-2">
                    {card.title}
                  </h3>
                  <p className="text-sm text-muted-foreground font-light leading-relaxed">
                    {card.body}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-8">
            <div className="flex items-center gap-4 border-b border-white/10 pb-4">
              <TerminalSquare className="text-primary" size={24} />
              <h2 className="text-2xl font-bold tracking-widest">{aboutContent.principlesTitle}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {aboutContent.principles.map((principle) => (
                <SpotlightCard key={principle.title} className="p-6">
                  <h3 className="text-xl font-bold tracking-widest mb-3">{principle.title}</h3>
                  <p className="text-muted-foreground font-light leading-relaxed">{principle.body}</p>
                </SpotlightCard>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-8">
            <div className="flex items-center gap-4 border-b border-white/10 pb-4">
              <TerminalSquare className="text-primary" size={24} />
              <h2 className="text-2xl font-bold tracking-widest">{aboutContent.rejectTitle}</h2>
            </div>
            <SpotlightCard className="p-8 md:p-10 text-center bg-foreground text-background flex flex-col items-center gap-6">
              <p className="font-bold text-2xl tracking-tighter max-w-xl leading-tight">
                {aboutContent.rejectBody}
              </p>
              <Link
                to="/join"
                className="mt-4 px-8 py-3 bg-background text-foreground text-sm uppercase tracking-widest font-bold border-2 border-background hover:bg-transparent hover:text-background transition-colors rounded-none"
              >
                加入社区
              </Link>
            </SpotlightCard>
          </div>
        </div>
      </section>
    </div>
  );
}
