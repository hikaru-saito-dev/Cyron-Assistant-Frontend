import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { FAQSection as FAQSectionUI } from "../../components/ui/faqsection";

const faqVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

export const PremiumFaqSection = () => {
  const { premiumFaqs } = useApp();

  const half = Math.ceil(premiumFaqs.length / 2);
  const faqsLeft = premiumFaqs.slice(0, half);
  const faqsRight = premiumFaqs.slice(half);

  return (
    <motion.div
      className="w-full bg-transparent"
      variants={faqVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
    >
      <FAQSectionUI
        title="Billing &amp; Upgrades"
        subtitle="Frequently Asked Questions"
        description="A few details about billing, limits, and how upgrading works."
        buttonLabel="Support →"
        onButtonClick={() => window.location.href = "mailto:support@cyron.ai"}
        faqsLeft={faqsLeft}
        faqsRight={faqsRight}
      />
    </motion.div>
  );
};
