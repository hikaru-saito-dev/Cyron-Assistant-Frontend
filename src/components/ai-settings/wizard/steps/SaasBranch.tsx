import { FaPlus, FaTrash } from "react-icons/fa";
import type { SaasData } from "../categoryTypes";
import { newRuleId } from "../types";
import { PartnershipBlock } from "../shared/PartnershipBlock";
import { ProblemSolutionList } from "../shared/ProblemSolutionList";
import { ChannelPicker } from "../shared/ChannelPicker";
import { ChipMulti, ChipSingle, SectionCard } from "./categoryUi";

type Role = { id: string; name: string };
type Channel = { id: string; name: string };

type Props = {
  data: SaasData;
  roles: Role[];
  channels: Channel[];
  onChange: (data: SaasData) => void;
};

const PRODUCT_TYPES = [
  "Discord bot",
  "Web app/service",
  "Desktop software",
  "API/dev tool",
  "Game",
];

function bugTriageOptions(productType: string): { id: string; label: string }[] {
  const base = [
    { id: "steps", label: "Steps to reproduce" },
    { id: "screenshot", label: "Screenshot/video" },
    { id: "error_message", label: "Exact error message" },
    { id: "since_when", label: "Since when" },
  ];
  if (/bot/i.test(productType)) {
    base.push({ id: "server_id", label: "Server ID" });
  }
  if (/web|app|desktop/i.test(productType)) {
    base.push({ id: "browser_device", label: "Browser/device" });
  }
  return base;
}

export function SaasBranch({ data, roles, channels, onChange }: Props) {
  return (
    <div className="space-y-5">
      <SectionCard title="P1 — Product type" required>
        <ChipSingle
          options={PRODUCT_TYPES}
          value={data.productType}
          onChange={(productType) => onChange({ ...data, productType })}
        />
      </SectionCard>

      <SectionCard title="P2 — Pricing model" required>
        <ChipSingle
          options={[
            { id: "free", label: "Free" },
            { id: "paid", label: "Paid" },
            { id: "freemium", label: "Freemium" },
          ]}
          value={data.pricingModel}
          onChange={(pricingModel) =>
            onChange({
              ...data,
              pricingModel: pricingModel as SaasData["pricingModel"],
            })
          }
        />
      </SectionCard>

      <SectionCard title="P3 — Resources">
        <p className="mb-2 font-sans text-xs text-slate-500">
          Optional docs, FAQ, status page, videos (Label + URL).
        </p>
        {data.resources.map((r, i) => (
          <div key={r.id} className="mb-2 flex gap-2">
            <input
              className="w-1/3 rounded-lg border border-slate-200 px-2 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
              placeholder="Label"
              value={r.label}
              onChange={(e) => {
                const resources = [...data.resources];
                resources[i] = { ...r, label: e.target.value };
                onChange({ ...data, resources });
              }}
            />
            <input
              className="min-w-0 flex-1 rounded-lg border border-slate-200 px-2 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
              placeholder="URL"
              value={r.url}
              onChange={(e) => {
                const resources = [...data.resources];
                resources[i] = { ...r, url: e.target.value };
                onChange({ ...data, resources });
              }}
            />
            <button
              type="button"
              className="text-red-500"
              onClick={() =>
                onChange({
                  ...data,
                  resources: data.resources.filter((_, j) => j !== i),
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
              resources: [
                ...data.resources,
                { id: newRuleId(), label: "Documentation", url: "" },
              ],
            })
          }
          className="inline-flex items-center gap-1 font-sans text-xs font-semibold text-indigo-600"
        >
          <FaPlus className="text-[10px]" /> Add resource
        </button>
      </SectionCard>

      <SectionCard title="P4 — Bug triage">
        <p className="mb-2 font-sans text-xs text-slate-500">
          What must Cyron collect before passing to staff?
        </p>
        <ChipMulti
          options={bugTriageOptions(data.productType)}
          values={data.bugTriage}
          onChange={(bugTriage) => onChange({ ...data, bugTriage })}
        />
      </SectionCard>

      <SectionCard title="P5 — Known problems → Solutions">
        <ProblemSolutionList
          rows={data.problems}
          onChange={(problems) => onChange({ ...data, problems })}
          max={5}
        />
      </SectionCard>

      {data.pricingModel !== "free" && (
        <SectionCard title="P6 — Billing">
          <ChipSingle
            options={[
              {
                id: "staff_only",
                label: "Always staff only — collect and pass",
              },
              { id: "simple_guide", label: "Can guide on simple cases" },
            ]}
            value={data.billingMode}
            onChange={(billingMode) =>
              onChange({
                ...data,
                billingMode: billingMode as SaasData["billingMode"],
              })
            }
          />
          {data.billingMode === "simple_guide" && (
            <input
              className="mt-3 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
              placeholder="Subscription management link"
              value={data.billingLink}
              onChange={(e) =>
                onChange({ ...data, billingLink: e.target.value })
              }
            />
          )}
        </SectionCard>
      )}

      <SectionCard title="P7 — Feature requests">
        <ChipSingle
          options={[
            { id: "channel", label: "Dedicated channel" },
            { id: "ticket", label: "Collects them in the ticket" },
            { id: "not_accepted", label: "Not accepted" },
          ]}
          value={data.featureRequests}
          onChange={(featureRequests) =>
            onChange({
              ...data,
              featureRequests:
                featureRequests as SaasData["featureRequests"],
            })
          }
        />
        {data.featureRequests === "channel" && (
          <div className="mt-3">
            <ChannelPicker
              channels={channels}
              value={data.featureChannelId}
              onChange={(id, name) =>
                onChange({
                  ...data,
                  featureChannelId: id,
                  featureChannelName: name,
                })
              }
              placeholder="Feature requests channel…"
            />
          </div>
        )}
      </SectionCard>

      <PartnershipBlock
        data={data.partnership}
        roles={roles}
        categoryPlaceholder="projects with 1k+ users only"
        onChange={(partnership) => onChange({ ...data, partnership })}
      />

      <SectionCard title="P9 — Bot autonomy">
        <ChipMulti
          options={[
            { id: "answer_docs", label: "Answer with the docs" },
            { id: "known_solutions", label: "Apply known solutions" },
            { id: "bug_triage", label: "Bug triage" },
            { id: "simple_billing", label: "Simple billing" },
            { id: "nothing_else", label: "Nothing else" },
          ]}
          values={data.autonomy}
          onChange={(autonomy) => onChange({ ...data, autonomy })}
        />
      </SectionCard>
    </div>
  );
}
