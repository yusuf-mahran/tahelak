import { TypographyH1 } from '@/components/ui/typography';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Stethoscope, Users, UserCog, Activity } from 'lucide-react';

export default async function DashboardPage() {
  const stats = [
    {
      title: 'إجمالي الأطباء',
      value: '12',
      icon: Stethoscope,
      color: 'text-blue-600',
      bg: 'bg-blue-100',
    },
    {
      title: 'إجمالي المسئولين',
      value: '4',
      icon: UserCog,
      color: 'text-amber-600',
      bg: 'bg-amber-100',
    },
    {
      title: 'إجمالي المرضى',
      value: '145',
      icon: Users,
      color: 'text-emerald-600',
      bg: 'bg-emerald-100',
    },
    {
      title: 'العمليات النشطة',
      value: '28',
      icon: Activity,
      color: 'text-rose-600',
      bg: 'bg-rose-100',
    },
  ];

  return (
    <div className="space-y-8 text-right" dir="rtl">
      <div>
        <TypographyH1 className="text-3xl font-bold tracking-tight">
          نظرة عامة على لوحة التحكم
        </TypographyH1>
        <p className="text-muted-foreground mt-2">
          متابعة الأداء وإدارة العمليات في مؤسستك.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Card
            key={i}
            className="hover:shadow-md transition-shadow cursor-default group border-slate-200"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div
                className={`${stat.bg} ${stat.color} p-2 rounded-lg group-hover:scale-110 transition-transform`}
              >
                <stat.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                +12% منذ الشهر الماضي
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-1 md:col-span-4 shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle>تحليلات العمليات</CardTitle>
            <CardDescription>
              عرض تفصيلي للنشاط خلال الأسبوع الحالي
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
              <span className="text-slate-400 font-medium italic">
                سيتم ربط هذا القسم بالبيانات الحقيقية قريباً
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 md:col-span-3 shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle>آخر النشاطات</CardTitle>
            <CardDescription>العمليات التي تم تنفيذها مؤخراً</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100"
                >
                  <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                    <Users className="h-5 w-5 text-slate-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate leading-none">
                      إضافة مريض جديد
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      منذ 10 دقائق بواسطة المسئول
                    </p>
                  </div>
                  <div className="text-xs font-medium text-slate-400">
                    09:42
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
