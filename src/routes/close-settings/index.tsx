import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { guildService } from '../../services/guildService';
import { PageLoader } from '../../components/ui/Skeleton';
import { TextBlurIn } from '../../components/ui/text-blur-in';
import { motion } from 'framer-motion';

const Toggle = ({ label, hint, checked, onChange }: { label: string; hint?: string; checked: boolean; onChange: (v: boolean) => void }) => (
  <div className="flex items-center justify-between py-4 px-6 hover:bg-white/[0.02] transition-colors">
    <div>
      <p className="text-[14px] font-medium text-white">{label}</p>
      {hint && <p className="text-[13px] text-slate-400 mt-0.5 leading-relaxed">{hint}</p>}
    </div>
    <button type="button" onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${checked ? 'bg-white' : 'bg-white/10'}`}>
      <span className={`inline-block h-4 w-4 transform rounded-full transition-transform ${checked ? 'translate-x-6 bg-black' : 'translate-x-1 bg-white/50'}`} />
    </button>
  </div>
);

export function CloseSettings() {
  const { guildId } = useParams<{ guildId: string }>();
  const qc = useQueryClient();
  const [form, setForm] = useState<Record<string, any>>({});
  const [toast, setToast] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['close-settings', guildId],
    queryFn: () => guildService.fetchCloseSettings(guildId!),
    enabled: !!guildId,
  });

  useEffect(() => { if (data) setForm(data); }, [data]);

  const set = (key: string, value: any) => setForm(f => ({ ...f, [key]: value }));

  const saveMut = useMutation({
    mutationFn: () => guildService.updateCloseSettings(guildId!, form),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['close-settings', guildId] });
      setToast('Saved.');
      setTimeout(() => setToast(null), 2500);
    },
  });

  if (isLoading) return <PageLoader label="Loading close settings…" />;

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12 pt-4 md:pt-0">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between px-4 md:px-0">
        <div className="space-y-2">
          <TextBlurIn className="text-white font-bold uppercase text-[2.5rem] md:text-[3.5rem] leading-[0.85] tracking-tighter" style={{ fontFamily: 'Impact, "Arial Black", sans-serif' }}>Close Settings</TextBlurIn>
          <TextBlurIn delay={0.2} className="text-[14px] text-slate-400 max-w-lg leading-relaxed">Manage ticket closing behavior, messages, and logs.</TextBlurIn>
        </div>
        <button onClick={() => saveMut.mutate()} disabled={saveMut.isPending}
          className="shrink-0 rounded-full bg-[#0433FF] px-5 py-2 text-[13px] font-medium text-white hover:bg-[#0433FF]/90 transition-all shadow-lg shadow-[#0433FF]/20 disabled:opacity-50 inline-flex items-center gap-2">
          {saveMut.isPending ? <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />Saving…</> : 'Save Changes'}
        </button>
      </div>

      <div className="space-y-6 px-4 md:px-0">
        {/* Close Message Section */}
        <motion.div initial={{ opacity: 0, filter: "blur(10px)", y: 10 }} animate={{ opacity: 1, filter: "blur(0px)", y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="rounded-2xl border border-white/5 bg-black overflow-hidden">
          <div className="p-6 md:p-8 border-b border-white/5">
            <h3 className="text-[16px] font-semibold text-white">Close Message Embed</h3>
            <p className="text-[13px] text-slate-400 mt-1">Sent in the ticket channel before it's deleted. Supports variables: <code className="font-mono bg-white/10 px-1 py-0.5 rounded text-white/80">{'{ticket.closer.mention}'}</code>, <code className="font-mono bg-white/10 px-1 py-0.5 rounded text-white/80">{'{ticket.closeReason}'}</code></p>
          </div>
          <div className="p-6 md:p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <label className="block space-y-2">
                <span className="text-[13px] font-medium text-white">Title</span>
                <input value={form.close_embed_title ?? ''} onChange={e => set('close_embed_title', e.target.value)}
                  className="w-full rounded-xl border border-white/10 !bg-white px-4 py-2 text-[13px] !text-black placeholder-slate-400 focus:outline-none focus:border-[#0433FF] focus:ring-1 focus:ring-[#0433FF] transition-all" placeholder="Ticket Closed" />
              </label>
              <label className="block space-y-2">
                <span className="text-[13px] font-medium text-white">Default Close Reason</span>
                <input value={form.default_close_reason ?? ''} onChange={e => set('default_close_reason', e.target.value)}
                  className="w-full rounded-xl border border-white/10 !bg-white px-4 py-2 text-[13px] !text-black placeholder-slate-400 focus:outline-none focus:border-[#0433FF] focus:ring-1 focus:ring-[#0433FF] transition-all"
                  placeholder="No further action required." />
              </label>
            </div>
            <label className="block space-y-2">
              <span className="text-[13px] font-medium text-white">Description</span>
              <textarea value={form.close_embed_description ?? ''} onChange={e => set('close_embed_description', e.target.value)} rows={3}
                className="w-full rounded-xl border border-white/10 !bg-white px-4 py-3 text-[13px] !text-black placeholder-slate-400 focus:outline-none focus:border-[#0433FF] focus:ring-1 focus:ring-[#0433FF] transition-all resize-y"
                placeholder="Your ticket has been closed by {ticket.closer.mention}." />
            </label>
            <label className="block space-y-2">
              <span className="text-[13px] font-medium text-white">Footer</span>
              <input value={form.close_embed_footer ?? ''} onChange={e => set('close_embed_footer', e.target.value || null)}
                className="w-full rounded-xl border border-white/10 !bg-white px-4 py-2 text-[13px] !text-black placeholder-slate-400 focus:outline-none focus:border-[#0433FF] focus:ring-1 focus:ring-[#0433FF] transition-all" />
            </label>
          </div>
        </motion.div>

        {/* Toggles */}
        <motion.div initial={{ opacity: 0, filter: "blur(10px)", y: 10 }} animate={{ opacity: 1, filter: "blur(0px)", y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} className="rounded-2xl border border-white/5 bg-black overflow-hidden">
          <div className="p-6 md:p-8 border-b border-white/5">
            <h3 className="text-[16px] font-semibold text-white">Behavior & Logs</h3>
            <p className="text-[13px] text-slate-400 mt-1">Configure actions that happen when a ticket is closed.</p>
          </div>
          <div className="divide-y divide-white/5">
            <Toggle label="DM user on close" hint="Send the close embed to the ticket creator via DM"
              checked={!!form.dm_user_on_close} onChange={v => set('dm_user_on_close', v)} />
            <Toggle label="Show transcript button" hint="Add a View Transcript button to the close message"
              checked={!!form.show_transcript_button} onChange={v => set('show_transcript_button', v)} />
            <Toggle label="Require reason to close" hint="Staff must type a reason when closing a ticket"
              checked={!!form.require_reason_to_close} onChange={v => set('require_reason_to_close', v)} />
            <Toggle label="Confirm before close" hint="Show a YES confirmation modal before closing"
              checked={!!form.confirm_close_check} onChange={v => set('confirm_close_check', v)} />
            <Toggle label="Close on user leave" hint="Auto-close open tickets when the creator leaves the server"
              checked={!!form.close_on_user_leave} onChange={v => set('close_on_user_leave', v)} />
          </div>
        </motion.div>

        {/* Rating */}
        <motion.div initial={{ opacity: 0, filter: "blur(10px)", y: 10 }} animate={{ opacity: 1, filter: "blur(0px)", y: 0 }} transition={{ duration: 0.6, delay: 0.5 }} className="rounded-2xl border border-white/5 bg-black overflow-hidden">
          <div className="p-6 md:p-8 border-b border-white/5">
            <h3 className="text-[16px] font-semibold text-white">Rating System</h3>
            <p className="text-[13px] text-slate-400 mt-1">Ask the ticket creator to rate their support experience.</p>
          </div>
          <div className="divide-y divide-white/5">
            <Toggle label="Enable Rating System" hint="Prompt user to rate (1–5 stars) after closing"
              checked={!!form.rating_system_enabled} onChange={v => set('rating_system_enabled', v)} />
            {form.rating_system_enabled && (
              <div className="p-6 md:p-8 bg-black">
                <label className="block space-y-2 max-w-md">
                  <span className="text-[13px] font-medium text-white">Rating Log Channel ID</span>
                  <input value={form.rating_log_channel_id ?? ''} onChange={e => set('rating_log_channel_id', e.target.value ? parseInt(e.target.value) : null)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-[13px] text-white placeholder-slate-500 focus:outline-none focus:border-white/20 focus:bg-white/10 transition-all"
                    placeholder="Discord channel ID" />
                </label>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 rounded-xl bg-white text-black px-5 py-3 text-[13px] font-medium shadow-2xl transition-all">{toast}</div>
      )}
    </div>
  );
}
