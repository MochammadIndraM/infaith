"use client";

import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import Image from "next/image";
import { useCallback, useEffect, useRef } from "react";
import { Divider } from "@/components/ui/Divider";
import { invitation } from "@/data/invitation";
import { useInvitationStore } from "@/store/useInvitationStore";
import { EASE_SOFT } from "@/lib/motion";

/**
 * FASE 2/3 · Gallery — masonry (CSS columns) + morph shared-layout ke fullscreen.
 * Klik tile → layoutId morph membesar tanpa reload; modal terhubung activeGalleryId.
 * Navigasi: klik panah, keyboard (Esc/←/→), atau swipe-x. Hanya transform/opacity → 60fps.
 * next/image: dimensi eksplisit + blur → CLS ~0.
 */

const images = invitation.gallery;

export function Gallery() {
  const activeId = useInvitationStore((s) => s.activeGalleryId);
  const openGallery = useInvitationStore((s) => s.openGallery);
  const closeGallery = useInvitationStore((s) => s.closeGallery);

  const activeIndex = activeId === null ? -1 : Number(activeId);
  const active = activeIndex >= 0 ? images[activeIndex] : null;
  const isOpen = active !== null;
  const closeRef = useRef<HTMLButtonElement>(null);

  const goTo = useCallback(
    (i: number) => openGallery(String((i + images.length) % images.length)),
    [openGallery],
  );

  // Keyboard nav saat modal terbuka.
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeGallery();
      else if (e.key === "ArrowRight") goTo(activeIndex + 1);
      else if (e.key === "ArrowLeft") goTo(activeIndex - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, activeIndex, closeGallery, goTo]);

  // Kunci scroll saat modal terbuka.
  useEffect(() => {
    document.body.style.overflow = active ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [active]);

  // Pindahkan fokus ke tombol tutup saat modal dibuka (a11y keyboard).
  useEffect(() => {
    if (isOpen) closeRef.current?.focus();
  }, [isOpen]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -80) goTo(activeIndex + 1);
    else if (info.offset.x > 80) goTo(activeIndex - 1);
  };

  return (
    <section id="gallery" className="bg-ivory px-6 py-28 sm:py-36">
      <div className="mx-auto max-w-4xl">
        <Divider className="mb-16" />

        {/* Masonry via CSS columns */}
        <div className="columns-2 gap-4 sm:columns-3">
          {images.map((img, i) => (
            <button
              key={img.src}
              type="button"
              onClick={() => openGallery(String(i))}
              aria-label={`Perbesar foto: ${img.alt}`}
              className="mb-4 block w-full break-inside-avoid overflow-hidden rounded-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
            >
              <motion.div
                layoutId={`photo-${i}`}
                className="relative w-full"
                style={{ aspectRatio: `${img.width} / ${img.height}` }}
                transition={{ duration: 0.5, ease: EASE_SOFT }}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(min-width: 640px) 33vw, 50vw"
                  placeholder="blur"
                  blurDataURL={img.blurDataURL}
                  className="object-cover"
                />
              </motion.div>
            </button>
          ))}
        </div>

        <Divider className="mt-16" />
      </div>

      {/* Modal fullscreen — morph dari tile via layoutId yang sama */}
      <AnimatePresence>
        {active && (
          <motion.div
            className="fixed inset-0 z-60 flex flex-col items-center justify-center bg-espresso/90 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE_SOFT }}
            onClick={closeGallery}
            role="dialog"
            aria-modal="true"
            aria-label={`Foto ${activeIndex + 1} dari ${images.length}: ${active.alt}`}
          >
            {/* Tutup */}
            <button
              ref={closeRef}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                closeGallery();
              }}
              aria-label="Tutup galeri"
              className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border border-ivory/40 text-2xl text-ivory transition-colors duration-300 ease-soft hover:bg-ivory/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ivory"
            >
              &times;
            </button>

            {/* Panah */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goTo(activeIndex - 1);
              }}
              aria-label="Foto sebelumnya"
              className="absolute left-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-3xl text-ivory/80 transition-colors duration-300 ease-soft hover:text-ivory focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ivory sm:left-6"
            >
              &lsaquo;
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goTo(activeIndex + 1);
              }}
              aria-label="Foto berikutnya"
              className="absolute right-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-3xl text-ivory/80 transition-colors duration-300 ease-soft hover:text-ivory focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ivory sm:right-6"
            >
              &rsaquo;
            </button>

            <motion.figure
              layoutId={`photo-${activeIndex}`}
              className="relative w-full max-w-2xl cursor-grab overflow-hidden active:cursor-grabbing"
              style={{ aspectRatio: `${active.width} / ${active.height}`, maxHeight: "78vh" }}
              transition={{ duration: 0.5, ease: EASE_SOFT }}
              onClick={(e) => e.stopPropagation()}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={onDragEnd}
            >
              <Image
                src={active.src}
                alt={active.alt}
                fill
                sizes="(min-width: 768px) 42rem, 100vw"
                placeholder="blur"
                blurDataURL={active.blurDataURL}
                className="object-contain"
                draggable={false}
              />
            </motion.figure>

            <figcaption
              onClick={(e) => e.stopPropagation()}
              className="mt-5 max-w-md text-center font-body text-sm text-ivory/70"
            >
              {active.alt}
              <span className="mt-1 block font-utility text-[0.7rem] uppercase tracking-utility text-ivory/40">
                {activeIndex + 1} / {images.length}
              </span>
            </figcaption>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
