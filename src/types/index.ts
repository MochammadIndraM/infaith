// Kontrak data undangan. Semua section membaca bentuk ini dari data/invitation.ts.
// Ubah konten lewat data, bukan komponen.

export interface Person {
  /** Nama panggilan — dipakai di judul, monogram, sapaan. */
  nickname: string;
  /** Nama lengkap — dipakai di section Couple. */
  fullName: string;
  /** "Putra/Putri ke-N" untuk kalimat keluarga. */
  childOrder: string;
  father: string;
  mother: string;
  /** Path foto profil (placeholder dulu). */
  photo: string;
  /** Handle Instagram tanpa "@" (opsional). */
  instagram?: string;
}

export interface Couple {
  groom: Person;
  bride: Person;
  /** Inisial untuk monogram, mis. "R & A". */
  monogram: string;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface WeddingEventItem {
  /** "Akad Nikah" | "Resepsi" dsb. */
  name: string;
  /** ISO datetime mulai — dipakai countdown & .ics. */
  startISO: string;
  /** ISO datetime selesai — dipakai .ics. */
  endISO: string;
  /** Label tanggal ramah-baca, mis. "Sabtu, 20 Desember 2025". */
  dateLabel: string;
  /** Label waktu ramah-baca, mis. "09.00 – 11.00 WIB". */
  timeLabel: string;
  venueName: string;
  venueAddress: string;
  coordinates: Coordinates;
  /** Link Google Maps yang bisa dibuka. */
  mapsUrl: string;
}

export interface EventInfo {
  /** Tanggal utama untuk hero & metadata. */
  dateLabel: string;
  /** ISO tanggal utama (biasanya akad). */
  dateISO: string;
  akad: WeddingEventItem;
  resepsi: WeddingEventItem;
}

export interface LoveStoryItem {
  /** Label waktu, mis. "2019" atau "Maret 2024". */
  date: string;
  title: string;
  description: string;
}

export interface GalleryImage {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** Data URL blur untuk placeholder next/image. */
  blurDataURL: string;
}

export interface BankAccount {
  bank: string;
  accountNumber: string;
  accountHolder: string;
}

export interface Qris {
  /** Path gambar QRIS (placeholder dulu). */
  image: string;
  merchantName: string;
}

export interface Gift {
  /** Kalimat pengantar amplop digital. */
  note: string;
  accounts: BankAccount[];
  qris: Qris;
  /** Alamat kirim kado fisik (opsional). */
  shippingAddress?: string;
}

export interface OpeningVerse {
  /** Pembuka opsional di atas ayat, mis. "Bismillahirrahmanirrahim". */
  prefix?: string;
  /** Isi ayat / kutipan. */
  text: string;
  /** Sumber, mis. "QS. Ar-Rum: 21". */
  source: string;
}

export interface InvitationMeta {
  /** URL kanonik untuk OG/metadata. */
  siteUrl: string;
  /** Deskripsi untuk SEO + preview WhatsApp. */
  description: string;
  /** Path gambar OG 1200×630. */
  ogImage: string;
  /** Sapaan default saat tak ada ?to= di URL. */
  defaultGuest: string;
  /** Tagar pernikahan (opsional). */
  hashtag?: string;
  /** Path file lagu latar (placeholder dulu). */
  audioSrc: string;
}

// ── RSVP & Guestbook (mock) ────────────────────────────────────────
export type Attendance = "hadir" | "tidak_hadir" | "ragu";

export interface RsvpInput {
  name: string;
  attendance: Attendance;
  /** Jumlah tamu yang hadir (0 bila tidak hadir). */
  guestCount: number;
}
export interface RsvpEntry extends RsvpInput {
  id: string;
  createdAt: string;
}

export interface WishInput {
  name: string;
  message: string;
}
export interface WishEntry extends WishInput {
  id: string;
  createdAt: string;
}

export interface Invitation {
  meta: InvitationMeta;
  couple: Couple;
  opening: OpeningVerse;
  event: EventInfo;
  loveStory: LoveStoryItem[];
  gallery: GalleryImage[];
  gift: Gift;
  /** Teks penutup. */
  closing: string;
}
