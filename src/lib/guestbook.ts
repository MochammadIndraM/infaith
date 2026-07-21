import { mockWishes } from "@/data/guestbook.mock";
import type { RsvpEntry, RsvpInput, WishEntry, WishInput } from "@/types";

/**
 * Abstraksi CRUD ucapan & RSVP — SATU-SATUNYA titik akses data (spec §2).
 * Komponen HARUS lewat file ini, tak boleh menyentuh sumber data langsung.
 * Sekarang: MOCK in-memory (reset saat reload, "live" selama sesi).
 * Saat pindah Supabase nanti: cukup ganti isi fungsi di file ini.
 */

// Store in-memory (bukan localStorage — sesuai guardrail state inti).
let wishes: WishEntry[] = [...mockWishes];
let rsvps: RsvpEntry[] = [];

const delay = (ms: number) => new Promise<void>((r) => window.setTimeout(r, ms));

const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

/* ── Ucapan (Guestbook) ───────────────────────────────────────────── */

export async function getWishes(): Promise<WishEntry[]> {
  await delay(300);
  return [...wishes];
}

export async function addWish(input: WishInput): Promise<WishEntry> {
  await delay(600);
  const entry: WishEntry = {
    ...input,
    id: uid(),
    createdAt: new Date().toISOString(),
  };
  wishes = [entry, ...wishes];
  return entry;
}

/* ── RSVP ─────────────────────────────────────────────────────────── */

export async function submitRsvp(input: RsvpInput): Promise<RsvpEntry> {
  await delay(700);
  const entry: RsvpEntry = {
    ...input,
    id: uid(),
    createdAt: new Date().toISOString(),
  };
  rsvps = [entry, ...rsvps];
  return entry;
}

export async function getRsvps(): Promise<RsvpEntry[]> {
  await delay(200);
  return [...rsvps];
}
