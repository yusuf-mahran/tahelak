/**
 * @file auth.ts
 * @description All Supabase Auth operations in one place.
 * Covers email/password, magic link, OAuth, session management, and helpers.
 */

import { supabase } from './client';
import type { Provider, Session, User } from '@supabase/supabase-js';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AuthResult<T = null> {
  data: T;
  error: string | null;
}

// ─── Sign up ─────────────────────────────────────────────────────────────────

/**
 * Register with email + password.
 * Supabase sends a confirmation email automatically if email confirmations are on.
 */
export async function signUpWithEmail(
  email: string,
  password: string,
  metadata?: Record<string, unknown>,
): Promise<AuthResult<{ user: User | null; session: Session | null } | null>> {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: metadata },
  });
  return {
    data: {
      user: data.user,
      session: data.session,
    },
    error: error?.message ?? null,
  };
}

// ─── Sign in ─────────────────────────────────────────────────────────────────

export async function signInWithEmail(
  email: string,
  password: string,
): Promise<AuthResult<{ session: Session | null; user: User | null } | null>> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return {
    data: { session: data.session, user: data.user },
    error: error?.message ?? null,
  };
}

/**
 * Passwordless / magic-link sign-in.
 * @param redirectTo  Full URL Supabase should redirect to after the user clicks the link.
 */
export async function signInWithMagicLink(
  email: string,
  redirectTo?: string,
): Promise<AuthResult> {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: redirectTo },
  });
  return { data: null, error: error?.message ?? null };
}

/**
 * OAuth sign-in (Google, GitHub, etc.)
 * @param provider  Supabase provider string e.g. "google" | "github"
 */
export async function signInWithOAuth(
  provider: Provider,
  redirectTo?: string,
): Promise<AuthResult> {
  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo },
  });
  return { data: null, error: error?.message ?? null };
}

// ─── Sign out ─────────────────────────────────────────────────────────────────

export async function signOut(): Promise<AuthResult> {
  const { error } = await supabase.auth.signOut();
  return { data: null, error: error?.message ?? null };
}

// ─── Session & user ───────────────────────────────────────────────────────────

/** Get the current session (null if not logged in). */
export async function getSession(): Promise<Session | null> {
  const { data } = await supabase.auth.getSession();
  return data.session;
}

/** Get the current user (null if not logged in). */
export async function getCurrentUser(): Promise<User | null> {
  const { data } = await supabase.auth.getUser();
  return data.user;
}

// ─── Password management ──────────────────────────────────────────────────────

export async function sendPasswordResetEmail(
  email: string,
  redirectTo?: string,
): Promise<AuthResult> {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo,
  });
  return { data: null, error: error?.message ?? null };
}

export async function updatePassword(newPassword: string): Promise<AuthResult> {
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  return { data: null, error: error?.message ?? null };
}

export async function updatePasswordWithToken(
  email: string,
  newPassword: string,
  token: string,
): Promise<AuthResult> {
  const { error: otpError } = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'recovery',
  });
  if (otpError) return { data: null, error: otpError.message };

  const { error } = await supabase.auth.updateUser({ password: newPassword });
  return { data: null, error: error?.message ?? null };
}

// ─── Auth state listener ──────────────────────────────────────────────────────

/**
 * Subscribe to auth state changes.
 * Returns an unsubscribe function — call it on component unmount.
 *
 * @example
 * const unsub = onAuthStateChange((event, session) => { ... });
 * return () => unsub();
 */
export function onAuthStateChange(
  callback: (event: string, session: Session | null) => void,
) {
  const { data } = supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session);
  });
  return () => data.subscription.unsubscribe();
}
