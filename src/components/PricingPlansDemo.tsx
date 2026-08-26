import { PricingSection } from "./ui/pricing";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

/**
 * Plan names, prices and every limit below mirror the backend
 * (core/backend/schemas/plans.py, knowledge_service.py, config.py).
 * Keep them in sync — the comparison table on /premium states the same numbers.
 */
export function PricingPlansDemo() {
  const navigate = useNavigate();
  const { loginWithDiscord } = useAuth();

  const demoPlans = [
    {
      name: "Free",
      price: "0",
      yearlyPrice: "0",
      period: "month",
      features: [
        "50,000 AI tokens per month",
        "10 tickets per day · 1 AI session at a time",
        "2 knowledge entries · 20,000 characters",
        "Unlimited ticket panels, each with its own AI",
        "No card required, never expires",
      ],
      description: "Run a real ticket system with grounded AI replies and find out what your members actually ask.",
      buttonText: "Start on Free",
      onAction: () => loginWithDiscord(),
    },
    {
      name: "Pro",
      price: "9",
      yearlyPrice: "90",
      period: "month",
      features: [
        "1,500,000 AI tokens per month",
        "50 tickets per day · 3 AI sessions at a time",
        "5 knowledge entries · 50,000 characters",
        "Everything in Free, with room to cover a busy queue",
        "Two months free when billed yearly",
      ],
      description: "For communities where support is constant and the AI needs enough headroom to carry the repetitive questions.",
      buttonText: "Upgrade to Pro",
      isPopular: true,
      onAction: (isMonthly: boolean) => navigate(`/payment?plan=pro&billing=${isMonthly ? 'monthly' : 'annual'}`),
    },
    {
      name: "Business",
      price: "20",
      yearlyPrice: "200",
      period: "month",
      features: [
        "3,000,000 AI tokens per month",
        "100 tickets per day · 3 AI sessions at a time",
        "10 knowledge entries · 100,000 characters",
        "Widest knowledge capacity for detailed policies",
        "Two months free when billed yearly",
      ],
      description: "For large servers and product communities that need the fullest knowledge base and the highest daily ticket ceiling.",
      buttonText: "Upgrade to Business",
      onAction: (isMonthly: boolean) => navigate(`/payment?plan=business&billing=${isMonthly ? 'monthly' : 'annual'}`),
    },
  ];

  return (
    <PricingSection
      plans={demoPlans}
      title="One price per server. Every limit published."
      description="Panels, AI contexts, forms, support hours, claiming and analytics are on every plan. What changes is how much the AI can answer."
    />
  );
}
