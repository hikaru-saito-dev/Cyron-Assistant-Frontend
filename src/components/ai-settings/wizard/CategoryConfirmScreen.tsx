import { useState } from "react";
import {
  CATEGORY_META,
  type WizardCategory,
} from "./types";
import { WizardNav, WizardShell } from "./WizardShell";

type Props = {
  guildName: string;
  scan: AiDiscoveryScanResult | null;
  selected: WizardCategory | null;
  onSelect: (category: WizardCategory) => void;
  onConfirm: () => void;
  onBack: () => void;
  onEscapeManual: () => void;
};

const ALL: WizardCategory[] = ["selling", "saas", "community", "other"];

export function CategoryConfirmScreen({
  guildName,
  scan,
  selected,
  onSelect,
  onConfirm,
  onBack,
  onEscapeManual,
}: Props) {
  const lowConfidence =
    !scan ||
    scan.confidence_tier === "low" ||
    (scan.confidence ?? 0) < 0.4;

  const proposed = (scan?.proposed_category || "other") as WizardCategory;
  const [showPicker, setShowPicker] = useState(lowConfidence);
  const active = selected ?? (lowConfidence ? null : proposed);
  const meta = active ? CATEGORY_META[active] : null;

  return (
    <WizardShell
      current="category"
      onEscapeManual={onEscapeManual}
      title={`What kind of server is ${guildName || "this server"}?`}
      subtitle="The category decides the next questions and suggested rules."
      footer={
        <WizardNav
          onBack={onBack}
          onNext={active ? onConfirm : undefined}
          nextLabel={
            meta
              ? `Yes, it's ${meta.short} — continue`
              : "Select a category to continue"
          }
          nextDisabled={!active}
        />
      }
    >
      {lowConfidence ? (
        <div className="mb-5 rounded-2xl border border-amber-200 bg-amber-50/80 px-4 py-3.5 dark:border-amber-500/30 dark:bg-amber-500/10">
          <p className="font-sans text-sm font-semibold text-amber-900 dark:text-amber-300">
            I couldn&apos;t find enough — tell me
          </p>
          <p className="mt-1 font-sans text-xs text-amber-800/80 dark:text-amber-400/80">
            Pick one of the four cards below. No random suggestions.
          </p>
        </div>
      ) : (
        <div className="mb-5 rounded-2xl border border-indigo-200 bg-indigo-50/70 p-4 dark:border-indigo-500/30 dark:bg-indigo-500/10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-[#0433FF] px-2 py-0.5 font-sans text-[10px] font-bold uppercase tracking-wide text-white">
              my guess
            </span>
            <span className="font-sans text-sm font-semibold text-indigo-900 dark:text-indigo-200">
              {CATEGORY_META[proposed].emoji} {CATEGORY_META[proposed].label}
            </span>
            <span className="rounded-full bg-indigo-200/80 px-2 py-0.5 font-sans text-[10px] font-bold text-indigo-800 dark:bg-indigo-500/30 dark:text-indigo-200">
              {Math.round((scan?.confidence ?? 0) * 100)}% confidence
            </span>
          </div>
          {(scan?.rationale?.length ?? 0) > 0 && (
            <ul className="mt-3 space-y-1 font-sans text-xs text-indigo-800/90 dark:text-indigo-300/80">
              {scan!.rationale.slice(0, 6).map((r) => (
                <li key={r}>• {r}</li>
              ))}
            </ul>
          )}
          {!showPicker && (
            <button
              type="button"
              onClick={() => setShowPicker(true)}
              className="mt-3 font-sans text-xs font-medium text-indigo-700 underline-offset-2 hover:underline dark:text-indigo-300"
            >
              No, it&apos;s another kind of server
            </button>
          )}
        </div>
      )}

      {(showPicker || lowConfidence) && (
        <div className="grid gap-3 sm:grid-cols-2">
          {ALL.map((c) => {
            const m = CATEGORY_META[c];
            const isActive = active === c;
            return (
              <button
                key={c}
                type="button"
                onClick={() => onSelect(c)}
                className={`rounded-2xl border px-4 py-4 text-left transition ${
                  isActive
                    ? "border-indigo-400 bg-indigo-50 ring-2 ring-indigo-300/50 dark:border-indigo-500 dark:bg-indigo-500/10"
                    : "border-slate-200 bg-white hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-slate-600"
                }`}
              >
                <p className="font-display text-lg font-bold text-slate-900 dark:text-white">
                  {m.emoji} {m.label}
                </p>
              </button>
            );
          })}
        </div>
      )}
    </WizardShell>
  );
}
