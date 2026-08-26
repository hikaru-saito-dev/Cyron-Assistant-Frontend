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
          <p className="font-display text-[11px] font-bold uppercase tracking-[0.14em] text-zinc-500">
            Step {index + 1} of {WIZARD_STEPS.length}
            {WIZARD_STEPS[index] ? ` · ${WIZARD_STEPS[index].label}` : ""}
          </p>
          <button
            type="button"
            onClick={onEscapeManual}
            className="font-sans text-xs font-medium text-zinc-400 transition hover:text-amber-400"
          >
            I&apos;ll fill it myself
          </button>
        </div>
        <div className="h-2 overflow-hidden rounded-full border border-white/10 bg-white/[0.06]">
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
                i <= index ? "text-emerald-400" : "text-zinc-500"
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
            <h2 className="font-display text-xl font-bold tracking-tight text-white">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="mt-1.5 font-sans text-sm text-zinc-400">
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
            className="cyron-btn-ghost !px-4 !py-2.5 !text-sm"
          >
            Back
          </button>
        )}
        {onSkip && (
          <button
            type="button"
            onClick={onSkip}
            className="font-sans text-sm font-medium text-zinc-400 transition hover:text-amber-400"
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
          className="cyron-btn-primary !px-5 !py-2.5 !text-sm"
        >
          {nextLabel}
        </button>
      )}
    </>
  );
}
