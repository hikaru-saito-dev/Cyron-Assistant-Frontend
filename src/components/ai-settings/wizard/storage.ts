import type {
  SuggestedRule,
  WizardAnswers,
  WizardCategory,
  WizardState,
} from "./types";
import { createEmptyAnswers, newRuleId } from "./types";

const PREFIX = "cyron_ai_wizard:";

export function wizardStorageKey(guildId: string): string {
  return `${PREFIX}${guildId}`;
}

export function loadWizardState(guildId: string): WizardState | null {
  try {
    const raw = localStorage.getItem(wizardStorageKey(guildId));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as WizardState;
    if (!parsed || parsed.guildId !== guildId) return null;
    return {
      ...parsed,
      answers: { ...createEmptyAnswers(), ...parsed.answers },
    };
  } catch {
    return null;
  }
}

export function saveWizardState(state: WizardState): void {
  try {
    localStorage.setItem(
      wizardStorageKey(state.guildId),
      JSON.stringify({ ...state, updatedAt: Date.now() }),
    );
  } catch {
    /* ignore quota */
  }
}

export function clearWizardState(guildId: string): void {
  try {
    localStorage.removeItem(wizardStorageKey(guildId));
  } catch {
    /* ignore */
  }
}

export function buildNeverProposals(
  category: WizardCategory,
  scan: AiDiscoveryScanResult | null,
): SuggestedRule[] {
  const sellingSignal =
    (scan?.classified_channels?.selling?.length ?? 0) > 0 ||
    (scan?.signals ?? []).some((s) => /selling|listino|price|shop/i.test(s));
  const hasListino = (scan?.signals ?? []).some((s) =>
    /listino|price|pricing/i.test(s),
  );

  if (category === "selling") {
    const rules: SuggestedRule[] = [];
    if (hasListino || sellingSignal) {
      rules.push({
        id: newRuleId(),
        text: "Never state prices different from the price list",
        suggested: true,
        why: hasListino ? "found #listino / pricing channel" : "you sell products",
        touched: false,
      });
    }
    rules.push({
      id: newRuleId(),
      text: "Never promise refunds or discounts without approval",
      suggested: true,
      why: "you sell products",
      touched: false,
    });
    return rules;
  }

  if (category === "community") {
    return [
      {
        id: newRuleId(),
        text: "Never take sides in disputes between members",
        suggested: true,
        why: "community server",
        touched: false,
      },
      {
        id: newRuleId(),
        text: "Never reveal who filed a report",
        suggested: true,
        why: "community server",
        touched: false,
      },
    ];
  }

  if (category === "saas") {
    return [
      {
        id: newRuleId(),
        text: "Never promise feature release dates not in the official changelog",
        suggested: true,
        why: "product / SaaS signals",
        touched: false,
      },
      {
        id: newRuleId(),
        text: "Never invent information",
        suggested: true,
        why: "universal safety",
        touched: false,
      },
    ];
  }

  // other / low confidence — universal only
  return [
    {
      id: newRuleId(),
      text: "Never make legal, medical or financial promises",
      suggested: true,
      why: "I didn't find enough to propose more",
      touched: false,
    },
    {
      id: newRuleId(),
      text: "Never invent information",
      suggested: true,
      why: "universal safety",
      touched: false,
    },
  ];
}

export function buildEscalationProposals(
  category: WizardCategory,
): SuggestedRule[] {
  const common: SuggestedRule[] = [
    {
      id: newRuleId(),
      text: "Explicitly asks for a person",
      suggested: true,
      why: "common escalation",
      touched: false,
    },
    {
      id: newRuleId(),
      text: "Insults or provokes",
      suggested: true,
      why: "common escalation",
      touched: false,
    },
    {
      id: newRuleId(),
      text: "Cyron isn't sure of the answer",
      suggested: true,
      why: "common escalation",
      touched: false,
    },
  ];

  if (category === "selling") {
    common.push({
      id: newRuleId(),
      text: "The request involves money: refunds, payments, disputes",
      suggested: true,
      why: "selling category",
      touched: false,
    });
  }
  if (category === "community") {
    common.push({
      id: newRuleId(),
      text: "Reports or appeals against sanctions",
      suggested: true,
      why: "community category",
      touched: false,
    });
  }
  return common;
}

export function applyCategoryToAnswers(
  answers: WizardAnswers,
  category: WizardCategory,
  scan: AiDiscoveryScanResult | null,
): WizardAnswers {
  const topRole = scan?.role_candidates?.[0];
  const suggestedRoleIds = topRole ? [topRole.id] : [];

  let serverDescription = answers.serverDescription;
  let serverDescriptionSuggested = answers.serverDescriptionSuggested;
  let serverDescriptionWhy = answers.serverDescriptionWhy;
  if (!answers.serverDescriptionTouched) {
    const draft = scan?.description_draft?.trim() || "";
    if (draft) {
      serverDescription = draft;
      serverDescriptionSuggested = true;
      serverDescriptionWhy = "from server name + panels";
    }
  }

  return {
    ...answers,
    category,
    neverRules: buildNeverProposals(category, scan),
    escalationRules: buildEscalationProposals(category),
    escalationRoleIds:
      answers.escalationRoleIds.length > 0
        ? answers.escalationRoleIds
        : suggestedRoleIds,
    escalationRoleSuggestedIds: suggestedRoleIds,
    serverDescription,
    serverDescriptionSuggested,
    serverDescriptionWhy,
  };
}

export function answersToCompileInput(
  answers: WizardAnswers,
  activate = false,
  roleNameById?: Record<string, string>,
): CompileInput {
  return {
    category: answers.category ?? "other",
    server_description: answers.serverDescription.trim() || undefined,
    tone: answers.tone,
    emojis_allowed: answers.emojisAllowed,
    language_mode: answers.languageMode,
    fixed_language:
      answers.languageMode === "fixed" ? answers.fixedLanguage : undefined,
    fallback_language: answers.fallbackLanguage,
    never_rules: answers.neverRules.map((r) => r.text).filter(Boolean),
    escalation_rules: answers.escalationRules.map((r) => r.text).filter(Boolean),
    escalation_roles: answers.escalationRoleIds.map(
      (id) => roleNameById?.[id] || id,
    ),
    problem_solutions: answers.extractedProblems.map((p) => ({
      problem: p.problem,
      solution: p.solution,
    })),
    activate,
  };
}

export function collectUnreviewed(answers: WizardAnswers): string[] {
  const items: string[] = [];
  if (answers.serverDescriptionSuggested && !answers.serverDescriptionTouched) {
    items.push("Server description (✨ suggested, not reviewed)");
  }
  for (const r of answers.neverRules) {
    if (r.suggested && !r.touched) {
      items.push(`Never-say: “${r.text}”`);
    }
  }
  for (const r of answers.escalationRules) {
    if (r.suggested && !r.touched) {
      items.push(`Escalation: “${r.text}”`);
    }
  }
  return items;
}
