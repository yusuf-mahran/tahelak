'use client';

import { Shield, Zap, BadgeCheck } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useRegistration } from '@/hooks/auth/useRegistration';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/useToast';
import { useEffect } from 'react';
import { PlanCard, type Plan } from '@/components/shared/PlanCard';
import type { LucideIcon } from 'lucide-react';

const PLAN_ICONS: LucideIcon[] = [Shield, Zap, BadgeCheck];

export default function SubscriptionPage() {
  const { localeData, locale } = useLanguage();
  const { registrationData, syncRegistrationData, localDataLoaded } =
    useRegistration();
  const plans: Plan[] = localeData?.landingData?.plans ?? [];
  const router = useRouter();
  const { showToast } = useToast();

  const handleSelectPlan = (id: string) => {
    const plan = plans.find((p) => p.id === id);
    if (!plan) return;
    syncRegistrationData({
      subscriptionPlan: {
        id: plan.id,
        name: plan.name,
        price: plan.price,
        experies_at: new Date(
          new Date().setFullYear(new Date().getFullYear() + 1),
        ).toISOString(),
      },
    });
  };

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
    }
  }, [registrationData, router, localDataLoaded]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {plans.map((plan, i) => {
        const isSelected = registrationData?.subscriptionPlan?.id === plan.id;

        return (
          <PlanCard
            key={plan.id}
            plan={plan}
            icon={PLAN_ICONS[i]}
            isSelected={isSelected}
            buttonLabel={locale === 'ar' ? 'اختيار الخطة' : 'Select Plan'}
            buttonSize="lg"
            buttonDisabled={false}
            onCardClick={() => handleSelectPlan(plan.id)}
            onButtonClick={() => {
              handleSelectPlan(plan.id);
              router.push('/registration/payment');
              showToast({
                title:
                  localeData?.infoMessages?.registeration?.planShosen.title,
                description:
                  localeData?.infoMessages?.registeration?.planShosen
                    .description[0] +
                  plan.name +
                  localeData?.infoMessages?.registeration?.planShosen
                    .description[1] +
                  plan.price +
                  '$' +
                  localeData?.infoMessages?.registeration?.planShosen
                    .description[2],
                type: 'info',
              });
            }}
            popularLabel={locale === 'ar' ? 'الأكثر اشتراكاً' : 'Most Popular'}
            priceInterval={locale === 'ar' ? '/ سنوياً' : '/ Year'}
          />
        );
      })}
    </div>
  );
}
