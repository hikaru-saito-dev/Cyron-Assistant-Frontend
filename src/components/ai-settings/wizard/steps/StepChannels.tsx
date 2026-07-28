import { FaPlus, FaTrash } from "react-icons/fa";
import { CHANNEL_PURPOSES, type LinkableChannel } from "../categoryTypes";
import type { WizardAnswers } from "../types";
import { newRuleId } from "../types";
import { ChannelPicker } from "../shared/ChannelPicker";
import { SuggestedBadge } from "../SuggestedBadge";
import { WizardNav, WizardShell } from "../WizardShell";

type Props = {
  answers: WizardAnswers;
  channels: { id: string; name: string }[];
  onChange: (patch: Partial<WizardAnswers>) => void;
  onContinue: () => void;
  onBack: () => void;
  onEscapeManual: () => void;
};

export function StepChannels({
  answers,
  channels,
  onChange,
  onContinue,
  onBack,
  onEscapeManual,
}: Props) {
  const rows = answers.linkableChannels;

  function update(i: number, patch: Partial<LinkableChannel>) {
    const next = rows.map((r, idx) =>
      idx === i ? { ...r, ...patch, suggested: false } : r,
    );
    onChange({ linkableChannels: next });
  }

  function add() {
    onChange({
      linkableChannels: [
        ...rows,
        {
          id: newRuleId(),
          purpose: "Announcements",
          purposeCustom: "",
          channelId: "",
          channelName: "",
        },
      ],
    });
  }

  return (
    <WizardShell
      current="channels"
      onEscapeManual={onEscapeManual}
      title="Channels Cyron can link"
      subtitle="Only channels listed here may be mentioned. Store real channel IDs for clickable <#id> mentions."
      footer={
        <WizardNav
          onBack={onBack}
          onNext={onContinue}
          nextLabel="Continue to summary"
          skipLabel="Skip (no channels)"
          onSkip={onContinue}
        />
      }
    >
      <div className="space-y-3">
        {rows.map((row, i) => (
          <div
            key={row.id}
            className="space-y-2 rounded-2xl border border-slate-200 p-3 dark:border-slate-700"
          >
            {row.suggested && (
              <SuggestedBadge why={row.why || "from server scan"} />
            )}
            <div className="grid gap-2 sm:grid-cols-2">
              <div>
                <label className="font-sans text-xs text-slate-500">
                  Purpose
                </label>
                <select
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm dark:border-slate-600 dark:bg-slate-800"
                  value={row.purpose}
                  onChange={(e) => update(i, { purpose: e.target.value })}
                >
                  {CHANNEL_PURPOSES.map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </select>
                {row.purpose === "Other" && (
                  <input
                    className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
                    placeholder="Custom purpose"
                    value={row.purposeCustom}
                    onChange={(e) =>
                      update(i, { purposeCustom: e.target.value })
                    }
                  />
                )}
              </div>
              <div>
                <label className="font-sans text-xs text-slate-500">
                  Channel
                </label>
                <div className="mt-1">
                  <ChannelPicker
                    channels={channels}
                    value={row.channelId}
                    onChange={(id, name) =>
                      update(i, { channelId: id, channelName: name })
                    }
                  />
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() =>
                onChange({
                  linkableChannels: rows.filter((_, j) => j !== i),
                })
              }
              className="inline-flex items-center gap-1 font-sans text-xs text-red-500"
            >
              <FaTrash className="text-[10px]" /> Remove
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={add}
          className="inline-flex items-center gap-1.5 rounded-xl border border-dashed border-slate-300 px-3 py-2 font-sans text-xs font-semibold text-slate-600 dark:border-slate-600 dark:text-slate-300"
        >
          <FaPlus className="text-[10px]" /> Add channel
        </button>
      </div>
    </WizardShell>
  );
}
