import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Database } from "@/lib/types/supabase";
import { createClient as createSupabaseClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const createClient = async (cookieStore?: Awaited<ReturnType<typeof cookies>>): Promise<SupabaseClient<Database, "public">> => {
  const cookiesToUse = cookieStore || (await cookies());

  return createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return cookiesToUse.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookiesToUse.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  ) as unknown as SupabaseClient<Database, "public">;
};

export const createAdminClient = (): SupabaseClient<Database, "public"> => {
  return createSupabaseClient(
    supabaseUrl,
    supabaseServiceKey || supabaseKey
  ) as unknown as SupabaseClient<Database, "public">;
};
