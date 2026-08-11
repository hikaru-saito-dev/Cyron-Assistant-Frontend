import { useState } from 'react';
import { Outlet, useParams, useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { GuildSidebarNav } from './GuildSidebarNav';
import { api } from '../../lib/api';
import { AnimatedOutlet } from '../motion/AnimatedOutlet';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';

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

  // Determine active title based on path
  const getActiveTitle = () => {
    const path = location.pathname;
    if (path.includes('/panels')) return 'Panels';
    if (path.includes('/contexts')) return 'AI Contexts';
    if (path.includes('/knowledge')) return 'Knowledge';
    if (path.includes('/ai-settings')) return 'AI Settings';
    if (path.includes('/embed-customization')) return 'Embed Customization';
    if (path.includes('/close-settings')) return 'Close Settings';
    if (path.includes('/usage-analytics')) return 'Usage Analytics';
    if (path.includes('/tickets')) return 'Ticket Management';
    return 'Settings';
  };

  return (
    <div className="relative isolate bg-[#050505] text-slate-200">
      {params.guildId ? (
        // Guild Settings Layout (matches Dashboard UI)
        <div className="flex flex-col w-full h-screen overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(4,51,255,0.15),rgba(255,255,255,0))] pointer-events-none z-0" />
          <div className="relative w-full h-full flex overflow-hidden z-10">
            
            {/* Sidebar */}
            <div 
              className={`h-full transition-all duration-500 ease-out shrink-0 overflow-hidden ${
                isOpen ? 'w-[260px] opacity-100' : 'w-0 opacity-0 border-none'
              }`}
            >
              <GuildSidebarNav guild={selectedGuild} />
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-transparent">
              {/* Header */}
              <div className="h-16 border-b border-white/5 flex items-center px-6 justify-between bg-white/[0.02] backdrop-blur-md shrink-0">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-1.5 rounded-md text-slate-400 hover:bg-white/5 hover:text-white transition-colors"
                  >
                    {isOpen ? <PanelLeftClose className="w-[18px] h-[18px]" strokeWidth={1.5} /> : <PanelLeftOpen className="w-[18px] h-[18px]" strokeWidth={1.5} />}
                  </button>
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <span className="font-medium text-white truncate">{getActiveTitle()}</span>
                  </div>
                </div>
              </div>
              
              {/* Content Area */}
              <main className="flex-1 overflow-y-auto p-4 md:p-8 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-white/20">
                <AnimatedOutlet />
              </main>
            </div>
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
