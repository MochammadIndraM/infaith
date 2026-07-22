import { mockWishes } from "@/data/guestbook.mock";
import { supabase } from "@/lib/supabase";
import type { RsvpEntry, RsvpInput, WishEntry, WishInput } from "@/types";

/**
 * Abstraksi CRUD ucapan & RSVP — SATU-SATUNYA titik akses data (spec §2).
 * Komponen HARUS lewat file ini.
 *
 * Backend:
 *   • Bila env Supabase terisi → simpan permanen ke Supabase (tabel wishes/rsvps).
 *   • Bila belum → fallback MOCK in-memory (reset saat reload) agar situs tetap jalan.
 *
 * Kolom DB pakai snake_case (created_at, guest_count); di-map ke camelCase di sini.
 */

/* ── Fallback MOCK (dipakai bila Supabase belum dikonfigurasi) ─────── */

let mockWishList: WishEntry[] = [...mockWishes];
let mockRsvpList: RsvpEntry[] = [];

const delay = (ms: number) => new Promise<void>((r) => window.setTimeout(r, ms));
const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

/* ── Ucapan (Guestbook) ───────────────────────────────────────────── */

export async function getWishes(): Promise<WishEntry[]> {
  if (!supabase) {
    await delay(300);
    return [...mockWishList];
  }
  const { data, error } = await supabase
    .from("wishes")
    .select("id, name, message, created_at")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map((r) => ({
    id: r.id,
    name: r.name,
    message: r.message,
    createdAt: r.created_at,
  }));
}

export async function addWish(input: WishInput): Promise<WishEntry> {
  if (!supabase) {
    await delay(600);
    const entry: WishEntry = { ...input, id: uid(), createdAt: new Date().toISOString() };
    mockWishList = [entry, ...mockWishList];
    return entry;
  }
  const { data, error } = await supabase
    .from("wishes")
    .insert({ name: input.name, message: input.message })
    .select("id, name, message, created_at")
    .single();
  if (error) throw new Error(error.message);
  return {
    id: data.id,
    name: data.name,
    message: data.message,
    createdAt: data.created_at,
  };
}

/* ── RSVP ─────────────────────────────────────────────────────────── */

export async function submitRsvp(input: RsvpInput): Promise<RsvpEntry> {
  if (!supabase) {
    await delay(700);
    const entry: RsvpEntry = { ...input, id: uid(), createdAt: new Date().toISOString() };
    mockRsvpList = [entry, ...mockRsvpList];
    return entry;
  }
  // Insert TANPA baca-balik: tabel rsvps sengaja tak punya SELECT policy (privasi),
  // sehingga .select() setelah insert akan ditolak RLS (42501). Konfirmasi RSVP
  // tak memerlukan row balik — cukup pastikan insert sukses.
  const { error } = await supabase.from("rsvps").insert({
    name: input.name,
    attendance: input.attendance,
    guest_count: input.guestCount,
  });
  if (error) throw new Error(error.message);
  return { ...input, id: uid(), createdAt: new Date().toISOString() };
}

/**
 * Daftar RSVP — untuk keperluan admin. Secara default RLS menutup SELECT rsvps
 * (data kehadiran bersifat privat), jadi baca via dashboard Supabase.
 */
export async function getRsvps(): Promise<RsvpEntry[]> {
  if (!supabase) {
    await delay(200);
    return [...mockRsvpList];
  }
  const { data, error } = await supabase
    .from("rsvps")
    .select("id, name, attendance, guest_count, created_at")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map((r) => ({
    id: r.id,
    name: r.name,
    attendance: r.attendance,
    guestCount: r.guest_count,
    createdAt: r.created_at,
  }));
}
