"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";
import { useInvitationStore } from "@/store/useInvitationStore";
import { invitation } from "@/data/invitation";
import { EASE_SOFT } from "@/lib/motion";

/** Equalizer 3 batang emas — bergerak saat main, rata saat jeda. */
function Equalizer({ playing }: { playing: boolean }) {
  const reduce = useReducedMotion();
  const animate = playing && !reduce;

  return (
    <span aria-hidden="true" className="flex h-4 items-end gap-[3px]">
      {[0, 1, 2].map((bar) => (
        <motion.span
          key={bar}
          className="h-full w-[3px] origin-bottom rounded-full bg-gold"
          style={{ scaleY: 0.4 }}
          animate={animate ? { scaleY: [0.3, 1, 0.3] } : { scaleY: 0.4 }}
          transition={
            animate
              ? { duration: 0.9, ease: "easeInOut", repeat: Infinity, delay: bar * 0.15 }
              : { duration: 0.3, ease: EASE_SOFT }
          }
        />
      ))}
    </span>
  );
}

/**
 * FASE 2 · AudioPlayer — tombol mengambang pemutar lagu latar.
 * Sinkron dengan store.audioPlaying (di-trigger Cover saat "Buka Undangan").
 * play() hanya dipanggil setelah interaksi user → aman autoplay policy;
 * jika di-blok browser, status dikembalikan ke jeda tanpa error.
 * Muncul hanya setelah undangan dibuka.
 */
export function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const isOpened = useInvitationStore((s) => s.isOpened);
  const audioPlaying = useInvitationStore((s) => s.audioPlaying);
  const setAudioPlaying = useInvitationStore((s) => s.setAudioPlaying);
  const toggleAudio = useInvitationStore((s) => s.toggleAudio);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audioPlaying) {
      audio.play().catch(() => setAudioPlaying(false));
    } else {
      audio.pause();
    }
  }, [audioPlaying, setAudioPlaying]);

  return (
    <>
      <audio ref={audioRef} src={invitation.meta.audioSrc} loop preload="none" />

      <AnimatePresence>
        {isOpened && (
          <motion.button
            key="audio-toggle"
            type="button"
            onClick={toggleAudio}
            aria-label={audioPlaying ? "Jeda musik latar" : "Putar musik latar"}
            aria-pressed={audioPlaying}
            className="fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-gold bg-ivory/80 shadow-sm backdrop-blur-sm transition-colors duration-300 ease-soft hover:bg-ivory-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5, ease: EASE_SOFT }}
          >
            <Equalizer playing={audioPlaying} />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
