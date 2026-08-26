import { Check } from 'lucide-react';
import { Reveal, SectionShell, MetaTag } from './SectionShell';
import { cn } from '../../lib/utils';

type Triple = readonly [string, string, string];

const PLANS = [
  { name: 'Free', price: '$0', cadence: 'forever', note: 'No card required', accent: false },
  { name: 'Pro', price: '$9', cadence: 'per month', note: '$90 billed yearly', accent: true },
  { name: 'Business', price: '$20', cadence: 'per month', note: '$200 billed yearly', accent: false },
] as const;

const LIMIT_ROWS: readonly { label: string; hint: string; values: Triple }[] = [
  {
    label: 'Monthly AI tokens',
    hint: 'Resets on the 1st, 00:00 UTC',
    values: ['50,000', '1,500,000', '3,000,000'],
  },
  {
    label: 'Concurrent AI sessions',
    hint: 'Tickets the AI can answer at once',
    values: ['1', '3', '3'],
  },
  {
    label: 'Daily tickets',
    hint: 'New tickets opened per day',
    values: ['10', '50', '100'],
  },
  {
    label: 'Knowledge entries',
    hint: 'Separate documents you can store',
    values: ['2', '5', '10'],
  },
  {
    label: 'Total knowledge characters',
    hint: 'Across every entry combined',
    values: ['20,000', '50,000', '100,000'],
  },
  {
    label: 'Characters per entry',
    hint: 'Same ceiling on every plan',
    values: ['6,000', '6,000', '6,000'],
  },
];

const SHARED_CAPABILITIES = [
  'Unlimited ticket panels',
  'Unlimited AI contexts',
  'Per-panel AI isolation',
  'Knowledge grounding with confidence scoring',
  'Seven-day answer cache',
  'Multi-language replies',
  'Usage analytics',
  'Ticket forms',
  'Support hours',
  'Claiming and priorities',
  'Idle auto-close',
] as const;

/** Amber column treatment for Pro, the plan most servers land on. */
function accentCell(index: number, edge?: 'top' | 'bottom') {
  if (!PLANS[index].accent) return undefined;
  return cn(
    'border-x border-amber-400/20 bg-amber-400/[0.045]',
    edge === 'top' && 'border-t border-t-amber-400/25',
    edge === 'bottom' && 'border-b border-b-amber-400/25',
  );
}

export function PlanComparison() {
  return (
    <SectionShell
      eyebrow="Plan comparison"
      title="Every limit, written out in full."
      lede="No asterisks and no “contact us for details”. These are the exact ceilings published for each plan, and everything below the limits is identical on all three."
    >
      {/* Desktop: real table, plans as columns */}
      <Reveal className="hidden lg:block">
        <div className="cyron-glass overflow-hidden p-2">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr>
                <th scope="col" className="w-[34%] px-5 pb-5 pt-4 align-bottom">
                  <MetaTag>Limits per Discord server</MetaTag>
                </th>
                {PLANS.map((plan, index) => (
                  <th
                    key={plan.name}
                    scope="col"
                    className={cn(
                      'px-5 pb-5 pt-4 align-bottom',
                      accentCell(index, 'top'),
                      PLANS[index].accent && 'rounded-t-xl',
                    )}
                  >
                    <div className="flex items-baseline gap-2">
                      <span className="text-[15px] font-semibold text-white">{plan.name}</span>
                      {plan.accent && (
                        <span className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-amber-400/90">
                          common
                        </span>
                      )}
                    </div>
                    <p className="mt-2 font-mono text-2xl font-semibold tabular-nums text-white">
                      {plan.price}
                    </p>
                    <p className="mt-1 text-[12px] leading-snug text-white/40">
                      {plan.cadence}
                      <br />
                      {plan.note}
                    </p>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {LIMIT_ROWS.map((row) => (
                <tr key={row.label} className="border-t border-white/[0.07]">
                  <th scope="row" className="px-5 py-4 font-normal">
                    <span className="text-[13.5px] font-semibold text-white">{row.label}</span>
                    <span className="mt-1 block text-[12px] leading-relaxed text-white/35">
                      {row.hint}
                    </span>
                  </th>
                  {row.values.map((value, index) => (
                    <td
                      key={PLANS[index].name}
                      className={cn(
                        'px-5 py-4 font-mono text-[15px] tabular-nums',
                        PLANS[index].accent ? 'text-amber-300/90' : 'text-white/70',
                        accentCell(index),
                      )}
                    >
                      {value}
                    </td>
                  ))}
                </tr>
              ))}

              <tr className="border-t border-white/[0.07]">
                <td colSpan={4} className="px-5 pb-3 pt-6">
                  <MetaTag tone="amber">Included on every plan</MetaTag>
                </td>
              </tr>
              {SHARED_CAPABILITIES.map((capability, rowIndex) => (
                <tr key={capability} className="border-t border-white/[0.05]">
                  <th scope="row" className="px-5 py-3 text-[13px] font-normal text-white/60">
                    {capability}
                  </th>
                  {PLANS.map((plan, index) => (
                    <td
                      key={plan.name}
                      className={cn(
                        'px-5 py-3',
                        accentCell(
                          index,
                          rowIndex === SHARED_CAPABILITIES.length - 1 ? 'bottom' : undefined,
                        ),
                        plan.accent &&
                          rowIndex === SHARED_CAPABILITIES.length - 1 &&
                          'rounded-b-xl',
                      )}
                    >
                      <Check className="h-4 w-4 text-emerald-400/80" strokeWidth={1.5} aria-hidden />
                      <span className="sr-only">Included on {plan.name}</span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Reveal>

      {/* Mobile: stacked per-plan cards */}
      <div className="grid gap-5 lg:hidden">
        {PLANS.map((plan, planIndex) => (
          <Reveal
            key={plan.name}
            delay={0.06 * planIndex}
            className={cn(
              'cyron-glass p-6 md:p-7',
              plan.accent && 'border-amber-400/30 bg-amber-400/[0.045]',
            )}
          >
            <div className="flex items-baseline justify-between gap-4">
              <div>
                <p className="text-[15px] font-semibold text-white">{plan.name}</p>
                <p className="mt-1 text-[12px] text-white/40">{plan.note}</p>
              </div>
              <div className="text-right">
                <p className="font-mono text-2xl font-semibold tabular-nums text-white">
                  {plan.price}
                </p>
                <p className="mt-0.5 text-[11.5px] text-white/35">{plan.cadence}</p>
              </div>
            </div>
            <dl className="mt-5 space-y-2.5 border-t border-white/[0.07] pt-5">
              {LIMIT_ROWS.map((row) => (
                <div key={row.label} className="flex items-baseline justify-between gap-4">
                  <dt className="text-[13px] text-white/55">{row.label}</dt>
                  <dd
                    className={cn(
                      'font-mono text-[13.5px] tabular-nums',
                      plan.accent ? 'text-amber-300/90' : 'text-white/70',
                    )}
                  >
                    {row.values[planIndex]}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        ))}

        <Reveal delay={0.2} className="cyron-glass p-6 md:p-7">
          <MetaTag tone="amber">Included on every plan</MetaTag>
          <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
            {SHARED_CAPABILITIES.map((capability) => (
              <li key={capability} className="flex items-start gap-2.5">
                <Check
                  className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400/80"
                  strokeWidth={1.5}
                  aria-hidden
                />
                <span className="text-[13px] leading-relaxed text-white/55">{capability}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </SectionShell>
  );
}
