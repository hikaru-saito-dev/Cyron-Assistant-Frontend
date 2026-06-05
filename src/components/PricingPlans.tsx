import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'framer-motion';
import { FaCheck } from 'react-icons/fa';
import { useApp } from '../context/AppContext';

export const PricingPlans = () => {
  const { isAuthenticated, loginWithDiscord } = useAuth();
  const { pricingPlans, setSelectedPlan } = useApp();
  const freePlan = pricingPlans.find((p) => p.id === 'free');
  const proPlan = pricingPlans.find((p) => p.id === 'pro');
  const businessPlan = pricingPlans.find((p) => p.id === 'business');

  return (
    <section className="border-b border-slate-200 bg-white dark:bg-[#0b1120] dark:border-slate-800">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-12 text-center md:text-left md:gap-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-500">
              Premium plans
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
              Simple pricing for every Discord server
            </h2>
            <p className="mt-3 max-w-xl text-base text-slate-600 dark:text-slate-400">
              Start on Free, then upgrade to Pro or Business when your community, team, or product
              needs more consistent AI coverage.
            </p>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {/* Free */}
          <motion.div
            className="relative flex flex-col justify-between rounded-3xl border border-slate-200 bg-slate-50 p-9 shadow-sm dark:bg-slate-900 dark:border-slate-700"
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.05 }}
          >
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-600 dark:text-slate-400">
                {freePlan?.name ?? 'Free'}
              </p>
              <div className="mt-4 flex items-end gap-2">
                <p className="mt-4 text-4xl font-semibold text-slate-900 dark:text-white">
                  {freePlan?.priceLabel ?? '$0'}
                </p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {freePlan?.priceSubLabel ?? ' / month'}
                </p>
              </div>
              <p className="mt-4 text-base text-slate-600 dark:text-slate-400">
                {freePlan?.description ?? 'Perfect for getting started with basic ticket management and AI replies.'}
              </p>
              <ul className="mt-5 space-y-2.5 text-sm text-slate-700 dark:text-slate-300">
                {(freePlan?.features ?? []).map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5">
                    <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center text-sky-500">
                      <FaCheck className="h-3.5 w-3.5" />
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-6">
              <Link
                to={isAuthenticated ? '/dashboard' : '#'}
                className="inline-flex w-full items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 transition hover:bg-slate-100 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700"
                onClick={isAuthenticated ? undefined : (e) => { e.preventDefault(); loginWithDiscord(); }}
              >
                {freePlan?.ctaLabel ?? 'Get started free'}
              </Link>
            </div>
          </motion.div>

          {/* Pro */}
          <motion.div
            className="relative flex flex-col justify-between rounded-3xl border border-sky-500 bg-sky-950 p-9 shadow-soft dark:bg-sky-950 dark:border-sky-600"
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.17 }}
          >
            <div className="absolute right-5 top-5 rounded-full bg-sky-500/20 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-400">
              Most popular
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-400">
                {proPlan?.name ?? 'Pro'}
              </p>
              <div className="mt-4 flex items-end gap-2">
                <p className="mt-4 text-4xl font-semibold text-white">
                  {proPlan?.priceLabel ?? '$9'}
                </p>
                <p className="mt-1 text-sm text-sky-300">
                  {proPlan?.priceSubLabel ?? ' / month'}
                </p>
              </div>
              <p className="mt-4 text-base text-sky-100">
                {proPlan?.description ?? 'For serious support teams that want reliable AI coverage with human oversight.'}
              </p>
              <ul className="mt-5 space-y-2.5 text-sm text-sky-100">
                {(proPlan?.features ?? []).map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5">
                    <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center text-sky-400">
                      <FaCheck className="h-3.5 w-3.5" />
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-6">
              <Link
                to={isAuthenticated ? '/payment?plan=pro' : '#'}
                className="inline-flex w-full items-center justify-center rounded-full bg-sky-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-sky-500/40 transition hover:bg-sky-400"
                onClick={isAuthenticated ? () => setSelectedPlan('pro') : (e) => { e.preventDefault(); loginWithDiscord(); }}
              >
                {proPlan?.ctaLabel ?? 'Start Pro trial'}
              </Link>
            </div>
          </motion.div>

          {/* Business */}
          <motion.div
            className="relative flex flex-col justify-between rounded-3xl border border-emerald-600 bg-emerald-950 p-9 shadow-sm dark:bg-emerald-950 dark:border-emerald-700"
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.29 }}
          >
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">
                {businessPlan?.name ?? 'Business'}
              </p>
              <div className="mt-4 flex items-end gap-2">
                <p className="text-4xl font-semibold text-white">
                  {businessPlan?.priceLabel ?? '$20'}
                </p>
                <p className="text-sm text-emerald-300">
                  {businessPlan?.priceSubLabel ?? 'custom pricing'}
                </p>
              </div>
              <p className="mt-4 text-base text-emerald-100">
                {businessPlan?.description ?? 'For large communities, scaled support teams, and SaaS products.'}
              </p>
              <ul className="mt-5 space-y-2.5 text-sm text-emerald-100">
                {(businessPlan?.features ?? []).map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5">
                    <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center text-emerald-400">
                      <FaCheck className="h-3.5 w-3.5" />
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-6">
              <Link
                to={isAuthenticated ? '/payment?plan=business' : '#'}
                className="inline-flex w-full items-center justify-center rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-500/40 transition hover:bg-emerald-400"
                onClick={isAuthenticated ? () => setSelectedPlan('business') : (e) => { e.preventDefault(); loginWithDiscord(); }}
              >
                {businessPlan?.ctaLabel ?? 'Contact sales'}
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};