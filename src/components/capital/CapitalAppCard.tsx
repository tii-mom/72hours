import { ArrowRight } from "lucide-react";
import type { CapitalAppCardView } from "../../content/capital";
import { useLocale } from "../../lib/locale";
import { cn } from "../../lib/utils";
import { LocalizedLink as Link } from "../LocalizedLink";
import { SpotlightCard } from "../SpotlightCard";
import { CapitalBrandMark } from "./CapitalBrandMark";
import { CapitalMetricGrid } from "./CapitalMetricGrid";

export function CapitalAppCard({
  app,
  className = "",
}: {
  app: CapitalAppCardView;
  className?: string;
}) {
  const { locale } = useLocale();
  const isEnglish = locale === "en-US";

  return (
    <SpotlightCard
      className={cn(
        "page-card flex h-full flex-col gap-5 border-line/70 bg-surface/78 backdrop-blur",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <CapitalBrandMark brand={app.brand} />
          <div className="min-w-0">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-primary/70">
              72H Capital
            </p>
            <h3 className="mt-2 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              {app.name}
            </h3>
          </div>
        </div>

        <span className="inline-flex min-h-8 items-center rounded-sm border border-primary/20 bg-primary/10 px-2.5 text-[10px] font-bold uppercase tracking-widest text-primary">
          {app.statusLabel}
        </span>
      </div>

      <p className="text-sm leading-7 text-muted-foreground sm:text-base">
        {app.summary}
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-sm border border-line/70 bg-background/50 px-4 py-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            {isEnglish ? "Reserve" : "Reserve"}
          </p>
          <p className="mt-2 text-sm font-semibold text-foreground">{app.reserveLabel}</p>
        </div>
        <div className="rounded-sm border border-line/70 bg-background/50 px-4 py-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            {isEnglish ? "Alpha" : "Alpha"}
          </p>
          <p className="mt-2 text-sm font-semibold text-foreground">{app.alphaLabel}</p>
        </div>
      </div>

      <CapitalMetricGrid items={app.metrics} columns={2} compact />

      <div className="rounded-sm border border-line/70 bg-background/35 px-4 py-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          {isEnglish ? "Risk band" : "风险区间"}
        </p>
        <p className="mt-2 text-sm font-semibold text-foreground">
          {app.riskBand}
        </p>
      </div>

      <div className="mt-auto flex flex-col gap-3 sm:flex-row">
        <Link to={app.detailHref} className="page-action flex-1">
          {isEnglish ? "Open capital" : "进入应用页"}
          <ArrowRight size={16} className="ml-2" />
        </Link>
        <Link to={app.verifyHref} className="page-action-muted flex-1">
          {isEnglish ? "Verify seat" : "验证席位"}
          <ArrowRight size={16} className="ml-2" />
        </Link>
      </div>
    </SpotlightCard>
  );
}
