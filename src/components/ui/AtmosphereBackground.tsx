import { cn } from "../../lib/utils";

/**
 * Exact atmospheric backdrop from the redesign reference:
 * near-black field + subtle graph-paper grid + soft amber corner glows.
 */
export function AtmosphereBackground({
  className,
  fixed = false,
}: {
  className?: string;
  /** Use fixed for full-app shells so scroll doesn't tear the grid */
  fixed?: boolean;
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none inset-0 overflow-hidden",
        fixed ? "fixed z-0" : "absolute z-0",
        className,
      )}
    >
      {/* Base charcoal */}
      <div className="absolute inset-0 bg-[#070707]" />

      {/* Soft center lift (matches reference depth) */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 35%, rgba(28,28,28,0.9) 0%, rgba(7,7,7,0) 70%)",
        }}
      />

      {/* Graph-paper grid */}
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.045) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.045) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
          maskImage:
            "radial-gradient(ellipse 90% 80% at 50% 40%, black 20%, transparent 85%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 90% 80% at 50% 40%, black 20%, transparent 85%)",
        }}
      />

      {/* Amber glow — top right (primary light leak from reference) */}
      <div
        className="absolute -top-32 -right-24 h-[520px] w-[520px] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(245,166,35,0.22) 0%, rgba(245,166,35,0.06) 40%, transparent 70%)",
        }}
      />

      {/* Amber glow — bottom left */}
      <div
        className="absolute -bottom-40 -left-28 h-[480px] w-[480px] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(232,160,23,0.16) 0%, rgba(245,166,35,0.05) 45%, transparent 70%)",
        }}
      />

      {/* Soft amber bloom near CTA zone (lower-mid) */}
      <div
        className="absolute bottom-[12%] left-[18%] h-40 w-40 rounded-full blur-2xl opacity-60"
        style={{
          background:
            "radial-gradient(circle, rgba(245,166,35,0.18) 0%, transparent 70%)",
        }}
      />

      {/* Vignette for focus */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.45) 100%)",
        }}
      />
    </div>
  );
}
