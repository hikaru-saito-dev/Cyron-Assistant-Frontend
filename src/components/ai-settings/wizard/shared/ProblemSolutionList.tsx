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
        <p className="font-sans text-xs text-slate-500">
          At least {minRequired} problem → solution pair{minRequired === 1 ? "" : "s"} required
          ({filled}/{minRequired}).
        </p>
      )}
      {rows.map((row, i) => (
        <div
          key={row.id}
          className="space-y-2 rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900"
        >
          {row.suggested && (
            <SuggestedBadge why={row.why || "from transcripts"} />
          )}
          <input
            className="w-full rounded-lg border border-slate-200 px-3 py-2 font-sans text-sm dark:border-slate-600 dark:bg-slate-800"
            placeholder="Problem (short)"
            value={row.problem}
            onChange={(e) => update(i, { problem: e.target.value })}
          />
          <textarea
            className="min-h-[72px] w-full rounded-lg border border-slate-200 px-3 py-2 font-sans text-sm dark:border-slate-600 dark:bg-slate-800"
            placeholder="How you solve it"
            value={row.solution}
            onChange={(e) => update(i, { solution: e.target.value })}
          />
          <button
            type="button"
            onClick={() => onChange(rows.filter((_, j) => j !== i))}
            className="inline-flex items-center gap-1 font-sans text-xs text-red-500"
          >
            <FaTrash className="text-[10px]" /> Remove
          </button>
        </div>
      ))}
      {rows.length < max && (
        <button
          type="button"
          onClick={add}
          className="inline-flex items-center gap-1.5 rounded-xl border border-dashed border-slate-300 px-3 py-2 font-sans text-xs font-semibold text-slate-600 dark:border-slate-600 dark:text-slate-300"
        >
          <FaPlus className="text-[10px]" /> Add problem → solution
        </button>
      )}
    </div>
  );
}
