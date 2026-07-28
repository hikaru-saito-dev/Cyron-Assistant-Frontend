import type { WizardAnswers, WizardStepId } from "./types";
import { WizardNav, WizardShell } from "./WizardShell";

type Props = {
  answers: WizardAnswers;
  compiled: CompileOutput | null;
  compiling: boolean;
  unreviewed: string[];
  onCompile: () => Promise<void>;
  onContinueToLiveTest: () => void;
  onBack: () => void;
  onEditStep: (step: WizardStepId) => void;
  onEscapeManual: () => void;
};

export function SummaryScreen({
  answers,
  compiled,
  compiling,
  unreviewed,
  onCompile,
  onContinueToLiveTest,
  onBack,
  onEditStep,
  onEscapeManual,
}: Props) {
  return (
    <WizardShell
      current="summary"
      onEscapeManual={onEscapeManual}
      title="Review compiled General Rules"
      subtitle="Four sections generated from your answers. Edit any section, then continue to the live test."
      footer={
        <WizardNav
          onBack={onBack}
          onNext={() => {
            if (!compiled) {
              void onCompile();
            } else {
              onContinueToLiveTest();
            }
          }}
          nextLabel={
            compiling
              ? "Compiling…"
              : compiled
                ? "Continue to live test"
                : "Compile General Rules"
          }
          nextDisabled={compiling}
        />
      }
    >
      {unreviewed.length > 0 && (
        <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50/80 px-4 py-3 dark:border-amber-500/30 dark:bg-amber-500/10">
          <p className="font-sans text-sm font-semibold text-amber-900 dark:text-amber-300">
            ✨ Suggestions not reviewed
          </p>
          <ul className="mt-1 space-y-0.5 font-sans text-xs text-amber-800/80 dark:text-amber-400/80">
            {unreviewed.slice(0, 12).map((u) => (
              <li key={u}>• {u}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="mb-4 flex flex-wrap gap-2">
        {(
          [
            ["server", "Server"],
            ["tone_language", "Tone"],
            ["never_say", "Never say"],
            ["escalation", "Escalation"],
            ["category_specific", "Category Qs"],
            ["channels", "Channels"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => onEditStep(id)}
            className="rounded-xl border border-slate-200 px-3 py-1.5 font-sans text-xs font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Edit {label}
          </button>
        ))}
      </div>

      {!compiled && !compiling && (
        <p className="font-sans text-sm text-slate-500">
          Click <strong>Compile General Rules</strong> to generate the 4
          sections from your answers (category: {answers.category ?? "—"}).
        </p>
      )}

      {compiled && (
        <div className="space-y-4">
          <Section
            title="Instructions"
            body={compiled.instructions}
            onEdit={() => onEditStep("never_say")}
          />
          <Section
            title="General Info"
            body={compiled.general_info || "—"}
            onEdit={() => onEditStep("server")}
          />
          <Section
            title="Problems"
            body={
              compiled.problems.length === 0
                ? "None yet (you can add them later in General Rules)."
                : compiled.problems
                    .map((p) => `• ${p.problem} → ${p.solution}`)
                    .join("\n")
            }
            onEdit={() => onEditStep("category_specific")}
          />
          <Section
            title="Knowledge"
            body={
              compiled.knowledge.length === 0
                ? "None yet."
                : compiled.knowledge
                    .map((k) => `• ${k.title}: ${k.content}`)
                    .join("\n")
            }
            onEdit={() => onEditStep("channels")}
          />
        </div>
      )}
    </WizardShell>
  );
}

function Section({
  title,
  body,
  onEdit,
}: {
  title: string;
  body: string;
  onEdit: () => void;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="font-display text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
          {title}
        </p>
        <button
          type="button"
          onClick={onEdit}
          className="font-sans text-xs font-semibold text-indigo-600 hover:underline"
        >
          Edit
        </button>
      </div>
      <pre className="whitespace-pre-wrap font-mono text-[12px] leading-relaxed text-slate-700 dark:text-slate-200">
        {body}
      </pre>
    </div>
  );
}
