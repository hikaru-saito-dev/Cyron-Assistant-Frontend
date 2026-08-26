import { PricingPlansDemo } from '../../components/PricingPlansDemo';
import { PageTransition } from '../../components/motion/PageTransition';
import { HeroCommandCenter } from '../../components/marketing/HeroCommandCenter';
import { FeaturesSection } from './FeaturesSection';
import { Stats } from '../../components/ui/statistics-card';
import ImpactSection from '../../components/ui/impact-section';
import Testimonial3 from '../../components/ui/testimonial-section-3';
import { FaqSection } from './FaqSection';
import { CinematicFooter } from '../../components/ui/motion-footer';
import { Header } from '../../components/ui/header-2';
import { AtmosphereBackground } from '../../components/ui/AtmosphereBackground';
import { TicketScenePlayer } from '../../components/marketing/TicketScenePlayer';
import { AnswerPipeline } from '../../components/marketing/AnswerPipeline';
import { CommandReference } from '../../components/marketing/CommandReference';
import { TrustChecklist } from '../../components/marketing/TrustChecklist';
import { FinalCta } from '../../components/marketing/FinalCta';
import { motion } from 'framer-motion';

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8, ease: 'easeOut' } },
};

export const Home = () => {
  return (
    <>
      <Header />
      <PageTransition>
        <div className="cyron-marketing relative min-h-screen bg-[#050505] text-white z-10">
          <AtmosphereBackground fixed />
          <div className="relative z-10">
            <HeroCommandCenter />
            <FeaturesSection />
            <TicketScenePlayer />
            <AnswerPipeline />
            <CommandReference />
            <Stats />
            <motion.div variants={fadeIn} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
              <ImpactSection />
            </motion.div>
            <PricingPlansDemo />
            <motion.div variants={fadeIn} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
              <Testimonial3 />
            </motion.div>
            <TrustChecklist />
            <motion.div variants={fadeIn} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
              <FaqSection />
            </motion.div>
            <FinalCta />
          </div>
        </div>
      </PageTransition>
      <CinematicFooter />
    </>
  );
};
