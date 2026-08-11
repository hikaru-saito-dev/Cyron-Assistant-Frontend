import { motion } from "framer-motion";
import { Loader } from "../../components/ui/Loader";
import { Button } from "../../components/ui/Button";

const entryChars = (entry: KnowledgeEntry) =>
  (entry.title?.length ?? 0) +
  (entry.main_content?.length ?? entry.content?.length ?? 0) +
  (entry.additional_context?.length ?? 0) +
  (entry.behavior_notes?.length ?? 0);

const templateBadge = (t?: string | null) => {
  const key = (t || "general_knowledge").toLowerCase();
  const map: Record<string, string> = {
    general_knowledge: "General",
    problem_solution: "Problem/Solution",
    product_info: "Product",
    behavior_rule: "Behavior",
  };
  return map[key] ?? key.replace(/_/g, " ");
};

export const KnowledgeTab = ({
  knowledge,
  knowledgeLoading,
  knowledgeError,
  openCreateModal,
  openProblemModal,
  openEditModal,
  handleDeleteKnowledge,
  deleteKnowledgePending,
  totalChars,
  maxChars,
  usageRatio,
  showUpgradeBanner,
  planLabel,
}: {
  knowledge: KnowledgeEntry[];
  knowledgeLoading: boolean;
  knowledgeError: boolean;
  openCreateModal: () => void;
  openProblemModal: () => void;
  openEditModal: (e: KnowledgeEntry) => void;
  handleDeleteKnowledge: (e: KnowledgeEntry) => void;
  deleteKnowledgePending: boolean;
  totalChars: number;
  maxChars: number;
  usageRatio: number;
  showUpgradeBanner: boolean;
  planLabel: string;
}) => (
  <motion.div
    key="knowledge"
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -8 }}
    transition={{ duration: 0.2 }}
    className="space-y-4"
  >
    {/* Capacity bar */}
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
      <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-300">Knowledge capacity</span>
          {knowledgeLoading && <Loader />}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <span
            className={`font-mono text-[13px] ${usageRatio > 0.8 ? "text-amber-500" : "text-slate-400"}`}
          >
            {totalChars.toLocaleString()} / {maxChars.toLocaleString()} chars
          </span>
          <button
            onClick={openCreateModal}
            disabled={knowledgeLoading}
            className="rounded-xl bg-[#0433FF] px-4 py-2 text-[13px] font-semibold text-white hover:bg-[#0433FF]/90 transition-colors shadow-lg shadow-[#0433FF]/20 disabled:opacity-50"
          >
            New Knowledge
          </button>
          <button
            type="button"
            onClick={openProblemModal}
            disabled={knowledgeLoading}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-[13px] font-semibold text-slate-300 hover:bg-white/10 hover:text-white transition-colors disabled:opacity-50"
          >
            New Problem
          </button>
        </div>
      </div>
      <div className="mt-4 h-2 w-full rounded-full bg-white/5 overflow-hidden border border-white/10">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${usageRatio * 100}%` }}
          transition={{ duration: 0.3 }}
          className={`h-full rounded-full ${usageRatio > 0.8 ? "bg-gradient-to-r from-amber-400 to-red-500" : "bg-[#0433FF]"}`}
        />
      </div>
    </div>

    {/* Upgrade banner */}
    {showUpgradeBanner && (
      <div className="flex flex-col gap-4 rounded-2xl border border-[#0433FF]/30 bg-[#0433FF]/10 px-5 py-4 text-[13px] sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-bold text-white">
            Reached knowledge capacity for {planLabel} plan.
          </p>
          <p className="mt-1 text-slate-400">Upgrade to add more entries.</p>
        </div>
        <button className="w-full sm:w-auto rounded-xl bg-[#0433FF] px-5 py-2.5 text-[13px] font-semibold text-white hover:bg-[#0433FF]/90 transition-colors shadow-lg shadow-[#0433FF]/20">
          Upgrade plan
        </button>
      </div>
    )}

    {/* Entries */}
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
      {knowledgeLoading && (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-16 animate-pulse rounded-xl bg-white/5"
            />
          ))}
        </div>
      )}
      {knowledgeError && !knowledgeLoading && (
        <p className="text-[14px] text-red-400">Failed to load. Please refresh.</p>
      )}
      {!knowledgeLoading && !knowledgeError && knowledge.length === 0 && (
        <div className="flex flex-col items-center gap-4 py-12 text-center">
          <h3 className="text-[16px] font-bold text-white">No knowledge entries yet</h3>
          <p className="max-w-sm text-[14px] text-slate-400">
            Add your first entry to teach the AI about your support topics.
          </p>
          <button onClick={openCreateModal} className="mt-2 rounded-xl bg-[#0433FF] px-5 py-2.5 text-[14px] font-semibold text-white hover:bg-[#0433FF]/90 transition-colors shadow-lg shadow-[#0433FF]/20">
            Add your first entry
          </button>
        </div>
      )}
      {!knowledgeLoading && !knowledgeError && knowledge.length > 0 && (
        <div className="space-y-3">
          {knowledge.map((entry) => {
            const chars = entryChars(entry);
            const preview = (entry.main_content ?? entry.content ?? "").slice(
              0,
              120,
            );
            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-white/10 bg-white/5 p-4 text-[13px] transition-colors hover:bg-white/10"
              >
                {/* Mobile: stacked */}
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-white truncate text-[15px]">
                      {entry.title || "Untitled"}
                    </p>
                    <p className="mt-1 text-slate-400 line-clamp-2 leading-relaxed">
                      {preview}
                    </p>
                    <div className="mt-2.5 flex flex-wrap items-center gap-3">
                      <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[11px] font-semibold text-slate-300">
                        {templateBadge(entry.template_type)}
                      </span>
                      <span className="font-mono text-[11px] text-slate-500">
                        {chars.toLocaleString()} chars
                      </span>
                      <span className="hidden sm:inline text-[11px] text-slate-500">
                        {new Date(entry.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-shrink-0 gap-2">
                    <button
                      onClick={() => openEditModal(entry)}
                      className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-[12px] font-semibold text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteKnowledge(entry)}
                      disabled={deleteKnowledgePending}
                      className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-[12px] font-semibold text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  </motion.div>
);
