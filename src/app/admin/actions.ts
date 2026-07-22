"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase-admin";

// Hapus ucapan (moderasi). Service role → bypass RLS.
// Dipanggil dari client component; tetap aman karena /admin dikunci Basic Auth (middleware).
export async function deleteWish(id: string): Promise<void> {
  if (supabaseAdmin && id) {
    await supabaseAdmin.from("wishes").delete().eq("id", id);
    revalidatePath("/admin");
  }
}
