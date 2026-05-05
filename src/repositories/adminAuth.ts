'use server';

import { getSupabaseAdmin } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';

export const adminSignUp = async (
  email: string,
  password: string,
  metadata?: Record<string, unknown>,
): Promise<{ user: User }> => {
  // This function should only be used in a secure server environment
  try {
    const { data, error } = await getSupabaseAdmin().auth.admin.createUser({
      email,
      password,
      user_metadata: metadata,
      email_confirm: true,
    });

    if (error) throw new Error(error.message);
    if (!data?.user) throw new Error('Admin sign up failed');
    return { user: data.user };
  } catch (err: unknown) {
    throw new Error(
      err instanceof Error
        ? err.message
        : typeof err === 'string'
          ? err
          : 'An unknown error occurred during admin sign up',
    );
  }
};
