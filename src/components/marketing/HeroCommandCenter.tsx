import type { ReactNode } from 'react';
import { useId } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import TextLoop from '../ui/text-loop';
import {
  DiscordFrame,
  DiscordMessage,
  DiscordText,
  TokenFooter,
} from './DiscordMockup';
import { cn } from '../../lib/utils';

const STATUS = [
  { label: 'Grounded replies', live: true },
  { label: '7-day answer cache', live: false },
  { label: 'Staff override', live: false },
  { label: 'Never invents policy', live: false },
];

const ACTIVITY = [
  { time: '14:02:11', text: 'Ticket #4418 opened', tone: 'muted' as const },
  { time: '14:02:14', text: 'Knowledge match · high', tone: 'amber' as const },
  { time: '14:02:16', text: 'Grounded reply · 1,148 tokens', tone: 'ok' as const },
  { time: '14:03:02', text: 'Claimed by mika · AI paused', tone: 'muted' as const },
  { time: '14:41:08', text: 'Closed · refund processed', tone: 'ok' as const },
];

const COMMANDS = ['/new', '/ticket claim', '/ticket ai pause', '/ticket close'];

const CONFIDENCE = [
  { label: 'High', range: '≥ 0.55', pct: 70, tone: 'bg-amber-400' },
  { label: 'Partial', range: '0.25–0.55', pct: 18, tone: 'bg-amber-400/40' },
  { label: 'None', range: '< 0.25', pct: 12, tone: 'bg-white/20' },
];

const TILES = [
  {
    kicker: 'Retrieval',
    title: 'Meaning, not keywords',
    detail: 'Each question is embedded and scored against your knowledge before anything is said.',
    spark: [18, 22, 19, 28, 31, 27, 36, 41, 38, 48, 52, 49],
  },
  {
    kicker: 'Spend',
    title: 'Repeat questions are free',
    detail: 'Short FAQ hits stay in cache for seven days and bill 0 tokens on the next ask.',
    spark: [42, 40, 38, 30, 22, 18, 14, 12, 10, 8, 6, 4],
  },
  {
    kicker: 'Isolation',
    title: 'One brief per panel',
    detail: 'Billing and partnership tickets never share a knowledge lane.',
    spark: [12, 16, 15, 22, 28, 27, 33, 31, 38, 44, 42, 48],
  },
  {
    kicker: 'Control',
    title: 'Staff always win',
    detail: 'The first staff message silences the AI until someone runs /ticket ai resume.',
    spark: [30, 28, 32, 24, 20, 18, 14, 22, 16, 12, 10, 8],
  },
];

export function HeroCommandCenter() {
  const { isAuthenticated, loginWithDiscord } = useAuth();
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();

  const handlePrimary = () => {
    if (isAuthenticated) navigate('/dashboard');
    else loginWithDiscord();
  };

  return (
    <section className="relative overflow-hidden bg-transparent px-4 pb-8 pt-28 sm:px-6 md:pt-32 lg:min-h-[100svh] lg:pb-12">
      <div
        aria-hidden
        className="pointer-events-none absolute left-[58%] top-[42%] h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl opacity-50"
        style={{
          background:
            'radial-gradient(circle, rgba(245,166,35,0.16) 0%, rgba(245,166,35,0.04) 42%, transparent 70%)',
        }}
      />

      <div className="relative z-10 mx-auto w-full max-w-6xl">
        <div className="mb-8 flex flex-wrap items-center gap-x-5 gap-y-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 backdrop-blur-xl sm:px-5">
          {STATUS.map((item, index) => (
            <span key={item.label} className="flex items-center gap-4">
              {index > 0 && <span className="hidden h-3 w-px bg-white/10 sm:block" />}
              <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-white/45">
                <span
                  className={cn(
                    'h-1.5 w-1.5 rounded-full',
                    item.live ? 'bg-emerald-400 cyron-pulse-dot' : 'bg-amber-400/70',
                  )}
                />
                {item.label}
              </span>
            </span>
          ))}
        </div>

        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-8 xl:gap-12">
          <div>
            <span className="cyron-glass inline-flex items-center rounded-full px-4 py-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-white/55">
              AI-powered support
            </span>

            <h1 className="mt-6 font-display text-[2.35rem] font-semibold leading-[0.95] tracking-tighter text-white sm:text-5xl md:text-6xl lg:text-[3.65rem]">
              <TextLoop
                staticText="Powering smarter"
                rotatingTexts={['tickets', 'replies', 'support']}
                staticTextClassName="text-white"
                className="!mx-0 !justify-start font-display text-[inherit] font-semibold leading-none tracking-tighter md:text-[inherit] lg:text-[inherit]"
              />
              <span className="mt-1 block text-white/90">for your community</span>
            </h1>

            <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-white/55 md:text-base">
              Grounded AI answers, instant ticket panels, and seamless handoffs. All from one
              dashboard built for Discord communities.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button type="button" className="cyron-btn-primary" onClick={handlePrimary}>
                {isAuthenticated ? 'Open dashboard' : 'Get Started'}
              </button>
              <a href="/docs" className="cyron-btn-ghost">
                Docs
              </a>
            </div>

            <p className="mt-5 font-mono text-[10.5px] uppercase tracking-[0.16em] text-white/28">
              Free plan · no card · live in minutes
            </p>
          </div>

          <div className="relative lg:min-h-[560px]">
            <HudRings />

            <div className="relative z-10 mx-auto max-w-[380px]">
              <DiscordFrame channel="ticket-4418" topic="General Support" className="shadow-[0_0_80px_-24px_rgba(245,166,35,0.45)]">
                <DiscordMessage author="aurelia.draws" timestamp="2:13 PM">
                  <DiscordText>how long do I have to ask for a refund?</DiscordText>
                </DiscordMessage>
                <DiscordMessage author="Cyron Assistant" isApp timestamp="2:13 PM">
                  <DiscordText>
                    Refunds are available within 14 days of your purchase. Send your order ID in this
                    ticket and a staff member will process it.
                  </DiscordText>
                  <TokenFooter tokens="1,148" />
                </DiscordMessage>
              </DiscordFrame>
            </div>

            <FloatCard
              className="lg:absolute lg:-left-6 lg:top-6 lg:w-[220px]"
              delay={0.15}
              reduceMotion={!!reduceMotion}
            >
              <ConfidenceCard />
            </FloatCard>

            <FloatCard
              className="mt-4 lg:absolute lg:-right-4 lg:top-10 lg:mt-0 lg:w-[230px]"
              delay={0.25}
              reduceMotion={!!reduceMotion}
            >
              <SparklineCard />
            </FloatCard>

            <FloatCard
              className="mt-4 lg:absolute lg:-left-8 lg:bottom-16 lg:mt-0 lg:w-[240px]"
              delay={0.35}
              reduceMotion={!!reduceMotion}
            >
              <LogCard />
            </FloatCard>

            <FloatCard
              className="mt-4 lg:absolute lg:-right-6 lg:bottom-10 lg:mt-0 lg:w-[210px]"
              delay={0.45}
              reduceMotion={!!reduceMotion}
            >
              <CommandsCard />
            </FloatCard>
          </div>
        </div>

        <div className="mt-10 flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2.5 backdrop-blur-xl sm:px-5">
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400 cyron-pulse-dot" />
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">
            Grounded · cached · staff-overridable
          </span>
          <Waveform />
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {TILES.map((tile, index) => (
            <motion.div
              key={tile.title}
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.08, duration: 0.5 }}
              className="cyron-glass cyron-glass-hover p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-amber-400/90">
                  {tile.kicker}
                </p>
                <Sparkline points={tile.spark} className="h-8 w-[72px] text-amber-400/80" />
              </div>
              <h2 className="mt-3 text-[14px] font-semibold text-white">{tile.title}</h2>
              <p className="mt-1.5 text-[12px] leading-relaxed text-white/40">{tile.detail}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FloatCard({
  children,
  className,
  delay,
  reduceMotion,
}: {
  children: ReactNode;
  className?: string;
  delay: number;
  reduceMotion: boolean;
}) {
  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.55, ease: [0.22, 0.61, 0.36, 1] }}
      className={cn('z-20', className)}
    >
      <div
        className={cn(
          'cyron-glass p-3.5 shadow-[0_18px_50px_-24px_rgba(0,0,0,0.8)]',
          !reduceMotion && 'lg:animate-[heroFloat_6s_ease-in-out_infinite]',
        )}
        style={!reduceMotion ? { animationDelay: `${delay * 1.4}s` } : undefined}
      >
        {children}
      </div>
    </motion.div>
  );
}

function ConfidenceCard() {
  return (
    <>
      <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/35">Confidence</p>
      <div className="mt-3 flex items-center gap-3">
        <div
          className="relative h-[72px] w-[72px] shrink-0 rounded-full"
          style={{
            background:
              'conic-gradient(#F5A623 0 70%, rgba(245,166,35,0.35) 70% 88%, rgba(255,255,255,0.12) 88% 100%)',
            boxShadow: '0 0 24px rgba(245,166,35,0.25)',
          }}
        >
          <div className="absolute inset-[9px] flex flex-col items-center justify-center rounded-full bg-[#0c0c0d]">
            <span className="font-mono text-[13px] font-semibold tabular-nums text-white">0.55</span>
            <span className="font-mono text-[8px] uppercase tracking-wider text-white/35">high</span>
          </div>
        </div>
        <ul className="min-w-0 flex-1 space-y-1.5">
          {CONFIDENCE.map((row) => (
            <li key={row.label} className="flex items-center justify-between gap-2">
              <span className="text-[11px] text-white/55">{row.label}</span>
              <span className="font-mono text-[10px] tabular-nums text-white/35">{row.range}</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

function SparklineCard() {
  return (
    <>
      <div className="flex items-center justify-between gap-2">
        <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/35">Reply path</p>
        <span className="font-mono text-[9px] uppercase tracking-wider text-amber-400/80">cache</span>
      </div>
      <p className="mt-2 text-[20px] font-semibold tabular-nums text-white">
        0
        <span className="ml-1.5 text-[11px] font-normal text-white/40">tokens on a hit</span>
      </p>
      <Sparkline
        points={[8, 12, 10, 18, 14, 22, 28, 24, 36, 42, 38, 48]}
        className="mt-2 h-10 w-full text-amber-400"
        fill
      />
      <p className="mt-1.5 text-[10.5px] leading-snug text-white/35">
        Illustration of cached vs billed mix · not a live meter
      </p>
    </>
  );
}

function LogCard() {
  return (
    <>
      <div className="flex items-center justify-between">
        <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/35">Activity</p>
        <span className="font-mono text-[8px] uppercase tracking-[0.16em] text-white/25">
          Representative
        </span>
      </div>
      <ul className="mt-2.5 space-y-1.5">
        {ACTIVITY.map((row) => (
          <li key={row.time} className="flex items-baseline gap-2">
            <span className="shrink-0 font-mono text-[9.5px] tabular-nums text-white/25">
              {row.time}
            </span>
            <span
              className={cn(
                'truncate text-[11px]',
                row.tone === 'ok' && 'text-emerald-300/80',
                row.tone === 'amber' && 'text-amber-300/85',
                row.tone === 'muted' && 'text-white/50',
              )}
            >
              {row.text}
            </span>
          </li>
        ))}
      </ul>
    </>
  );
}

function CommandsCard() {
  return (
    <>
      <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/35">Staff commands</p>
      <ul className="mt-2.5 space-y-1.5">
        {COMMANDS.map((cmd) => (
          <li
            key={cmd}
            className="rounded-md bg-white/[0.04] px-2 py-1 font-mono text-[11px] text-amber-200/90"
          >
            {cmd}
          </li>
        ))}
      </ul>
    </>
  );
}

function Sparkline({
  points,
  className,
  fill = false,
}: {
  points: number[];
  className?: string;
  fill?: boolean;
}) {
  const id = useId();
  const w = 120;
  const h = 36;
  const max = Math.max(...points);
  const min = Math.min(...points);
  const span = max - min || 1;
  const coords = points.map((p, i) => {
    const x = (i / (points.length - 1)) * w;
    const y = h - ((p - min) / span) * (h - 4) - 2;
    return [x, y] as const;
  });
  const line = coords.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  const area = `${line} L${w},${h} L0,${h} Z`;
  const fillId = `${id}-spark`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={className} aria-hidden>
      <defs>
        <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F5A623" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#F5A623" stopOpacity="0" />
        </linearGradient>
      </defs>
      {fill && <path d={area} fill={`url(#${fillId})`} />}
      <path
        d={line}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
        strokeLinecap="round"
        style={{ filter: 'drop-shadow(0 0 6px rgba(245,166,35,0.45))' }}
      />
    </svg>
  );
}

function Waveform() {
  const bars = [4, 9, 6, 14, 8, 18, 11, 16, 7, 13, 5, 10, 15, 8, 12, 6, 14, 9, 7, 11];
  return (
    <div className="ml-auto hidden items-end gap-[3px] sm:flex" aria-hidden>
      {bars.map((h, i) => (
        <span
          key={i}
          className="w-[2px] rounded-full bg-amber-400/70"
          style={{ height: h, opacity: 0.35 + (i % 5) * 0.12 }}
        />
      ))}
    </div>
  );
}

function HudRings() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute left-1/2 top-1/2 hidden h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 lg:block"
    >
      <div className="absolute inset-0 rounded-full border border-amber-400/10" />
      <div className="absolute inset-8 rounded-full border border-white/[0.06]" />
      <div className="absolute inset-16 rounded-full border border-amber-400/15" />
      <div className="absolute inset-[88px] rounded-full border border-dashed border-white/[0.07]" />
      <div className="absolute left-1/2 top-0 h-8 w-px -translate-x-1/2 bg-gradient-to-b from-amber-400/40 to-transparent" />
      <div className="absolute bottom-0 left-1/2 h-8 w-px -translate-x-1/2 bg-gradient-to-t from-amber-400/40 to-transparent" />
    </div>
  );
}
