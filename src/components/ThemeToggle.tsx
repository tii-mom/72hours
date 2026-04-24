import { Moon, Sun } from "lucide-react";
import { useLocale } from "../lib/locale";
import { useTheme } from "../lib/theme";
import { cn } from "../lib/utils";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { isEnglish } = useLocale();
  const { isClarity, toggleTheme } = useTheme();
  const label = isClarity ? (isEnglish ? "Clarity" : "清晰") : "Signal";
  const nextLabel = isClarity ? "Signal" : isEnglish ? "Clarity" : "清晰";
  const Icon = isClarity ? Sun : Moon;

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={cn(
        "inline-flex min-h-11 min-w-11 items-center justify-center gap-2 whitespace-nowrap rounded-sm border border-line/70 bg-surface/80 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground sm:min-h-0 sm:min-w-0 sm:text-xs",
        className,
      )}
      aria-label={isEnglish ? `Switch to ${nextLabel} theme` : `切换到 ${nextLabel} 主题`}
    >
      <Icon size={14} strokeWidth={1.75} aria-hidden="true" />
      <span>{label}</span>
    </button>
  );
}
