import {
  FALLBACK_LANGUAGES,
  type TonePreset,
  type WizardAnswers,
} from "../types";
import { WizardNav, WizardShell } from "../WizardShell";
import { LanguageSelectorDropdown } from "../../../ui/language-selector-dropdown";

type Props = {
  answers: WizardAnswers;
  onChange: (patch: Partial<WizardAnswers>) => void;
  onContinue: () => void;
  onBack: () => void;
  onEscapeManual: () => void;
};

const TONES: TonePreset[] = ["Professional", "Friendly", "Casual", "Formal"];

const PREVIEWS: Record<TonePreset, string> = {
  Professional:
    "Thanks for reaching out. I can help with that — could you share your order ID?",
  Friendly:
    "Hey! Happy to help 😊 Can you send me your order ID so I can take a look?",
  Casual: "Yo! Sure thing — drop your order ID and I'll check it out.",
  Formal:
    "Good day. I shall assist you. Kindly provide your order identification number.",
};

export function StepToneLanguage({
  answers,
  onChange,
  onContinue,
  onBack,
  onEscapeManual,
}: Props) {
  function setTone(tone: TonePreset) {
    const emojisDefault = tone === "Friendly" || tone === "Casual";
    onChange({
      tone,
      emojisAllowed:
        answers.tone === tone ? answers.emojisAllowed : emojisDefault,
    });
  }

  return (
    <WizardShell
      current="tone_language"
      onEscapeManual={onEscapeManual}
      title="Tone & language"
      subtitle="How Cyron should speak — and in which language."
      footer={
        <WizardNav onBack={onBack} onNext={onContinue} nextLabel="Continue" />
      }
    >
      <div className="space-y-6">
        <section>
          <p className="mb-2 font-sans text-xs font-semibold uppercase tracking-wide text-slate-500">
            Tone
          </p>
          <div className="flex flex-wrap gap-2">
            {TONES.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTone(t)}
                className={`rounded-xl px-3.5 py-2 font-sans text-sm font-semibold transition ${
                  answers.tone === t
                    ? "bg-[#0433FF] text-white"
                    : "border border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 dark:border-slate-700 dark:bg-slate-800/50">
            <p className="font-display text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Live preview
            </p>
            <p className="mt-1 font-sans text-sm text-slate-700 dark:text-slate-200">
              {PREVIEWS[answers.tone]}
            </p>
          </div>
          <label className="mt-3 flex items-center gap-2.5 font-sans text-sm text-slate-700 dark:text-slate-200">
            <input
              type="checkbox"
              checked={answers.emojisAllowed}
              onChange={(e) => onChange({ emojisAllowed: e.target.checked })}
              className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            Can it use emojis?
          </label>
        </section>

        <section>
          <p className="mb-2 font-sans text-xs font-semibold uppercase tracking-wide text-slate-500">
            Language
          </p>
          <div className="space-y-2">
            <label className="flex items-start gap-2.5 rounded-xl border border-slate-200 px-3 py-3 dark:border-slate-700">
              <input
                type="radio"
                name="langMode"
                checked={answers.languageMode === "auto"}
                onChange={() => onChange({ languageMode: "auto" })}
                className="mt-1"
              />
              <span className="font-sans text-sm text-slate-700 dark:text-slate-200">
                Detect the customer&apos;s language and reply in it{" "}
                <span className="text-slate-400">(default)</span>
              </span>
            </label>
            <label className="flex items-start gap-2.5 rounded-xl border border-slate-200 px-3 py-3 dark:border-slate-700">
              <input
                type="radio"
                name="langMode"
                checked={answers.languageMode === "fixed"}
                onChange={() => onChange({ languageMode: "fixed" })}
                className="mt-1"
              />
              <span className="font-sans text-sm text-slate-700 dark:text-slate-200">
                Always reply in a fixed language
              </span>
            </label>
          </div>

          {answers.languageMode === "fixed" ? (
            <div className="mt-3">
              <label className="font-sans text-xs text-slate-500 mb-1 block">Language</label>
              <LanguageSelectorDropdown
                value={answers.fixedLanguage}
                onChange={(val: string) => onChange({ fixedLanguage: val })}
              />
            </div>
          ) : (
            <div className="mt-3">
              <label className="font-sans text-xs text-slate-500 mb-1 block">
                Fallback language (if unclear)
              </label>
              <LanguageSelectorDropdown
                value={answers.fallbackLanguage}
                onChange={(val: string) => onChange({ fallbackLanguage: val })}
              />
            </div>
          )}
        </section>
      </div>
    </WizardShell>
  );
}
