import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  ChevronLeft,
  LayoutDashboard,
  Ticket,
  BrainCircuit,
  BookOpen,
  Settings2,
  Activity,
  Paintbrush,
  LogOut,
} from 'lucide-react';
import { FaDiscord } from 'react-icons/fa';
import { api } from '../../lib/api';
import { AnimatedOutlet } from '../motion/AnimatedOutlet';
import { ShinyButton } from '../ui/shiny-button';
import { AtmosphereBackground } from '../ui/AtmosphereBackground';
import {
  Sidebar001,
  Sidebar001Content,
  Sidebar001Header,
  Sidebar001Item,
  Sidebar001Section,
  Sidebar001Footer,
} from '../ui/sidebar-001';

async function fetchGuilds(): Promise<Guild[]> {
  const res = await api.get<Guild[]>('/guilds');
  return res.data;
}

export const AppLayout = () => {
  const params = useParams<{ guildId?: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const { data: guilds } = useQuery({
    queryKey: ['guilds'],
    queryFn: fetchGuilds,
  });

  const selectedGuild =
    guilds?.find((g) => String(g.id) === params.guildId) ?? null;

  const activeTabId = (() => {
    const path = location.pathname;
    if (path.includes('/panels')) return 'panels';
    if (path.includes('/contexts')) return 'contexts';
    if (path.includes('/knowledge')) return 'knowledge';
    if (path.includes('/ai-settings')) return 'ai-settings';
    if (path.includes('/embed-customization')) return 'embed-customization';
    if (path.includes('/close-settings')) return 'close-settings';
    if (path.includes('/usage-analytics')) return 'usage-analytics';
    if (path.includes('/tickets')) return 'tickets';
    return 'panels';
  })();

  const sidebarGroups = [
    {
      title: 'Workspace',
      items: [
        { id: 'panels', label: 'Panels', icon: <LayoutDashboard className="w-4 h-4" /> },
        { id: 'tickets', label: 'Ticket Management', icon: <Ticket className="w-4 h-4" /> },
      ],
    },
    {
      title: 'AI Management',
      items: [
        { id: 'contexts', label: 'AI Contexts', icon: <BrainCircuit className="w-4 h-4" /> },
        { id: 'knowledge', label: 'Knowledge', icon: <BookOpen className="w-4 h-4" /> },
        { id: 'ai-settings', label: 'AI Settings', icon: <Settings2 className="w-4 h-4" /> },
      ],
    },
    {
      title: 'Insights',
      items: [
        { id: 'usage-analytics', label: 'Usage Analytics', icon: <Activity className="w-4 h-4" /> },
      ],
    },
    {
      title: 'Configuration',
      items: [
        { id: 'embed-customization', label: 'Embed Customization', icon: <Paintbrush className="w-4 h-4" /> },
        { id: 'close-settings', label: 'Close Settings', icon: <LogOut className="w-4 h-4" /> },
      ],
    },
  ];

  const handleTabChange = (tabId: string) => {
    navigate(`/guilds/${params.guildId}/${tabId}`);
  };

  const displayName = selectedGuild?.name?.trim() || 'Server';
  const isFreePlan = !selectedGuild?.plan || selectedGuild?.plan === 'free';

  return (
    <div className="cyron-app-shell relative isolate min-h-screen text-zinc-100">
      <AtmosphereBackground fixed />

      {params.guildId ? (
        <div className="relative z-10 flex h-screen w-full overflow-hidden">
          <Sidebar001
            defaultWidth={268}
            className="border-r border-white/10 bg-black/35 backdrop-blur-2xl"
          >
            <Sidebar001Header>
              <div className="flex flex-col gap-4">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="group flex items-center gap-2 text-[13px] font-medium text-zinc-400 transition-colors hover:text-amber-300"
                >
                  <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
                  Back to servers
                </button>
                <div className="cyron-glass flex items-center gap-3 rounded-2xl px-3 py-2.5">
                  {selectedGuild?.icon_url ? (
                    <img
                      src={selectedGuild.icon_url}
                      alt={displayName}
                      className="h-9 w-9 shrink-0 rounded-full object-cover ring-1 ring-white/15"
                    />
                  ) : (
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-500/20 ring-1 ring-amber-400/30">
                      <FaDiscord className="h-5 w-5 text-amber-300" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="truncate text-[15px] font-semibold tracking-tight text-white">
                      {displayName}
                    </p>
                    <p className="font-mono text-[10px] uppercase tracking-wider text-amber-400/80">
                      {selectedGuild?.plan || 'free'} plan
                    </p>
                  </div>
                </div>
              </div>
            </Sidebar001Header>
            <Sidebar001Content>
              <Sidebar001Section>
                <div className="mt-2 flex flex-col">
                  {sidebarGroups.map((group, idx) => (
                    <div key={idx} className="mb-6 flex flex-col">
                      {group.title && (
                        <h4 className="mb-2 px-4 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-white/35">
                          {group.title}
                        </h4>
                      )}
                      <div className="flex flex-col gap-0.5">
                        {group.items.map((tab) => (
                          <Sidebar001Item
                            key={tab.id}
                            href={`/guilds/${params.guildId}/${tab.id}`}
                            label={tab.label}
                            icon={tab.icon}
                            isActive={activeTabId === tab.id}
                            onClick={(e) => {
                              e.preventDefault();
                              handleTabChange(tab.id);
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </Sidebar001Section>
            </Sidebar001Content>
            <Sidebar001Footer>
              <div className="flex flex-col gap-2">
                <div className="text-center">
                  <a
                    href="mailto:support@cyron.ai"
                    className="text-xs text-zinc-500 transition-colors hover:text-amber-300"
                  >
                    Need help?
                  </a>
                </div>
                <ShinyButton
                  onClick={() => navigate('/premium')}
                  style={{ width: '100%', padding: '0.65rem 1.1rem', fontSize: '0.85rem', lineHeight: '1.4' }}
                >
                  {isFreePlan ? 'Upgrade Plan' : 'Upgrade'}
                </ShinyButton>
              </div>
            </Sidebar001Footer>
          </Sidebar001>

          <main className="flex-1 overflow-y-auto p-4 md:p-8 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/10 hover:[&::-webkit-scrollbar-thumb]:bg-amber-400/30 [&::-webkit-scrollbar]:w-2">
            <AnimatedOutlet />
          </main>
        </div>
      ) : (
        <main className="relative z-10 flex min-h-screen flex-1 flex-col">
          <AnimatedOutlet />
        </main>
      )}
    </div>
  );
};
