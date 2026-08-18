import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FaLink, FaPlus, FaTrash } from "react-icons/fa";
import { guildService } from "../../services/guildService";
import { CHANNEL_PURPOSES } from "./wizard/categoryTypes";
import { ChannelPicker } from "./wizard/shared/ChannelPicker";
import { newRuleId } from "./wizard/types";

type Row = {
  id: string;
  purpose: string;
  purposeCustom: string;
  channelId: string;
  channelName: string;
};

type Props = {
  guildId: string;
  settings: AiGeneralSettings | null | undefined;
  enabled: boolean;
};

export function LinkableChannelsEditor({ guildId, settings, enabled }: Props) {
  const qc = useQueryClient();
  const { data: channels = [] } = useQuery({
    queryKey: ["channels", guildId],
    queryFn: () => guildService.fetchChannels(guildId),
    enabled: !!guildId && enabled,
  });

  const [rows, setRows] = useState<Row[]>([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const existing = settings?.linkable_channels || [];
    setRows(
      existing.map((c) => ({
        id: newRuleId(),
        purpose: c.purpose || "Other",
        purposeCustom: c.purposeCustom || "",
        channelId: c.channelId || "",
        channelName: c.channelName || "",
      })),
    );
  }, [settings]);

  const saveMut = useMutation({
    mutationFn: async () => {
      const linkable_channels = rows
        .filter((r) => r.channelId)
        .map(({ purpose, purposeCustom, channelId, channelName }) => ({
          purpose,
          purposeCustom,
          channelId,
          channelName,
        }));

      // Also sync a Channels section into general_info via payments-style patch
      const lines = linkable_channels.map((c) => {
        const purpose =
          c.purpose === "Other" ? c.purposeCustom || "Other" : c.purpose;
        return `${purpose} → <#${c.channelId}>`;
      });
      const gr = await guildService.fetchGeneralRules(guildId);
      let info = gr.general_info || "";
      const marker = "## Linkable channels";
      const block = lines.length
        ? `${marker}\n${lines.map((l) => `- ${l}`).join("\n")}`
        : "";
      if (info.includes(marker)) {
        const parts = info.split(marker);
        const before = parts[0].trimEnd();
        const rest = parts[1] || "";
        const next = rest.indexOf("\n## ");
        const after = next >= 0 ? rest.slice(next).trim() : "";
        info = [before, block, after].filter(Boolean).join("\n\n");
      } else if (block) {
        info = info ? `${info}\n\n${block}` : block;
      }

      return guildService.updateGeneralRules(guildId, {
        general_info: info,
        settings: {
          ...(settings || {}),
          linkable_channels,
        } as AiGeneralSettings,
      });
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["general-rules", guildId] });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    },
  });

  if (!enabled) return null;

  return (
    <section className="rounded-2xl bg-black p-4 dark:bg-black">
      <h3 className="flex items-center gap-2 font-display text-sm font-bold text-slate-900 dark:text-white">
        <FaLink className="text-indigo-500" />
        Linkable channels
      </h3>
      <p className="mt-1 font-sans text-xs text-slate-500">
        Cyron may only mention channels listed here. Deleted channels are
        flagged.
      </p>

      <div className="mt-3 space-y-2">
        {rows.map((row, i) => {
          const missing =
            row.channelId && !channels.some((c) => c.id === row.channelId);
          return (
            <div
              key={row.id}
              className="grid gap-2 rounded-xl border border-slate-200 p-2 sm:grid-cols-[1fr_1fr_auto] dark:border-slate-700"
            >
              <select
                className="rounded-lg border border-slate-200 px-2 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
                value={row.purpose}
                onChange={(e) => {
                  const next = [...rows];
                  next[i] = { ...row, purpose: e.target.value };
                  setRows(next);
                }}
              >
                {CHANNEL_PURPOSES.map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
              <div>
                <ChannelPicker
                  channels={channels}
                  value={row.channelId}
                  onChange={(id, name) => {
                    const next = [...rows];
                    next[i] = { ...row, channelId: id, channelName: name };
                    setRows(next);
                  }}
                />
                {missing && (
                  <p className="mt-1 font-sans text-[11px] font-medium text-amber-600">
                    Channel no longer exists
                  </p>
                )}
              </div>
              <button
                type="button"
                className="text-red-500"
                onClick={() => setRows(rows.filter((_, j) => j !== i))}
              >
                <FaTrash className="text-xs" />
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() =>
            setRows([
              ...rows,
              {
                id: newRuleId(),
                purpose: "Announcements",
                purposeCustom: "",
                channelId: "",
                channelName: "",
              },
            ])
          }
          className="inline-flex items-center gap-1 font-sans text-xs font-semibold text-indigo-600"
        >
          <FaPlus className="text-[10px]" /> Add channel
        </button>
        <button
          type="button"
          disabled={saveMut.isPending}
          onClick={() => saveMut.mutate()}
          className="rounded-xl bg-[#0433FF] hover:bg-[#0433FF]/90 transition-colors px-3 py-1.5 font-sans text-xs font-semibold text-white disabled:opacity-50"
        >
          {saveMut.isPending ? "Saving…" : "Save channels"}
        </button>
        {saved && (
          <span className="font-sans text-xs text-emerald-600">Saved</span>
        )}
      </div>
    </section>
  );
}
