'use client';

import { ShieldCheck, Calendar, Zap, Crown, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useDashboardDataContext } from '@/context/DashboardDataContext';
import CardContainer from '@/components/shared/CardContainer';
import {
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TypographyP } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';
import type { Plan } from '@/components/shared/PlanCard';

const STRINGS = {
  en: {
    statusTitle: 'Subscription Status',
    statusSubtitle: "Your organization's current billing",
    currentPlan: 'Current Plan',
    active: 'Active',
    basic: 'Free',
    security: 'Security',
    securityValue: 'Enterprise Grade',
    renewal: 'Renewal',
    changePlan: 'Change Plan',
    naDate: 'N/A',
    noplan: 'No Plan',
  },
  ar: {
    statusTitle: 'حالة الاشتراك',
    statusSubtitle: 'الفواتير الحالية لمؤسستك',
    currentPlan: 'الخطة الحالية',
    active: 'نشط',
    basic: 'مجاني',
    security: 'الأمان',
    securityValue: 'مستوى مؤسسي',
    renewal: 'التجديد',
    changePlan: 'تغيير الخطة',
    naDate: 'غير محدد',
    noplan: 'لا توجد خطة',
  },
} as const;

type Subscription = { id: string; expires_at?: string };

export function SubscriptionPlan() {
  const { localeData, locale } = useLanguage();
  const { organization } = useDashboardDataContext();

  if (!localeData || !organization) return null;

  const s = STRINGS[locale] ?? STRINGS.en;

  const subscription = (organization.subscription ??
    null) as Subscription | null;

  // Always resolve display data from locale plans by id
  const plans: Plan[] = localeData.landingData.plans ?? [];
  const currentPlan = subscription?.id
    ? (plans.find((p) => p.id === subscription.id) ?? null)
    : null;

  const currentPlanName = currentPlan?.name ?? s.noplan;
  const currentPlanPrice = currentPlan?.price ?? null;
  const expiresAt = subscription?.expires_at
    ? new Date(subscription.expires_at).toLocaleDateString(
        locale === 'ar' ? 'ar-EG' : 'en-US',
      )
    : s.naDate;

  return (
    <CardContainer className="flex flex-col h-full">
      <div className="absolute top-3 end-3">
        <Crown
          className={`h-6 w-6 transition-colors ${
            currentPlan
              ? 'text-yellow-500 fill-yellow-500 animate-pulse'
              : 'text-muted-foreground/20'
          }`}
        />
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-primary/10 shrink-0">
            <Zap className="h-4 w-4 text-primary" />
          </div>
          <div>
            <CardTitle className="text-base font-bold leading-tight">
              {s.statusTitle}
            </CardTitle>
            <CardDescription className="text-xs">
              {s.statusSubtitle}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-3 flex-1">
        {/* Current plan tile */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50 border border-primary/10">
          <TypographyP className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest shrink-0">
            {s.currentPlan}
          </TypographyP>
          <div className="flex items-center gap-1.5 min-w-0 justify-end">
            <span className="text-sm font-extrabold text-primary font-tomorrow truncate">
              {currentPlanName}
            </span>
            {currentPlanPrice !== null && (
              <span className="text-xs text-muted-foreground shrink-0">
                ${currentPlanPrice}
              </span>
            )}
            <Badge
              variant={currentPlan ? 'default' : 'secondary'}
              className="uppercase text-[9px] px-1.5 py-0 shrink-0"
            >
              {currentPlan ? s.active : s.basic}
            </Badge>
          </div>
        </div>

        {/* Info row */}
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-muted/50 border border-border/50">
            <ShieldCheck className="h-3.5 w-3.5 text-green-500 shrink-0" />
            <div className="min-w-0">
              <TypographyP className="text-[9px] text-muted-foreground uppercase tracking-wide font-semibold truncate">
                {s.security}
              </TypographyP>
              <TypographyP className="text-[10px] font-bold truncate">
                {s.securityValue}
              </TypographyP>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-muted/50 border border-border/50">
            <Calendar className="h-3.5 w-3.5 text-blue-500 shrink-0" />
            <div className="min-w-0">
              <TypographyP className="text-[9px] text-muted-foreground uppercase tracking-wide font-semibold truncate">
                {s.renewal}
              </TypographyP>
              <TypographyP className="text-[10px] font-bold truncate">
                {expiresAt}
              </TypographyP>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-auto pt-1">
          <Button href="/dashboard/payment" className="w-full group rounded-xl">
            {s.changePlan}
            <ArrowRight className="ms-2 h-4 w-4 transition-transform group-hover:translate-x-1 rtl:rotate-180" />
          </Button>
        </div>
      </CardContent>
    </CardContainer>
  );
}
