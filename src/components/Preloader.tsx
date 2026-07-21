"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { Monogram } from "@/components/ui/Monogram";
import { DUR, EASE_SOFT } from "@/lib/motion";

/**
 * Layar pembuka: monogram emas + label, fade-out saat aset siap.
 * Selesai = window sudah `load` DAN durasi minimum terlewati (biar tak berkedip).
 * Kunci scroll selama tampil. Reduced-motion: durasi minimum dipangkas.
 */
export function Preloader() {
  const reduce = useReducedMotion();
  const [done, setDone] = useState(false);

  useEffect(() => {
    const minWait = new Promise<void>((resolve) =>
      setTimeout(resolve, reduce ? 300 : 1400),
    );
    const loaded =
      document.readyState === "complete"
        ? Promise.resolve()
        : new Promise<void>((resolve) =>
            window.addEventListener("load", () => resolve(), { once: true }),
          );

    let active = true;
    Promise.all([minWait, loaded]).then(() => {
      if (active) setDone(true);
    });
    return () => {
      active = false;
    };
  }, [reduce]);

  // Scroll di-kunci oleh Cover (owner tunggal) sampai undangan dibuka —
  // Preloader tak perlu ikut mengunci agar tak bentrok.

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-ivory"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: DUR.slow, ease: EASE_SOFT }}
        >
          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.92 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1 }}
            transition={{ duration: DUR.slow, ease: EASE_SOFT }}
          >
            <Monogram size={96} />
          </motion.div>
          <span className="mt-6 font-utility text-[0.7rem] uppercase tracking-utility text-espresso-soft">
            Memuat undangan…
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
