import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Client Supabase SERVER-ONLY dengan service/secret key → bypass RLS.
// WAJIB hanya dipakai di server (Server Component / Route Handler / middleware).
// `import "server-only"` bikin build gagal kalau tak sengaja ke-import di client —
// mencegah service key bocor ke browser.

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabaseAdmin: SupabaseClient | null =
  url && serviceKey
    ? createClient(url, serviceKey, { auth: { persistSession: false } })
    : null;
