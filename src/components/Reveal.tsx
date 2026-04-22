import { ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  className?: string;
}

export function Reveal({ children, className = "" }: RevealProps) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}
