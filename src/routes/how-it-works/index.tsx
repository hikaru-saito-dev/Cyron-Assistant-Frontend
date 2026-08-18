import { Header } from '../../components/ui/header-2';
import { CinematicFooter } from '../../components/ui/motion-footer';
import { PageTransition } from '../../components/motion/PageTransition';
import SaaSHero from '../../components/ui/saa-s-template';
import FlowArtDefaultDemo from '../../components/ui/flow-art-demo';
import { Hero } from '../../components/ui/hero-1';

export const HowItWorks = () => {
  return (
    <>
      <Header />
      <PageTransition>
        <div className="min-h-screen bg-black relative z-10 rounded-b-3xl shadow-2xl pb-24">
          <SaaSHero />

          <FlowArtDefaultDemo />


        </div>
      </PageTransition>
      <CinematicFooter />
    </>
  );
};
