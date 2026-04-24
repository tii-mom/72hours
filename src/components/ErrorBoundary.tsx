import { Component, ErrorInfo, ReactNode } from "react";
import { Terminal, AlertTriangle } from "lucide-react";
import { getLocaleFromPath, localizePath } from "../lib/routes";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught rendering error:", error, errorInfo);
    // Ideally, send to Sentry or Analytics API here
  }

  public render() {
    if (this.state.hasError) {
      const pathname = typeof window !== "undefined" ? window.location.pathname : "/";
      const locale = getLocaleFromPath(pathname);
      const isEnglish = locale === "en-US";
      const homePath = localizePath("/", locale);

      return (
        <div className="page-shell items-center justify-center px-5 sm:px-8 lg:px-16 py-20 sm:py-24 bg-background text-foreground relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none z-0 opacity-10 bg-noise mix-blend-overlay" />
          
          <div className="relative z-10 page-card page-card-lg max-w-xl w-full flex flex-col gap-5 border border-red-500/30 bg-red-500/10 shadow-[0_0_40px_rgba(239,68,68,0.12)] backdrop-blur-md">
            <div className="flex items-center gap-3 sm:gap-4 text-red-400 border-b border-red-500/20 pb-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-red-500/15 flex items-center justify-center rounded-sm">
                 <AlertTriangle size={22} className="sm:hidden" />
                 <AlertTriangle size={24} className="hidden sm:block" />
              </div>
              <h1 className="text-lg sm:text-2xl font-bold tracking-tight uppercase">
                {isEnglish ? "Rendering interrupted" : "系统异常"}
              </h1>
            </div>
            
            <p className="text-sm sm:text-base text-red-300 leading-relaxed font-light">
              {isEnglish
                ? "Client rendering was interrupted. Return home or refresh and try again."
                : "客户端渲染发生中断。先回到首页重新进入，或者刷新后再试一次。"}
            </p>
            
            <div className="bg-black/50 p-4 rounded-sm border border-red-500/20 max-h-48 overflow-y-auto font-mono text-xs text-red-300">
              <span className="text-red-500 font-bold">FATAL_ERROR:</span> {this.state.error?.message || "Unknown rendering exception."}
            </div>

            <button
              onClick={() => window.location.assign(homePath)}
              className="w-full focus:outline-none focus:ring-2 focus:ring-red-500 px-5 sm:px-6 py-3 sm:py-4 bg-red-500/20 text-red-500 border border-red-500/50 hover:bg-red-500 hover:text-white font-bold tracking-widest uppercase text-xs sm:text-sm rounded-sm transition-colors transition-transform active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <Terminal size={18} />
              {isEnglish ? "Back home" : "返回首页"}
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
