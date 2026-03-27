'use client';

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { TypographyH2 } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  CreditCard,
  Wallet,
  Landmark,
  Lock,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import Link from 'next/link';

export default function PaymentPage() {
  const [method, setMethod] = useState<'card' | 'wallet' | 'bank'>('card');

  return (
    <div className="space-y-8 text-right">
      <div className="space-y-2">
        <TypographyH2 className="border-none pb-0 text-3xl font-bold">
          آليات الدفع
        </TypographyH2>
        <p className="text-slate-500 font-medium">
          اختر طريقة الدفع المناسبة لك لإتمام عملية الاشتراك
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3 space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <button
              onClick={() => setMethod('card')}
              className={cn(
                'p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-3 font-bold text-sm',
                method === 'card'
                  ? 'border-primary bg-primary/5 text-primary scale-105 shadow-md shadow-primary/10'
                  : 'border-slate-100 bg-white text-slate-400 opacity-60 hover:opacity-100',
              )}
            >
              <CreditCard className="h-6 w-6" />
              <span>بطاقة بنكية</span>
            </button>
            <button
              onClick={() => setMethod('wallet')}
              className={cn(
                'p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-3 font-bold text-sm',
                method === 'wallet'
                  ? 'border-primary bg-primary/5 text-primary scale-105 shadow-md shadow-primary/10'
                  : 'border-slate-100 bg-white text-slate-400 opacity-60 hover:opacity-100',
              )}
            >
              <Wallet className="h-6 w-6" />
              <span>محفظة إلكترونية</span>
            </button>
            <button
              onClick={() => setMethod('bank')}
              className={cn(
                'p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-3 font-bold text-sm',
                method === 'bank'
                  ? 'border-primary bg-primary/5 text-primary scale-105 shadow-md shadow-primary/10'
                  : 'border-slate-100 bg-white text-slate-400 opacity-60 hover:opacity-100',
              )}
            >
              <Landmark className="h-6 w-6" />
              <span>تحويل بنكي</span>
            </button>
          </div>

          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-xl font-bold">تفاصيل الدفع</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {method === 'card' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-600">
                      رقم البطاقة
                    </label>
                    <Input
                      placeholder="0000 0000 0000 0000"
                      className="text-right font-mono tracking-widest"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-600">
                        CVV
                      </label>
                      <Input
                        placeholder="***"
                        className="text-right font-mono"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-600">
                        تاريخ الانتهاء
                      </label>
                      <Input
                        placeholder="MM/YY"
                        className="text-right font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}
              {method === 'wallet' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-600">
                      رقم الهاتف المرتبط بالمحفظة
                    </label>
                    <Input
                      placeholder="01XXXXXXXXX"
                      className="text-right font-mono"
                    />
                  </div>
                </div>
              )}
              {method === 'bank' && (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <p className="text-sm font-bold">رقم الحساب: 1234567890</p>
                  <p className="text-sm font-bold">
                    IBAN: EG12345678901234567890
                  </p>
                  <p className="text-xs text-slate-500">
                    يرجى إرسال صورة التحويل عبر البريد الإلكتروني بعد إتمامه.
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button
                className="w-full text-lg font-bold py-6 rounded-xl shadow-lg shadow-primary/20"
                asChild
              >
                <Link href="/dashboard">
                  إتمام الدفع واشتراك
                  <ChevronRight className="mr-2 h-5 w-5" />
                </Link>
              </Button>
              <div className="flex items-center justify-center gap-2 text-xs text-slate-400 font-medium">
                <Lock className="h-3 w-3" />
                <span>دفعاتك محمية ومشفرة بمعايير أمان عالمية</span>
              </div>
            </CardFooter>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card className="bg-slate-900 text-white border-0 shadow-xl overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl -translate-y-1/2 translate-x-1/2 rounded-full" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/10 blur-2xl translate-y-1/2 -translate-x-1/2 rounded-full" />

            <CardHeader className="relative">
              <CardTitle className="text-xl font-bold flex items-center gap-3">
                <BadgeCheck className="h-6 w-6 text-emerald-400" />
                ملخص الطلب
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 relative">
              <div className="flex justify-between items-center text-slate-400">
                <span className="text-sm">الباقة الاحترافية</span>
                <span className="font-bold text-white">$249.00</span>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span className="text-sm">دقة الدفع</span>
                <span className="font-bold text-white">سنوياً</span>
              </div>
              <div className="h-px bg-slate-800" />
              <div className="flex justify-between items-center">
                <span className="font-bold">الإجمالي</span>
                <span className="text-2xl font-black text-primary">
                  $249.00
                </span>
              </div>

              <div className="space-y-3 mt-8">
                <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span>تنشيط فوري للحساب</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span>دعم فني 24/7</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

import { BadgeCheck } from 'lucide-react';
