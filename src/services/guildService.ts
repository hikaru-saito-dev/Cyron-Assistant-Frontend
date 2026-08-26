import axios from "axios";
import { api } from "../lib/api";

const PLAN_USAGE_DEFAULTS: Record<
  string,
  {
    monthly_tokens_limit: number;
    daily_ticket_limit: number;
    concurrent_limit: number;
  }
> = {
  free: {
    monthly_tokens_limit: 50_000,
    daily_ticket_limit: 10,
    concurrent_limit: 1,
  },
  pro: {
    monthly_tokens_limit: 1_500_000,
    daily_ticket_limit: 50,
    concurrent_limit: 3,
  },
  business: {
    monthly_tokens_limit: 3_000_000,
    daily_ticket_limit: 100,
    concurrent_limit: 3,
  },
};

function normalizeUsageStats(
  raw: Partial<UsageStats> | null | undefined,
): UsageStats {
  const plan = String(raw?.plan || "free").toLowerCase();
  const defaults = PLAN_USAGE_DEFAULTS[plan] ?? PLAN_USAGE_DEFAULTS.free;
  const limitOr = (value: unknown, fallback: number) => {
    const n = Number(value);
    return Number.isFinite(n) && n > 0 ? n : fallback;
  };
  const usedOr = (value: unknown) => {
    const n = Number(value);
    return Number.isFinite(n) && n >= 0 ? n : 0;
  };
  return {
    guild_id: (raw?.guild_id as UsageStats["guild_id"]) ?? 0,
    plan,
    monthly_tokens_used: usedOr(raw?.monthly_tokens_used),
    monthly_tokens_limit: limitOr(
      raw?.monthly_tokens_limit,
      defaults.monthly_tokens_limit,
    ),
    daily_ticket_count: usedOr(raw?.daily_ticket_count),
    daily_ticket_limit: limitOr(
      raw?.daily_ticket_limit,
      defaults.daily_ticket_limit,
    ),
    concurrent_ai_sessions: usedOr(raw?.concurrent_ai_sessions),
    concurrent_limit: limitOr(raw?.concurrent_limit, defaults.concurrent_limit),
  };
}

export const guildService = {
  async fetchGuild(guildId: string): Promise<Guild> {
    const res = await api.get<Guild>(`/guilds/${guildId}`);
    return res.data;
  },

  async fetchUsage(guildId: string): Promise<UsageStats> {
    const res = await api.get<UsageStats>(`/guilds/${guildId}/usage`);
    return normalizeUsageStats(res.data);
  },

  async fetchUsageHistory(
    guildId: string,
    days: number,
  ): Promise<{ date: string; tokens_used: number }[]> {
    const res = await api.get<{ date: string; tokens_used: number }[]>(
      `/guilds/${guildId}/usage/history`,
      { params: { days } },
    );
    return Array.isArray(res.data) ? res.data : [];
  },

  async fetchUsageLogs(
    guildId: string,
    limit: number,
  ): Promise<
    { timestamp: string; tokens_used: number; low_confidence: boolean }[]
  > {
    const res = await api.get<
      { timestamp: string; tokens_used: number; low_confidence: boolean }[]
    >(`/guilds/${guildId}/usage/logs`, { params: { limit } });
    return Array.isArray(res.data) ? res.data : [];
  },

  async fetchUsageDashboard(guildId: string): Promise<UsageDashboard> {
    try {
      const res = await api.get<UsageDashboard>(
        `/guilds/${guildId}/usage/dashboard`,
        { params: { days: 7, limit: 10 } },
      );
      const data = res.data;
      return {
        counters: normalizeUsageStats(data?.counters),
        history: Array.isArray(data?.history) ? data.history : [],
        logs: Array.isArray(data?.logs) ? data.logs : [],
        warnings: Array.isArray(data?.warnings) ? data.warnings : [],
      };
    } catch {
      const [counters, history, logs] = await Promise.all([
        guildService.fetchUsage(guildId),
        guildService.fetchUsageHistory(guildId, 7).catch(() => []),
        guildService.fetchUsageLogs(guildId, 10).catch(() => []),
      ]);
      return { counters, history, logs, warnings: ["dashboard_fallback"] };
    }
  },

  async fetchKnowledge(guildId: string): Promise<KnowledgeEntry[]> {
    const res = await api.get<KnowledgeEntry[] | null>(
      `/guilds/${guildId}/knowledge`,
    );
    return Array.isArray(res.data) ? res.data : [];
  },

  async updateGuild(
    guildId: string,
    payload: { system_prompt?: string; embed_color?: string },
  ) {
    return api.patch(`/guilds/${guildId}`, payload);
  },

  async formatKnowledge(
    guildId: string,
    payload: { raw_text: string; template_type: string; title_hint?: string },
  ) {
    const res = await api.post<KnowledgeFormatResult>(
      `/guilds/${guildId}/knowledge/format`,
      payload,
    );
    return res.data;
  },

  async createKnowledge(
    guildId: string,
    payload: {
      title: string;
      content?: string;
      main_content?: string;
      additional_context?: string;
      behavior_notes?: string;
      template_type?: string;
      template_payload?: Record<string, unknown> | null;
      source?: string | null;
      persist_mode?: "pipeline" | "structured";
      ai_context_id?: string;
      section?: string;
    },
  ) {
    return api.post(`/guilds/${guildId}/knowledge`, payload);
  },

  async updateKnowledge(
    guildId: string,
    payload: {
      id: string;
      title?: string;
      content?: string;
      main_content?: string;
      additional_context?: string;
      behavior_notes?: string;
      template_type?: string;
      template_payload?: Record<string, unknown> | null;
      source?: string | null;
      persist_mode?: "pipeline" | "structured";
    },
  ) {
    const { id, ...body } = payload;
    return api.put(`/guilds/${guildId}/knowledge/${id}`, {
      ...body,
    });
  },

  async fetchCloseSettings(guildId: string) {
    const res = await api.get(`/guilds/${guildId}/close-settings`);
    return res.data;
  },

  async updateCloseSettings(guildId: string, payload: Record<string, unknown>) {
    const res = await api.patch(`/guilds/${guildId}/close-settings`, payload);
    return res.data;
  },

  async fetchTickets(guildId: string, params: { status?: string; page?: number; limit?: number; search?: string }) {
    const res = await api.get(`/guilds/${guildId}/tickets`, { params });
    return res.data;
  },

  async fetchTicketDetail(guildId: string, ticketId: string) {
    const res = await api.get(`/guilds/${guildId}/tickets/${ticketId}`);
    return res.data;
  },

  async deleteKnowledge(guildId: string, id: string) {
    return api.delete(`/guilds/${guildId}/knowledge/${id}`);
  },

  async fetchChannels(guildId: string): Promise<{ id: string; name: string }[]> {
    const res = await api.get<{ id: string; name: string }[]>(`/guilds/${guildId}/channels`);
    return Array.isArray(res.data) ? res.data : [];
  },

  async fetchRoles(guildId: string): Promise<{ id: string; name: string }[]> {
    const res = await api.get<{ id: string; name: string }[]>(
      `/guilds/${guildId}/roles`,
    );
    return Array.isArray(res.data) ? res.data : [];
  },

  async refreshRoles(guildId: string): Promise<void> {
    await api.post(`/guilds/${guildId}/roles/refresh`);
  },

  async refreshChannels(guildId: string): Promise<void> {
    await api.post(`/guilds/${guildId}/channels/refresh`);
  },

  async sendPanelToChannel(guildId: string, panelId: string, channelId: string): Promise<void> {
    try {
      await api.post(`/guilds/${guildId}/panels/${panelId}/send`, {
        channel_id: channelId,
      });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const detail = err.response?.data?.detail;
        const message =
          typeof detail === 'string'
            ? detail
            : Array.isArray(detail)
              ? detail.map((d) => d.msg ?? String(d)).join(', ')
              : err.message;
        throw new Error(message || 'Request failed');
      }
      throw err;
    }
  },

  // Panels
  async fetchPanels(guildId: string): Promise<Panel[]> {
    const res = await api.get<Panel[]>(`/guilds/${guildId}/panels`);
    return res.data;
  },
  async createPanel(guildId: string, payload: Omit<Panel, "id" | "guild_id">) {
    const res = await api.post<Panel>(`/guilds/${guildId}/panels`, payload);
    return res.data;
  },
  async updatePanel(
    guildId: string,
    panelId: string,
    payload: Omit<Panel, "id" | "guild_id">,
  ) {
    const res = await api.put<Panel>(
      `/guilds/${guildId}/panels/${panelId}`,
      payload,
    );
    return res.data;
  },
  async deletePanel(guildId: string, panelId: string) {
    return api.delete(`/guilds/${guildId}/panels/${panelId}`);
  },

  // AI Contexts
  async fetchContexts(guildId: string) {
    const res = await api.get(`/guilds/${guildId}/contexts`);
    return res.data;
  },
  async createContext(
    guildId: string,
    payload: { name: string; instructions?: string; general_info?: string },
  ) {
    const res = await api.post<AIContext>(
      `/guilds/${guildId}/contexts`,
      payload,
    );
    return res.data;
  },
  async updateContext(
    guildId: string,
    contextId: string,
    payload: { name: string; instructions?: string; general_info?: string },
  ) {
    const res = await api.put<AIContext>(
      `/guilds/${guildId}/contexts/${contextId}`,
      payload,
    );
    return res.data;
  },
  async deleteContext(guildId: string, contextId: string) {
    return api.delete(`/guilds/${guildId}/contexts/${contextId}`);
  },

  // General Rules (global AI context)
  async fetchGeneralRules(guildId: string): Promise<GeneralRules> {
    const res = await api.get<GeneralRules>(`/guilds/${guildId}/general-rules`);
    return res.data;
  },
  async updateGeneralRules(
    guildId: string,
    payload: {
      instructions?: string;
      general_info?: string;
      enabled?: boolean;
      settings?: Partial<AiGeneralSettings> | AiGeneralSettings;
    },
  ): Promise<GeneralRules> {
    const res = await api.put<GeneralRules>(`/guilds/${guildId}/contexts/general`, payload);
    return res.data;
  },

  async runAiDiscoveryScan(guildId: string): Promise<AiDiscoveryScanResult> {
    const res = await api.post<AiDiscoveryScanResult>(
      `/guilds/${guildId}/ai/discovery/scan`,
    );
    return res.data;
  },

  async runAiDiscoveryExtract(
    guildId: string,
    payload: ExtractInput,
  ): Promise<ExtractOutput> {
    const res = await api.post<ExtractOutput>(
      `/guilds/${guildId}/ai/discovery/extract`,
      payload,
    );
    return res.data;
  },

  async compileGeneralRules(
    guildId: string,
    payload: CompileInput,
  ): Promise<CompileOutput> {
    const res = await api.post<CompileOutput>(
      `/guilds/${guildId}/contexts/general/compile`,
      payload,
    );
    return res.data;
  },

  async quickTestGeneralRules(
    guildId: string,
    payload: QuickTestInput,
  ): Promise<QuickTestOutput> {
    const res = await api.post<QuickTestOutput>(
      `/guilds/${guildId}/contexts/general/quick-test`,
      payload,
    );
    return res.data;
  },
};
