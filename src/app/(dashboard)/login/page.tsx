'use client';

import LoginCard from '@/components/auth/login/LoginCard';
import { useLogin } from '../../../hooks/useLogin';
import { Loader2 } from 'lucide-react';
import { AuthRedirect } from '@/components/auth/ProtectedRoute';

export default function LoginPage() {
  const { authLoading, isRtl } = useLogin();

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <AuthRedirect>
      <div
        className="flex items-center justify-center min-h-[80vh] px-4"
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        <LoginCard />
      </div>
    </AuthRedirect>
  );
}
