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

  const DEMO_GUILDS = [
    { id: '1', name: 'Cyron HQ',        has_bot: true,  plan: 'business', icon_url: null },
    { id: '2', name: 'Dev Corner',      has_bot: true,  plan: 'pro',      icon_url: 'https://ik.imagekit.io/kqmrslzuq/21st.dev%20Components/3D%20Profile%20Selector/1.jpg' },
    { id: '3', name: 'Gaming Lounge',   has_bot: true,  plan: 'free',     icon_url: 'https://ik.imagekit.io/kqmrslzuq/21st.dev%20Components/3D%20Profile%20Selector/2.jpg' },
    { id: '6', name: 'Night Owls',      has_bot: false, plan: 'free',     icon_url: 'https://ik.imagekit.io/kqmrslzuq/21st.dev%20Components/3D%20Profile%20Selector/3.jpg' },
    { id: '7', name: 'Study Group',     has_bot: false, plan: 'free',     icon_url: null },
  ];

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
        <ProfileSelect guilds={DEMO_GUILDS as any[]} onAddBot={handleAddBot} />
      </div>
    </div>
  );
};

export default Dashboard;
