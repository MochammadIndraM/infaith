-- ============================================================
-- Infaith — skema Supabase untuk RSVP & Guestbook
-- Jalankan di: Supabase Dashboard → SQL Editor → New query → Run
-- ============================================================

-- ── Tabel ucapan (Guestbook) ────────────────────────────────
create table if not exists public.wishes (
  id         uuid        primary key default gen_random_uuid(),
  name       text        not null check (char_length(name) between 1 and 80),
  message    text        not null check (char_length(message) between 1 and 500),
  created_at timestamptz not null default now()
);

-- ── Tabel RSVP ──────────────────────────────────────────────
create table if not exists public.rsvps (
  id          uuid        primary key default gen_random_uuid(),
  name        text        not null check (char_length(name) between 1 and 80),
  attendance  text        not null check (attendance in ('hadir','tidak_hadir','ragu')),
  guest_count int         not null default 1 check (guest_count between 0 and 20),
  created_at  timestamptz not null default now()
);

create index if not exists wishes_created_at_idx on public.wishes (created_at desc);
create index if not exists rsvps_created_at_idx  on public.rsvps  (created_at desc);

-- ── Row Level Security ──────────────────────────────────────
alter table public.wishes enable row level security;
alter table public.rsvps  enable row level security;

-- Ucapan: siapa pun boleh BACA & KIRIM (tamu anonim).
drop policy if exists "wishes_public_read"   on public.wishes;
create policy "wishes_public_read"   on public.wishes for select to anon, authenticated using (true);

drop policy if exists "wishes_public_insert" on public.wishes;
create policy "wishes_public_insert" on public.wishes for insert to anon, authenticated with check (true);

-- RSVP: tamu boleh KIRIM, tapi TIDAK boleh membaca RSVP orang lain (privat).
-- Baca rekap kehadiran lewat Dashboard Supabase (service role bypass RLS).
drop policy if exists "rsvps_public_insert"  on public.rsvps;
create policy "rsvps_public_insert"  on public.rsvps  for insert to anon, authenticated with check (true);

-- Catatan: tidak ada policy SELECT untuk rsvps → getRsvps() dari browser akan kosong/ditolak.
-- Itu disengaja demi privasi. Lihat data di Table Editor / SQL Editor dashboard.
