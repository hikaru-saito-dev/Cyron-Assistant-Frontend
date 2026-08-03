import StaggeredMenu from '../../components/ui/StaggeredMenu';
import { CinematicFooter } from '../../components/ui/motion-footer';
import { PricingPlansDemo } from '../../components/PricingPlansDemo';
import { PageTransition } from '../../components/motion/PageTransition';
import { useAuth } from '../../hooks/useAuth';

import FUIBentoGridDark from '../../components/ui/bento';
import { PremiumFaqSection } from './FaqSection';
import TextRevealHero from './TextRevealHero';


export const Premium = () => {
  const menuItems = [
    { label: 'Home', ariaLabel: 'Go to home page', link: '/' },
    { label: 'Pricing', ariaLabel: 'Learn about us', link: '/premium' },
    { label: 'Docs', ariaLabel: 'View our services', link: '/docs' }
  ];

  const socialItems = [
    { label: 'YouTube', link: 'https://youtube.com' }
  ];
  const { isAuthenticated, loginWithDiscord } = useAuth();

  return (
    <>
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
      />
      <PageTransition>
        <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-slate-50 dark:bg-none dark:bg-black relative z-10 rounded-b-3xl shadow-2xl">
          <TextRevealHero />
          <FUIBentoGridDark />
          <PricingPlansDemo />
          <PremiumFaqSection />

        </div>
      </PageTransition>
      <CinematicFooter />
    </>
  );
};

