import {
  Component,
  Suspense,
  lazy,
  useEffect,
  useRef,
  useState,
  type PointerEvent,
  type ReactNode,
} from "react";
import type { Application } from "@splinetool/runtime";
import { useLocale } from "../lib/locale";
import { ArrowRight } from "lucide-react";
import { LocalizedLink as Link } from "../components/LocalizedLink";

const SPLINE_HERO_SCENE = "/hero-spline.splinecode";
const SplineHeroScene = lazy(() => import("@splinetool/react-spline"));

type NavigatorPerformanceHints = Navigator & {
  connection?: {
    saveData?: boolean;
  };
  deviceMemory?: number;
};

type HeroSplineBoundaryProps = {
  children: ReactNode;
  onError: () => void;
  resetKey: string;
};

type HeroSplineBoundaryState = {
  hasError: boolean;
};

class HeroSplineBoundary extends Component<HeroSplineBoundaryProps, HeroSplineBoundaryState> {
  state: HeroSplineBoundaryState = { hasError: false };

  static getDerivedStateFromError(): HeroSplineBoundaryState {
    return { hasError: true };
  }

  componentDidCatch() {
    this.props.onError();
  }

  componentDidUpdate(previousProps: HeroSplineBoundaryProps) {
    if (previousProps.resetKey !== this.props.resetKey && this.state.hasError) {
      this.setState({ hasError: false });
    }
  }

  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

function shouldUseStaticHeroBackdrop() {
  if (typeof window === "undefined") return true;

  const navigatorHints = navigator as NavigatorPerformanceHints;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isDataSaver = navigatorHints.connection?.saveData === true;
  const hasSmallMemory =
    typeof navigatorHints.deviceMemory === "number" && navigatorHints.deviceMemory <= 2;
  const hasFewCores =
    typeof navigator.hardwareConcurrency === "number" && navigator.hardwareConcurrency <= 2;

  return prefersReducedMotion || isDataSaver || hasSmallMemory || hasFewCores;
}

function HeroStaticBackdrop({ className = "" }: { className?: string }) {
  return (
    <div className={`absolute inset-0 overflow-hidden bg-hero-bg ${className}`} aria-hidden="true">
      <div className="hero-square-field absolute inset-0" />
      <div className="hero-square-depth absolute inset-0" />
      <div className="hero-square-spotlight absolute inset-0" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.1)_0%,rgba(0,0,0,0.22)_48%,rgba(0,0,0,0.54)_100%)]" />
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-primary/10 to-transparent opacity-80" />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-background via-background/60 to-transparent" />
    </div>
  );
}

export default function Home() {
  const { locale } = useLocale();
  const isEnglish = locale === "en-US";
  const heroRef = useRef<HTMLElement>(null);
  const splineAppRef = useRef<Application | null>(null);
  const [useStaticHero, setUseStaticHero] = useState(shouldUseStaticHeroBackdrop);
  const [shouldMountSpline, setShouldMountSpline] = useState(false);
  const [isSplineReady, setIsSplineReady] = useState(false);
  const [hasSplineFailed, setHasSplineFailed] = useState(false);

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

  useEffect(() => {
    if (useStaticHero) {
      setShouldMountSpline(false);
      return;
    }

    const mountDelay = window.setTimeout(() => setShouldMountSpline(true), window.innerWidth < 768 ? 240 : 0);
    return () => window.clearTimeout(mountDelay);
  }, [useStaticHero]);

  useEffect(() => {
    const heroElement = heroRef.current;
    if (!heroElement || useStaticHero) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const app = splineAppRef.current;
        if (!app) return;

        if (entry?.isIntersecting) {
          app.play();
        } else {
          app.stop();
        }
      },
      { rootMargin: "150px" },
    );

    observer.observe(heroElement);
    return () => observer.disconnect();
  }, [useStaticHero]);

  useEffect(() => {
    if (!useStaticHero) return;

    splineAppRef.current = null;
    setIsSplineReady(false);
    setHasSplineFailed(false);
  }, [useStaticHero]);

  const handleSplineLoad = (app: Application) => {
    splineAppRef.current = app;
    setHasSplineFailed(false);
    setIsSplineReady(true);

    const rect = heroRef.current?.getBoundingClientRect();
    const isNearViewport = rect ? rect.bottom > -150 && rect.top < window.innerHeight + 150 : true;

    if (isNearViewport) {
      app.play();
    } else {
      app.stop();
    }
  };

  const handleHeroPointerMove = (event: PointerEvent<HTMLElement>) => {
    const target = heroRef.current;
    if (!target) return;

    const rect = target.getBoundingClientRect();
    target.style.setProperty("--hero-spotlight-x", `${event.clientX - rect.left}px`);
    target.style.setProperty("--hero-spotlight-y", `${event.clientY - rect.top}px`);
    target.style.setProperty("--hero-spotlight-opacity", "1");
  };

  const handleHeroPointerLeave = () => {
    heroRef.current?.style.setProperty("--hero-spotlight-opacity", "0.72");
  };

  const handleSplineError = () => {
    splineAppRef.current = null;
    setIsSplineReady(false);
    setHasSplineFailed(true);
  };

  return (
    <div className="flex flex-col w-full bg-background" style={{ marginTop: "-84px" /* counteract fixed header */ }}>
      {/* 3D Hero Section */}
      <section
        ref={heroRef}
        onPointerMove={handleHeroPointerMove}
        onPointerLeave={handleHeroPointerLeave}
        className="relative min-h-[100svh] flex flex-col justify-end bg-hero-bg overflow-hidden pt-32 pb-16 sm:pb-24 [--hero-spotlight-x:50%] [--hero-spotlight-y:42%] [--hero-spotlight-opacity:0.72]"
      >
        <div className="absolute inset-0 z-0">
          <HeroStaticBackdrop
            className={`transition-opacity duration-700 ${useStaticHero || !isSplineReady || hasSplineFailed ? "opacity-100" : "opacity-0"}`}
          />
          {!useStaticHero && shouldMountSpline && !hasSplineFailed ? (
            <HeroSplineBoundary onError={handleSplineError} resetKey={useStaticHero ? "static" : "spline"}>
              <Suspense fallback={null}>
                <SplineHeroScene
                  scene={SPLINE_HERO_SCENE}
                  className="pointer-events-none absolute inset-0 h-full w-full opacity-95 [filter:saturate(1.04)_contrast(1.06)] md:pointer-events-auto"
                  onLoad={handleSplineLoad}
                />
              </Suspense>
            </HeroSplineBoundary>
          ) : null}
        </div>

        <div className="absolute inset-0 z-[0] pointer-events-none bg-[linear-gradient(90deg,transparent_0,rgba(34,197,94,0.08)_50%,transparent_100%)] bg-[length:200%_100%] mix-blend-screen opacity-20 animate-hero-scan" />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent z-[1] pointer-events-none" />

        {/* Subtle Animated Wave Background (Optimized) */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] z-[2] pointer-events-none h-[10vh] min-h-[70px] sm:h-[18vh] sm:min-h-[120px]">
          <svg className="absolute bottom-0 left-0 w-[400vw] sm:w-[200vw] h-[82%] animate-wave-2 text-primary will-change-transform opacity-[0.06] sm:opacity-10 translate-z-0" viewBox="0 0 1200 100" preserveAspectRatio="none">
            <path fill="currentColor" d="M0,50 C300,10 300,90 600,50 C900,10 900,90 1200,50 L1200,100 L0,100 Z" />
          </svg>
          <svg className="absolute bottom-0 left-0 w-[400vw] sm:w-[200vw] h-[66%] animate-wave-1 text-primary will-change-transform opacity-[0.12] sm:opacity-18 translate-z-0" viewBox="0 0 1200 100" preserveAspectRatio="none">
            <path fill="currentColor" d="M0,60 C300,20 300,100 600,60 C900,20 900,100 1200,60 L1200,100 L0,100 Z" />
          </svg>
        </div>

        {/* Hero Actions */}
        <div className="relative z-10 mx-auto w-full max-w-[360px] px-6 pb-[30svh] pointer-events-none sm:max-w-[680px] sm:px-8 sm:pb-[22svh] lg:px-0">
          <div className="flex flex-col items-center gap-6 opacity-0 animate-fade-up pointer-events-auto">
            <div className="flex max-w-[18rem] flex-col items-center gap-3 text-center sm:max-w-[28rem]">
              <h1 className="text-[clamp(1.85rem,7vw,3.25rem)] font-black leading-[0.94] tracking-[-0.08em] text-balance text-white sm:text-[clamp(2.25rem,4vw,3.8rem)]">
                {isEnglish ? "72hours official entry" : "72hours 官方入口"}
              </h1>
              <p className="max-w-[24ch] text-[13px] leading-relaxed text-white/60 sm:max-w-none sm:text-base">
                {isEnglish
                  ? "Telegram / X / ecosystem / join first."
                  : "Telegram / X / 生态应用 / 参与入口。"}
              </p>
            </div>

            <div className="flex w-full flex-col gap-2.5 sm:flex-row sm:justify-center sm:gap-4">
              <Link
                to="/join"
                className="group inline-flex h-[54px] w-full items-center justify-center rounded-sm border border-primary/35 bg-primary px-8 text-[13px] font-bold uppercase tracking-[0.22em] text-primary-foreground shadow-[0_18px_52px_rgba(34,197,94,0.24)] transition-all hover:brightness-110 hover:shadow-[0_22px_72px_rgba(34,197,94,0.34)] active:scale-[0.98] sm:h-14 sm:w-auto sm:min-w-[210px] sm:text-[14px]"
              >
                <span className="relative flex items-center">
                  {isEnglish ? "Join community" : "加入社区"}{" "}
                  <ArrowRight className="ml-3 h-4 w-4 transition-transform group-hover:translate-x-1.5 sm:h-5 sm:w-5" />
                </span>
              </Link>
              <Link
                to="/ecosystem"
                className="inline-flex h-[54px] w-full items-center justify-center rounded-sm border border-white/14 bg-black/34 px-8 text-[13px] font-bold tracking-[0.18em] text-white/88 shadow-[0_18px_50px_rgba(0,0,0,0.34)] backdrop-blur-md transition-all hover:border-white/24 hover:bg-white/10 hover:text-white active:scale-[0.98] sm:h-14 sm:w-auto sm:min-w-[230px] sm:text-[14px]"
              >
                {isEnglish ? "Browse ecosystem" : "浏览生态应用"}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
