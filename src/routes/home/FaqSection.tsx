import { useApp } from "../../context/AppContext";
import { FAQSection as FAQSectionUI } from "../../components/ui/faqsection";

export function FaqSection() {
  const { homeFaqs, premiumFaqs } = useApp();
  
  const allFaqs = [...homeFaqs, ...premiumFaqs];
  const half = Math.ceil(allFaqs.length / 2);
  const faqsLeft = allFaqs.slice(0, half);
  const faqsRight = allFaqs.slice(half);

  return (
    <div className="w-full bg-transparent">
      <FAQSectionUI
        title="Platform & Product Support"
        subtitle="Frequently Asked Questions"
        description="Everything you need to know about how our platform works, from setup and customization to integrations and updates."
        buttonLabel="Support →"
        onButtonClick={() => window.location.href = "mailto:support@cyron.ai"}
        faqsLeft={faqsLeft}
        faqsRight={faqsRight}
      />
    </div>
  );
}
