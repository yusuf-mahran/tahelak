import {
  signInWithEmail,
  signOut,
  signUpWithEmail,
  getSession,
  onAuthStateChange,
  sendPasswordResetEmail as sendPasswordResetEmailToSupabase,
} from '@/lib/supabase';
import { AuthResult, updatePasswordWithToken } from '@/lib/supabase/auth';
import type { Session, User } from '@supabase/supabase-js';

export async function login(
  email: string,
  password: string,
): Promise<{
  session: Session;
  user: User;
}> {
  try {
    const { data, error } = await signInWithEmail(email, password);
    if (error) throw new Error(error);
    if (!data?.session || !data.user) throw new Error('Sign in failed');
    return {
      session: data.session,
      user: data.user,
    };
  } catch (err: unknown) {
    throw new Error(
      err instanceof Error
        ? err.message
        : typeof err === 'string'
          ? err
          : 'An unknown error occurred during sign in',
    );
  }
}

export async function logout(): Promise<void> {
  try {
    const { error } = await signOut();
    if (error) throw new Error(error);
  } catch (err: unknown) {
    throw new Error(
      err instanceof Error
        ? err.message
        : typeof err === 'string'
          ? err
          : 'An unknown error occurred during sign out',
    );
  }
}

export async function signUp(
  email: string,
  password: string,
  metadata?: Record<string, unknown>,
): Promise<{ user: User; session: Session }> {
  try {
    const { data, error } = await signUpWithEmail(email, password, metadata);
    if (error) throw new Error(error);
    if (!data?.user || !data?.session) throw new Error('Sign up failed');

    return {
      user: data.user,
      session: data.session,
    };
  } catch (err: unknown) {
    throw new Error(
      err instanceof Error
        ? err.message
        : typeof err === 'string'
          ? err
          : 'An unknown error occurred during sign up',
    );
  }
}

export async function getUserSession(): Promise<{
  session: Session | null;
  user: User | null;
}> {
  try {
    const session = await getSession();

    if (!session) {
      return {
        session: null,
        user: null,
      };
    }
    return { user: session.user, session };
  } catch (err: unknown) {
    throw new Error(
      err instanceof Error
        ? err.message
        : typeof err === 'string'
          ? err
          : 'An unknown error occurred while getting session',
    );
  }
}

export function unSubOnAuthStateChange(
  callback: (event: string, session: Session | null) => void,
): () => void {
  try {
    const authListener = onAuthStateChange(callback);
    return authListener;
  } catch (err: unknown) {
    throw new Error(
      err instanceof Error
        ? err.message
        : typeof err === 'string'
          ? err
          : 'An unknown error occurred while subscribing to auth state changes',
    );
  }
}

export async function sendPasswordResetEmail(email: string): Promise<void> {
  try {
    await sendPasswordResetEmailToSupabase(email);
  } catch (err: unknown) {
    throw new Error(
      err instanceof Error
        ? err.message
        : typeof err === 'string'
          ? err
          : 'An error occurred while sending password reset email',
    );
  }
}

export async function updatePassword(
  email: string,
  newPassword: string,
  token: string,
): Promise<AuthResult> {
  try {
    const { error } = await updatePasswordWithToken(email, newPassword, token);
    if (error) throw new Error(error || 'Failed to update password');
    return { data: null, error: null };
  } catch (err: unknown) {
    throw new Error(
      err instanceof Error
        ? err.message
        : typeof err === 'string'
          ? err
          : 'An unknown error occurred while updating password',
    );
  }
}
