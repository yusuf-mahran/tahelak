'use client';

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  CreditCard,
  Wallet,
  Landmark,
  Lock,
  CheckCircle2,
  ChevronRight,
  BadgeCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useRegistration } from '@/hooks/auth/useRegistration';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/useToast';

export default function PaymentPage() {
  const [method, setMethod] = useState<'card' | 'wallet' | 'bank'>('card');
  const { handleSignUp, registrationData, localDataLoaded } = useRegistration();
  const { localeData, locale } = useLanguage();
  const router = useRouter();
  const { showToast } = useToast();

  const isAr = locale === 'ar';

  const selectedPlan = registrationData?.subscriptionPlan;
  const planInfo = localeData?.landingData.plans.find(
    (p) => p.id === selectedPlan?.id,
  );

  useEffect(() => {
    if (!localDataLoaded) return;
    if (
      !registrationData?.email ||
      !registrationData?.password ||
      !registrationData?.name ||
      !registrationData?.orgName ||
      !registrationData?.orgAddress
    ) {
      router.push('/registration?error=true');
      return;
    }
    if (registrationData?.subscriptionPlan.id === '') {
      router.push('/registration/plans');
      showToast({
        title: isAr ? 'خطأ في التسجيل' : 'Registration Error',
        description: isAr
          ? 'يرجى اختيار باقة اشتراك قبل المتابعة.'
          : 'Please select a subscription plan before proceeding.',
        type: 'error',
      });
      return;
    }
  }, [registrationData, router, localDataLoaded, showToast, isAr]);

  return (
    <div className="grid gap-8 lg:grid-cols-5">
      <div className="lg:col-span-3 space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <button
            type="button"
            onClick={() => setMethod('card')}
            className={cn(
              'p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-3 font-bold text-sm',
              method === 'card'
                ? 'border-primary bg-primary/10 text-primary scale-105 shadow-md shadow-primary/10'
                : 'border-border bg-card text-muted-foreground hover:bg-accent/50',
            )}
          >
            <CreditCard className="h-6 w-6" />
            <span>{isAr ? 'بطاقة بنكية' : 'Bank Card'}</span>
          </button>
          <button
            type="button"
            onClick={() => setMethod('wallet')}
            className={cn(
              'p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-3 font-bold text-sm',
              method === 'wallet'
                ? 'border-primary bg-primary/10 text-primary scale-105 shadow-md shadow-primary/10'
                : 'border-border bg-card text-muted-foreground hover:bg-accent/50',
            )}
          >
            <Wallet className="h-6 w-6" />
            <span>{isAr ? 'محفظة إلكترونية' : 'E-Wallet'}</span>
          </button>
          <button
            type="button"
            onClick={() => setMethod('bank')}
            className={cn(
              'p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-3 font-bold text-sm',
              method === 'bank'
                ? 'border-primary bg-primary/10 text-primary scale-105 shadow-md shadow-primary/10'
                : 'border-border bg-card text-muted-foreground hover:bg-accent/50',
            )}
          >
            <Landmark className="h-6 w-6" />
            <span>{isAr ? 'تحويل بنكي' : 'Bank Transfer'}</span>
          </button>
        </div>

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-foreground">
              {isAr ? 'تفاصيل الدفع' : 'Payment Details'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {method === 'card' && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Input placeholder={isAr ? 'رقم البطاقة' : 'Card Number'} />
                </div>
                <div className="grid grid-cols-6 gap-4">
                  <div className="space-y-2 col-span-2">
                    <Input placeholder="CVV" />
                  </div>
                  <div className="space-y-2 col-span-4">
                    <Input
                      placeholder={
                        isAr
                          ? 'تاريخ الانتهاء (شهر/سنة)'
                          : 'Expiry Date (MM/YY)'
                      }
                    />
                  </div>
                </div>
              </div>
            )}
            {method === 'wallet' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Input
                    placeholder={
                      isAr
                        ? 'رقم الهاتف المرتبط بالمحفظة'
                        : 'Phone Number Connected to Wallet'
                    }
                  />
                </div>
              </div>
            )}
            {method === 'bank' && (
              <div
                className={cn(
                  'p-4 bg-muted/50 rounded-xl border border-border space-y-2 text-start',
                )}
              >
                <p className="text-sm font-bold text-foreground">
                  {isAr ? 'رقم الحساب' : 'Account Number'}: 1234567890
                </p>
                <p className="text-sm font-bold text-foreground">
                  IBAN: EG12345678901234567890
                </p>
                <p className="text-xs text-muted-foreground">
                  {isAr
                    ? 'يرجى إرسال صورة التحويل عبر البريد الإلكتروني بعد إتمامه.'
                    : 'Please send a copy of the transfer via email after completion.'}
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button
              variant="default"
              className="w-full text-lg font-bold py-6 rounded-xl shadow-lg shadow-primary/20"
              onClick={handleSignUp}
            >
              <div className="flex items-center gap-2">
                {isAr ? 'إتمام الدفع واشتراك' : 'Complete Payment & Subscribe'}
                <ChevronRight
                  className={cn('h-5 w-5', isAr ? 'rotate-180' : '')}
                />
              </div>
            </Button>
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground font-medium">
              <Lock className="h-3 w-3" />
              <span>
                {isAr
                  ? 'دفعاتك محمية ومشفرة بمعايير أمان عالمية'
                  : 'Your payments are protected and encrypted with global security standards'}
              </span>
            </div>
          </CardFooter>
        </Card>
      </div>

      <div className="lg:col-span-2">
        <Card className=" bg-background text-muted-foreground border border-border shadow-xl overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl -translate-y-1/2 translate-x-1/2 rounded-full" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/10 blur-2xl translate-y-1/2 -translate-x-1/2 rounded-full" />

          <CardHeader className="relative">
            <CardTitle
              className={cn('text-xl font-bold flex items-center gap-3')}
            >
              <BadgeCheck className="h-6 w-6" />
              {isAr ? 'ملخص الطلب' : 'Order Summary'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 relative">
            <div className={cn('flex justify-between items-center')}>
              <span className="text-sm">
                {planInfo?.name || (isAr ? 'الباقة المختارة' : 'Selected Plan')}
              </span>
              <span className="font-bold">
                ${planInfo?.price || selectedPlan?.price || '0.00'}
              </span>
            </div>
            <div className={cn('flex justify-between items-center')}>
              <span className="text-sm">{isAr ? 'دورة الدفع' : 'Billing'}</span>
              <span className="font-bold">{isAr ? 'سنوياً' : 'Annually'}</span>
            </div>
            <div className="h-px bg-muted-foreground/20" />
            <div className={cn('flex justify-between items-center')}>
              <span className="font-bold">{isAr ? 'الإجمالي' : 'Total'}</span>
              <span className="text-2xl font-black text-surface">
                ${planInfo?.price || selectedPlan?.price || '0.00'}
              </span>
            </div>

            <div className="space-y-3 mt-8">
              {planInfo?.features.map((feature, idx) => (
                <div
                  key={idx}
                  className={cn('flex items-center gap-3 text-xs font-medium')}
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>{feature}</span>
                </div>
              ))}
              {!planInfo && (
                <>
                  <div
                    className={cn(
                      'flex items-center gap-3 text-xs font-medium',
                    )}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>
                      {isAr
                        ? 'تنشيط فوري للحساب'
                        : 'Instant Account Activation'}
                    </span>
                  </div>
                  <div
                    className={cn(
                      'flex items-center gap-3 text-xs font-medium',
                    )}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>
                      {isAr ? 'دعم فني 24/7' : '24/7 Technical Support'}
                    </span>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
