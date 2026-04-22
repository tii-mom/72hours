import { Link } from "react-router-dom";
import { Terminal } from "lucide-react";
import { useLocale } from "../lib/locale";

export default function NotFound() {
  const { locale } = useLocale();
  const isEnglish = locale === "en-US";
  return (
    <div className="page-shell items-center justify-center px-5 sm:px-8 lg:px-16 py-20 sm:py-24 relative overflow-hidden min-h-[70vh]">
      <div className="absolute inset-0 pointer-events-none opacity-[0.05] flex flex-col justify-between z-0">
        {Array.from({ length: 40 }).map((_, i) => (
          <div key={i} className="w-full h-px bg-primary"></div>
        ))}
      </div>

      <div className="relative z-10 page-card page-card-lg max-w-lg w-full flex flex-col items-center text-center gap-4 sm:gap-5 border border-primary/20 bg-secondary/10 backdrop-blur-md shadow-[0_0_40px_rgba(34,197,94,0.05)]">
        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary/10 text-primary flex items-center justify-center rounded-sm shadow-[0_0_15px_rgba(34,197,94,0.15)]">
          <Terminal size={28} className="sm:hidden" />
          <Terminal size={32} className="hidden sm:block" />
        </div>
        <div className="page-kicker">{isEnglish ? "Page not found" : "页面未找到"}</div>
        <h1 className="text-[clamp(3.5rem,16vw,6rem)] leading-none font-bold tracking-tighter text-primary drop-shadow-[0_0_15px_rgba(34,197,94,0.35)]">
          404
        </h1>
        <h2 className="text-base sm:text-xl font-bold tracking-tight text-foreground">
          {isEnglish ? "This entry does not exist yet." : "这个入口暂时不存在"}
        </h2>

        <p className="page-lead max-w-md">
          {isEnglish
            ? "You are looking at an unpublished or moved address. Go back home, or re-enter the main context from Join."
            : "你现在看到的是一个未公开或已迁移的地址。先回到首页，或者从 Join 重新进入主语境。"}
        </p>
        <div className="page-chip-row justify-center pt-2">
          <Link
            to="/"
            className="inline-flex items-center justify-center px-5 sm:px-6 py-3 bg-primary text-primary-foreground tracking-widest uppercase font-bold text-xs sm:text-sm w-fit rounded-sm hover:brightness-110 shadow-[0_0_15px_rgba(34,197,94,0.15)] transition-all active:scale-95"
          >
            {isEnglish ? "Back home" : "返回首页"}
          </Link>
          <Link
            to="/join"
            className="inline-flex items-center justify-center px-5 sm:px-6 py-3 border border-white/10 text-foreground tracking-widest uppercase font-bold text-xs sm:text-sm w-fit rounded-sm hover:border-primary/40 transition-all active:scale-95"
          >
            {isEnglish ? "Enter community" : "进入社区"}
          </Link>
        </div>
      </div>
    </div>
  );
}
