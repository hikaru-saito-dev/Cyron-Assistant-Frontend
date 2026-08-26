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
        <p className="font-sans text-xs text-zinc-400">
          {emptyNote}
        </p>
      )}
      {rules.map((rule, index) => (
        <div
          key={rule.id}
          className="cyron-glass !rounded-xl p-3"
        >
          {rule.suggested && (
            <div className="mb-2">
              <SuggestedBadge why={rule.why} />
            </div>
          )}
          <div className="flex items-start gap-2">
            <input
              className="min-w-0 flex-1 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 font-sans text-sm text-white transition-all placeholder:text-white/40 focus:border-amber-400/50 focus:outline-none focus:ring-2 focus:ring-amber-400/20"
              value={rule.text}
              placeholder={placeholder}
              onChange={(e) => updateAt(index, e.target.value)}
            />
            <button
              type="button"
              onClick={() => removeAt(index)}
              className="mt-1 inline-flex h-9 w-9 items-center justify-center rounded-lg text-red-400 transition hover:bg-red-500/10"
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
        className="inline-flex items-center gap-1.5 rounded-xl border border-dashed border-white/15 px-3.5 py-2 font-sans text-xs font-semibold text-zinc-300 transition hover:border-amber-400/40 hover:text-amber-400"
      >
        <FaPlus className="text-[10px]" />
        {addLabel}
      </button>
    </div>
  );
}
