import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Client Supabase untuk browser (anon key + Row Level Security).
// Pakai PostgREST/HTTP — bukan koneksi Postgres langsung, jadi aman di serverless
// tanpa perlu connection pooling.

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** True bila env Supabase terisi. Bila false, lib/guestbook.ts fallback ke mock. */
export const isSupabaseConfigured = Boolean(url && anonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url as string, anonKey as string)
  : null;
