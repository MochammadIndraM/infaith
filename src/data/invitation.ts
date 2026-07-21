import type { Invitation } from "@/types";

// ── SUMBER KEBENARAN SEMUA KONTEN ──────────────────────────────────────────
// Semua nama, tanggal, ayat, timeline, foto, rekening HANYA dari sini.
// Ganti isi undangan tanpa menyentuh kode komponen.
// Semua nilai di bawah adalah DUMMY placeholder — tukar dengan data asli nanti.

/** Placeholder blur ivory (SVG data URL) untuk next/image sebelum foto asli masuk. */
const BLUR_IVORY =
  "data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='8'%20height='8'%3E%3Crect%20width='8'%20height='8'%20fill='%23f1e9da'/%3E%3C/svg%3E";

export const invitation: Invitation = {
  meta: {
    siteUrl: "https://infaith.example.com",
    description:
      "Dengan memohon rahmat dan ridho Allah SWT, kami mengundang Bapak/Ibu/Saudara/i untuk hadir di hari bahagia kami — Raka & Anindya.",
    ogImage: "/images/og-cover.jpg",
    defaultGuest: "Bapak/Ibu/Saudara/i",
    hashtag: "#RakaMenujuAnindya",
    audioSrc: "/audio/backsound.mp3",
  },

  couple: {
    monogram: "R & A",
    groom: {
      nickname: "Raka",
      fullName: "Raka Danadyaksa Wibowo",
      childOrder: "Putra pertama",
      father: "Bapak Bambang Wibowo",
      mother: "Ibu Sri Handayani",
      photo: "/images/groom.jpg",
      instagram: "raka.wibowo",
    },
    bride: {
      nickname: "Anindya",
      fullName: "Anindya Kusuma Ratri",
      childOrder: "Putri kedua",
      father: "Bapak Hendra Kusuma",
      mother: "Ibu Retno Wulandari",
      photo: "/images/bride.jpg",
      instagram: "anindya.ratri",
    },
  },

  opening: {
    prefix: "Bismillahirrahmanirrahim",
    text: "Dan di antara tanda-tanda kekuasaan-Nya diciptakan-Nya untukmu pasangan hidup dari jenismu sendiri supaya kamu mendapat ketenangan hati, dan dijadikan-Nya kasih sayang di antara kamu.",
    source: "QS. Ar-Rum: 21",
  },

  event: {
    dateLabel: "Sabtu, 20 Desember 2025",
    dateISO: "2025-12-20",
    akad: {
      name: "Akad Nikah",
      startISO: "2025-12-20T09:00:00+07:00",
      endISO: "2025-12-20T11:00:00+07:00",
      dateLabel: "Sabtu, 20 Desember 2025",
      timeLabel: "09.00 – 11.00 WIB",
      venueName: "Masjid Agung Al-Falah",
      venueAddress:
        "Jl. Sultan Agung No. 12, Kota Yogyakarta, Daerah Istimewa Yogyakarta 55223",
      coordinates: { lat: -7.801389, lng: 110.364444 },
      mapsUrl: "https://maps.google.com/?q=-7.801389,110.364444",
    },
    resepsi: {
      name: "Resepsi",
      startISO: "2025-12-20T12:00:00+07:00",
      endISO: "2025-12-20T15:00:00+07:00",
      dateLabel: "Sabtu, 20 Desember 2025",
      timeLabel: "12.00 – 15.00 WIB",
      venueName: "Pendopo Royal Ambarrukmo",
      venueAddress:
        "Jl. Laksda Adisucipto No. 81, Caturtunggal, Depok, Sleman, DIY 55281",
      coordinates: { lat: -7.782778, lng: 110.398611 },
      mapsUrl: "https://maps.google.com/?q=-7.782778,110.398611",
    },
  },

  loveStory: [
    {
      date: "2018",
      title: "Pertama Bertemu",
      description:
        "Berkenalan di sebuah acara kampus. Sebuah obrolan singkat yang ternyata menjadi awal dari segalanya.",
    },
    {
      date: "2020",
      title: "Menjalin Hubungan",
      description:
        "Setelah dua tahun berteman dekat, kami memutuskan untuk melangkah bersama dengan komitmen yang lebih serius.",
    },
    {
      date: "2022",
      title: "Melewati Jarak",
      description:
        "Diuji jarak antara dua kota, kami belajar arti kesabaran, kepercayaan, dan doa yang tak pernah putus.",
    },
    {
      date: "Maret 2024",
      title: "Lamaran",
      description:
        "Di hadapan kedua keluarga, niat baik disampaikan dan disambut hangat. Sebuah janji mulai dirajut.",
    },
    {
      date: "Desember 2025",
      title: "Menuju Halal",
      description:
        "Dengan restu orang tua dan ridho Allah, kami mantap menyatukan dua hati dalam ikatan yang suci.",
    },
  ],

  gallery: [
    { src: "/images/gallery-01.jpg", alt: "Raka & Anindya berjalan di tepi pantai", width: 1200, height: 1600, blurDataURL: BLUR_IVORY },
    { src: "/images/gallery-02.jpg", alt: "Momen tertawa bersama saat prewedding", width: 1600, height: 1067, blurDataURL: BLUR_IVORY },
    { src: "/images/gallery-03.jpg", alt: "Bergandengan tangan di taman kota", width: 1200, height: 1500, blurDataURL: BLUR_IVORY },
    { src: "/images/gallery-04.jpg", alt: "Siluet berdua saat matahari terbenam", width: 1600, height: 1067, blurDataURL: BLUR_IVORY },
    { src: "/images/gallery-05.jpg", alt: "Potret dekat Anindya tersenyum", width: 1200, height: 1600, blurDataURL: BLUR_IVORY },
    { src: "/images/gallery-06.jpg", alt: "Raka mengenakan busana adat", width: 1200, height: 1500, blurDataURL: BLUR_IVORY },
    { src: "/images/gallery-07.jpg", alt: "Berdua di depan bangunan klasik", width: 1600, height: 1067, blurDataURL: BLUR_IVORY },
    { src: "/images/gallery-08.jpg", alt: "Detail cincin tunangan", width: 1200, height: 1200, blurDataURL: BLUR_IVORY },
    { src: "/images/gallery-09.jpg", alt: "Momen kebersamaan di sawah terasering", width: 1600, height: 1067, blurDataURL: BLUR_IVORY },
    { src: "/images/gallery-10.jpg", alt: "Potret formal berdua dengan latar ivory", width: 1200, height: 1600, blurDataURL: BLUR_IVORY },
  ],

  gift: {
    note: "Doa restu Anda merupakan karunia yang paling berarti bagi kami. Namun jika memberi adalah ungkapan tanda kasih, dengan senang hati kami menerimanya secara cashless melalui:",
    accounts: [
      {
        bank: "Bank Central Asia (BCA)",
        accountNumber: "1234567890",
        accountHolder: "Anindya Kusuma Ratri",
      },
      {
        bank: "Bank Mandiri",
        accountNumber: "0987654321",
        accountHolder: "Raka Danadyaksa Wibowo",
      },
    ],
    qris: {
      image: "/images/qris.png",
      merchantName: "Raka & Anindya",
    },
    shippingAddress:
      "Jl. Kaliurang KM 7 No. 45, Sinduharjo, Ngaglik, Sleman, DIY 55581 (a.n. Anindya, 0812-3456-7890)",
  },

  closing:
    "Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu. Atas kehadiran dan doanya, kami ucapkan terima kasih.",
};
