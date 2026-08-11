import { motion } from 'framer-motion';

import { Button } from '../../components/ui/Button';

const TONES: Tone[] = ['Professional', 'Friendly', 'Casual', 'Formal'];

export const AiSettingsTab = ({
  systemPrompt,
  setSystemPrompt,
  previewOpen,
  setPreviewOpen,
  handleSavePrompt,
  updateGuildPending,
  guildLoading,
  localTone,
  setLocalTone,
  testReply,
  setTestReply,
}: {
  systemPrompt: string;
  setSystemPrompt: (s: string) => void;
  previewOpen: boolean;
  setPreviewOpen: (b: boolean) => void;
  handleSavePrompt: () => void;
  updateGuildPending: boolean;
  guildLoading: boolean;
  localTone: Tone;
  setLocalTone: (t: Tone) => void;
  testReply: string | null;
  setTestReply: (t: string | null) => void;
}) => {
  return (
    <motion.div
      key="ai"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
      className="space-y-4"
    >
      <motion.div
        whileHover={{ y: -1 }}
        className="rounded-2xl border border-white/10 bg-white/[0.02] p-6"
      >
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <label className="text-[14px] font-bold text-white tracking-tight">System prompt</label>
          <div className="flex flex-wrap items-center gap-3">
            <button type="button" className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-[13px] font-semibold text-slate-300 hover:bg-white/10 hover:text-white transition-colors" onClick={() => setPreviewOpen(true)}>
              Live preview
            </button>
            <button type="button" className="rounded-xl bg-[#0433FF] px-4 py-2 text-[13px] font-semibold text-white hover:bg-[#0433FF]/90 transition-colors shadow-lg shadow-[#0433FF]/20 disabled:opacity-50" onClick={handleSavePrompt} disabled={updateGuildPending || guildLoading}>
              {updateGuildPending ? 'Saving…' : 'Save prompt'}
            </button>
          </div>
        </div>
        <textarea
          value={systemPrompt}
          onChange={(e) => setSystemPrompt(e.target.value)}
          className="min-h-[160px] w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-[13px] leading-relaxed text-white placeholder-slate-500 focus:border-[#0433FF]/50 focus:outline-none focus:ring-2 focus:ring-[#0433FF]/20"
          placeholder="e.g. You are a helpful support assistant for..."
        />
        <div className="mt-5">
          <label className="mb-2 block text-[13px] font-semibold text-slate-300">Tone</label>
          <select
            value={localTone}
            onChange={(e) => setLocalTone(e.target.value as Tone)}
            className="w-full max-w-xs rounded-xl border border-white/10 bg-[#0f0f0f] px-4 py-2.5 text-[14px] text-white focus:border-[#0433FF]/50 focus:outline-none focus:ring-2 focus:ring-[#0433FF]/20 appearance-none"
          >
            {TONES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div className="mt-5">
          <button
            type="button"
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-[13px] font-semibold text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
            onClick={() =>
              setTestReply(
                (localTone === 'Friendly'
                  ? 'Hey! Thanks for messaging. I’d love to help — can you tell me a bit more about what you’re running into?'
                  : localTone === 'Casual'
                    ? 'Sure thing! What’s going on? Share the details and we’ll figure it out.'
                    : localTone === 'Formal'
                      ? 'We acknowledge your inquiry. Please provide the relevant information so that we may proceed in accordance with our procedures.'
                      : 'Thank you for reaching out. I’d be happy to help you with that. Could you please provide a few more details so we can assist you effectively?') as string,
              )
            }
          >
            Test prompt
          </button>
          {testReply && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-3 rounded-xl border border-[#0433FF]/30 bg-[#0433FF]/10 p-4 text-[13px] text-white shadow-lg shadow-[#0433FF]/5"
            >
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#0433FF]">Sample AI reply (simulation)</p>
              <p className="mt-1.5 leading-relaxed text-slate-200">{testReply}</p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}