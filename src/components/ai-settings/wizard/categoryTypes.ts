/** Category-specific wizard field types (Step 6). */

export type ProblemSolutionRow = {
  id: string;
  problem: string;
  solution: string;
  suggested?: boolean;
  why?: string;
  touched?: boolean;
};

export type CryptoRow = {
  id: string;
  coin: string;
  network: string;
  address: string;
};

export type PaymentsData = {
  paypal: boolean;
  paypalEmail: string;
  paypalType: "fnf" | "gs" | "both";
  crypto: boolean;
  cryptoRows: CryptoRow[];
  card: boolean;
  cardLink: string;
  bank: boolean;
  bankHolder: string;
  bankIban: string;
  paysafecard: boolean;
  paysafecardInstructions: string;
  other: boolean;
  otherName: string;
  otherInstructions: string;
};

export type PartnershipData = {
  enabled: boolean;
  suggested?: boolean;
  why?: string;
  requirements: string;
  evaluatorRoleIds: string[];
  provide: string[]; // link | description | numbers
};

export type LinkableChannel = {
  id: string;
  purpose: string;
  purposeCustom: string;
  channelId: string;
  channelName: string;
  suggested?: boolean;
  why?: string;
};

export type SellingData = {
  products: string[];
  delivery: "automatic" | "manual" | "depends" | "";
  deliveryMaxTime: string;
  payments: PaymentsData;
  refundPolicy: "none" | "broken" | "within_n" | "case_by_case";
  refundExceptions: string;
  refundWithin: string;
  refundProof: string[];
  refundDays: string;
  refundConditions: string;
  refundCaseExplain: string;
  refundIssue: string[];
  warrantyEnabled: boolean;
  warrantyCovers: string[];
  warrantyDuration: string;
  warrantyProvide: string[];
  warrantyExclusions: string;
  warrantyNoLine: string;
  pricesMode: "link" | "defer";
  pricesChannelId: string;
  pricesChannelName: string;
  pricesUrl: string;
  problems: ProblemSolutionRow[];
  partnership: PartnershipData;
  autonomy: string[];
};

export type SaasData = {
  productType: string;
  pricingModel: "free" | "paid" | "freemium" | "";
  resources: { id: string; label: string; url: string }[];
  bugTriage: string[];
  problems: ProblemSolutionRow[];
  billingMode: "staff_only" | "simple_guide";
  billingLink: string;
  featureRequests: "channel" | "ticket" | "not_accepted";
  featureChannelId: string;
  featureChannelName: string;
  partnership: PartnershipData;
  autonomy: string[];
};

export type CommunityData = {
  routing: string[];
  reportCollect: string[];
  reportConfidential: boolean;
  requestableRoles: { id: string; roleId: string; roleName: string; requirement: string }[];
  appealDeciderRoleIds: string[];
  appealInclude: string[];
  rulesEnabled: boolean;
  rulesText: string;
  rulesChannelId: string;
  rulesChannelName: string;
  disputesMode: "straight_staff" | "collect_then_staff";
  partnership: PartnershipData;
  autonomy: string[];
};

export type OtherData = {
  routing: string[];
  problems: ProblemSolutionRow[];
  payments: PaymentsData;
  partnership: PartnershipData;
  autonomy: string[];
};

export function emptyPayments(): PaymentsData {
  return {
    paypal: false,
    paypalEmail: "",
    paypalType: "both",
    crypto: false,
    cryptoRows: [],
    card: false,
    cardLink: "",
    bank: false,
    bankHolder: "",
    bankIban: "",
    paysafecard: false,
    paysafecardInstructions: "",
    other: false,
    otherName: "",
    otherInstructions: "",
  };
}

export function emptyPartnership(suggested = false, why?: string): PartnershipData {
  return {
    enabled: suggested,
    suggested,
    why,
    requirements: "",
    evaluatorRoleIds: [],
    provide: ["link", "description"],
  };
}

export function emptySelling(partnership?: PartnershipData): SellingData {
  return {
    products: [],
    delivery: "",
    deliveryMaxTime: "24h",
    payments: emptyPayments(),
    refundPolicy: "case_by_case",
    refundExceptions: "",
    refundWithin: "7d",
    refundProof: ["screenshot"],
    refundDays: "7",
    refundConditions: "",
    refundCaseExplain: "",
    refundIssue: ["same_method"],
    warrantyEnabled: false,
    warrantyCovers: [],
    warrantyDuration: "30d",
    warrantyProvide: ["order ID"],
    warrantyExclusions: "",
    warrantyNoLine: "We do not offer warranty replacements on this server.",
    pricesMode: "defer",
    pricesChannelId: "",
    pricesChannelName: "",
    pricesUrl: "",
    problems: [],
    partnership: partnership ?? emptyPartnership(),
    autonomy: ["explain_purchasing", "reassure_delivery"],
  };
}

export function emptySaas(partnership?: PartnershipData): SaasData {
  return {
    productType: "",
    pricingModel: "",
    resources: [],
    bugTriage: ["steps", "screenshot", "error_message"],
    problems: [],
    billingMode: "staff_only",
    billingLink: "",
    featureRequests: "ticket",
    featureChannelId: "",
    featureChannelName: "",
    partnership: partnership ?? emptyPartnership(),
    autonomy: ["answer_docs", "known_solutions", "bug_triage"],
  };
}

export function emptyCommunity(partnership?: PartnershipData): CommunityData {
  return {
    routing: [],
    reportCollect: ["reported_user", "what_happened", "evidence"],
    reportConfidential: true,
    requestableRoles: [],
    appealDeciderRoleIds: [],
    appealInclude: ["reason", "context"],
    rulesEnabled: false,
    rulesText: "",
    rulesChannelId: "",
    rulesChannelName: "",
    disputesMode: "straight_staff",
    partnership: partnership ?? emptyPartnership(),
    autonomy: ["rules", "role_requirements", "complete_reports"],
  };
}

export function emptyOther(partnership?: PartnershipData): OtherData {
  return {
    routing: [],
    problems: [],
    payments: emptyPayments(),
    partnership: partnership ?? emptyPartnership(),
    autonomy: ["faq", "collect_info"],
  };
}

export const SELL_PRODUCTS = [
  "Subscriptions/accounts",
  "Keys and licenses",
  "Digital products",
  "Services",
  "Physical products",
  "Other",
];

export const DELIVERY_TIMES = ["1h", "6h", "12h", "24h", "48h", "more than 48h"];

export const CRYPTO_COINS = ["USDT", "BTC", "ETH", "SOL", "LTC", "Other"];
export const CRYPTO_NETWORKS: Record<string, string[]> = {
  USDT: ["TRC20", "ERC20", "SOL", "BEP20"],
  BTC: ["Bitcoin"],
  ETH: ["ERC20"],
  SOL: ["SOL"],
  LTC: ["Litecoin"],
  Other: ["Other"],
};

export const CHANNEL_PURPOSES = [
  "Price list",
  "Feedback/vouch",
  "Announcements",
  "Rules",
  "Feature requests",
  "Service status",
  "Other",
];

export const LIVE_TEST_PROMPTS: Record<string, string[]> = {
  selling: [
    "I paid but received nothing",
    "I want a refund",
    "I want to speak to a human",
  ],
  saas: [
    "The app is broken, it doesn't work",
    "How do I do X?",
    "I want a human",
  ],
  community: [
    "I want to report a user",
    "What are the server rules?",
    "I want a human",
  ],
  other: [
    "I have a question",
    "I have a problem",
    "I want a human",
  ],
};
