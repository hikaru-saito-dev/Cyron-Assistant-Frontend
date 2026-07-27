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
          <p className="mb-2 font-sans text-xs font-semibold uppercase tracking-wide text-slate-500">
            Escalation cases
          </p>
          <EditableRuleList
            rules={answers.escalationRules}
            onChange={(escalationRules) => onChange({ escalationRules })}
            placeholder="Escalate when…"
          />
        </section>

        <section>
          <p className="mb-2 font-sans text-xs font-semibold uppercase tracking-wide text-slate-500">
            Roles to notify
          </p>
          {noRole && (
            <div className="mb-3 rounded-xl border border-amber-200 bg-amber-50/80 px-3 py-2 font-sans text-xs text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
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
                      ? "border-indigo-400 bg-indigo-50 text-indigo-800 dark:border-indigo-500 dark:bg-indigo-500/15 dark:text-indigo-200"
                      : "border-slate-200 text-slate-600 dark:border-slate-600 dark:text-slate-300"
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
              <p className="font-sans text-xs text-slate-500">
                No roles synced yet — re-run Analyze after the bot syncs, or
                continue and add roles later.
              </p>
            )}
          </div>
        </section>

        <section>
          <p className="mb-2 font-sans text-xs font-semibold uppercase tracking-wide text-slate-500">
            Specific users (optional)
          </p>
          <div className="flex flex-wrap gap-2">
            {answers.escalationUsers.map((u) => (
              <span
                key={u}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-1.5 font-sans text-xs dark:border-slate-600"
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
                  <FaTimes className="text-[10px] text-slate-400" />
                </button>
              </span>
            ))}
            <button
              type="button"
              onClick={addUser}
              className="inline-flex items-center gap-1 rounded-xl border border-dashed border-slate-300 px-3 py-1.5 font-sans text-xs font-semibold text-slate-500 dark:border-slate-600"
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
