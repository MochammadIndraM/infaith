"use client";

import { useEffect, useState } from "react";
import { invitation } from "@/data/invitation";

/**
 * Baca nama tamu dari query `?to=` di URL.
 * Fallback ke sapaan default ("Bapak/Ibu/Saudara/i") bila kosong.
 * `URLSearchParams` sudah mendecode `%20`; `+` di-handle eksplisit untuk aman.
 *
 * Nilai awal = default (sama di server & client) → tak ada hydration mismatch;
 * nama asli di-isi setelah mount lewat effect (query hanya ada di client).
 */
export function useGuestName(): string {
  const [guest, setGuest] = useState(invitation.meta.defaultGuest);

  useEffect(() => {
    const raw = new URLSearchParams(window.location.search).get("to");
    if (raw) {
      const name = raw.replace(/\+/g, " ").trim();
      if (name) setGuest(name);
    }
  }, []);

  return guest;
}
