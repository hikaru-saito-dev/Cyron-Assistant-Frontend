import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FaRobot } from "react-icons/fa";
import { guildService } from "../../services/guildService";
import { GeneralRulesEditor } from "../../components/ai-settings/GeneralRulesEditor";
import { Phase0Welcome } from "../../components/ai-settings/Phase0Welcome";
import { ScanProgress } from "../../components/ai-settings/ScanProgress";
import { AiSetupWizard } from "../../components/ai-settings/wizard/AiSetupWizard";
import { PaymentsShortcut } from "../../components/ai-settings/PaymentsShortcut";
import { GeneralAiSettingsPanel } from "../../components/ai-settings/GeneralAiSettingsPanel";
import { PostActivationActions } from "../../components/ai-settings/PostActivationActions";
import { LinkableChannelsEditor } from "../../components/ai-settings/LinkableChannelsEditor";
import { QuickTestPanel } from "../../components/ai-settings/QuickTestPanel";
import {
  clearWizardState,
  loadWizardState,
} from "../../components/ai-settings/wizard/storage";
import { PageLoader } from "../../components/ui/Skeleton";

type ViewMode = "welcome" | "scanning" | "wizard" | "editor";

export function AiSettings() {
  const { guildId } = useParams<{ guildId: string }>();
  const qc = useQueryClient();
  const [viewMode, setViewMode] = useState<ViewMode | null>(null);
  const [scanResult, setScanResult] = useState<AiDiscoveryScanResult | null>(
    null,
  );

  const { data: guild } = useQuery({
    queryKey: ["guild", guildId],
    queryFn: () => guildService.fetchGuild(guildId!),
    enabled: !!guildId,
  });

  const { data: generalRules, isLoading: generalLoading } = useQuery({
    queryKey: ["general-rules", guildId],
    queryFn: () => guildService.fetchGeneralRules(guildId!),
    enabled: !!guildId,
  });

  const { data: knowledge = [], isLoading: knowledgeLoading } = useQuery({
    queryKey: ["knowledge", guildId],
    queryFn: () => guildService.fetchKnowledge(guildId!),
    enabled: !!guildId,
  });

  useEffect(() => {
    if (!guildId || generalLoading) return;
    if (generalRules?.enabled) return;
    const saved = loadWizardState(guildId);
    if (saved?.scan && saved.step) {
      setScanResult(saved.scan);
      setViewMode("wizard");
    }
  }, [guildId, generalLoading, generalRules?.enabled]);

  const effectiveView: ViewMode = (() => {
    if (viewMode) return viewMode;
    if (generalLoading) return "editor";
    return generalRules?.enabled ? "editor" : "welcome";
  })();

  async function handleAnalyze() {
    if (!guildId) return;
    setViewMode("scanning");
    setScanResult(null);
    try {
      const result = await guildService.runAiDiscoveryScan(guildId);
      setScanResult(result);
      setViewMode("wizard");
    } catch {
      setScanResult(null);
      setViewMode("editor");
    }
  }

  function handleSkip() {
    if (guildId) clearWizardState(guildId);
    setViewMode("editor");
  }

  function handleReconfigure() {
    if (!guildId) return;
    clearWizardState(guildId);
    setScanResult(null);
    setViewMode("welcome");
  }

  if (!guildId) return null;
  if (generalLoading && !generalRules) {
    return <PageLoader label="Loading AI settings…" />;
  }

  const isActive = !!generalRules?.enabled;

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto w-full space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-2">
        <div>
          <h1 className="flex items-center gap-2.5 text-2xl font-bold tracking-tight text-white">
            <FaRobot className="text-[#0433FF]" />
            AI Settings
          </h1>
          <p className="mt-1 text-[14px] text-slate-400">
            Configure General Rules and server-wide AI behavior.
          </p>
        </div>
        {isActive && (
          <span className="inline-flex items-center rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 text-[13px] font-semibold text-emerald-400">
            AI active — AI Contexts unlocked
          </span>
        )}
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8">
        {effectiveView === "welcome" && (
          <Phase0Welcome onAnalyze={handleAnalyze} onSkip={handleSkip} />
        )}

        {effectiveView === "scanning" && <ScanProgress active />}

        {effectiveView === "wizard" && (
          <AiSetupWizard
            guildId={guildId}
            guildName={guild?.name || "your server"}
            initialScan={scanResult}
            onExitManual={() => {
              setViewMode("editor");
            }}
            onCancelToWelcome={() => {
              clearWizardState(guildId);
              setScanResult(null);
              setViewMode("welcome");
            }}
            onActivated={() => {
              void qc.invalidateQueries({ queryKey: ["general-rules", guildId] });
              void qc.invalidateQueries({ queryKey: ["knowledge", guildId] });
              setViewMode("editor");
            }}
          />
        )}

        {effectiveView === "editor" && (
          <div className="space-y-8">
            <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 sm:hidden">
              <p className="text-[12px] text-slate-400">
                Scroll for Payments, General Rules, and Quick Test. Edits go live
                on save.
              </p>
            </div>
            {!isActive && (
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#0433FF]/30 bg-[#0433FF]/10 px-5 py-4">
                <p className="text-[14px] font-semibold text-[#0433FF]">
                  Prefer the guided setup?
                </p>
                <button
                  type="button"
                  onClick={() => setViewMode("welcome")}
                  className="rounded-xl bg-[#0433FF] px-4 py-2 text-[13px] font-semibold text-white hover:bg-[#0433FF]/90 transition-colors shadow-lg shadow-[#0433FF]/20"
                >
                  Open wizard
                </button>
              </div>
            )}

            {isActive && (
              <>
                <PaymentsShortcut
                  guildId={guildId}
                  settings={generalRules?.settings}
                  enabled
                />
                <LinkableChannelsEditor
                  guildId={guildId}
                  settings={generalRules?.settings}
                  enabled
                />
                <PostActivationActions
                  guildId={guildId}
                  contextId={generalRules?.id}
                  enabled
                  onReconfigure={handleReconfigure}
                />
              </>
            )}

            <GeneralRulesEditor
              guildId={guildId}
              generalRules={generalRules}
              generalLoading={generalLoading}
              knowledge={knowledge}
              knowledgeLoading={knowledgeLoading}
              lockDisable={isActive}
              onEnabledChange={(enabled) => {
                if (enabled) setViewMode("editor");
              }}
            />

            <GeneralAiSettingsPanel
              guildId={guildId}
              settings={generalRules?.settings}
              enabled={isActive}
            />

            {isActive && (
              <QuickTestPanel guildId={guildId} enabled />
            )}

            <p className="border-t border-white/10 pt-5 text-[13px] text-slate-500">
              Advanced:{" "}
              <Link
                to={`/guilds/${guildId}/settings`}
                className="font-medium text-[#0433FF] hover:underline"
              >
                Legacy system prompt &amp; knowledge settings
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
