"use client";

import { Preloader } from "@/components/Preloader";
import { AudioPlayer } from "@/components/AudioPlayer";
import { Cover } from "@/sections/Cover";
import { Opening } from "@/sections/Opening";
import { Couple } from "@/sections/Couple";
import { LoveStory } from "@/sections/LoveStory";
import { Gallery } from "@/sections/Gallery";
import { AnimatedSection } from "@/components/animation/AnimatedSection";
import { Monogram } from "@/components/ui/Monogram";
import { invitation } from "@/data/invitation";

/**
 * Rakit undangan.
 * Preloader → Cover (tirai overlay) → isi undangan di bawahnya.
 * Section asli dibangun satu per satu (Fase 2); yang belum jadi = placeholder.
 */

// Urutan section sesuai spec §2 / Fase 2.
const PLACEHOLDER_SECTIONS = [
  { id: "event", label: "Event Details", note: "Akad, resepsi, countdown, maps" },
  { id: "gift", label: "Gift", note: "Amplop digital & rekening" },
  { id: "rsvp", label: "RSVP", note: "Konfirmasi kehadiran" },
  { id: "guestbook", label: "Guestbook", note: "Ucapan & doa" },
] as const;

export default function Home() {
  const { couple, meta } = invitation;

  return (
    <>
      <Preloader />
      <Cover />
      <AudioPlayer />

      <main>
        <Opening />
        <Couple />
        <LoveStory />
        <Gallery />

        {/* ── SECTION PLACEHOLDERS ──────────────────────────────────── */}
        {PLACEHOLDER_SECTIONS.map((section, i) => (
          <AnimatedSection
            key={section.id}
            id={section.id}
            className={`flex min-h-[70vh] flex-col items-center justify-center px-6 py-24 text-center ${
              i % 2 === 1 ? "bg-ivory-deep" : "bg-ivory"
            }`}
          >
            <span className="font-utility text-[0.7rem] uppercase tracking-utility text-gold">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h2 className="mt-4 font-display text-4xl font-medium text-espresso sm:text-5xl">
              {section.label}
            </h2>
            <p className="mt-3 font-body text-base text-espresso-soft">
              {section.note}
            </p>
            <span className="mt-8 block h-px w-12 bg-line" aria-hidden="true" />
          </AnimatedSection>
        ))}

        {/* ── CLOSING (placeholder) ─────────────────────────────────── */}
        <AnimatedSection className="flex min-h-[80vh] flex-col items-center justify-center px-6 py-28 text-center">
          <p className="max-w-md font-body text-lg leading-relaxed text-espresso-soft">
            {invitation.closing}
          </p>
          <div className="mt-12">
            <Monogram size={80} />
          </div>
          <p className="mt-6 font-signature text-3xl text-gold">
            {couple.groom.nickname} &amp; {couple.bride.nickname}
          </p>
          {meta.hashtag && (
            <p className="mt-6 font-utility text-xs uppercase tracking-utility text-espresso-soft">
              {meta.hashtag}
            </p>
          )}
        </AnimatedSection>
      </main>
    </>
  );
}
