import { useEffect, useState } from "react";
import { guildService } from "../../../services/guildService";
import { LIVE_TEST_PROMPTS } from "./categoryTypes";
import type { WizardAnswers } from "./types";
import { WizardNav, WizardShell } from "./WizardShell";

type Props = {
  guildId: string;
  answers: WizardAnswers;
  compiled: CompileOutput;
  activating: boolean;
  onActivate: () => Promise<void>;
  onBack: () => void;
  onEscapeManual: () => void;
};

type Turn = {
  prompt: string;
  reply: string | null;
  loading: boolean;
  error?: string;
};

export function LiveTestScreen({
  guildId,
  answers,
  compiled,
  activating,
  onActivate,
  onBack,
  onEscapeManual,
}: Props) {
  const cat = answers.category || "other";
  const prompts = LIVE_TEST_PROMPTS[cat] || LIVE_TEST_PROMPTS.other;
  const [turns, setTurns] = useState<Turn[]>(
    prompts.map((p) => ({ prompt: p, reply: null, loading: false })),
  );
  const [ran, setRan] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function runAll() {
      setTurns(prompts.map((p) => ({ prompt: p, reply: null, loading: true })));
      const results: Turn[] = [];
      for (const prompt of prompts) {
        try {
          const out = await guildService.quickTestGeneralRules(guildId, {
            message: prompt,
            instructions: compiled.instructions,
            general_info: compiled.general_info,
            problems: compiled.problems,
            knowledge: compiled.knowledge,
            use_saved: false,
          });
          if (cancelled) return;
          results.push({
            prompt,
            reply: out.error ? null : out.reply,
            loading: false,
            error: out.error || undefined,
          });
        } catch (e) {
          results.push({
            prompt,
            reply: null,
            loading: false,
            error: e instanceof Error ? e.message : "Request failed",
          });
        }
        if (!cancelled) {
          setTurns([...results, ...prompts.slice(results.length).map((p) => ({
            prompt: p,
            reply: null,
            loading: true,
          }))]);
        }
      }
      if (!cancelled) {
        setTurns(results);
        setRan(true);
      }
    }
    void runAll();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [guildId, compiled.instructions, cat]);

  return (
    <WizardShell
      current="live_test"
      onEscapeManual={onEscapeManual}
      title="Live test"
      subtitle="Three simulated conversations using your compiled General Rules. Does this look right?"
      footer={
        <WizardNav
          onBack={onBack}
          onNext={() => {
            void onActivate();
          }}
          nextLabel={activating ? "Activating…" : "Activate AI"}
          nextDisabled={activating || !ran}
          skipLabel="Go back and edit"
          onSkip={onBack}
        />
      }
    >
      <div className="space-y-4">
        {turns.map((t) => (
          <div
            key={t.prompt}
            className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900"
          >
            <p className="font-sans text-xs font-semibold uppercase tracking-wide text-slate-400">
              User
            </p>
            <p className="mt-1 font-sans text-sm text-slate-800 dark:text-slate-100">
              {t.prompt}
            </p>
            <p className="mt-3 font-sans text-xs font-semibold uppercase tracking-wide text-indigo-500">
              Cyron
            </p>
            {t.loading && (
              <p className="mt-1 animate-pulse font-sans text-sm text-slate-400">
                Thinking…
              </p>
            )}
            {t.error && (
              <p className="mt-1 font-sans text-sm text-rose-600">{t.error}</p>
            )}
            {t.reply && (
              <p className="mt-1 whitespace-pre-wrap font-sans text-sm text-slate-700 dark:text-slate-200">
                {t.reply}
              </p>
            )}
          </div>
        ))}
      </div>
    </WizardShell>
  );
}
