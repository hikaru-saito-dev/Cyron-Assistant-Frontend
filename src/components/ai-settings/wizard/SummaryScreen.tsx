import type { WizardAnswers, WizardStepId } from "./types";
import { WizardNav, WizardShell } from "./WizardShell";
import { Sparkles } from "lucide-react";

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
        <div className="mb-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 backdrop-blur-xl">
          <p className="flex items-center gap-1.5 font-sans text-sm font-semibold text-emerald-300">
            <Sparkles className="h-4 w-4" />
            Suggestions not reviewed
          </p>
          <ul className="mt-1 space-y-0.5 font-sans text-xs text-white">
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
            className="cyron-btn-ghost !px-3 !py-1.5 !text-xs"
          >
            Edit {label}
          </button>
        ))}
      </div>

      {!compiled && !compiling && (
        <p className="font-sans text-sm text-zinc-400">
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
    <div className="cyron-glass p-4">
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="font-display text-[11px] font-bold uppercase tracking-[0.12em] text-zinc-500">
          {title}
        </p>
        <button
          type="button"
          onClick={onEdit}
          className="font-sans text-xs font-semibold text-amber-400 hover:underline"
        >
          Edit
        </button>
      </div>
      <pre className="whitespace-pre-wrap font-mono text-[12px] leading-relaxed text-zinc-300">
        {body}
      </pre>
    </div>
  );
}
