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
    <section className="cyron-glass space-y-3 p-4">
      <h3 className="font-display text-sm font-bold text-white">
        {title}
        {required && <span className="ml-1 text-rose-400">*</span>}
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
        <p className="mb-1.5 font-sans text-xs text-zinc-400">{label}</p>
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
                  ? "border-amber-400/40 bg-amber-400/10 text-amber-200"
                  : "border-white/10 bg-white/[0.04] text-zinc-300 hover:bg-white/[0.07]"
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
              ? "border-amber-400/40 bg-amber-400/10 text-amber-200"
              : "border-white/10 bg-white/[0.04] text-zinc-300 hover:bg-white/[0.07]"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
