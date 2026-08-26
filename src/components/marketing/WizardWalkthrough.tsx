import { EyeOff, FlaskConical, Radar, SkipForward } from 'lucide-react';
import { MetaTag, Reveal, SectionShell } from './SectionShell';

const SCAN_READS = [
  'Server name and description',
  'Category names',
  'Channel names',
  'Voice vs text mix',
  'Role names',
];

const SCAN_OUTPUT = [
  {
    label: 'Proposed server type',
    value: 'selling · saas · community · other',
    note: 'Picked by heuristics with a confidence score attached — no AI call, nothing sent to a model.',
  },
  {
    label: 'Likely staff roles',
    value: 'flagged for your review',
    note: 'So escalation targets are pre-filled instead of typed from memory.',
  },
  {
    label: 'Useful channels',
    value: 'knowledge · announcements · transcripts · partnership · selling',
    note: 'Matched by name so the wizard can suggest where to read from later.',
  },
];

const STEPS = [
  {
    title: 'Server scan',
    detail:
      'Optional. Reads your server’s structure and proposes a server type, staff roles and channels worth using.',
  },
  {
    title: 'Sources',
    detail: 'Confirm where your answers should come from before any content is written.',
  },
  {
    title: 'Server description',
    detail: 'What you actually sell or run, in your own words. This becomes the backbone of the rules.',
  },
  {
    title: 'Tone and language',
    detail: 'How replies should sound, and which language members should be answered in.',
  },
  {
    title: 'Things it must never say',
    detail: 'Hard boundaries written straight into the rules — promises, claims and topics that are off limits.',
  },
  {
    title: 'Escalation targets',
    detail: 'Who gets pulled in, and when the bot should stop answering and hand over.',
  },
  {
    title: 'Category questions',
    detail: 'Extra questions tailored to the server type, so a shop is not asked about SaaS onboarding.',
  },
  {
    title: 'Channels',
    detail: 'Pick the channels that matter for knowledge, announcements and transcripts.',
  },
  {
    title: 'Summary',
    detail: 'Everything you answered, on one screen, editable before it is compiled.',
  },
  {
    title: 'Live test',
    detail:
      'Simulate replies against the rules you just built and see how they read — before anything goes live.',
  },
];

export function WizardWalkthrough() {
  return (
    <SectionShell
      eyebrow="Guided setup"
      title="A wizard that reads your server, not your members."
      lede="Setting up an AI assistant usually means staring at an empty prompt box. Cyron starts by looking at how your server is laid out, proposes a starting point, and lets you correct every word of it."
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-8">
        <div className="grid gap-5">
          <Reveal className="cyron-glass p-6 md:p-7">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-[#0c0c0d] text-amber-400/90">
                <Radar className="h-[18px] w-[18px]" strokeWidth={1.5} aria-hidden />
              </div>
              <div>
                <MetaTag tone="amber">Step 1 · optional</MetaTag>
                <h3 className="mt-1.5 text-lg font-semibold text-white">The structure scan</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-white/45">
                  A single pass over the shape of your server. It looks at names and layout, then
                  proposes what kind of server this is.
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-xl bg-white/[0.04] p-4">
              <MetaTag>What it reads</MetaTag>
              <ul className="mt-3 space-y-1.5">
                {SCAN_READS.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-[12.5px] text-white/50">
                    <span
                      aria-hidden
                      className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-amber-400/70"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4 flex items-start gap-3 rounded-xl border border-amber-400/25 bg-amber-400/[0.06] p-4">
              <EyeOff className="mt-0.5 h-[18px] w-[18px] shrink-0 text-amber-400" strokeWidth={1.5} aria-hidden />
              <p className="text-[12.5px] leading-relaxed text-white/60">
                <span className="font-semibold text-white">It never reads message content.</span>{' '}
                Structure only — names, categories, roles and the voice-to-text mix. The proposal is
                pure heuristics, so nothing about your server is sent to a model at this step.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.12} className="cyron-glass p-6 md:p-7">
            <MetaTag tone="amber">What comes back</MetaTag>
            <div className="mt-4 space-y-4">
              {SCAN_OUTPUT.map((row) => (
                <div key={row.label}>
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="text-[13.5px] font-semibold text-white">{row.label}</span>
                    <span className="font-mono text-[11px] text-amber-400/80">{row.value}</span>
                  </div>
                  <p className="mt-1.5 text-[12.5px] leading-relaxed text-white/40">{row.note}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 flex items-start gap-3 border-t border-white/10 pt-5">
              <SkipForward className="mt-0.5 h-[18px] w-[18px] shrink-0 text-amber-400/90" strokeWidth={1.5} aria-hidden />
              <p className="text-[12.5px] leading-relaxed text-white/45">
                Want none of it? Skip the scan entirely and fill every field in yourself. The
                proposal is a suggestion, never a decision.
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.08} className="cyron-glass p-6 md:p-7">
          <div className="flex items-center justify-between gap-4">
            <MetaTag tone="amber">The walkthrough</MetaTag>
            <MetaTag>{STEPS.length} stops</MetaTag>
          </div>

          <div className="relative mt-6">
            <div
              aria-hidden
              className="absolute left-[13px] top-2 h-[calc(100%-1rem)] w-px bg-gradient-to-b from-amber-400/30 via-white/10 to-transparent"
            />
            <ol className="space-y-5">
              {STEPS.map((step, index) => (
                <li key={step.title} className="relative flex items-start gap-4">
                  <span className="relative z-10 flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-lg border border-white/10 bg-[#0c0c0d] font-mono text-[10px] tabular-nums text-amber-400/90">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="text-[13.5px] font-semibold text-white">{step.title}</h3>
                    <p className="mt-1 text-[12.5px] leading-relaxed text-white/40">{step.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-7 flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-4">
            <FlaskConical className="mt-0.5 h-[18px] w-[18px] shrink-0 text-amber-400" strokeWidth={1.5} aria-hidden />
            <p className="text-[12.5px] leading-relaxed text-white/55">
              <span className="font-semibold text-white">Nothing goes live untested.</span> The last
              stop simulates replies against your new rules, and at the end the wizard compiles your
              answers into General Rules plus problem and solution knowledge entries.
            </p>
          </div>
        </Reveal>
      </div>
    </SectionShell>
  );
}
