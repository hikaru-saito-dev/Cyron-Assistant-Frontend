import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FaClock, FaPlus, FaShieldAlt, FaUserShield } from "react-icons/fa";
import { guildService } from "../../services/guildService";

type Props = {
  guildId: string;
  settings: AiGeneralSettings | null | undefined;
  enabled: boolean;
};

const DEFAULT_WARN =
  "Please keep the conversation respectful so we can help you.";
const DEFAULT_OUTSIDE =
  "Our support team is currently offline. We'll be back at {next_opening}. You can still leave your question here.";

export function GeneralAiSettingsPanel({ guildId, settings, enabled }: Props) {
  const qc = useQueryClient();
  const { data: roles = [] } = useQuery({
    queryKey: ["roles", guildId],
    queryFn: () => guildService.fetchRoles(guildId),
    enabled: !!guildId,
  });

  const [roleIds, setRoleIds] = useState<string[]>([]);
  const [roleNames, setRoleNames] = useState<string[]>([]);
  const [userIds, setUserIds] = useState<string[]>([]);
  const [rudeThreshold, setRudeThreshold] = useState("1_warning");
  const [rudeText, setRudeText] = useState(DEFAULT_WARN);
  const [outsideBehavior, setOutsideBehavior] = useState("try_resolve");
  const [outsideMsg, setOutsideMsg] = useState(DEFAULT_OUTSIDE);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!settings) return;
    setRoleIds(settings.escalation_role_ids || []);
    setRoleNames(settings.escalation_role_names || []);
    setUserIds(settings.escalation_user_ids || []);
    setRudeThreshold(settings.rude_threshold || "1_warning");
    setRudeText(settings.rude_warning_text || DEFAULT_WARN);
    setOutsideBehavior(settings.outside_hours_behavior || "try_resolve");
    setOutsideMsg(settings.outside_hours_message || DEFAULT_OUTSIDE);
  }, [settings]);

  const saveMut = useMutation({
    mutationFn: () => {
      if (roleIds.length + userIds.length < 1) {
        throw new Error("Select at least one role or user for escalation.");
      }
      return guildService.updateGeneralRules(guildId, {
        settings: {
          ...(settings || {}),
          escalation_role_ids: roleIds,
          escalation_role_names: roleNames,
          escalation_user_ids: userIds,
          rude_threshold: rudeThreshold,
          rude_warning_text: rudeText,
          outside_hours_behavior: outsideBehavior,
          outside_hours_message: outsideMsg,
        } as AiGeneralSettings,
      });
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["general-rules", guildId] });
      setError(null);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    },
    onError: (e: Error) => setError(e.message),
  });

  function toggleRole(id: string, name: string) {
    if (roleIds.includes(id)) {
      setRoleIds(roleIds.filter((x) => x !== id));
      setRoleNames(roleNames.filter((n) => n !== name));
    } else {
      setRoleIds([...roleIds, id]);
      setRoleNames([...roleNames.filter((n) => n !== name), name]);
    }
  }

  const preview = outsideMsg.replace(
    "{next_opening}",
    "09:00 (UTC) on Monday",
  );

  return (
    <section className="space-y-4 rounded-2xl border border-slate-200 p-4 sm:p-5 dark:border-slate-700">
      <div>
        <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">
          General AI settings
        </h3>
        <p className="mt-1 font-sans text-xs text-slate-500">
          Always editable. Hours stay per-panel — only the out-of-hours
          behavior is set here.
        </p>
      </div>

      {/* When it doesn't know */}
      <div className="rounded-xl border border-slate-100 p-3 dark:border-slate-800">
        <p className="mb-2 flex items-center gap-2 font-sans text-sm font-semibold text-slate-800 dark:text-slate-100">
          <FaUserShield className="text-indigo-500" />
          When it doesn&apos;t know the answer
        </p>
        <p className="mb-2 font-sans text-xs text-slate-500">
          Cyron admits it doesn&apos;t know and hands off. Choose who to ping
          (min. 1 role or user).
        </p>
        <div className="flex flex-wrap gap-2">
          {roles.length === 0 && (
            <p className="font-sans text-xs text-amber-600">
              No roles cached yet — run discovery or wait for the bot to sync.
            </p>
          )}
          {roles.map((r) => {
            const on = roleIds.includes(r.id);
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => toggleRole(r.id, r.name)}
                className={`rounded-xl border px-3 py-1.5 font-sans text-xs ${
                  on
                    ? "border-indigo-400 bg-indigo-50 text-indigo-800"
                    : "border-slate-200 text-slate-600 dark:border-slate-600"
                }`}
              >
                @{r.name}
              </button>
            );
          })}
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {userIds.map((uid) => (
            <span
              key={uid}
              className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2 py-1 font-mono text-[11px] dark:bg-slate-800"
            >
              {uid}
              <button
                type="button"
                className="text-red-500"
                onClick={() => setUserIds(userIds.filter((x) => x !== uid))}
              >
                ×
              </button>
            </span>
          ))}
          <button
            type="button"
            onClick={() => {
              const raw = window.prompt("Discord user ID to ping:");
              if (raw?.trim()) setUserIds([...userIds, raw.trim()]);
            }}
            className="inline-flex items-center gap-1 font-sans text-xs font-semibold text-indigo-600"
          >
            <FaPlus className="text-[10px]" /> Add user ID
          </button>
        </div>
      </div>

      {/* Rude users */}
      <div className="rounded-xl border border-slate-100 p-3 dark:border-slate-800">
        <p className="mb-2 flex items-center gap-2 font-sans text-sm font-semibold text-slate-800 dark:text-slate-100">
          <FaShieldAlt className="text-rose-500" />
          Rude users or spam
        </p>
        <div className="flex flex-wrap gap-2">
          {(
            [
              ["1_warning", "1 polite warning, then staff"],
              ["2_warnings", "2 warnings"],
              ["straight_staff", "Straight to staff"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setRudeThreshold(id)}
              className={`rounded-xl border px-3 py-1.5 font-sans text-xs ${
                rudeThreshold === id
                  ? "border-rose-300 bg-rose-50 text-rose-800"
                  : "border-slate-200 dark:border-slate-600"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        {rudeThreshold !== "straight_staff" && (
          <textarea
            className="mt-3 min-h-[64px] w-full rounded-xl border border-slate-200 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-900"
            value={rudeText}
            onChange={(e) => setRudeText(e.target.value)}
            placeholder={DEFAULT_WARN}
          />
        )}
      </div>

      {/* Out of hours */}
      <div className="rounded-xl border border-slate-100 p-3 dark:border-slate-800">
        <p className="mb-2 flex items-center gap-2 font-sans text-sm font-semibold text-slate-800 dark:text-slate-100">
          <FaClock className="text-amber-500" />
          Out-of-hours behavior
        </p>
        <p className="mb-2 font-sans text-xs text-slate-500">
          Hours are configured on each panel. This only controls what Cyron does
          when a panel is closed.
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setOutsideBehavior("try_resolve")}
            className={`rounded-xl border px-3 py-1.5 font-sans text-xs ${
              outsideBehavior === "try_resolve"
                ? "border-amber-300 bg-amber-50 text-amber-900"
                : "border-slate-200 dark:border-slate-600"
            }`}
          >
            Still try to resolve (default)
          </button>
          <button
            type="button"
            onClick={() => setOutsideBehavior("waiting_only")}
            className={`rounded-xl border px-3 py-1.5 font-sans text-xs ${
              outsideBehavior === "waiting_only"
                ? "border-amber-300 bg-amber-50 text-amber-900"
                : "border-slate-200 dark:border-slate-600"
            }`}
          >
            Waiting message only
          </button>
        </div>
        <textarea
          className="mt-3 min-h-[72px] w-full rounded-xl border border-slate-200 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-900"
          value={outsideMsg}
          onChange={(e) => setOutsideMsg(e.target.value)}
        />
        <p className="mt-2 font-sans text-[11px] text-slate-400">
          Preview: {preview}
        </p>
      </div>

      {error && (
        <p className="font-sans text-sm text-rose-600">{error}</p>
      )}
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          disabled={saveMut.isPending || !enabled}
          onClick={() => saveMut.mutate()}
          className="rounded-xl bg-indigo-600 px-4 py-2 font-sans text-sm font-semibold text-white disabled:opacity-50"
        >
          {saveMut.isPending ? "Saving…" : "Save general settings"}
        </button>
        {saved && (
          <span className="font-sans text-xs font-medium text-emerald-600">
            Saved — live now
          </span>
        )}
        {!enabled && (
          <span className="font-sans text-xs text-slate-400">
            Activate General Rules first to apply these at runtime.
          </span>
        )}
      </div>
    </section>
  );
}
