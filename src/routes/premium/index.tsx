import { Header } from '../../components/ui/header-2';
import { CinematicFooter } from '../../components/ui/motion-footer';
import { PricingPlansDemo } from '../../components/PricingPlansDemo';
import { PageTransition } from '../../components/motion/PageTransition';
import { useAuth } from '../../hooks/useAuth';

import FUIBentoGridDark from '../../components/ui/bento';
import { PremiumFaqSection } from './FaqSection';
import TextRevealHero from './TextRevealHero';


export const Premium = () => {
  const { isAuthenticated, loginWithDiscord } = useAuth();

  return (
    <>
      <Header />
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

