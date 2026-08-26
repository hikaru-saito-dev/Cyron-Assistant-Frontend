import { AnimatePresence, motion } from "framer-motion";

export const ToastAlert = ({ toast }: { toast: { type: string; message: string } | null }) => {
    return (
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            className={`fixed bottom-4 right-4 z-50 rounded-xl border px-4 py-2.5 text-xs font-medium backdrop-blur-xl shadow-[0_12px_32px_rgba(0,0,0,0.45)] ${
              toast.type === 'success'
                ? 'border-amber-400/30 bg-[#141414]/90 text-amber-100'
                : 'border-red-500/40 bg-red-950/80 text-red-100'
            }`}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    );
  }