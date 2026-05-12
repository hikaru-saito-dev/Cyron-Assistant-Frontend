import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { guildService } from '../../services/guildService';
import { PageLoader, SkeletonList } from '../../components/ui/Skeleton';

const EMPTY: Omit<Panel, 'id' | 'guild_id'> = {
  name: '',
  bot_id: null,
  ticket_category_name: 'Tickets',
  button_text: 'Open Ticket',
  button_emoji: null,
  welcome_message: null,
  ai_context_id: null,
};

export function Panels() {
  const { guildId } = useParams<{ guildId: string }>();
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Panel | null>(null);
  const [form, setForm] = useState<Omit<Panel, 'id' | 'guild_id'>>(EMPTY);
  const [open, setOpen] = useState(false);

  const { data: panels = [], isLoading } = useQuery({
    queryKey: ['panels', guildId],
    queryFn: () => guildService.fetchPanels(guildId!),
    enabled: !!guildId,
  });

  const { data: contexts = [], isLoading: contextsLoading } = useQuery({
    queryKey: ['contexts', guildId],
    queryFn: () => guildService.fetchContexts(guildId!),
    enabled: !!guildId,
  });

  const invalidate = () => qc.invalidateQueries({ queryKey: ['panels', guildId] });

  const createMut = useMutation({ mutationFn: (p: typeof EMPTY) => guildService.createPanel(guildId!, p), onSuccess: invalidate });
  const updateMut = useMutation({ mutationFn: (p: Panel) => guildService.updatePanel(guildId!, p.id, p), onSuccess: invalidate });
  const deleteMut = useMutation({ mutationFn: (id: string) => guildService.deletePanel(guildId!, id), onSuccess: invalidate });

  function openCreate() { setEditing(null); setForm(EMPTY); setOpen(true); }
  function openEdit(p: Panel) { setEditing(p); setForm(p); setOpen(true); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editing) await updateMut.mutateAsync({ ...form, id: editing.id, guild_id: editing.guild_id });
    else await createMut.mutateAsync(form);
    setOpen(false);
  }

  if (isLoading || contextsLoading) return <PageLoader label="Loading panels…" />;

  return (
    <div className="p-4 md:p-6 max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg md:text-xl font-semibold text-slate-900">Ticket Panels</h2>
        <button onClick={openCreate} className="rounded-xl bg-sky-600 px-3 py-2 text-sm font-medium text-white hover:bg-sky-700">
          + New Panel
        </button>
      </div>

      {panels.length === 0 && (
        <p className="text-slate-500 text-sm">No panels yet. Create one to get started.</p>
      )}

      <div className="space-y-3">
        {panels.map((p) => {
          const ctx = contexts.find((c) => c.id === p.ai_context_id);
          return (
            <div key={p.id} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <div>
                <p className="font-medium text-slate-900">{p.name}</p>
                <p className="text-xs text-slate-500">
                  Category: {p.ticket_category_name} · Context: {ctx?.name ?? <span className="text-amber-500">None</span>}
                </p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(p)} className="rounded-lg border border-slate-200 px-3 py-1 text-xs hover:bg-slate-50">Edit</button>
                <button onClick={() => deleteMut.mutate(p.id)} className="rounded-lg border border-red-200 px-3 py-1 text-xs text-red-600 hover:bg-red-50">Delete</button>
              </div>
            </div>
          );
        })}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-0 sm:p-4">
          <form onSubmit={handleSubmit} className="w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl bg-white p-5 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold">{editing ? 'Edit Panel' : 'New Panel'}</h3>

            {[
              { label: 'Panel Name', key: 'name', required: true },
              { label: 'Ticket Category', key: 'ticket_category_name' },
              { label: 'Button Text', key: 'button_text' },
              { label: 'Button Emoji', key: 'button_emoji' },
              { label: 'Welcome Message', key: 'welcome_message' },
            ].map(({ label, key, required }) => (
              <label key={key} className="block">
                <span className="text-xs font-medium text-slate-600">{label}</span>
                <input
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                  value={(form as any)[key] ?? ''}
                  required={required}
                  onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value || null }))}
                />
              </label>
            ))}

            <label className="block">
              <span className="text-xs font-medium text-slate-600">Linked AI Context</span>
              <select
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
                value={form.ai_context_id ?? ''}
                onChange={(e) => setForm((f) => ({ ...f, ai_context_id: e.target.value || null }))}
              >
                <option value="">— None —</option>
                {contexts.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </label>

            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setOpen(false)} className="rounded-xl border border-slate-200 px-4 py-2 text-sm hover:bg-slate-50">Cancel</button>
              <button type="submit" disabled={createMut.isPending || updateMut.isPending} className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700 disabled:opacity-60">
                {(createMut.isPending || updateMut.isPending) ? (
                  <><span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />Saving…</>
                ) : 'Save'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
