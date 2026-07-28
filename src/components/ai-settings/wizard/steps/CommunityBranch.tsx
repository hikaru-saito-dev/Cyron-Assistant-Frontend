import { FaPlus, FaTrash } from "react-icons/fa";
import type { CommunityData } from "../categoryTypes";
import { newRuleId } from "../types";
import { PartnershipBlock } from "../shared/PartnershipBlock";
import { ChannelPicker } from "../shared/ChannelPicker";
import { SuggestedBadge } from "../SuggestedBadge";
import { ChipMulti, ChipSingle, SectionCard } from "./categoryUi";

type Role = { id: string; name: string };
type Channel = { id: string; name: string };

type Props = {
  data: CommunityData;
  roles: Role[];
  channels: Channel[];
  onChange: (data: CommunityData) => void;
};

const ROUTING = [
  "Report users",
  "Request roles",
  "Ban/warn appeals",
  "Questions about rules",
  "Partnership",
  "Generic support",
];

export function CommunityBranch({ data, roles, channels, onChange }: Props) {
  const forcePartner = data.routing.includes("Partnership");

  return (
    <div className="space-y-5">
      <SectionCard title="C1 — What do members open tickets for?" required>
        <ChipMulti
          options={ROUTING}
          values={data.routing}
          onChange={(routing) => onChange({ ...data, routing })}
        />
      </SectionCard>

      {data.routing.includes("Report users") && (
        <SectionCard title="C2 — Reports">
          <ChipMulti
            label="What to collect"
            options={[
              { id: "reported_user", label: "Reported user" },
              { id: "what_happened", label: "What happened" },
              { id: "evidence", label: "Evidence" },
              { id: "channel", label: "Channel" },
              { id: "witnesses", label: "Witnesses" },
            ]}
            values={data.reportCollect}
            onChange={(reportCollect) => onChange({ ...data, reportCollect })}
          />
          <label className="mt-3 flex items-center gap-2 font-sans text-sm">
            <input
              type="checkbox"
              checked={data.reportConfidential}
              onChange={(e) =>
                onChange({ ...data, reportConfidential: e.target.checked })
              }
            />
            Keep reporter confidential
          </label>
        </SectionCard>
      )}

      {data.routing.includes("Request roles") && (
        <SectionCard title="C3 — Requestable roles">
          {data.requestableRoles.map((row, i) => (
            <div
              key={row.id}
              className="mb-2 grid gap-2 rounded-xl border border-slate-200 p-2 sm:grid-cols-[1fr_1fr_auto] dark:border-slate-600"
            >
              <select
                className="rounded-lg border border-slate-200 px-2 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
                value={row.roleId}
                onChange={(e) => {
                  const role = roles.find((r) => r.id === e.target.value);
                  const next = [...data.requestableRoles];
                  next[i] = {
                    ...row,
                    roleId: e.target.value,
                    roleName: role?.name || "",
                  };
                  onChange({ ...data, requestableRoles: next });
                }}
              >
                <option value="">Select role…</option>
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>
                    @{r.name}
                  </option>
                ))}
              </select>
              <input
                className="rounded-lg border border-slate-200 px-2 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
                placeholder="Requirement"
                value={row.requirement}
                onChange={(e) => {
                  const next = [...data.requestableRoles];
                  next[i] = { ...row, requirement: e.target.value };
                  onChange({ ...data, requestableRoles: next });
                }}
              />
              <button
                type="button"
                className="text-red-500"
                onClick={() =>
                  onChange({
                    ...data,
                    requestableRoles: data.requestableRoles.filter(
                      (_, j) => j !== i,
                    ),
                  })
                }
              >
                <FaTrash className="text-xs" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              onChange({
                ...data,
                requestableRoles: [
                  ...data.requestableRoles,
                  {
                    id: newRuleId(),
                    roleId: "",
                    roleName: "",
                    requirement: "",
                  },
                ],
              })
            }
            className="inline-flex items-center gap-1 font-sans text-xs font-semibold text-indigo-600"
          >
            <FaPlus className="text-[10px]" /> Add role
          </button>
        </SectionCard>
      )}

      {data.routing.includes("Ban/warn appeals") && (
        <SectionCard title="C4 — Appeals">
          <p className="mb-1 font-sans text-xs text-slate-500">Who decides?</p>
          <div className="mb-3 flex flex-wrap gap-2">
            {roles.map((r) => {
              const on = data.appealDeciderRoleIds.includes(r.id);
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() =>
                    onChange({
                      ...data,
                      appealDeciderRoleIds: on
                        ? data.appealDeciderRoleIds.filter((x) => x !== r.id)
                        : [...data.appealDeciderRoleIds, r.id],
                    })
                  }
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
          <ChipMulti
            label="What must the appeal include?"
            options={[
              { id: "reason", label: "Reason" },
              { id: "context", label: "Context" },
              { id: "apology", label: "Apology" },
              { id: "evidence", label: "Evidence" },
            ]}
            values={data.appealInclude}
            onChange={(appealInclude) => onChange({ ...data, appealInclude })}
          />
        </SectionCard>
      )}

      {(data.routing.includes("Questions about rules") ||
        data.rulesEnabled) && (
        <SectionCard title="C5 — Server rules">
          {data.rulesChannelId && (
            <div className="mb-2">
              <SuggestedBadge why="scan found a rules channel" />
            </div>
          )}
          <label className="flex items-center gap-2 font-sans text-sm">
            <input
              type="checkbox"
              checked={data.rulesEnabled}
              onChange={(e) =>
                onChange({ ...data, rulesEnabled: e.target.checked })
              }
            />
            Provide server rules for Cyron
          </label>
          {(data.rulesEnabled ||
            data.routing.includes("Questions about rules")) && (
            <div className="mt-3 space-y-2">
              <textarea
                className="min-h-[100px] w-full rounded-xl border border-slate-200 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
                placeholder="Paste rules text…"
                value={data.rulesText}
                onChange={(e) =>
                  onChange({
                    ...data,
                    rulesText: e.target.value,
                    rulesEnabled: true,
                  })
                }
              />
              <ChannelPicker
                channels={channels}
                value={data.rulesChannelId}
                onChange={(id, name) =>
                  onChange({
                    ...data,
                    rulesChannelId: id,
                    rulesChannelName: name,
                    rulesEnabled: true,
                  })
                }
                placeholder="Or link a rules channel…"
              />
            </div>
          )}
        </SectionCard>
      )}

      <SectionCard title="C6 — Member disputes">
        <ChipSingle
          options={[
            { id: "straight_staff", label: "Neutral, straight to staff" },
            {
              id: "collect_then_staff",
              label: "Calm down, collect both versions, then staff",
            },
          ]}
          value={data.disputesMode}
          onChange={(disputesMode) =>
            onChange({
              ...data,
              disputesMode: disputesMode as CommunityData["disputesMode"],
            })
          }
        />
      </SectionCard>

      <PartnershipBlock
        data={data.partnership}
        roles={roles}
        forceEnabled={forcePartner}
        categoryPlaceholder="min 500 members, no NSFW"
        onChange={(partnership) => onChange({ ...data, partnership })}
      />

      <SectionCard title="C8 — Bot autonomy">
        <ChipMulti
          options={[
            { id: "rules", label: "Rules" },
            { id: "role_requirements", label: "Role requirements" },
            { id: "complete_reports", label: "Complete reports" },
            { id: "nothing_else", label: "Nothing else" },
          ]}
          values={data.autonomy}
          onChange={(autonomy) => onChange({ ...data, autonomy })}
        />
      </SectionCard>
    </div>
  );
}
