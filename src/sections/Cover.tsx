"use client";

import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion";
import { useEffect } from "react";
import { Monogram } from "@/components/ui/Monogram";
import { StaggerText } from "@/components/animation/StaggerText";
import { useGuestName } from "@/hooks/useGuestName";
import { useInvitationStore } from "@/store/useInvitationStore";
import { invitation } from "@/data/invitation";
import { DUR, EASE_SOFT } from "@/lib/motion";

/**
 * FASE 2 · Cover — layar pembuka (tirai).
 * Overlay penuh berisi nama pasangan, tanggal, sapaan tamu (?to=), tombol buka.
 * Klik "Buka Undangan":
 *   → store.open() men-set isOpened=true & audioPlaying=true (trigger audio;
 *     playback ditangani AudioPlayer, patuh autoplay policy = setelah interaksi),
 *   → tirai terangkat ke atas (y: -100%) meng-reveal isi undangan di bawahnya.
 * Scroll di-kunci selama tirai masih menutup (Cover = satu-satunya owner lock).
 */
export function Cover() {
  const reduce = useReducedMotion();
  const { couple, event } = invitation;
  const guestName = useGuestName();
  const isOpened = useInvitationStore((s) => s.isOpened);
  const open = useInvitationStore((s) => s.open);

  useEffect(() => {
    document.body.style.overflow = isOpened ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpened]);

  const container: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.14, delayChildren: 0.2 } },
  };
  const item: Variants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: DUR.base, ease: EASE_SOFT } },
  };

  return (
    <AnimatePresence>
      {!isOpened && (
        <motion.section
          key="cover"
          aria-label="Pembuka undangan"
          className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-ivory px-6 text-center"
          initial={false}
          exit={reduce ? { opacity: 0 } : { y: "-100%" }}
          transition={{ duration: reduce ? 0.3 : 1, ease: EASE_SOFT }}
        >
          {/* Bingkai hairline emas — motif "undangan cetak". */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-4 rounded-[2px] border border-line sm:inset-6"
          />

          <motion.div
            className="flex flex-col items-center"
            variants={container}
            initial={reduce ? false : "hidden"}
            animate="visible"
          >
            <motion.div variants={item}>
              <Monogram size={72} />
            </motion.div>

            <motion.p
              variants={item}
              className="mt-10 font-utility text-xs uppercase tracking-utility text-espresso-soft"
            >
              The Wedding Of
            </motion.p>

            <h1 className="mt-5 font-display text-6xl font-medium leading-[1.05] text-espresso sm:text-7xl">
              <StaggerText text={couple.groom.nickname} trigger="mount" delay={0.3} />
              <span className="mx-2 font-signature text-4xl text-gold sm:text-5xl">
                &amp;
              </span>
              <StaggerText text={couple.bride.nickname} trigger="mount" delay={0.6} />
            </h1>

            <motion.p
              variants={item}
              className="mt-8 font-utility text-sm uppercase tracking-utility text-gold"
            >
              {event.dateLabel}
            </motion.p>

            <motion.div variants={item} className="mt-14 border-t border-line pt-8">
              <p className="font-utility text-[0.7rem] uppercase tracking-utility text-espresso-soft">
                Kepada Yth.
              </p>
              <p className="mt-2 font-display text-2xl text-espresso">{guestName}</p>
            </motion.div>

            <motion.button
              variants={item}
              type="button"
              onClick={open}
              className="mt-8 rounded-full border border-gold px-8 py-3 font-utility text-xs uppercase tracking-utility text-espresso transition-colors duration-500 ease-soft hover:bg-gold hover:text-ivory focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
            >
              Buka Undangan
            </motion.button>
          </motion.div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}
