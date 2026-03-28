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
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

export default function PaymentPage() {
  const [method, setMethod] = useState<'card' | 'wallet' | 'bank'>('card');
  const { signUp, registrationData } = useAuth();
  const { localeData, locale } = useLanguage();

  const isAr = locale === 'ar';

  const selectedPlan = registrationData?.selectedPlan;
  const planInfo = localeData?.landingData.plans.find(
    (p) => p.stripeId === selectedPlan?.stripeId,
  );

  return (
    <div className="grid gap-8 lg:grid-cols-5">
      <div className="lg:col-span-3 space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <button
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
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted-foreground">
                    {isAr ? 'رقم البطاقة' : 'Card Number'}
                  </label>
                  <Input
                    placeholder="0000 0000 0000 0000"
                    className={cn(
                      'font-mono tracking-widest border-border bg-input text-start',
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-muted-foreground">
                      CVV
                    </label>
                    <Input
                      placeholder="***"
                      className={cn(
                        'font-mono border-border bg-input text-start',
                      )}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-muted-foreground">
                      {isAr ? 'تاريخ الانتهاء' : 'Expiry Date'}
                    </label>
                    <Input
                      placeholder="MM/YY"
                      className={cn(
                        'font-mono border-border bg-input text-start',
                      )}
                    />
                  </div>
                </div>
              </div>
            )}
            {method === 'wallet' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted-foreground">
                    {isAr
                      ? 'رقم الهاتف المرتبط بالمحفظة'
                      : 'Wallet Phone Number'}
                  </label>
                  <Input
                    placeholder="01XXXXXXXXX"
                    className={cn(
                      'font-mono border-border bg-input text-start',
                    )}
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
              onClick={signUp}
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
              className={cn(
                'text-xl font-bold flex items-center gap-3',
              )}
            >
              <BadgeCheck className="h-6 w-6" />
              {isAr ? 'ملخص الطلب' : 'Order Summary'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 relative">
            <div
              className={cn(
                'flex justify-between items-center',
              )}
            >
              <span className="text-sm">
                {planInfo?.name || (isAr ? 'الباقة المختارة' : 'Selected Plan')}
              </span>
              <span className="font-bold">
                ${planInfo?.price || selectedPlan?.price || '0.00'}
              </span>
            </div>
            <div
              className={cn(
                'flex justify-between items-center',
              )}
            >
              <span className="text-sm">{isAr ? 'دورة الدفع' : 'Billing'}</span>
              <span className="font-bold">{isAr ? 'سنوياً' : 'Annually'}</span>
            </div>
            <div className="h-px bg-muted-foreground/20" />
            <div
              className={cn(
                'flex justify-between items-center',
              )}
            >
              <span className="font-bold">{isAr ? 'الإجمالي' : 'Total'}</span>
              <span className="text-2xl font-black text-surface">
                ${planInfo?.price || selectedPlan?.price || '0.00'}
              </span>
            </div>

            <div className="space-y-3 mt-8">
              {planInfo?.features.map((feature, idx) => (
                <div
                  key={idx}
                  className={cn(
                    'flex items-center gap-3 text-xs font-medium',
                  )}
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
