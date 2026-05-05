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
import { Mail, Lock, LogIn, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useLogin } from '@/hooks/auth/useLogin';
import { useLanguage } from '@/context/LanguageContext';
import React from 'react';

export default function LoginCard() {
  const { localeData } = useLanguage();
  const {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    error,
    handleLogin,
  } = useLogin();

  const {
    title,
    subtitle,
    noAccount,
    registerLink,
    terms,
    emailPlaceholder,
    passwordPlaceholder,
    forgotPassword,
    submitButton,
  } = localeData?.auth.login || {};

  return (
    <Card className="w-full mx-auto h-full backdrop-blur-xl text-muted-foreground overflow-hidden relative group border-0 shadow-none flex flex-col justify-center items-center shrink-0 grow">
      <CardHeader className="w-full max-w-lg text-center space-y-2 pb-6 pt-8">
        <div className="mx-auto w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-1 rotate-3 group-hover:rotate-6 transition-transform">
          <LogIn className="h-7 w-7 text-primary" />
        </div>
        <TypographyH1 className="text-2xl lg:text-3xl font-bold tracking-tight bg-linear-to-br from-foreground to-foreground/70 bg-clip-text text-transparent border-none">
          {title}
        </TypographyH1>
        <CardDescription className="text-sm text-muted-foreground/80">
          {subtitle}
        </CardDescription>
      </CardHeader>

      <CardContent className="w-full max-w-lg pb-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin(email, password);
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

          <div className="space-y-1.5">
            <div className="relative group/input">
              <Input
                type="password"
                placeholder={passwordPlaceholder}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                icon={Lock}
                showPasswordToggle
              />
            </div>
            <div className="flex justify-end pr-1">
              <Link
                href="/login/forgot-password"
                className="text-[11px] text-primary hover:text-primary/80 transition-colors font-medium"
              >
                {forgotPassword}
              </Link>
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
              <LogIn className="h-4 w-4 me-2" />
            )}
            {submitButton}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="w-full max-w-lg flex flex-col text-center text-sm gap-4 pt-2 pb-6">
        <div className="relative w-full px-4">
          <div className="absolute inset-0 flex items-center px-4">
            <span className="w-full border-t border-muted-foreground/10" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase">
            <span className="bg-background px-2 text-muted-foreground/50">
              {noAccount?.split('?')[0]}?
            </span>
          </div>
        </div>

        <div>
          <Link
            href="/registration"
            className="text-primary font-bold hover:text-primary/80 transition-colors inline-flex items-center gap-1 group/link text-sm"
          >
            {registerLink}
            <span className="transition-transform group-hover/link:translate-x-1 rtl:group-hover/link:-translate-x-1">
              →
            </span>
          </Link>
        </div>
        <p className="text-[10px] text-muted-foreground/40 max-w-62.5 mx-auto leading-relaxed italic px-4">
          {terms}
        </p>
      </CardFooter>
    </Card>
  );
}
