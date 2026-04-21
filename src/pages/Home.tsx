import React, { Suspense, useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Terminal } from "lucide-react";
import { SpotlightCard } from "../components/SpotlightCard";
import { Reveal } from "../components/Reveal";
import { homeHighlights, siteConfig } from "../lib/content";

const Spline = React.lazy(() => import("@splinetool/react-spline"));

export default function Home() {
  const sectionRef = useRef<HTMLElement>(null);
  const [splineApp, setSplineApp] = useState<any>(null);
  const [isLowPowerMode, setIsLowPowerMode] = useState(false);
  const [heroPrefix = "", heroSuffix = ""] = siteConfig.hero.title.split("，");

  useEffect(() => {
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const isDataSaver = 'connection' in navigator && (navigator as any).connection?.saveData === true;
    
    // Automatically use low power mode on mobile, or if requested by system
    setIsLowPowerMode(isMobile || mediaQuery.matches || isDataSaver);
    
    const handleChange = (e: MediaQueryListEvent) => setIsLowPowerMode(isMobile || e.matches || isDataSaver);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (splineApp) {
          if (entry.isIntersecting) {
            splineApp.play();
          } else {
            splineApp.stop();
          }
        }
      },
      { rootMargin: "150px" } 
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [splineApp]);

  return (
    <div className="flex flex-col w-full bg-background" style={{ marginTop: "-84px" /* counteract fixed header */ }}>
      {/* 3D Hero Section */}
      <section ref={sectionRef} className="relative min-h-[100svh] flex flex-col justify-end bg-hero-bg overflow-hidden pt-32 pb-16 sm:pb-24">
        {/* Spline Background */}
        <div className="absolute inset-0 z-0">
          {!isLowPowerMode ? (
            <Suspense fallback={
              <div className="absolute inset-0 bg-hero-bg flex items-center justify-center overflow-hidden">
                {/* 3D Scene Seamless Placeholder: Ultra-soft blurred neon cores mimicking the real Spline lighting */}
                <div className="absolute w-[80vw] max-w-[600px] h-[80vw] max-h-[600px] bg-primary/20 blur-[130px] rounded-full animate-pulse opacity-60" />
                <div className="absolute w-[50vw] max-w-[400px] h-[50vw] max-h-[400px] bg-primary/30 blur-[100px] rounded-full animate-pulse translate-x-1/3 opacity-40" style={{ animationDelay: "1s" }} />
              </div>
            }>
              <Spline
                scene="https://prod.spline.design/Slk6b8kz3LRlKiyk/scene.splinecode"
                className="w-full h-full transition-opacity duration-1000 ease-in"
                onLoad={(app) => setSplineApp(app)}
              />
            </Suspense>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-hero-bg via-[#1a1a1a] to-black" />
          )}
        </div>
        
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
            入口宣言
          </div>
          
          <h1 className="text-[clamp(2.5rem,6vw,4.5rem)] font-bold leading-[1.1] tracking-[-0.02em] text-foreground opacity-0 animate-fade-up sm:drop-shadow-md" style={{ animationDelay: "0.2s" }}>
            {heroPrefix.replace("社区", "")}
            <span className="text-primary sm:drop-shadow-[0_0_15px_rgba(34,197,94,0.3)]">社区，</span>
            <br />
            {heroSuffix}
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl opacity-0 animate-fade-up font-light" style={{ animationDelay: "0.4s" }}>
            {siteConfig.hero.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-6 pt-8 opacity-0 animate-fade-up pointer-events-auto" style={{ animationDelay: "0.6s" }}>
            <Link to="/join" className="group relative inline-flex h-14 w-full sm:w-auto items-center justify-center rounded-sm bg-primary px-10 text-base md:text-lg font-bold text-primary-foreground uppercase tracking-widest shadow-[0_0_20px_rgba(34,197,94,0.4)] transition-all hover:scale-105 hover:shadow-[0_0_35px_rgba(34,197,94,0.6)] active:scale-95">
              {/* Subtle Ping/Pulse Effect */}
              <span className="absolute inset-0 rounded-sm bg-primary animate-ping opacity-25" style={{ animationDuration: '2.5s' }}></span>
              <span className="relative flex items-center">
                加入社区 <ArrowRight className="ml-3 h-5 w-5 md:h-6 md:w-6 transition-transform group-hover:translate-x-1.5" />
              </span>
            </Link>
            <Link to="/ecosystem" className="inline-flex h-14 w-full sm:w-auto items-center justify-center rounded-sm bg-white text-background px-10 text-base md:text-lg font-bold uppercase tracking-widest transition-all hover:brightness-90 active:scale-95">
              浏览生态应用
            </Link>
          </div>
        </div>
      </section>

      {/* Proof / "Why Real" Section */}
      <section className="px-8 lg:px-16 py-24 relative bg-background">
        <div className="container mx-auto max-w-7xl flex flex-col gap-16">
          <div className="flex flex-col gap-6 max-w-3xl">
            <h2 className="text-[clamp(1.75rem,4vw,2.5rem)] font-bold tracking-tight text-foreground">先从最值得进入的几个切口开始，再理解整个生态。</h2>
            <p className="text-muted-foreground text-lg leading-relaxed font-light">
              这里不是为了把项目排成目录，而是让你更快判断：现在有哪些东西能看、能进、能继续跟。学习不是第一步，先参与才是。
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
          先参与，<br />再决定要不要继续深入。
        </h2>
        <Link
          to="/join"
          className="inline-flex h-14 items-center justify-center rounded-sm bg-primary px-10 text-base font-bold uppercase tracking-widest text-primary-foreground shadow-[0_0_20px_rgba(34,197,94,0.2)] transition-all hover:brightness-110 mt-6 active:scale-[0.98] relative z-10"
        >
          加入社区
        </Link>
      </section>
    </div>
  );
}
