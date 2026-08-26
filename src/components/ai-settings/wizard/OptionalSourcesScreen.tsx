import { useMemo, useState } from "react";
import { FaCheck, FaTrash } from "react-icons/fa";
import type { WizardAnswers } from "./types";
import { SuggestedBadge } from "./SuggestedBadge";
import { WizardNav, WizardShell } from "./WizardShell";

type Props = {
  answers: WizardAnswers;
  scan: AiDiscoveryScanResult | null;
  channels: { id: string; name: string }[];
  onChange: (patch: Partial<WizardAnswers>) => void;
  onContinue: () => void;
  onSkip: () => void;
  onBack: () => void;
  onEscapeManual: () => void;
  onExtract: () => Promise<void>;
  extracting?: boolean;
};

const BOTS = [
  { id: "ticket_tool", label: "Ticket Tool" },
  { id: "tickety", label: "Tickety" },
  { id: "john_bot", label: "John-Bot" },
  { id: "open_ticket", label: "Open Ticket" },
  { id: "other", label: "Other / Don't know" },
];

export function OptionalSourcesScreen({
  answers,
  scan,
  channels,
  onChange,
  onContinue,
  onSkip,
  onBack,
  onEscapeManual,
  onExtract,
  extracting,
}: Props) {
  const [openTranscript, setOpenTranscript] = useState(true);
  const [openTickets, setOpenTickets] = useState(true);
  const [openFiles, setOpenFiles] = useState(false);

  const transcriptCandidates = scan?.classified_channels?.transcript ?? [];
  const ticketCandidates = scan?.classified_channels?.ticket_history ?? [];

  const transcriptOptions = useMemo(() => {
    const byId = new Map(channels.map((c) => [c.id, c]));
    const fromScan = transcriptCandidates.map((c) => ({
      id: c.id,
      name: c.name,
      suggested: true,
      why: c.reason || "transcript / logs pattern",
    }));
    const extras = channels
      .filter((c) => !fromScan.some((s) => s.id === c.id))
      .map((c) => ({ id: c.id, name: c.name, suggested: false, why: undefined }));
    // Prefer scan candidates first; keep names from live channel list when possible
    return [
      ...fromScan.map((s) => ({
        ...s,
        name: byId.get(s.id)?.name || s.name,
      })),
      ...extras,
    ];
  }, [channels, transcriptCandidates]);

  const ticketOptions = useMemo(() => {
    if (ticketCandidates.length > 0) {
      return ticketCandidates.map((c) => ({
        id: c.id,
        name: c.name,
        suggested: true,
        why: "ticket-\\d+ pattern",
      }));
    }
    return channels
      .filter((c) => /^ticket-\d+$/i.test(c.name))
      .map((c) => ({
        id: c.id,
        name: c.name,
        suggested: true,
        why: "ticket-\\d+ pattern",
      }));
  }, [channels, ticketCandidates]);

  const sourceCount =
    answers.transcriptChannelIds.length +
    answers.ticketChannelIds.length +
    answers.htmlFiles.length;

  function toggleId(
    key: "transcriptChannelIds" | "ticketChannelIds",
    id: string,
  ) {
    const list = answers[key];
    const next = list.includes(id)
      ? list.filter((x) => x !== id)
      : [...list, id];
    onChange({ [key]: next });
  }

  async function handleFile(file: File) {
    const text = await file.text();
    onChange({
      htmlFiles: [
        ...answers.htmlFiles,
        { name: file.name, content: text.slice(0, 500_000) },
      ],
    });
  }

  return (
    <WizardShell
      current="sources"
      onEscapeManual={onEscapeManual}
      title="Optional sources"
      subtitle="I can learn recurring problems from old tickets. Skip anytime — never blocking."
      footer={
        <WizardNav
          onBack={onBack}
          onSkip={onSkip}
          skipLabel="Skip — I'll write problems myself"
          onNext={async () => {
            if (sourceCount > 0) await onExtract();
            onContinue();
          }}
          nextLabel={
            extracting
              ? "Reading…"
              : sourceCount > 0
                ? `Continue with ${sourceCount} source${sourceCount === 1 ? "" : "s"}`
                : "Continue"
          }
          nextDisabled={extracting}
        />
      }
    >
      <div className="cyron-glass mb-4 px-4 py-3">
        <p className="font-sans text-xs text-zinc-300">
          <strong>Privacy:</strong> I only read to extract recurring problems
          and solutions. Mentions and personal IDs are stripped before any AI
          call. User names never end up in the rules.
        </p>
        <p className="mt-1.5 font-sans text-xs text-zinc-400">
          You don&apos;t need all your tickets — about ten are enough to find
          patterns. If extraction fails, you can continue and fill problems
          manually.
        </p>
      </div>

      <p className="mb-3 font-sans text-sm text-zinc-300">
        Example output:{" "}
        <em>
          From 30 old tickets: &quot;Tracking not updating&quot; → staff asks for
          the code and checks with the courier within 24h
        </em>
      </p>

      <div className="mb-4">
        <p className="mb-2 font-sans text-xs font-semibold uppercase tracking-wide text-zinc-400">
          Which bot did you use before?
        </p>
        <div className="flex flex-wrap gap-2">
          {BOTS.map((b) => (
            <button
              key={b.id}
              type="button"
              onClick={() => onChange({ previousBot: b.id })}
              className={`rounded-xl px-3 py-1.5 font-sans text-xs font-semibold transition ${
                answers.previousBot === b.id
                  ? "bg-[#F5A623] text-[#0a0a0a]"
                  : "border border-white/10 bg-white/[0.04] text-zinc-300 hover:bg-white/[0.07]"
              }`}
            >
              {b.label}
            </button>
          ))}
        </div>
        <p className="mt-2 font-sans text-xs text-zinc-400">
          {answers.previousBot === "ticket_tool"
            ? "Select the transcript channel — I'll download the HTML attachments myself."
            : answers.previousBot === "tickety"
              ? "Download transcripts from the dashboard and upload them as files below."
              : "You can pick channels, upload files, or both."}
        </p>
      </div>

      <Accordion
        open={openTranscript}
        onToggle={() => setOpenTranscript((v) => !v)}
        title="Transcript channels"
        count={answers.transcriptChannelIds.length}
      >
        <ChannelChips
          options={transcriptOptions}
          selected={answers.transcriptChannelIds}
          onToggle={(id) => toggleId("transcriptChannelIds", id)}
        />
      </Accordion>

      <Accordion
        open={openTickets}
        onToggle={() => setOpenTickets((v) => !v)}
        title="Existing ticket channels (ticket-####)"
        count={answers.ticketChannelIds.length}
      >
        {ticketOptions.length === 0 ? (
          <p className="font-sans text-xs text-zinc-400">
            No ticket-\d+ channels detected.
          </p>
        ) : (
          <>
            <p className="mb-2 font-sans text-xs text-zinc-400">
              I found {ticketOptions.length} channel(s) that look like closed
              tickets — may I read them?
            </p>
            <ChannelChips
              options={ticketOptions}
              selected={answers.ticketChannelIds}
              onToggle={(id) => toggleId("ticketChannelIds", id)}
            />
          </>
        )}
      </Accordion>

      <Accordion
        open={openFiles}
        onToggle={() => setOpenFiles((v) => !v)}
        title="HTML / TXT files"
        count={answers.htmlFiles.length}
      >
        <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-white/15 px-4 py-8 text-center transition-colors hover:border-amber-400/40">
          <p className="font-sans text-sm text-zinc-300">
            Drop Ticket Tool HTML / TXT here
          </p>
          <input
            type="file"
            accept=".html,.htm,.txt"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void handleFile(f);
            }}
          />
        </label>
        {answers.htmlFiles.length > 0 && (
          <ul className="mt-3 space-y-2">
            {answers.htmlFiles.map((f, i) => (
              <li
                key={`${f.name}-${i}`}
                className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm"
              >
                <span className="truncate font-sans text-zinc-200">
                  {f.name}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    onChange({
                      htmlFiles: answers.htmlFiles.filter((_, j) => j !== i),
                    })
                  }
                  className="text-red-400"
                >
                  <FaTrash className="text-xs" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </Accordion>

      <p className="mt-4 font-sans text-sm font-medium text-zinc-200">
        {sourceCount} source{sourceCount === 1 ? "" : "s"} ready to read
      </p>
    </WizardShell>
  );
}

function Accordion({
  open,
  onToggle,
  title,
  count,
  children,
}: {
  open: boolean;
  onToggle: () => void;
  title: string;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <div className="cyron-glass mb-3 overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-white/[0.04]"
      >
        <span className="font-sans text-sm font-semibold text-white">
          {title}
        </span>
        <span className="font-sans text-xs text-zinc-500">
          {count > 0 ? `${count} selected` : open ? "▾" : "▸"}
        </span>
      </button>
      {open && (
        <div className="border-t border-white/10 bg-white/[0.02] px-4 py-3">
          {children}
        </div>
      )}
    </div>
  );
}

function ChannelChips({
  options,
  selected,
  onToggle,
}: {
  options: { id: string; name: string; suggested?: boolean; why?: string }[];
  selected: string[];
  onToggle: (id: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.slice(0, 40).map((o) => {
        const on = selected.includes(o.id);
        return (
          <button
            key={o.id}
            type="button"
            onClick={() => onToggle(o.id)}
            className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 font-sans text-xs transition ${
              on
                ? "border-amber-400/40 bg-amber-400/10 text-amber-200"
                : "border-white/10 bg-white/[0.04] text-zinc-300 hover:bg-white/[0.07]"
            }`}
          >
            {on && <FaCheck className="text-[9px]" />}#{o.name}
            {o.suggested && <SuggestedBadge why={o.why} />}
          </button>
        );
      })}
    </div>
  );
}
