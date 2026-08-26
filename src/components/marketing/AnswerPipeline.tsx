import { MessageSquare, Split, Search, Gauge, Send } from 'lucide-react';
import { Reveal, SectionShell } from './SectionShell';
import { cn } from '../../lib/utils';

const STAGES = [
  {
    icon: MessageSquare,
    title: 'Message arrives',
    detail:
      'Only inside a registered ticket channel, only from a member, only while the AI is not paused.',
  },
  {
    icon: Split,
    title: 'Intent is sorted',
    detail:
      'Small talk and "what can you do" get a templated reply with no knowledge lookup at all. Real questions go on.',
  },
  {
    icon: Search,
    title: 'Your knowledge is searched',
    detail:
      'The question is embedded and compared by meaning against your entries, then re-ranked so numbers and amounts have to match.',
  },
  {
    icon: Gauge,
    title: 'Confidence is scored',
    detail:
      'Weak matches are never injected into the prompt. The bot would rather ask a clarifying question than guess.',
  },
  {
    icon: Send,
    title: 'The answer is written',
    detail:
      'Your General Rules and the panel’s own context wrap the retrieved facts, with a hard instruction never to invent details.',
  },
];

const CONFIDENCE_TIERS = [
  {
    range: '0.55 +',
    label: 'High confidence',
    note: 'Answered straight from your knowledge base.',
    width: 'w-full',
    tone: 'bg-emerald-400/70',
  },
  {
    range: '0.25 – 0.55',
    label: 'Partial match',
    note: 'Knowledge is used as support, not as the whole answer.',
    width: 'w-2/3',
    tone: 'bg-amber-400/70',
  },
  {
    range: 'under 0.25',
    label: 'No match',
    note: 'Nothing is injected. The bot asks for detail or offers your staff.',
    width: 'w-1/4',
    tone: 'bg-white/25',
  },
];

export function AnswerPipeline() {
  return (
    <SectionShell
      eyebrow="Under the hood"
      title="Grounded answers, or no answer at all."
      lede="Most bots hand your members whatever the model feels like saying. Cyron scores how well it actually knows the answer first, and the thresholds are not a marketing metaphor — they are the numbers in the code."
    >
      <div className="relative">
        <div
          aria-hidden
          className="absolute left-6 top-0 hidden h-full w-px bg-gradient-to-b from-amber-400/30 via-white/10 to-transparent lg:left-0 lg:top-[38px] lg:h-px lg:w-full lg:bg-gradient-to-r"
        />
        <div className="grid gap-6 lg:grid-cols-5 lg:gap-4">
          {STAGES.map((stage, index) => (
            <Reveal key={stage.title} delay={0.06 * index} className="relative">
              <div className="flex items-start gap-4 lg:flex-col lg:gap-0">
                <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-[#0c0c0d] text-amber-400/90">
                  <stage.icon className="h-5 w-5" strokeWidth={1.5} aria-hidden />
                </div>
                <div className="lg:mt-5 lg:pr-4">
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/25">
                    Step {index + 1}
                  </p>
                  <h3 className="mt-1.5 text-[15px] font-semibold text-white">{stage.title}</h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-white/45">{stage.detail}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      <div className="mt-14 grid gap-5 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
        <Reveal className="cyron-glass p-6 md:p-7">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-amber-400/90">
            Confidence ladder
          </p>
          <h3 className="mt-2 text-lg font-semibold text-white">
            How sure it has to be before it speaks
          </h3>
          <div className="mt-6 space-y-5">
            {CONFIDENCE_TIERS.map((tier) => (
              <div key={tier.label}>
                <div className="flex items-baseline justify-between gap-4">
                  <span className="text-[13.5px] font-semibold text-white">{tier.label}</span>
                  <span className="font-mono text-[11.5px] tabular-nums text-white/40">
                    {tier.range}
                  </span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                  <div className={cn('h-full rounded-full', tier.width, tier.tone)} />
                </div>
                <p className="mt-2 text-[12.5px] leading-relaxed text-white/40">{tier.note}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <div className="grid gap-5">
          <Reveal delay={0.15} className="cyron-glass p-6 md:p-7">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-amber-400/90">
              Cost control
            </p>
            <h3 className="mt-2 text-lg font-semibold text-white">Repeat questions are free</h3>
            <p className="mt-3 text-[13px] leading-relaxed text-white/45">
              Short questions are cached for seven days. When the next member asks the same thing,
              the answer comes back from cache and costs you nothing.
            </p>
            <div className="mt-5 flex items-center gap-3 rounded-xl bg-white/[0.04] px-4 py-3">
              <span className="font-mono text-2xl font-semibold tabular-nums text-amber-400">0</span>
              <span className="text-[12.5px] leading-snug text-white/45">
                tokens billed on a cache hit
                <br />
                and on templated greetings
              </span>
            </div>
          </Reveal>

          <Reveal delay={0.22} className="cyron-glass p-6 md:p-7">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-amber-400/90">
              Guardrail
            </p>
            <h3 className="mt-2 text-lg font-semibold text-white">It cannot invent your policy</h3>
            <p className="mt-3 text-[13px] leading-relaxed text-white/45">
              Prices, refund windows and rules can only come from entries you wrote. If the answer
              is not in your knowledge base, the bot says so instead of improvising.
            </p>
          </Reveal>
        </div>
      </div>
    </SectionShell>
  );
}
