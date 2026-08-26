import { useEffect, useState, type ReactNode } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { SectionShell } from './SectionShell';
import {
  DiscordButtons,
  DiscordEmbed,
  DiscordFrame,
  DiscordMessage,
  DiscordText,
  TokenFooter,
  TypingIndicator,
} from './DiscordMockup';
import { cn } from '../../lib/utils';

const SCENE_DURATION_MS = 9000;

type Scene = {
  id: string;
  label: string;
  blurb: string;
  channel: string;
  topic: string;
  body: ReactNode;
};

const MEMBER = 'aurelia.draws';
const STAFF = 'mika';

const SCENES: Scene[] = [
  {
    id: 'opened',
    label: 'A ticket opens',
    blurb:
      'A member clicks your panel button and lands in a private channel. The welcome embed, the pings and every button label come from your panel settings.',
    channel: 'ticket-4418',
    topic: 'General Support',
    body: (
      <DiscordMessage author="Cyron Assistant" isApp timestamp="Today at 2:13 PM">
        <DiscordText muted>@{MEMBER}</DiscordText>
        <DiscordEmbed
          title="Ticket Created"
          description={
            <>
              Welcome <span className="text-amber-300">@{MEMBER}</span>! Please describe your issue
              and we&apos;ll get back to you.
            </>
          }
          fields={[
            { name: 'Category', value: 'General Support' },
            { name: 'Opened', value: '12 seconds ago' },
          ]}
        >
          <DiscordButtons
            buttons={[
              { label: 'Close', emoji: '🔒', tone: 'danger' },
              { label: 'Claim', emoji: '👤', tone: 'success' },
              { label: 'Add User', emoji: '➕' },
              { label: 'Transcript', emoji: '📜' },
            ]}
          />
        </DiscordEmbed>
      </DiscordMessage>
    ),
  },
  {
    id: 'answer',
    label: 'The AI answers',
    blurb:
      'Cyron searches your knowledge base by meaning, not keywords. It answers only from what you taught it, and prints the exact token cost under every reply.',
    channel: 'ticket-4418',
    topic: 'General Support',
    body: (
      <>
        <DiscordMessage author={MEMBER} timestamp="2:13 PM">
          <DiscordText>how long do I have to ask for a refund?</DiscordText>
        </DiscordMessage>
        <DiscordMessage author="Cyron Assistant" isApp timestamp="2:13 PM">
          <DiscordText>
            Refunds are available within 14 days of your purchase. Send your order ID in this ticket
            and a staff member will process it for you.
          </DiscordText>
          <TokenFooter tokens="1,148" />
        </DiscordMessage>
      </>
    ),
  },
  {
    id: 'escalate',
    label: 'Hard tickets reach a human',
    blurb:
      'When a member gets abusive or the question goes past your rules, Cyron hands off and pings exactly the support roles you configured. Never @everyone.',
    channel: 'ticket-4420',
    topic: 'Billing · priority: high',
    body: (
      <>
        <DiscordMessage author="lorenz_k" timestamp="4:02 PM">
          <DiscordText>this is the third time nobody has helped me</DiscordText>
        </DiscordMessage>
        <DiscordMessage author="Cyron Assistant" isApp timestamp="4:02 PM">
          <DiscordText>I&apos;m handing this ticket to the support team for further help.</DiscordText>
          <TokenFooter tokens="864" />
        </DiscordMessage>
        <DiscordMessage author="Cyron Assistant" isApp timestamp="4:02 PM">
          <DiscordText>
            Support team notified. <span className="text-amber-300">@Support</span>
          </DiscordText>
        </DiscordMessage>
      </>
    ),
  },
  {
    id: 'takeover',
    label: 'Staff take over cleanly',
    blurb:
      'The moment a staff member types, the AI goes quiet for that ticket — no talking over your team. It stays paused until someone runs /ticket ai resume.',
    channel: 'ticket-4420',
    topic: 'Billing · claimed by mika',
    body: (
      <>
        <DiscordMessage author={STAFF} timestamp="4:03 PM">
          <DiscordText>Hey, I&apos;ve got this one — pulling up your order now.</DiscordText>
        </DiscordMessage>
        <DiscordMessage author="Cyron Assistant" isApp timestamp="4:03 PM">
          <DiscordEmbed
            title="Ticket claimed"
            description="Ticket claimed by @mika. They will assist you shortly."
            footer="Claimed by mika"
          />
          <DiscordText muted>AI auto-reply paused · /ticket ai resume to re-enable</DiscordText>
        </DiscordMessage>
        <TypingIndicator name={STAFF} />
      </>
    ),
  },
  {
    id: 'close',
    label: 'Closing is deliberate',
    blurb:
      'Closing asks for a typed confirmation, records a reason, and can DM the transcript before the channel is removed. The message history stays on your dashboard.',
    channel: 'ticket-4418',
    topic: 'General Support · closing',
    body: (
      <>
        <DiscordMessage author="Cyron Assistant" isApp timestamp="2:41 PM">
          <DiscordEmbed
            title="Close Ticket"
            description={
              <span className="font-mono text-[12px] text-white/45">
                Type YES to confirm closing this ticket
              </span>
            }
          />
        </DiscordMessage>
        <DiscordMessage author={STAFF} timestamp="2:41 PM">
          <DiscordText>YES</DiscordText>
        </DiscordMessage>
        <DiscordMessage author="Cyron Assistant" isApp timestamp="2:41 PM">
          <DiscordText>
            Ticket closed by <span className="text-amber-300">@mika</span>. Reason: refund processed.
          </DiscordText>
          <DiscordText muted>This channel will be deleted in a few seconds.</DiscordText>
        </DiscordMessage>
      </>
    ),
  },
];

export function TicketScenePlayer() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!autoplay || reduceMotion) return;
    const timer = window.setTimeout(
      () => setActiveIndex((index) => (index + 1) % SCENES.length),
      SCENE_DURATION_MS,
    );
    return () => window.clearTimeout(timer);
  }, [activeIndex, autoplay, reduceMotion]);

  const activeScene = SCENES[activeIndex];

  return (
    <SectionShell
      eyebrow="In your server"
      title="Five moments from a ticket's life."
      lede="Pick a moment or let them play. Every embed title, button label and message below is what the bot actually sends."
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-8">
        <div className="cyron-glass overflow-hidden p-1.5">
          {SCENES.map((scene, index) => {
            const isActive = index === activeIndex;
            return (
              <button
                key={scene.id}
                type="button"
                onClick={() => {
                  setActiveIndex(index);
                  setAutoplay(false);
                }}
                className={cn(
                  'group relative block w-full overflow-hidden rounded-xl px-4 py-4 text-left transition-colors duration-300',
                  isActive ? 'bg-white/[0.06]' : 'hover:bg-white/[0.03]',
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    'absolute inset-y-2 left-0 w-[2px] rounded-full transition-all duration-300',
                    isActive ? 'bg-[#F5A623]' : 'bg-transparent group-hover:bg-white/15',
                  )}
                />
                <span className="flex items-center gap-2.5">
                  <span
                    className={cn(
                      'font-mono text-[10px] tabular-nums transition-colors',
                      isActive ? 'text-amber-400/90' : 'text-white/25',
                    )}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span
                    className={cn(
                      'text-[14px] font-semibold transition-colors',
                      isActive ? 'text-white' : 'text-white/55 group-hover:text-white/80',
                    )}
                  >
                    {scene.label}
                  </span>
                </span>

                <AnimatePresence initial={false}>
                  {isActive && (
                    <motion.span
                      key="blurb"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.35, ease: 'easeOut' }}
                      className="block overflow-hidden"
                    >
                      <span className="mt-2 block pl-[26px] text-[12.5px] leading-relaxed text-white/45">
                        {scene.blurb}
                      </span>
                    </motion.span>
                  )}
                </AnimatePresence>

                {isActive && autoplay && !reduceMotion && (
                  <motion.span
                    key={`progress-${scene.id}`}
                    aria-hidden
                    className="mt-3 ml-[26px] block h-[2px] origin-left rounded-full bg-amber-400/40"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: SCENE_DURATION_MS / 1000, ease: 'linear' }}
                  />
                )}
              </button>
            );
          })}
        </div>

        <div className="min-h-[26rem]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeScene.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="h-full"
            >
              <DiscordFrame channel={activeScene.channel} topic={activeScene.topic}>
                {activeScene.body}
              </DiscordFrame>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <p className="mt-5 text-center font-mono text-[10.5px] uppercase tracking-[0.16em] text-white/25">
        Representative conversations · names invented, behaviour real
      </p>
    </SectionShell>
  );
}
