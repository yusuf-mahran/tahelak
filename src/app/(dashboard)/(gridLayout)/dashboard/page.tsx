'use client';

import { OrgProfile } from '@/components/dashboard/orgInfo/OrgProfile';
import { SubscriptionPlan } from '@/components/dashboard/orgInfo/SubscriptionPlan';
import { DoctorsList } from '@/components/dashboard/users/usersList/DoctorsList';
import { ManagersList } from '@/components/dashboard/users/usersList/ManagersList';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { UserGrowthChart } from '@/components/dashboard/stats/UserGrowthChart';
import { AppointmentCard } from '@/components/dashboard/shared/AppointmentCard';
import { VitalsChart } from '@/components/dashboard/patient/VitalsChart';
import { PatientHistoryTimeline } from '@/components/dashboard/patient/PatientHistoryTimeline';
import StatsContainer from '@/components/dashboard/stats/StatsContainer';
import { SuccessStats } from '@/components/dashboard/stats/SuccessStats';

export default function DashboardPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-12">
      <RoleGuard allowedRoles={['root', 'manager', 'doctor']}>
        <StatsContainer />
      </RoleGuard>

      {/* ── root / manager view ─────────────────────────────────── */}
      <RoleGuard allowedRoles={['root', 'manager']}>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="md:col-span-3">
            <UserGrowthChart />
          </div>
          <div className="md:col-span-2">
            <SuccessStats />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch justify-stretch">
          <OrgProfile />
          <SubscriptionPlan />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch justify-stretch">
          <DoctorsList />
          <ManagersList />
        </div>
      </RoleGuard>

      {/* ── doctor view ─────────────────────────────────────────── */}
      <RoleGuard allowedRoles={['doctor']}>
        <AppointmentCard />
      </RoleGuard>

      {/* ── patient view ────────────────────────────────────────── */}
      <RoleGuard allowedRoles={['patient']}>
        <VitalsChart />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-stretch">
          <AppointmentCard showDoctor />
          <PatientHistoryTimeline />
        </div>
      </RoleGuard>
    </div>
  );
}
