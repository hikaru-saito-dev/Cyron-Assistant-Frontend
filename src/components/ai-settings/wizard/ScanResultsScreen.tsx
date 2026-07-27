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
        <div className="rounded-2xl border border-indigo-200 bg-indigo-50/70 px-4 py-4 dark:border-indigo-500/30 dark:bg-indigo-500/10">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-sans text-sm font-semibold text-indigo-900 dark:text-indigo-200">
              {meta.emoji} Likely {meta.label}
            </p>
            <span className="rounded-full bg-indigo-200/80 px-2 py-0.5 font-sans text-[10px] font-bold uppercase tracking-wide text-indigo-800 dark:bg-indigo-500/30 dark:text-indigo-200">
              {scan.confidence_tier} · {Math.round((scan.confidence ?? 0) * 100)}%
            </span>
          </div>
          {scan.summary && (
            <p className="mt-2 font-sans text-xs text-indigo-800/80 dark:text-indigo-300/80">
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
            <ul className="space-y-1 font-sans text-sm text-slate-600 dark:text-slate-300">
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
                  className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 font-sans text-[11px] text-slate-600 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300"
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
                  className="rounded-xl border border-slate-200 px-3 py-1.5 font-sans text-xs font-medium text-slate-700 dark:border-slate-600 dark:text-slate-200"
                >
                  {p.button_emoji ? `${p.button_emoji} ` : ""}
                  {p.name}
                </span>
              ))}
            </div>
          </Section>
        )}

        {(scan.classified_channels?.ticket_history?.length ?? 0) > 0 && (
          <p className="font-sans text-xs text-slate-500 dark:text-slate-400">
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
    <div className="rounded-xl border border-slate-200 bg-white px-3 py-3 dark:border-slate-700 dark:bg-slate-900">
      <p className="font-display text-[10px] font-bold uppercase tracking-wider text-slate-400">
        {label}
      </p>
      <p className="mt-1 font-display text-lg font-bold text-slate-900 dark:text-white">
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
    <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
      <p className="mb-2 font-display text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
        {title}
      </p>
      {children}
    </div>
  );
}
