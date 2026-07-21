"use client";

import { AnimatedSection } from "@/components/animation/AnimatedSection";
import { Divider } from "@/components/ui/Divider";
import { Monogram } from "@/components/ui/Monogram";
import { invitation } from "@/data/invitation";

/**
 * FASE 2 · Closing — penutup + monogram.
 * Teks penutup dari data; monogram emas sebagai "segel" penutup.
 */
export function Closing() {
  const { closing, couple, meta } = invitation;

  return (
    <section id="closing" className="bg-ivory px-6 py-32 sm:py-40">
      <AnimatedSection className="mx-auto flex max-w-xl flex-col items-center text-center">
        <Divider className="mb-14" />

        <p className="max-w-md font-body text-lg leading-relaxed text-espresso-soft">
          {closing}
        </p>

        <p className="mt-10 font-utility text-xs uppercase tracking-utility text-espresso-soft">
          Kami yang berbahagia
        </p>
        <p className="mt-4 font-display text-4xl font-medium text-espresso sm:text-5xl">
          {couple.groom.nickname}
          <span className="mx-2 font-signature text-gold">&amp;</span>
          {couple.bride.nickname}
        </p>

        <div className="mt-12">
          <Monogram size={84} />
        </div>

        {meta.hashtag && (
          <p className="mt-8 font-utility text-xs uppercase tracking-utility text-gold">
            {meta.hashtag}
          </p>
        )}
      </AnimatedSection>
    </section>
  );
}
