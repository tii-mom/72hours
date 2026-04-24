import { ArrowRight, Radio } from "lucide-react";
import { LocalizedLink as Link } from "../LocalizedLink";
import { SpotlightCard } from "../SpotlightCard";
import type { Locale } from "../../lib/locale";
import { useCapitalWalletView } from "../../lib/capital-wallet";
import { CapitalMetricGrid } from "./CapitalMetricGrid";
import { CapitalSectionHeading } from "./CapitalSectionHeading";

const stateToneClasses = {
  preview: "border-line/70 bg-background/48 text-foreground",
  restoring: "border-primary/20 bg-primary/10 text-primary",
  standby: "border-primary/20 bg-primary/10 text-primary",
  connected: "border-gold/20 bg-gold/10 text-gold",
} as const;

export function CapitalWalletPanel({ locale }: { locale: Locale }) {
  const view = useCapitalWalletView(locale);

  return (
    <SpotlightCard className="page-card page-card-lg flex h-full flex-col gap-5 border-line/70 bg-surface/78">
      <div className="flex items-start justify-between gap-4">
        <CapitalSectionHeading
          eyebrow={view.eyebrow}
          title={view.title}
          body={view.body}
          className="gap-2"
        />
        <span
          className={`inline-flex min-h-8 items-center gap-2 rounded-sm border px-3 text-[10px] font-bold uppercase tracking-[0.18em] ${stateToneClasses[view.status]}`}
        >
          <Radio className="h-3.5 w-3.5" />
          {view.stateLabel}
        </span>
      </div>

      <CapitalMetricGrid items={view.metrics} columns={3} compact />

      <div className="rounded-sm border border-line/70 bg-background/42 px-4 py-3 text-sm leading-7 text-muted-foreground">
        {view.note}
      </div>

      {view.actionError ? (
        <div className="rounded-sm border border-gold/20 bg-gold/8 px-4 py-3 text-sm leading-7 text-foreground/86">
          {view.actionError}
        </div>
      ) : null}

      <div className="mt-auto flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        {view.actions.map((action) => (
          action.kind === "link" && action.href ? (
            <Link
              key={`${action.label}-${action.href}`}
              to={action.href}
              className={action.variant === "primary" ? "page-action flex-1" : "page-action-muted flex-1"}
            >
              {action.label}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          ) : (
            <button
              key={action.label}
              type="button"
              onClick={action.onClick}
              disabled={action.disabled}
              className={`${action.variant === "primary" ? "page-action flex-1" : "page-action-muted flex-1"} disabled:pointer-events-none disabled:opacity-60`}
            >
              {action.label}
            </button>
          )
        ))}
      </div>
    </SpotlightCard>
  );
}
