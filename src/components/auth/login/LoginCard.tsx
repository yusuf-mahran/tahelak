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
import { useLogin } from '@/hooks/useLogin';
import { useLanguage } from '@/context/LanguageContext';

export default function LoginCard() {
  const { localeData } = useLanguage();
  const {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    error,
    handleSubmit,
  } = useLogin();

  const {
    title,
    subtitle,
    noAccount,
    registerLink,
    terms,
    emailPlaceholder,
    passwordPlaceholder,
    submitButton,
  } = localeData?.auth.login || {};

  return (
    <Card className="w-full max-w-md lg:scale-110 bg-background text-muted-foreground border border-border shadow-xl overflow-hidden relative">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl -translate-y-1/2 translate-x-1/2 rounded-full" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/10 blur-2xl translate-y-1/2 -translate-x-1/2 rounded-full" />

      <CardHeader className="text-center space-y-2">
        <TypographyH1 className="text-3xl lg:text-3xl border-none">
          {title}
        </TypographyH1>
        <CardDescription className="text-sm text-muted-foreground">
          {subtitle}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <div className="relative">
              <Mail className="absolute top-3 h-4 w-4 text-slate-400 start-3" />
              <Input
                type="email"
                placeholder={emailPlaceholder}
                className="ps-10"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="relative">
              <Lock className="absolute top-3 h-4 w-4 text-slate-400 start-3" />
              <Input
                type="password"
                placeholder={passwordPlaceholder}
                className="ps-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {error && (
            <p className="text-xs text-destructive text-start">{error}</p>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin me-2 mt-1" />
            ) : (
              <LogIn className="h-4 w-4 me-2 mt-1" />
            )}
            {submitButton}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col text-center text-sm gap-4 pt-0">
        <div className="text-sm text-slate-500">
          <p>
            {noAccount}{' '}
            <Link
              href="/registration"
              className="text-primary font-bold hover:underline"
            >
              {registerLink}
            </Link>
          </p>
        </div>
        <p className="text-xs text-muted-foreground">{terms}</p>
      </CardFooter>
    </Card>
  );
}
