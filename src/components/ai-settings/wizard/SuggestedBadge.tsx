import { Sparkles } from "lucide-react";

export function SuggestedBadge({ why }: { why?: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-green-200 bg-green-50 px-2 py-0.5 font-sans text-[10px] font-semibold text-green-800 dark:border-green-500/30 dark:bg-green-500/10 dark:text-green-400">
      <Sparkles className="h-2.5 w-2.5" />
      suggested{why ? ` · ${why}` : ""}
    </span>
  );
}

export function OnlyYouKnowBadge() {
  return (
    <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 font-sans text-[10px] font-semibold text-slate-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-400">
      only you know this
    </span>
  );
}
