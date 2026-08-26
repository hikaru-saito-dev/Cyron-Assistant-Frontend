import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Reveal, SectionShell } from './SectionShell';

const CLAIMS = [
  {
    tag: 'Grounding',
    body: 'Answers are assembled only from knowledge entries you wrote. Every candidate is scored for similarity first, and weak matches are left out of the prompt entirely rather than paraphrased into a guess.',
    href: '/docs',
    linkLabel: 'Read the AI & Knowledge docs',
  },
  {
    tag: 'Token cost',
    body: 'Every AI reply prints the tokens it consumed directly underneath itself in the ticket. There is no hidden meter and no end-of-month surprise.',
    href: '/how-it-works',
    linkLabel: 'See how a reply is built',
  },
  {
    tag: 'Published limits',
    body: 'Each plan states its exact monthly token allowance, daily ticket count, concurrent sessions and knowledge capacity. No "fair use" wording, no asterisks.',
    href: '/premium',
    linkLabel: 'Compare the plans',
  },
  {
    tag: 'Setup privacy',
    body: 'The optional server scan reads structure only — category names, channel names, the voice-to-text mix and role names. It does not read message content, and you can skip it and fill everything in by hand.',
    href: '/how-it-works',
    linkLabel: 'See what the scan reads',
  },
  {
    tag: 'Human override',
    body: 'The instant a staff member types in a ticket, the AI stops replying there. It stays silent until someone explicitly runs /ticket ai resume.',
    href: '/docs',
    linkLabel: 'Read the ticket commands',
  },
  {
    tag: 'Free tier',
    body: 'The Free plan needs no card and does not expire. Paid plans are billed per Discord server, so one community can stay free while another runs Pro.',
    href: '/premium',
    linkLabel: 'Open pricing',
  },
];

export function TrustChecklist() {
  return (
    <SectionShell
      eyebrow="Verify us"
      title="Check the claims yourself."
      lede="Six things server owners ask before they trust a bot with their support queue, each with the page that answers it."
    >
      <div className="cyron-glass divide-y divide-white/[0.06] overflow-hidden">
        {CLAIMS.map((claim, index) => (
          <Reveal key={claim.tag} delay={0.05 * index}>
            <div className="grid gap-3 px-5 py-5 transition-colors hover:bg-white/[0.02] md:grid-cols-[9rem_minmax(0,1fr)_auto] md:items-start md:gap-6 md:px-7 md:py-6">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-amber-400/90 md:pt-1">
                {claim.tag}
              </span>
              <p className="text-[13px] leading-relaxed text-white/55">{claim.body}</p>
              <Link
                to={claim.href}
                className="group inline-flex shrink-0 items-center gap-1.5 text-[12.5px] font-medium text-amber-300/90 transition-colors hover:text-amber-200 md:pt-0.5"
              >
                {claim.linkLabel}
                <ArrowRight
                  className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
                  strokeWidth={1.75}
                  aria-hidden
                />
              </Link>
            </div>
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}
