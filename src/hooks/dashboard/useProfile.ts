'use client';

import { useCallback, useState } from 'react';
import { Database } from '@/lib/supabase';
import { getProfileUser } from '@/repositories/users';

type UserRow = Database['public']['Tables']['users']['Row'];

export const useProfile = () => {
  const [profile, setProfile] = useState<UserRow | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async (userId: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProfileUser(userId);
      setProfile(data);
      return data;
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Failed to fetch profile';
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const resetProfile = useCallback(() => setProfile(null), []);

  return { profile, loading, error, fetchProfile, resetProfile };
};
