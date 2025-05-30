
type SupabaseStatus = {
  valid: boolean;
  url?: string;
  hasAnonKey?: boolean;
  error?: unknown;
};

type ClerkStatus = {
  valid: boolean;
  publishable?: boolean;
  secret?: boolean;
  urls: {
    signIn?: string;
    signUp?: string;
    afterSignIn?: string;
    afterSignUp?: string;
  };
  error?: unknown;
};

type SystemCheck = {
  supabaseReady: boolean;
  clerkReady: boolean;
  allGood: boolean;
};


export async function validateSupabase(): Promise<SupabaseStatus> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  try {
    console.info('🔧 Validating Supabase configuration...');

    const status: SupabaseStatus = {
      valid: Boolean(url && anonKey),
      url,
      hasAnonKey: Boolean(anonKey)
    };

    if (!status.valid) {
      console.warn('❗Supabase config is incomplete.');
    }

    return status;
  } catch (err) {
    console.error('🚨 Supabase config check failed:', err);
    return { valid: false, error: err };
  }
}


export function validateClerk(): ClerkStatus {
  const pubKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const secretKey = process.env.CLERK_SECRET_KEY;

  const urls = {
    signIn: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL,
    signUp: process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL,
    afterSignIn: process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL,
    afterSignUp: process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL
  };

  try {
    console.info('🔐 Validating Clerk configuration...');

    const status: ClerkStatus = {
      valid: Boolean(pubKey && secretKey),
      publishable: Boolean(pubKey),
      secret: Boolean(secretKey),
      urls
    };

    if (!status.valid) {
      console.warn('❗Clerk config is incomplete.');
    }

    return status;
  } catch (err) {
    console.error('🚨 Clerk config check failed:', err);
    return { valid: false, urls, error: err };
  }
}

export async function verifySystem(): Promise<SystemCheck> {
  const supabase = await validateSupabase();
  const clerk = validateClerk();

  const results: SystemCheck = {
    supabaseReady: supabase.valid,
    clerkReady: clerk.valid,
    allGood: supabase.valid && clerk.valid
  };

  console.log('\n Configuration Summary:');
  console.table(results);

  return results;
}
