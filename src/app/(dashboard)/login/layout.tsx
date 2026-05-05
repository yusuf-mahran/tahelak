'use client';

import { AuthLayout } from '@/components/auth/login/AuthLayout';
import { AuthRedirect } from '@/components/auth/ProtectedRoute';
import Loader from '@/components/utils/Loader';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/hooks/auth/useAuth';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { loading: authLoading } = useAuth();
  const pathname = usePathname();
  const { localeData } = useLanguage();
  const [loginData, setLoginData] = useState(localeData?.auth.login.poster);

  useEffect(() => {
    const updateLoginData = (
      data:
        | {
            title: string;
            description: string;
          }
        | undefined,
    ) => {
      setLoginData(data);
    };

    if (pathname === '/login') {
      updateLoginData(localeData?.auth.login.poster);
    } else if (pathname === '/login/forgot-password') {
      updateLoginData(localeData?.auth.forgotPassword.poster);
    } else {
      updateLoginData(undefined);
    }
  }, [pathname, localeData]);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-full bg-background">
        <Loader />
      </div>
    );
  }

  return (
    <AuthRedirect>
      <AuthLayout
        title={loginData?.title}
        subtitle={
          loginData?.description || 'Welcome back! Please enter your details.'
        }
      >
        {children}
      </AuthLayout>
    </AuthRedirect>
  );
}
