"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { AnimatedSection } from "@/components/animation/AnimatedSection";
import { Divider } from "@/components/ui/Divider";
import { addWish, getWishes } from "@/lib/guestbook";
import { EASE_SOFT } from "@/lib/motion";
import type { WishEntry } from "@/types";

/**
 * FASE 2 · Guestbook (mock) — form ucapan + daftar ucapan.
 * Ucapan awal dimuat via getWishes(); ucapan baru muncul live (prepend)
 * setelah addWish(). Semua akses lewat lib/guestbook.ts.
 */

function timeAgo(iso: string): string {
  const min = Math.floor((Date.now() - new Date(iso).getTime()) / 60_000);
  if (min < 1) return "Baru saja";
  if (min < 60) return `${min} menit lalu`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} jam lalu`;
  return `${Math.floor(hr / 24)} hari lalu`;
}

const inputClass =
  "peer w-full border-b border-line bg-transparent pb-2 font-body text-espresso placeholder:text-espresso-soft/50 focus:outline-none";

function FieldUnderline() {
  return (
    <span className="pointer-events-none absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-gold transition-transform duration-300 ease-soft peer-focus:scale-x-100" />
  );
}

export function Guestbook() {
  const [wishes, setWishes] = useState<WishEntry[]>([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    let active = true;
    getWishes().then((list) => {
      if (active) setWishes(list);
    });
    return () => {
      active = false;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim() || sending) return;
    setSending(true);
    try {
      const entry = await addWish({ name: name.trim(), message: message.trim() });
      setWishes((prev) => [entry, ...prev]);
      setName("");
      setMessage("");
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="guestbook" className="bg-ivory px-6 py-28 sm:py-36">
      <AnimatedSection className="mx-auto max-w-lg">
        <div className="text-center">
          <Divider className="mb-14" />
          <h2 className="font-display text-4xl font-medium text-espresso sm:text-5xl">
            Ucapan &amp; Doa
          </h2>
          <p className="mx-auto mt-5 max-w-md font-body text-base leading-relaxed text-espresso-soft">
            Kirimkan ucapan dan doa terbaik Anda untuk kedua mempelai.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-12 flex flex-col gap-8">
          <label className="block text-left">
            <span className="font-utility text-[0.7rem] uppercase tracking-utility text-espresso-soft">
              Nama
            </span>
            <div className="relative mt-2">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama Anda"
                className={inputClass}
                required
              />
              <FieldUnderline />
            </div>
          </label>

          <label className="block text-left">
            <span className="font-utility text-[0.7rem] uppercase tracking-utility text-espresso-soft">
              Ucapan
            </span>
            <div className="relative mt-2">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tulis ucapan &amp; doa…"
                rows={3}
                className={`${inputClass} resize-none`}
                required
              />
              <FieldUnderline />
            </div>
          </label>

          <button
            type="submit"
            disabled={sending}
            className="inline-flex items-center justify-center gap-2 self-center rounded-full bg-espresso px-8 py-3 font-utility text-xs uppercase tracking-utility text-ivory transition-colors duration-300 ease-soft hover:bg-espresso-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ivory disabled:opacity-70"
          >
            {sending && (
              <span
                aria-hidden="true"
                className="h-4 w-4 animate-spin rounded-full border-2 border-ivory/30 border-t-ivory"
              />
            )}
            {sending ? "Mengirim…" : "Kirim Ucapan"}
          </button>
        </form>

        <p className="mt-12 text-center font-utility text-[0.7rem] uppercase tracking-utility text-gold">
          {wishes.length} Ucapan
        </p>

        <ul className="mt-6 flex max-h-96 flex-col gap-4 overflow-y-auto pr-1">
          <AnimatePresence initial={false}>
            {wishes.map((w) => (
              <motion.li
                key={w.id}
                layout
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: EASE_SOFT }}
                className="border border-line bg-ivory-deep p-5 text-left"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <p className="font-display text-lg text-espresso">{w.name}</p>
                  <span className="shrink-0 font-utility text-[0.65rem] uppercase tracking-utility text-espresso-soft">
                    {timeAgo(w.createdAt)}
                  </span>
                </div>
                <p className="mt-2 font-body text-sm leading-relaxed text-espresso-soft">
                  {w.message}
                </p>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>

        <Divider className="mt-14" />
      </AnimatedSection>
    </section>
  );
}
