// Motion personality terpusat (spec §1). SATU easing kustom, dipakai di mana-mana.
// Jangan pakai spring default framer-motion sembarangan.

/** Ease-out ekspresif — cubic-bezier(0.22, 1, 0.36, 1). */
export const EASE_SOFT: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** Durasi transisi (detik). Pelan & tenang. */
export const DUR = {
  fast: 0.4,
  base: 0.7,
  slow: 0.9,
} as const;

/** Jarak translate-y untuk reveal on-scroll (px). Kecil, tak patah. */
export const REVEAL_Y = 20;
