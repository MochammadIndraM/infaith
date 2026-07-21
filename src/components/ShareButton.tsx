"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useInvitationStore } from "@/store/useInvitationStore";
import { invitation } from "@/data/invitation";
import { EASE_SOFT } from "@/lib/motion";

/**
 * FASE 2 · ShareButton — bagikan tautan undangan ke WhatsApp.
 * Floating (kiri-bawah), muncul setelah undangan dibuka.
 * Membagikan URL dasar (tanpa ?to= tamu saat ini) + nama & tanggal.
 */
export function ShareButton() {
  const isOpened = useInvitationStore((s) => s.isOpened);
  const { couple, event } = invitation;

  const share = () => {
    const url = `${window.location.origin}${window.location.pathname}`;
    const text = `Undangan Pernikahan ${couple.groom.nickname} & ${couple.bride.nickname}\n${event.dateLabel}\n${url}`;
    window.open(
      `https://wa.me/?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  return (
    <AnimatePresence>
      {isOpened && (
        <motion.button
          key="share"
          type="button"
          onClick={share}
          aria-label="Bagikan undangan ke WhatsApp"
          className="fixed bottom-6 left-6 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-gold bg-ivory/80 shadow-sm backdrop-blur-sm transition-colors duration-300 ease-soft hover:bg-ivory-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.5, ease: EASE_SOFT }}
        >
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="var(--color-gold)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7" />
            <path d="M16 6l-4-4-4 4" />
            <path d="M12 2v14" />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
