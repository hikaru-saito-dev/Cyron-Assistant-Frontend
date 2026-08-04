import { TopNav } from '../../components/layout/TopNav';
import { PricingPlansDemo } from '../../components/PricingPlansDemo';
import { useAuth } from '../../hooks/useAuth';
import { PageTransition } from '../../components/motion/PageTransition';
import { Hero } from '../../components/ui/hero-1';
import { FeaturesSection } from './FeaturesSection';
import { Stats } from '../../components/ui/statistics-card';
import ImpactSection from '../../components/ui/impact-section';
import Testimonial3 from '../../components/ui/testimonial-section-3';
import { FaqSection } from './FaqSection';
import { CinematicFooter } from '../../components/ui/motion-footer';
import StaggeredMenu from '../../components/ui/StaggeredMenu';
import { motion } from 'framer-motion';


const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8, ease: 'easeOut' } },
};

const menuItems = [
  { label: 'Home', ariaLabel: 'Go to home page', link: '/' },
  { label: 'Pricing', ariaLabel: 'Learn about us', link: '/premium' },
  { label: 'Docs', ariaLabel: 'View our services', link: '/docs' }
];

const socialItems = [
  { label: 'YouTube', link: 'https://youtube.com' }
];

export const Home = () => {
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
      {/* <TopNav currentGuildName={null} /> */}
      <PageTransition>
        <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-slate-50 dark:bg-none dark:bg-black relative z-10 rounded-b-3xl shadow-2xl">
          <Hero
            staticText="Powering smarter"
            rotatingTexts={["tickets", "replies", "support"]}
            secondaryText="for your community"
            subtitle="Grounded AI answers, instant ticket panels, and seamless handoffs. All from one dashboard built for Discord communities."
            eyebrow="AI-POWERED SUPPORT"
            ctaLabel="Get Started"
          />
          <FeaturesSection />
          <Stats />
          <motion.div variants={fadeIn} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
            <ImpactSection />
          </motion.div>
          <PricingPlansDemo />
          <motion.div variants={fadeIn} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
            <Testimonial3 />
          </motion.div>
          <motion.div variants={fadeIn} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
            <FaqSection />
          </motion.div>
        </div>
      </PageTransition>
      <CinematicFooter />
    </>
  );
};