import { CreditCard, ExternalLink, CalendarDays, TicketPercent, Clock, Server } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { MetaTag, Reveal, SectionShell } from './SectionShell';
import { cn } from '../../lib/utils';

type Fact = {
  icon: LucideIcon;
  term: string;
  detail: string;
  /** Short mono value shown on the right of the tile header. */
  value?: string;
};

const FACTS: readonly Fact[] = [
  {
    icon: CreditCard,
    term: 'Stripe Checkout',
    detail:
      'Payment happens on Stripe’s own hosted page. Your card details are entered there and never touch Cyron.',
  },
  {
    icon: ExternalLink,
    term: 'Stripe Customer Portal',
    detail:
      'Upgrades, downgrades, invoices and cancellation all live in the Stripe portal. One click from the dashboard, no support ticket needed.',
  },
  {
    icon: CalendarDays,
    term: 'Monthly or annual',
    detail:
      'Annual billing costs two months less on both paid plans: Pro is $9 monthly or $90 yearly, Business is $20 monthly or $200 yearly.',
    value: '−2 months',
  },
  {
    icon: TicketPercent,
    term: 'Promotion codes',
    detail:
      'Discount codes are accepted at checkout. If you were given one, there is a field for it on the Stripe page.',
  },
  {
    icon: Clock,
    term: 'Counter resets',
    detail:
      'Monthly AI tokens reset on the 1st of the month at 00:00 UTC. Daily ticket counters reset every day at 00:00 UTC.',
    value: '00:00 UTC',
  },
  {
    icon: Server,
    term: 'Billed per Discord server',
    detail:
      'A plan applies to one server, so you can leave a side project on Free while your main community runs on Pro.',
  },
];

const PRICE_ROWS: readonly { plan: string; monthly: string; yearly: string; accent?: boolean }[] = [
  { plan: 'Free', monthly: '$0', yearly: '$0' },
  { plan: 'Pro', monthly: '$9', yearly: '$90', accent: true },
  { plan: 'Business', monthly: '$20', yearly: '$200' },
];

export function BillingFacts() {
  return (
    <SectionShell
      eyebrow="Billing facts"
      title="The boring details, stated plainly."
      lede="Everything about how money moves, in one place — because the last thing you want on a pricing page is a surprise."
    >
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,320px)]">
        <div className="grid gap-5 sm:grid-cols-2">
          {FACTS.map((fact, index) => (
            <Reveal key={fact.term} delay={0.05 * index} className="cyron-glass h-full p-6 md:p-7">
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-[#0c0c0d] text-amber-400/90">
                  <fact.icon className="h-[18px] w-[18px]" strokeWidth={1.5} aria-hidden />
                </div>
                {fact.value && (
                  <span className="font-mono text-[11px] uppercase tracking-[0.14em] tabular-nums text-white/30">
                    {fact.value}
                  </span>
                )}
              </div>
              <h3 className="mt-4 text-[14.5px] font-semibold text-white">{fact.term}</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-white/45">{fact.detail}</p>
            </Reveal>
          ))}
        </div>

        <div className="grid content-start gap-5">
          <Reveal delay={0.12} className="cyron-glass p-6 md:p-7">
            <MetaTag tone="amber">Price sheet</MetaTag>
            <h3 className="mt-2 text-lg font-semibold text-white">Monthly against annual</h3>
            <dl className="mt-5 space-y-3">
              <div className="flex items-baseline justify-between gap-4 pb-1">
                <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/25">
                  Plan
                </dt>
                <dd className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/25">
                  Month · Year
                </dd>
              </div>
              {PRICE_ROWS.map((row) => (
                <div
                  key={row.plan}
                  className="flex items-baseline justify-between gap-4 border-t border-white/[0.07] pt-3"
                >
                  <dt
                    className={cn(
                      'text-[13.5px] font-semibold',
                      row.accent ? 'text-amber-300/90' : 'text-white',
                    )}
                  >
                    {row.plan}
                  </dt>
                  <dd className="font-mono text-[13.5px] tabular-nums text-white/60">
                    {row.monthly}
                    <span className="px-1.5 text-white/20">·</span>
                    {row.yearly}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-5 text-[12.5px] leading-relaxed text-white/35">
              Free needs no card at all. You can install the bot, build a panel and let the AI
              answer questions before you ever open a payment page.
            </p>
          </Reveal>

          <Reveal delay={0.2} className="cyron-glass p-6 md:p-7">
            <MetaTag>What we never hold</MetaTag>
            <p className="mt-3 text-[13px] leading-relaxed text-white/45">
              Card numbers, expiry dates and CVCs are handled entirely by Stripe. Cyron stores the
              subscription state for your server and nothing more.
            </p>
          </Reveal>
        </div>
      </div>
    </SectionShell>
  );
}
