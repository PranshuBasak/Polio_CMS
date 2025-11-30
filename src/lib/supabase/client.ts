import { createBrowserClient } from "@supabase/ssr"
import { SupabaseClient } from "@supabase/supabase-js"
import { Database } from "@/lib/types/supabase";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const createClient = (): SupabaseClient<Database, "public"> => {
  if (!supabaseUrl || !supabaseKey) {
    console.error("Supabase environment variables are missing!")
  }
  return createBrowserClient(
    supabaseUrl,
    supabaseKey
  ) as unknown as SupabaseClient<Database, "public">;
}
