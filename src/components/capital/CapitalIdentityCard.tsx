import { ArrowRight, BadgeCheck, ExternalLink, FileBadge2 } from "lucide-react";
import { SpotlightCard } from "../SpotlightCard";
import { LocalizedLink as Link } from "../LocalizedLink";
import { cn } from "../../lib/utils";
import type { CapitalIdentityCardView } from "../../content/capital";
import type { Locale } from "../../lib/locale";
import { CapitalBrandMark } from "./CapitalBrandMark";

const toneClasses = {
  primary: "border-primary/20 bg-primary/10 text-primary",
  gold: "border-gold/25 bg-gold/10 text-gold",
  muted: "border-line/70 bg-background/48 text-foreground",
} as const;

export function CapitalIdentityCard({
  identity,
  locale,
  compact = false,
}: {
  identity: CapitalIdentityCardView;
  locale: Locale;
  compact?: boolean;
}) {
  const surfaceIsExternal = identity.surfaceExternal;

  return (
    <SpotlightCard
      className={cn(
        "page-card flex flex-col gap-5 border-line/70 bg-surface/72",
        compact ? "gap-4 p-5" : "page-card-lg"
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <CapitalBrandMark brand={identity.brand} size={compact ? "sm" : "md"} />
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-gold/80">
              72H Capital Identity
            </p>
            <h3 className="mt-2 text-2xl font-black tracking-normal text-foreground sm:text-3xl">
              {identity.title}
            </h3>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">{identity.subtitle}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className={cn("inline-flex min-h-8 items-center rounded-sm border px-3 text-[10px] font-bold uppercase tracking-[0.18em]", toneClasses[identity.tone])}>
            {identity.statusLabel}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
            {identity.lifecycleLabel}
          </span>
        </div>
      </div>

      <div className="grid gap-3 border-y border-line/70 py-4 sm:grid-cols-3">
        {identity.meta.slice(0, 3).map((item) => (
          <div key={item.label} className="rounded-sm border border-line/70 bg-background/42 px-4 py-3">
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{item.label}</div>
            <div className="mt-2 text-sm font-semibold text-foreground">{item.value}</div>
            {item.hint ? <div className="mt-1 text-xs text-muted-foreground">{item.hint}</div> : null}
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {identity.badges.map((badge) => (
          <span
            key={badge}
            className={cn(
              "inline-flex min-h-8 items-center rounded-sm border px-3 text-[10px] font-bold uppercase tracking-[0.18em]",
              toneClasses[identity.tone]
            )}
          >
            {badge}
          </span>
        ))}
      </div>

      <div className="rounded-sm border border-line/70 bg-background/42 px-4 py-3">
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          <BadgeCheck className="h-3.5 w-3.5 text-primary" />
          {locale === "en-US" ? "Disclosure boundary" : "披露边界"}
        </div>
        <p className="mt-2 text-sm leading-7 text-foreground/86">{identity.disclosure}</p>
      </div>

      <div className="flex flex-wrap gap-3 border-t border-line/70 pt-4">
        <Link to={identity.verificationHref} className="page-action">
          {locale === "en-US" ? "Open verification" : "打开验证页"}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
        {surfaceIsExternal ? (
          <a href={identity.surfaceHref} target="_blank" rel="noreferrer" className="page-action-muted">
            {identity.surfaceLabel}
            <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        ) : (
          <Link to={identity.surfaceHref} className="page-action-muted">
            {identity.surfaceLabel}
            <FileBadge2 className="ml-2 h-4 w-4" />
          </Link>
        )}
      </div>
    </SpotlightCard>
  );
}
