'use client';

import { useCallback, useState } from 'react';
import { Database } from '@/lib/supabase';
import { getOrgExercises } from '@/repositories/exercises';

type ExerciseRow = Database['public']['Tables']['exercises']['Row'];

const BASE = '/assets/exercises';

export const useExercises = () => {
  const [exercises, setExercises] = useState<ExerciseRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchExercises = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getOrgExercises();
      setExercises(
        data.map((item) => ({
          ...item,
          src: `${BASE}/${item.src}`,
        })) ?? [],
      );
      return data;
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Failed to fetch exercises';
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const resetExercises = useCallback(() => setExercises([]), []);

  return { exercises, loading, error, fetchExercises, resetExercises };
};
