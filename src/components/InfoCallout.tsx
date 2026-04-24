import type { ReactNode } from "react";
import { ArrowRight, ExternalLink } from "lucide-react";
import { SpotlightCard } from "./SpotlightCard";
import { LocalizedLink as Link } from "./LocalizedLink";
import { cn } from "../lib/utils";

type InfoCalloutAction = {
  label: ReactNode;
  href: string;
  external?: boolean;
  variant?: "primary" | "secondary";
};

type InfoCalloutProps = {
  kicker: ReactNode;
  title: ReactNode;
  body: ReactNode;
  actions: InfoCalloutAction[];
  tone?: "light" | "dark";
  align?: "left" | "center";
  className?: string;
};

function getActionClass(tone: "light" | "dark", variant: "primary" | "secondary") {
  if (tone === "dark") {
    return variant === "primary" ? "page-action-dark" : "page-action-dark-muted";
  }

  return variant === "primary" ? "page-action" : "page-action-muted";
}

export function InfoCallout({
  kicker,
  title,
  body,
  actions,
  tone = "light",
  align = "left",
  className = "",
}: InfoCalloutProps) {
  const darkTone = tone === "dark";

  return (
    <SpotlightCard
      className={cn(
        "page-card page-card-lg flex flex-col gap-5 sm:gap-6",
        darkTone ? "border-none bg-foreground text-background shadow-[0_0_40px_rgba(34,197,94,0.1)]" : "border-primary/20 bg-primary/5",
        align === "center" ? "text-center items-center" : "",
        className,
      )}
    >
      <div className="flex flex-col gap-3">
        <p className={cn("font-mono text-[10px] sm:text-xs uppercase tracking-[0.24em]", darkTone ? "text-background/60" : "text-primary/70")}>
          {kicker}
        </p>
        <h3 className={cn("text-2xl sm:text-3xl font-bold tracking-tight leading-tight max-w-2xl", align === "center" ? "mx-auto" : "")}>
          {title}
        </h3>
        <p className={cn("text-sm sm:text-base leading-relaxed max-w-2xl", darkTone ? "text-background/72" : "text-muted-foreground", align === "center" ? "mx-auto" : "")}>
          {body}
        </p>
      </div>

      <div className={cn("page-chip-row pt-1", align === "center" ? "justify-center" : "")}>
        {actions.map((action) => {
          const variant = action.variant ?? "secondary";
          const className = getActionClass(tone, variant);
          const icon = action.external ? <ExternalLink size={16} className="ml-2" /> : <ArrowRight size={16} className="ml-2" />;

          return action.external ? (
            <a key={String(action.label)} href={action.href} target="_blank" rel="noreferrer" className={className}>
              {action.label}
              {icon}
            </a>
          ) : (
            <Link key={String(action.label)} to={action.href} className={className}>
              {action.label}
              {icon}
            </Link>
          );
        })}
      </div>
    </SpotlightCard>
  );
}
