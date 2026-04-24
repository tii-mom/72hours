import { cn } from "../../lib/utils";

export function CapitalSectionHeading({
  eyebrow,
  title,
  body,
  align = "left",
  className = "",
}: {
  eyebrow: string;
  title: string;
  body?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-3", align === "center" ? "items-center text-center" : "", className)}>
      <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-primary/70 sm:text-xs">
        {eyebrow}
      </p>
      <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
        {title}
      </h2>
      {body ? (
        <p className={cn("max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base", align === "center" ? "mx-auto" : "")}>
          {body}
        </p>
      ) : null}
    </div>
  );
}
