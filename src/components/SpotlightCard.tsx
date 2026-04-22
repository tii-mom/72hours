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
        "relative overflow-hidden rounded-md border border-white/6 bg-secondary/14 transition-[border-color,background-color,box-shadow,transform] duration-300 md:hover:border-primary/35 md:hover:bg-secondary/24 md:hover:-translate-y-0.5 md:hover:shadow-[0_8px_24px_rgba(0,0,0,0.35)]",
        className
      )}
    >
      {/* Heavy centered spotlight tracking the cursor */}
      <div
        className="pointer-events-none absolute -inset-px transition duration-300 pointer-events-none z-0"
        style={{
          opacity,
          background: `radial-gradient(500px circle at ${position.x}px ${position.y}px, rgba(34,197,94,0.05), transparent 42%)`,
        }}
      />
      {/* Delicate border-only spotlight edge glow */}
      <div
        className="pointer-events-none absolute inset-0 transition duration-300 z-0 mix-blend-screen"
        style={{
          opacity,
          background: `radial-gradient(800px circle at ${position.x}px ${position.y}px, rgba(34,197,94,0.025), transparent 42%)`,
        }}
      />
      <div className="relative z-10 w-full h-full flex flex-col">{children}</div>
    </div>
  );
}
