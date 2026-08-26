import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./accordion";
import { cn } from "../../lib/utils";

type FAQItem = {
  question: string;
  answer: string;
};

interface FAQSectionProps {
  title?: string;
  subtitle?: string;
  description?: string;
  buttonLabel?: string;
  onButtonClick?: () => void;
  faqsLeft: FAQItem[];
  faqsRight: FAQItem[];
  className?: string;
}

export function FAQSection({
  title = "Product & Account Help",
  subtitle = "Frequently Asked Questions",
  description = "Get instant answers to the most common questions about your account, product setup, and updates.",
  buttonLabel = "Browse All FAQs →",
  onButtonClick,
  faqsLeft,
  faqsRight,
  className,
}: FAQSectionProps) {
  return (
    <section className={cn("w-full max-w-5xl mx-auto py-16 px-4 bg-transparent", className)}>
      {/* Header */}
      <div className="text-center mb-10">
        <p
          className="text-xs font-medium tracking-[0.16em] uppercase text-amber-400/80 mb-2"
          style={{ fontFamily: '"JetBrains Mono", ui-monospace, monospace' }}
        >
          {subtitle}
        </p>
        <h2 className="font-display text-3xl md:text-4xl font-semibold mb-3 text-white">
          {title}
        </h2>
        <p className="text-white/50 max-w-xl mx-auto mb-6">
          {description}
        </p>
        <button type="button" className="cyron-btn-primary !px-6 !py-2.5 !text-sm" onClick={onButtonClick}>
          {buttonLabel}
        </button>
      </div>

      {/* FAQs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
        {[faqsLeft, faqsRight].map((faqColumn, columnIndex) => (
          <Accordion
            key={columnIndex}
            type="single"
            collapsible
            className="space-y-3"
          >
            {faqColumn.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`item-${columnIndex}-${i}`}
                className="cyron-glass cyron-glass-hover rounded-xl border-b-0 px-4 data-[state=open]:border-amber-400/25"
              >
                <AccordionTrigger className="text-base font-medium text-white hover:no-underline hover:text-amber-200/90 py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-white/50 leading-relaxed">
                  <div className="min-h-[40px] transition-all duration-200 ease-in-out pb-2">
                    {faq.answer}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ))}
      </div>
    </section>
  );
}
