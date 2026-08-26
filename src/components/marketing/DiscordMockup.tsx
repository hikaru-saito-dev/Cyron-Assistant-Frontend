import type { PropsWithChildren, ReactNode } from 'react';
import { cn } from '../../lib/utils';

/**
 * Faithful-but-branded Discord chrome for the marketing mockups.
 *
 * Every user-facing string rendered through these primitives is copied from the
 * bot's actual output (core/bot/views/*.py, core/bot/cogs/tickets.py) so the
 * landing page never promises behaviour the bot does not have.
 */

export function DiscordFrame({
  channel,
  topic,
  children,
  className,
}: PropsWithChildren<{ channel: string; topic?: string; className?: string }>) {
  return (
    <div
      className={cn(
        'flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0b]/85 backdrop-blur-xl',
        'shadow-[0_24px_70px_-20px_rgba(0,0,0,0.75)]',
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3 border-b border-white/[0.07] px-4 py-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className="text-base leading-none text-white/25">#</span>
          <span className="truncate text-[13px] font-semibold text-white">{channel}</span>
          {topic && (
            <>
              <span className="hidden h-3 w-px bg-white/10 sm:block" />
              <span className="hidden truncate text-[12px] text-white/35 sm:block">{topic}</span>
            </>
          )}
        </div>
        <span className="shrink-0 font-mono text-[9px] uppercase tracking-[0.18em] text-white/25">
          Representative
        </span>
      </div>

      <div className="flex-1 space-y-4 overflow-hidden px-4 py-4">{children}</div>

      <div className="border-t border-white/[0.07] px-4 py-3">
        <div className="flex items-center gap-2 rounded-lg bg-white/[0.04] px-3 py-2">
          <PlusCircleIcon />
          <span className="text-[12px] text-white/25">Message #{channel}</span>
        </div>
      </div>
    </div>
  );
}

export function DiscordMessage({
  author,
  avatar,
  isApp = false,
  timestamp,
  children,
}: PropsWithChildren<{
  author: string;
  avatar?: ReactNode;
  isApp?: boolean;
  timestamp?: string;
}>) {
  return (
    <div className="flex gap-3">
      <div className="mt-0.5 shrink-0">
        {avatar ?? (
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-400/15 text-[13px] font-semibold text-amber-300 ring-1 ring-amber-400/25">
            {author.slice(0, 1).toUpperCase()}
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[13px] font-semibold text-white">{author}</span>
          {isApp && (
            <span className="rounded bg-amber-400/20 px-1.5 py-px font-mono text-[9px] font-bold uppercase tracking-wide text-amber-300">
              App
            </span>
          )}
          {timestamp && <span className="text-[11px] text-white/25">{timestamp}</span>}
        </div>
        <div className="mt-1 space-y-2">{children}</div>
      </div>
    </div>
  );
}

/** Plain message body. Discord renders AI replies as text, not embeds. */
export function DiscordText({ children, muted = false }: PropsWithChildren<{ muted?: boolean }>) {
  return (
    <p
      className={cn(
        'text-[13px] leading-relaxed',
        muted ? 'text-white/40' : 'text-white/80',
      )}
    >
      {children}
    </p>
  );
}

/**
 * The token line the bot appends under every AI reply
 * (`_token_footer` in core/bot/cogs/tickets.py renders "\n\nN tokens").
 */
export function TokenFooter({ tokens, note }: { tokens: string; note?: string }) {
  return (
    <p className="pt-1 font-mono text-[11px] text-white/30">
      {tokens} tokens
      {note && <span className="ml-2 text-amber-400/60">{note}</span>}
    </p>
  );
}

export function DiscordEmbed({
  title,
  description,
  fields,
  footer,
  accent = '#F5A623',
  children,
}: PropsWithChildren<{
  title?: string;
  description?: ReactNode;
  fields?: { name: string; value: ReactNode }[];
  footer?: string;
  accent?: string;
}>) {
  return (
    <div className="flex overflow-hidden rounded-md bg-white/[0.04]">
      <div className="w-1 shrink-0" style={{ backgroundColor: accent }} />
      <div className="min-w-0 flex-1 px-3.5 py-3">
        {title && <p className="text-[13px] font-semibold text-white">{title}</p>}
        {description && (
          <div className="mt-1 text-[12.5px] leading-relaxed text-white/65">{description}</div>
        )}
        {fields && fields.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-x-10 gap-y-3">
            {fields.map((field) => (
              <div key={field.name}>
                <p className="text-[11px] font-semibold text-white/80">{field.name}</p>
                <p className="mt-0.5 text-[12px] text-white/50">{field.value}</p>
              </div>
            ))}
          </div>
        )}
        {children}
        {footer && <p className="mt-3 text-[11px] text-white/30">{footer}</p>}
      </div>
    </div>
  );
}

type ButtonTone = 'danger' | 'success' | 'secondary' | 'primary';

const BUTTON_TONES: Record<ButtonTone, string> = {
  danger: 'bg-[#d83c3e] text-white',
  success: 'bg-[#248046] text-white',
  primary: 'bg-[#F5A623] text-[#0a0a0a]',
  secondary: 'bg-white/[0.09] text-white/85',
};

export function DiscordButtons({
  buttons,
}: {
  buttons: { label: string; emoji?: string; tone?: ButtonTone }[];
}) {
  return (
    <div className="flex flex-wrap gap-2 pt-1">
      {buttons.map((button) => (
        <span
          key={button.label}
          className={cn(
            'inline-flex items-center gap-1.5 rounded-[3px] px-3 py-1.5 text-[12px] font-medium',
            BUTTON_TONES[button.tone ?? 'secondary'],
          )}
        >
          {button.emoji && <span className="text-[11px] leading-none">{button.emoji}</span>}
          {button.label}
        </span>
      ))}
    </div>
  );
}

export function TypingIndicator({ name }: { name: string }) {
  return (
    <div className="flex items-center gap-2 pt-1">
      <span className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/40"
            style={{ animationDelay: `${i * 140}ms`, animationDuration: '1s' }}
          />
        ))}
      </span>
      <span className="text-[11px] text-white/35">
        <span className="font-semibold text-white/55">{name}</span> is typing…
      </span>
    </div>
  );
}

function PlusCircleIcon() {
  return (
    <svg
      className="h-4 w-4 shrink-0 text-white/25"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v8M8 12h8" strokeLinecap="round" />
    </svg>
  );
}
