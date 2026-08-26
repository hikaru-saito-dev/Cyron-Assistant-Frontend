import { CATEGORY_META, type WizardCategory } from "./types";
import { WizardNav, WizardShell } from "./WizardShell";

type Props = {
  scan: AiDiscoveryScanResult;
  guildName: string;
  onContinue: () => void;
  onBack: () => void;
  onEscapeManual: () => void;
};

export function ScanResultsScreen({
  scan,
  guildName,
  onContinue,
  onBack,
  onEscapeManual,
}: Props) {
  const cat = (scan.proposed_category || "other") as WizardCategory;
  const meta = CATEGORY_META[cat] ?? CATEGORY_META.other;

  return (
    <WizardShell
      current="scan_results"
      onEscapeManual={onEscapeManual}
      title="Here's what I found"
      subtitle={`Signals from ${guildName || "your server"} — channels, panels, and roles.`}
      footer={
        <WizardNav
          onBack={onBack}
          onNext={onContinue}
          nextLabel="Continue to category"
        />
      }
    >
      <div className="space-y-4">
        <div className="rounded-2xl border border-amber-400/25 bg-amber-400/[0.07] px-4 py-4 backdrop-blur-xl">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-sans text-sm font-semibold text-amber-200">
              {meta.emoji} Likely {meta.label}
            </p>
            <span className="rounded-full bg-amber-400/20 px-2 py-0.5 font-sans text-[10px] font-bold uppercase tracking-wide text-amber-200">
              {scan.confidence_tier} · {Math.round((scan.confidence ?? 0) * 100)}%
            </span>
          </div>
          {scan.summary && (
            <p className="mt-2 font-sans text-xs text-amber-300/80">
              {scan.summary}
            </p>
          )}
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <Stat label="Channels" value={String(scan.channel_count ?? 0)} />
          <Stat label="Panels" value={String(scan.panel_count ?? 0)} />
          <Stat
            label="Staff roles"
            value={String(scan.role_candidates?.length ?? 0)}
          />
        </div>

        {(scan.rationale?.length ?? 0) > 0 && (
          <Section title="Why this guess">
            <ul className="space-y-1 font-sans text-sm text-zinc-300">
              {scan.rationale.slice(0, 8).map((r) => (
                <li key={r}>• {r}</li>
              ))}
            </ul>
          </Section>
        )}

        {(scan.signals?.length ?? 0) > 0 && (
          <Section title="Detected signals">
            <div className="flex flex-wrap gap-1.5">
              {scan.signals.slice(0, 12).map((s) => (
                <span
                  key={s}
                  className="rounded-lg border border-white/10 bg-white/[0.06] px-2 py-1 font-sans text-[11px] text-zinc-300"
                >
                  {s}
                </span>
              ))}
            </div>
          </Section>
        )}

        {scan.panels_found?.length > 0 && (
          <Section title="Panels found">
            <div className="flex flex-wrap gap-2">
              {scan.panels_found.map((p) => (
                <span
                  key={p.id}
                  className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1.5 font-sans text-xs font-medium text-zinc-200"
                >
                  {p.button_emoji ? `${p.button_emoji} ` : ""}
                  {p.name}
                </span>
              ))}
            </div>
          </Section>
        )}

        {(scan.classified_channels?.ticket_history?.length ?? 0) > 0 && (
          <p className="font-sans text-xs text-zinc-400">
            Found {scan.classified_channels.ticket_history.length} closed ticket
            channel(s) — you can use them in the next sources step.
          </p>
        )}
      </div>
    </WizardShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="cyron-glass !rounded-xl px-3 py-3">
      <p className="font-display text-[10px] font-bold uppercase tracking-wider text-zinc-500">
        {label}
      </p>
      <p className="mt-1 font-display text-lg font-bold text-white">
        {value}
      </p>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="cyron-glass p-4">
      <p className="mb-2 font-display text-[11px] font-bold uppercase tracking-[0.12em] text-zinc-500">
        {title}
      </p>
      {children}
    </div>
  );
}
