'use client';

import {
  ClipboardList,
  Pill,
  Stethoscope,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import {
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import CardContainer from '@/components/shared/CardContainer';
import { useLanguage } from '@/context/LanguageContext';

// ─── Types ────────────────────────────────────────────────────────────────────
// Replace with real DB row types once history / medication tables are created.
export type HistoryEventType =
  | 'diagnosis'
  | 'medication'
  | 'procedure'
  | 'visit'
  | 'alert';

export interface HistoryEvent {
  id: string;
  type: HistoryEventType;
  title: string;
  description?: string;
  date: string; // ISO
  resolvedAt?: string; // ISO — if set, treated as resolved
}

const STRINGS = {
  en: {
    title: 'Medical History',
    subtitle: 'Chronological patient record',
    empty: 'No history recorded',
    emptyDesc:
      'Medical history will appear here once the history table is connected.',
    resolved: 'Resolved',
    ongoing: 'Ongoing',
  },
  ar: {
    title: 'التاريخ الطبي',
    subtitle: 'السجل الزمني للمريض',
    empty: 'لا يوجد تاريخ طبي مسجل',
    emptyDesc: 'سيظهر التاريخ الطبي هنا بمجرد ربط جدول السجلات.',
    resolved: 'تم الحل',
    ongoing: 'مستمر',
  },
} as const;

// ─── Icon + colour per event type ─────────────────────────────────────────────

const EVENT_META: Record<
  HistoryEventType,
  {
    icon: React.ElementType<{ className?: string }>;
    dot: string;
    iconColor: string;
  }
> = {
  diagnosis: {
    icon: Stethoscope,
    dot: 'bg-primary',
    iconColor: 'text-primary bg-primary/10',
  },
  medication: {
    icon: Pill,
    dot: 'bg-blue-500',
    iconColor: 'text-blue-600 bg-blue-100',
  },
  procedure: {
    icon: ClipboardList,
    dot: 'bg-violet-500',
    iconColor: 'text-violet-600 bg-violet-100',
  },
  visit: {
    icon: CheckCircle2,
    dot: 'bg-green-500',
    iconColor: 'text-green-600 bg-green-100',
  },
  alert: {
    icon: AlertCircle,
    dot: 'bg-destructive',
    iconColor: 'text-destructive bg-destructive/10',
  },
};

// ─── Component ────────────────────────────────────────────────────────────────

interface PatientHistoryTimelineProps {
  events?: HistoryEvent[];
}

export function PatientHistoryTimeline({
  events = [],
}: PatientHistoryTimelineProps) {
  const { locale } = useLanguage();
  const s = STRINGS[locale as keyof typeof STRINGS] ?? STRINGS.en;

  return (
    <CardContainer>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-primary/10 shrink-0">
            <ClipboardList className="h-4 w-4 text-primary" />
          </div>
          <div>
            <CardTitle className="text-base font-semibold">{s.title}</CardTitle>
            <CardDescription className="text-xs">{s.subtitle}</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {events.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 gap-2 text-center">
            <ClipboardList className="h-10 w-10 text-muted-foreground/20" />
            <p className="text-sm font-medium text-muted-foreground">
              {s.empty}
            </p>
            <p className="text-xs text-muted-foreground/60 max-w-52">
              {s.emptyDesc}
            </p>
          </div>
        ) : (
          <ol className="relative">
            {events.map((event, idx) => {
              const meta = EVENT_META[event.type];
              const isLast = idx === events.length - 1;
              const isResolved = !!event.resolvedAt;

              return (
                <li
                  key={event.id}
                  className="flex gap-3 pb-5 last:pb-0 relative"
                >
                  {/* Vertical line */}
                  {!isLast && (
                    <div className="absolute start-2.75 top-6 bottom-0 w-px bg-border/60" />
                  )}

                  {/* Dot */}
                  <div className="relative z-10 shrink-0 mt-0.5">
                    <div
                      className={`w-6 h-6 rounded-full ${meta.iconColor} flex items-center justify-center`}
                    >
                      <meta.icon className="h-3 w-3" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <p className="text-sm font-semibold leading-tight">
                        {event.title}
                      </p>
                      <span
                        className={`text-[10px] font-bold uppercase rounded-full px-2 py-0.5 shrink-0 ${
                          isResolved
                            ? 'bg-green-100 text-green-700'
                            : 'bg-primary/10 text-primary'
                        }`}
                      >
                        {isResolved ? s.resolved : s.ongoing}
                      </span>
                    </div>

                    {event.description && (
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                        {event.description}
                      </p>
                    )}

                    <p className="text-[10px] text-muted-foreground/60 mt-1 font-medium">
                      {new Date(event.date).toLocaleDateString(
                        locale === 'ar' ? 'ar-EG' : 'en-US',
                        { year: 'numeric', month: 'short', day: 'numeric' },
                      )}
                      {event.resolvedAt && (
                        <>
                          {' '}
                          →{' '}
                          {new Date(event.resolvedAt).toLocaleDateString(
                            locale === 'ar' ? 'ar-EG' : 'en-US',
                            { year: 'numeric', month: 'short', day: 'numeric' },
                          )}
                        </>
                      )}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </CardContent>
    </CardContainer>
  );
}
