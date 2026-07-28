import {
  DELIVERY_TIMES,
  SELL_PRODUCTS,
  type SellingData,
} from "../categoryTypes";
import { PartnershipBlock } from "../shared/PartnershipBlock";
import { PaymentsBlock } from "../shared/PaymentsBlock";
import { ProblemSolutionList } from "../shared/ProblemSolutionList";
import { ChannelPicker } from "../shared/ChannelPicker";
import { ChipMulti, ChipSingle, SectionCard } from "./categoryUi";

type Role = { id: string; name: string };
type Channel = { id: string; name: string };

type Props = {
  data: SellingData;
  roles: Role[];
  channels: Channel[];
  onChange: (data: SellingData) => void;
};

export function SellingBranch({ data, roles, channels, onChange }: Props) {
  return (
    <div className="space-y-5">
      <SectionCard title="S1 — What do you sell?" required>
        <ChipMulti
          options={SELL_PRODUCTS}
          values={data.products}
          onChange={(products) => onChange({ ...data, products })}
        />
      </SectionCard>

      <SectionCard title="S2 — Delivery" required>
        <p className="mb-2 font-sans text-xs text-slate-500">
          After payment, how does the customer receive the product?
        </p>
        <ChipSingle
          options={[
            { id: "automatic", label: "Automatic and instant" },
            { id: "manual", label: "Manual — staff sends it" },
            { id: "depends", label: "Depends on the product" },
          ]}
          value={data.delivery}
          onChange={(delivery) =>
            onChange({
              ...data,
              delivery: delivery as SellingData["delivery"],
            })
          }
        />
        {(data.delivery === "manual" || data.delivery === "depends") && (
          <div className="mt-3">
            <label className="font-sans text-xs text-slate-500">
              Within how long at most?
            </label>
            <select
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm dark:border-slate-600 dark:bg-slate-800"
              value={data.deliveryMaxTime}
              onChange={(e) =>
                onChange({ ...data, deliveryMaxTime: e.target.value })
              }
            >
              {DELIVERY_TIMES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        )}
      </SectionCard>

      <SectionCard title="S3 — Payments" required>
        <PaymentsBlock
          data={data.payments}
          onChange={(payments) => onChange({ ...data, payments })}
        />
      </SectionCard>

      <SectionCard title="S4 — Refund policy">
        <ChipSingle
          options={[
            { id: "none", label: "No refunds" },
            { id: "broken", label: "Only if the product doesn't work" },
            { id: "within_n", label: "Within N days" },
            { id: "case_by_case", label: "Case by case" },
          ]}
          value={data.refundPolicy}
          onChange={(refundPolicy) =>
            onChange({
              ...data,
              refundPolicy: refundPolicy as SellingData["refundPolicy"],
            })
          }
        />
        {data.refundPolicy === "none" && (
          <input
            className="mt-3 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
            placeholder="Exceptions? (optional)"
            value={data.refundExceptions}
            onChange={(e) =>
              onChange({ ...data, refundExceptions: e.target.value })
            }
          />
        )}
        {data.refundPolicy === "broken" && (
          <div className="mt-3 space-y-3">
            <div>
              <label className="font-sans text-xs text-slate-500">
                Within how long from delivery?
              </label>
              <select
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
                value={data.refundWithin}
                onChange={(e) =>
                  onChange({ ...data, refundWithin: e.target.value })
                }
              >
                {["24h", "3d", "7d", "14d"].map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
            <ChipMulti
              label="What must the customer prove?"
              options={["screenshot", "video", "proof of purchase"]}
              values={data.refundProof}
              onChange={(refundProof) => onChange({ ...data, refundProof })}
            />
          </div>
        )}
        {data.refundPolicy === "within_n" && (
          <div className="mt-3 space-y-3">
            <div>
              <label className="font-sans text-xs text-slate-500">Days</label>
              <select
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
                value={data.refundDays}
                onChange={(e) =>
                  onChange({ ...data, refundDays: e.target.value })
                }
              >
                {["3", "7", "14", "30"].map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
            <input
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
              placeholder="Under what conditions?"
              value={data.refundConditions}
              onChange={(e) =>
                onChange({ ...data, refundConditions: e.target.value })
              }
            />
          </div>
        )}
        {data.refundPolicy === "case_by_case" && (
          <textarea
            className="mt-3 min-h-[80px] w-full rounded-xl border border-slate-200 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
            placeholder="Explain how the evaluation works (who decides, criteria, timing) — required"
            value={data.refundCaseExplain}
            onChange={(e) =>
              onChange({ ...data, refundCaseExplain: e.target.value })
            }
          />
        )}
        <div className="mt-4">
          <ChipMulti
            label="How is the refund issued, if approved?"
            options={[
              { id: "same_method", label: "Same payment method" },
              { id: "server_credit", label: "Server credit" },
              { id: "replacement", label: "Replacement" },
            ]}
            values={data.refundIssue}
            onChange={(refundIssue) => onChange({ ...data, refundIssue })}
          />
        </div>
      </SectionCard>

      <SectionCard title="S5 — Warranty / replacement">
        <label className="flex items-center gap-2 font-sans text-sm">
          <input
            type="checkbox"
            checked={data.warrantyEnabled}
            onChange={(e) =>
              onChange({ ...data, warrantyEnabled: e.target.checked })
            }
          />
          Offer warranty / replacement
        </label>
        {data.warrantyEnabled ? (
          <div className="mt-3 space-y-3">
            <ChipMulti
              label="What does it cover?"
              options={[
                "account expired early",
                "key revoked",
                "defective on delivery",
                "service not completed",
                "other",
              ]}
              values={data.warrantyCovers}
              onChange={(warrantyCovers) =>
                onChange({ ...data, warrantyCovers })
              }
            />
            <div>
              <label className="font-sans text-xs text-slate-500">
                For how long?
              </label>
              <select
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
                value={data.warrantyDuration}
                onChange={(e) =>
                  onChange({ ...data, warrantyDuration: e.target.value })
                }
              >
                {["7d", "30d", "subscription duration", "always"].map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
            <ChipMulti
              label="What must the customer provide?"
              options={["order ID", "screenshot", "exact product name"]}
              values={data.warrantyProvide}
              onChange={(warrantyProvide) =>
                onChange({ ...data, warrantyProvide })
              }
            />
            <input
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
              placeholder="Conditions or exclusions"
              value={data.warrantyExclusions}
              onChange={(e) =>
                onChange({ ...data, warrantyExclusions: e.target.value })
              }
            />
          </div>
        ) : (
          <input
            className="mt-3 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
            value={data.warrantyNoLine}
            onChange={(e) =>
              onChange({ ...data, warrantyNoLine: e.target.value })
            }
          />
        )}
      </SectionCard>

      <SectionCard title="S6 — Prices" required>
        <ChipSingle
          options={[
            { id: "link", label: "Yes, they're at this link/channel" },
            { id: "defer", label: "No, defer to staff/price list" },
          ]}
          value={data.pricesMode}
          onChange={(pricesMode) =>
            onChange({
              ...data,
              pricesMode: pricesMode as SellingData["pricesMode"],
            })
          }
        />
        {data.pricesMode === "link" && (
          <div className="mt-3 space-y-2">
            <ChannelPicker
              channels={channels}
              value={data.pricesChannelId}
              onChange={(id, name) =>
                onChange({
                  ...data,
                  pricesChannelId: id,
                  pricesChannelName: name,
                })
              }
              placeholder="Price list channel…"
            />
            <input
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
              placeholder="Or URL to price list"
              value={data.pricesUrl}
              onChange={(e) =>
                onChange({ ...data, pricesUrl: e.target.value })
              }
            />
          </div>
        )}
      </SectionCard>

      <SectionCard title="S7 — Problems → Solutions">
        <ProblemSolutionList
          rows={data.problems}
          onChange={(problems) => onChange({ ...data, problems })}
          max={5}
        />
      </SectionCard>

      <PartnershipBlock
        data={data.partnership}
        roles={roles}
        categoryPlaceholder="verified resellers with vouches only"
        onChange={(partnership) => onChange({ ...data, partnership })}
      />

      <SectionCard title="S9 — Bot autonomy">
        <ChipMulti
          options={[
            { id: "explain_purchasing", label: "Explain purchasing and payments" },
            { id: "reassure_delivery", label: "Reassure on delivery times" },
            { id: "state_refund", label: "State the refund policy" },
            { id: "confirm_warranty", label: "Confirm warranty coverage" },
            { id: "nothing_else", label: "Nothing else" },
          ]}
          values={data.autonomy}
          onChange={(autonomy) => onChange({ ...data, autonomy })}
        />
      </SectionCard>
    </div>
  );
}
