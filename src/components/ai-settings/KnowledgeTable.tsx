import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FaPlus, FaTrash } from "react-icons/fa";
import { guildService } from "../../services/guildService";

export function KnowledgeTable({
  entries,
  label,
  guildId,
  contextId,
  section,
}: {
  entries: KnowledgeEntry[];
  label: string;
  guildId: string;
  contextId: string;
  section: string;
}) {
  const qc = useQueryClient();
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const deleteMut = useMutation({
    mutationFn: (id: string) => guildService.deleteKnowledge(guildId, id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["knowledge", guildId] }),
  });

  const createMut = useMutation({
    mutationFn: () =>
      guildService.createKnowledge(guildId, {
        title,
        content,
        main_content: content,
        template_type:
          section === "problems" ? "problem_solution" : "general_knowledge",
        persist_mode: "structured",
        ai_context_id: contextId,
        section,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["knowledge", guildId] });
      setAdding(false);
      setTitle("");
      setContent("");
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <p className="font-sans text-sm font-medium text-zinc-400">
          {label}
        </p>
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="cyron-btn-primary !px-3.5 !py-2 !text-xs"
        >
          <FaPlus className="text-[10px]" />
          Add entry
        </button>
      </div>

      {adding && (
        <div className="cyron-glass space-y-3 p-5">
          <input
            autoFocus
            className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 font-sans text-sm text-white transition-all placeholder:text-white/40 focus:border-amber-400/50 focus:outline-none focus:ring-2 focus:ring-amber-400/20"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className="min-h-[120px] w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 font-mono text-[13px] leading-relaxed text-white transition-all placeholder:text-white/40 focus:border-amber-400/50 focus:outline-none focus:ring-2 focus:ring-amber-400/20"
            placeholder={
              section === "problems"
                ? "Problem description and solution…"
                : "Knowledge content…"
            }
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => createMut.mutate()}
              disabled={
                !title.trim() || !content.trim() || createMut.isPending
              }
              className="cyron-btn-primary !px-4 !py-2 !text-xs"
            >
              {createMut.isPending ? "Saving…" : "Save entry"}
            </button>
            <button
              type="button"
              onClick={() => {
                setAdding(false);
                setTitle("");
                setContent("");
              }}
              className="cyron-btn-ghost !px-4 !py-2 !text-xs"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {entries.length === 0 && !adding ? (
        <div className="rounded-2xl border border-dashed border-white/15 py-12 text-center">
          <p className="font-sans text-sm text-zinc-500">No entries yet.</p>
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="mt-2 font-sans text-sm font-medium text-amber-400 hover:underline"
          >
            Add your first entry
          </button>
        </div>
      ) : (
        <div className="cyron-glass overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px] border-collapse font-sans text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.04]">
                  <th className="px-5 py-3.5 text-left font-display text-[11px] font-bold uppercase tracking-[0.12em] text-zinc-400">
                    Title
                  </th>
                  <th className="px-5 py-3.5 text-left font-display text-[11px] font-bold uppercase tracking-[0.12em] text-zinc-400">
                    Preview
                  </th>
                  <th className="w-24 px-5 py-3.5 text-right font-display text-[11px] font-bold uppercase tracking-[0.12em] text-zinc-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {entries.map((k) => (
                  <tr
                    key={k.id}
                    className="transition-colors hover:bg-white/[0.04]"
                  >
                    <td className="px-5 py-4 align-top">
                      <p className="font-sans font-semibold text-white">
                        {k.title}
                      </p>
                    </td>
                    <td className="px-5 py-4 align-top">
                      <p className="line-clamp-2 font-mono text-[12px] leading-relaxed text-zinc-400">
                        {k.main_content ?? k.content}
                      </p>
                    </td>
                    <td className="px-5 py-4 align-top text-right">
                      <button
                        type="button"
                        onClick={() => deleteMut.mutate(k.id)}
                        disabled={deleteMut.isPending}
                        className="inline-flex items-center gap-1 rounded-lg px-2 py-1 font-sans text-xs font-medium text-red-400 transition hover:bg-red-500/10"
                      >
                        <FaTrash className="text-[10px]" />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
