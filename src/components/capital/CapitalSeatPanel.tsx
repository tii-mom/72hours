import { AlertTriangle, ArrowRight, ExternalLink } from "lucide-react";
import { SpotlightCard } from "../SpotlightCard";
import { LocalizedLink as Link } from "../LocalizedLink";
import { cn } from "../../lib/utils";
import type { CapitalSeatProgramView } from "../../content/capital";
import type { Locale } from "../../lib/locale";

const toneClasses = {
  primary: "border-primary/20 bg-primary/10 text-primary",
  gold: "border-gold/20 bg-gold/10 text-gold",
  muted: "border-line/70 bg-background/50 text-foreground",
} as const;

function ActionButton({
  href,
  label,
  variant,
  external,
  onClick,
  disabled,
}: {
  href: string;
  label: string;
  variant?: "primary" | "secondary";
  external?: boolean;
  onClick?: () => void | Promise<void>;
  disabled?: boolean;
}) {
  const className = variant === "primary" ? "page-action" : "page-action-muted";

  if (onClick) {
    return (
      <button type="button" onClick={onClick} disabled={disabled} className={`${className} disabled:pointer-events-none disabled:opacity-60`}>
        {label}
        <ArrowRight className="ml-2 h-4 w-4" />
      </button>
    );
  }

  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={className}>
        {label}
        <ExternalLink className="ml-2 h-4 w-4" />
      </a>
    );
  }

  return (
    <Link to={href} className={className}>
      {label}
      <ArrowRight className="ml-2 h-4 w-4" />
    </Link>
  );
}

export function CapitalSeatPanel({
  program,
  locale,
  primaryAction,
}: {
  program: CapitalSeatProgramView;
  locale: Locale;
  primaryAction?: {
    label?: string;
    onClick: () => void | Promise<void>;
    disabled?: boolean;
  };
}) {
  return (
    <SpotlightCard
      className={cn(
        "page-card flex h-full flex-col gap-5 border-line/70 bg-surface/72",
        program.tone === "gold" && "border-gold/20 bg-[linear-gradient(180deg,rgba(191,165,92,0.05),rgba(15,20,18,0.72))]"
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className={cn("font-mono text-[10px] uppercase tracking-[0.24em]", program.tone === "gold" ? "text-gold/80" : "text-primary/70")}>
            {program.title}
          </p>
          <h3 className="mt-2 text-2xl font-black tracking-normal text-foreground">
            {program.formalLabel}
          </h3>
        </div>
        <span className={cn("inline-flex min-h-8 items-center rounded-sm border px-3 text-[10px] font-bold uppercase tracking-[0.18em]", toneClasses[program.tone])}>
          {program.type === "reserve" ? "Reserve" : "Alpha"}
        </span>
      </div>

      <p className="text-sm leading-7 text-muted-foreground">{program.description}</p>

      <div className="grid gap-3 border-y border-line/70 py-4 sm:grid-cols-2">
        {program.metrics.map((metric) => (
          <div key={metric.label} className="rounded-sm border border-line/70 bg-background/42 px-4 py-3">
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{metric.label}</div>
            <div className="mt-2 text-sm font-semibold text-foreground">{metric.value}</div>
            {metric.hint ? <div className="mt-1 text-xs text-muted-foreground">{metric.hint}</div> : null}
          </div>
        ))}
      </div>

      <div className="grid gap-3">
        {program.confirmations.map((item) => (
          <div key={item} className="rounded-sm border border-line/70 bg-background/42 px-4 py-3 text-sm leading-7 text-foreground/88">
            {item}
          </div>
        ))}
      </div>

      <div className="rounded-sm border border-gold/20 bg-gold/8 px-4 py-3">
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-gold">
          <AlertTriangle className="h-3.5 w-3.5" />
          {locale === "en-US" ? "Risk disclosure" : "风险披露"}
        </div>
        <p className="mt-2 text-sm leading-7 text-foreground/86">{program.riskDisclosure}</p>
      </div>

      <div className="mt-auto flex flex-wrap gap-3 border-t border-line/70 pt-4">
        <ActionButton
          {...program.cta}
          label={primaryAction?.label ?? program.cta.label}
          onClick={primaryAction?.onClick}
          disabled={primaryAction?.disabled}
        />
        <ActionButton {...program.verifyAction} />
      </div>
    </SpotlightCard>
  );
}
