import { FaPlus, FaTimes } from "react-icons/fa";
import type { WizardAnswers } from "../types";
import { EditableRuleList } from "../EditableRuleList";
import { SuggestedBadge } from "../SuggestedBadge";
import { WizardNav, WizardShell } from "../WizardShell";

type Props = {
  answers: WizardAnswers;
  guildRoles: RoleCandidate[];
  onChange: (patch: Partial<WizardAnswers>) => void;
  onContinue: () => void;
  onBack: () => void;
  onEscapeManual: () => void;
};

export function StepEscalation({
  answers,
  guildRoles,
  onChange,
  onContinue,
  onBack,
  onEscapeManual,
}: Props) {
  const noRole = answers.escalationRoleIds.length === 0;
  const roles =
    guildRoles.length > 0
      ? guildRoles
      : answers.escalationRoleIds.map((id) => ({
          id,
          name: id,
          score: 0,
          reason: null,
        }));

  const topSuggested = answers.escalationRoleSuggestedIds[0];

  function toggleRole(id: string) {
    const list = answers.escalationRoleIds;
    onChange({
      escalationRoleIds: list.includes(id)
        ? list.filter((x) => x !== id)
        : [...list, id],
    });
  }

  function addUser() {
    const raw = window.prompt("Discord user ID to ping on escalation:");
    if (!raw?.trim()) return;
    onChange({
      escalationUsers: [...answers.escalationUsers, raw.trim()],
    });
  }

  const quickConfirm =
    answers.escalationRules.every((r) => r.suggested && !r.touched) &&
    !noRole;

  return (
    <WizardShell
      current="escalation"
      onEscapeManual={onEscapeManual}
      title="When to call a human"
      subtitle="Escalation cases and who to notify."
      footer={
        <WizardNav
          onBack={onBack}
          onNext={onContinue}
          nextLabel={quickConfirm ? "Looks good →" : "Continue"}
        />
      }
    >
      <div className="space-y-6">
        <section>
          <p className="mb-2 font-sans text-xs font-semibold uppercase tracking-wide text-zinc-400">
            Escalation cases
          </p>
          <EditableRuleList
            rules={answers.escalationRules}
            onChange={(escalationRules) => onChange({ escalationRules })}
            placeholder="Escalate when…"
          />
        </section>

        <section>
          <p className="mb-2 font-sans text-xs font-semibold uppercase tracking-wide text-zinc-400">
            Roles to notify
          </p>
          {noRole && (
            <div className="mb-3 rounded-xl border border-yellow-500/30 bg-yellow-500/10 px-3 py-2 font-sans text-xs text-yellow-300">
              Select at least one role so Cyron knows who to mention when
              escalating.
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            {roles.map((r) => {
              const on = answers.escalationRoleIds.includes(r.id);
              const suggested = answers.escalationRoleSuggestedIds.includes(
                r.id,
              );
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => toggleRole(r.id)}
                  className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 font-sans text-xs font-medium transition ${
                    on
                      ? "border-amber-400/40 bg-amber-400/10 text-amber-200"
                      : "border-white/10 bg-white/[0.04] text-zinc-300 hover:bg-white/[0.07]"
                  }`}
                >
                  @{r.name}
                  {suggested && r.id === topSuggested && (
                    <SuggestedBadge why="highest staff role found" />
                  )}
                </button>
              );
            })}
            {roles.length === 0 && (
              <p className="font-sans text-xs text-zinc-400">
                No roles synced yet — re-run Analyze after the bot syncs, or
                continue and add roles later.
              </p>
            )}
          </div>
        </section>

        <section>
          <p className="mb-2 font-sans text-xs font-semibold uppercase tracking-wide text-zinc-400">
            Specific users (optional)
          </p>
          <div className="flex flex-wrap gap-2">
            {answers.escalationUsers.map((u) => (
              <span
                key={u}
                className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1.5 font-sans text-xs text-zinc-200"
              >
                {u}
                <button
                  type="button"
                  onClick={() =>
                    onChange({
                      escalationUsers: answers.escalationUsers.filter(
                        (x) => x !== u,
                      ),
                    })
                  }
                >
                  <FaTimes className="text-[10px] text-zinc-500" />
                </button>
              </span>
            ))}
            <button
              type="button"
              onClick={addUser}
              className="inline-flex items-center gap-1 rounded-xl border border-dashed border-white/15 px-3 py-1.5 font-sans text-xs font-semibold text-zinc-400 transition-colors hover:border-amber-400/40 hover:text-amber-400"
            >
              <FaPlus className="text-[9px]" />
              Add user ID
            </button>
          </div>
        </section>
      </div>
    </WizardShell>
  );
}
