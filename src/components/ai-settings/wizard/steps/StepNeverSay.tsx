import type { WizardAnswers } from "../types";
import { EditableRuleList } from "../EditableRuleList";
import { WizardNav, WizardShell } from "../WizardShell";

type Props = {
  answers: WizardAnswers;
  onChange: (patch: Partial<WizardAnswers>) => void;
  onContinue: () => void;
  onBack: () => void;
  onEscapeManual: () => void;
};

export function StepNeverSay({
  answers,
  onChange,
  onContinue,
  onBack,
  onEscapeManual,
}: Props) {
  const allSuggestedUntouched =
    answers.neverRules.length > 0 &&
    answers.neverRules.every((r) => r.suggested && !r.touched && r.text.trim());

  const lowNote =
    answers.category === "other"
      ? "I didn't find enough to propose more — these are universal safety rules."
      : undefined;

  return (
    <WizardShell
      current="never_say"
      onEscapeManual={onEscapeManual}
      title="Things to never say"
      subtitle="Pre-proposed from your category and scan signals. Edit or delete freely — never invent rules without evidence."
      footer={
        <WizardNav
          onBack={onBack}
          onNext={onContinue}
          nextLabel={allSuggestedUntouched ? "Looks good →" : "Continue"}
        />
      }
    >
      <EditableRuleList
        rules={answers.neverRules}
        onChange={(neverRules) => onChange({ neverRules })}
        placeholder="Never…"
        emptyNote={lowNote}
      />
    </WizardShell>
  );
}
