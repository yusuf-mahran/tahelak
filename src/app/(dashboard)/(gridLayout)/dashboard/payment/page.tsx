'use client';

import { Shield, Zap, BadgeCheck } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useDashboardDataContext } from '@/context/DashboardDataContext';
import { useToast } from '@/hooks/useToast';
import { PlanCard, type Plan } from '@/components/shared/PlanCard';
import CardContainer from '@/components/shared/CardContainer';
import {
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { ShieldCheck, Calendar, Zap as ZapIcon, Crown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { TypographyP } from '@/components/ui/typography';
import type { LucideIcon } from 'lucide-react';

const PLAN_ICONS: LucideIcon[] = [Shield, Zap, BadgeCheck];

const STRINGS = {
  en: {
    pageTitle: 'Change Your Plan',
    pageSubtitle: "Select the plan that best fits your team's needs",
    currentPlan: 'Current Plan',
    active: 'Active',
    free: 'Free',
    security: 'Security',
    securityValue: 'Enterprise Grade',
    renewal: 'Renewal',
    currentBtn: 'Current Plan',
    upgradeBtn: 'Upgrade',
    downgradeBtn: 'Downgrade',
    mostPopular: 'Most Popular',
    priceInterval: '/year',
    updatedTitle: 'Plan Updated',
    updatedDesc: (name: string) => `Successfully switched to ${name}.`,
    failTitle: 'Update Failed',
    failDesc: 'There was an error updating your subscription.',
    naDate: 'N/A',
    noplan: 'No Plan',
  },
  ar: {
    pageTitle: 'تغيير خطتك',
    pageSubtitle: 'اختر الخطة الأنسب لاحتياجات فريقك',
    currentPlan: 'الخطة الحالية',
    active: 'نشط',
    free: 'مجاني',
    security: 'الأمان',
    securityValue: 'مستوى مؤسسي',
    renewal: 'التجديد',
    currentBtn: 'الخطة الحالية',
    upgradeBtn: 'ترقية',
    downgradeBtn: 'تخفيض',
    mostPopular: 'الأكثر اشتراكاً',
    priceInterval: '/سنوياً',
    updatedTitle: 'تم تحديث الخطة',
    updatedDesc: (name: string) => `تم التبديل بنجاح إلى ${name}.`,
    failTitle: 'فشل التحديث',
    failDesc: 'حدث خطأ أثناء تحديث الاشتراك.',
    naDate: 'غير محدد',
    noplan: 'لا توجد خطة',
  },
} as const;

type Subscription = { id: string; expires_at?: string };

export default function PaymentPage() {
  const { localeData, locale } = useLanguage();
  const { organization, updateOrganization } = useDashboardDataContext();
  const { showToast } = useToast();

  if (!localeData || !organization) return null;

  const s = STRINGS[locale] ?? STRINGS.en;
  const plans: Plan[] = localeData.landingData.plans ?? [];

  const subscription = (organization.subscription ??
    null) as Subscription | null;

  // Always resolve display data from locale plans by id
  const currentPlan = subscription?.id
    ? (plans.find((p) => p.id === subscription.id) ?? null)
    : null;

  const currentPlanId = currentPlan?.id ?? null;
  const currentPlanPrice = currentPlan?.price ?? 0;
  const currentPlanName = currentPlan?.name ?? s.noplan;
  const expiresAt = subscription?.expires_at
    ? new Date(subscription.expires_at).toLocaleDateString(
        locale === 'ar' ? 'ar-EG' : 'en-US',
      )
    : s.naDate;

  const handleUpdatePlan = async (plan: Plan) => {
    const expirationDate = new Date();
    expirationDate.setFullYear(expirationDate.getFullYear() + 1);

    const result = await updateOrganization(organization.id, {
      subscription: {
        id: plan.id,
        expires_at: expirationDate.toISOString(),
      },
    });

    if (result) {
      showToast({
        title: s.updatedTitle,
        description: s.updatedDesc(plan.name),
        type: 'success',
      });
    } else {
      showToast({ title: s.failTitle, description: s.failDesc, type: 'error' });
    }
  };

  const getButtonLabel = (plan: Plan): string => {
    if (plan.id === currentPlanId) return s.currentBtn;
    return plan.price > currentPlanPrice ? s.upgradeBtn : s.downgradeBtn;
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Current plan summary banner */}
      <CardContainer className="border-none shadow-sm">
        <div className="absolute top-3 end-3">
          <Crown
            className={`h-6 w-6 ${
              currentPlan
                ? 'text-yellow-500 fill-yellow-500 animate-pulse'
                : 'text-muted-foreground/20'
            }`}
          />
        </div>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-primary/10 shrink-0">
              <ZapIcon className="h-4 w-4 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold">{s.pageTitle}</CardTitle>
              <CardDescription className="text-xs">
                {s.pageSubtitle}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50 border border-primary/10">
              <TypographyP className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                {s.currentPlan}
              </TypographyP>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-extrabold text-primary font-tomorrow">
                  {currentPlanName}
                </span>
                <Badge
                  variant={currentPlan ? 'default' : 'secondary'}
                  className="uppercase text-[9px] px-1.5 py-0"
                >
                  {currentPlan ? s.active : s.free}
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 rounded-xl bg-muted/50 border border-border/50">
              <ShieldCheck className="h-4 w-4 text-green-500 shrink-0" />
              <div className="min-w-0">
                <TypographyP className="text-[9px] text-muted-foreground uppercase tracking-wide font-semibold">
                  {s.security}
                </TypographyP>
                <TypographyP className="text-xs font-bold truncate">
                  {s.securityValue}
                </TypographyP>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 rounded-xl bg-muted/50 border border-border/50">
              <Calendar className="h-4 w-4 text-blue-500 shrink-0" />
              <div className="min-w-0">
                <TypographyP className="text-[9px] text-muted-foreground uppercase tracking-wide font-semibold">
                  {s.renewal}
                </TypographyP>
                <TypographyP className="text-xs font-bold truncate">
                  {expiresAt}
                </TypographyP>
              </div>
            </div>
          </div>
        </CardContent>
      </CardContainer>

      {/* Plan grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {plans.map((plan, i) => {
          const isCurrent = plan.id === currentPlanId;
          return (
            <PlanCard
              key={plan.id}
              plan={plan}
              icon={PLAN_ICONS[i]}
              isSelected={isCurrent}
              buttonLabel={getButtonLabel(plan)}
              buttonVariant={
                isCurrent
                  ? 'outline'
                  : plan.price > currentPlanPrice
                    ? 'default'
                    : 'ghost'
              }
              buttonDisabled={isCurrent}
              onButtonClick={() => handleUpdatePlan(plan)}
              popularLabel={s.mostPopular}
              priceInterval={s.priceInterval}
            />
          );
        })}
      </div>
    </div>
  );
}
