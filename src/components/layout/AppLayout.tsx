import { useState } from 'react';
import { Outlet, useParams, useNavigate, useLocation } from 'react-router-dom';
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
  LogOut
} from 'lucide-react';
import { Tabs } from '../ui/vercel-tabs';
import { api } from '../../lib/api';
import { AnimatedOutlet } from '../motion/AnimatedOutlet';
import { ShinyButton } from '../ui/shiny-button';

async function fetchGuilds(): Promise<Guild[]> {
  const res = await api.get<Guild[]>('/guilds');
  return res.data;
}

import {
  Sidebar001,
  Sidebar001Content,
  Sidebar001Header,
  Sidebar001Item,
  Sidebar001Section,
  Sidebar001Footer,
} from '../ui/sidebar-001';

export const AppLayout = () => {
  const params = useParams<{ guildId?: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);

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
    return 'panels'; // default
  })();

  const sidebarGroups = [
    {
      title: "Workspace",
      items: [
        { id: 'panels', label: 'Panels', icon: <LayoutDashboard className="w-4 h-4" /> },
        { id: 'tickets', label: 'Ticket Management', icon: <Ticket className="w-4 h-4" /> },
      ]
    },
    {
      title: "AI Management",
      items: [
        { id: 'contexts', label: 'AI Contexts', icon: <BrainCircuit className="w-4 h-4" /> },
        { id: 'knowledge', label: 'Knowledge', icon: <BookOpen className="w-4 h-4" /> },
        { id: 'ai-settings', label: 'AI Settings', icon: <Settings2 className="w-4 h-4" /> },
      ]
    },
    {
      title: "Insights",
      items: [
        { id: 'usage-analytics', label: 'Usage Analytics', icon: <Activity className="w-4 h-4" /> },
      ]
    },
    {
      title: "Configuration",
      items: [
        { id: 'embed-customization', label: 'Embed Customization', icon: <Paintbrush className="w-4 h-4" /> },
        { id: 'close-settings', label: 'Close Settings', icon: <LogOut className="w-4 h-4" /> },
      ]
    }
  ];

  const handleTabChange = (tabId: string) => {
    navigate(`/guilds/${params.guildId}/${tabId}`);
  };

  const displayName = selectedGuild?.name?.trim() || 'Server';
  const isFreePlan = !selectedGuild?.plan || selectedGuild?.plan === 'free';

  return (
    <div className="relative isolate bg-transparent text-slate-200 min-h-screen">
      {params.guildId ? (
        // Guild Settings Layout with Sidebar on Left
        <div className="flex w-full h-screen overflow-hidden">
          {/* Sidebar Navigation */}
          <Sidebar001 defaultWidth={260} className="border-r border-white/10">
            <Sidebar001Header>
              <div className="flex flex-col gap-4">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="flex items-center gap-2 text-[13px] font-medium text-slate-400 hover:text-white transition-colors group"
                >
                  <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
                  Back
                </button>
                <div className="flex items-center gap-3">
                  {selectedGuild?.icon_url ? (
                    <img src={selectedGuild.icon_url} alt={displayName} className="w-8 h-8 rounded-full shrink-0 object-cover" />
                  ) : (
                    <div className="w-8 h-8 rounded-full border border-white/20 bg-white/10 flex items-center justify-center shrink-0">
                      <span className="text-[12px] text-white font-medium">{displayName?.[0]?.toUpperCase() || '?'}</span>
                    </div>
                  )}
                  <span className="text-[16px] font-medium text-white tracking-tight truncate">{displayName}</span>
                </div>
              </div>
            </Sidebar001Header>
            <Sidebar001Content>
              <Sidebar001Section>
                <div className="flex flex-col mt-2">
                  {sidebarGroups.map((group, idx) => (
                    <div key={idx} className="flex flex-col mb-6">
                      {group.title && (
                        <h4 className="px-4 mb-2 text-xs font-semibold text-white/50 tracking-wide">
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
              <div className="flex flex-col gap-1.5">
                <div className="text-center">
                  <a href="mailto:support@cyron.ai" className="text-xs text-slate-400 hover:text-white transition-colors">
                    Need help ?
                  </a>
                </div>
                <ShinyButton
                  onClick={() => navigate('/premium')}
                  style={{ width: '100%', padding: '0.6rem 1.1rem', fontSize: '0.85rem', lineHeight: '1.4' }}
                >
                  {isFreePlan ? 'Upgrade Plan' : 'Upgrade'}
                </ShinyButton>
              </div>
            </Sidebar001Footer>
          </Sidebar001>

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto p-4 md:p-8 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-white/20">
            <AnimatedOutlet />
          </main>
        </div>
      ) : (
        // Other routes (Dashboard, etc.) render as normal full screen
        <main className="flex-1 flex flex-col min-h-screen">
          <AnimatedOutlet />
        </main>
      )}
    </div>
  );
};
