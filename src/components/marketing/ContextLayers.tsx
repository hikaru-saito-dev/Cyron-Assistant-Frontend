import { useState } from 'react';
import { Layers, Lock, RefreshCw, ShieldCheck } from 'lucide-react';
import { MetaTag, Reveal, SectionShell } from './SectionShell';
import { cn } from '../../lib/utils';

type PanelLayer = {
  id: string;
  name: string;
  role: string;
  instructions: string;
  entries: string[];
};

const PANEL_LAYERS: PanelLayer[] = [
  {
    id: 'billing',
    name: 'Billing panel',
    role: 'Panel context',
    instructions: 'Never quote a refund window that is not written down. Ask for the order ID first.',
    entries: ['Refund policy', 'Invoice reissue', 'Failed payment'],
  },
  {
    id: 'partnership',
    name: 'Partnership panel',
    role: 'Panel context',
    instructions: 'Stay formal. Collect audience size and platform before promising a review.',
    entries: ['Minimum requirements', 'Review timeline'],
  },
  {
    id: 'support',
    name: 'Support panel',
    role: 'Panel context',
    instructions: 'Walk through the setup checklist step by step before escalating.',
    entries: ['Install steps', 'Permission errors', 'Known issues'],
  },
];

const BASE_LAYER = {
  id: 'general',
  name: 'General Rules',
  role: 'Guild-wide layer',
  instructions:
    'Tone, safety boundaries, escalation rules and the general information every ticket in the server should share.',
  entries: ['Company info', 'Escalation targets', 'Things to never say'],
};

const EXPLAINERS = [
  {
    icon: Layers,
    title: 'Merged at reply time',
    detail:
      'General Rules go into the prompt first, then the panel’s own context on top. One shared voice, one specialised brief.',
  },
  {
    icon: Lock,
    title: 'Knowledge stays in its lane',
    detail:
      'Entries belong to a context, so a Billing panel and a Partnership panel never borrow each other’s facts.',
  },
  {
    icon: RefreshCw,
    title: 'Edits land instantly',
    detail:
      'Saving a context bumps its version, which invalidates the cached answers for that panel straight away.',
  },
  {
    icon: ShieldCheck,
    title: 'Sensible from the start',
    detail:
      'General Rules are created with defaults you can keep or rewrite, and can be toggled off per server.',
  },
];

export function ContextLayers() {
  const [active, setActive] = useState<string>(BASE_LAYER.id);

  return (
    <SectionShell
      eyebrow="Two-layer prompts"
      title="One voice for the server, one brief per panel."
      lede="Cyron does not stuff every instruction you have ever written into every reply. A guild-wide layer sets the tone, and each ticket category adds only the context it actually needs."
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-8">
        <Reveal className="cyron-glass p-6 md:p-7">
          <div className="flex items-center justify-between gap-4">
            <MetaTag tone="amber">Prompt stack</MetaTag>
            <MetaTag>Top layer wins the detail</MetaTag>
          </div>

          <div className="mt-6 space-y-2.5">
            {PANEL_LAYERS.map((layer, index) => {
              const isActive = active === layer.id;
              return (
                <button
                  key={layer.id}
                  type="button"
                  onMouseEnter={() => setActive(layer.id)}
                  onFocus={() => setActive(layer.id)}
                  onClick={() => setActive(layer.id)}
                  aria-pressed={isActive}
                  className={cn(
                    'block w-full rounded-xl border px-4 py-3.5 text-left transition-all duration-300 ease-out',
                    isActive
                      ? 'border-amber-400/40 bg-amber-400/[0.07]'
                      : 'border-white/10 bg-white/[0.03] hover:border-white/20',
                  )}
                  style={{ marginLeft: `${(PANEL_LAYERS.length - 1 - index) * 14}px` }}
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="text-[13.5px] font-semibold text-white">{layer.name}</span>
                    <MetaTag tone={isActive ? 'amber' : 'muted'}>{layer.role}</MetaTag>
                  </div>
                  <p className="mt-1.5 text-[12.5px] leading-relaxed text-white/40">
                    {layer.instructions}
                  </p>
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {layer.entries.map((entry) => (
                      <span
                        key={entry}
                        className={cn(
                          'rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors duration-300',
                          isActive
                            ? 'bg-amber-400/15 text-amber-300/90'
                            : 'bg-white/[0.05] text-white/30',
                        )}
                      >
                        {entry}
                      </span>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>

          <div
            aria-hidden
            className="mx-auto mt-3 h-6 w-px bg-gradient-to-b from-transparent to-amber-400/30"
          />

          <button
            type="button"
            onMouseEnter={() => setActive(BASE_LAYER.id)}
            onFocus={() => setActive(BASE_LAYER.id)}
            onClick={() => setActive(BASE_LAYER.id)}
            aria-pressed={active === BASE_LAYER.id}
            className={cn(
              'block w-full rounded-2xl border px-5 py-4 text-left transition-all duration-300 ease-out',
              active === BASE_LAYER.id
                ? 'border-amber-400/45 bg-amber-400/[0.09]'
                : 'border-white/12 bg-white/[0.045] hover:border-white/25',
            )}
          >
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-sm font-semibold text-white">{BASE_LAYER.name}</span>
              <MetaTag tone={active === BASE_LAYER.id ? 'amber' : 'muted'}>
                {BASE_LAYER.role}
              </MetaTag>
            </div>
            <p className="mt-2 text-[12.5px] leading-relaxed text-white/45">
              {BASE_LAYER.instructions}
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {BASE_LAYER.entries.map((entry) => (
                <span
                  key={entry}
                  className="rounded-full bg-white/[0.06] px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-white/35"
                >
                  {entry}
                </span>
              ))}
            </div>
          </button>

          <p className="mt-5 text-[12.5px] leading-relaxed text-white/35">
            Hover a layer to see what it contributes. Every panel sits on the same base, and only one
            panel context is ever added on top.
          </p>
        </Reveal>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
          {EXPLAINERS.map((item, index) => (
            <Reveal key={item.title} delay={0.08 * index} className="cyron-glass p-6 md:p-7">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-[#0c0c0d] text-amber-400/90">
                  <item.icon className="h-[18px] w-[18px]" strokeWidth={1.5} aria-hidden />
                </div>
                <div>
                  <h3 className="text-[15px] font-semibold text-white">{item.title}</h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-white/45">{item.detail}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
