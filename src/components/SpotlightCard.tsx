import { useRef, useState } from "react";
import { cn } from "../lib/utils";

export function SpotlightCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);
  const disableSpotlight =
    typeof window !== "undefined" &&
    (window.matchMedia("(pointer: coarse)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disableSpotlight) return;
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={divRef}
      onMouseMove={disableSpotlight ? undefined : handleMouseMove}
      onMouseEnter={disableSpotlight ? undefined : () => setOpacity(1)}
      onMouseLeave={disableSpotlight ? undefined : () => setOpacity(0)}
      className={cn(
        "relative overflow-hidden rounded-md border border-line/70 bg-surface/70 transition-[border-color,background-color,box-shadow,transform] duration-300 md:hover:border-primary/35 md:hover:bg-surface-elevated md:hover:-translate-y-0.5 md:hover:shadow-[0_8px_24px_rgba(0,0,0,0.22)]",
        className
      )}
    >
      {disableSpotlight ? null : (
        <>
          <div
            className="pointer-events-none absolute -inset-px z-0 transition duration-300"
            style={{
              opacity,
              background: `radial-gradient(500px circle at ${position.x}px ${position.y}px, color-mix(in srgb, hsl(var(--primary)) 10%, transparent), transparent 42%)`,
            }}
          />
          <div
            className="pointer-events-none absolute inset-0 z-0 mix-blend-screen transition duration-300"
            style={{
              opacity,
              background: `radial-gradient(800px circle at ${position.x}px ${position.y}px, color-mix(in srgb, hsl(var(--gold)) 8%, transparent), transparent 42%)`,
            }}
          />
        </>
      )}
      <div className="relative z-10 w-full h-full flex flex-col">{children}</div>
    </div>
  );
}
