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
    <div className="mt-6 cyron-glass p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="flex items-center gap-2 font-display text-sm font-bold text-white">
            <FaFlask className="text-amber-400" />
            Quick Test
          </p>
          <p className="mt-0.5 font-sans text-xs text-zinc-400">
            Ask a sample question and see Cyron&apos;s reply using your current
            General Rules.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="cyron-btn-ghost !px-3 !py-1.5 !text-xs"
        >
          {open ? "Hide" : "Open"}
        </button>
      </div>

      {open && (
        <div className="mt-4 space-y-3">
          <textarea
            className="min-h-[72px] w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 font-sans text-sm text-white transition-all placeholder:text-white/40 focus:border-amber-400/50 focus:outline-none focus:ring-2 focus:ring-amber-400/20"
            placeholder="e.g. I paid but received nothing"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <button
            type="button"
            disabled={loading || !question.trim()}
            onClick={() => void run()}
            className="cyron-btn-primary !px-4 !py-2 !text-sm"
          >
            {loading ? "Testing…" : "Test reply"}
          </button>
          {error && (
            <p className="font-sans text-sm text-rose-400">{error}</p>
          )}
          {reply && (
            <div className="rounded-xl border border-amber-400/20 bg-amber-400/[0.06] p-3">
              <p className="mb-1 font-sans text-[11px] font-bold uppercase tracking-wide text-amber-400">
                Cyron
              </p>
              <p className="whitespace-pre-wrap font-sans text-sm text-zinc-300">
                {reply}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
