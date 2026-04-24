import type { ReactNode } from "react";
import { SpotlightCard } from "./SpotlightCard";
import { cn } from "../lib/utils";

type InfoPageHeroProps = {
  kicker: ReactNode;
  title: ReactNode;
  lead: ReactNode;
  icon?: ReactNode;
  noteLabel: ReactNode;
  noteTitle: ReactNode;
  noteBody: ReactNode;
  chips?: ReactNode[];
  className?: string;
  titleClassName?: string;
};

export function InfoPageHero({
  kicker,
  title,
  lead,
  icon,
  noteLabel,
  noteTitle,
  noteBody,
  chips = [],
  className = "",
  titleClassName = "",
}: InfoPageHeroProps) {
  return (
    <section className={cn("page-hero border-b border-line/70 overflow-hidden", className)}>
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,0.08)_0,transparent_42%),linear-gradient(to_bottom,rgba(255,255,255,0.03),transparent_42%)]" />
      <div className="page-container page-container-narrow relative z-10 flex flex-col gap-6 sm:gap-8">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(18rem,0.82fr)] lg:items-end">
          <div className="flex flex-col gap-4">
            {icon ? (
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary/10 text-primary flex items-center justify-center rounded-sm shadow-[0_0_20px_rgba(34,197,94,0.15)]">
                {icon}
              </div>
            ) : null}
            <div className="page-kicker w-fit">{kicker}</div>
            <h1 className={cn("page-title page-title-compact max-w-[14ch]", titleClassName)}>{title}</h1>
            <p className="page-lead max-w-2xl">{lead}</p>
          </div>

          <SpotlightCard className="page-card page-card-lg border-line/70 bg-surface/72 flex flex-col gap-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-primary/60">
              {noteLabel}
            </p>
            <div className="flex flex-col gap-3">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                {noteTitle}
              </h2>
              <p className="text-sm sm:text-base leading-relaxed text-muted-foreground">
                {noteBody}
              </p>
            </div>
            {chips.length ? <div className="page-chip-row pt-1">{chips}</div> : null}
          </SpotlightCard>
        </div>
      </div>
    </section>
  );
}
