// Guild & usage domain (module exports for explicit imports)

interface Guild {
  id: number;
  name: string;
  plan: string;
  system_prompt: string;
  embed_color: string | null;
  icon_url?: string | null;
  has_bot?: boolean;
}

interface UsageStats {
  guild_id: number | string;
  plan: string;
  monthly_tokens_used: number;
  monthly_tokens_limit: number;
  daily_ticket_count: number;
  daily_ticket_limit: number;
  concurrent_ai_sessions: number;
  concurrent_limit: number;
}

interface UsageDashboard {
  counters: UsageStats;
  history: { date: string; tokens_used: number }[];
  logs: { timestamp: string; tokens_used: number; low_confidence: boolean }[];
  warnings: string[];
}

interface KnowledgeEntry {
  id: string;
  guild_id: number;
  title: string;
  content: string;
  main_content?: string | null;
  additional_context?: string | null;
  behavior_notes?: string | null;
  template_type?: string | null;
  template_payload?: Record<string, unknown> | null;
  source?: string | null;
  ai_context_id?: string | null;
  section?: string | null;
  created_at: string;
}


