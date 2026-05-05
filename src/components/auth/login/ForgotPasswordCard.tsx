'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { TypographyH1 } from '@/components/ui/typography';
import { Input } from '@/components/ui/input';
import { OtpInput } from '@/components/ui/otp-input';
import {
  Mail,
  Loader2,
  ArrowLeft,
  Send,
  Lock,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import Link from 'next/link';
import { useForgotPassword } from '@/hooks/auth/useForgotPassword';
import { useLanguage } from '@/context/LanguageContext';
import React, { useEffect, useRef, useState } from 'react';

const RESEND_SECONDS = 90;

export default function ForgotPasswordCard() {
  const { localeData } = useLanguage();
  const {
    email,
    setEmail,
    token,
    setToken,
    newPassword,
    setNewPassword,
    loading,
    error,
    step,
    handleResetPassword,
    handleTokenSubmit,
  } = useForgotPassword();

  const [countdown, setCountdown] = useState(RESEND_SECONDS);
  const [resendLoading, setResendLoading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Start countdown when entering the token step
  useEffect(() => {
    if (step !== 'token') return;
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [step]);

  const handleResend = async () => {
    setResendLoading(true);
    await handleResetPassword(email);
    setToken('');
    setCountdown(RESEND_SECONDS);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    setResendLoading(false);
  };

  const formatCountdown = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const {
    title,
    subtitle,
    emailPlaceholder,
    submitButton,
    backToLogin,
    successMessage,
    newPasswordPlaceholder,
    tokenTitle,
    tokenSubtitle,
    successTitle,
    resendCode,
    resendCodeIn,
  } = localeData?.auth.forgotPassword || {};

  const renderContent = () => {
    if (step === 'success') {
      return (
        <div className="bg-primary/5 border border-primary/10 rounded-xl p-6 text-center animate-in fade-in zoom-in-95 duration-500">
          <CheckCircle2 className="h-12 w-12 text-primary mx-auto mb-4" />
          <p className="text-primary font-medium text-sm leading-relaxed">
            {successMessage || 'Password reset successfully!'}
          </p>
          <Button asChild className="mt-6 w-full">
            <Link href="/login">{backToLogin}</Link>
          </Button>
        </div>
      );
    }

    if (step === 'token') {
      return (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleTokenSubmit();
          }}
          className="space-y-5"
        >
          <OtpInput value={token} onChange={setToken} disabled={loading} />

          <div className="relative group/input">
            <Input
              type="password"
              placeholder={newPasswordPlaceholder || 'New Password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              icon={Lock}
              showPasswordToggle
            />
          </div>

          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-md p-2">
              <p className="text-[11px] text-destructive text-center font-medium">
                {error}
              </p>
            </div>
          )}

          <Button
            type="submit"
            className="w-full h-10 text-sm font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all active:scale-[0.98]"
            disabled={loading || token.length !== 6}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin me-2" />
            ) : (
              <Send className="h-4 w-4 me-2" />
            )}
            {submitButton}
          </Button>

          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground/70">
            {countdown > 0 ? (
              <span>
                {resendCodeIn || 'Resend code in'}{' '}
                <span className="font-mono font-bold text-primary">
                  {formatCountdown(countdown)}
                </span>
              </span>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={resendLoading}
                className="inline-flex items-center gap-1.5 text-primary font-semibold hover:text-primary/80 transition-colors disabled:opacity-50"
              >
                {resendLoading ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <RefreshCw className="h-3 w-3" />
                )}
                {resendCode || 'Resend code'}
              </button>
            )}
          </div>
        </form>
      );
    }

    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleResetPassword(email);
        }}
        className="space-y-4"
      >
        <div className="space-y-1.5">
          <div className="relative group/input">
            <Input
              type="email"
              placeholder={emailPlaceholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              icon={Mail}
            />
          </div>
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-md p-2">
            <p className="text-[11px] text-destructive text-center font-medium">
              {error}
            </p>
          </div>
        )}

        <Button
          type="submit"
          className="w-full h-10 text-sm font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all active:scale-[0.98]"
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin me-2" />
          ) : (
            <Send className="h-4 w-4 me-2" />
          )}
          {submitButton}
        </Button>
      </form>
    );
  };

  const getHeaderInfo = () => {
    if (step === 'success') {
      return {
        icon: <CheckCircle2 className="h-7 w-7 text-primary" />,
        title: successTitle || 'Success',
        description: '',
      };
    }
    if (step === 'token') {
      return {
        icon: <Lock className="h-7 w-7 text-primary" />,
        title: tokenTitle || 'Verify Code',
        description:
          tokenSubtitle || 'Enter the 6-digit code sent to your email',
      };
    }
    return {
      icon: <Send className="h-7 w-7 text-primary" />,
      title: title,
      description: subtitle,
    };
  };

  const headerInfo = getHeaderInfo();

  return (
    <Card className="w-full mx-auto h-full backdrop-blur-xl text-muted-foreground overflow-hidden relative group border-0 shadow-none flex flex-col justify-center items-center shrink-0 grow">
      <CardHeader className="w-full max-w-lg text-center space-y-2 pb-6 pt-8">
        <div className="mx-auto w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-1 rotate-3 group-hover:rotate-6 transition-transform">
          {headerInfo.icon}
        </div>
        <TypographyH1 className="text-2xl lg:text-3xl font-bold tracking-tight bg-linear-to-br from-foreground to-foreground/70 bg-clip-text text-transparent border-none">
          {headerInfo.title}
        </TypographyH1>
        <CardDescription className="text-sm text-muted-foreground/80">
          {headerInfo.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="w-full max-w-lg pb-4">
        {renderContent()}
      </CardContent>

      <CardFooter className="w-full max-w-lg flex flex-col text-center text-sm gap-4 pt-2 pb-6">
        <div className="relative w-full px-4">
          <div className="absolute inset-0 flex items-center px-4">
            <span className="w-full border-t border-muted-foreground/10" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase">
            <span className="bg-background px-2 text-muted-foreground/50">
              {backToLogin}
            </span>
          </div>
        </div>

        <div>
          <Link
            href="/login"
            className="text-primary font-bold hover:text-primary/80 transition-colors inline-flex items-center gap-1 group/link text-sm"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover/link:-translate-x-1 rtl:rotate-180 rtl:group-hover/link:translate-x-1" />
            {backToLogin}
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
