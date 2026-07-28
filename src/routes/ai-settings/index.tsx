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
    <div className="space-y-6 px-1 sm:px-0">
      <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-indigo-50 to-violet-50 p-5 shadow-soft sm:p-8 dark:border-slate-700 dark:bg-none dark:bg-slate-900">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="flex items-center gap-2.5 font-display text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-white">
              <FaRobot className="text-indigo-500" />
              AI Settings
            </h1>
            <p className="mt-1 font-sans text-sm text-slate-600 dark:text-slate-400">
              Configure General Rules and server-wide AI behavior.
            </p>
          </div>
          {isActive && (
            <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 font-sans text-xs font-semibold text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300">
              AI active — AI Contexts unlocked
            </span>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-7 dark:border-slate-700 dark:bg-slate-900">
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
          <div className="space-y-6">
            <div className="rounded-xl border border-slate-100 bg-slate-50/80 px-3 py-2 sm:hidden dark:border-slate-800 dark:bg-slate-800/40">
              <p className="font-sans text-[11px] text-slate-500">
                Scroll for Payments, General Rules, and Quick Test. Edits go live
                on save.
              </p>
            </div>
            {!isActive && (
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-indigo-200 bg-indigo-50/60 px-4 py-3 dark:border-indigo-500/30 dark:bg-indigo-500/10">
                <p className="font-sans text-xs text-indigo-800 dark:text-indigo-300">
                  Prefer the guided setup?
                </p>
                <button
                  type="button"
                  onClick={() => setViewMode("welcome")}
                  className="rounded-xl bg-indigo-600 px-3 py-1.5 font-sans text-xs font-semibold text-white"
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

            <p className="border-t border-slate-100 pt-4 font-sans text-xs text-slate-400 dark:border-slate-800">
              Advanced:{" "}
              <Link
                to={`/guilds/${guildId}/settings`}
                className="font-medium text-indigo-600 hover:underline dark:text-indigo-400"
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
