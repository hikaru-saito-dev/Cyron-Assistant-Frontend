import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Database, MessageCircle, FileSearch, Ticket } from 'lucide-react';
import { MetaTag, Reveal, SectionShell } from './SectionShell';
import { cn } from '../../lib/utils';

type Mix = {
  id: string;
  label: string;
  /** Percentages of answered questions, must total 100. */
  cached: number;
  templated: number;
  billed: number;
};

const MIXES: readonly Mix[] = [
  { id: 'repeat', label: 'Mostly repeat questions', cached: 55, templated: 20, billed: 25 },
  { id: 'balanced', label: 'Balanced mix', cached: 35, templated: 20, billed: 45 },
  { id: 'new', label: 'Mostly new questions', cached: 15, templated: 15, billed: 70 },
];

const BANDS = [
  {
    key: 'cached' as const,
    label: 'Served from the seven-day cache',
    cost: '0 tokens',
    tone: 'bg-amber-400/75',
    swatch: 'bg-amber-400/75',
  },
  {
    key: 'templated' as const,
    label: 'Greetings and “what can you do”',
    cost: '0 tokens',
    tone: 'bg-amber-400/30',
    swatch: 'bg-amber-400/30',
  },
  {
    key: 'billed' as const,
    label: 'Written by the model',
    cost: 'draws from your budget',
    tone: 'bg-white/[0.18]',
    swatch: 'bg-white/[0.18]',
  },
];

const SAVERS = [
  {
    icon: Database,
    title: 'Repeat questions cost nothing',
    detail:
      'Short questions are cached for seven days. The next member who asks the same thing gets the stored answer, and no tokens are spent.',
  },
  {
    icon: MessageCircle,
    title: 'Small talk never reaches the model',
    detail:
      'Greetings and “what can you do” are answered from a template. There is no knowledge lookup and no token spend behind them.',
  },
  {
    icon: FileSearch,
    title: 'Only matching knowledge is sent',
    detail:
      'Your whole knowledge base is never pasted into the prompt. Entries are retrieved by meaning, and weak matches are left out entirely.',
  },
];

const STILL_WORKS = [
  'Ticket panels keep opening tickets',
  'Claiming, priorities and support hours',
  'Closing, transcripts and logging',
  'Ticket forms and idle auto-close',
];

export function TokenBudget() {
  const [activeId, setActiveId] = useState<string>(MIXES[0].id);
  const reduceMotion = useReducedMotion();
  const mix = MIXES.find((entry) => entry.id === activeId) ?? MIXES[0];

  return (
    <SectionShell
      eyebrow="Token budget"
      title="A budget you can watch being spent."
      lede="“50,000 tokens” means nothing on its own. Tokens are consumed when the AI writes a reply, the count for that reply is printed underneath it in Discord, and three separate mechanisms keep most conversations off the meter entirely."
    >
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <Reveal className="cyron-glass p-6 md:p-7">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <MetaTag tone="amber">Where replies come from</MetaTag>
            <MetaTag>Illustration, not a guarantee</MetaTag>
          </div>
          <h3 className="mt-2 text-lg font-semibold text-white">
            Most answers are handed over for free
          </h3>

          <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Example question mix">
            {MIXES.map((entry) => {
              const active = entry.id === mix.id;
              return (
                <button
                  key={entry.id}
                  type="button"
                  onClick={() => setActiveId(entry.id)}
                  aria-pressed={active}
                  className={cn(
                    'rounded-full border px-3.5 py-1.5 text-[12px] transition-colors duration-200',
                    active
                      ? 'border-amber-400/40 bg-amber-400/10 text-amber-200/90'
                      : 'border-white/10 bg-white/[0.03] text-white/45 hover:border-white/20 hover:text-white/70',
                  )}
                >
                  {entry.label}
                </button>
              );
            })}
          </div>

          <div className="mt-6 flex h-3 w-full overflow-hidden rounded-full bg-white/[0.05]">
            {BANDS.map((band) => (
              <motion.div
                key={band.key}
                className={cn('h-full', band.tone)}
                initial={false}
                animate={{ width: `${mix[band.key]}%` }}
                transition={
                  reduceMotion
                    ? { duration: 0 }
                    : { duration: 0.55, ease: [0.22, 0.61, 0.36, 1] }
                }
              />
            ))}
          </div>

          <dl className="mt-6 space-y-3.5">
            {BANDS.map((band) => (
              <div key={band.key} className="flex items-start gap-3">
                <span
                  aria-hidden
                  className={cn('mt-1.5 h-2 w-2 shrink-0 rounded-full', band.swatch)}
                />
                <dt className="flex-1 text-[13px] leading-relaxed text-white/55">
                  {band.label}
                  <span className="mt-0.5 block text-[12px] text-white/35">{band.cost}</span>
                </dt>
                <dd className="font-mono text-[13.5px] tabular-nums text-white/70">
                  {mix[band.key]}%
                </dd>
              </div>
            ))}
          </dl>

          <p className="mt-6 text-[12.5px] leading-relaxed text-white/35">
            These three mixes are rough examples to show the shape of the spend, not a promise about
            your server. Your real split depends on how repetitive your questions are.
          </p>
        </Reveal>

        <div className="grid gap-5">
          <Reveal delay={0.12} className="cyron-glass p-6 md:p-7">
            <MetaTag tone="amber">Nothing is hidden</MetaTag>
            <h3 className="mt-2 text-lg font-semibold text-white">
              The cost is printed under the reply
            </h3>
            <p className="mt-3 text-[13px] leading-relaxed text-white/45">
              Every AI answer in Discord carries its own token count. You never have to guess where
              a month went, and you can read the spend of a single conversation in the channel
              itself.
            </p>
            <div className="mt-5 rounded-xl bg-white/[0.04] px-4 py-3">
              <p className="text-[13px] leading-relaxed text-white/60">
                Our staff are around from 09:00 to 18:00 CET, Monday to Friday.
              </p>
              <p className="mt-2 font-mono text-[11px] tabular-nums text-white/30">
                412 tokens
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.2} className="cyron-glass p-6 md:p-7">
            <MetaTag tone="amber">When the budget is gone</MetaTag>
            <h3 className="mt-2 text-lg font-semibold text-white">
              The AI stops. Your tickets do not.
            </h3>
            <p className="mt-3 text-[13px] leading-relaxed text-white/45">
              Run out of monthly tokens and the AI simply stops writing replies until the counter
              resets on the 1st. Everything your staff touches keeps running exactly as before.
            </p>
            <ul className="mt-5 space-y-2.5">
              {STILL_WORKS.map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <Ticket
                    className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400/80"
                    strokeWidth={1.5}
                    aria-hidden
                  />
                  <span className="text-[13px] leading-relaxed text-white/55">{item}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>

      <div className="mt-5 grid gap-5 md:grid-cols-3">
        {SAVERS.map((saver, index) => (
          <Reveal key={saver.title} delay={0.08 * index} className="cyron-glass p-6 md:p-7">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-[#0c0c0d] text-amber-400/90">
              <saver.icon className="h-5 w-5" strokeWidth={1.5} aria-hidden />
            </div>
            <h3 className="mt-5 text-[15px] font-semibold text-white">{saver.title}</h3>
            <p className="mt-2 text-[13px] leading-relaxed text-white/45">{saver.detail}</p>
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}
