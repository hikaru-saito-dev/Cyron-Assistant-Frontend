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
    className="space-y-8 max-w-5xl mx-auto pb-12"
  >
    {/* Header */}
    <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <h2 className="text-white font-bold uppercase text-[2.5rem] md:text-[3.5rem] leading-[0.85] tracking-tighter" style={{ fontFamily: 'Impact, "Arial Black", sans-serif' }}>
            Knowledge Base
          </h2>
          {knowledgeLoading && <Loader />}
        </div>
        <p className="text-[14px] text-slate-400 max-w-lg leading-relaxed">
          Train your AI by adding general knowledge or specific problem-solution pairs. It uses this context to answer queries accurately.
        </p>
        
        {/* Subtle Capacity Indicator */}
        <div className="pt-2 flex items-center gap-3">
          <div className="h-1.5 w-32 rounded-full bg-white/5 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${usageRatio * 100}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className={`h-full rounded-full ${usageRatio > 0.8 ? "bg-amber-400" : "bg-white"}`}
            />
          </div>
          <span className={`font-mono text-[12px] ${usageRatio > 0.8 ? "text-amber-400" : "text-slate-500"}`}>
            {(totalChars / 1000).toFixed(1)}k / {(maxChars / 1000).toFixed(1)}k chars
          </span>
        </div>
      </div>
      
      <div className="flex items-center gap-3 shrink-0">
        <button
          type="button"
          onClick={openProblemModal}
          disabled={knowledgeLoading}
          className="rounded-full border border-white/10 bg-transparent px-5 py-2 text-[13px] font-medium text-slate-300 hover:bg-white/5 hover:text-white transition-all disabled:opacity-50"
        >
          Add Problem
        </button>
        <button
          onClick={openCreateModal}
          disabled={knowledgeLoading}
          className="rounded-full bg-white px-5 py-2 text-[13px] font-medium text-black hover:bg-slate-200 transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] disabled:opacity-50"
        >
          Add Knowledge
        </button>
      </div>
    </div>

    {/* Upgrade banner */}
    {showUpgradeBanner && (
      <div className="flex flex-col gap-4 rounded-2xl border border-[#0433FF]/30 bg-[#0433FF]/5 px-5 py-4 text-[13px] sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold text-white">
            Reached knowledge capacity for {planLabel} plan.
          </p>
          <p className="mt-1 text-slate-400">Upgrade to add more entries.</p>
        </div>
        <button className="w-full sm:w-auto rounded-full bg-[#0433FF] px-5 py-2 text-[13px] font-medium text-white hover:bg-[#0433FF]/90 transition-colors">
          Upgrade plan
        </button>
      </div>
    )}

    {/* Entries */}
    <div className="rounded-2xl border border-white/5 bg-white/[0.01] overflow-hidden">
      {knowledgeLoading && (
        <div className="divide-y divide-white/5">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-5">
              <div className="h-12 animate-pulse rounded-lg bg-white/5" />
            </div>
          ))}
        </div>
      )}
      {knowledgeError && !knowledgeLoading && (
        <div className="p-8 text-center text-[14px] text-red-400">Failed to load. Please refresh.</div>
      )}
      {!knowledgeLoading && !knowledgeError && knowledge.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <h3 className="text-[16px] font-semibold text-white">No knowledge entries yet</h3>
          <p className="max-w-sm text-[14px] text-slate-400">
            Add your first entry to teach the AI about your support topics.
          </p>
          <button onClick={openCreateModal} className="mt-4 rounded-full bg-white px-5 py-2 text-[13px] font-medium text-black hover:bg-slate-200 transition-all">
            Add your first entry
          </button>
        </div>
      )}
      {!knowledgeLoading && !knowledgeError && knowledge.length > 0 && (
        <div className="divide-y divide-white/5">
          {knowledge.map((entry) => {
            const chars = entryChars(entry);
            const preview = (entry.main_content ?? entry.content ?? "").slice(0, 120);
            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="group flex flex-col gap-4 p-5 transition-colors hover:bg-white/[0.02] sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0 flex-1 pr-4">
                  <p className="font-semibold text-white truncate text-[15px]">
                    {entry.title || "Untitled"}
                  </p>
                  <p className="mt-1 text-[13px] text-slate-400 line-clamp-1">
                    {preview}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <span className="rounded-full bg-white/5 border border-white/10 px-2.5 py-0.5 text-[11px] font-medium text-slate-300">
                      {templateBadge(entry.template_type)}
                    </span>
                    <span className="font-mono text-[11px] text-slate-500">
                      {(chars / 1000).toFixed(1)}k chars
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {new Date(entry.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openEditModal(entry)}
                    className="rounded-full bg-white/5 px-4 py-1.5 text-[12px] font-medium text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteKnowledge(entry)}
                    disabled={deleteKnowledgePending}
                    className="rounded-full bg-red-500/10 px-4 py-1.5 text-[12px] font-medium text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  </motion.div>
);
