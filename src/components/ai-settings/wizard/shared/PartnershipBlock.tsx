import { SuggestedBadge } from "../SuggestedBadge";
import type { PartnershipData } from "../categoryTypes";

type Role = { id: string; name: string };

type Props = {
  data: PartnershipData;
  roles: Role[];
  categoryPlaceholder: string;
  onChange: (data: PartnershipData) => void;
  forceEnabled?: boolean;
};

const PROVIDE = [
  { id: "link", label: "Server/project link" },
  { id: "description", label: "Proposal description" },
  { id: "numbers", label: "Numbers / stats" },
];

export function PartnershipBlock({
  data,
  roles,
  categoryPlaceholder,
  onChange,
  forceEnabled,
}: Props) {
  const enabled = forceEnabled || data.enabled;

  return (
    <section className="space-y-3 rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="font-display text-sm font-bold text-slate-900 dark:text-white">
          Partnership / Collaborations
        </h3>
        {data.suggested && <SuggestedBadge why={data.why} />}
      </div>

      {!forceEnabled && (
        <label className="flex items-center gap-2 font-sans text-sm text-slate-700 dark:text-slate-200">
          <input
            type="checkbox"
            checked={data.enabled}
            onChange={(e) => onChange({ ...data, enabled: e.target.checked })}
          />
          Do you receive partnership requests via tickets?
        </label>
      )}

      {enabled ? (
        <div className="space-y-3">
          <div>
            <label className="font-sans text-xs text-slate-500">
              Minimum requirements
            </label>
            <textarea
              className="mt-1 min-h-[72px] w-full rounded-xl border border-slate-200 px-3 py-2 font-sans text-sm dark:border-slate-600 dark:bg-slate-800"
              placeholder={categoryPlaceholder}
              value={data.requirements}
              onChange={(e) =>
                onChange({ ...data, requirements: e.target.value })
              }
            />
          </div>
          <div>
            <p className="mb-1 font-sans text-xs text-slate-500">
              Who evaluates them?
            </p>
            <div className="flex flex-wrap gap-2">
              {roles.map((r) => {
                const on = data.evaluatorRoleIds.includes(r.id);
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() =>
                      onChange({
                        ...data,
                        evaluatorRoleIds: on
                          ? data.evaluatorRoleIds.filter((x) => x !== r.id)
                          : [...data.evaluatorRoleIds, r.id],
                      })
                    }
                    className={`rounded-xl border px-3 py-1.5 font-sans text-xs ${
                      on
                        ? "border-indigo-400 bg-indigo-50 text-indigo-800 dark:bg-indigo-500/15 dark:text-indigo-200"
                        : "border-slate-200 text-slate-600 dark:border-slate-600"
                    }`}
                  >
                    @{r.name}
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <p className="mb-1 font-sans text-xs text-slate-500">
              What must the proposer provide?
            </p>
            <div className="flex flex-wrap gap-2">
              {PROVIDE.map((p) => {
                const on = data.provide.includes(p.id);
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() =>
                      onChange({
                        ...data,
                        provide: on
                          ? data.provide.filter((x) => x !== p.id)
                          : [...data.provide, p.id],
                      })
                    }
                    className={`rounded-xl border px-3 py-1.5 font-sans text-xs ${
                      on
                        ? "border-indigo-400 bg-indigo-50 text-indigo-800 dark:bg-indigo-500/15"
                        : "border-slate-200 text-slate-600 dark:border-slate-600"
                    }`}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <p className="font-sans text-xs text-slate-500">
          Cyron will politely say this server doesn&apos;t handle partnerships
          via tickets.
        </p>
      )}
    </section>
  );
}
