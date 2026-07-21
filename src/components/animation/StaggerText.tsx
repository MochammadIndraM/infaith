"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { DUR, EASE_SOFT } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface StaggerTextProps {
  text: string;
  className?: string;
  /** Reveal per kata (default) atau per huruf. */
  per?: "word" | "char";
  /** Tunda sebelum stagger mulai (detik). */
  delay?: number;
  /** Mulai saat masuk viewport (default) atau langsung saat mount. */
  trigger?: "inView" | "mount";
}

/**
 * Teks muncul berurutan (staggerChildren) — fade + naik sedikit.
 * A11y: teks utuh diumumkan lewat aria-label, potongan di-aria-hidden.
 * Reduced-motion: render teks statis tanpa animasi.
 */
export function StaggerText({
  text,
  className,
  per = "word",
  delay = 0,
  trigger = "inView",
}: StaggerTextProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <span className={className}>{text}</span>;
  }

  const units = per === "char" ? Array.from(text) : text.split(" ");

  const container: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: per === "char" ? 0.03 : 0.08, delayChildren: delay },
    },
  };

  const child: Variants = {
    hidden: { opacity: 0, y: "0.5em" },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: DUR.base, ease: EASE_SOFT },
    },
  };

  const animateProps =
    trigger === "mount"
      ? { animate: "visible" as const }
      : { whileInView: "visible" as const, viewport: { once: true } };

  return (
    <motion.span
      className={cn("inline-block", className)}
      variants={container}
      initial="hidden"
      aria-label={text}
      {...animateProps}
    >
      {units.map((unit, i) => (
        <motion.span
          key={`${unit}-${i}`}
          variants={child}
          aria-hidden="true"
          className="inline-block whitespace-pre"
        >
          {per === "word" ? unit + (i < units.length - 1 ? " " : "") : unit}
        </motion.span>
      ))}
    </motion.span>
  );
}
