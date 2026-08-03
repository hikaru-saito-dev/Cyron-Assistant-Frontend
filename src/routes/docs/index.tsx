import { useCallback, useEffect, useState, useMemo } from 'react';
import { DOC_SECTIONS } from './docsContent';
import type { DocSection, DocItem } from './docsContent';
import { CinematicFooter } from '../../components/ui/motion-footer';
import StaggeredMenu from '../../components/ui/StaggeredMenu';
import { motion, AnimatePresence } from 'framer-motion';
import TextBlockAnimation from '../../components/ui/text-block-animation';

const menuItems = [
  { label: 'Home', ariaLabel: 'Go to home page', link: '/' },
  { label: 'Pricing', ariaLabel: 'Learn about us', link: '/premium' },
  { label: 'Docs', ariaLabel: 'View our services', link: '/docs' }
];

const socialItems = [
  { label: 'YouTube', link: 'https://youtube.com' }
];

/* ─────────────────── SIDEBAR ─────────────────── */

function Sidebar({
  sections,
  activeId,
  expandedSections,
  onSelect,
  onToggleSection,
}: {
  sections: DocSection[];
  activeId: string;
  expandedSections: Set<string>;
  onSelect: (sectionId: string, itemId?: string) => void;
  onToggleSection: (sectionId: string) => void;
}) {
  return (
    <aside className="hidden lg:block w-64 shrink-0 self-start sticky top-0 h-screen overflow-y-auto border-r border-white/[0.06] pt-8 pb-12 pl-6 pr-4">

      <nav className="space-y-1">
        {sections.map((section) => {
          const isActive = section.id === activeId;
          const isExpanded = expandedSections.has(section.id);

          return (
            <div key={section.id}>
              {/* Section label */}
              <button
                type="button"
                onClick={() => {
                  onToggleSection(section.id);
                  onSelect(section.id);
                }}
                className={`
                  w-full flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-[13px] font-medium transition-all duration-200
                  ${isActive
                    ? 'bg-[#0433FF]/15 text-white border-l-2 border-[#0433FF]'
                    : 'text-white/60 hover:text-white/90 hover:bg-white/[0.04] border-l-2 border-transparent'
                  }
                `}
              >
                <span className="truncate">{section.label}</span>
                {section.items.length > 0 && (
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    className={`shrink-0 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
                  >
                    <path d="M4.5 3L7.5 6L4.5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>

              {/* Sub-items */}
              {isExpanded && section.items.length > 0 && (
                <div className="ml-4 mt-1 space-y-0.5 border-l border-white/[0.06] pl-3">
                  {section.items.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => onSelect(section.id, item.id)}
                      className="w-full text-left text-[12px] py-1.5 px-2 rounded text-white/40 hover:text-white/80 hover:bg-white/[0.04] transition-colors truncate"
                    >
                      {item.title}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}

/* ─────────────── MOBILE NAV ─────────────── */

function MobileNav({
  sections,
  activeId,
  onSelect,
}: {
  sections: DocSection[];
  activeId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="lg:hidden sticky top-0 z-[9] mb-6 bg-black/95 py-3 px-4 backdrop-blur-md border-b border-white/[0.06]">
      <select
        value={activeId}
        onChange={(e) => onSelect(e.target.value)}
        className="w-full rounded-lg border border-white/10 bg-white/[0.05] px-4 py-3 text-sm font-medium text-white focus:border-[#0433FF] focus:outline-none focus:ring-2 focus:ring-[#0433FF]/20"
      >
        {sections.map((s) => (
          <option key={s.id} value={s.id}>
            {s.label}
          </option>
        ))}
      </select>
    </div>
  );
}

/* ─────────────── CONTENT AREA ─────────────── */

function DocContentArea({ section }: { section: DocSection }) {
  return (
    <div className="space-y-12">
      {/* Section header */}
      <div>
        <TextBlockAnimation
          blockColor="#0433FF"
          animateOnScroll={false}
          delay={0.1}
          duration={0.7}
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight leading-tight">
            {section.title}
          </h1>
        </TextBlockAnimation>

        <TextBlockAnimation
          blockColor="#0433FF"
          animateOnScroll={false}
          delay={0.4}
          duration={0.5}
          stagger={0.05}
        >
          <p className="mt-4 text-[15px] leading-relaxed text-white/50 max-w-3xl">
            {section.description}
          </p>
        </TextBlockAnimation>
      </div>

      {/* Items */}
      <div className="space-y-8">
        {section.items.map((item) => (
          <DocItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

/* ─────────────── ITEM CARD ─────────────── */

const PLAN_BADGE: Record<string, { dot: string; bg: string; text: string }> = {
  all: { dot: 'bg-emerald-400', bg: 'bg-emerald-400/[0.08]', text: 'text-emerald-300' },
  admin: { dot: 'bg-amber-400', bg: 'bg-amber-400/[0.08]', text: 'text-amber-300' },
  staff: { dot: 'bg-[#0433FF]', bg: 'bg-[#0433FF]/[0.08]', text: 'text-blue-300' },
  free: { dot: 'bg-white/40', bg: 'bg-white/[0.04]', text: 'text-white/50' },
  pro: { dot: 'bg-violet-400', bg: 'bg-violet-400/[0.08]', text: 'text-violet-300' },
};

const PLAN_LABELS: Record<string, string> = {
  all: 'All Users',
  admin: 'Admin',
  staff: 'Staff',
  free: 'Free',
  pro: 'Pro',
};

function DocItemCard({ item }: { item: DocItem }) {
  const plan = item.plan ?? 'all';
  const badge = PLAN_BADGE[plan] ?? PLAN_BADGE.all;

  return (
    <article id={item.id} className="scroll-mt-28 group">
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 hover:bg-white/[0.04] transition-colors duration-200">
        {/* Title + Badge */}
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h3 className="text-xl font-semibold text-white tracking-tight">
            {item.title.startsWith('/') ? (
              <span className="font-mono text-[#0433FF]">{item.title}</span>
            ) : (
              item.title
            )}
          </h3>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-medium tracking-wide ${badge.bg} ${badge.text}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
            {PLAN_LABELS[plan] ?? plan}
          </span>
        </div>

        {/* Description */}
        <p className="mt-3 text-[14px] leading-relaxed text-white/45">
          {item.description}
        </p>

        {/* Meta */}
        {(item.whoCanRun || item.permissions || item.cooldown || item.whatYouSee) && (
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {item.whoCanRun && <MetaBlock label="Who can use it">{item.whoCanRun}</MetaBlock>}
            {item.permissions && item.permissions.length > 0 && (
              <MetaBlock label="Permissions">
                <div className="flex flex-wrap gap-1.5">
                  {item.permissions.map((p) => (
                    <span
                      key={p}
                      className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-0.5 font-mono text-[11px] text-white/60"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </MetaBlock>
            )}
            {item.cooldown && <MetaBlock label="Cooldown">{item.cooldown}</MetaBlock>}
            {item.whatYouSee && <MetaBlock label="What you see">{item.whatYouSee}</MetaBlock>}
          </div>
        )}

        {/* Steps */}
        {item.steps && item.steps.length > 0 && (
          <div className="mt-5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-white/30 mb-2">
              Steps
            </p>
            <ol className="list-decimal space-y-2 pl-5 text-[13px] text-white/45 leading-relaxed">
              {item.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>
        )}

        {/* Tips */}
        {item.tips && item.tips.length > 0 && (
          <div className="mt-5 rounded-lg border border-[#0433FF]/15 bg-[#0433FF]/[0.04] p-4">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#0433FF] mb-2">
              Tips
            </p>
            <ul className="list-disc space-y-1 pl-5 text-[13px] text-white/50">
              {item.tips.map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Errors */}
        {item.errors && item.errors.length > 0 && (
          <div className="mt-5 rounded-lg border border-rose-500/15 bg-rose-500/[0.04] p-4">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-rose-400 mb-2">
              Error states
            </p>
            <ul className="list-disc space-y-1 pl-5 text-[13px] text-rose-200/60">
              {item.errors.map((err) => (
                <li key={err}>{err}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </article>
  );
}

function MetaBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-white/25">
        {label}
      </p>
      <div className="mt-1.5 text-[13px] text-white/50">{children}</div>
    </div>
  );
}

/* ─────────────── MAIN PAGE ─────────────── */

export function Docs() {
  const [activeSectionId, setActiveSectionId] = useState(DOC_SECTIONS[0].id);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    () => new Set([DOC_SECTIONS[0].id])
  );

  const activeSection = useMemo(
    () => DOC_SECTIONS.find((s) => s.id === activeSectionId) ?? DOC_SECTIONS[0],
    [activeSectionId]
  );

  const handleSelect = useCallback((sectionId: string, itemId?: string) => {
    setActiveSectionId(sectionId);
    if (itemId) {
      setTimeout(() => {
        const el = document.getElementById(itemId);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const handleToggleSection = useCallback((sectionId: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  }, []);

  return (
    <>
      <StaggeredMenu
        position="right"
        isFixed={true}
        items={menuItems}
        socialItems={socialItems}
        displaySocials
        displayItemNumbering={true}
        menuButtonColor="#ffffff"
        openMenuButtonColor="#111"
        changeMenuColorOnOpen={true}
        colors={['#0433FF', '#0221a6']}
        accentColor="#0433FF"
      />

      <div className="min-h-screen bg-black text-white flex relative z-10">
        {/* Subtle top gradient glow */}
        <div className="absolute top-0 left-0 right-0 h-[300px] bg-gradient-to-b from-[#0433FF]/[0.06] via-[#0433FF]/[0.02] to-transparent pointer-events-none" />

        <Sidebar
          sections={DOC_SECTIONS}
          activeId={activeSectionId}
          expandedSections={expandedSections}
          onSelect={handleSelect}
          onToggleSection={handleToggleSection}
        />

        {/* Main content */}
        <main className="flex-1 min-w-0 relative">
          <MobileNav
            sections={DOC_SECTIONS}
            activeId={activeSectionId}
            onSelect={(id) => handleSelect(id)}
          />

          <div className="max-w-4xl mx-auto px-6 sm:px-10 py-12 lg:py-16 min-h-screen">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSectionId}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                <DocContentArea section={activeSection} />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>

      <CinematicFooter />
    </>
  );
}

export default Docs;
