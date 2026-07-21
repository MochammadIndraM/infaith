# Infaith — Implementation Spec

> Undangan pernikahan digital single-page, kelas premium, mobile-first.
> Dokumen ini adalah instruksi build untuk AI coding assistant. Kerjakan **fase per fase**, jangan langsung semua. Selesaikan satu fase, pastikan lolos *acceptance criteria*-nya, baru lanjut.

**Cara pakai file ini di IDE:**
- Cursor → rename jadi `.cursor/rules/infaith.md` atau taruh di root & rujuk saat prompt.
- Claude Code → rename jadi `CLAUDE.md` di root repo.
- GitHub Copilot → taruh di `.github/copilot-instructions.md`.
- Umum → biarkan sebagai `INFAITH_IMPLEMENTATION.md`, lalu prompt: "Kerjakan Fase 0 sesuai INFAITH_IMPLEMENTATION.md".

---

## 0. Keputusan yang SUDAH DIKUNCI (jangan diubah tanpa alasan)

**Stack**
- Next.js (App Router) + TypeScript
- Tailwind CSS
- Framer Motion (animasi: scroll, shared layout, AnimatePresence)
- Zustand (state global: audio, modal galeri, status undangan dibuka)
- Deploy: Vercel
- Backend: **MOCK dulu** (data dummy di memori), struktur dirancang siap-colok Supabase nanti. Jangan pasang SDK database sekarang.

**Bahasa & konten**
- UI teks: Bahasa Indonesia.
- Semua konten (nama, tanggal, ayat, timeline, foto, rekening) HARUS dari `src/data/invitation.ts` — jangan hard-code di komponen. Ini biar gampang diganti tanpa sentuh kode.

---

## 1. Art Direction (token final — derive semua warna/font dari sini)

**Mood:** Elegan klasik — ivory + emas hangat + espresso. Tenang, mewah, "undangan cetak yang hidup". Bukan flashy.

**Palet (pakai persis nilai ini di Tailwind config):**
```
--ivory      #FAF6EF   /* kanvas utama */
--ivory-deep #F1E9DA   /* section alternatif / kartu */
--gold       #B08D57   /* aksen: garis, ornamen, monogram (warm antique gold) */
--gold-soft  #CBB185   /* highlight emas lembut / hover */
--espresso   #2E2620   /* teks utama */
--espresso-soft #5A4E44 /* teks sekunder / caption */
--line       #E3D8C4   /* hairline divider */
```
Aksen tunggal = **emas**. Jangan tambah warna cerah lain. Kedalaman datang dari tekstur & bayangan halus, bukan warna baru. (Hindari terracotta/clay #D9xxxx — itu default AI, bukan pilihan brief ini.)

**Tipografi (Google Fonts via `next/font`, `display: swap`):**
```
Display  : "Cormorant Garamond"  → nama pengantin, judul section (weight 400–600, high contrast)
Body     : "EB Garamond"         → paragraf, cerita, deskripsi (serif, print feel)
Utility  : "Jost"                → eyebrow/label/tanggal, UPPERCASE, letter-spacing lebar (~0.2em)
Signature: "Pinyon Script"       → HANYA untuk ampersand "&" dan/atau satu kata aksen. Jangan dipakai untuk teks panjang.
```
Type scale: display besar & lega (clamp untuk responsif), body 16–18px nyaman baca, utility kecil & di-track lebar.

**Signature element (satu hal yang bikin undangan ini diingat):**
Monogram emas hairline (inisial pasangan dalam lingkaran tipis). Muncul di preloader, jadi "segel" yang membuka saat tombol "Buka Undangan" ditekan (curtain reveal), lalu jadi motif hairline emas berulang sebagai pembatas antar section. Konsisten = terasa satu tangan.

**Motion personality — lembut & mengapung:**
- Satu easing kustom terpusat, pakai di mana-mana: `cubic-bezier(0.22, 1, 0.36, 1)` (ease-out ekspresif). Definisikan sekali sebagai konstanta, jangan pakai spring default FM sembarangan.
- Durasi transisi masuk: 0.6–0.9s. Pelan, tenang.
- Reveal on-scroll: fade + translate-y kecil (16–24px). Jangan gerakan besar/patah.
- Ambient halus: partikel emas / kelopak jatuh sangat pelan & samar di beberapa section (opsional, low opacity, `transform`-only).
- WAJIB hormati `prefers-reduced-motion`: matikan animasi non-esensial.

---

## 2. Struktur folder (buat persis begini)

```
src/
  app/
    layout.tsx          # font, metadata SEO, OG
    page.tsx            # rakit semua section berurutan
    globals.css         # token CSS var + base
  components/
    animation/
      AnimatedSection.tsx   # wrapper fade-up on-view (whileInView)
      StaggerText.tsx       # teks muncul per-huruf/kata (staggerChildren)
      GoldParticles.tsx     # ambient opsional
    ui/
      Button.tsx
      Monogram.tsx          # SVG monogram emas (signature)
      Divider.tsx           # hairline emas antar section
    Preloader.tsx
    AudioPlayer.tsx         # floating button
    ShareButton.tsx         # share ke WhatsApp
  sections/
    Cover.tsx           # hero + "Kepada Yth. [tamu]" + tombol buka
    Opening.tsx         # ayat / kutipan pembuka
    Couple.tsx          # profil + keluarga
    LoveStory.tsx       # timeline vertikal
    Gallery.tsx         # masonry + shared layout morphing
    EventDetails.tsx    # akad & resepsi, maps, countdown, .ics, tilt
    Gift.tsx            # amplop digital / rekening / QRIS
    Rsvp.tsx            # form konfirmasi (mock)
    Guestbook.tsx       # ucapan (mock, live selama sesi)
    Closing.tsx         # penutup + monogram
  store/
    useInvitationStore.ts   # isOpened, audioPlaying, activeGalleryId
  lib/
    utils.ts
    ics.ts                  # generate file .ics "Simpan ke Kalender"
    guestbook.ts            # abstraksi CRUD ucapan — MOCK sekarang, 1 file yg nanti diganti Supabase
  hooks/
    useGuestName.ts         # baca ?to= dari URL
    useScrollProgress.ts
  data/
    invitation.ts           # SUMBER KEBENARAN semua konten
    guestbook.mock.ts       # ucapan awal dummy
  types/
    index.ts
public/
  images/                   # foto (pakai placeholder dulu)
  audio/                    # lagu latar (placeholder dulu)
```

**Aturan swap-backend:** semua baca/tulis guestbook & RSVP HARUS lewat `lib/guestbook.ts`. Komponen tidak boleh menyentuh sumber data langsung. Jadi saat ganti ke Supabase nanti, cukup edit 1 file itu.

---

## FASE 0 — Setup & Fondasi
**Tugas:**
1. Init Next.js (App Router, TS, Tailwind, `src/` dir, alias `@/`).
2. Install `framer-motion`, `zustand`, `clsx`, `tailwind-merge`.
3. Tailwind config: masukkan semua token warna (§1), definisikan easing kustom, breakpoint mobile-first, spacing lega.
4. `next/font`: load 4 font (§1) dengan `display: swap`, expose sebagai CSS var.
5. `globals.css`: set CSS variables, base color ivory, teks espresso, smooth scroll.
6. Buat `src/data/invitation.ts` lengkap dengan dummy: pasangan (pria/wanita + orang tua), tanggal, 2 acara (akad+resepsi) dgn lokasi+koordinat maps, 4–6 item love story, 8–10 foto galeri (placeholder), 2 rekening + 1 QRIS, 1 ayat pembuka, teks penutup.
7. `layout.tsx`: metadata SEO + Open Graph (title, description, OG image) — krusial buat preview WhatsApp.

**Acceptance:** `npm run dev` jalan, halaman kosong ber-background ivory, font ke-load tanpa FOUT, tak ada error. Semua token warna kepakai lewat Tailwind class.

---

## FASE 1 — State & Kerangka
**Tugas:**
1. `useInvitationStore.ts` (Zustand): `isOpened`, `audioPlaying`, `activeGalleryId`, beserta actions.
2. `useGuestName.ts`: parse `?to=` dari URL (fallback "Bapak/Ibu/Saudara/i"). Decode `+` & `%20`.
3. `AnimatedSection.tsx`: wrapper `whileInView` (fade + translate-y, easing kustom, `once: true`, `viewport margin` agar trigger pas). Hormati reduced-motion.
4. `StaggerText.tsx`: reveal per kata/huruf via `staggerChildren`.
5. `Preloader.tsx`: monogram emas + progress, fade-out saat aset siap.
6. `page.tsx`: render semua section berurutan (pakai placeholder section dulu).

**Acceptance:** Preloader muncul lalu hilang; scroll memicu fade-up section; `?to=Budi` mengubah teks sapaan.

---

## FASE 2 — Section per Fitur
Kerjakan **satu section per iterasi**, jangan borong.

- **Cover** — nama pasangan (display + `&` script), tanggal (utility tracked), "Kepada Yth. [tamu]", tombol "Buka Undangan". Klik → set `isOpened=true` → **curtain reveal** (layar terangkat ke atas) + **staggered fade-in** nama. Trigger audio mulai di sini (patuh autoplay policy: baru jalan setelah interaksi).
- **Opening** — ayat/kutipan, tenang, banyak ruang kosong, hairline emas.
- **Couple** — kartu pria & wanita + nama orang tua. Slide-in dari sisi berlawanan + opacity rendah saat masuk viewport.
- **LoveStory** — timeline vertikal. Garis emas `scaleY` mengikuti `useScroll` progress section. Tiap item fade-up berurutan.
- **Gallery** — masonry (CSS columns), `next/image` + blur placeholder. Klik foto → **shared layout** (`layoutId` + `AnimatePresence`) morph membesar ke fullscreen tanpa reload. Modal terhubung ke `activeGalleryId`. Dukung close & swipe/panah antar foto. **Jaga 60fps**: animasikan hanya `transform`/`opacity`.
- **EventDetails** — kartu akad & resepsi (waktu, lokasi), embed Google Maps (iframe), **countdown** real-time, tombol **"Simpan ke Kalender"** (generate `.ics` via `lib/ics.ts`). Efek **tilt halus** — kecil, dan aman di sentuhan (jangan bergantung cursor saja; degrade mulus di mobile).
- **Gift** — kartu rekening + e-wallet + QRIS, tombol **copy-to-clipboard** (dengan feedback "Tersalin"), opsi alamat kirim kado.
- **Rsvp** (mock) — form (nama, kehadiran, jumlah tamu). Micro-interaction pada input. Submit: idle → spinner → animasi checklist. Simpan via `lib/guestbook.ts` (mock).
- **Guestbook** (mock) — form ucapan + daftar ucapan; ucapan baru muncul live (state lokal) selama sesi.
- **Closing** — penutup + monogram.
- **AudioPlayer** — floating button minimalis, sinkron `audioPlaying`. **ShareButton** — share link (+`?to=`) ke WhatsApp.

**Acceptance per section:** responsif di mobile, animasi mulus, konten dari `data/invitation.ts`, tak ada layout shift.

---

## FASE 3 — Polish & Performa
1. `next/image` semua foto: `sizes` responsif, `placeholder="blur"`, dimensi eksplisit → **CLS ~0**.
2. Audit animasi: hanya `transform`/`opacity`. `will-change` seperlunya. Target **60fps** di galeri & scroll.
3. `prefers-reduced-motion` dihormati menyeluruh.
4. A11y: alt text, kontras cukup, focus ring terlihat, keyboard nav di modal galeri (Esc close, panah navigasi).
5. Lighthouse: performance & accessibility hijau. Perbaiki temuan.

**Acceptance:** Lighthouse mobile — Performance ≥ 90, A11y ≥ 90, CLS ~0.

---

## Aturan main untuk AI assistant (guardrails)
- Jangan hard-code konten di komponen — semua dari `data/invitation.ts`.
- Jangan pasang SDK database. Backend = mock lewat `lib/guestbook.ts`.
- Jangan pakai `localStorage`/`sessionStorage` untuk state inti; pakai Zustand + React state.
- Animasi: satu easing kustom, `transform`/`opacity` saja, reduced-motion aman.
- Mobile-first selalu. Uji di viewport sempit dulu.
- Satu aksen warna (emas). Jangan improvisasi warna baru.
- Serverless-ready: nanti saat Supabase, WAJIB pooled connection string (Transaction mode), bukan koneksi langsung.

## Butuh aset asli dari kamu (pakai placeholder dulu, tak menghambat)
Foto pre-wedding · teks final · file lagu (+hak pakai) · koordinat/link Maps asli · nomor rekening & QRIS · ayat pembuka pilihanmu.
