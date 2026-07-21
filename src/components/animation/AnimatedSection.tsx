"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import { DUR, EASE_SOFT, REVEAL_Y } from "@/lib/motion";

interface AnimatedSectionProps extends HTMLMotionProps<"div"> {
  /** Tunda mulai animasi (detik). */
  delay?: number;
  /** Jarak translate-y awal (px). */
  y?: number;
}

/**
 * Wrapper reveal on-scroll: fade + translate-y kecil saat masuk viewport.
 * `once: true` → animasi sekali. Easing kustom terpusat.
 * Reduced-motion: hanya fade halus, tanpa gerak spasial.
 */
export function AnimatedSection({
  children,
  delay = 0,
  y = REVEAL_Y,
  ...rest
}: AnimatedSectionProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={reduce ? { opacity: 0 } : { opacity: 0, y }}
      whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: reduce ? 0.2 : DUR.base, ease: EASE_SOFT, delay }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
