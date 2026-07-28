import { useState } from "react";
import { FaFlask } from "react-icons/fa";
import { guildService } from "../../services/guildService";

type Props = {
  guildId: string;
  enabled: boolean;
};

export function QuickTestPanel({ guildId, enabled }: Props) {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [reply, setReply] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!enabled) return null;

  async function run() {
    if (!question.trim()) return;
    setLoading(true);
    setError(null);
    setReply(null);
    try {
      const out = await guildService.quickTestGeneralRules(guildId, {
        message: question.trim(),
        use_saved: true,
      });
      if (out.error) setError(out.error);
      else setReply(out.reply);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Request failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-700 dark:bg-slate-800/40">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="flex items-center gap-2 font-display text-sm font-bold text-slate-900 dark:text-white">
            <FaFlask className="text-indigo-500" />
            Quick Test
          </p>
          <p className="mt-0.5 font-sans text-xs text-slate-500">
            Ask a sample question and see Cyron&apos;s reply using your current
            General Rules.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 font-sans text-xs font-semibold text-slate-700 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200"
        >
          {open ? "Hide" : "Open"}
        </button>
      </div>

      {open && (
        <div className="mt-4 space-y-3">
          <textarea
            className="min-h-[72px] w-full rounded-xl border border-slate-200 px-3 py-2 font-sans text-sm dark:border-slate-600 dark:bg-slate-900"
            placeholder="e.g. I paid but received nothing"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <button
            type="button"
            disabled={loading || !question.trim()}
            onClick={() => void run()}
            className="rounded-xl bg-indigo-600 px-4 py-2 font-sans text-sm font-semibold text-white disabled:opacity-50"
          >
            {loading ? "Testing…" : "Test reply"}
          </button>
          {error && (
            <p className="font-sans text-sm text-rose-600">{error}</p>
          )}
          {reply && (
            <div className="rounded-xl border border-indigo-100 bg-white p-3 dark:border-indigo-500/20 dark:bg-slate-900">
              <p className="mb-1 font-sans text-[11px] font-bold uppercase tracking-wide text-indigo-500">
                Cyron
              </p>
              <p className="whitespace-pre-wrap font-sans text-sm text-slate-700 dark:text-slate-200">
                {reply}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
