import type { WizardAnswers } from "../types";
import { SuggestedBadge, OnlyYouKnowBadge } from "../SuggestedBadge";
import { WizardNav, WizardShell } from "../WizardShell";

type Props = {
  answers: WizardAnswers;
  onChange: (patch: Partial<WizardAnswers>) => void;
  onContinue: () => void;
  onBack: () => void;
  onEscapeManual: () => void;
};

export function StepServer({
  answers,
  onChange,
  onContinue,
  onBack,
  onEscapeManual,
}: Props) {
  const canContinue = answers.serverDescription.trim().length >= 8;
  const fullySuggested =
    answers.serverDescriptionSuggested &&
    !answers.serverDescriptionTouched &&
    canContinue;

  return (
    <WizardShell
      current="server"
      onEscapeManual={onEscapeManual}
      title="What does your server do?"
      subtitle="This is the context everything else rests on. Be specific — real product names enter the prompt."
      footer={
        <WizardNav
          onBack={onBack}
          onNext={onContinue}
          nextDisabled={!canContinue}
          nextLabel={fullySuggested ? "Looks good →" : "Continue"}
        />
      }
    >
      <div className="mb-2 flex flex-wrap items-center gap-2">
        {answers.serverDescriptionSuggested ? (
          <SuggestedBadge why={answers.serverDescriptionWhy} />
        ) : (
          <OnlyYouKnowBadge />
        )}
      </div>
      <textarea
        className="min-h-[140px] w-full resize-y rounded-2xl border border-slate-200 bg-white px-4 py-3 font-sans text-sm leading-relaxed text-slate-800 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/20 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
        value={answers.serverDescription}
        placeholder="E.g. We sell digital subscriptions and discounted shipping labels for e-commerce. Customers pay in tickets and receive the product from staff."
        onChange={(e) =>
          onChange({
            serverDescription: e.target.value,
            serverDescriptionTouched: true,
          })
        }
      />
      {!canContinue && (
        <p className="mt-2 font-sans text-xs text-amber-600 dark:text-amber-400">
          Required — write at least a short description.
        </p>
      )}
    </WizardShell>
  );
}
