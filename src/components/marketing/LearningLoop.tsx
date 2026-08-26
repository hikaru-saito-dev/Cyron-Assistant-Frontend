import { ArrowRight, CopyMinus, Database, Eye, FileStack, Scissors, Sparkles, Wand2 } from 'lucide-react';
import { MetaTag, Reveal, SectionShell } from './SectionShell';

const FLOW = [
  {
    icon: FileStack,
    title: 'Past tickets',
    detail:
      'Upload HTML transcripts in the Ticket Tool style, or point Cyron at the history of a channel you already have.',
  },
  {
    icon: Sparkles,
    title: 'Extract',
    detail:
      'Recurring problems and the answers your staff actually gave are pulled out as problem and solution pairs.',
  },
  {
    icon: Eye,
    title: 'Review',
    detail:
      'Nothing is trusted blindly. You read the extracted pairs and decide what belongs in your knowledge base.',
  },
  {
    icon: Database,
    title: 'Knowledge base',
    detail:
      'Approved pairs become entries scoped to a context, ready for the next member who asks the same thing.',
  },
];

const TRANSCRIPT_LINES = [
  { role: 'member', text: 'my key stopped working after i reinstalled' },
  { role: 'staff', text: 'reset it from the dashboard, then re-run setup once' },
  { role: 'member', text: 'that fixed it, thanks' },
];

const EXTRACTED = {
  problem: 'License key stops working after a reinstall',
  solution: 'Reset the key from the dashboard, then run setup once more.',
};

const SUPPORT_CARDS = [
  {
    icon: CopyMinus,
    title: 'Deduplicated on ingest',
    detail:
      'Near-identical entries are rejected as they arrive, so importing the same batch twice does not double your knowledge base.',
  },
  {
    icon: Scissors,
    title: 'Split, not shredded',
    detail:
      'A long entry is broken into at most two logical chunks. Enough to keep retrieval sharp, not so many that context falls apart.',
  },
  {
    icon: Wand2,
    title: 'AUTO FORMAT, no commitment',
    detail:
      'Paste messy notes and let Cyron restructure them into a clean template. Nothing is saved until you say so.',
  },
];

export function LearningLoop() {
  return (
    <SectionShell
      eyebrow="Learn from history"
      title="Your old tickets already contain the answers."
      lede="Every server that has run support for a while is sitting on a pile of solved problems. Cyron reads that history, turns the repeating ones into knowledge entries, and hands them back to you for approval."
    >
      <div className="relative">
        <div
          aria-hidden
          className="absolute left-6 top-0 hidden h-full w-px bg-gradient-to-b from-amber-400/30 via-white/10 to-transparent lg:left-0 lg:top-[38px] lg:h-px lg:w-full lg:bg-gradient-to-r"
        />
        <div className="grid gap-6 lg:grid-cols-4 lg:gap-5">
          {FLOW.map((stage, index) => (
            <Reveal key={stage.title} delay={0.07 * index} className="relative">
              <div className="flex items-start gap-4 lg:flex-col lg:gap-0">
                <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-[#0c0c0d] text-amber-400/90">
                  <stage.icon className="h-5 w-5" strokeWidth={1.5} aria-hidden />
                </div>
                <div className="lg:mt-5 lg:pr-6">
                  <div className="flex items-center gap-2">
                    <h3 className="text-[15px] font-semibold text-white">{stage.title}</h3>
                    {index < FLOW.length - 1 && (
                      <ArrowRight
                        className="hidden h-3.5 w-3.5 text-white/20 lg:inline"
                        strokeWidth={1.5}
                        aria-hidden
                      />
                    )}
                  </div>
                  <p className="mt-2 text-[13px] leading-relaxed text-white/45">{stage.detail}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      <div className="mt-14 grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <Reveal className="cyron-glass p-6 md:p-7">
          <div className="flex items-center justify-between gap-4">
            <MetaTag tone="amber">Extraction, in practice</MetaTag>
            <MetaTag>archived transcript</MetaTag>
          </div>

          <div className="mt-5 rounded-xl border border-white/10 bg-black/40 p-4 font-mono text-[11.5px] leading-relaxed">
            {TRANSCRIPT_LINES.map((line) => (
              <p key={line.text} className="flex gap-2">
                <span
                  className={
                    line.role === 'staff' ? 'shrink-0 text-amber-400/80' : 'shrink-0 text-white/30'
                  }
                >
                  {line.role === 'staff' ? 'staff  ›' : 'member ›'}
                </span>
                <span className="text-white/50">{line.text}</span>
              </p>
            ))}
          </div>

          <div aria-hidden className="mx-auto my-3 h-5 w-px bg-gradient-to-b from-white/10 to-amber-400/40" />

          <div className="rounded-xl border border-amber-400/25 bg-amber-400/[0.05] p-4 font-mono text-[11.5px] leading-relaxed">
            <p className="text-amber-400/80">problem:</p>
            <p className="mt-0.5 text-white/60">{EXTRACTED.problem}</p>
            <p className="mt-3 text-amber-400/80">solution:</p>
            <p className="mt-0.5 text-white/60">{EXTRACTED.solution}</p>
          </div>

          <p className="mt-5 text-[12.5px] leading-relaxed text-white/35">
            One pair, pulled from a conversation your staff already had. Multiply that by a year of
            tickets and the knowledge base writes most of itself.
          </p>
        </Reveal>

        <div className="grid gap-5">
          <Reveal delay={0.12} className="cyron-glass p-6 md:p-7">
            <MetaTag tone="amber">Big imports</MetaTag>
            <h3 className="mt-2 text-lg font-semibold text-white">
              Large jobs run in the background
            </h3>
            <p className="mt-3 text-[13px] leading-relaxed text-white/45">
              Roughly 120 lines or more, or three or more sources, and the job is handed to OpenAI’s
              Batch API instead. It is cheaper, and it never competes with the replies your members
              are waiting on.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {['120+ lines', '3+ sources', 'Batch API', 'Nothing live blocked'].map((chip) => (
                <span
                  key={chip}
                  className="rounded-full bg-white/[0.05] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-white/35"
                >
                  {chip}
                </span>
              ))}
            </div>
          </Reveal>

          {SUPPORT_CARDS.map((card, index) => (
            <Reveal
              key={card.title}
              delay={0.18 + 0.06 * index}
              className="cyron-glass p-6 md:p-7"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-[#0c0c0d] text-amber-400/90">
                  <card.icon className="h-[18px] w-[18px]" strokeWidth={1.5} aria-hidden />
                </div>
                <div>
                  <h3 className="text-[15px] font-semibold text-white">{card.title}</h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-white/45">{card.detail}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
