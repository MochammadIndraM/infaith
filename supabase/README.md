# Setup Supabase — RSVP & Guestbook

Situs jalan **tanpa** Supabase (pakai mock, data tidak tersimpan). Ikuti langkah ini
agar RSVP & ucapan tersimpan permanen.

## 1. Buat project Supabase
1. Daftar/masuk di [supabase.com](https://supabase.com) → **New project**.
2. Simpan **Project URL** dan **anon public key** (Project Settings → API).

## 2. Buat tabel + policy
Buka **SQL Editor → New query**, tempel isi [`schema.sql`](./schema.sql), klik **Run**.
Ini membuat tabel `wishes` & `rsvps` plus Row Level Security:
- **wishes** — tamu boleh baca & kirim ucapan.
- **rsvps** — tamu boleh kirim, **tidak** boleh baca punya orang lain (privat).

## 3. Set environment variables
**Dev lokal** — salin `.env.example` → `.env.local`, isi:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```
**Produksi (Vercel)** — Project → Settings → Environment Variables, tambahkan dua
variabel yang sama, lalu **Redeploy**.

## 4. Selesai
Restart `npm run dev`. RSVP & ucapan kini tersimpan di Supabase.

## Lihat data masuk
- **Ucapan**: Table Editor → `wishes`.
- **Rekap RSVP**: Table Editor → `rsvps` (hanya bisa dilihat dari dashboard, sesuai desain privasi).

## Catatan keamanan
- `anon key` memang aman diekspos di browser — dilindungi Row Level Security.
- Panjang nama/pesan dibatasi lewat `CHECK` di database untuk cegah spam.
- Untuk anti-spam lebih kuat (mis. rate limit / captcha), bisa ditambah nanti.
