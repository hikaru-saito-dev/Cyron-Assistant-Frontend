import { Sparkles } from "lucide-react";

export function SuggestedBadge({ why }: { why?: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 font-sans text-[10px] font-semibold text-emerald-400">
      <Sparkles className="h-2.5 w-2.5" />
      suggested{why ? ` · ${why}` : ""}
    </span>
  );
}

export function OnlyYouKnowBadge() {
  return (
    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.06] px-2 py-0.5 font-sans text-[10px] font-semibold text-zinc-400">
      only you know this
    </span>
  );
}
