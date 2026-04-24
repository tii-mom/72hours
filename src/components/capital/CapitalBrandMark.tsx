import { cn } from "../../lib/utils";
import type { CapitalAppPageView, CapitalIdentityCardView, CapitalOverviewView } from "../../content/capital";

type CapitalBrand = CapitalAppPageView["brand"] | CapitalIdentityCardView["brand"] | CapitalOverviewView["apps"][number]["brand"];

const sizeClasses = {
  sm: "h-11 w-11 text-sm",
  md: "h-14 w-14 text-base",
  lg: "h-18 w-18 text-lg sm:h-20 sm:w-20",
} as const;

export function CapitalBrandMark({
  brand,
  size = "md",
  className = "",
}: {
  brand: CapitalBrand;
  size?: keyof typeof sizeClasses;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden rounded-sm border border-line/70 bg-background/30 text-foreground shadow-[0_0_24px_rgba(0,0,0,0.08)]",
        sizeClasses[size],
        className,
      )}
      aria-label={brand.label}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(183,164,92,0.16),transparent_42%),linear-gradient(to_bottom_right,rgba(34,197,94,0.08),transparent_62%)]" />
      {brand.kind === "image" ? (
        <img
          src={brand.src}
          alt={brand.alt}
          loading="lazy"
          decoding="async"
          className="relative h-full w-full object-contain p-2"
        />
      ) : (
        <span className="relative font-mono text-[0.88em] font-bold uppercase tracking-[0.22em]">
          {brand.monogram}
        </span>
      )}
    </div>
  );
}
