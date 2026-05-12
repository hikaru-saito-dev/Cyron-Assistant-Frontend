import { Outlet, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { TopNav } from './TopNav';
import { GuildSidebarNav } from './GuildSidebarNav';
import { Footer } from './Footer';
import { api } from '../../lib/api';
import { AnimatedOutlet } from '../motion/AnimatedOutlet';

async function fetchGuilds(): Promise<Guild[]> {
  const res = await api.get<Guild[]>('/guilds');
  return res.data;
}

export const AppLayout = () => {
  const params = useParams<{ guildId?: string }>();
  const { data: guilds } = useQuery({
    queryKey: ['guilds'],
    queryFn: fetchGuilds,
  });

  const selectedGuild =
    guilds?.find((g) => String(g.id) === params.guildId) ?? null;

  return (
    <>
      <TopNav currentGuildName={selectedGuild?.name} />
      <div className="min-h-screen bg-bg-base">
        {params.guildId ? (
          <div className="mx-auto flex items-start max-w-6xl gap-6 px-4 pb-24 pt-4 md:pb-14 md:pt-8 md:px-6 lg:px-8 mt-10 md:mt-0">
            <GuildSidebarNav guild={selectedGuild} />
            <main className="flex-1 min-w-0">
              <AnimatedOutlet />
            </main>
          </div>
        ) : (
          <main className="flex-1 px-4 pb-14 pt-8 sm:px-8">
            <div className="mx-auto w-full max-w-7xl">
              <AnimatedOutlet />
            </div>
          </main>
        )}
      </div>
      <Footer />
    </>
  );
};
