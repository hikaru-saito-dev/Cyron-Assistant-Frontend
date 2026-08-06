import { Outlet, useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { TopNav } from './TopNav';
import { GuildSidebarNav } from './GuildSidebarNav';
import { WebGLBackground } from '../ui/webgl-background';
import { CinematicFooter } from '../ui/motion-footer';
import { api } from '../../lib/api';
import { AnimatedOutlet } from '../motion/AnimatedOutlet';

import StaggeredMenu from '../ui/StaggeredMenu';

const menuItems = [
  { label: 'Home', ariaLabel: 'Go to home page', link: '/' },
  { label: 'Pricing', ariaLabel: 'Learn about us', link: '/premium' },
  { label: 'Docs', ariaLabel: 'View our services', link: '/docs' }
];

const socialItems = [
  { label: 'YouTube', link: 'https://youtube.com' }
];

async function fetchGuilds(): Promise<Guild[]> {
  const res = await api.get<Guild[]>('/guilds');
  return res.data;
}

export const AppLayout = () => {
  const params = useParams<{ guildId?: string }>();
  const navigate = useNavigate();
  const { data: guilds } = useQuery({
    queryKey: ['guilds'],
    queryFn: fetchGuilds,
  });

  const selectedGuild =
    guilds?.find((g) => String(g.id) === params.guildId) ?? null;

  return (
    <div className="relative isolate">
      <WebGLBackground />
      <div className="relative z-10 flex flex-col min-h-screen">
        <StaggeredMenu
          position="right"
          isFixed={true}
          items={menuItems}
          socialItems={socialItems}
          displaySocials
          displayItemNumbering={true}
          menuButtonColor="#ffffff"
          openMenuButtonColor="#111"
          changeMenuColorOnOpen={true}
          colors={['#0433FF', '#0221a6']}
          accentColor="#0433FF"
          hideLoginButton={true}
        />
        <div className="flex-1">
          {params.guildId ? (
            <div className="mx-auto flex items-start max-w-6xl gap-4 px-3 pb-16 pt-3 md:pb-8 md:pt-5 md:px-5 lg:px-6 mt-8 md:mt-0">
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
      </div>
      <CinematicFooter 
        heading="Need help?" 
        actionLabel="Home" 
        onActionClick={() => navigate("/")} 
      />
    </div>
  );
};
