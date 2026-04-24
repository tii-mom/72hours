import { useEffect, useRef, useState } from "react";
import { ArrowRight, ExternalLink } from "lucide-react";
import { getSiteConfig } from "../content/site-config";
import { useLocale, type Locale } from "../lib/locale";
import { useTheme, type ThemeMode } from "../lib/theme";
import { LocalizedLink as Link } from "../components/LocalizedLink";

type NavigatorPerformanceHints = Navigator & {
  connection?: {
    saveData?: boolean;
  };
  deviceMemory?: number;
};

function shouldUseStaticHeroBackdrop() {
  if (typeof window === "undefined") return true;

  const navigatorHints = navigator as NavigatorPerformanceHints;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isMobileViewport = window.matchMedia("(max-width: 768px)").matches;
  const isDataSaver = navigatorHints.connection?.saveData === true;
  const hasSmallMemory =
    typeof navigatorHints.deviceMemory === "number" && navigatorHints.deviceMemory <= 2;
  const hasFewCores =
    typeof navigator.hardwareConcurrency === "number" && navigator.hardwareConcurrency <= 2;

  return isMobileViewport || prefersReducedMotion || isDataSaver || hasSmallMemory || hasFewCores;
}

function HeroStaticBackdrop() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-hero-bg" aria-hidden="true">
      <div className="hero-square-field absolute inset-0" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.02)_0%,rgba(0,0,0,0.12)_48%,rgba(0,0,0,0.42)_100%)]" />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-gold/10 to-transparent opacity-80" />
      <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-background via-background/70 to-transparent" />
    </div>
  );
}

function HeroFlowBackdrop({ theme }: { theme: ThemeMode }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d", { alpha: true });
    if (!context) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const lowPowerQuery = window.matchMedia("(max-width: 768px)");
    const navigatorHints = navigator as NavigatorPerformanceHints;
    const isClarity = theme === "clarity";
    const hasLowPowerDevice =
      prefersReducedMotion.matches ||
      navigatorHints.connection?.saveData === true ||
      (typeof navigatorHints.deviceMemory === "number" && navigatorHints.deviceMemory <= 2) ||
      (typeof navigator.hardwareConcurrency === "number" && navigator.hardwareConcurrency <= 4);

    let frame = 0;
    let rafId = 0;
    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);

    const palette = isClarity
      ? {
          base: ["rgba(246, 247, 241, 0.98)", "rgba(232, 236, 222, 0.92)", "rgba(249, 250, 244, 0.98)"],
          glow: "35, 122, 75",
          grid: "20, 23, 18",
          particleA: "82, 108, 84",
          particleB: "35, 122, 75",
          beam: "185, 168, 102",
        }
      : {
          base: ["rgba(2, 5, 4, 0.98)", "rgba(4, 8, 7, 0.95)", "rgba(1, 3, 3, 0.99)"],
          glow: "25, 142, 76",
          grid: "25, 142, 76",
          particleA: "140, 182, 146",
          particleB: "25, 142, 76",
          beam: "183, 164, 92",
        };

    const particles = Array.from({ length: hasLowPowerDevice ? 14 : 24 }, (_, index) => ({
      seed: index * 97.3 + 13,
      x: Math.random(),
      y: Math.random(),
      r: 0.65 + Math.random() * 1.25,
      vx: (Math.random() - 0.5) * (hasLowPowerDevice ? 0.00045 : 0.0007),
      vy: -0.0003 - Math.random() * 0.0007,
      glow: 0.14 + Math.random() * 0.38,
    }));

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = () => {
      frame += 1;
      context.clearRect(0, 0, width, height);

      const grad = context.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, palette.base[0]);
      grad.addColorStop(0.45, palette.base[1]);
      grad.addColorStop(1, palette.base[2]);
      context.fillStyle = grad;
      context.fillRect(0, 0, width, height);

      const centerX = width * 0.55;
      const centerY = height * 0.34;
      const pulse = 0.38 + Math.sin(frame * 0.004) * 0.045;
      const glow = context.createRadialGradient(centerX, centerY, 20, centerX, centerY, Math.max(width, height) * 0.72);
      glow.addColorStop(0, `rgba(${palette.glow}, ${isClarity ? 0.055 * pulse : 0.08 * pulse})`);
      glow.addColorStop(0.34, `rgba(${palette.glow}, ${isClarity ? 0.024 * pulse : 0.032 * pulse})`);
      glow.addColorStop(1, `rgba(${palette.glow}, 0)`);
      context.fillStyle = glow;
      context.fillRect(0, 0, width, height);

      context.strokeStyle = `rgba(${palette.grid}, ${hasLowPowerDevice ? 0.02 : isClarity ? 0.026 : 0.03})`;
      context.lineWidth = 1;
      const spacing = lowPowerQuery.matches ? 86 : 78;
      const offset = (frame * (hasLowPowerDevice ? 0.04 : 0.06)) % spacing;

      for (let x = -spacing + offset; x < width + spacing; x += spacing) {
        context.beginPath();
        context.moveTo(x, 0);
        context.lineTo(x, height);
        context.stroke();
      }

      for (let y = -spacing + offset * 0.55; y < height + spacing; y += spacing) {
        context.beginPath();
        context.moveTo(0, y);
        context.lineTo(width, y);
        context.stroke();
      }

      context.save();
      context.globalCompositeOperation = isClarity ? "multiply" : "screen";
      for (const particle of particles) {
        const age = frame * 0.01 + particle.seed;
        const px = ((particle.x + particle.vx * frame * 32 + Math.sin(age * 0.09) * 0.005) % 1 + 1) % 1;
        const py = ((particle.y + particle.vy * frame * 28 + Math.cos(age * 0.08) * 0.003) % 1 + 1) % 1;
        const x = px * width;
        const y = py * height;
        const size = particle.r * (1 + Math.sin(age * 0.8) * 0.12);
        const particleGlow = context.createRadialGradient(x, y, 0, x, y, size * 14);

        particleGlow.addColorStop(0, `rgba(${palette.particleA}, ${(isClarity ? 0.18 : 0.22) * particle.glow})`);
        particleGlow.addColorStop(0.24, `rgba(${palette.particleB}, ${(isClarity ? 0.06 : 0.08) * particle.glow})`);
        particleGlow.addColorStop(1, `rgba(${palette.particleB}, 0)`);
        context.fillStyle = particleGlow;
        context.beginPath();
        context.arc(x, y, size * 6, 0, Math.PI * 2);
        context.fill();
      }
      context.restore();

      const beam = context.createLinearGradient(0, height * 0.72, width, height * 0.28);
      beam.addColorStop(0, `rgba(${palette.beam}, 0)`);
      beam.addColorStop(0.5, `rgba(${palette.beam}, ${hasLowPowerDevice ? 0.022 : isClarity ? 0.034 : 0.042})`);
      beam.addColorStop(1, `rgba(${palette.beam}, 0)`);
      context.fillStyle = beam;
      context.fillRect(0, height * 0.42, width, height * 0.15);

      if (!prefersReducedMotion.matches) {
        rafId = window.requestAnimationFrame(draw);
      }
    };

    const restart = () => {
      window.cancelAnimationFrame(rafId);
      resize();
      draw();
    };

    restart();
    window.addEventListener("resize", restart);
    lowPowerQuery.addEventListener("change", restart);
    prefersReducedMotion.addEventListener("change", restart);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener("resize", restart);
      lowPowerQuery.removeEventListener("change", restart);
      prefersReducedMotion.removeEventListener("change", restart);
    };
  }, [theme]);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />;
}

interface FeatureSignal {
  order: string;
  label: string;
  value: string;
}

interface LaunchEntry {
  body: string;
  href: string;
  meta: string;
  title: string;
  external?: boolean;
}

interface EconomyEntry {
  body: string;
  label: string;
  title: string;
}

function getHomeContent(locale: Locale, siteName: string) {
  const isEnglish = locale === "en-US";

  const featureSignals: readonly FeatureSignal[] = [
    {
      order: "01",
      label: isEnglish ? "Chain" : "TON链",
      value: "TON",
    },
    {
      order: "02",
      label: isEnglish ? "Supply" : "固定发行",
      value: isEnglish ? "Fixed" : "固定",
    },
    {
      order: "03",
      label: isEnglish ? "Apps" : "丰富应用",
      value: isEnglish ? "Live" : "在线",
    },
    {
      order: "04",
      label: isEnglish ? "Model" : "创新经济模型",
      value: "72H",
    },
  ];

  const launchEntries: readonly LaunchEntry[] = [
    {
      title: "WAN",
      body: isEnglish ? "Secure access console for sessions, nodes, and subscription." : "安全接入控制台，处理会话、节点与订阅。",
      href: "https://wan.lat",
      meta: isEnglish ? "Live app" : "在线应用",
      external: true,
    },
    {
      title: "Distribution",
      body: isEnglish ? "Traceable distribution for links, images, and bot entries." : "链接、图片和 Bot 入口的可追踪分发。",
      href: "https://distribution.72h.lol/distribution/",
      meta: isEnglish ? "Ecosystem app" : "生态应用",
      external: true,
    },
    {
      title: isEnglish ? "72H Capital" : "72H Capital",
      body: isEnglish ? "Capital seats, identity surfaces, and verification." : "资本席位、身份界面与公开验证。",
      href: "/capital",
      meta: isEnglish ? "Capital" : "资本",
    },
    {
      title: isEnglish ? "Green Book" : "绿皮书",
      body: isEnglish ? "Token use, supply logic, participation, and risk boundary." : "用途、供给逻辑、参与方式与风险边界。",
      href: "/greenbook",
      meta: isEnglish ? "Public notes" : "公开说明",
    },
  ];

  const economyEntries: readonly EconomyEntry[] = [
    {
      label: isEnglish ? "01 / Utility" : "01 / 用途",
      title: isEnglish ? "Use creates demand." : "使用创造需求。",
      body: isEnglish ? "72H connects apps, access, learning, and identity." : "72H 连接应用、接入、学习与身份。",
    },
    {
      label: isEnglish ? "02 / Scarcity" : "02 / 稀缺",
      title: isEnglish ? "Fixed supply keeps the rule simple." : "固定发行让规则保持清晰。",
      body: isEnglish ? "No governance theater. Utility, access, and participation stay visible." : "不做治理叙事，保留用途、接入和参与。",
    },
    {
      label: isEnglish ? "03 / Ecosystem" : "03 / 生态",
      title: isEnglish ? "Applications carry the story." : "应用承载价值。",
      body: isEnglish ? "WAN, Distribution, Capital, and Green Book form the first public surface." : "WAN、Distribution、Capital 与绿皮书构成首批公开界面。",
    },
  ];

  return {
    hero: {
      title: siteName,
      lead: isEnglish
        ? "Life is short. Wealth can solve it — restart in 72 hours."
        : "人生苦短，暴富可解—72小时重启人生。",
      primaryCtaLabel: isEnglish ? "Browse Ecosystem" : "浏览生态应用",
      secondaryCtaLabel: isEnglish ? "Join Community" : "加入社区",
    },
    featureSignals,
    launch: {
      kicker: isEnglish ? "Live surfaces" : "可进入",
      title: isEnglish ? "Apps before explanation." : "应用先于叙事。",
      lead: isEnglish ? "The first public layer is already usable." : "首批公开界面已经可用。",
      entries: launchEntries,
    },
    economy: {
      kicker: isEnglish ? "72H model" : "72H 模型",
      title: isEnglish ? "Fixed supply. Real usage. Public boundary." : "固定发行。真实使用。公开边界。",
      lead: isEnglish ? "72H is not an abstract banner; it is the utility layer across apps and identity." : "72H 不是抽象口号，而是应用与身份之间的用途层。",
      entries: economyEntries,
    },
  };
}

function SectionHeader({
  kicker,
  lead,
  title,
}: {
  kicker: string;
  lead: string;
  title: string;
}) {
  return (
    <div className="flex max-w-3xl flex-col gap-3 sm:gap-4">
      <div className="page-kicker w-fit">{kicker}</div>
      <h2 className="page-title page-title-compact max-w-3xl">{title}</h2>
      <p className="page-lead max-w-2xl">{lead}</p>
    </div>
  );
}

function FeaturePanel({ signals, isEnglish }: { signals: readonly FeatureSignal[]; isEnglish: boolean }) {
  return (
    <div className="relative overflow-hidden rounded-md border border-line/70 bg-background/48 backdrop-blur-md">
      <div className="absolute inset-0 bg-[linear-gradient(color-mix(in_srgb,hsl(var(--foreground))_7%,transparent)_1px,transparent_1px),linear-gradient(90deg,color-mix(in_srgb,hsl(var(--foreground))_7%,transparent)_1px,transparent_1px)] bg-[size:32px_32px] opacity-24" />
      <div className="relative grid gap-px bg-line/60 p-px">
        <div className="bg-background/82 px-5 py-5 sm:px-6 sm:py-6">
          <div className="font-mono text-[10px] uppercase tracking-[0.26em] text-gold">
            {isEnglish ? "72H on TON" : "72H 在 TON 上"}
          </div>
          <div className="mt-3 text-3xl font-black leading-none text-foreground sm:text-4xl">
            {isEnglish ? "Fixed utility." : "固定用途。"}
          </div>
        </div>
        {signals.map((signal) => (
          <div key={signal.order} className="grid grid-cols-[3rem_minmax(0,1fr)_auto] items-center gap-4 bg-background/70 px-5 py-4 sm:px-6">
            <span className="font-mono text-[10px] text-gold/80">{signal.order}</span>
            <span className="min-w-0 text-sm font-semibold text-muted-foreground sm:text-base">{signal.label}</span>
            <span className="text-base font-black text-foreground sm:text-xl">{signal.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function LaunchLink({ entry, isEnglish }: { entry: LaunchEntry; isEnglish: boolean }) {
  const className =
    "group grid min-h-[6.5rem] grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-b border-line/70 py-5 last:border-b-0 sm:grid-cols-[8rem_minmax(0,1fr)_auto] sm:py-6";
  const icon = entry.external ? (
    <ExternalLink className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
  ) : (
    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
  );
  const content = (
    <>
      <div className="hidden font-mono text-[10px] uppercase tracking-[0.22em] text-gold sm:block">
        {entry.meta}
      </div>
      <div className="min-w-0">
        <div className="text-2xl font-black leading-tight text-foreground sm:text-3xl">
          {entry.title}
        </div>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">
          {entry.body}
        </p>
        <div className="mt-3 font-mono text-[10px] uppercase tracking-[0.22em] text-gold sm:hidden">
          {entry.meta}
        </div>
      </div>
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-sm border border-line/70 bg-surface/70 text-muted-foreground transition-colors duration-200 group-hover:border-primary/35 group-hover:text-gold">
        {icon}
        <span className="sr-only">{isEnglish ? "Open" : "进入"}</span>
      </div>
    </>
  );

  if (entry.external) {
    return (
      <a href={entry.href} target="_blank" rel="noreferrer" className={className}>
        {content}
      </a>
    );
  }

  return (
    <Link to={entry.href} className={className}>
      {content}
    </Link>
  );
}

export default function Home() {
  const { locale } = useLocale();
  const { theme } = useTheme();
  const siteConfig = getSiteConfig(locale);
  const isEnglish = locale === "en-US";
  const [useStaticHero, setUseStaticHero] = useState(shouldUseStaticHeroBackdrop);
  const content = getHomeContent(locale, siteConfig.siteName);

  useEffect(() => {
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobileQuery = window.matchMedia("(max-width: 768px)");
    const updateBackdropMode = () => setUseStaticHero(shouldUseStaticHeroBackdrop());

    updateBackdropMode();
    reducedMotionQuery.addEventListener("change", updateBackdropMode);
    mobileQuery.addEventListener("change", updateBackdropMode);

    return () => {
      reducedMotionQuery.removeEventListener("change", updateBackdropMode);
      mobileQuery.removeEventListener("change", updateBackdropMode);
    };
  }, []);

  return (
    <div className="page-shell overflow-hidden">
      <section className="relative overflow-hidden bg-hero-bg pt-20 sm:pt-24 lg:min-h-[88svh] lg:pt-28">
        <div className="absolute inset-0 z-0">
          <HeroStaticBackdrop />
          {!useStaticHero ? <HeroFlowBackdrop theme={theme} /> : null}
        </div>
        <div className="absolute inset-0 z-[1] pointer-events-none bg-gradient-to-b from-background/5 via-background/10 to-background/90" />

        <div className="relative z-10 mx-auto flex max-w-7xl flex-col px-5 pb-8 pt-5 sm:px-8 sm:pb-12 lg:px-16 lg:py-16">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.72fr)] lg:items-end">
            <div className="flex max-w-4xl flex-col gap-5 sm:gap-6">
              <h1 className="text-[clamp(3.4rem,13vw,7rem)] font-black leading-[0.88] tracking-normal text-foreground">
                {content.hero.title}
              </h1>

              <p className="max-w-3xl text-[18px] leading-8 text-muted-foreground sm:text-2xl sm:leading-9">
                {content.hero.lead}
              </p>

              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
                <Link
                  to={siteConfig.primaryJoinRoute}
                  className="group inline-flex min-h-14 items-center justify-center rounded-sm border border-primary/25 bg-[#07110a] px-8 text-sm font-bold uppercase tracking-widest text-[#d7ffe1] shadow-[0_18px_52px_rgba(0,0,0,0.34)] transition-colors transition-transform hover:border-gold/45 hover:bg-[#0a160e] hover:text-white active:scale-[0.98]"
                >
                  {content.hero.primaryCtaLabel}
                  <ArrowRight className="ml-3 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  to="/join"
                  className="inline-flex min-h-14 items-center justify-center rounded-sm border border-line/70 bg-background/40 px-8 text-sm font-bold uppercase tracking-widest text-foreground/82 backdrop-blur-md transition-colors transition-transform hover:border-primary/30 hover:bg-surface/80 hover:text-foreground active:scale-[0.98]"
                >
                  {content.hero.secondaryCtaLabel}
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-px overflow-hidden rounded-md border border-line/70 bg-line/60 sm:grid-cols-4">
                {content.featureSignals.map((signal) => (
                  <div key={signal.order} className="bg-background/58 px-4 py-3 backdrop-blur-sm">
                    <div className="font-mono text-[10px] text-gold/80">{signal.order}</div>
                    <div className="mt-2 text-xs font-semibold text-muted-foreground">{signal.label}</div>
                    <div className="mt-1 text-base font-black text-foreground">{signal.value}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:pt-6">
              <FeaturePanel signals={content.featureSignals} isEnglish={isEnglish} />
            </div>
          </div>
        </div>
      </section>

      <section className="page-section-tight border-t border-line/70">
        <div className="page-container page-container-wide flex max-w-7xl flex-col gap-6 sm:gap-8">
          <SectionHeader kicker={content.launch.kicker} title={content.launch.title} lead={content.launch.lead} />

          <div className="border-y border-line/70">
            {content.launch.entries.map((entry) => (
              <LaunchLink key={entry.title} entry={entry} isEnglish={isEnglish} />
            ))}
          </div>
        </div>
      </section>

      <section className="page-section-tight border-t border-line/70 bg-surface/14">
        <div className="page-container page-container-wide flex max-w-7xl flex-col gap-6 sm:gap-8">
          <SectionHeader kicker={content.economy.kicker} title={content.economy.title} lead={content.economy.lead} />

          <div className="grid gap-px overflow-hidden rounded-md border border-line/70 bg-line/70 lg:grid-cols-3">
            {content.economy.entries.map((entry) => (
              <div key={entry.label} className="bg-background/58 p-5 sm:p-6 lg:p-8">
                <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-gold">
                  {entry.label}
                </div>
                <h3 className="mt-5 text-2xl font-black leading-tight text-foreground sm:text-3xl">
                  {entry.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">
                  {entry.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
