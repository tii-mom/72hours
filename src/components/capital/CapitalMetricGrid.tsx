import type { CapitalMetricItem } from "../../content/capital";
import { cn } from "../../lib/utils";

const columnsClassMap = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
  5: "sm:grid-cols-2 lg:grid-cols-5",
  6: "sm:grid-cols-2 lg:grid-cols-3",
} as const;

const toneClassMap = {
  primary: "text-primary",
  gold: "text-gold",
  muted: "text-muted-foreground",
} as const;

export function CapitalMetricGrid({
  items,
  columns = 4,
  compact = false,
  className = "",
}: {
  items: CapitalMetricItem[];
  columns?: keyof typeof columnsClassMap;
  compact?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("grid gap-px overflow-hidden rounded-md border border-line/70 bg-line/70", columnsClassMap[columns], className)}>
      {items.map((item) => (
        <div
          key={`${item.label}-${item.value}`}
          className={cn(
            "bg-background/72",
            compact ? "p-4" : "p-4 sm:p-5",
          )}
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            {item.label}
          </p>
          <div className={cn("mt-2 text-base font-semibold tracking-tight text-foreground sm:text-lg", item.tone ? toneClassMap[item.tone] : "")}>
            {item.value}
          </div>
          {item.hint ? (
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              {item.hint}
            </p>
          ) : null}
        </div>
      ))}
    </div>
  );
}
