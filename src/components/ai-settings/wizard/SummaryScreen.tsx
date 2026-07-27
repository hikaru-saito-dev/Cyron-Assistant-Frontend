import type { WizardAnswers } from "./types";
import { WizardNav, WizardShell } from "./WizardShell";

type Props = {
  answers: WizardAnswers;
  compiled: CompileOutput | null;
  compiling: boolean;
  unreviewed: string[];
  onCompile: (activate: boolean) => Promise<void>;
  onBack: () => void;
  onEditStep: (step: "server" | "tone_language" | "never_say" | "escalation") => void;
  onEscapeManual: () => void;
};

export function SummaryScreen({
  answers,
  compiled,
  compiling,
  unreviewed,
  onCompile,
  onBack,
  onEditStep,
  onEscapeManual,
}: Props) {
  return (
    <WizardShell
      current="summary"
      onEscapeManual={onEscapeManual}
      title="Review & activate"
      subtitle="Compiled General Rules from your answers. Edit any section, then activate AI."
      footer={
        <WizardNav
          onBack={onBack}
          onNext={() => {
            void onCompile(!compiled ? false : true);
          }}
          nextLabel={
            compiling
              ? "Compiling…"
              : compiled
                ? "Activate AI"
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
            {unreviewed.slice(0, 8).map((u) => (
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
          <Section title="Instructions" body={compiled.instructions} />
          <Section title="General Info" body={compiled.general_info || "—"} />
          <Section
            title="Problems"
            body={
              compiled.problems.length === 0
                ? "None yet (you can add them later in General Rules)."
                : compiled.problems
                    .map((p) => `• ${p.problem} → ${p.solution}`)
                    .join("\n")
            }
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
          />
        </div>
      )}
    </WizardShell>
  );
}

function Section({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
      <p className="mb-2 font-display text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
        {title}
      </p>
      <pre className="whitespace-pre-wrap font-mono text-[12px] leading-relaxed text-slate-700 dark:text-slate-200">
        {body}
      </pre>
    </div>
  );
}
