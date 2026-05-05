'use client';

import { CalendarClock, Clock, MapPin, User } from 'lucide-react';
import {
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import CardContainer from '@/components/shared/CardContainer';
import { useLanguage } from '@/context/LanguageContext';

// ─── Types ────────────────────────────────────────────────────────────────────
// Replace with real DB row type once appointments table is created.
export interface Appointment {
  id: string;
  patientName: string;
  doctorName?: string;
  date: string; // ISO
  time: string; // e.g. "10:00 AM"
  location?: string;
  status: 'upcoming' | 'completed' | 'cancelled';
}

const STRINGS = {
  en: {
    title: 'Upcoming Appointments',
    subtitle: 'Your scheduled sessions',
    empty: 'No upcoming appointments',
    emptyDesc:
      'Appointments will appear here once the appointments table is connected.',
    upcoming: 'Upcoming',
    completed: 'Completed',
    cancelled: 'Cancelled',
  },
  ar: {
    title: 'المواعيد القادمة',
    subtitle: 'جلساتك المجدولة',
    empty: 'لا توجد مواعيد قادمة',
    emptyDesc: 'ستظهر المواعيد هنا بمجرد ربط جدول المواعيد.',
    upcoming: 'قادم',
    completed: 'مكتمل',
    cancelled: 'ملغى',
  },
} as const;

const statusStyle: Record<Appointment['status'], string> = {
  upcoming: 'bg-primary/10 text-primary',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-destructive/10 text-destructive',
};

interface AppointmentCardProps {
  appointments?: Appointment[];
  /** Show doctor name column instead of patient name (patient view) */
  showDoctor?: boolean;
}

export function AppointmentCard({
  appointments = [],
  showDoctor = false,
}: AppointmentCardProps) {
  const { locale } = useLanguage();
  const s = STRINGS[locale as keyof typeof STRINGS] ?? STRINGS.en;

  return (
    <CardContainer>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-primary/10 shrink-0">
            <CalendarClock className="h-4 w-4 text-primary" />
          </div>
          <div>
            <CardTitle className="text-base font-semibold">{s.title}</CardTitle>
            <CardDescription className="text-xs">{s.subtitle}</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {appointments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 gap-2 text-center">
            <CalendarClock className="h-10 w-10 text-muted-foreground/20" />
            <p className="text-sm font-medium text-muted-foreground">
              {s.empty}
            </p>
            <p className="text-xs text-muted-foreground/60 max-w-52">
              {s.emptyDesc}
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-border/50">
            {appointments.map((appt) => (
              <li
                key={appt.id}
                className="flex items-start gap-3 py-3 first:pt-0 last:pb-0"
              >
                {/* Date badge */}
                <div className="shrink-0 flex flex-col items-center justify-center w-10 h-10 rounded-xl bg-muted/50 border border-border/40 text-center">
                  <span className="text-[10px] font-bold text-primary uppercase leading-none">
                    {new Date(appt.date).toLocaleString(
                      locale === 'ar' ? 'ar-EG' : 'en-US',
                      { month: 'short' },
                    )}
                  </span>
                  <span className="text-sm font-extrabold leading-none">
                    {new Date(appt.date).getDate()}
                  </span>
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <User className="h-3 w-3 text-muted-foreground shrink-0" />
                    <span className="text-sm font-semibold truncate">
                      {showDoctor ? appt.doctorName : appt.patientName}
                    </span>
                    <span
                      className={`ms-auto text-[10px] font-bold uppercase rounded-full px-2 py-0.5 ${statusStyle[appt.status]}`}
                    >
                      {s[appt.status]}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-0.5 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {appt.time}
                    </span>
                    {appt.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {appt.location}
                      </span>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </CardContainer>
  );
}
