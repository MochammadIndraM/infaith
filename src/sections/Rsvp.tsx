"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { AnimatedSection } from "@/components/animation/AnimatedSection";
import { Divider } from "@/components/ui/Divider";
import { submitRsvp } from "@/lib/guestbook";
import { EASE_SOFT } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { Attendance } from "@/types";

/**
 * FASE 2 · RSVP (mock) — form konfirmasi kehadiran.
 * Micro-interaction: underline emas tumbuh saat fokus input.
 * Submit: idle → spinner → animasi checklist. Simpan via lib/guestbook.ts.
 */

type Status = "idle" | "loading" | "success" | "error";

const ATTENDANCE_OPTIONS: { value: Attendance; label: string }[] = [
  { value: "hadir", label: "Hadir" },
  { value: "ragu", label: "Masih Ragu" },
  { value: "tidak_hadir", label: "Tidak Hadir" },
];

function SuccessCheck() {
  const reduce = useReducedMotion();
  const draw = (delay: number) =>
    reduce
      ? { initial: false as const, animate: { pathLength: 1 } }
      : {
          initial: { pathLength: 0 },
          animate: { pathLength: 1 },
          transition: { duration: 0.5, ease: EASE_SOFT, delay },
        };
  return (
    <svg viewBox="0 0 52 52" className="h-16 w-16" aria-hidden="true">
      <motion.circle
        cx="26"
        cy="26"
        r="24"
        fill="none"
        stroke="var(--color-gold)"
        strokeWidth="1.5"
        {...draw(0)}
      />
      <motion.path
        d="M16 27 l7 7 l14 -16"
        fill="none"
        stroke="var(--color-gold)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...draw(0.4)}
      />
    </svg>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-left">
      <span className="font-utility text-[0.7rem] uppercase tracking-utility text-espresso-soft">
        {label}
      </span>
      <div className="relative mt-2">
        {children}
        <span className="pointer-events-none absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-gold transition-transform duration-300 ease-soft peer-focus:scale-x-100" />
      </div>
    </label>
  );
}

const inputClass =
  "peer w-full border-b border-line bg-transparent pb-2 font-body text-espresso placeholder:text-espresso-soft/50 focus:outline-none";

export function Rsvp() {
  const [name, setName] = useState("");
  const [attendance, setAttendance] = useState<Attendance | null>(null);
  const [guests, setGuests] = useState(1);
  const [status, setStatus] = useState<Status>("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !attendance) {
      setStatus("error");
      return;
    }
    setStatus("loading");
    try {
      await submitRsvp({
        name: name.trim(),
        attendance,
        guestCount: attendance === "hadir" ? guests : 0,
      });
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="rsvp" className="bg-ivory-deep px-6 py-28 sm:py-36">
      <AnimatedSection className="mx-auto max-w-lg text-center">
        <Divider className="mb-14" />

        <h2 className="font-display text-4xl font-medium text-espresso sm:text-5xl">
          Konfirmasi Kehadiran
        </h2>
        <p className="mx-auto mt-5 max-w-md font-body text-base leading-relaxed text-espresso-soft">
          Mohon konfirmasi kehadiran Anda untuk membantu kami mempersiapkan hari
          istimewa ini.
        </p>

        <AnimatePresence mode="wait">
          {status === "success" ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE_SOFT }}
              className="mt-12 flex flex-col items-center"
            >
              <SuccessCheck />
              <p className="mt-6 font-display text-2xl text-espresso">
                Terima kasih!
              </p>
              <p className="mt-2 font-body text-sm text-espresso-soft">
                Konfirmasi Anda sudah kami terima.
              </p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              initial={false}
              exit={{ opacity: 0 }}
              className="mt-12 flex flex-col gap-8"
              noValidate
            >
              <Field label="Nama">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (status === "error") setStatus("idle");
                  }}
                  placeholder="Nama Anda"
                  className={inputClass}
                  required
                />
              </Field>

              <fieldset className="text-left">
                <legend className="font-utility text-[0.7rem] uppercase tracking-utility text-espresso-soft">
                  Kehadiran
                </legend>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {ATTENDANCE_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        setAttendance(opt.value);
                        if (status === "error") setStatus("idle");
                      }}
                      aria-pressed={attendance === opt.value}
                      className={cn(
                        "rounded-full border px-3 py-2.5 font-utility text-[0.7rem] uppercase tracking-utility transition-colors duration-300 ease-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ivory-deep",
                        attendance === opt.value
                          ? "border-gold bg-gold text-ivory"
                          : "border-line text-espresso hover:border-gold",
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </fieldset>

              <AnimatePresence initial={false}>
                {attendance === "hadir" && (
                  <motion.div
                    key="guests"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.4, ease: EASE_SOFT }}
                    className="overflow-hidden"
                  >
                    <Field label="Jumlah Tamu">
                      <input
                        type="number"
                        min={1}
                        max={10}
                        value={guests}
                        onChange={(e) =>
                          setGuests(Math.max(1, Math.min(10, Number(e.target.value) || 1)))
                        }
                        className={inputClass}
                      />
                    </Field>
                  </motion.div>
                )}
              </AnimatePresence>

              {status === "error" && (
                <p className="text-left font-body text-sm text-espresso">
                  Mohon isi nama dan pilih kehadiran terlebih dahulu.
                </p>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-espresso px-8 py-3 font-utility text-xs uppercase tracking-utility text-ivory transition-colors duration-300 ease-soft hover:bg-espresso-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ivory-deep disabled:opacity-70"
              >
                {status === "loading" && (
                  <span
                    aria-hidden="true"
                    className="h-4 w-4 animate-spin rounded-full border-2 border-ivory/30 border-t-ivory"
                  />
                )}
                {status === "loading" ? "Mengirim…" : "Kirim Konfirmasi"}
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        <Divider className="mt-14" />
      </AnimatedSection>
    </section>
  );
}
