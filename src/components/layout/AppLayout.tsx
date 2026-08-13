import { useState } from 'react';
import { Outlet, useParams, useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft } from 'lucide-react';
import { Tabs } from '../ui/vercel-tabs';
import { api } from '../../lib/api';
import { AnimatedOutlet } from '../motion/AnimatedOutlet';

async function fetchGuilds(): Promise<Guild[]> {
  const res = await api.get<Guild[]>('/guilds');
  return res.data;
}

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

  const tabsList = [
    { id: 'panels', label: 'Panels' },
    { id: 'contexts', label: 'AI Contexts' },
    { id: 'knowledge', label: 'Knowledge' },
    { id: 'ai-settings', label: 'AI Settings' },
    { id: 'embed-customization', label: 'Embed Customization' },
    { id: 'close-settings', label: 'Close Settings' },
    { id: 'usage-analytics', label: 'Usage Analytics' },
    { id: 'tickets', label: 'Ticket Management' },
  ];

  const handleTabChange = (tabId: string) => {
    navigate(`/guilds/${params.guildId}/${tabId}`);
  };

  const displayName = selectedGuild?.name?.trim() || 'Server';

  return (
    <div className="relative isolate bg-black text-slate-200">
      {params.guildId ? (
        // Guild Settings Layout with Top Navigation
        <div className="flex flex-col w-full h-screen overflow-hidden">
          
          <div className="relative w-full flex flex-col h-full z-10 overflow-hidden">
            {/* Top Header & Navigation */}
            <header className="bg-white/[0.02] backdrop-blur-md shrink-0">
              <div className="flex items-center justify-between px-6 py-4">
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="flex items-center gap-2 text-[13px] font-medium text-slate-400 hover:text-white transition-colors group"
                >
                  <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" /> 
                  Back to Dashboard
                </button>
                
                <div className="flex items-center gap-3">
                  {selectedGuild?.icon_url ? (
                    <img src={selectedGuild.icon_url} alt={displayName} className="w-8 h-8 rounded-full shrink-0 object-cover" />
                  ) : (
                    <div className="w-8 h-8 rounded-full border border-white/20 bg-white/10 flex items-center justify-center shrink-0">
                      <span className="text-[12px] text-white font-medium">{displayName?.[0]?.toUpperCase() || '?'}</span>
                    </div>
                  )}
                  <span className="text-[16px] font-medium text-white tracking-tight">{displayName}</span>
                </div>
                
                <div className="w-24"></div> {/* Spacer for centering */}
              </div>

              {/* Navigation Tabs */}
              <div className="px-6 py-2 flex justify-center">
                <Tabs 
                  tabs={tabsList} 
                  activeTab={activeTabId} 
                  onTabChange={handleTabChange} 
                />
              </div>
            </header>
            
            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto p-4 md:p-8 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-white/20">
              <AnimatedOutlet />
            </main>
          </div>
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
