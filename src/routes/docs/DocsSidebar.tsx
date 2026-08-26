import clsx from 'clsx';
import type { DocSection } from './docsContent';

type Props = {
  sections: DocSection[];
  activeId: string;
  onSelect: (id: string) => void;
};

export function DocsSidebar({ sections, activeId, onSelect }: Props) {
  return (
    <aside className="hidden lg:block w-56 shrink-0 self-start sticky top-[4.5rem] z-[9]">
      <div className="cyron-glass max-h-[calc(100vh-4.5rem)] overflow-y-auto overscroll-contain px-2 py-4">
        <p className="mb-3 px-2 font-display text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
          Sections
        </p>
        <nav className="space-y-0.5">
          {sections.map((section) => {
            const active = section.id === activeId;
            return (
              <button
                key={section.id}
                type="button"
                onClick={() => onSelect(section.id)}
                className={clsx(
                  'group flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition',
                  active
                    ? 'border-l-2 border-amber-400 bg-amber-400/10 text-amber-300'
                    : 'border-l-2 border-transparent text-zinc-400 hover:bg-white/[0.04] hover:text-white',
                )}
              >
                <span className="truncate">{section.label}</span>
                <span
                  className={clsx(
                    'shrink-0 rounded-md px-1.5 py-0.5 font-mono text-[10px]',
                    active
                      ? 'bg-amber-400/20 text-amber-300'
                      : 'bg-white/[0.08] text-zinc-400',
                  )}
                >
                  {section.badge}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}

export function DocsMobileNav({
  sections,
  activeId,
  onSelect,
}: Props) {
  return (
    <div className="lg:hidden sticky top-[4.5rem] z-[9] mb-6 -mx-1 py-2 backdrop-blur-md">
      <label className="block">
        <span className="sr-only">Jump to section</span>
        <select
          value={activeId}
          onChange={(e) => onSelect(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-[#0f0f0f] px-4 py-3 text-sm font-medium text-white transition-all focus:border-amber-400/50 focus:outline-none focus:ring-2 focus:ring-amber-400/20"
        >
          {sections.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
