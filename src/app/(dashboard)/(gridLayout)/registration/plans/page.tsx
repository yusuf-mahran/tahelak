'use client';

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Shield, BadgeCheck, Zap } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const planIcons = [Shield, Zap, BadgeCheck];

export default function SubscriptionPage() {
  const { localeData, locale } = useLanguage();
  const { registrationData, syncRegistrationData } = useAuth();
  const plans = localeData?.landingData?.plans || [];

  const handleSelectPlan = (id: string) => {
    syncRegistrationData({
      selectedPlan: {
        stripeId: id,
        price: plans.find((p) => p.stripeId === id)?.price || '0',
      },
    });
  };

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {plans.map((plan: (typeof plans)[0], i: number) => {
        const Icon = planIcons[i] || Shield;
        const isSelected =
          registrationData?.selectedPlan?.stripeId === plan.stripeId;

        return (
          <Card
            key={i}
            onClick={() => handleSelectPlan(plan.stripeId)}
            className={cn(
              'relative flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer',
              isSelected
                ? 'border-primary ring-2 ring-primary scale-105'
                : 'border-slate-200',
            )}
          >
            {plan.popular && (
              <div className="grow text-center absolute top-0 left-1/2 -translate-y-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
                {locale === 'ar' ? 'الأكثر اشتراكاً' : 'Most Popular'}
              </div>
            )}

            <CardHeader>
              <div
                className={cn(
                  'w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:rotate-6',
                  plan.popular || isSelected
                    ? 'bg-primary text-white shadow-md shadow-primary/20'
                    : 'bg-slate-100 text-slate-500',
                )}
              >
                <Icon className="h-6 w-6" />
              </div>
              <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>

            <CardContent className="flex-1 space-y-6">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-slate-900">
                  ${plan.price}
                </span>
                <span className="text-sm text-slate-500 font-medium">
                  {locale === 'ar' ? '/ سنوياً' : '/ Year'}
                </span>
              </div>

              <ul className="space-y-3">
                {plan.features.map((feature: string, j: number) => (
                  <li
                    key={j}
                    className="flex items-center gap-3 text-sm text-slate-600 font-medium"
                  >
                    <div
                      className={cn(
                        'h-5 w-5 rounded-full flex items-center justify-center shrink-0',
                        plan.popular || isSelected
                          ? 'bg-emerald-100 text-emerald-600'
                          : 'bg-slate-100 text-slate-400',
                      )}
                    >
                      <Check className="h-3 w-3 stroke-3" />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>

            <CardFooter>
              <Button
                variant="default"
                className={cn(
                  'w-full text-base font-bold py-6 rounded-xl',
                  !isSelected &&
                    'bg-slate-200 text-slate-800 hover:bg-slate-300',
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectPlan(plan.stripeId);
                }}
              >
                <Link href="/registration/payment" className="w-full">
                  {locale === 'ar' ? 'اختيار الخطة' : 'Select Plan'}
                </Link>
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
