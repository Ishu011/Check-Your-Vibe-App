import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { auth } from '@clerk/nextjs/server';

export async function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('[Supabase] Missing URL or key in environment variables');
    throw new Error('Supabase URL or anon key is not defined');
  }

  try {
    // Attempt to get Clerk auth session
    const clerkAuth = await auth();
    const token = await clerkAuth.getToken();

    if (token) {
      const supabase = createSupabaseClient(supabaseUrl, supabaseKey, {
        global: { fetch: undefined },
        auth: {
          autoRefreshToken: false,
          persistSession: false,
          detectSessionInUrl: false,
        },
      });

      await supabase.auth.setAuth(token);
      return supabase;
    }

      console.warn('[Supabase] No Clerk token found — using anonymous Supabase client.');
    return createSupabaseClient(supabaseUrl, supabaseKey);

  } catch (error) {
    console.error('[Supabase] Failed to create authenticated client:', error);
    console.warn('[Supabase] Using anonymous fallback client.');
    return createSupabaseClient(supabaseUrl, supabaseKey);
  }
}
