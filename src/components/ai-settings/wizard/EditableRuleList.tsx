import { FaPlus, FaTrash } from "react-icons/fa";
import type { SuggestedRule } from "./types";
import { newRuleId } from "./types";
import { SuggestedBadge } from "./SuggestedBadge";

type Props = {
  rules: SuggestedRule[];
  onChange: (rules: SuggestedRule[]) => void;
  placeholder?: string;
  addLabel?: string;
  emptyNote?: string;
};

export function EditableRuleList({
  rules,
  onChange,
  placeholder = "Add a rule…",
  addLabel = "Add rule",
  emptyNote,
}: Props) {
  function updateAt(index: number, text: string) {
    const next = rules.map((r, i) =>
      i === index ? { ...r, text, touched: true } : r,
    );
    onChange(next);
  }

  function removeAt(index: number) {
    onChange(rules.filter((_, i) => i !== index));
  }

  function add() {
    onChange([
      ...rules,
      { id: newRuleId(), text: "", suggested: false, touched: true },
    ]);
  }

  return (
    <div className="space-y-3">
      {emptyNote && rules.length === 0 && (
        <p className="font-sans text-xs text-slate-500 dark:text-slate-400">
          {emptyNote}
        </p>
      )}
      {rules.map((rule, index) => (
        <div
          key={rule.id}
          className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900"
        >
          {rule.suggested && (
            <div className="mb-2">
              <SuggestedBadge why={rule.why} />
            </div>
          )}
          <div className="flex items-start gap-2">
            <input
              className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 font-sans text-sm text-slate-800 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/20 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
              value={rule.text}
              placeholder={placeholder}
              onChange={(e) => updateAt(index, e.target.value)}
            />
            <button
              type="button"
              onClick={() => removeAt(index)}
              className="mt-1 inline-flex h-9 w-9 items-center justify-center rounded-lg text-red-500 transition hover:bg-red-50 dark:hover:bg-red-500/10"
              aria-label="Delete rule"
            >
              <FaTrash className="text-xs" />
            </button>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="inline-flex items-center gap-1.5 rounded-xl border border-dashed border-slate-300 px-3.5 py-2 font-sans text-xs font-semibold text-slate-600 transition hover:border-indigo-300 hover:text-indigo-600 dark:border-slate-600 dark:text-slate-300 dark:hover:border-indigo-500/40 dark:hover:text-indigo-400"
      >
        <FaPlus className="text-[10px]" />
        {addLabel}
      </button>
    </div>
  );
}
