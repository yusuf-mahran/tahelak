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
import { cn } from '@/lib/utils';
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
    isRtl,
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
    <Card className="w-full max-w-md border-slate-200 shadow-lg">
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
              <Mail
                className={cn(
                  'absolute top-3 h-4 w-4 text-slate-400',
                  isRtl ? 'right-3' : 'left-3',
                )}
              />
              <Input
                type="email"
                placeholder={emailPlaceholder}
                className={cn(isRtl ? 'pr-10 text-right' : 'pl-10 text-left')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="relative">
              <Lock
                className={cn(
                  'absolute top-3 h-4 w-4 text-slate-400',
                  isRtl ? 'right-3' : 'left-3',
                )}
              />
              <Input
                type="password"
                placeholder={passwordPlaceholder}
                className={cn(isRtl ? 'pr-10 text-right' : 'pl-10 text-left')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {error && (
            <p
              className={cn(
                'text-xs text-destructive',
                isRtl ? 'text-right' : 'text-left',
              )}
            >
              {error}
            </p>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <Loader2
                className={cn('h-4 w-4 animate-spin', isRtl ? 'ml-2' : 'mr-2')}
              />
            ) : (
              <LogIn className={cn('h-4 w-4', isRtl ? 'ml-2' : 'mr-2')} />
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
