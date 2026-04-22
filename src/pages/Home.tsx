import { useLocale } from "../lib/locale";
import { Link } from "react-router-dom";
import { ArrowRight, Terminal } from "lucide-react";
import { SpotlightCard } from "../components/SpotlightCard";
import { Reveal } from "../components/Reveal";
import { getHomeHighlights, getSiteConfig } from "../content/site-config";

export default function Home() {
  const { locale } = useLocale();
  const isEnglish = locale === "en-US";
  const siteConfig = getSiteConfig(locale);
  const homeHighlights = getHomeHighlights(locale);

  const HeroBackdrop = ({ animated }: { animated: boolean }) => (
    <div className="absolute inset-0 overflow-hidden bg-hero-bg">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_18%,rgba(34,197,94,0.32)_0,transparent_22%),radial-gradient(circle_at_80%_14%,rgba(34,197,94,0.18)_0,transparent_20%),radial-gradient(circle_at_62%_52%,rgba(34,197,94,0.14)_0,transparent_28%),radial-gradient(circle_at_48%_72%,rgba(34,197,94,0.2)_0,transparent_24%)] opacity-90" />
      <div
        className={`absolute inset-[-10%] bg-[radial-gradient(circle_at_20%_18%,rgba(34,197,94,0.36)_0,transparent_26%),radial-gradient(circle_at_78%_22%,rgba(34,197,94,0.22)_0,transparent_22%),radial-gradient(circle_at_52%_78%,rgba(34,197,94,0.22)_0,transparent_28%)] opacity-90 ${
          animated ? "animate-hero-drift" : ""
        }`}
      />
      <div className={`absolute inset-y-[8%] left-[18%] w-[1px] bg-gradient-to-b from-transparent via-primary/28 to-transparent blur-[0.4px] ${animated ? "animate-hero-float" : ""}`} />
      <div className={`absolute inset-y-[12%] right-[24%] w-[1px] bg-gradient-to-b from-transparent via-primary/18 to-transparent ${animated ? "animate-hero-drift-reverse" : ""}`} />
      <div className={`absolute left-[12%] top-[26%] h-[8rem] w-[8rem] rounded-full border border-primary/12 ${animated ? "animate-hero-float" : ""}`} />
      <div className={`absolute right-[16%] top-[32%] h-[12rem] w-[12rem] rounded-full border border-primary/10 ${animated ? "animate-hero-drift" : ""}`} />
      <div className={`absolute left-[-8%] top-[12%] h-[28rem] w-[28rem] rounded-full bg-primary/12 blur-[120px] ${animated ? "animate-hero-float" : ""}`} />
      <div className={`absolute right-[-12%] top-[18%] h-[24rem] w-[24rem] rounded-full bg-primary/10 blur-[110px] ${animated ? "animate-hero-drift-reverse" : ""}`} />
      <div className={`absolute bottom-[4%] left-[10%] h-[20rem] w-[20rem] rounded-full bg-primary/14 blur-[100px] ${animated ? "animate-hero-float" : ""}`} />
      <div
        className={`absolute inset-0 bg-[linear-gradient(90deg,transparent_0,rgba(34,197,94,0.22)_48%,transparent_62%)] bg-[length:240%_100%] mix-blend-screen opacity-70 ${
          animated ? "animate-hero-scan" : ""
        }`}
      />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:48px_48px] opacity-[0.22]" />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5" />
    </div>
  );

  return (
    <div className="flex flex-col w-full bg-background" style={{ marginTop: "-84px" /* counteract fixed header */ }}>
      {/* 3D Hero Section */}
      <section className="relative min-h-[100svh] flex flex-col justify-end bg-hero-bg overflow-hidden pt-32 pb-16 sm:pb-24">
        <div className="absolute inset-0 z-0">
          <HeroBackdrop animated />
        </div>

        <div className="absolute inset-0 z-[0] pointer-events-none bg-[linear-gradient(90deg,transparent_0,rgba(34,197,94,0.08)_50%,transparent_100%)] bg-[length:200%_100%] mix-blend-screen opacity-25 animate-hero-scan" />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent z-[1] pointer-events-none" />

        {/* Subtle Animated Wave Background (Optimized) */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] z-[2] pointer-events-none h-[15vh] sm:h-[25vh] min-h-[100px] sm:min-h-[150px]">
          <svg className="absolute bottom-0 left-0 w-[400vw] sm:w-[200vw] h-[85%] animate-wave-2 text-primary will-change-transform opacity-[0.15] sm:opacity-20 translate-z-0" viewBox="0 0 1200 100" preserveAspectRatio="none">
            <path fill="currentColor" d="M0,50 C300,10 300,90 600,50 C900,10 900,90 1200,50 L1200,100 L0,100 Z" />
          </svg>
          <svg className="absolute bottom-0 left-0 w-[400vw] sm:w-[200vw] h-[70%] animate-wave-1 text-primary will-change-transform opacity-[0.25] sm:opacity-30 translate-z-0" viewBox="0 0 1200 100" preserveAspectRatio="none">
            <path fill="currentColor" d="M0,60 C300,20 300,100 600,60 C900,20 900,100 1200,60 L1200,100 L0,100 Z" />
          </svg>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 w-full max-w-4xl mx-auto px-8 lg:px-16 flex flex-col gap-6 pointer-events-none">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs font-bold w-fit uppercase tracking-widest opacity-0 animate-fade-up pointer-events-auto shadow-[0_0_10px_rgba(34,197,94,0.1)]">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            {isEnglish ? "Entry statement" : "入口宣言"}
          </div>
          
          <h1 className="text-[clamp(2.5rem,6vw,4.5rem)] font-bold leading-[1.1] tracking-[-0.02em] text-foreground opacity-0 animate-fade-up sm:drop-shadow-md" style={{ animationDelay: "0.2s" }}>
            {siteConfig.hero.title}
          </h1>
          
          <p className="max-w-2xl text-lg leading-relaxed text-white/68 opacity-0 animate-fade-up font-light md:text-xl" style={{ animationDelay: "0.4s" }}>
            {siteConfig.hero.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-6 pt-8 opacity-0 animate-fade-up pointer-events-auto" style={{ animationDelay: "0.6s" }}>
            <Link to="/join" className="group relative inline-flex h-14 w-full sm:w-auto items-center justify-center rounded-sm bg-primary px-10 text-base md:text-lg font-bold text-primary-foreground uppercase tracking-widest shadow-[0_0_20px_rgba(34,197,94,0.4)] transition-all hover:scale-105 hover:shadow-[0_0_35px_rgba(34,197,94,0.6)] active:scale-95">
              {/* Subtle Ping/Pulse Effect */}
              <span className="absolute inset-0 rounded-sm bg-primary animate-ping opacity-25" style={{ animationDuration: '2.5s' }}></span>
              <span className="relative flex items-center">
                {isEnglish ? "Join community" : "加入社区"} <ArrowRight className="ml-3 h-5 w-5 md:h-6 md:w-6 transition-transform group-hover:translate-x-1.5" />
              </span>
            </Link>
            <Link to="/ecosystem" className="inline-flex h-14 w-full sm:w-auto items-center justify-center rounded-sm bg-white text-background px-10 text-base md:text-lg font-bold uppercase tracking-widest transition-all hover:brightness-90 active:scale-95">
              {isEnglish ? "Browse ecosystem" : "浏览生态应用"}
            </Link>
          </div>
        </div>
      </section>

      {/* Proof / "Why Real" Section */}
      <section className="px-8 lg:px-16 py-24 relative bg-background">
        <div className="container mx-auto max-w-7xl flex flex-col gap-16">
          <div className="flex flex-col gap-6 max-w-3xl">
            <h2 className="text-[clamp(1.75rem,4vw,2.5rem)] font-bold tracking-tight text-foreground">
              {isEnglish
                ? "Start with the key entry points, then read the rest."
                : "先从几个入口开始，再看全局。"}
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed font-light">
              {isEnglish
                ? "Choose what to view, enter, and follow now. Learn later."
                : "先判断现在该看什么、进什么、跟什么。学习放后面。"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {homeHighlights.map((highlight, index) => (
              <SpotlightCard key={highlight.title} className="p-8 flex flex-col gap-6 group">
                <div className="w-12 h-12 bg-primary/10 text-primary flex items-center justify-center rounded-sm mb-2 shadow-[0_0_15px_rgba(34,197,94,0.15)] group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                  {index === 0 ? <Terminal size={24} /> : <span className="font-bold text-lg">{highlight.iconLabel}</span>}
                </div>
                <h3 className="text-xl font-bold tracking-widest">{highlight.title}</h3>
                <p className="text-muted-foreground font-light leading-relaxed">
                  {highlight.body}
                </p>
                <Link to={highlight.href} className="text-sm font-bold tracking-widest uppercase text-primary transition-colors mt-auto pt-4 inline-flex items-center">
                  {highlight.cta} -&gt;
                </Link>
              </SpotlightCard>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="px-8 lg:px-16 py-32 bg-secondary/10 border-t border-white/5 flex flex-col items-center justify-center text-center gap-8 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl h-40 bg-primary/10 blur-[100px] rounded-full pointer-events-none"></div>
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight max-w-2xl relative z-10 leading-[1.2]">
          {isEnglish ? (
            <>
              Participate first,
              <br />
              then decide whether to go deeper.
            </>
          ) : (
            <>
              先参与，
              <br />
              再决定要不要继续深入。
            </>
          )}
        </h2>
        <Link
          to="/join"
          className="inline-flex h-14 items-center justify-center rounded-sm bg-primary px-10 text-base font-bold uppercase tracking-widest text-primary-foreground shadow-[0_0_20px_rgba(34,197,94,0.2)] transition-all hover:brightness-110 mt-6 active:scale-[0.98] relative z-10"
        >
          {isEnglish ? "Join community" : "加入社区"}
        </Link>
      </section>
    </div>
  );
}
