'use client';

import { useParams, useRouter } from 'next/navigation';
import { Activity, CalendarClock, ClipboardList, Pill } from 'lucide-react';
import { useDashboardDataContext } from '@/context/DashboardDataContext';
import {
  UserDetailPage,
  DetailSection,
  PlaceholderList,
} from '@/components/dashboard/users/UserDetailPage';
import { useLanguage } from '@/context/LanguageContext';
import * as enUsers from '@/data/en/users';
import * as arUsers from '@/data/ar/users';

// ─── Vitals placeholder grid ──────────────────────────────────────────────────

function VitalPlaceholder({ label }: { label: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-border/40 p-4">
      <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
        {label}
      </span>
      <span className="text-2xl font-bold text-muted-foreground/40">—</span>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PatientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { users, loading } = useDashboardDataContext();
  const { locale } = useLanguage();

  const cfg = locale === 'ar' ? arUsers.patientConfig : enUsers.patientConfig;
  const user = users.find((u) => u.id === id && u.role === 'patient');

  if (loading && !user) {
    return (
      <div className="flex items-center justify-center h-48">
        <span className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-48 gap-3">
        <p className="text-muted-foreground font-medium">Patient not found.</p>
        <button
          onClick={() => router.push('/dashboard/patients')}
          className="text-sm text-primary underline"
        >
          Back to Patients
        </button>
      </div>
    );
  }

  const meta = user.user_metadata as Record<string, unknown>;
  const medicalSummary = (meta?.medical_summary as string) || null;
  const condition = (meta?.condition as string) || undefined;

  return (
    <UserDetailPage
      user={user}
      backHref="/dashboard/patients"
      editFields={cfg.editFields}
      editSchema={cfg.editSchema}
      getMetadata={cfg.getMetadata}
      getDefaultEditValues={cfg.getDefaultEditValues}
      detailBadge={condition}
    >
      {/* Medical Summary */}
      <DetailSection title="Medical Summary" icon={ClipboardList}>
        {medicalSummary ? (
          <p className="text-sm text-foreground leading-relaxed">
            {medicalSummary}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground py-4 text-center">
            No medical summary recorded.
          </p>
        )}
      </DetailSection>

      {/* Vitals */}
      <DetailSection title="Current Vitals" icon={Activity}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <VitalPlaceholder label="Heart Rate" />
          <VitalPlaceholder label="Blood Pressure" />
          <VitalPlaceholder label="Temperature" />
          <VitalPlaceholder label="Weight" />
        </div>
        <p className="text-xs text-muted-foreground mt-3 text-center">
          Vitals will appear once the vitals table is connected.
        </p>
      </DetailSection>

      {/* Medications */}
      <DetailSection title="Medications" icon={Pill}>
        <PlaceholderList message="No medications recorded — medications table not yet connected." />
      </DetailSection>

      {/* Appointments */}
      <DetailSection title="Appointments" icon={CalendarClock}>
        <PlaceholderList message="No appointments — appointments table not yet connected." />
      </DetailSection>
    </UserDetailPage>
  );
}
