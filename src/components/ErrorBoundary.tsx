import { Component, ErrorInfo, ReactNode } from "react";
import { Terminal, AlertTriangle } from "lucide-react";

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
      return (
        <div className="min-h-screen flex items-center justify-center bg-background text-foreground font-sora p-6 relative overflow-hidden">
          {/* Noise background */}
          <div className="absolute inset-0 pointer-events-none z-0 opacity-10 bg-noise mix-blend-overlay" />
          
          <div className="relative z-10 max-w-xl w-full border border-red-500/30 bg-red-500/10 p-8 rounded-md shadow-[0_0_40px_rgba(239,68,68,0.15)] backdrop-blur-md">
            <div className="flex items-center gap-4 text-red-500 mb-6 border-b border-red-500/20 pb-4">
              <div className="w-12 h-12 bg-red-500/20 flex items-center justify-center rounded-sm animate-pulse">
                 <AlertTriangle size={24} />
              </div>
              <h1 className="text-2xl font-bold tracking-widest uppercase">系统异常 <span className="opacity-50 text-sm">/ SYSTEM PANIC</span></h1>
            </div>
            
            <p className="text-base text-red-400 mb-6 leading-relaxed font-light">
              客户端渲染线程发生断裂。这可能是由于底层的 UI 状态崩溃或设备内存突发异常引起。
            </p>
            
            <div className="bg-black/60 p-4 rounded-sm border border-red-500/20 mb-8 max-h-48 overflow-y-auto font-mono text-xs text-red-300">
              <span className="text-red-500 font-bold">FATAL_ERROR:</span> {this.state.error?.message || "Unknown rendering exception."}
            </div>

            <button
              onClick={() => window.location.href = '/'}
              className="w-full focus:outline-none focus:ring-2 focus:ring-red-500 px-6 py-4 bg-red-500/20 text-red-500 border border-red-500/50 hover:bg-red-500 hover:text-white font-bold tracking-widest uppercase text-sm rounded-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <Terminal size={18} />
              重启连接序列 (Reboot)
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
