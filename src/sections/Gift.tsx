"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { AnimatedSection } from "@/components/animation/AnimatedSection";
import { Divider } from "@/components/ui/Divider";
import { invitation } from "@/data/invitation";
import { EASE_SOFT } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * FASE 2 · Gift — amplop digital.
 * Klik "Buka Amplop" → reveal kartu rekening + QRIS + alamat kirim kado.
 * Tiap nilai bisa disalin (copy-to-clipboard) dengan feedback "Tersalin ✓".
 */

const { gift } = invitation;

function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard tak tersedia — abaikan dengan tenang.
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`Salin ${label}`}
      className={cn(
        "mt-4 w-full rounded-full px-5 py-2.5 font-utility text-xs uppercase tracking-utility transition-colors duration-300 ease-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ivory",
        copied
          ? "bg-gold text-ivory"
          : "border border-gold text-espresso hover:bg-gold hover:text-ivory",
      )}
    >
      {copied ? "Tersalin ✓" : "Salin"}
    </button>
  );
}

export function Gift() {
  const [open, setOpen] = useState(false);

  return (
    <section id="gift" className="bg-ivory px-6 py-28 sm:py-36">
      <AnimatedSection className="mx-auto max-w-3xl text-center">
        <Divider className="mb-14" />

        <h2 className="font-display text-4xl font-medium text-espresso sm:text-5xl">
          Amplop Digital
        </h2>
        <p className="mx-auto mt-5 max-w-xl font-body text-base leading-relaxed text-espresso-soft">
          {gift.note}
        </p>

        {!open && (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="mt-8 rounded-full bg-espresso px-8 py-3 font-utility text-xs uppercase tracking-utility text-ivory transition-colors duration-300 ease-soft hover:bg-espresso-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
          >
            Buka Amplop
          </button>
        )}

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              key="envelope"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.5, ease: EASE_SOFT }}
              className="mt-12"
            >
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {/* Rekening bank */}
                {gift.accounts.map((acc) => (
                  <div
                    key={acc.accountNumber}
                    className="flex flex-col border border-line bg-ivory-deep p-6 text-left"
                  >
                    <p className="font-utility text-xs uppercase tracking-utility text-gold">
                      {acc.bank}
                    </p>
                    <p className="mt-3 font-display text-2xl tabular-nums tracking-wide text-espresso">
                      {acc.accountNumber}
                    </p>
                    <p className="mt-1 font-body text-sm text-espresso-soft">
                      a.n. {acc.accountHolder}
                    </p>
                    <CopyButton value={acc.accountNumber} label={`nomor rekening ${acc.bank}`} />
                  </div>
                ))}

                {/* QRIS */}
                <div className="flex flex-col items-center border border-line bg-ivory-deep p-6 text-center sm:col-span-2">
                  <p className="font-utility text-xs uppercase tracking-utility text-gold">
                    QRIS
                  </p>
                  {/* Placeholder — tukar dengan next/image saat gambar QRIS asli masuk. */}
                  <div className="mt-4 flex aspect-square w-40 items-center justify-center border border-gold/40 bg-ivory">
                    <span className="font-utility text-[0.7rem] uppercase tracking-utility text-espresso-soft">
                      Kode QR
                    </span>
                  </div>
                  <p className="mt-4 font-body text-sm text-espresso-soft">
                    {gift.qris.merchantName}
                  </p>
                </div>
              </div>

              {/* Alamat kirim kado */}
              {gift.shippingAddress && (
                <div className="mt-6 border border-line bg-ivory-deep p-6 text-left">
                  <p className="font-utility text-xs uppercase tracking-utility text-gold">
                    Kirim Kado
                  </p>
                  <p className="mt-3 font-body text-sm leading-relaxed text-espresso">
                    {gift.shippingAddress}
                  </p>
                  <CopyButton value={gift.shippingAddress} label="alamat kirim kado" />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <Divider className="mt-14" />
      </AnimatedSection>
    </section>
  );
}
