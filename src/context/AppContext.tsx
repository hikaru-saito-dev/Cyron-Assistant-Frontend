import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const AppContext = createContext<AppContextValue | undefined>(undefined);

const LS_THEME_KEY = 'theme';
const LS_SELECTED_PLAN_KEY = 'selected_plan';

/**
 * Canonical plan copy for checkout and any AppContext consumer.
 * Numbers mirror core/backend/schemas/plans.py + knowledge_service.py + config.py.
 */
const DEFAULT_PRICING_PLANS: readonly PricingPlan[] = [
  {
    id: 'free',
    name: 'Free',
    priceLabel: '$0',
    priceSubLabel: '/ month',
    description:
      'Run a real ticket system with grounded AI replies and find out what your members actually ask.',
    features: [
      '50,000 AI tokens per month',
      '10 tickets per day · 1 AI session at a time',
      '2 knowledge entries · 20,000 characters',
      'Unlimited ticket panels, each with its own AI',
      'No card required, never expires',
    ],
    variant: 'neutral',
    ctaLabel: 'Start on Free',
  },
  {
    id: 'pro',
    name: 'Pro',
    priceLabel: '$9',
    priceSubLabel: '/ month',
    description:
      'For communities where support is constant and the AI needs enough headroom to carry the repetitive questions.',
    features: [
      '1,500,000 AI tokens per month',
      '50 tickets per day · 3 AI sessions at a time',
      '5 knowledge entries · 50,000 characters',
      'Everything in Free, with room to cover a busy queue',
      'Two months free when billed yearly ($90/year)',
    ],
    variant: 'primary',
    ctaLabel: 'Upgrade to Pro',
  },
  {
    id: 'business',
    name: 'Business',
    priceLabel: '$20',
    priceSubLabel: '/ month',
    description:
      'For large servers and product communities that need the fullest knowledge base and the highest daily ticket ceiling.',
    features: [
      '3,000,000 AI tokens per month',
      '100 tickets per day · 3 AI sessions at a time',
      '10 knowledge entries · 100,000 characters',
      'Widest knowledge capacity for detailed policies',
      'Two months free when billed yearly ($200/year)',
    ],
    variant: 'success',
    ctaLabel: 'Upgrade to Business',
  },
];

const DEFAULT_STATS: readonly StatCard[] = [
  {
    id: 'servers',
    label: 'Servers',
    value: 2735,
    helper: 'Discord servers using our bot',
    color: 'sky',
  },
  {
    id: 'tickets',
    label: 'Tickets handled',
    value: 143769,
    helper: 'Tickets resolved automatically',
    color: 'emerald',
  },
  {
    id: 'ai-servers',
    label: 'AI‑enabled servers',
    value: 253,
    helper: 'Servers with automation switched on',
    color: 'indigo',
  },
  {
    id: 'response',
    label: 'Avg response time',
    value: 4,
    suffix: 's',
    helper: 'Lightning‑fast AI ticket replies',
    color: 'amber',
  },
];

const DEFAULT_REVIEWS: readonly Review[] = [
  {
    id: 'review-1',
    textParts: [
      { left: 'We went from waking up to a wall of', right: 'even sees them.' },
      'unanswered tickets to most common questions being answered before a mod',
    ],
    reviewer: 'Community manager, SaaS server',
  },
  {
    id: 'review-2',
    textParts: [
      { left: 'Our staff still handles edge cases, but', right: '70% of the ticket volume.' },
      'Cyron Assistant quietly takes care of 60 -',
    ],
    reviewer: 'Head of support, gaming community',
  },
  {
    id: 'review-3',
    textParts: [
      { left: 'Setup was faster than expected. Once we', right: 'adding another reliable staff member.' },
      'tuned the prompts and limits, it felt like',
    ],
    reviewer: 'Server owner, premium Discord',
  },
];

const DEFAULT_HOME_FAQS: readonly FaqItem[] = [
  {
    id: 'home-faq-1',
    question: 'Do I need to change how my tickets work today?',
    answer:
      'No. Cyron brings its own panels and ticket channels, and it only ever speaks inside tickets it opened. You choose which panels have AI auto-reply enabled and which support roles it escalates to.',
  },
  {
    id: 'home-faq-2',
    question: 'How does the bot learn our knowledge base?',
    answer:
      'You write knowledge entries in the dashboard, or let Cyron extract recurring problem and solution pairs from your past ticket transcripts. It answers only from that approved knowledge — it never browses the internet.',
  },
  {
    id: 'home-faq-3',
    question: 'What stops it from making something up?',
    answer:
      'Every candidate answer is scored against your knowledge by meaning before it is used. Weak matches are left out of the prompt entirely, so the bot asks a clarifying question or offers your staff instead of inventing a price or a policy.',
  },
  {
    id: 'home-faq-4',
    question: 'What happens when our staff want to take over?',
    answer:
      'The moment a staff member types in a ticket, the AI stops replying in that channel. It stays silent until someone runs /ticket ai resume, so the bot never talks over your team.',
  },
  {
    id: 'home-faq-5',
    question: 'Can each ticket category have different AI behaviour?',
    answer:
      'Yes. Every panel can point at its own AI context with its own instructions and its own knowledge, on top of your server-wide General Rules. A billing panel and a partnership panel never see each other’s knowledge.',
  },
  {
    id: 'home-faq-6',
    question: 'What happens if we remove the bot from Discord?',
    answer:
      'AI replies stop, but your existing ticket channels continue working as normal with human staff only. Your configuration and knowledge stay in the dashboard if you invite it back.',
  },
];

const DEFAULT_PREMIUM_FAQS: readonly FaqItem[] = [
  {
    id: 'premium-faq-1',
    question: 'Can I run Free on some servers and Pro on others?',
    answer:
      'Yes. Plans are applied per Discord server. Many teams start with Free on side‑servers and upgrade only their main community once the team is comfortable.',
  },
  {
    id: 'premium-faq-2',
    question: 'What happens if I hit my monthly token limit?',
    answer:
      'The AI stops replying, but the ticket system keeps working exactly as before — panels, forms, claiming, priorities, closing and transcripts are all unaffected. Your usage page shows tokens used against your limit at any time.',
  },
  {
    id: 'premium-faq-3',
    question: 'How is billing handled, and can I cancel?',
    answer:
      'Pro and Business both run through Stripe Checkout, monthly or yearly, and you manage or cancel the subscription yourself in the Stripe billing portal. Card details never touch Cyron.',
  },
  {
    id: 'premium-faq-4',
    question: 'Is yearly billing cheaper?',
    answer:
      'Yes. Yearly billing costs the same as ten months on both paid plans — $90 a year for Pro instead of $108, and $200 a year for Business instead of $240. Promotion codes are accepted at checkout.',
  },
  {
    id: 'premium-faq-5',
    question: 'When do my counters reset?',
    answer:
      'Token allowance resets on the first of the month at 00:00 UTC, and the daily ticket counter resets every day at 00:00 UTC.',
  },
];

function readThemeFromStorage(): ThemeMode {
  // Product UI is designed for the premium dark grid aesthetic.
  if (typeof window === 'undefined') return 'dark';
  const stored = window.localStorage.getItem(LS_THEME_KEY);
  if (stored === 'light' || stored === 'dark') return stored;
  return 'dark';
}

function readSelectedPlanFromStorage(): PlanType {
  if (typeof window === 'undefined') return 'pro';
  const stored = window.localStorage.getItem(LS_SELECTED_PLAN_KEY);
  return stored === 'free' || stored === 'pro' || stored === 'business' ? stored : 'pro';
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => readThemeFromStorage());
  const [selectedPlan, setSelectedPlanState] = useState<PlanType>(() => readSelectedPlanFromStorage());

  useEffect(() => {
    if (typeof document === 'undefined' || typeof window === 'undefined') return;
    document.documentElement.classList.toggle('dark', theme === 'dark');
    window.localStorage.setItem(LS_THEME_KEY, theme);
    window.dispatchEvent(new Event('themechange'));
  }, [theme]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(LS_SELECTED_PLAN_KEY, selectedPlan);
  }, [selectedPlan]);

  const setTheme = useCallback((t: ThemeMode) => setThemeState(t), []);
  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  const setSelectedPlan = useCallback((plan: PlanType) => {
    setSelectedPlanState(plan);
  }, []);

  const value = useMemo<AppContextValue>(
    () => ({
      theme,
      setTheme,
      toggleTheme,
      selectedPlan,
      setSelectedPlan,
      pricingPlans: DEFAULT_PRICING_PLANS,
      stats: DEFAULT_STATS,
      reviews: DEFAULT_REVIEWS,
      homeFaqs: DEFAULT_HOME_FAQS,
      premiumFaqs: DEFAULT_PREMIUM_FAQS,
    }),
    [selectedPlan, setSelectedPlan, setTheme, theme, toggleTheme]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}


