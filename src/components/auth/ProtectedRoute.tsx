'use client';

import { useAuth } from '@/hooks/auth/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Loader from '../utils/Loader';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/registration');
    }
  }, [user, loading, router]);

  if (loading) {
    return <Loader />;
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}

// redirect to dashboard if user is already authenticated
export function AuthRedirect({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return <Loader />;
  }

  if (user) {
    return null;
  }

  return <>{children}</>;
}
