import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { guildService } from '../../services/guildService';
import { PageLoader } from '../../components/ui/Skeleton';

const Toggle = ({ label, hint, checked, onChange }: { label: string; hint?: string; checked: boolean; onChange: (v: boolean) => void }) => (
  <div className="flex items-center justify-between py-3.5">
    <div>
      <p className="text-[14px] font-semibold text-slate-200">{label}</p>
      {hint && <p className="text-[12px] text-slate-400 mt-0.5">{hint}</p>}
    </div>
    <button type="button" onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${checked ? 'bg-[#0433FF]' : 'bg-white/10'}`}>
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
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
    <div className="p-4 md:p-8 max-w-4xl mx-auto w-full space-y-8">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Close Settings</h2>
          <p className="text-[14px] text-slate-400 mt-1">Manage ticket closing behavior and logs.</p>
        </div>
        <button onClick={() => saveMut.mutate()} disabled={saveMut.isPending}
          className="inline-flex items-center justify-center min-w-[100px] gap-2 rounded-xl bg-[#0433FF] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0433FF]/90 disabled:opacity-60 transition-colors shadow-lg shadow-[#0433FF]/20">
          {saveMut.isPending ? <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />Saving…</> : 'Save'}
        </button>
      </div>

      {/* Close Embed */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 space-y-5">
        <div>
          <p className="text-[16px] font-bold text-white tracking-tight">Close Message</p>
          <p className="text-[13px] text-slate-400 mt-1">Sent in the ticket channel before it's deleted. Supports: {'{ticket.closer.mention}'}, {'{ticket.closeReason}'}</p>
        </div>
        <label className="block">
          <span className="text-[13px] font-semibold tracking-wide text-slate-300">Title</span>
          <input value={form.close_embed_title ?? ''} onChange={e => set('close_embed_title', e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-[14px] text-white placeholder-slate-500 focus:outline-none focus:border-[#0433FF]/50 focus:ring-2 focus:ring-[#0433FF]/20 transition-all" placeholder="Ticket Closed" />
        </label>
        <label className="block">
          <span className="text-[13px] font-semibold tracking-wide text-slate-300">Description</span>
          <textarea value={form.close_embed_description ?? ''} onChange={e => set('close_embed_description', e.target.value)} rows={3}
            className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-[14px] text-white placeholder-slate-500 focus:outline-none focus:border-[#0433FF]/50 focus:ring-2 focus:ring-[#0433FF]/20 transition-all"
            placeholder="Your ticket has been closed by {ticket.closer.mention}." />
        </label>
        <label className="block">
          <span className="text-[13px] font-semibold tracking-wide text-slate-300">Footer</span>
          <input value={form.close_embed_footer ?? ''} onChange={e => set('close_embed_footer', e.target.value || null)}
            className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-[14px] text-white placeholder-slate-500 focus:outline-none focus:border-[#0433FF]/50 focus:ring-2 focus:ring-[#0433FF]/20 transition-all" />
        </label>
        <label className="block">
          <span className="text-[13px] font-semibold tracking-wide text-slate-300">Default Close Reason</span>
          <input value={form.default_close_reason ?? ''} onChange={e => set('default_close_reason', e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-[14px] text-white placeholder-slate-500 focus:outline-none focus:border-[#0433FF]/50 focus:ring-2 focus:ring-[#0433FF]/20 transition-all"
            placeholder="No further action required." />
        </label>
      </div>

      {/* Toggles */}
      {/* Toggles */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] px-6 py-2 divide-y divide-white/5">
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

      {/* Rating */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] px-6 py-2 divide-y divide-white/5">
        <Toggle label="Rating system" hint="Ask ticket creator to rate support after closing (1–5 stars)"
          checked={!!form.rating_system_enabled} onChange={v => set('rating_system_enabled', v)} />
        {form.rating_system_enabled && (
          <div className="py-4">
            <label className="block">
              <span className="text-[13px] font-semibold tracking-wide text-slate-300">Rating Log Channel ID</span>
              <input value={form.rating_log_channel_id ?? ''} onChange={e => set('rating_log_channel_id', e.target.value ? parseInt(e.target.value) : null)}
                className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-[14px] text-white placeholder-slate-500 focus:outline-none focus:border-[#0433FF]/50 focus:ring-2 focus:ring-[#0433FF]/20 transition-all"
                placeholder="Discord channel ID" />
            </label>
          </div>
        )}
      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 px-5 py-3 text-sm font-medium shadow-2xl backdrop-blur-md">{toast}</div>
      )}
    </div>
  );
}
