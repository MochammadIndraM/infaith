import type { Metadata } from "next";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { invitation } from "@/data/invitation";
import type { Attendance } from "@/types";
import { DeleteWish } from "./DeleteWish";

// Selalu render fresh di server (jangan di-cache/prerender) + jangan di-index.
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Rekap RSVP",
  robots: { index: false, follow: false },
};

interface RsvpRow {
  id: string;
  name: string;
  attendance: Attendance;
  guest_count: number;
  created_at: string;
}

interface WishRow {
  id: string;
  name: string;
  message: string;
  created_at: string;
}

const STATUS: Record<Attendance, { label: string; className: string }> = {
  hadir: { label: "Hadir", className: "bg-gold text-ivory" },
  ragu: { label: "Masih Ragu", className: "bg-ivory-deep text-espresso border border-line" },
  tidak_hadir: { label: "Tidak Hadir", className: "bg-ivory-deep text-espresso-soft border border-line" },
};

function formatWaktu(iso: string): string {
  return new Date(iso).toLocaleString("id-ID", {
    timeZone: "Asia/Jakarta",
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="border border-line bg-ivory-deep p-5 text-center">
      <p className="font-display text-4xl font-medium text-espresso">{value}</p>
      <p className="mt-1 font-utility text-[0.65rem] uppercase tracking-utility text-espresso-soft">
        {label}
      </p>
    </div>
  );
}

export default async function AdminPage() {
  const coupleTitle = `${invitation.couple.groom.nickname} & ${invitation.couple.bride.nickname}`;

  if (!supabaseAdmin) {
    return (
      <main className="mx-auto max-w-md px-6 py-24 text-center">
        <h1 className="font-display text-3xl text-espresso">Rekap RSVP</h1>
        <p className="mt-4 font-body text-espresso-soft">
          Supabase belum dikonfigurasi. Set{" "}
          <code className="font-utility text-sm text-gold">SUPABASE_SERVICE_ROLE_KEY</code>{" "}
          di environment untuk menampilkan data.
        </p>
      </main>
    );
  }

  const [rsvpRes, wishRes] = await Promise.all([
    supabaseAdmin
      .from("rsvps")
      .select("id, name, attendance, guest_count, created_at")
      .order("created_at", { ascending: false }),
    supabaseAdmin
      .from("wishes")
      .select("id, name, message, created_at")
      .order("created_at", { ascending: false }),
  ]);

  if (rsvpRes.error) {
    return (
      <main className="mx-auto max-w-md px-6 py-24 text-center">
        <h1 className="font-display text-3xl text-espresso">Rekap RSVP</h1>
        <p className="mt-4 font-body text-espresso-soft">
          Gagal memuat data: {rsvpRes.error.message}
        </p>
      </main>
    );
  }

  const rows = (rsvpRes.data ?? []) as RsvpRow[];
  const wishes = (wishRes.data ?? []) as WishRow[];
  const hadir = rows.filter((r) => r.attendance === "hadir");
  const totalKepala = hadir.reduce((sum, r) => sum + (r.guest_count || 0), 0);

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <header className="text-center">
        <p className="font-utility text-xs uppercase tracking-utility text-gold">Rekap Kehadiran</p>
        <h1 className="mt-2 font-display text-4xl font-medium text-espresso sm:text-5xl">
          {coupleTitle}
        </h1>
      </header>

      <section className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Stat label="Konfirmasi Hadir" value={hadir.length} />
        <Stat label="Total Kepala Hadir" value={totalKepala} />
        <Stat label="Masih Ragu" value={rows.filter((r) => r.attendance === "ragu").length} />
        <Stat label="Tidak Hadir" value={rows.filter((r) => r.attendance === "tidak_hadir").length} />
      </section>

      <section className="mt-12">
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-2xl text-espresso">Daftar RSVP</h2>
          <span className="font-utility text-[0.7rem] uppercase tracking-utility text-espresso-soft">
            {rows.length} entri
          </span>
        </div>

        {rows.length === 0 ? (
          <p className="mt-6 font-body text-espresso-soft">Belum ada konfirmasi masuk.</p>
        ) : (
          <div className="mt-6 overflow-x-auto border border-line">
            <table className="w-full min-w-lg border-collapse text-left">
              <thead>
                <tr className="bg-ivory-deep font-utility text-[0.65rem] uppercase tracking-utility text-espresso-soft">
                  <th className="px-4 py-3 font-normal">Nama</th>
                  <th className="px-4 py-3 font-normal">Status</th>
                  <th className="px-4 py-3 text-center font-normal">Tamu</th>
                  <th className="px-4 py-3 font-normal">Waktu</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="border-t border-line font-body text-sm text-espresso">
                    <td className="px-4 py-3">{r.name}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block rounded-full px-3 py-1 font-utility text-[0.6rem] uppercase tracking-utility ${STATUS[r.attendance].className}`}
                      >
                        {STATUS[r.attendance].label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center tabular-nums">
                      {r.attendance === "hadir" ? r.guest_count : "—"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-espresso-soft">
                      {formatWaktu(r.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ── Moderasi Ucapan ─────────────────────────────────────── */}
      <section className="mt-16">
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-2xl text-espresso">Ucapan (Guestbook)</h2>
          <span className="font-utility text-[0.7rem] uppercase tracking-utility text-espresso-soft">
            {wishes.length} ucapan
          </span>
        </div>
        <p className="mt-2 font-body text-sm text-espresso-soft">
          Hapus ucapan yang spam atau tidak pantas. Perubahan langsung tampil di undangan.
        </p>

        {wishes.length === 0 ? (
          <p className="mt-6 font-body text-espresso-soft">Belum ada ucapan.</p>
        ) : (
          <ul className="mt-6 flex flex-col gap-3">
            {wishes.map((w) => (
              <li
                key={w.id}
                className="flex items-start justify-between gap-4 border border-line bg-ivory-deep p-4"
              >
                <div className="min-w-0">
                  <div className="flex items-baseline gap-3">
                    <p className="font-display text-lg text-espresso">{w.name}</p>
                    <span className="shrink-0 font-utility text-[0.6rem] uppercase tracking-utility text-espresso-soft">
                      {formatWaktu(w.created_at)}
                    </span>
                  </div>
                  <p className="mt-1 font-body text-sm leading-relaxed text-espresso-soft">
                    {w.message}
                  </p>
                </div>
                <div className="shrink-0">
                  <DeleteWish id={w.id} name={w.name} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
