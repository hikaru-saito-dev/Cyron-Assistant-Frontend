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

  const { data: rawGuilds = [] } = useQuery({
    queryKey: ['guilds'],
    queryFn: fetchGuilds,
  });

  const allGuilds = rawGuilds.map((g: any) => {
    if (paymentSuccess && newlyPurchasedGuildId && String(g.id) === newlyPurchasedGuildId) {
      return { ...g, plan: newlyPurchasedPlan ?? undefined };
    }
    return g;
  });

  const handleAddBot = (guildId: string | number) => {
    const url = `${DISCORD_BOT_INVITE_URL}&guild_id=${guildId}&disable_guild_select=true`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="relative flex min-h-screen flex-col text-zinc-100">
      <div className="relative z-10 w-full">
        <Header />
      </div>

      <main className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-start px-6 pb-20 pt-24 md:px-12">
        <div className="mb-3 inline-flex w-fit items-center gap-2 rounded-full border border-amber-400/25 bg-amber-400/10 px-3.5 py-1.5">
          <span className="cyron-pulse-dot relative flex h-2 w-2 rounded-full bg-emerald-400" />
          <span className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-amber-300/90">
            Workspace ready
          </span>
        </div>

        <h1 className="font-display text-[2.75rem] font-bold leading-[0.92] tracking-tight text-white md:text-[5.5rem]">
          Select your{' '}
          <span className="bg-gradient-to-r from-[#F5A623] via-[#ffd27a] to-white bg-clip-text text-transparent">
            server
          </span>
          .
        </h1>

        <TextBlurIn
          delay={0.2}
          className="mt-5 max-w-xl text-base font-medium leading-relaxed text-zinc-400 md:text-lg"
        >
          Choose a Discord server to configure Cyron — panels, knowledge, AI behavior, and usage analytics.
        </TextBlurIn>

        <ProfileSelect guilds={allGuilds} onAddBot={handleAddBot} />
      </main>
    </div>
  );
};

export default Dashboard;
