import { cn } from "../../lib/utils";
import type { HTMLAttributes, ReactNode } from "react";

type GlassCardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  hover?: boolean;
  padding?: boolean;
};

/** Premium translucent surface used across dashboard + guild config. */
export function GlassCard({
  children,
  className,
  hover = true,
  padding = true,
  ...props
}: GlassCardProps) {
  return (
    <div
      className={cn(
        "cyron-glass rounded-2xl",
        padding && "p-5 md:p-6",
        hover && "cyron-glass-hover",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
