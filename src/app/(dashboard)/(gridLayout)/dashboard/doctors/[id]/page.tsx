'use client';

import { useParams, useRouter } from 'next/navigation';
import { Stethoscope, AlertCircle, CalendarClock, Users } from 'lucide-react';
import { useDashboardDataContext } from '@/context/DashboardDataContext';
import {
  UserDetailPage,
  DetailSection,
  PlaceholderList,
} from '@/components/dashboard/users/UserDetailPage';
import { useLanguage } from '@/context/LanguageContext';
import * as enUsers from '@/data/en/users';
import * as arUsers from '@/data/ar/users';

export default function DoctorDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { users, loading } = useDashboardDataContext();
  const { locale } = useLanguage();

  const cfg = locale === 'ar' ? arUsers.doctorConfig : enUsers.doctorConfig;
  const user = users.find((u) => u.id === id && u.role === 'doctor');

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
        <p className="text-muted-foreground font-medium">Doctor not found.</p>
        <button
          onClick={() => router.push('/dashboard/doctors')}
          className="text-sm text-primary underline"
        >
          Back to Doctors
        </button>
      </div>
    );
  }

  const medicalTitle =
    ((user.user_metadata as Record<string, unknown>)?.medical_title as string) ||
    'General';

  return (
    <UserDetailPage
      user={user}
      backHref="/dashboard/doctors"
      editFields={cfg.editFields}
      editSchema={cfg.editSchema}
      getMetadata={cfg.getMetadata}
      getDefaultEditValues={cfg.getDefaultEditValues}
      detailBadge={medicalTitle}
    >
      {/* Stats row */}
      <div className="grid grid-cols-2 gap-4">
        <DetailSection title="Active Patients" icon={Users}>
          <p className="text-3xl font-bold text-foreground">—</p>
          <p className="text-xs text-muted-foreground mt-1">
            Patients data will appear once connected
          </p>
        </DetailSection>
        <DetailSection title="Upcoming Appointments" icon={CalendarClock}>
          <p className="text-3xl font-bold text-foreground">—</p>
          <p className="text-xs text-muted-foreground mt-1">
            Appointments data will appear once connected
          </p>
        </DetailSection>
      </div>

      {/* Patient Alerts */}
      <DetailSection title="Patient Alerts" icon={AlertCircle}>
        <PlaceholderList message="No patient alerts — appointments table not yet connected." />
      </DetailSection>

      {/* Upcoming Appointments */}
      <DetailSection title="Upcoming Appointments" icon={Stethoscope}>
        <PlaceholderList message="No upcoming appointments — appointments table not yet connected." />
      </DetailSection>
    </UserDetailPage>
  );
}

