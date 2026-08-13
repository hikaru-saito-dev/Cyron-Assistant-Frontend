import { useRef, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAlert } from 'react-alert';
import { api } from '../../lib/api';
import { DISCORD_BOT_INVITE_URL } from '../../lib/config';
import { Header } from '../../components/ui/header-2';
import AdvancedStats from '../../components/ui/advanced-stats';
import ProfileSelect from '../../components/ui/3d-profile-selector';

export const Dashboard = () => {
  const alert = useAlert();

  const { data: guilds, isLoading, isError } = useQuery({
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
    alert.error('Failed to load servers. Try again, or log out and sign in with Discord to refresh your server list.');
  }, [alert, isError]);

  const displayGuilds = guilds || [];
  const activeGuilds = displayGuilds as any[];

  const stats = useMemo(() => {
    const total = activeGuilds.length;
    const botInstalled = activeGuilds.filter((g) => !!g.has_bot).length;
    const paid = activeGuilds.filter((g) => g.plan === 'pro' || g.plan === 'business').length;
    const adoptionRate = Math.round((botInstalled / (total || 1)) * 100);
    return { total, botInstalled, paid, adoptionRate };
  }, [activeGuilds]);

  const handleAddBot = (guildId: string | number) => {
    const url = `${DISCORD_BOT_INVITE_URL}&guild_id=${String(
      guildId,
    )}&disable_guild_select=true`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-black text-slate-200">

      <Header />

      <AdvancedStats
        totalServers={stats.total}
        botActive={stats.botInstalled}
        paidServers={stats.paid}
        adoptionRate={stats.adoptionRate}
        isLoading={isLoading}
      />

      <ProfileSelect guilds={activeGuilds} onAddBot={handleAddBot} />
    </div>
  );
};

export default Dashboard;
