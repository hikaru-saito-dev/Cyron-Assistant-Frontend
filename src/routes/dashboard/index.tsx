import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../hooks/useAuth';
import { api } from '../../lib/api';
import { DISCORD_BOT_INVITE_URL } from '../../lib/config';
import { useAlert } from 'react-alert';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardHeaderSection } from './HeaderSection';
import { DashboardGuildGrid } from './GuildGrid';
import {
  Search,
  LayoutDashboard,
  Settings,
  LogOut,
  ChevronDown,
  PanelLeftClose,
  PanelLeftOpen,
  Command,
  X,
  Home,
  Server,
  BookOpen,
  RefreshCcw,
  BarChart2,
  FolderClosed,
  Users,
  Database,
  FileText,
  FileEdit,
  MoreHorizontal
} from 'lucide-react';

type SidebarItem = {
  id: string;
  title: string;
  icon: React.ElementType;
  route?: string; // if set, navigates to this route instead of staying in dashboard
};

const sidebarItems: SidebarItem[] = [
  { id: 'servers', title: 'Your Servers', icon: Server },
  { id: 'home', title: 'Home', icon: Home, route: '/' },
  { id: 'docs', title: 'Docs', icon: BookOpen, route: '/docs' },
];


export const Dashboard = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(true);
  const [activeId, setActiveId] = useState('servers');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();

  const params = useParams<{ guildId?: string }>();
  const alert = useAlert();
  const { data: guilds, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ['guilds'],
    queryFn: async () => {
      const res = await api.get<any[]>('/guilds');
      return res.data;
    },
  });

  const hasShownGuildError = useRef(false);
  useEffect(() => {
    if (!isError || hasShownGuildError.current) return;
    hasShownGuildError.current = true;
    alert.error(
      'Failed to load servers. Try again, or log out and sign in with Discord to refresh your server list.',
    );
  }, [alert, isError]);

  const displayGuilds = guilds || [];

  const selectedGuild = displayGuilds?.find((g: any) => String(g.id) === params.guildId) ?? null;

  const stats = useMemo(() => {
    const total = displayGuilds?.length ?? 0;
    const botInstalled = displayGuilds?.filter((g: any) => !!g.has_bot).length ?? 0;
    return { total, botInstalled };
  }, [displayGuilds]);

  const handleAddBot = (guildId: string | number) => {
    const url = `${DISCORD_BOT_INVITE_URL}&guild_id=${String(
      guildId,
    )}&disable_guild_select=true`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const activeItem = sidebarItems.find(i => i.id === activeId);
  const activeTitle = activeItem ? activeItem.title : 'Dashboard';

  const handleSelect = (id: string) => {
    const item = sidebarItems.find(i => i.id === id);
    if (item?.route) {
      navigate(item.route);
      return;
    }
    setActiveId(id);
  };

  return (
    <div className="flex flex-col w-full h-screen bg-[#050505] text-slate-200">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(4,51,255,0.15),rgba(255,255,255,0))] pointer-events-none" />
      <div className="relative w-full h-full flex overflow-hidden z-10">


        <div
          className={`h-full transition-all duration-500 ease-out shrink-0 overflow-hidden ${isOpen ? 'w-[260px] opacity-100' : 'w-0 opacity-0 border-none'
            }`}
        >

          <div className="flex flex-col w-[260px] h-full bg-[#111111] border-r border-white/5 font-sans z-20 shrink-0">
            {/* Header */}
            <div className="flex items-center gap-3 px-6 h-16 border-b border-white/5 shrink-0">
              {user?.avatar_url ? (
                <img src={user.avatar_url} alt={user.username} className="w-6 h-6 rounded-full shrink-0 object-cover" />
              ) : (
                <div className="w-6 h-6 rounded-full border border-white/20 bg-white/10 flex items-center justify-center shrink-0">
                  <span className="text-[10px] text-white font-medium">{user?.username?.[0]?.toUpperCase() || '?'}</span>
                </div>
              )}
              <span className="text-[14px] font-medium text-white tracking-tight truncate">{user?.username || 'User'}</span>
            </div>

            {/* Nav Items */}
            <div className="flex-1 overflow-y-auto py-6 flex flex-col gap-8">
              {/* Main Navigation */}
              <div className="flex flex-col gap-1">
                <div className="flex flex-col">
                  {sidebarItems.map(item => {
                    const isActive = activeId === item.id && !item.route;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleSelect(item.id)}
                        className={`group flex items-center gap-3 px-6 py-2.5 transition-colors ${
                          isActive ? 'text-white' : 'text-slate-200 hover:text-white'
                        }`}
                      >
                        <item.icon className={`w-[18px] h-[18px] transition-colors ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-300'}`} strokeWidth={1.5} />
                        <span className="text-[14px] font-medium">{item.title}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* System Section */}
              <div className="flex flex-col gap-1 mt-auto">
                <div className="flex flex-col">
                  <button 
                    onClick={() => navigate('/')}
                    className="group flex items-center gap-3 px-6 py-2.5 text-slate-200 hover:text-red-400 transition-colors"
                  >
                    <LogOut className="w-[18px] h-[18px] text-slate-400 group-hover:text-red-400 transition-colors" strokeWidth={1.5} />
                    <span className="text-[14px] font-medium">Log out</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>


        <div className="flex-1 flex flex-col min-w-0 transition-all duration-300 bg-transparent">


          <div className="h-16 border-b border-white/5 flex items-center px-6 justify-between bg-white/[0.02] backdrop-blur-md shrink-0">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-1.5 rounded-md text-slate-400 hover:bg-white/5 hover:text-white transition-colors"
              >
                {isOpen ? <PanelLeftClose className="w-[18px] h-[18px]" strokeWidth={1.5} /> : <PanelLeftOpen className="w-[18px] h-[18px]" strokeWidth={1.5} />}
              </button>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <span className="font-medium text-white truncate">{activeTitle}</span>
              </div>
            </div>


          </div>


          <div className="p-6 md:p-8 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] space-y-8">
            <DashboardHeaderSection
              selectedGuild={selectedGuild}
              stats={stats}
              isLoading={isLoading}
              onAddBot={handleAddBot}
            />

            <div className="w-full flex flex-col pt-4">
              <div className="px-2 flex items-center justify-between mb-4">
                <h2 className="text-[17px] font-bold text-white tracking-tight">Your Servers</h2>
                <span className="text-[13px] font-medium text-slate-400">{isLoading ? '' : `${(displayGuilds as any[]).length} servers`}</span>
              </div>
              {isLoading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="w-6 h-6 border-2 border-white/10 border-t-[#0433FF] rounded-full animate-spin" />
                </div>
              ) : (
                <DashboardGuildGrid
                  guilds={displayGuilds as any}
                  activeGuildId={params.guildId}
                  onAddBot={handleAddBot}
                />
              )}
            </div>
          </div>
        </div>


        {isSearchOpen && (
          <div className="absolute inset-0 z-50 flex items-start justify-center pt-[15vh] bg-background/40 backdrop-blur-sm px-4">
            <div className="absolute inset-0" onClick={() => setIsSearchOpen(false)} />
            <div className="relative w-full max-w-xl bg-card border border-border/50 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center px-4 border-b border-border/50">
                <Search className="w-[18px] h-[18px] text-muted-foreground/70 mr-3 shrink-0" strokeWidth={1.5} />
                <input
                  autoFocus
                  className="flex-1 bg-transparent py-4 outline-none text-[14px] text-foreground placeholder:text-muted-foreground/50"
                  placeholder="Search projects, docs, or actions..."
                />
                <kbd
                  onClick={() => setIsSearchOpen(false)}
                  className="hidden sm:inline-flex items-center justify-center h-5 px-1.5 ml-2 text-[10px] font-medium font-mono text-muted-foreground/70 bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/10 rounded-[4px] cursor-pointer hover:text-foreground hover:bg-black/10 dark:hover:bg-white/20 transition-colors"
                >
                  ESC
                </kbd>
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="ml-3 p-1 rounded-md text-muted-foreground/70 hover:bg-black/5 dark:hover:bg-white/10 hover:text-foreground transition-colors"
                >
                  <X className="w-[18px] h-[18px]" strokeWidth={1.5} />
                </button>
              </div>
              <div className="p-2 py-8 flex flex-col items-center justify-center">
                <Command className="w-6 h-6 text-muted-foreground/30 mb-2" strokeWidth={1.5} />
                <p className="text-[13px] text-muted-foreground font-medium">Type a command or search...</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
