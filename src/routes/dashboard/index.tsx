import { Header } from '../../components/ui/header-2';
import ProfileSelect from '../../components/ui/3d-profile-selector';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';

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
    alert(`This would take you to the Discord OAuth page to add the bot to server ID: ${guildId}`);
  };

  return (
    <div className="min-h-screen bg-black text-slate-200">
      <Header />
      {isLoading ? (
        <div className="flex h-[calc(100vh-80px)] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-white"></div>
        </div>
      ) : (
        <ProfileSelect guilds={guilds || []} onAddBot={handleAddBot} />
      )}
    </div>
  );
};

export default Dashboard;
