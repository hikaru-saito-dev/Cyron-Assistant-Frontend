import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { guildService } from '../../services/guildService';
import { PageLoader } from '../../components/ui/Skeleton';

const STATUS_COLORS: Record<string, string> = {
  open: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  closed: 'bg-white/10 text-slate-300 border border-white/10',
};
const PRIORITY_EMOJI: Record<string, string> = { low: '🟢', medium: '🟡', high: '🟠', urgent: '🔴' };

export function TicketManagement() {
  const { guildId } = useParams<{ guildId: string }>();
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['tickets', guildId, status, search, page],
    queryFn: () => guildService.fetchTickets(guildId!, { status, search, page, limit: 20 }),
    enabled: !!guildId,
  });

  const { data: detail, isLoading: detailLoading } = useQuery({
    queryKey: ['ticket-detail', guildId, selected],
    queryFn: () => guildService.fetchTicketDetail(guildId!, selected!),
    enabled: !!guildId && !!selected,
  });

  if (isLoading) return <PageLoader label="Loading tickets…" />;

  const stats = data?.stats ?? {};
  const tickets = data?.tickets ?? [];
  const totalPages = Math.ceil((data?.total ?? 0) / 20);

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto w-full space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Ticket Management</h2>
        <p className="text-[14px] text-slate-400 mt-1">View and manage support tickets.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Open Queue', value: stats.open_queue ?? 0, sub: null },
          { label: 'Created (7d)', value: stats.created_7d ?? 0, sub: `Today: ${stats.today_created ?? 0}` },
          { label: 'Closed (7d)', value: stats.closed_7d ?? 0, sub: `Today: ${stats.today_closed ?? 0}` },
          { label: 'All-Time', value: stats.all_time ?? 0, sub: `Claimed: ${stats.claimed ?? 0}` },
        ].map(({ label, value, sub }) => (
          <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
            <p className="text-[13px] font-semibold tracking-wide text-slate-400">{label}</p>
            <p className="mt-1.5 text-3xl font-bold text-white">{value}</p>
            {sub && <p className="text-[11px] text-slate-500 mt-1">{sub}</p>}
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search by channel name…"
          className="rounded-xl border border-white/10 bg-[#0f0f0f] px-4 py-2.5 text-[14px] text-white placeholder-slate-500 focus:outline-none focus:border-[#0433FF]/50 focus:ring-2 focus:ring-[#0433FF]/20 transition-all w-full sm:w-64" />
        <div className="flex bg-[#0f0f0f] p-1 rounded-xl border border-white/10">
          {['all', 'open', 'closed'].map((s) => (
            <button key={s} onClick={() => { setStatus(s); setPage(1); }}
              className={`rounded-lg px-4 py-1.5 text-[13px] font-semibold capitalize transition-all ${status === s ? 'bg-white/10 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-4 items-start">
        {/* List */}
        <div className="flex-1 min-w-0 space-y-3">
          {tickets.length === 0 && <p className="text-[14px] text-slate-500">No tickets found.</p>}
          {tickets.map((t: any) => (
            <div key={t.id} onClick={() => setSelected(t.id)}
              className={`cursor-pointer rounded-2xl border p-4 transition-all duration-300 ${selected === t.id ? 'border-[#0433FF]/50 bg-[#0433FF]/10 shadow-[0_0_20px_rgba(4,51,255,0.08)]' : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.04]'}`}>
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className={`text-[15px] font-bold tracking-tight ${selected === t.id ? 'text-white' : 'text-slate-200'}`}>#{t.ticket_number ?? '—'} {t.channel_name ?? '—'}</span>
                    <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${STATUS_COLORS[t.status] ?? 'bg-white/10 text-slate-400 border border-white/10'}`}>{t.status}</span>
                    {t.priority && <span>{PRIORITY_EMOJI[t.priority]}</span>}
                  </div>
                  <p className="text-[13px] text-slate-500 mt-1.5 flex items-center gap-2"><span className="text-[#0433FF] font-medium">{t.panel_name}</span> <span className="opacity-40">•</span> <span>{t.created_at ? new Date(t.created_at).toLocaleDateString() : '—'}</span></p>
                </div>
                {t.rating && <span className="text-yellow-500 flex-shrink-0 text-sm">{'⭐'.repeat(t.rating)}</span>}
              </div>
            </div>
          ))}
          {totalPages > 1 && (
            <div className="flex items-center gap-3 pt-3">
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-[13px] font-semibold text-slate-300 disabled:opacity-40 hover:bg-white/10 hover:text-white transition-colors">← Prev</button>
              <span className="text-[13px] font-medium text-slate-500">{page} / {totalPages}</span>
              <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-[13px] font-semibold text-slate-300 disabled:opacity-40 hover:bg-white/10 hover:text-white transition-colors">Next →</button>
            </div>
          )}
        </div>

        {/* Detail */}
        {selected && (
          <div className="w-80 flex-shrink-0 rounded-3xl border border-white/10 bg-[#0a0a0a] shadow-2xl flex flex-col max-h-[75vh] overflow-hidden">
            {detailLoading ? <div className="p-6 text-[13px] text-slate-500 flex items-center gap-2"><span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-500 border-t-transparent" />Loading details…</div> : detail ? (
              <>
                <div className="p-5 border-b border-white/5 space-y-3 bg-white/[0.02]">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-[16px] text-white truncate">#{detail.ticket?.ticket_number} {detail.ticket?.channel_name}</p>
                    <button onClick={() => setSelected(null)} className="text-slate-500 hover:text-white transition-colors ml-2">✕</button>
                  </div>
                  <div className="space-y-1.5">
                    {[
                      ['Panel', detail.ticket?.panel_name],
                      ['Status', detail.ticket?.status],
                      ['Priority', detail.ticket?.priority ? `${PRIORITY_EMOJI[detail.ticket.priority]} ${detail.ticket.priority}` : '—'],
                      ['Close Reason', detail.ticket?.close_reason || '—'],
                      ['Rating', detail.ticket?.rating ? '⭐'.repeat(detail.ticket.rating) : '—'],
                      ['Opened', detail.ticket?.created_at ? new Date(detail.ticket.created_at).toLocaleString() : '—'],
                      ['Closed', detail.ticket?.closed_at ? new Date(detail.ticket.closed_at).toLocaleString() : '—'],
                    ].map(([k, v]) => (
                      <div key={k} className="flex justify-between text-[12px] gap-3">
                        <span className="text-slate-500 font-medium flex-shrink-0">{k}</span>
                        <span className="text-slate-300 text-right truncate">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Transcript</p>
                  {(detail.messages ?? []).map((m: any, i: number) => (
                    <div key={i} className={`rounded-2xl px-4 py-3 text-[13px] ${m.role === 'assistant' ? 'bg-[#0433FF]/10 text-white border border-[#0433FF]/20 ml-6 rounded-tr-sm' : 'bg-white/5 text-slate-200 border border-white/10 mr-6 rounded-tl-sm'}`}>
                      <p className={`font-semibold text-[10px] mb-1 uppercase tracking-wider ${m.role === 'assistant' ? 'text-[#0433FF]' : 'text-slate-500'}`}>{m.role}</p>
                      <p className="whitespace-pre-wrap break-words leading-relaxed">{m.content}</p>
                    </div>
                  ))}
                  {detail.messages?.length === 0 && <p className="text-[13px] text-slate-500">No messages found in transcript.</p>}
                </div>
              </>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
