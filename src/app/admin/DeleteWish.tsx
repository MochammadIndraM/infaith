"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState, useTransition } from "react";
import { deleteWish } from "./actions";
import { EASE_SOFT } from "@/lib/motion";

/**
 * Tombol Hapus + modal konfirmasi bertema (ganti window.confirm).
 * Konfirmasi → panggil server action deleteWish (service role, revalidate).
 */
export function DeleteWish({ id, name }: { id: string; name: string }) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  // Esc untuk menutup + kunci scroll saat modal terbuka.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && !pending && setOpen(false);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, pending]);

  const confirm = () =>
    startTransition(async () => {
      await deleteWish(id);
      setOpen(false);
    });

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-full border border-espresso/30 px-4 py-2 font-utility text-[0.6rem] uppercase tracking-utility text-espresso transition-colors duration-300 ease-soft hover:border-transparent hover:bg-espresso hover:text-ivory focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
      >
        Hapus
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-60 flex items-center justify-center bg-espresso/60 p-6 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: EASE_SOFT }}
            onClick={() => !pending && setOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-label="Konfirmasi hapus ucapan"
          >
            <motion.div
              className="w-full max-w-sm border border-line bg-ivory p-7 text-center shadow-xl"
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.3, ease: EASE_SOFT }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="font-display text-2xl font-medium text-espresso">Hapus Ucapan?</h3>
              <p className="mt-3 font-body text-sm leading-relaxed text-espresso-soft">
                Ucapan dari <span className="text-espresso">{name}</span> akan dihapus permanen
                dan hilang dari undangan.
              </p>

              <div className="mt-7 flex justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  disabled={pending}
                  className="rounded-full border border-line px-6 py-2.5 font-utility text-xs uppercase tracking-utility text-espresso transition-colors duration-300 ease-soft hover:border-gold disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={confirm}
                  disabled={pending}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-espresso px-6 py-2.5 font-utility text-xs uppercase tracking-utility text-ivory transition-colors duration-300 ease-soft hover:bg-espresso-soft disabled:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
                >
                  {pending && (
                    <span
                      aria-hidden="true"
                      className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-ivory/30 border-t-ivory"
                    />
                  )}
                  {pending ? "Menghapus…" : "Hapus"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
