import { WIZARD_STEPS, type WizardStepId } from "./types";

type Props = {
  current: WizardStepId;
  onEscapeManual: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
  title?: string;
  subtitle?: string;
};

export function WizardShell({
  current,
  onEscapeManual,
  children,
  footer,
  title,
  subtitle,
}: Props) {
  const index = WIZARD_STEPS.findIndex((s) => s.id === current);
  const progress = ((index + 1) / WIZARD_STEPS.length) * 100;

  return (
    <div className="space-y-5">
      <div>
        <div className="mb-2 flex items-center justify-between gap-3">
          <p className="font-display text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
            Step {index + 1} of {WIZARD_STEPS.length}
            {WIZARD_STEPS[index] ? ` · ${WIZARD_STEPS[index].label}` : ""}
          </p>
          <button
            type="button"
            onClick={onEscapeManual}
            className="font-sans text-xs font-medium text-slate-500 transition hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
          >
            I&apos;ll fill it myself
          </button>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-2 hidden flex-wrap gap-1 sm:flex">
          {WIZARD_STEPS.map((s, i) => (
            <span
              key={s.id}
              className={`rounded-md px-1.5 py-0.5 font-sans text-[10px] font-medium ${
                i <= index
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-slate-400"
              }`}
            >
              {s.label}
            </span>
          ))}
        </div>
      </div>

      {(title || subtitle) && (
        <div>
          {title && (
            <h2 className="font-display text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="mt-1.5 font-sans text-sm text-slate-500 dark:text-slate-400">
              {subtitle}
            </p>
          )}
        </div>
      )}

      <div>{children}</div>

      {footer && (
        <div className="flex flex-col-reverse gap-3 pt-4 sm:flex-row sm:items-center sm:justify-between">
          {footer}
        </div>
      )}
    </div>
  );
}

export function WizardNav({
  onBack,
  onNext,
  nextLabel = "Continue",
  nextDisabled,
  skipLabel,
  onSkip,
}: {
  onBack?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  skipLabel?: string;
  onSkip?: () => void;
}) {
  return (
    <>
      <div className="flex items-center gap-3">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="rounded-xl border border-slate-200 px-4 py-2.5 font-sans text-sm font-medium text-slate-600 transition hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Back
          </button>
        )}
        {onSkip && (
          <button
            type="button"
            onClick={onSkip}
            className="font-sans text-sm font-medium text-slate-500 transition hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
          >
            {skipLabel ?? "Skip"}
          </button>
        )}
      </div>
      {onNext && (
        <button
          type="button"
          onClick={onNext}
          disabled={nextDisabled}
          className="inline-flex items-center justify-center rounded-xl bg-[#0433FF] px-5 py-2.5 font-sans text-sm font-semibold text-white shadow-sm transition hover:bg-[#0433FF]/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {nextLabel}
        </button>
      )}
    </>
  );
}
