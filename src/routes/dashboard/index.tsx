import { TextBlurIn } from '../../components/ui/text-blur-in';
import { Header } from '../../components/ui/header-2';
import ProfileSelect from '../../components/ui/3d-profile-selector';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { api } from '../../lib/api';
import { DISCORD_BOT_INVITE_URL } from '../../lib/config';

async function fetchGuilds() {
  const res = await api.get('/guilds');
  return res.data;
}

export const Dashboard = () => {
  const [searchParams] = useSearchParams();
  const paymentSuccess = searchParams.get('payment') === 'success';
  const newlyPurchasedGuildId = searchParams.get('guildId');
  const newlyPurchasedPlan = searchParams.get('plan');

  const isLoading = false;
  const rawGuilds = [
    { id: '101', name: 'Neon Knights', icon_url: null, has_bot: true, plan: 'premium' },
    { id: '102', name: 'Cyberpunk Hub', icon_url: null, has_bot: false, plan: 'free' },
    { id: '103', name: 'Quantum Realm', icon_url: null, has_bot: true, plan: 'enterprise' },
    { id: '104', name: 'Apex Legends Scrims', icon_url: null, has_bot: false, plan: 'free' },
    { id: '105', name: 'Starlight Lounge', icon_url: null, has_bot: true, plan: 'premium' },
    { id: '106', name: 'Free Server', icon_url: null, has_bot: true, plan: 'free' }
  ];

  const allGuilds = rawGuilds.map(g => {
    if (paymentSuccess && newlyPurchasedGuildId && String(g.id) === newlyPurchasedGuildId) {
      return { ...g, plan: newlyPurchasedPlan ?? undefined };
    }
    return g;
  });

  const handleAddBot = (guildId: string | number) => {
    console.log('Add bot to guild', guildId);
    const url = `${DISCORD_BOT_INVITE_URL}&guild_id=${guildId}&disable_guild_select=true`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-black text-slate-200 relative flex flex-col">
      {/* Radial Gradient Background */}
      <div className="absolute inset-0 h-full w-full pointer-events-none">
        <div className="absolute inset-0 h-full w-full [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#0433FF_100%)] z-0"></div>
      </div>
      <div className="relative z-10 w-full">
        <Header />
      </div>
      <main className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-6 md:px-12 pt-24 pb-20 flex flex-col justify-start">
        <h1
          className="text-white font-bold uppercase text-[3rem] md:text-[6rem] leading-[0.85] tracking-tighter"
          style={{ fontFamily: 'Impact, "Arial Black", sans-serif' }}
        >
          Select Your <span style={{ color: '#0433FF' }}>Server.</span>
        </h1>
        <TextBlurIn delay={0.2} className="mt-4 text-lg md:text-xl text-neutral-400 font-medium max-w-xl leading-relaxed">
          Select a server to manage its settings or add Cyron Assistant to a new one.
        </TextBlurIn>

        <ProfileSelect guilds={allGuilds} onAddBot={handleAddBot} />
      </main>
    </div>
  );
};

export default Dashboard;
