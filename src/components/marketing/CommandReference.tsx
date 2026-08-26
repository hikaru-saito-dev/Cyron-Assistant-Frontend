import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { SectionShell } from './SectionShell';
import { cn } from '../../lib/utils';

type Access = 'admin' | 'staff' | 'anyone';

type Command = {
  name: string;
  args?: string;
  summary: string;
  access: Access;
};

const ACCESS_LABEL: Record<Access, string> = {
  admin: 'Admin',
  staff: 'Staff',
  anyone: 'Anyone',
};

const ACCESS_STYLE: Record<Access, string> = {
  admin: 'border-amber-400/30 text-amber-300/90',
  staff: 'border-white/15 text-white/50',
  anyone: 'border-emerald-400/25 text-emerald-300/80',
};

const GROUPS: { id: string; label: string; commands: Command[] }[] = [
  {
    id: 'setup',
    label: 'Setup',
    commands: [
      {
        name: '/setup',
        summary: 'Creates the Tickets category and a Support role if your server does not have them yet.',
        access: 'admin',
      },
      {
        name: '/sendpanel',
        summary: 'Posts one of your dashboard panels into the current channel with its Open Ticket button.',
        access: 'admin',
      },
    ],
  },
  {
    id: 'open',
    label: 'Opening',
    commands: [
      {
        name: '/new',
        summary: 'Opens a ticket through your panels. With several panels the member picks a category first.',
        access: 'anyone',
      },
      {
        name: '/create-ticket',
        summary: 'Direct ticket in the Tickets category, for servers running without panels.',
        access: 'anyone',
      },
    ],
  },
  {
    id: 'manage',
    label: 'Working the queue',
    commands: [
      { name: '/ticket claim', summary: 'Takes ownership and applies your claim visibility rules.', access: 'staff' },
      { name: '/ticket unclaim', summary: 'Releases the ticket and restores the previous permissions.', access: 'staff' },
      { name: '/ticket priority', args: 'low | medium | high | urgent', summary: 'Sets priority and marks the channel name so urgent work is visible.', access: 'staff' },
      { name: '/ticket add', args: '<user>', summary: 'Pulls another member into the ticket.', access: 'staff' },
      { name: '/ticket remove', args: '<user>', summary: 'Removes a member from the ticket.', access: 'staff' },
      { name: '/ticket rename', args: '<name>', summary: 'Renames the channel.', access: 'staff' },
      { name: '/ticket move', args: '<category>', summary: 'Moves the ticket to another category.', access: 'staff' },
      { name: '/ticket info', summary: 'Shows status, number, creator, who claimed it, priority and whether AI is active.', access: 'anyone' },
    ],
  },
  {
    id: 'ai',
    label: 'AI control',
    commands: [
      {
        name: '/ticket ai',
        args: 'pause | resume',
        summary: 'Silences the AI for this ticket, or hands it back after your team is done.',
        access: 'staff',
      },
    ],
  },
  {
    id: 'close',
    label: 'Closing',
    commands: [
      {
        name: '/ticket close',
        args: '[reason]',
        summary: 'Closes with a recorded reason. Members can close their own ticket when the panel allows it.',
        access: 'staff',
      },
      {
        name: '/ticket requestclose',
        summary: 'Asks the member to confirm first, with Confirm and Cancel buttons and an optional timeout.',
        access: 'staff',
      },
    ],
  },
];

export function CommandReference() {
  const [activeId, setActiveId] = useState(GROUPS[0].id);
  const activeGroup = GROUPS.find((group) => group.id === activeId) ?? GROUPS[0];

  return (
    <SectionShell
      eyebrow="Slash commands"
      title="Your staff never leave Discord."
      lede="The dashboard is for configuration. The day-to-day work — claiming, prioritising, escalating, closing — happens where your team already is."
    >
      <div className="cyron-glass overflow-hidden">
        <div className="flex gap-1 overflow-x-auto border-b border-white/[0.07] p-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {GROUPS.map((group) => {
            const isActive = group.id === activeId;
            return (
              <button
                key={group.id}
                type="button"
                onClick={() => setActiveId(group.id)}
                className={cn(
                  'relative shrink-0 rounded-lg px-4 py-2 text-[13px] font-medium transition-colors duration-200',
                  isActive ? 'text-[#0a0a0a]' : 'text-white/50 hover:text-white/80',
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="command-tab"
                    className="absolute inset-0 rounded-lg bg-[#F5A623]"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative z-10">{group.label}</span>
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.ul
            key={activeGroup.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="divide-y divide-white/[0.05]"
          >
            {activeGroup.commands.map((command) => (
              <li
                key={command.name + (command.args ?? '')}
                className="flex flex-col gap-2 px-5 py-4 transition-colors hover:bg-white/[0.02] sm:flex-row sm:items-baseline sm:gap-6"
              >
                <code className="shrink-0 font-mono text-[13px] text-amber-300/95 sm:w-64">
                  {command.name}
                  {command.args && <span className="ml-1.5 text-white/30">{command.args}</span>}
                </code>
                <p className="flex-1 text-[13px] leading-relaxed text-white/50">{command.summary}</p>
                <span
                  className={cn(
                    'shrink-0 self-start rounded-full border px-2.5 py-0.5 font-mono text-[9.5px] uppercase tracking-[0.14em] sm:self-center',
                    ACCESS_STYLE[command.access],
                  )}
                >
                  {ACCESS_LABEL[command.access]}
                </span>
              </li>
            ))}
          </motion.ul>
        </AnimatePresence>
      </div>
    </SectionShell>
  );
}
