"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Divider } from "@/components/ui/Divider";
import { AnimatedSection } from "@/components/animation/AnimatedSection";
import { invitation } from "@/data/invitation";
import { DUR, EASE_SOFT } from "@/lib/motion";
import type { Person } from "@/types";

/**
 * FASE 2 · Couple — kartu mempelai pria & wanita + nama orang tua.
 * Masuk viewport: slide-in dari sisi berlawanan (pria dari kiri, wanita dari kanan)
 * dengan opacity rendah → 1. Reduced-motion: fade saja, tanpa geser.
 */

function CoupleCard({ person, from }: { person: Person; from: "left" | "right" }) {
  const reduce = useReducedMotion();

  return (
    <motion.article
      className="flex flex-col items-center text-center"
      initial={reduce ? { opacity: 0 } : { opacity: 0, x: from === "left" ? -48 : 48 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: reduce ? 0.3 : DUR.slow, ease: EASE_SOFT }}
    >
      {/* Frame potret — placeholder inisial emas sampai foto asli masuk. */}
      <div className="relative aspect-3/4 w-full max-w-68 overflow-hidden bg-ivory-deep">
        <span aria-hidden="true" className="absolute inset-3 border border-gold/40" />
        <span
          aria-hidden="true"
          className="flex h-full w-full items-center justify-center font-display text-8xl font-medium text-gold/70"
        >
          {person.nickname.charAt(0)}
        </span>
      </div>

      <h3 className="mt-8 font-display text-3xl font-medium text-espresso sm:text-4xl">
        {person.fullName}
      </h3>

      <p className="mt-4 font-body text-sm leading-relaxed text-espresso-soft">
        {person.childOrder} dari
        <br />
        {person.father}
        <br />&amp; {person.mother}
      </p>

      {person.instagram && (
        <a
          href={`https://instagram.com/${person.instagram}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-block whitespace-nowrap font-utility text-xs uppercase tracking-utility text-gold transition-colors duration-300 ease-soft hover:text-gold-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
        >
          @{person.instagram}
        </a>
      )}
    </motion.article>
  );
}

export function Couple() {
  const { groom, bride } = invitation.couple;

  return (
    <section id="couple" className="bg-ivory px-6 py-28 sm:py-36">
      <AnimatedSection className="mx-auto flex max-w-4xl flex-col items-center">
        <Divider />

        <div className="mt-16 grid w-full grid-cols-1 items-center gap-14 md:grid-cols-[1fr_auto_1fr] md:gap-8">
          <CoupleCard person={groom} from="left" />

          <span
            aria-hidden="true"
            className="font-signature text-6xl text-gold sm:text-7xl"
          >
            &amp;
          </span>

          <CoupleCard person={bride} from="right" />
        </div>

        <Divider className="mt-16" />
      </AnimatedSection>
    </section>
  );
}
