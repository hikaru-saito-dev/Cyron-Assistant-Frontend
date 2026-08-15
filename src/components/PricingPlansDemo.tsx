import { PricingSection } from "./ui/pricing";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export function PricingPlansDemo() {
  const navigate = useNavigate();
  const { loginWithDiscord } = useAuth();

  const demoPlans = [
    {
      name: "Starter",
      price: "0",
      yearlyPrice: "0",
      period: "month",
      features: [
        "Core AI ticket replies",
        "Limited monthly tokens & tickets",
        "Basic knowledge base & canned replies",
        "Community support via Discord",
      ],
      description: "Perfect for getting started with basic ticket management and AI replies.",
      buttonText: "Get started for free",
      onAction: () => loginWithDiscord(),
    },
    {
      name: "Professional",
      price: "9",
      yearlyPrice: "90",
      period: "month",
      features: [
        "5-10× Free token & ticket limits",
        "Priority AI models & faster responses",
        "Customizable ticket embeds & branding",
        "Fine‑grained concurrency & rate limits",
        "Usage analytics with export‑ready charts",
        "Email support with 24-48h response",
      ],
      description: "For serious support teams that want reliable AI coverage with human oversight.",
      buttonText: "Get Started",
      isPopular: true,
      onAction: (isMonthly: boolean) => navigate(`/payment?plan=pro&billing=${isMonthly ? 'monthly' : 'annual'}`),
    },
    {
      name: "Business",
      price: "20",
      yearlyPrice: "200",
      period: "month",
      features: [
        "10× Pro plan limits for tokens, tickets, and concurrency",
        "Priority access to the fastest AI models and shortest response queue times",
        "Dedicated onboarding, account manager, and configuration with your team",
        "Advanced audit logs, security controls, and SSO/SAML support",
        "Role-based access for multiple admins and support staff",
        "SLA-backed prioritzed incident response & uptime guarantees",
      ],
      description: "Highest-tier plan for mission-critical communities, SaaS products, and scaled support teams that require rapid SLAs, and holistic control over all AI-enabled ticket handling.",
      buttonText: "Start Business trial",
      onAction: (isMonthly: boolean) => navigate(`/payment?plan=business&billing=${isMonthly ? 'monthly' : 'annual'}`),
    },
  ];

  return (
    <PricingSection
      plans={demoPlans}
      title="Find the Perfect Plan"
      description=""
    />
  );
}
