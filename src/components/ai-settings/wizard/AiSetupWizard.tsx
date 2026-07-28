import { useCallback, useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { guildService } from "../../../services/guildService";
import { ScanResultsScreen } from "./ScanResultsScreen";
import { CategoryConfirmScreen } from "./CategoryConfirmScreen";
import { OptionalSourcesScreen } from "./OptionalSourcesScreen";
import { StepServer } from "./steps/StepServer";
import { StepToneLanguage } from "./steps/StepToneLanguage";
import { StepNeverSay } from "./steps/StepNeverSay";
import { StepEscalation } from "./steps/StepEscalation";
import { StepCategorySpecific } from "./steps/StepCategorySpecific";
import { StepChannels } from "./steps/StepChannels";
import { SummaryScreen } from "./SummaryScreen";
import { LiveTestScreen } from "./LiveTestScreen";
import {
  applyCategoryToAnswers,
  answersToCompileInput,
  clearWizardState,
  collectUnreviewed,
  loadWizardState,
  mergeExtractedProblems,
  saveWizardState,
} from "./storage";
import {
  createEmptyAnswers,
  type WizardAnswers,
  type WizardCategory,
  type WizardStepId,
} from "./types";

type Props = {
  guildId: string;
  guildName: string;
  initialScan: AiDiscoveryScanResult | null;
  onExitManual: () => void;
  onActivated: () => void;
  onCancelToWelcome: () => void;
};

export function AiSetupWizard({
  guildId,
  guildName,
  initialScan,
  onExitManual,
  onActivated,
  onCancelToWelcome,
}: Props) {
  const saved = useMemo(() => loadWizardState(guildId), [guildId]);

  const [step, setStep] = useState<WizardStepId>(
    saved?.step && saved.scan ? saved.step : "scan_results",
  );
  const [scan, setScan] = useState<AiDiscoveryScanResult | null>(
    saved?.scan ?? initialScan,
  );
  const [answers, setAnswers] = useState<WizardAnswers>(
    saved?.answers ?? createEmptyAnswers(),
  );
  const [compiled, setCompiled] = useState<CompileOutput | null>(
    saved?.compiled ?? null,
  );
  const [compiling, setCompiling] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [activating, setActivating] = useState(false);

  const { data: channels = [] } = useQuery({
    queryKey: ["channels", guildId],
    queryFn: () => guildService.fetchChannels(guildId),
    enabled: !!guildId,
  });

  useEffect(() => {
    if (!scan && initialScan) setScan(initialScan);
  }, [initialScan, scan]);

  const persist = useCallback(
    (patch: {
      step?: WizardStepId;
      answers?: WizardAnswers;
      scan?: AiDiscoveryScanResult | null;
      compiled?: CompileOutput | null;
    }) => {
      const next = {
        guildId,
        step: patch.step ?? step,
        scan: patch.scan !== undefined ? patch.scan : scan,
        answers: patch.answers ?? answers,
        compiled: patch.compiled !== undefined ? patch.compiled : compiled,
        unreviewedHighlights: collectUnreviewed(patch.answers ?? answers),
        updatedAt: Date.now(),
      };
      saveWizardState(next);
    },
    [answers, compiled, guildId, scan, step],
  );

  function go(next: WizardStepId) {
    setStep(next);
    persist({ step: next });
  }

  function patchAnswers(partial: Partial<WizardAnswers>) {
    setAnswers((prev) => {
      const next = { ...prev, ...partial };
      if (compiled) {
        setCompiled(null);
        persist({ answers: next, compiled: null });
      } else {
        persist({ answers: next });
      }
      return next;
    });
  }

  function selectCategory(category: WizardCategory) {
    setAnswers((prev) => {
      const next = applyCategoryToAnswers(prev, category, scan);
      persist({ answers: next });
      return next;
    });
  }

  function confirmCategory() {
    const cat = answers.category;
    if (!cat) return;
    setAnswers((prev) => {
      const next = applyCategoryToAnswers(
        { ...prev, categoryConfirmed: true },
        cat,
        scan,
      );
      persist({ answers: next, step: "sources" });
      return next;
    });
    go("sources");
  }

  async function runExtract() {
    setExtracting(true);
    try {
      const res = await guildService.runAiDiscoveryExtract(guildId, {
        channel_ids: answers.transcriptChannelIds,
        ticket_channel_ids: answers.ticketChannelIds,
        html_contents: answers.htmlFiles.map((f) => f.content),
        max_problems: 5,
      });
      if (res.problems?.length) {
        setAnswers((prev) => {
          const next = mergeExtractedProblems(prev, res.problems);
          persist({ answers: next });
          return next;
        });
      }
    } catch {
      /* non-blocking */
    } finally {
      setExtracting(false);
    }
  }

  async function runCompile(activate: boolean) {
    setCompiling(true);
    try {
      const roleNameById: Record<string, string> = {};
      for (const r of guildRoles) roleNameById[r.id] = r.name;
      const out = await guildService.compileGeneralRules(
        guildId,
        answersToCompileInput(answers, activate, roleNameById),
      );
      setCompiled(out);
      persist({ compiled: out });
      if (activate) {
        clearWizardState(guildId);
        onActivated();
      }
    } catch {
      /* retry */
    } finally {
      setCompiling(false);
    }
  }

  async function activateFromLiveTest() {
    setActivating(true);
    try {
      await runCompile(true);
    } finally {
      setActivating(false);
    }
  }

  const unreviewed = collectUnreviewed(answers);
  const guildRoles =
    scan?.guild_roles?.length
      ? scan.guild_roles
      : scan?.role_candidates ?? [];

  if (!scan) {
    return (
      <div className="py-10 text-center">
        <p className="font-sans text-sm text-slate-500">
          No scan data yet.{" "}
          <button
            type="button"
            className="font-medium text-indigo-600 hover:underline"
            onClick={onCancelToWelcome}
          >
            Go back
          </button>
        </p>
      </div>
    );
  }

  if (step === "scan_results") {
    return (
      <ScanResultsScreen
        scan={scan}
        guildName={guildName}
        onContinue={() => {
          if (!answers.category && scan.confidence_tier !== "low") {
            selectCategory((scan.proposed_category || "other") as WizardCategory);
          }
          go("category");
        }}
        onBack={onCancelToWelcome}
        onEscapeManual={onExitManual}
      />
    );
  }

  if (step === "category") {
    return (
      <CategoryConfirmScreen
        guildName={guildName}
        scan={scan}
        selected={answers.category}
        onSelect={selectCategory}
        onConfirm={confirmCategory}
        onBack={() => go("scan_results")}
        onEscapeManual={onExitManual}
      />
    );
  }

  if (step === "sources") {
    return (
      <OptionalSourcesScreen
        answers={answers}
        scan={scan}
        channels={channels}
        onChange={patchAnswers}
        extracting={extracting}
        onExtract={runExtract}
        onContinue={() => go("server")}
        onSkip={() => {
          patchAnswers({ sourcesSkipped: true });
          go("server");
        }}
        onBack={() => go("category")}
        onEscapeManual={onExitManual}
      />
    );
  }

  if (step === "server") {
    return (
      <StepServer
        answers={answers}
        onChange={patchAnswers}
        onContinue={() => go("tone_language")}
        onBack={() => go("sources")}
        onEscapeManual={onExitManual}
      />
    );
  }

  if (step === "tone_language") {
    return (
      <StepToneLanguage
        answers={answers}
        onChange={patchAnswers}
        onContinue={() => go("never_say")}
        onBack={() => go("server")}
        onEscapeManual={onExitManual}
      />
    );
  }

  if (step === "never_say") {
    return (
      <StepNeverSay
        answers={answers}
        onChange={patchAnswers}
        onContinue={() => go("escalation")}
        onBack={() => go("tone_language")}
        onEscapeManual={onExitManual}
      />
    );
  }

  if (step === "escalation") {
    return (
      <StepEscalation
        answers={answers}
        guildRoles={guildRoles}
        onChange={patchAnswers}
        onContinue={() => go("category_specific")}
        onBack={() => go("never_say")}
        onEscapeManual={onExitManual}
      />
    );
  }

  if (step === "category_specific") {
    return (
      <StepCategorySpecific
        answers={answers}
        guildRoles={guildRoles}
        channels={channels}
        onChange={patchAnswers}
        onContinue={() => go("channels")}
        onBack={() => go("escalation")}
        onEscapeManual={onExitManual}
      />
    );
  }

  if (step === "channels") {
    return (
      <StepChannels
        answers={answers}
        channels={channels}
        onChange={patchAnswers}
        onContinue={() => go("summary")}
        onBack={() => go("category_specific")}
        onEscapeManual={onExitManual}
      />
    );
  }

  if (step === "live_test" && compiled) {
    return (
      <LiveTestScreen
        guildId={guildId}
        answers={answers}
        compiled={compiled}
        activating={activating || compiling}
        onActivate={activateFromLiveTest}
        onBack={() => go("summary")}
        onEscapeManual={onExitManual}
      />
    );
  }

  return (
    <SummaryScreen
      answers={answers}
      compiled={compiled}
      compiling={compiling}
      unreviewed={unreviewed}
      onCompile={() => runCompile(false)}
      onContinueToLiveTest={() => go("live_test")}
      onBack={() => go("channels")}
      onEditStep={(s) => go(s)}
      onEscapeManual={onExitManual}
    />
  );
}
