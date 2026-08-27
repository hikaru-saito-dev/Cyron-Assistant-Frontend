import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAlert } from 'react-alert';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Check,
  CreditCard,
  Loader2,
  Lock,
  Server,
  ShieldCheck,
} from 'lucide-react';
import { Header } from '../../components/ui/header-2';
import { CinematicFooter } from '../../components/ui/motion-footer';
import { PageTransition } from '../../components/motion/PageTransition';
import { AtmosphereBackground } from '../../components/ui/AtmosphereBackground';
import { useAuth } from '../../hooks/useAuth';
import { useApp } from '../../context/AppContext';
import { api } from '../../lib/api';
import { cn } from '../../lib/utils';

type PlanType = 'pro' | 'business';
type BillingInterval = 'month' | 'year';

type BillingConfig = {
  enabled: boolean;
  currency: string;
  prices: {
    pro: { month: number; year: number };
    business: { month: number; year: number };
  };
};

const FALLBACK_PRICES = {
  pro: { month: 9, year: 90 },
  business: { month: 20, year: 200 },
} as const;

async function fetchGuilds(): Promise<Guild[]> {
  const res = await api.get<Guild[]>('/guilds');
  return res.data;
}

async function fetchBillingConfig(): Promise<BillingConfig> {
  const res = await api.get<BillingConfig>('/billing/config');
  return res.data;
}

function formatMoney(amount: number): string {
  return Number.isInteger(amount) ? `$${amount}` : `$${amount.toFixed(2)}`;
}

export const Payment = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();
  const { setSelectedPlan, pricingPlans } = useApp();
  const alert = useAlert();

  const rawPlan = searchParams.get('plan');
  const plan: PlanType =
    rawPlan === 'pro' || rawPlan === 'business' ? rawPlan : 'pro';

  const rawBilling = searchParams.get('billing');
  const initialInterval: BillingInterval =
    rawBilling === 'annual' || rawBilling === 'year' ? 'year' : 'month';

  const [interval, setInterval] = useState<BillingInterval>(initialInterval);
  const [selectedGuildId, setSelectedGuildId] = useState(
    () => searchParams.get('guildId') ?? '',
  );
  const [guildError, setGuildError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const {
    data: guilds,
    isLoading: isGuildsLoading,
    isError: isGuildsError,
  } = useQuery({
    queryKey: ['guilds'],
    queryFn: fetchGuilds,
    enabled: isAuthenticated,
  });

  const { data: billingConfig } = useQuery({
    queryKey: ['billing-config'],
    queryFn: fetchBillingConfig,
    staleTime: 60_000,
  });

  const hasShownGuildError = useRef(false);
  const hasShownCanceled = useRef(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) {
      navigate('/premium', { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

  useEffect(() => {
    setSelectedPlan(plan);
  }, [plan, setSelectedPlan]);

  useEffect(() => {
    if (!isGuildsError || hasShownGuildError.current) return;
    hasShownGuildError.current = true;
    alert.error('Failed to load your servers. Please refresh and try again.');
  }, [alert, isGuildsError]);

  useEffect(() => {
    if (searchParams.get('canceled') !== '1' || hasShownCanceled.current) return;
    hasShownCanceled.current = true;
    alert.info('Checkout canceled. No charge was made.');
  }, [alert, searchParams]);

  const planData = pricingPlans.find((p) => p.id === plan);
  const prices = billingConfig?.prices?.[plan] ?? FALLBACK_PRICES[plan];
  const amount = interval === 'year' ? prices.year : prices.month;
  const priceLabel = formatMoney(amount);
  const cadenceLabel = interval === 'year' ? '/ year' : '/ month';

  const selectedGuild = useMemo(
    () => guilds?.find((g) => String(g.id) === selectedGuildId) ?? null,
    [guilds, selectedGuildId],
  );

  const stripeEnabled = billingConfig?.enabled !== false;

  const handleCheckout = async () => {
    if (!selectedGuildId) {
      setGuildError('Please select a Discord server to apply this plan to.');
      return;
    }
    setGuildError('');
    setIsProcessing(true);

    try {
      const res = await api.post<{ url: string; session_id: string }>(
        '/billing/checkout-session',
        {
          guild_id: selectedGuildId,
          plan,
          interval,
        },
      );
      const url = res.data?.url;
      if (!url) {
        throw new Error('Checkout did not return a URL.');
      }
      window.location.assign(url);
    } catch (err: unknown) {
      setIsProcessing(false);
      const detail =
        (err as { response?: { data?: { detail?: string } } })?.response?.data
          ?.detail ??
        (err instanceof Error ? err.message : null) ??
        'Unable to start Stripe Checkout. Please try again.';
      alert.error(String(detail));
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="cyron-marketing relative flex min-h-[70vh] items-center justify-center text-white/50">
          <AtmosphereBackground fixed />
          <div className="relative z-10 flex items-center gap-3 font-mono text-sm uppercase tracking-[0.16em]">
            <Loader2 className="h-4 w-4 animate-spin text-amber-400" />
            Loading checkout…
          </div>
        </div>
        <CinematicFooter />
      </>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <Header />
      <PageTransition>
        <div className="cyron-marketing relative z-10 min-h-screen bg-[#050505] text-white">
          <AtmosphereBackground fixed />
          <div className="relative z-10 mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
            <div className="mb-10 max-w-2xl">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-amber-400/90">
                Checkout
              </p>
              <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-white md:text-4xl">
                Complete your purchase
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-white/50 md:text-base">
                Pick a server, choose monthly or yearly, then finish on Stripe.
                Card details never touch Cyron.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.25fr)] lg:gap-8">
              {/* Plan summary */}
              <motion.aside
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="cyron-glass h-fit overflow-hidden p-6 md:p-7"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-300">
                    {planData?.name ?? plan}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/30">
                    Per Discord server
                  </span>
                </div>

                <div className="mt-5 flex items-end gap-2">
                  <p className="font-mono text-4xl font-semibold tabular-nums text-white">
                    {priceLabel}
                  </p>
                  <p className="mb-1.5 text-sm text-white/40">{cadenceLabel}</p>
                </div>

                {interval === 'year' && (
                  <p className="mt-2 text-[12.5px] text-amber-300/80">
                    Two months free compared with paying monthly.
                  </p>
                )}

                {planData?.description && (
                  <p className="mt-4 text-[13px] leading-relaxed text-white/45">
                    {planData.description}
                  </p>
                )}

                <ul className="mt-6 space-y-3 border-t border-white/[0.07] pt-6">
                  {(planData?.features ?? []).map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-400/15 text-amber-300">
                        <Check className="h-3 w-3" strokeWidth={2.5} aria-hidden />
                      </span>
                      <span className="text-[13px] leading-relaxed text-white/65">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  to="/premium"
                  className="mt-7 inline-flex items-center gap-1.5 text-[13px] font-medium text-amber-300/90 transition-colors hover:text-amber-200"
                >
                  <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
                  Change plan
                </Link>
              </motion.aside>

              {/* Checkout steps */}
              <div className="space-y-5">
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.05 }}
                  className="cyron-glass p-6 md:p-7"
                >
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/35">
                    Step 1
                  </p>
                  <h2 className="mt-1.5 text-lg font-semibold text-white">
                    Billing interval
                  </h2>
                  <p className="mt-1 text-[13px] text-white/45">
                    Yearly billing is the same as ten months on this plan.
                  </p>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    {(
                      [
                        {
                          id: 'month' as const,
                          label: 'Monthly',
                          price: formatMoney(prices.month),
                          note: 'Billed every month',
                        },
                        {
                          id: 'year' as const,
                          label: 'Yearly',
                          price: formatMoney(prices.year),
                          note: 'Two months free',
                        },
                      ] as const
                    ).map((option) => {
                      const active = interval === option.id;
                      return (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => setInterval(option.id)}
                          className={cn(
                            'rounded-xl border px-4 py-4 text-left transition-all duration-200',
                            active
                              ? 'border-amber-400/40 bg-amber-400/[0.08]'
                              : 'border-white/10 bg-white/[0.03] hover:border-white/20',
                          )}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[13px] font-semibold text-white">
                              {option.label}
                            </span>
                            {option.id === 'year' && (
                              <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-amber-300/90">
                                Save 2 mo
                              </span>
                            )}
                          </div>
                          <p className="mt-2 font-mono text-xl font-semibold tabular-nums text-white">
                            {option.price}
                          </p>
                          <p className="mt-1 text-[11.5px] text-white/40">{option.note}</p>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.1 }}
                  className="cyron-glass p-6 md:p-7"
                >
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/35">
                    Step 2
                  </p>
                  <h2 className="mt-1.5 text-lg font-semibold text-white">
                    Select server
                  </h2>
                  <p className="mt-1 text-[13px] text-white/45">
                    Apply {planData?.name ?? plan} to one Discord server. Plans
                    are billed per server.
                  </p>

                  <div className="mt-5">
                    {isGuildsLoading && (
                      <div className="flex items-center gap-2 text-sm text-white/45">
                        <Server className="h-4 w-4 text-white/30" aria-hidden />
                        Loading your servers…
                      </div>
                    )}

                    {isGuildsError && !isGuildsLoading && (
                      <div className="rounded-xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                        Failed to load your servers. Please refresh and try again.
                      </div>
                    )}

                    {!isGuildsLoading && !isGuildsError && (
                      <>
                        <label className="sr-only" htmlFor="checkout-guild">
                          Discord server
                        </label>
                        <select
                          id="checkout-guild"
                          value={selectedGuildId}
                          onChange={(e) => {
                            setSelectedGuildId(e.target.value);
                            if (guildError) setGuildError('');
                          }}
                          className={cn(
                            'w-full rounded-xl border px-4 py-3 text-sm transition',
                            guildError
                              ? 'border-red-400/50 focus:border-red-400 focus:ring-red-400/30'
                              : 'border-white/12 focus:border-amber-400/50 focus:ring-amber-400/20',
                          )}
                        >
                          <option value="">Select a Discord server</option>
                          {(guilds ?? []).map((g) => (
                            <option key={g.id} value={String(g.id)}>
                              {g.name}
                              {g.has_bot ? '' : ' (bot not installed)'}
                            </option>
                          ))}
                        </select>
                        {guildError && (
                          <p className="mt-2 text-sm text-red-300">{guildError}</p>
                        )}
                        {selectedGuild && !selectedGuild.has_bot && (
                          <p className="mt-2 text-[12.5px] text-amber-200/70">
                            This server does not have Cyron installed yet. You can
                            still subscribe; invite the bot afterwards from the
                            dashboard.
                          </p>
                        )}
                      </>
                    )}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.15 }}
                  className="cyron-glass p-6 md:p-7"
                >
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/35">
                    Step 3
                  </p>
                  <h2 className="mt-1.5 text-lg font-semibold text-white">
                    Pay with Stripe
                  </h2>
                  <p className="mt-1 text-[13px] leading-relaxed text-white/45">
                    You will be redirected to Stripe Checkout to enter your card.
                    Promotion codes are accepted there. Manage or cancel later in
                    the Stripe customer portal.
                  </p>

                  <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    {[
                      {
                        icon: Lock,
                        title: 'Card stays on Stripe',
                        detail: 'Cyron never sees your card number.',
                      },
                      {
                        icon: ShieldCheck,
                        title: 'Cancel anytime',
                        detail: 'Portal access from your dashboard.',
                      },
                      {
                        icon: CreditCard,
                        title: 'Promo codes',
                        detail: 'Enter them on the Stripe page.',
                      },
                    ].map((item) => (
                      <div
                        key={item.title}
                        className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5"
                      >
                        <item.icon
                          className="h-4 w-4 text-amber-400/90"
                          strokeWidth={1.5}
                          aria-hidden
                        />
                        <p className="mt-2.5 text-[12.5px] font-semibold text-white">
                          {item.title}
                        </p>
                        <p className="mt-1 text-[11.5px] leading-relaxed text-white/40">
                          {item.detail}
                        </p>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={handleCheckout}
                    disabled={isProcessing || isGuildsLoading || isGuildsError}
                    className="cyron-btn-primary mt-6 w-full disabled:pointer-events-none disabled:opacity-60"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                        Redirecting to Stripe…
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-4 w-4" aria-hidden />
                        Continue to Stripe · {priceLabel}
                        {interval === 'year' ? '/yr' : '/mo'}
                      </>
                    )}
                  </button>

                  {!stripeEnabled && (
                    <p className="mt-3 text-center text-[12px] text-amber-200/70">
                      Stripe is not configured on this server yet. Ask the operator
                      to set STRIPE_SECRET_KEY.
                    </p>
                  )}

                  <p className="mt-3 text-center text-[11.5px] leading-relaxed text-white/30">
                    By continuing you agree to our terms. No charge until you
                    complete payment on Stripe.
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </PageTransition>
      <CinematicFooter />
    </>
  );
};
