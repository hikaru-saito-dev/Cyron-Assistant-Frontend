import { useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import {
  FaBook,
  FaRobot,
  FaPalette,
  FaChartLine,
  FaServer,
  FaLayerGroup,
  FaBrain,
  FaBars,
  FaTimes,
} from 'react-icons/fa';

type Tab = {
  id: string;
  label: string;
  to: (id: string) => string;
  icon: React.ReactNode;
};

type Section = {
  id: string;
  label: string;
  tabs: Tab[];
};

const sections: Section[] = [
  {
    id: 'management',
    label: 'Management',
    tabs: [
      {
        id: 'panels',
        label: 'Panels',
        to: (id: string) => `/guilds/${id}/panels`,
        icon: <FaLayerGroup className="mr-2 w-4 h-4" />,
      },
      {
        id: 'contexts',
        label: 'AI Contexts',
        to: (id: string) => `/guilds/${id}/contexts`,
        icon: <FaBrain className="mr-2 w-4 h-4" />,
      },
      {
        id: 'knowledge',
        label: 'Knowledge',
        to: (id: string) => `/guilds/${id}/knowledge`,
        icon: <FaBook className="mr-2 w-4 h-4" />,
      },
    ],
  },
  {
    id: 'settings',
    label: 'Settings',
    tabs: [
      {
        id: 'ai-settings',
        label: 'AI Settings',
        to: (id: string) => `/guilds/${id}/settings`,
        icon: <FaRobot className="mr-2 w-4 h-4" />,
      },
      {
        id: 'embed-customization',
        label: 'Embed Customization',
        to: (id: string) => `/guilds/${id}/embed-customization`,
        icon: <FaPalette className="mr-2 w-4 h-4" />,
      },
      {
        id: 'usage-analytics',
        label: 'Usage Analytics',
        to: (id: string) => `/guilds/${id}/usage-analytics`,
        icon: <FaChartLine className="mr-2 w-4 h-4" />,
      },
    ],
  },
];

const allTabs = sections.flatMap((s) => s.tabs);

type GuildSidebarNavProps = {
  guild?: Guild | null;
};

export const GuildSidebarNav = ({ guild }: GuildSidebarNavProps) => {
  const { guildId } = useParams<{ guildId?: string }>();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!guildId) return null;

  const displayName = (() => {
    const name = guild?.name?.trim() || 'Server';
    const MAX = 16;
    return name.length > MAX ? `${name.slice(0, MAX)}…` : name;
  })();

  const planLabel = (() => {
    const p = (guild?.plan ?? 'free').toLowerCase();
    if (p === 'business') return 'Business plan';
    if (p === 'pro') return 'Pro plan';
    return 'Free plan';
  })();

  const NavLinks = ({ onClick }: { onClick?: () => void }) => (
    <nav className="space-y-4">
      {sections.map((section) => (
        <div key={section.id}>
          <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
            {section.label}
          </p>
          <div className="space-y-1">
            {section.tabs.map((tab) => {
              const target = tab.to(guildId);
              const isActive = location.pathname.startsWith(target);
              return (
                <Link
                  key={tab.id}
                  to={target}
                  onClick={onClick}
                  className={[
                    'flex items-center rounded-xl px-3 py-2 text-xs font-medium transition-colors',
                    isActive
                      ? 'bg-sky-50 text-sky-700 border border-sky-200'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
                  ].join(' ')}
                >
                  {tab.icon}
                  {tab.label}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );

  return (
    <>
      {/* Desktop sidebar — original styling preserved */}
      <aside className="hidden w-64 min-h-[800px] flex-shrink-0 rounded-3xl border border-slate-200 bg-white/90 px-4 py-5 text-sm text-slate-800 shadow-sm md:block">
        <div className="mb-5 px-1">
          <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2">
            {guild?.icon_url ? (
              <span className="inline-flex h-8 w-8 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                <img
                  src={guild.icon_url}
                  alt={guild.name ?? 'Server icon'}
                  className="h-full w-full object-cover"
                />
              </span>
            ) : (
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-slate-50 text-slate-600">
                <FaServer className="h-4 w-4" />
              </span>
            )}
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900">{displayName}</p>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">{planLabel}</p>
            </div>
          </div>
        </div>
        <NavLinks />
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-[57px] left-0 right-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white/95 px-4 py-2 backdrop-blur-sm">
        <span className="text-sm font-semibold text-slate-800 truncate max-w-[160px]">{displayName}</span>
        <button
          onClick={() => setMobileOpen(true)}
          className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600"
        >
          <FaBars className="h-3.5 w-3.5" />
          Menu
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="relative ml-auto w-72 max-w-[85vw] h-full bg-white shadow-xl px-4 py-5 overflow-y-auto">
            <div className="flex items-center justify-between mb-5 border-b border-slate-100 pb-4">
              <span className="text-sm font-semibold text-slate-900">{displayName}</span>
              <button onClick={() => setMobileOpen(false)} className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100">
                <FaTimes className="h-4 w-4" />
              </button>
            </div>
            <NavLinks onClick={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* Mobile bottom quick-nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-20 flex border-t border-slate-200 bg-white/95 backdrop-blur-sm">
        {allTabs.slice(0, 5).map((tab) => {
          const target = tab.to(guildId);
          const isActive = location.pathname.startsWith(target);
          return (
            <Link
              key={tab.id}
              to={target}
              className={[
                'flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] font-medium transition-colors',
                isActive ? 'text-sky-600' : 'text-slate-500',
              ].join(' ')}
            >
              <span className="text-base">{tab.icon}</span>
              {tab.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
};
