import { useState } from "react";
import type { WizardAnswers } from "../types";
import { CATEGORY_META } from "../types";
import { validateCategoryStep } from "../compileMapper";
import { WizardNav, WizardShell } from "../WizardShell";
import { SellingBranch } from "./SellingBranch";
import { SaasBranch } from "./SaasBranch";
import { CommunityBranch } from "./CommunityBranch";
import { OtherBranch } from "./OtherBranch";

type Props = {
  answers: WizardAnswers;
  guildRoles: RoleCandidate[];
  channels: { id: string; name: string }[];
  onChange: (patch: Partial<WizardAnswers>) => void;
  onContinue: () => void;
  onBack: () => void;
  onEscapeManual: () => void;
};

export function StepCategorySpecific({
  answers,
  guildRoles,
  channels,
  onChange,
  onContinue,
  onBack,
  onEscapeManual,
}: Props) {
  const [error, setError] = useState<string | null>(null);
  const cat = answers.category;
  const meta = cat ? CATEGORY_META[cat] : null;
  const roles = guildRoles.map((r) => ({ id: r.id, name: r.name }));

  function handleNext() {
    const err = validateCategoryStep(answers);
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    onContinue();
  }

  return (
    <WizardShell
      current="category_specific"
      onEscapeManual={onEscapeManual}
      title={`${meta?.emoji ?? ""} ${meta?.label ?? "Category"} questions`}
      subtitle="These answers become Cyron’s operational rules for this category."
      footer={
        <WizardNav onBack={onBack} onNext={handleNext} nextLabel="Continue" />
      }
    >
      {error && (
        <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 font-sans text-sm text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300">
          {error}
        </div>
      )}

      {cat === "selling" && (
        <SellingBranch
          data={answers.selling}
          roles={roles}
          channels={channels}
          onChange={(selling) => {
            setError(null);
            onChange({ selling });
          }}
        />
      )}
      {cat === "saas" && (
        <SaasBranch
          data={answers.saas}
          roles={roles}
          channels={channels}
          onChange={(saas) => {
            setError(null);
            onChange({ saas });
          }}
        />
      )}
      {cat === "community" && (
        <CommunityBranch
          data={answers.community}
          roles={roles}
          channels={channels}
          onChange={(community) => {
            setError(null);
            onChange({ community });
          }}
        />
      )}
      {cat === "other" && (
        <OtherBranch
          data={answers.other}
          roles={roles}
          onChange={(other) => {
            setError(null);
            onChange({ other });
          }}
        />
      )}
      {!cat && (
        <p className="font-sans text-sm text-slate-500">
          No category selected — go back and confirm one.
        </p>
      )}
    </WizardShell>
  );
}
