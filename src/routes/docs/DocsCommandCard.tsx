import clsx from 'clsx';
import type { DocItem } from './docsContent';

const PLAN_STYLES: Record<string, string> = {
  all: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  admin: 'bg-amber-400/15 text-amber-300 border-amber-400/30',
  staff: 'bg-amber-400/10 text-amber-400 border-amber-400/25',
  free: 'bg-white/[0.06] text-zinc-400 border-white/15',
  pro: 'bg-violet-500/15 text-violet-300 border-violet-500/30',
};

const PLAN_LABELS: Record<string, string> = {
  all: 'ALL USERS',
  admin: 'ADMIN',
  staff: 'STAFF',
  free: 'FREE PLAN',
  pro: 'PRO PLAN',
};

type Props = {
  item: DocItem;
};

export function DocsCommandCard({ item }: Props) {
  const plan = item.plan ?? 'all';

  return (
    <article
      id={item.id}
      className="cyron-glass scroll-mt-28 p-5 md:p-6"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h3 className="font-display text-xl font-bold tracking-tight text-white">
          {item.title.startsWith('/') ? (
            <span className="font-mono text-amber-400">{item.title}</span>
          ) : (
            item.title
          )}
        </h3>
        <span
          className={clsx(
            'rounded-full border px-2.5 py-0.5 font-display text-[10px] font-bold uppercase tracking-wider',
            PLAN_STYLES[plan] ?? PLAN_STYLES.all,
          )}
        >
          {PLAN_LABELS[plan] ?? plan}
        </span>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-zinc-400">
        {item.description}
      </p>

      {(item.whoCanRun || item.permissions || item.cooldown || item.whatYouSee) && (
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {item.whoCanRun && (
            <MetaBlock label="Who can use it">{item.whoCanRun}</MetaBlock>
          )}
          {item.permissions && item.permissions.length > 0 && (
            <MetaBlock label="Permissions">
              <div className="flex flex-wrap gap-1.5">
                {item.permissions.map((p) => (
                  <span
                    key={p}
                    className="rounded-md border border-white/10 bg-white/[0.06] px-2 py-0.5 font-mono text-[11px] text-zinc-300"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </MetaBlock>
          )}
          {item.cooldown && <MetaBlock label="Cooldown">{item.cooldown}</MetaBlock>}
          {item.whatYouSee && <MetaBlock label="What you see">{item.whatYouSee}</MetaBlock>}
        </div>
      )}

      {item.steps && item.steps.length > 0 && (
        <div className="mt-5">
          <p className="font-display text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Steps
          </p>
          <ol className="mt-2 list-decimal space-y-2 pl-5 text-sm text-zinc-400">
            {item.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>
      )}

      {item.tips && item.tips.length > 0 && (
        <div className="mt-5 rounded-xl border border-amber-400/20 bg-amber-400/[0.06] p-4">
          <p className="font-display text-xs font-semibold uppercase tracking-wider text-amber-400">
            Tips
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-amber-100/80">
            {item.tips.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
        </div>
      )}

      {item.errors && item.errors.length > 0 && (
        <div className="mt-5 rounded-xl border border-rose-500/20 bg-rose-500/[0.07] p-4">
          <p className="font-display text-xs font-semibold uppercase tracking-wider text-rose-400">
            Error states
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-rose-100/80">
            {item.errors.map((err) => (
              <li key={err}>{err}</li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}

function MetaBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="font-display text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
        {label}
      </p>
      <div className="mt-1.5 text-sm text-zinc-300">{children}</div>
    </div>
  );
}
