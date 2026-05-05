'use client';

import LoginCard from '@/components/auth/login/LoginCard';
import { useAuth } from '../../../hooks/auth/useAuth';
import Loader from '@/components/utils/Loader';

export default function LoginPage() {
  const { loading: authLoading } = useAuth();

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-full bg-background">
        <Loader />
      </div>
    );
  }

  return <LoginCard />;
}
