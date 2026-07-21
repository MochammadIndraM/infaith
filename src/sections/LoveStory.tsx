"use client";

import { motion, useScroll, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { AnimatedSection } from "@/components/animation/AnimatedSection";
import { Divider } from "@/components/ui/Divider";
import { invitation } from "@/data/invitation";

/**
 * FASE 2 · LoveStory — timeline vertikal (left-rail).
 * Garis emas mengisi lewat scaleY yang di-drive useScroll progress section.
 * Tiap item fade-up saat masuk viewport → terasa berurutan mengikuti scroll.
 * Reduced-motion: garis tampil penuh statis, item fade tanpa geser.
 */
export function LoveStory() {
  const reduce = useReducedMotion();
  const railRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: railRef,
    offset: ["start center", "end center"],
  });

  const { loveStory } = invitation;

  return (
    <section id="love-story" className="bg-ivory-deep px-6 py-28 sm:py-36">
      <div className="mx-auto max-w-xl">
        <Divider className="mb-16" />

        <div ref={railRef} className="relative">
          {/* Rel latar (hairline) */}
          <span
            aria-hidden="true"
            className="absolute bottom-2 left-1.5 top-2 w-px bg-line"
          />
          {/* Rel progress emas — scaleY ikut scroll */}
          <motion.span
            aria-hidden="true"
            className="absolute bottom-2 left-1.5 top-2 w-px origin-top bg-gold"
            style={{ scaleY: reduce ? 1 : scrollYProgress }}
          />

          <ol className="space-y-14">
            {loveStory.map((item) => (
              <li key={`${item.date}-${item.title}`} className="relative pl-10">
                {/* Node */}
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-1.5 block h-[13px] w-[13px] rounded-full border border-gold bg-ivory-deep"
                />

                <AnimatedSection>
                  <p className="font-utility text-[0.7rem] uppercase tracking-utility text-gold">
                    {item.date}
                  </p>
                  <h3 className="mt-2 font-display text-2xl font-medium text-espresso sm:text-3xl">
                    {item.title}
                  </h3>
                  <p className="mt-3 font-body text-base leading-relaxed text-espresso-soft">
                    {item.description}
                  </p>
                </AnimatedSection>
              </li>
            ))}
          </ol>
        </div>

        <Divider className="mt-16" />
      </div>
    </section>
  );
}
