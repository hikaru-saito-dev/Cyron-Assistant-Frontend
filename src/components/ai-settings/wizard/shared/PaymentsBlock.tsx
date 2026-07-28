import { FaPlus, FaTrash } from "react-icons/fa";
import {
  CRYPTO_COINS,
  CRYPTO_NETWORKS,
  type PaymentsData,
} from "../categoryTypes";
import { newRuleId } from "../types";

type Props = {
  data: PaymentsData;
  onChange: (data: PaymentsData) => void;
};

export function PaymentsBlock({ data, onChange }: Props) {
  function toggle(key: keyof PaymentsData, value: boolean) {
    onChange({ ...data, [key]: value });
  }

  const methodsOn =
    data.paypal ||
    data.crypto ||
    data.card ||
    data.bank ||
    data.paysafecard ||
    data.other;

  return (
    <div className="space-y-3">
      <p className="font-sans text-xs text-slate-500">
        Select at least one payment method with details (required for selling).
        {!methodsOn && (
          <span className="text-amber-600"> — none selected yet.</span>
        )}
      </p>

      <Method
        label="PayPal"
        on={data.paypal}
        onToggle={(v) => toggle("paypal", v)}
      >
        <input
          className="mb-2 w-full rounded-lg border border-slate-200 px-3 py-2 font-sans text-sm dark:border-slate-600 dark:bg-slate-800"
          placeholder="PayPal email"
          value={data.paypalEmail}
          onChange={(e) => onChange({ ...data, paypalEmail: e.target.value })}
        />
        <div className="flex flex-wrap gap-2">
          {(
            [
              ["fnf", "Friends & Family"],
              ["gs", "Goods & Services"],
              ["both", "Both"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => onChange({ ...data, paypalType: id })}
              className={`rounded-lg border px-2.5 py-1 font-sans text-xs ${
                data.paypalType === id
                  ? "border-indigo-400 bg-indigo-50 text-indigo-800"
                  : "border-slate-200"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </Method>

      <Method
        label="Crypto"
        on={data.crypto}
        onToggle={(v) => toggle("crypto", v)}
      >
        {data.cryptoRows.map((row, i) => (
          <div
            key={row.id}
            className="mb-2 grid gap-2 rounded-lg border border-slate-200 p-2 sm:grid-cols-3 dark:border-slate-600"
          >
            <select
              className="rounded-lg border border-slate-200 px-2 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
              value={row.coin}
              onChange={(e) => {
                const coin = e.target.value;
                const nets = CRYPTO_NETWORKS[coin] || ["Other"];
                const next = [...data.cryptoRows];
                next[i] = {
                  ...row,
                  coin,
                  network: nets.includes(row.network) ? row.network : nets[0],
                };
                onChange({ ...data, cryptoRows: next });
              }}
            >
              {CRYPTO_COINS.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <select
              className="rounded-lg border border-slate-200 px-2 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
              value={row.network}
              onChange={(e) => {
                const next = [...data.cryptoRows];
                next[i] = { ...row, network: e.target.value };
                onChange({ ...data, cryptoRows: next });
              }}
            >
              {(CRYPTO_NETWORKS[row.coin] || ["Other"]).map((n) => (
                <option key={n}>{n}</option>
              ))}
            </select>
            <div className="flex gap-1">
              <input
                className="min-w-0 flex-1 rounded-lg border border-slate-200 px-2 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
                placeholder="Address"
                value={row.address}
                onChange={(e) => {
                  const next = [...data.cryptoRows];
                  next[i] = { ...row, address: e.target.value };
                  onChange({ ...data, cryptoRows: next });
                }}
              />
              <button
                type="button"
                onClick={() =>
                  onChange({
                    ...data,
                    cryptoRows: data.cryptoRows.filter((_, j) => j !== i),
                  })
                }
                className="text-red-500"
              >
                <FaTrash className="text-xs" />
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            onChange({
              ...data,
              cryptoRows: [
                ...data.cryptoRows,
                {
                  id: newRuleId(),
                  coin: "USDT",
                  network: "TRC20",
                  address: "",
                },
              ],
            })
          }
          className="inline-flex items-center gap-1 font-sans text-xs font-semibold text-indigo-600"
        >
          <FaPlus className="text-[10px]" /> Add coin
        </button>
      </Method>

      <Method label="Card" on={data.card} onToggle={(v) => toggle("card", v)}>
        <input
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
          placeholder="Payment link (Stripe/checkout)"
          value={data.cardLink}
          onChange={(e) => onChange({ ...data, cardLink: e.target.value })}
        />
      </Method>

      <Method
        label="Bank transfer"
        on={data.bank}
        onToggle={(v) => toggle("bank", v)}
      >
        <input
          className="mb-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
          placeholder="Account holder"
          value={data.bankHolder}
          onChange={(e) => onChange({ ...data, bankHolder: e.target.value })}
        />
        <input
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
          placeholder="IBAN"
          value={data.bankIban}
          onChange={(e) => onChange({ ...data, bankIban: e.target.value })}
        />
      </Method>

      <Method
        label="Paysafecard"
        on={data.paysafecard}
        onToggle={(v) => toggle("paysafecard", v)}
      >
        <input
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
          placeholder='e.g. "only 10/25/50€ denominations"'
          value={data.paysafecardInstructions}
          onChange={(e) =>
            onChange({ ...data, paysafecardInstructions: e.target.value })
          }
        />
      </Method>

      <Method label="Other" on={data.other} onToggle={(v) => toggle("other", v)}>
        <input
          className="mb-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
          placeholder="Method name"
          value={data.otherName}
          onChange={(e) => onChange({ ...data, otherName: e.target.value })}
        />
        <textarea
          className="min-h-[60px] w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
          placeholder="Instructions"
          value={data.otherInstructions}
          onChange={(e) =>
            onChange({ ...data, otherInstructions: e.target.value })
          }
        />
      </Method>
    </div>
  );
}

function Method({
  label,
  on,
  onToggle,
  children,
}: {
  label: string;
  on: boolean;
  onToggle: (v: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700">
      <label className="flex cursor-pointer items-center gap-2 px-3 py-2.5 font-sans text-sm font-medium text-slate-800 dark:text-slate-100">
        <input
          type="checkbox"
          checked={on}
          onChange={(e) => onToggle(e.target.checked)}
        />
        {label}
      </label>
      {on && (
        <div className="border-t border-slate-100 px-3 py-3 dark:border-slate-800">
          {children}
        </div>
      )}
    </div>
  );
}

export function formatPaymentsForCompile(data: PaymentsData): string {
  const lines: string[] = [];
  if (data.paypal && data.paypalEmail) {
    const t =
      data.paypalType === "fnf"
        ? "Friends & Family"
        : data.paypalType === "gs"
          ? "Goods & Services"
          : "Friends & Family or Goods & Services";
    lines.push(`PayPal: ${data.paypalEmail} (${t})`);
  }
  if (data.crypto) {
    for (const r of data.cryptoRows) {
      if (r.address)
        lines.push(`Crypto ${r.coin} (${r.network}): ${r.address}`);
    }
  }
  if (data.card && data.cardLink) lines.push(`Card: ${data.cardLink}`);
  if (data.bank && data.bankIban)
    lines.push(`Bank: ${data.bankHolder} — ${data.bankIban}`);
  if (data.paysafecard && data.paysafecardInstructions)
    lines.push(`Paysafecard: ${data.paysafecardInstructions}`);
  if (data.other && data.otherName)
    lines.push(`${data.otherName}: ${data.otherInstructions}`);
  return lines.join("\n");
}

export function paymentsHasDetails(data: PaymentsData): boolean {
  if (data.paypal && data.paypalEmail.trim()) return true;
  if (data.crypto && data.cryptoRows.some((r) => r.address.trim())) return true;
  if (data.card && data.cardLink.trim()) return true;
  if (data.bank && data.bankIban.trim()) return true;
  if (data.paysafecard && data.paysafecardInstructions.trim()) return true;
  if (data.other && data.otherName.trim()) return true;
  return false;
}
