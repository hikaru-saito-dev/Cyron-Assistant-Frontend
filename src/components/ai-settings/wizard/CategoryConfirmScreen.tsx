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
        <div className="mb-5 rounded-2xl border border-yellow-500/30 bg-yellow-500/10 px-4 py-3.5 backdrop-blur-xl">
          <p className="font-sans text-sm font-semibold text-yellow-300">
            I couldn&apos;t find enough — tell me
          </p>
          <p className="mt-1 font-sans text-xs text-yellow-400/80">
            Pick one of the four cards below. No random suggestions.
          </p>
        </div>
      ) : (
        <div className="mb-5 rounded-2xl border border-amber-400/25 bg-amber-400/[0.07] p-4 backdrop-blur-xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-[#F5A623] px-2 py-0.5 font-sans text-[10px] font-bold uppercase tracking-wide text-[#0a0a0a]">
              my guess
            </span>
            <span className="font-sans text-sm font-semibold text-amber-200">
              {CATEGORY_META[proposed].emoji} {CATEGORY_META[proposed].label}
            </span>
            <span className="rounded-full bg-amber-400/20 px-2 py-0.5 font-sans text-[10px] font-bold text-amber-200">
              {Math.round((scan?.confidence ?? 0) * 100)}% confidence
            </span>
          </div>
          {(scan?.rationale?.length ?? 0) > 0 && (
            <ul className="mt-3 space-y-1 font-sans text-xs text-amber-300/80">
              {scan!.rationale.slice(0, 6).map((r) => (
                <li key={r}>• {r}</li>
              ))}
            </ul>
          )}
          {!showPicker && (
            <button
              type="button"
              onClick={() => setShowPicker(true)}
              className="mt-3 font-sans text-xs font-medium text-amber-300 underline-offset-2 hover:underline"
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
                className={`cyron-glass cyron-glass-hover px-4 py-4 text-left ${
                  isActive
                    ? "!border-amber-400/40 !bg-amber-400/10 ring-2 ring-amber-400/20"
                    : ""
                }`}
              >
                <p className="font-display text-lg font-bold text-white">
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
