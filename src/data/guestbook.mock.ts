import type { WishEntry } from "@/types";

// Ucapan awal (dummy) — tampil saat undangan pertama dibuka.
export const mockWishes: WishEntry[] = [
  {
    id: "seed-1",
    name: "Dimas & Sekar",
    message:
      "Selamat menempuh hidup baru, Raka & Anindya! Semoga menjadi keluarga yang sakinah, mawaddah, warahmah. 🤍",
    createdAt: "2025-12-01T08:15:00+07:00",
  },
  {
    id: "seed-2",
    name: "Keluarga Besar Wijaya",
    message:
      "Turut berbahagia atas pernikahan kalian. Semoga langgeng sampai kakek-nenek. Barakallahu lakuma.",
    createdAt: "2025-12-02T19:40:00+07:00",
  },
  {
    id: "seed-3",
    name: "Rani",
    message: "Akhirnyaaa! Bahagia banget lihat kalian bersatu. Sampai ketemu di hari H ya!",
    createdAt: "2025-12-03T10:05:00+07:00",
  },
];
