import { Link } from "react-router-dom";
import { Terminal } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center pt-24 pb-12 font-sora relative overflow-hidden min-h-[70vh]">
      <div className="absolute inset-0 pointer-events-none opacity-[0.05] flex flex-col justify-between z-0">
        {Array.from({ length: 40 }).map((_, i) => (
          <div key={i} className="w-full h-px bg-primary"></div>
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center text-center p-10 max-w-lg border border-primary/20 bg-secondary/10 backdrop-blur-md rounded-md shadow-[0_0_50px_rgba(34,197,94,0.05)]">
        <div className="w-16 h-16 bg-primary/10 text-primary flex items-center justify-center rounded-sm mb-6 animate-pulse shadow-[0_0_15px_rgba(34,197,94,0.15)]">
          <Terminal size={32} />
        </div>
        <h1 className="text-7xl font-bold tracking-tighter text-primary mb-2 drop-shadow-[0_0_15px_rgba(34,197,94,0.4)]">404</h1>
        <h2 className="text-xl font-bold tracking-widest text-foreground mb-6 uppercase">这个入口暂时不存在</h2>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent mb-6"></div>

        <p className="text-muted-foreground font-light leading-relaxed mb-8">
          你似乎走出了 72hours 当前已经公开的入口范围。<br />
          可以先回到首页，或者从 Join 页面重新进入主语境。
        </p>
        <Link
          to="/"
          className="inline-flex items-center justify-center px-8 py-3 bg-primary text-primary-foreground tracking-widest uppercase font-bold text-sm w-fit rounded-sm hover:brightness-110 shadow-[0_0_15px_rgba(34,197,94,0.15)] transition-all active:scale-95"
        >
          返回首页
        </Link>
      </div>
    </div>
  );
}
