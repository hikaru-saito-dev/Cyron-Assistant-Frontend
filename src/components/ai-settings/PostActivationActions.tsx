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
    <section className="cyron-glass space-y-3 p-4">
      <h3 className="font-display text-sm font-bold text-white">
        Maintenance
      </h3>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => void startRerun()}
          disabled={loading}
          className="cyron-btn-ghost !px-3 !py-2 !text-xs"
        >
          <FaSync className={loading ? "animate-spin" : ""} />
          Re-run discovery only
        </button>
        <button
          type="button"
          onClick={confirmReconfigure}
          className="inline-flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 font-sans text-xs font-semibold text-rose-300 transition-colors hover:bg-rose-500/15"
        >
          <FaRedo />
          Reconfigure from scratch
        </button>
      </div>

      {rerunOpen && (
        <div className="mt-2 rounded-xl border border-amber-400/20 bg-amber-400/[0.06] p-3">
          <p className="font-sans text-xs text-amber-300">
            {status}
          </p>
          <p className="mt-1 font-sans text-[11px] text-zinc-400">
            Privacy: mentions and IDs are stripped before extraction. Existing
            General Rules are not wiped.
          </p>

          {proposals.length > 0 && (
            <div className="mt-3 space-y-2">
              {proposals.map((p) => (
                <div
                  key={p.id}
                  className={`rounded-xl border bg-white/[0.04] p-3 ${
                    p.status === "discarded"
                      ? "border-white/10 opacity-40"
                      : p.status === "accepted"
                        ? "border-emerald-400/40"
                        : "border-white/10"
                  }`}
                >
                  <input
                    className="mb-1 w-full rounded-lg border border-white/10 bg-white/[0.04] px-2 py-1.5 text-sm text-white transition-all placeholder:text-white/40 focus:border-amber-400/50 focus:outline-none focus:ring-2 focus:ring-amber-400/20"
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
                    className="min-h-[56px] w-full rounded-lg border border-white/10 bg-white/[0.04] px-2 py-1.5 text-sm text-white transition-all placeholder:text-white/40 focus:border-amber-400/50 focus:outline-none focus:ring-2 focus:ring-amber-400/20"
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
                      className="inline-flex items-center gap-1 font-sans text-[11px] font-semibold text-emerald-400"
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
                      className="inline-flex items-center gap-1 font-sans text-[11px] font-semibold text-amber-400"
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
                className="cyron-btn-primary !px-3 !py-2 !text-xs"
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
