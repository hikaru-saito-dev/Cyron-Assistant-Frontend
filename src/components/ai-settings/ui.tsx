import { FaSave } from "react-icons/fa";
import type { GeneralRulesTab } from "./constants";
import { GENERAL_RULES_TABS } from "./constants";

export function GlobalBadge({ compact = false }: { compact?: boolean }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border border-amber-400/30 bg-amber-400/10 font-display font-semibold uppercase tracking-wide text-amber-300 ${
        compact ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-0.5 text-[10px]"
      }`}
    >
      Global — all panels
    </span>
  );
}

export function TabBar({
  active,
  onChange,
}: {
  active: GeneralRulesTab;
  onChange: (tab: GeneralRulesTab) => void;
}) {
  return (
    <div className="cyron-glass inline-flex flex-wrap gap-1 p-1.5">
      {GENERAL_RULES_TABS.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => onChange(t.id)}
          className={`rounded-xl px-4 py-2 font-sans text-sm font-medium transition-all ${
            active === t.id
              ? "bg-[#F5A623] text-[#0a0a0a] shadow-sm"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

export function EditorArea({
  value,
  onChange,
  placeholder,
  minHeight = "min-h-[320px]",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  minHeight?: string;
}) {
  return (
    <div className="cyron-glass overflow-hidden">
      <div className="flex items-center gap-2 border-b border-white/10 bg-white/[0.04] px-4 py-2.5">
        <span className="font-mono text-[11px] font-medium uppercase tracking-widest text-white/40">
          Markdown
        </span>
      </div>
      <textarea
        className={`w-full resize-y border-0 bg-transparent px-5 py-4 font-mono text-[13px] leading-relaxed text-white placeholder:text-white/40 focus:outline-none focus:ring-0 ${minHeight}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        spellCheck={false}
      />
    </div>
  );
}

export function PrimaryButton({
  onClick,
  disabled,
  loading,
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className="cyron-btn-primary !px-5 !py-2.5 !text-sm"
    >
      {loading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#0a0a0a]/40 border-t-transparent" />
      ) : (
        <FaSave className="text-xs" />
      )}
      {children}
    </button>
  );
}

export function ToggleSwitch({
  enabled,
  onChange,
}: {
  enabled: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors ${
        enabled ? "bg-emerald-500" : "bg-white/15"
      }`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${
          enabled ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}
