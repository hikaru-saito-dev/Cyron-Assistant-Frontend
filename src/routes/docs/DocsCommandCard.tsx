import clsx from 'clsx';
import type { DocItem } from './docsContent';

const PLAN_STYLES: Record<string, string> = {
  all: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
  admin: 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30',
  staff: 'bg-sky-500/15 text-sky-700 dark:text-sky-400 border-sky-500/30',
  free: 'bg-slate-500/15 text-slate-600 dark:text-slate-400 border-slate-500/30',
  pro: 'bg-violet-500/15 text-violet-700 dark:text-violet-400 border-violet-500/30',
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
      className="scroll-mt-28 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900/80 md:p-6"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h3 className="font-display text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          {item.title.startsWith('/') ? (
            <span className="font-mono text-sky-600 dark:text-sky-400">{item.title}</span>
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

      <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
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
                    className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 font-mono text-[11px] text-slate-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300"
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
          <p className="font-display text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Steps
          </p>
          <ol className="mt-2 list-decimal space-y-2 pl-5 text-sm text-slate-600 dark:text-slate-400">
            {item.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>
      )}

      {item.tips && item.tips.length > 0 && (
        <div className="mt-5 rounded-xl border border-sky-200/80 bg-sky-50/80 p-4 dark:border-sky-500/20 dark:bg-sky-500/5">
          <p className="font-display text-xs font-semibold uppercase tracking-wider text-sky-700 dark:text-sky-400">
            Tips
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-sky-900/90 dark:text-sky-100/80">
            {item.tips.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
        </div>
      )}

      {item.errors && item.errors.length > 0 && (
        <div className="mt-5 rounded-xl border border-rose-200/80 bg-rose-50/60 p-4 dark:border-rose-500/20 dark:bg-rose-500/5">
          <p className="font-display text-xs font-semibold uppercase tracking-wider text-rose-700 dark:text-rose-400">
            Error states
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-rose-900/90 dark:text-rose-100/80">
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
      <p className="font-display text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-500">
        {label}
      </p>
      <div className="mt-1.5 text-sm text-slate-700 dark:text-slate-300">{children}</div>
    </div>
  );
}
