import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { FaRedo, FaSync, FaTrash, FaCheck, FaEdit } from "react-icons/fa";
import { guildService } from "../../services/guildService";
import { newRuleId } from "./wizard/types";

type Proposal = {
  id: string;
  problem: string;
  solution: string;
  status: "pending" | "accepted" | "discarded";
};

type Props = {
  guildId: string;
  contextId: string | undefined;
  enabled: boolean;
  onReconfigure: () => void;
};

export function PostActivationActions({
  guildId,
  contextId,
  enabled,
  onReconfigure,
}: Props) {
  const qc = useQueryClient();
  const [rerunOpen, setRerunOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [saving, setSaving] = useState(false);

  if (!enabled) return null;

  async function startRerun() {
    setRerunOpen(true);
    setLoading(true);
    setStatus("Scanning server…");
    setProposals([]);
    try {
      const scan = await guildService.runAiDiscoveryScan(guildId);
      const channelIds = [
        ...(scan.classified_channels?.transcript?.map((c) => c.id) || []),
        ...(scan.classified_channels?.ticket_history?.map((c) => c.id) || []),
      ].slice(0, 8);
      setStatus(
        channelIds.length
          ? "Extracting problem patterns from transcripts (IDs stripped for privacy)…"
          : "No transcript channels found — you can still add problems manually.",
      );
      if (channelIds.length) {
        const extracted = await guildService.runAiDiscoveryExtract(guildId, {
          channel_ids: channelIds,
          ticket_channel_ids: [],
          max_problems: 5,
        });
        const rows = (extracted.problems || []).map((p) => ({
          id: newRuleId(),
          problem: p.problem,
          solution: p.solution,
          status: "pending" as const,
        }));
        setProposals(rows);
        setStatus(
          rows.length
            ? `Found ${rows.length} proposal(s). Accept, edit, or discard.`
            : extracted.message ||
                "Couldn't extract enough patterns — try again later.",
        );
      } else {
        setStatus(
          "Scan complete. No transcript sources to extract from right now.",
        );
      }
    } catch {
      setStatus(
        "Discovery failed gracefully — try again when the bot is online.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function applyAccepted() {
    if (!contextId) return;
    const accepted = proposals.filter((p) => p.status === "accepted");
    if (!accepted.length) return;
    setSaving(true);
    try {
      for (const p of accepted) {
        await guildService.createKnowledge(guildId, {
          title: p.problem.slice(0, 200),
          content: `${p.problem}\n\n${p.solution}`,
          main_content: p.solution,
          additional_context: p.problem,
          template_type: "problem_solution",
          template_payload: { problem: p.problem, solution: p.solution },
          persist_mode: "structured",
          ai_context_id: contextId,
          section: "problems",
        });
      }
      void qc.invalidateQueries({ queryKey: ["knowledge", guildId] });
      setStatus(`Added ${accepted.length} problem→solution pair(s).`);
      setProposals((prev) => prev.filter((p) => p.status !== "accepted"));
    } catch {
      setStatus("Some proposals could not be saved — try again.");
    } finally {
      setSaving(false);
    }
  }

  function confirmReconfigure() {
    const ok = window.confirm(
      "This will overwrite your current General Rules. Continue?",
    );
    if (ok) onReconfigure();
  }

  return (
    <section className="space-y-3 rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
      <h3 className="font-display text-sm font-bold text-slate-900 dark:text-white">
        Maintenance
      </h3>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => void startRerun()}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 font-sans text-xs font-semibold text-slate-700 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200"
        >
          <FaSync className={loading ? "animate-spin" : ""} />
          Re-run discovery only
        </button>
        <button
          type="button"
          onClick={confirmReconfigure}
          className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 font-sans text-xs font-semibold text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300"
        >
          <FaRedo />
          Reconfigure from scratch
        </button>
      </div>

      {rerunOpen && (
        <div className="mt-2 rounded-xl border border-indigo-100 bg-indigo-50/50 p-3 dark:border-indigo-500/20 dark:bg-indigo-500/5">
          <p className="font-sans text-xs text-indigo-800 dark:text-indigo-300">
            {status}
          </p>
          <p className="mt-1 font-sans text-[11px] text-slate-500">
            Privacy: mentions and IDs are stripped before extraction. Existing
            General Rules are not wiped.
          </p>

          {proposals.length > 0 && (
            <div className="mt-3 space-y-2">
              {proposals.map((p) => (
                <div
                  key={p.id}
                  className={`rounded-xl border bg-white p-3 dark:bg-slate-900 ${
                    p.status === "discarded"
                      ? "opacity-40"
                      : p.status === "accepted"
                        ? "border-emerald-300"
                        : "border-slate-200 dark:border-slate-700"
                  }`}
                >
                  <input
                    className="mb-1 w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm dark:border-slate-600 dark:bg-slate-800"
                    value={p.problem}
                    disabled={p.status === "discarded"}
                    onChange={(e) =>
                      setProposals((prev) =>
                        prev.map((x) =>
                          x.id === p.id
                            ? { ...x, problem: e.target.value, status: "pending" }
                            : x,
                        ),
                      )
                    }
                  />
                  <textarea
                    className="min-h-[56px] w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm dark:border-slate-600 dark:bg-slate-800"
                    value={p.solution}
                    disabled={p.status === "discarded"}
                    onChange={(e) =>
                      setProposals((prev) =>
                        prev.map((x) =>
                          x.id === p.id
                            ? {
                                ...x,
                                solution: e.target.value,
                                status: "pending",
                              }
                            : x,
                        ),
                      )
                    }
                  />
                  <div className="mt-2 flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 font-sans text-[11px] font-semibold text-emerald-600"
                      onClick={() =>
                        setProposals((prev) =>
                          prev.map((x) =>
                            x.id === p.id ? { ...x, status: "accepted" } : x,
                          ),
                        )
                      }
                    >
                      <FaCheck /> Accept
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 font-sans text-[11px] font-semibold text-indigo-600"
                      onClick={() =>
                        setProposals((prev) =>
                          prev.map((x) =>
                            x.id === p.id ? { ...x, status: "pending" } : x,
                          ),
                        )
                      }
                    >
                      <FaEdit /> Edit
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 font-sans text-[11px] font-semibold text-rose-500"
                      onClick={() =>
                        setProposals((prev) =>
                          prev.map((x) =>
                            x.id === p.id ? { ...x, status: "discarded" } : x,
                          ),
                        )
                      }
                    >
                      <FaTrash /> Discard
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                disabled={saving}
                onClick={() => void applyAccepted()}
                className="rounded-xl bg-indigo-600 px-3 py-2 font-sans text-xs font-semibold text-white disabled:opacity-50"
              >
                {saving ? "Applying…" : "Apply accepted proposals"}
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
