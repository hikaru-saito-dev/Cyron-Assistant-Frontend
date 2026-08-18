'use client';

import FlowArt, { FlowSection } from './story-scroll';

export default function FlowArtDefaultDemo() {
  return (
    <FlowArt aria-label="Présentation Flow Art">
      <FlowSection aria-label="Qui nous sommes" style={{ backgroundColor: '#fd5200', color: '#fff' }}>
        <p className="text-xs font-bold uppercase tracking-[0.2em]">01 — Who we are</p>
        <hr className="my-[2vw] border-none border-t border-black opacity-100" />
        <div>
          <h1
            className="text-[clamp(3.5rem,12vw,14rem)] font-bold leading-[0.85] uppercase tracking-tight"
          >
            SUPPORT,
            <br />
            ON
            <br />
            AUTOPILOT
          </h1>
        </div>
        <hr className="my-[2vw] border-none border-t border-black opacity-100" />
        <p className="mt-auto max-w-[50ch] text-[clamp(1rem,2.5vw,2rem)] font-normal leading-relaxed">
          Cyron creates private ticket rooms in Discord, answers common questions with AI trained on your server, and hands off to a human whenever it's needed.
        </p>
      </FlowSection>

      <FlowSection aria-label="La mission" style={{ backgroundColor: '#000', color: '#fff' }}>
        <p className="text-xs font-bold uppercase tracking-[0.2em]">02 — The mission</p>
        <hr className="my-[2vw] border-none border-t border-white/60" />
        <div>
          <h2
            className="text-[clamp(3.5rem,12vw,14rem)] font-bold leading-[0.85] uppercase tracking-tight"
          >
            Built
            <br />
            For
            <br />
            Discord
          </h2>
        </div>
        <hr className="my-[2vw] border-none border-t border-white/60" />
        <p className="max-w-[50ch] text-[clamp(1rem,2.5vw,2rem)] font-normal leading-relaxed">
          A support system built for Discord communities. We're changing how tickets get opened, answered, and closed — without burning out your team.
        </p>
        <hr className="my-[2vw] border-none border-t border-white/60" />
        <div className="flex flex-wrap gap-[3vw]">
          <div className="min-w-[180px] flex-1">
            <p className="mb-2 text-sm font-bold uppercase tracking-wider">PANELS</p>
            <p className="text-[clamp(0.85rem,1.3vw,1.05rem)] leading-relaxed opacity-75">
              Custom "Open Ticket" buttons that create private help rooms in seconds.
            </p>
          </div>
          <div className="min-w-[180px] flex-1">
            <p className="mb-2 text-sm font-bold uppercase tracking-wider">AI AUTO-REPLY</p>
            <p className="text-[clamp(0.85rem,1.3vw,1.05rem)] leading-relaxed opacity-75">
              Trained on your own rules and knowledge — not a generic chatbot guessing.
            </p>
          </div>
          <div className="min-w-[180px] flex-1">
            <p className="mb-2 text-sm font-bold uppercase tracking-wider">HUMAN HANDOFF</p>
            <p className="text-[clamp(0.85rem,1.3vw,1.05rem)] leading-relaxed opacity-75">
              The moment staff steps in, the AI goes silent. No overlap, no confusion.
            </p>
          </div>
        </div>
        <hr className="my-[2vw] border-none border-t border-white/60" />
        <div className="flex flex-wrap gap-[3vw]">
          <div className="min-w-[180px] flex-1">
            <p className="mb-2 text-sm font-bold uppercase tracking-wider">KNOWLEDGE BASE</p>
            <p className="text-[clamp(0.85rem,1.3vw,1.05rem)] leading-relaxed opacity-75">
              Teach Cyron facts and common problems so answers stay accurate and on-brand.
            </p>
          </div>
          <div className="min-w-[180px] flex-1">
            <p className="mb-2 text-sm font-bold uppercase tracking-wider">AI CONTEXTS</p>
            <p className="text-[clamp(0.85rem,1.3vw,1.05rem)] leading-relaxed opacity-75">
              Different "brains" for different panels — Sales, Support, Partnerships, and more.
            </p>
          </div>
          <div className="min-w-[180px] flex-1">
            <p className="mb-2 text-sm font-bold uppercase tracking-wider">ANALYTICS</p>
            <p className="text-[clamp(0.85rem,1.3vw,1.05rem)] leading-relaxed opacity-75">
              Track ticket volume, AI usage, and performance from one dashboard.
            </p>
          </div>
        </div>
        <hr className="my-[2vw] border-none border-t border-white/60" />
        <p className="mt-auto ml-auto max-w-[50ch] text-right text-[clamp(1rem,2.5vw,2rem)] font-normal leading-relaxed">
          Every feature we build starts with one question — does this reduce your team's workload?
        </p>
      </FlowSection>

      <FlowSection aria-label="Comment ça marche" style={{ backgroundColor: '#F5F0E8', color: '#000' }}>
        <p className="text-xs font-bold uppercase tracking-[0.2em]">03 — How it works</p>
        <hr className="my-[2vw] border-none border-t border-black/60" />
        <div>
          <h2
            className="text-[clamp(3.5rem,12vw,14rem)] font-bold leading-[0.85] uppercase tracking-tight"
          >
            Set
            <br />
            Up.
            <br />
            Go
            <br />
            live.
          </h2>
        </div>
        <hr className="my-[2vw] border-none border-t border-black/60" />
        <p className="max-w-[50ch] text-[clamp(1rem,2.5vw,2rem)] font-normal leading-relaxed">
          Six steps. No code required. Cyron is answering tickets in your server within minutes.
        </p>
        <hr className="my-[2vw] border-none border-t border-black/60" />
        <div className="flex flex-wrap gap-[3vw]">
          <div className="min-w-[180px] flex-1">
            <p className="mb-2 text-sm font-bold uppercase tracking-wider">01 — SIGN IN</p>
            <p className="text-[clamp(0.85rem,1.3vw,1.05rem)] leading-relaxed opacity-75">
              Log in with your Discord account and pick the server you want to manage from your dashboard.
            </p>
          </div>
          <div className="min-w-[180px] flex-1">
            <p className="mb-2 text-sm font-bold uppercase tracking-wider">02 — RUN /setup</p>
            <p className="text-[clamp(0.85rem,1.3vw,1.05rem)] leading-relaxed opacity-75">
              In Discord, an admin types /setup once. This creates a Tickets category and a Support role automatically.
            </p>
          </div>
          <div className="min-w-[180px] flex-1">
            <p className="mb-2 text-sm font-bold uppercase tracking-wider">03 — TRAIN YOUR AI</p>
            <p className="text-[clamp(0.85rem,1.3vw,1.05rem)] leading-relaxed opacity-75">
              Open AI Settings, run the guided wizard, and answer a few questions about your server. Activate AI when you're ready.
            </p>
          </div>
        </div>
        <hr className="my-[2vw] border-none border-t border-black/60" />
        <div className="flex flex-wrap gap-[3vw]">
          <div className="min-w-[180px] flex-1">
            <p className="mb-2 text-sm font-bold uppercase tracking-wider">04 — CREATE A PANEL</p>
            <p className="text-[clamp(0.85rem,1.3vw,1.05rem)] leading-relaxed opacity-75">
              Go to Panels → New Panel. Name it, turn on AI Auto-Reply, and link it to your AI Context.
            </p>
          </div>
          <div className="min-w-[180px] flex-1">
            <p className="mb-2 text-sm font-bold uppercase tracking-wider">05 — SEND IT TO DISCORD</p>
            <p className="text-[clamp(0.85rem,1.3vw,1.05rem)] leading-relaxed opacity-75">
              Click Send Panel, pick a channel, and your "Open Ticket" button appears instantly for members to use.
            </p>
          </div>
          <div className="min-w-[180px] flex-1">
            <p className="mb-2 text-sm font-bold uppercase tracking-wider">06 — TEST & REFINE</p>
            <p className="text-[clamp(0.85rem,1.3vw,1.05rem)] leading-relaxed opacity-75">
              Open a ticket as a normal user, ask a question, and confirm Cyron replies. Add more knowledge anytime.
            </p>
          </div>
        </div>
      </FlowSection>

    </FlowArt>
  );
}
