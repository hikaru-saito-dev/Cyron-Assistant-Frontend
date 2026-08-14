import { Header } from '../../components/ui/header-2';
import ProfileSelect from '../../components/ui/3d-profile-selector';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { WebGLBackground } from '../../components/ui/webgl-background';
import { DISCORD_BOT_INVITE_URL } from '../../lib/config';

async function fetchGuilds() {
  const res = await api.get('/guilds');
  return res.data;
}

export const Dashboard = () => {
  const { data: guilds, isLoading } = useQuery({
    queryKey: ['guilds'],
    queryFn: fetchGuilds,
  });



  const handleAddBot = (guildId: string | number) => {
    console.log('Add bot to guild', guildId);
    const url = `${DISCORD_BOT_INVITE_URL}&guild_id=${guildId}&disable_guild_select=true`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-transparent text-slate-200 relative">
      <WebGLBackground />
      <div className="relative z-10">
        <Header />
        <ProfileSelect guilds={(guilds as any[]) || []} onAddBot={handleAddBot} />
      </div>
    </div>
  );
};

export default Dashboard;
