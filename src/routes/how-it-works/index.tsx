import { Header } from '../../components/ui/header-2';
import { CinematicFooter } from '../../components/ui/motion-footer';
import { PageTransition } from '../../components/motion/PageTransition';
import { AtmosphereBackground } from '../../components/ui/AtmosphereBackground';
import SaaSHero from '../../components/ui/saa-s-template';
import FlowArtDefaultDemo from '../../components/ui/flow-art-demo';

export const HowItWorks = () => {
  return (
    <>
      <Header />
      <PageTransition>
        <div className="cyron-marketing relative z-10 min-h-screen bg-[#050505] pb-24 text-white">
          <AtmosphereBackground fixed />
          <div className="relative z-10">
            <SaaSHero />
            <FlowArtDefaultDemo />
          </div>
        </div>
      </PageTransition>
      <CinematicFooter />
    </>
  );
};
