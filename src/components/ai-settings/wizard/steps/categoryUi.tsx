type Opt = string | { id: string; label: string };

function norm(o: Opt): { id: string; label: string } {
  return typeof o === "string" ? { id: o, label: o } : o;
}

export function SectionCard({
  title,
  required,
  children,
}: {
  title: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3 rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
      <h3 className="font-display text-sm font-bold text-slate-900 dark:text-white">
        {title}
        {required && <span className="ml-1 text-rose-500">*</span>}
      </h3>
      {children}
    </section>
  );
}

export function ChipMulti({
  options,
  values,
  onChange,
  label,
}: {
  options: Opt[];
  values: string[];
  onChange: (next: string[]) => void;
  label?: string;
}) {
  const opts = options.map(norm);
  return (
    <div>
      {label && (
        <p className="mb-1.5 font-sans text-xs text-slate-500">{label}</p>
      )}
      <div className="flex flex-wrap gap-2">
        {opts.map((o) => {
          const on = values.includes(o.id);
          return (
            <button
              key={o.id}
              type="button"
              onClick={() =>
                onChange(
                  on ? values.filter((x) => x !== o.id) : [...values, o.id],
                )
              }
              className={`rounded-xl border px-3 py-1.5 font-sans text-xs font-medium transition ${
                on
                  ? "border-indigo-400 bg-indigo-50 text-indigo-800 dark:bg-indigo-500/15 dark:text-indigo-200"
                  : "border-slate-200 text-slate-600 dark:border-slate-600 dark:text-slate-300"
              }`}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function ChipSingle({
  options,
  value,
  onChange,
}: {
  options: Opt[];
  value: string;
  onChange: (next: string) => void;
}) {
  const opts = options.map(norm);
  return (
    <div className="flex flex-wrap gap-2">
      {opts.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => onChange(o.id)}
          className={`rounded-xl border px-3 py-1.5 font-sans text-xs font-medium transition ${
            value === o.id
              ? "border-indigo-400 bg-indigo-50 text-indigo-800 dark:bg-indigo-500/15 dark:text-indigo-200"
              : "border-slate-200 text-slate-600 dark:border-slate-600 dark:text-slate-300"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
