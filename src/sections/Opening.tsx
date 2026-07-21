"use client";

import { AnimatedSection } from "@/components/animation/AnimatedSection";
import { Divider } from "@/components/ui/Divider";
import { invitation } from "@/data/invitation";

/**
 * FASE 2 · Opening — ayat / kutipan pembuka.
 * Tenang, banyak ruang kosong, dibingkai hairline emas.
 * Konten dari data/invitation.ts (opening.text + opening.source).
 */
export function Opening() {
  const { opening } = invitation;

  return (
    <section id="opening" className="bg-ivory px-6 py-32 sm:py-44">
      <AnimatedSection className="mx-auto flex max-w-2xl flex-col items-center text-center">
        <Divider />

        {opening.prefix && (
          <p className="mt-14 font-utility text-xs uppercase tracking-utility text-gold">
            {opening.prefix}
          </p>
        )}

        <blockquote className="mt-10 font-display text-2xl font-normal leading-relaxed text-espresso sm:text-[2rem] sm:leading-normal">
          &ldquo;{opening.text}&rdquo;
        </blockquote>

        <cite className="mt-8 block font-utility text-xs uppercase not-italic tracking-utility text-espresso-soft">
          {opening.source}
        </cite>

        <Divider className="mt-14" />
      </AnimatedSection>
    </section>
  );
}
