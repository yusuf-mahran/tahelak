'use client';

import { Activity, Heart, Thermometer, Weight } from 'lucide-react';
import {
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import CardContainer from '@/components/shared/CardContainer';
import { useLanguage } from '@/context/LanguageContext';

// ─── Types ────────────────────────────────────────────────────────────────────
// Replace with real DB row type once vitals table is created.
export interface VitalReading {
  timestamp: string; // ISO
  heartRate?: number; // bpm
  bloodPressureSystolic?: number; // mmHg
  bloodPressureDiastolic?: number; // mmHg
  temperature?: number; // °C
  weight?: number; // kg
}

const STRINGS = {
  en: {
    title: 'Vitals Overview',
    subtitle: 'Latest patient measurements',
    heartRate: 'Heart Rate',
    bloodPressure: 'Blood Pressure',
    temperature: 'Temperature',
    weight: 'Weight',
    bpm: 'bpm',
    mmhg: 'mmHg',
    celsius: '°C',
    kg: 'kg',
    noData: 'No vitals recorded',
    noDataDesc: 'Vitals will appear here once the vitals table is connected.',
    normal: 'Normal',
    high: 'High',
    low: 'Low',
    lastReading: 'Last reading',
  },
  ar: {
    title: 'نظرة عامة على العلامات الحيوية',
    subtitle: 'آخر قياسات المريض',
    heartRate: 'معدل ضربات القلب',
    bloodPressure: 'ضغط الدم',
    temperature: 'درجة الحرارة',
    weight: 'الوزن',
    bpm: 'نبضة/دقيقة',
    mmhg: 'مم زئبق',
    celsius: '°م',
    kg: 'كجم',
    noData: 'لا توجد علامات حيوية مسجلة',
    noDataDesc: 'ستظهر العلامات الحيوية هنا بمجرد ربط جدول العلامات.',
    normal: 'طبيعي',
    high: 'مرتفع',
    low: 'منخفض',
    lastReading: 'آخر قراءة',
  },
} as const;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getHeartRateStatus(bpm: number): 'normal' | 'high' | 'low' {
  if (bpm >= 60 && bpm <= 100) return 'normal';
  return bpm > 100 ? 'high' : 'low';
}

function getBPStatus(sys: number, dia: number): 'normal' | 'high' | 'low' {
  if (sys >= 90 && sys <= 120 && dia >= 60 && dia <= 80) return 'normal';
  return sys > 120 || dia > 80 ? 'high' : 'low';
}

function getTempStatus(temp: number): 'normal' | 'high' | 'low' {
  if (temp >= 36.1 && temp <= 37.2) return 'normal';
  return temp > 37.2 ? 'high' : 'low';
}

const statusColor = {
  normal: 'text-green-600 bg-green-100',
  high: 'text-destructive bg-destructive/10',
  low: 'text-blue-600 bg-blue-100',
};

// ─── Mini sparkline bar (CSS-only, no charting lib) ──────────────────────────

function SparkBar({
  value,
  max,
  color,
}: {
  value: number;
  max: number;
  color: string;
}) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden mt-2">
      <div
        className={`h-full rounded-full transition-all duration-700 ${color}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

// ─── Individual vital card ────────────────────────────────────────────────────

function VitalCard({
  icon: Icon,
  label,
  value,
  unit,
  status,
  statusLabel,
  sparkValue,
  sparkMax,
  bgColor,
  sparkColor,
}: {
  icon: React.ElementType<{ className?: string }>;
  label: string;
  value: string;
  unit: string;
  status: 'normal' | 'high' | 'low';
  statusLabel: string;
  sparkValue: number;
  sparkMax: number;
  bgColor: string;
  sparkColor: string;
}) {
  return (
    <CardContainer>
      <CardContent className="pt-5 pb-4">
        <div className="flex items-start justify-between mb-1">
          <div className={`p-2 rounded-xl ${bgColor} shrink-0`}>
            <Icon className="h-4 w-4" />
          </div>
          <span
            className={`text-[10px] font-bold uppercase rounded-full px-2 py-0.5 ${statusColor[status]}`}
          >
            {statusLabel}
          </span>
        </div>
        <p className="text-xs text-muted-foreground font-medium mt-2">
          {label}
        </p>
        <p className="text-2xl font-extrabold font-tomorrow leading-tight">
          {value}
          <span className="text-xs font-medium text-muted-foreground ms-1">
            {unit}
          </span>
        </p>
        <SparkBar value={sparkValue} max={sparkMax} color={sparkColor} />
      </CardContent>
    </CardContainer>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

interface VitalsChartProps {
  latest?: VitalReading;
  recordedAt?: string;
}

export function VitalsChart({ latest, recordedAt }: VitalsChartProps) {
  const { locale } = useLanguage();
  const s = STRINGS[locale as keyof typeof STRINGS] ?? STRINGS.en;

  if (!latest) {
    return (
      <CardContainer>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-primary/10 shrink-0">
              <Activity className="h-4 w-4 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">
                {s.title}
              </CardTitle>
              <CardDescription className="text-xs">
                {s.subtitle}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-col items-center justify-center py-8 gap-2 text-center">
            <Activity className="h-10 w-10 text-muted-foreground/20" />
            <p className="text-sm font-medium text-muted-foreground">
              {s.noData}
            </p>
            <p className="text-xs text-muted-foreground/60 max-w-52">
              {s.noDataDesc}
            </p>
          </div>
        </CardContent>
      </CardContainer>
    );
  }

  const {
    heartRate,
    bloodPressureSystolic,
    bloodPressureDiastolic,
    temperature,
    weight,
  } = latest;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-primary/10 shrink-0">
            <Activity className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-base font-semibold">{s.title}</p>
            <p className="text-xs text-muted-foreground">{s.subtitle}</p>
          </div>
        </div>
        {recordedAt && (
          <p className="text-xs text-muted-foreground">
            {s.lastReading}: {new Date(recordedAt).toLocaleDateString()}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {heartRate != null && (
          <VitalCard
            icon={Heart}
            label={s.heartRate}
            value={String(heartRate)}
            unit={s.bpm}
            status={getHeartRateStatus(heartRate)}
            statusLabel={s[getHeartRateStatus(heartRate)]}
            sparkValue={heartRate}
            sparkMax={180}
            bgColor="bg-rose-100 text-rose-600"
            sparkColor="bg-rose-500"
          />
        )}
        {bloodPressureSystolic != null && bloodPressureDiastolic != null && (
          <VitalCard
            icon={Activity}
            label={s.bloodPressure}
            value={`${bloodPressureSystolic}/${bloodPressureDiastolic}`}
            unit={s.mmhg}
            status={getBPStatus(bloodPressureSystolic, bloodPressureDiastolic)}
            statusLabel={
              s[getBPStatus(bloodPressureSystolic, bloodPressureDiastolic)]
            }
            sparkValue={bloodPressureSystolic}
            sparkMax={180}
            bgColor="bg-blue-100 text-blue-600"
            sparkColor="bg-blue-500"
          />
        )}
        {temperature != null && (
          <VitalCard
            icon={Thermometer}
            label={s.temperature}
            value={temperature.toFixed(1)}
            unit={s.celsius}
            status={getTempStatus(temperature)}
            statusLabel={s[getTempStatus(temperature)]}
            sparkValue={temperature}
            sparkMax={42}
            bgColor="bg-orange-100 text-orange-600"
            sparkColor="bg-orange-500"
          />
        )}
        {weight != null && (
          <VitalCard
            icon={Weight}
            label={s.weight}
            value={String(weight)}
            unit={s.kg}
            status="normal"
            statusLabel={s.normal}
            sparkValue={weight}
            sparkMax={150}
            bgColor="bg-violet-100 text-violet-600"
            sparkColor="bg-violet-500"
          />
        )}
      </div>
    </div>
  );
}
