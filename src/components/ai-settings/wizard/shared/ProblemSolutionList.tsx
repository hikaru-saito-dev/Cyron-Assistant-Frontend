import { FaPlus, FaTrash } from "react-icons/fa";
import type { ProblemSolutionRow } from "../categoryTypes";
import { newRuleId } from "../types";
import { SuggestedBadge } from "../SuggestedBadge";

type Props = {
  rows: ProblemSolutionRow[];
  onChange: (rows: ProblemSolutionRow[]) => void;
  max?: number;
  minRequired?: number;
};

export function ProblemSolutionList({
  rows,
  onChange,
  max = 5,
  minRequired = 0,
}: Props) {
  function update(i: number, patch: Partial<ProblemSolutionRow>) {
    onChange(
      rows.map((r, idx) =>
        idx === i ? { ...r, ...patch, touched: true } : r,
      ),
    );
  }

  function add() {
    if (rows.length >= max) return;
    onChange([
      ...rows,
      {
        id: newRuleId(),
        problem: "",
        solution: "",
        suggested: false,
        touched: true,
      },
    ]);
  }

  const filled = rows.filter((r) => r.problem.trim() && r.solution.trim()).length;

  return (
    <div className="space-y-3">
      {minRequired > 0 && (
        <p className="font-sans text-xs text-zinc-400">
          At least {minRequired} problem → solution pair{minRequired === 1 ? "" : "s"} required
          ({filled}/{minRequired}).
        </p>
      )}
      {rows.map((row, i) => (
        <div
          key={row.id}
          className="cyron-glass !rounded-xl space-y-2 p-3"
        >
          {row.suggested && (
            <SuggestedBadge why={row.why || "from transcripts"} />
          )}
          <input
            className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 font-sans text-sm text-white transition-all placeholder:text-white/40 focus:border-amber-400/50 focus:outline-none focus:ring-2 focus:ring-amber-400/20"
            placeholder="Problem (short)"
            value={row.problem}
            onChange={(e) => update(i, { problem: e.target.value })}
          />
          <textarea
            className="min-h-[72px] w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 font-sans text-sm text-white transition-all placeholder:text-white/40 focus:border-amber-400/50 focus:outline-none focus:ring-2 focus:ring-amber-400/20"
            placeholder="How you solve it"
            value={row.solution}
            onChange={(e) => update(i, { solution: e.target.value })}
          />
          <button
            type="button"
            onClick={() => onChange(rows.filter((_, j) => j !== i))}
            className="inline-flex items-center gap-1 font-sans text-xs text-red-400"
          >
            <FaTrash className="text-[10px]" /> Remove
          </button>
        </div>
      ))}
      {rows.length < max && (
        <button
          type="button"
          onClick={add}
          className="inline-flex items-center gap-1.5 rounded-xl border border-dashed border-white/15 px-3 py-2 font-sans text-xs font-semibold text-zinc-300 transition-colors hover:border-amber-400/40 hover:text-amber-400"
        >
          <FaPlus className="text-[10px]" /> Add problem → solution
        </button>
      )}
    </div>
  );
}
