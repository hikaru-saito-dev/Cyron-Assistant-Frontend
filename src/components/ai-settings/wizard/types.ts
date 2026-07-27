export type WizardCategory = "selling" | "saas" | "community" | "other";

export type WizardStepId =
  | "scan_results"
  | "category"
  | "sources"
  | "server"
  | "tone_language"
  | "never_say"
  | "escalation"
  | "summary";

export type TonePreset = "Professional" | "Friendly" | "Casual" | "Formal";

export type SuggestedRule = {
  id: string;
  text: string;
  suggested?: boolean;
  why?: string;
  touched?: boolean;
};

export type WizardAnswers = {
  category: WizardCategory | null;
  categoryConfirmed: boolean;
  serverDescription: string;
  serverDescriptionSuggested: boolean;
  serverDescriptionTouched: boolean;
  serverDescriptionWhy?: string;
  tone: TonePreset;
  emojisAllowed: boolean;
  languageMode: "auto" | "fixed";
  fixedLanguage: string;
  fallbackLanguage: string;
  neverRules: SuggestedRule[];
  escalationRules: SuggestedRule[];
  escalationRoleIds: string[];
  escalationRoleSuggestedIds: string[];
  escalationUsers: string[];
  // Phase 3 sources
  previousBot: string;
  transcriptChannelIds: string[];
  ticketChannelIds: string[];
  htmlFiles: { name: string; content: string }[];
  sourcesSkipped: boolean;
  extractedProblems: { problem: string; solution: string; frequency: number }[];
};

export type WizardState = {
  guildId: string;
  step: WizardStepId;
  scan: AiDiscoveryScanResult | null;
  answers: WizardAnswers;
  compiled: CompileOutput | null;
  unreviewedHighlights: string[];
  updatedAt: number;
};

export const WIZARD_STEPS: { id: WizardStepId; label: string }[] = [
  { id: "scan_results", label: "Scan" },
  { id: "category", label: "Category" },
  { id: "sources", label: "Sources" },
  { id: "server", label: "Server" },
  { id: "tone_language", label: "Tone" },
  { id: "never_say", label: "Never say" },
  { id: "escalation", label: "Escalate" },
  { id: "summary", label: "Summary" },
];

export const CATEGORY_META: Record<
  WizardCategory,
  { label: string; emoji: string; short: string }
> = {
  selling: { label: "Selling / Reselling", emoji: "🛒", short: "Selling" },
  saas: { label: "Product / SaaS", emoji: "💻", short: "SaaS" },
  community: { label: "Community", emoji: "👥", short: "Community" },
  other: { label: "Other / Custom", emoji: "⚙️", short: "Other" },
};

export const FALLBACK_LANGUAGES = [
  "English",
  "Italian",
  "Spanish",
  "French",
  "German",
  "Portuguese",
  "Dutch",
  "Polish",
  "Turkish",
  "Arabic",
];

export function createEmptyAnswers(): WizardAnswers {
  return {
    category: null,
    categoryConfirmed: false,
    serverDescription: "",
    serverDescriptionSuggested: false,
    serverDescriptionTouched: false,
    tone: "Professional",
    emojisAllowed: false,
    languageMode: "auto",
    fixedLanguage: "English",
    fallbackLanguage: "English",
    neverRules: [],
    escalationRules: [],
    escalationRoleIds: [],
    escalationRoleSuggestedIds: [],
    escalationUsers: [],
    previousBot: "ticket_tool",
    transcriptChannelIds: [],
    ticketChannelIds: [],
    htmlFiles: [],
    sourcesSkipped: false,
    extractedProblems: [],
  };
}

export function newRuleId(): string {
  return `r_${Math.random().toString(36).slice(2, 10)}`;
}
