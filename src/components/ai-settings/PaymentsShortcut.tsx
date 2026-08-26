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
    <section className="cyron-glass p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="flex items-center gap-2 font-display text-base font-bold text-white">
            <FaCreditCard className="text-emerald-400" />
            Payments
          </h3>
          <p className="mt-1 font-sans text-xs text-zinc-400">
            Fast edit for emails, crypto addresses and networks — changes go live
            on save.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="cyron-btn-ghost !px-3 !py-1.5 !text-xs"
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
              className="cyron-btn-primary !px-4 !py-2 !text-sm"
            >
              {saveMut.isPending ? "Saving…" : "Save payments"}
            </button>
            {saved && (
              <span className="font-sans text-xs font-medium text-emerald-400">
                Saved — live now
              </span>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
