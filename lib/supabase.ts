'use client';

import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { useSession } from '@clerk/nextjs';
import { useEffect, useState } from 'react';

// Load environment variables safely
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check .env.local');
}

export function useSupabase() {
  const { session } = useSession();
  const [supabase, setSupabase] = useState(() =>
    createSupabaseClient(supabaseUrl, supabaseAnonKey)
  );

  useEffect(() => {
    if (!session) return;

    // When session is present, create a new Supabase client with dynamic token support
    const supabaseClient = createSupabaseClient(supabaseUrl, supabaseAnonKey, {
      global: {
        fetch: undefined,
      },
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false,
      },
    });

    // Add token to each request using `supabase.auth.setAuth()`
    session.getToken().then(token => {
      if (token) {
        supabaseClient.auth.setAuth(token);
      }
    });

    setSupabase(supabaseClient);
  }, [session]);

  return supabase;
}

export const createClient = useSupabase;
