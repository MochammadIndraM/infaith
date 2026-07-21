import type { WeddingEventItem } from "@/types";

// Generate & unduh file .ics "Simpan ke Kalender".
// Tanggal dikonversi ke UTC (format ...Z) agar universal tanpa perlu TZID.

function formatICSDate(iso: string): string {
  return new Date(iso)
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "");
}

/** Escape karakter khusus sesuai RFC 5545. */
function escapeICS(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

export function buildICS(event: WeddingEventItem, title: string): string {
  const uid = `${formatICSDate(event.startISO)}-${event.name}@infaith`.replace(
    /\s+/g,
    "-",
  );

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Infaith//Undangan Pernikahan//ID",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${formatICSDate(new Date().toISOString())}`,
    `DTSTART:${formatICSDate(event.startISO)}`,
    `DTEND:${formatICSDate(event.endISO)}`,
    `SUMMARY:${escapeICS(`${event.name} — ${title}`)}`,
    `LOCATION:${escapeICS(`${event.venueName}, ${event.venueAddress}`)}`,
    `DESCRIPTION:${escapeICS(`${event.name} pernikahan ${title}`)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

export function downloadICS(event: WeddingEventItem, title: string): void {
  const blob = new Blob([buildICS(event, title)], {
    type: "text/calendar;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${event.name.replace(/\s+/g, "-").toLowerCase()}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
