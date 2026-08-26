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
    <section className="cyron-glass space-y-3 p-4">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="font-display text-sm font-bold text-white">
          Partnership / Collaborations
        </h3>
        {data.suggested && <SuggestedBadge why={data.why} />}
      </div>

      {!forceEnabled && (
        <label className="flex items-center gap-2 font-sans text-sm text-zinc-200">
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
            <label className="font-sans text-xs text-zinc-400">
              Minimum requirements
            </label>
            <textarea
              className="mt-1 min-h-[72px] w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 font-sans text-sm text-white transition-all placeholder:text-white/40 focus:border-amber-400/50 focus:outline-none focus:ring-2 focus:ring-amber-400/20"
              placeholder={categoryPlaceholder}
              value={data.requirements}
              onChange={(e) =>
                onChange({ ...data, requirements: e.target.value })
              }
            />
          </div>
          <div>
            <p className="mb-1 font-sans text-xs text-zinc-400">
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
                    className={`rounded-xl border px-3 py-1.5 font-sans text-xs transition-colors ${
                      on
                        ? "border-amber-400/40 bg-amber-400/10 text-amber-200"
                        : "border-white/10 bg-white/[0.04] text-zinc-300 hover:bg-white/[0.07]"
                    }`}
                  >
                    @{r.name}
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <p className="mb-1 font-sans text-xs text-zinc-400">
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
                    className={`rounded-xl border px-3 py-1.5 font-sans text-xs transition-colors ${
                      on
                        ? "border-amber-400/40 bg-amber-400/10 text-amber-200"
                        : "border-white/10 bg-white/[0.04] text-zinc-300 hover:bg-white/[0.07]"
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
        <p className="font-sans text-xs text-zinc-400">
          Cyron will politely say this server doesn&apos;t handle partnerships
          via tickets.
        </p>
      )}
    </section>
  );
}
