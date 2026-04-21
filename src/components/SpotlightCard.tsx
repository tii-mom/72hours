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

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      className={cn(
        "relative overflow-hidden rounded-md border border-white/5 bg-secondary/20 transition-all duration-500 hover:border-primary/50 hover:bg-secondary/40 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.5)]",
        className
      )}
    >
      {/* Heavy centered spotlight tracking the cursor */}
      <div
        className="pointer-events-none absolute -inset-px transition duration-300 pointer-events-none z-0"
        style={{
          opacity,
          background: `radial-gradient(500px circle at ${position.x}px ${position.y}px, rgba(34,197,94,0.08), transparent 40%)`,
        }}
      />
      {/* Delicate border-only spotlight edge glow */}
      <div
        className="pointer-events-none absolute inset-0 transition duration-300 z-0 mix-blend-screen"
        style={{
          opacity,
          background: `radial-gradient(800px circle at ${position.x}px ${position.y}px, rgba(34,197,94,0.04), transparent 40%)`,
        }}
      />
      <div className="relative z-10 w-full h-full flex flex-col">{children}</div>
    </div>
  );
}
