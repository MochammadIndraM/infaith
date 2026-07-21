"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";
import { AnimatedSection } from "@/components/animation/AnimatedSection";
import { Divider } from "@/components/ui/Divider";
import { invitation } from "@/data/invitation";
import { downloadICS } from "@/lib/ics";
import { cn } from "@/lib/utils";
import type { WeddingEventItem } from "@/types";

const { event, couple } = invitation;
const coupleTitle = `${couple.groom.nickname} & ${couple.bride.nickname}`;

/* ── Countdown real-time ──────────────────────────────────────────── */

function useCountdown(targetISO: string) {
  const [remaining, setRemaining] = useState<number | null>(null);
  useEffect(() => {
    const target = new Date(targetISO).getTime();
    const tick = () => setRemaining(Math.max(0, target - Date.now()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [targetISO]);
  return remaining;
}

function Countdown({ targetISO }: { targetISO: string }) {
  const ms = useCountdown(targetISO) ?? 0;
  const units = [
    { label: "Hari", value: Math.floor(ms / 86_400_000) },
    { label: "Jam", value: Math.floor((ms / 3_600_000) % 24) },
    { label: "Menit", value: Math.floor((ms / 60_000) % 60) },
    { label: "Detik", value: Math.floor((ms / 1000) % 60) },
  ];

  return (
    <ul className="flex items-start justify-center gap-4 sm:gap-8" aria-label="Hitung mundur menuju hari bahagia">
      {units.map((u) => (
        <li key={u.label} className="flex flex-col items-center">
          <span className="font-display text-4xl font-medium tabular-nums text-espresso sm:text-5xl">
            {String(u.value).padStart(2, "0")}
          </span>
          <span className="mt-1 font-utility text-[0.65rem] uppercase tracking-utility text-espresso-soft">
            {u.label}
          </span>
        </li>
      ))}
    </ul>
  );
}

/* ── Tilt halus (degrade mulus tanpa cursor) ──────────────────────── */

function TiltCard({ children, className }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  const rx = useSpring(useMotionValue(0), { stiffness: 150, damping: 15 });
  const ry = useSpring(useMotionValue(0), { stiffness: 150, damping: 15 });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    ry.set(px * 6);
    rx.set(-py * 6);
  };
  const reset = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ── Kartu acara ──────────────────────────────────────────────────── */

function EventCard({ item }: { item: WeddingEventItem }) {
  const [saved, setSaved] = useState(false);
  const mapSrc = `https://maps.google.com/maps?q=${item.coordinates.lat},${item.coordinates.lng}&z=16&hl=id&output=embed`;

  const handleSave = () => {
    downloadICS(item, coupleTitle);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  };

  return (
    <TiltCard className="h-full">
      <article className="flex h-full flex-col items-center border border-line bg-ivory p-8 text-center shadow-sm">
        <h3 className="font-display text-3xl font-medium text-espresso">{item.name}</h3>
        <span className="mt-4 block h-px w-10 bg-gold" aria-hidden="true" />

        <p className="mt-4 font-utility text-xs uppercase tracking-utility text-gold">
          {item.dateLabel}
        </p>
        <p className="mt-2 font-body text-base text-espresso">{item.timeLabel}</p>

        <p className="mt-5 font-display text-xl text-espresso">{item.venueName}</p>
        <p className="mt-2 max-w-xs font-body text-sm leading-relaxed text-espresso-soft">
          {item.venueAddress}
        </p>

        <div className="mt-6 aspect-video w-full overflow-hidden border border-line">
          <iframe
            src={mapSrc}
            title={`Peta ${item.venueName}`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-full w-full"
          />
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <a
            href={item.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="whitespace-nowrap rounded-full border border-gold px-6 py-2.5 font-utility text-xs uppercase tracking-utility text-espresso transition-colors duration-300 ease-soft hover:bg-gold hover:text-ivory focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
          >
            Lihat Peta
          </a>
          <button
            type="button"
            onClick={handleSave}
            className={cn(
              "whitespace-nowrap rounded-full px-6 py-2.5 font-utility text-xs uppercase tracking-utility transition-colors duration-300 ease-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ivory",
              saved
                ? "bg-gold text-ivory"
                : "bg-espresso text-ivory hover:bg-espresso-soft",
            )}
          >
            {saved ? "Tersimpan ✓" : "Simpan ke Kalender"}
          </button>
        </div>
      </article>
    </TiltCard>
  );
}

/* ── Section ──────────────────────────────────────────────────────── */

export function EventDetails() {
  return (
    <section id="event" className="bg-ivory-deep px-6 py-28 sm:py-36">
      <div className="mx-auto max-w-4xl">
        <AnimatedSection className="flex flex-col items-center">
          <Divider className="mb-14" />
          <Countdown targetISO={event.akad.startISO} />
          <p className="mt-6 font-utility text-xs uppercase tracking-utility text-espresso-soft">
            Menuju {event.dateLabel}
          </p>
        </AnimatedSection>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2">
          <AnimatedSection className="h-full">
            <EventCard item={event.akad} />
          </AnimatedSection>
          <AnimatedSection delay={0.1} className="h-full">
            <EventCard item={event.resepsi} />
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
