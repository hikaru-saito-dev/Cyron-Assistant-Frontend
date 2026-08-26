import { Header } from '../../components/ui/header-2';
import { CinematicFooter } from '../../components/ui/motion-footer';
import { PricingPlansDemo } from '../../components/PricingPlansDemo';
import { PageTransition } from '../../components/motion/PageTransition';
import { AtmosphereBackground } from '../../components/ui/AtmosphereBackground';

import FUIBentoGridDark from '../../components/ui/bento';
import { PremiumFaqSection } from './FaqSection';
import TextRevealHero from './TextRevealHero';

export const Premium = () => {
  return (
    <>
      <Header />
      <PageTransition>
        <div className="cyron-marketing relative min-h-screen bg-[#050505] text-white z-10">
          <AtmosphereBackground fixed />
          <div className="relative z-10">
            <TextRevealHero />
            <FUIBentoGridDark />
            <PricingPlansDemo />
            <PremiumFaqSection />
          </div>
        </div>
      </PageTransition>
      <CinematicFooter />
    </>
  );
};
