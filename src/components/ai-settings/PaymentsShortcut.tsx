import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FaCreditCard } from "react-icons/fa";
import { guildService } from "../../services/guildService";
import {
  emptyPayments,
  type PaymentsData,
} from "./wizard/categoryTypes";
import { PaymentsBlock } from "./wizard/shared/PaymentsBlock";

type Props = {
  guildId: string;
  settings: AiGeneralSettings | null | undefined;
  enabled: boolean;
};

export function PaymentsShortcut({ guildId, settings, enabled }: Props) {
  const qc = useQueryClient();
  const [open, setOpen] = useState(true);
  const [payments, setPayments] = useState<PaymentsData>(emptyPayments());
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (settings?.payments) {
      setPayments({ ...emptyPayments(), ...settings.payments } as PaymentsData);
    }
  }, [settings]);

  const saveMut = useMutation({
    mutationFn: () =>
      guildService.updateGeneralRules(guildId, {
        settings: { ...(settings || {}), payments } as AiGeneralSettings,
      }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["general-rules", guildId] });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    },
  });

  if (!enabled) return null;

  return (
    <section className="rounded-2xl bg-black p-4 sm:p-5 dark:bg-black">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="flex items-center gap-2 font-display text-base font-bold text-slate-900 dark:text-white">
            <FaCreditCard className="text-emerald-600" />
            Payments
          </h3>
          <p className="mt-1 font-sans text-xs text-slate-500 dark:text-slate-400">
            Fast edit for emails, crypto addresses and networks — changes go live
            on save.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 font-sans text-xs font-semibold dark:border-slate-600 dark:bg-slate-900"
        >
          {open ? "Collapse" : "Expand"}
        </button>
      </div>

      {open && (
        <div className="mt-4 space-y-3">
          <PaymentsBlock data={payments} onChange={setPayments} />
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              disabled={saveMut.isPending}
              onClick={() => saveMut.mutate()}
              className="rounded-xl bg-[#0433FF] hover:bg-[#0433FF]/90 transition-colors px-4 py-2 font-sans text-sm font-semibold text-white disabled:opacity-50"
            >
              {saveMut.isPending ? "Saving…" : "Save payments"}
            </button>
            {saved && (
              <span className="font-sans text-xs font-medium text-emerald-700">
                Saved — live now
              </span>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
