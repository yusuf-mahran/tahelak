/**
 * @file client.ts
 * @description Supabase client singleton — import this everywhere.
 * Supports both browser (anon key) and server (service role key) contexts.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// ─── Env validation ──────────────────────────────────────────────────────────

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY; // server-only

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    '[Supabase] Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY',
  );
}

// ─── Browser client (singleton) ──────────────────────────────────────────────

let _browserClient: SupabaseClient | null = null;

/**
 * Returns a singleton Supabase client for use in browser / client components.
 * Uses the anon key — respects Row Level Security (RLS).
 */
export function getSupabaseClient(): SupabaseClient {
  if (!_browserClient) {
    _browserClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }
  return _browserClient;
}

// ─── Server / admin client ────────────────────────────────────────────────────

/**
 * Returns a Supabase client with the service-role key.
 * ⚠️  NEVER expose this to the browser. Use only in Server Actions / API routes.
 * Bypasses RLS — use with care.
 */
export function getSupabaseAdmin(): SupabaseClient {
  if (!SUPABASE_SERVICE_KEY) {
    throw new Error('[Supabase] SUPABASE_SERVICE_ROLE_KEY is not set.');
  }
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

// Default export for convenience
export const supabase = getSupabaseClient();
