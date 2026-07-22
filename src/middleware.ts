import { NextResponse, type NextRequest } from "next/server";

// Kunci Basic Auth untuk /admin. Kredensial dari env (ADMIN_USER/ADMIN_PASSWORD).
// Default-deny: bila env belum diset, akses ditolak (biar data RSVP tak bocor).
export function middleware(req: NextRequest) {
  const user = process.env.ADMIN_USER;
  const pass = process.env.ADMIN_PASSWORD;

  const unauthorized = (message: string) =>
    new NextResponse(message, {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="Admin", charset="UTF-8"' },
    });

  if (!user || !pass) {
    return unauthorized("Halaman admin belum dikonfigurasi (set ADMIN_USER & ADMIN_PASSWORD).");
  }

  const header = req.headers.get("authorization") ?? "";
  const expected = `Basic ${btoa(`${user}:${pass}`)}`;

  if (header !== expected) {
    return unauthorized("Autentikasi diperlukan.");
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
