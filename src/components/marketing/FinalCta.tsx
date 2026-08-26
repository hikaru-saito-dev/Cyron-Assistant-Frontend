import { Link, useNavigate } from 'react-router-dom';
import { CreditCard, FlaskConical, Server, Undo2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Reveal } from './SectionShell';

const ASSURANCES = [
  {
    icon: Server,
    title: 'Free plan, forever',
    detail: 'It never expires and needs no card.',
  },
  {
    icon: FlaskConical,
    title: 'Test before go-live',
    detail: 'Simulate replies against your rules first.',
  },
  {
    icon: CreditCard,
    title: 'Stripe checkout',
    detail: 'Card details never touch Cyron.',
  },
  {
    icon: Undo2,
    title: 'Cancel yourself',
    detail: 'Manage or stop it in the billing portal.',
  },
];

export function FinalCta({
  secondaryLabel = 'See full pricing',
  secondaryHref = '/premium',
}: {
  secondaryLabel?: string;
  secondaryHref?: string;
} = {}) {
  const { isAuthenticated, loginWithDiscord } = useAuth();
  const navigate = useNavigate();

  const handlePrimary = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      loginWithDiscord();
    }
  };

  return (
    <section className="relative bg-transparent py-16 md:py-24">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <Reveal className="cyron-glass relative overflow-hidden p-8 md:p-12">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full blur-3xl"
            style={{
              background:
                'radial-gradient(circle, rgba(245,166,35,0.20) 0%, rgba(245,166,35,0.05) 45%, transparent 70%)',
            }}
          />

          <div className="relative grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-center">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-amber-400/90">
                Ready when you are
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-white text-balance md:text-4xl lg:text-[2.6rem] lg:leading-[1.06]">
                Teach it once. Stop answering the same question.
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/55 md:text-base">
                Add the bot, walk through your rules with the guided wizard, and let it take the
                repetitive tickets. Your staff keep the ones that actually need a person.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <button type="button" onClick={handlePrimary} className="cyron-btn-primary">
                  {isAuthenticated ? 'Open your dashboard' : 'Add to your server'}
                </button>
                <Link to={secondaryHref} className="cyron-btn-ghost">
                  {secondaryLabel}
                </Link>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {ASSURANCES.map((item) => (
                <div
                  key={item.title}
                  className="rounded-xl border border-white/10 bg-white/[0.03] p-4 transition-colors duration-300 hover:border-amber-400/25"
                >
                  <item.icon className="h-4 w-4 text-amber-400/90" strokeWidth={1.5} aria-hidden />
                  <p className="mt-3 text-[13px] font-semibold text-white">{item.title}</p>
                  <p className="mt-1 text-[12px] leading-relaxed text-white/40">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
