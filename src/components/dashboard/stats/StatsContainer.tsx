'use client';

import { useLanguage } from '@/context/LanguageContext';
import StatCard from './StatCard';
import { useDashboardDataContext } from '@/context/DashboardDataContext';
import {
  Activity,
  Briefcase,
  Clock,
  Dumbbell,
  Stethoscope,
  Users,
} from 'lucide-react';
import CardContainer from '@/components/shared/CardContainer';
import { CardContent, CardHeader } from '@/components/ui/card';
import { useEffect, useMemo, useState } from 'react';

export default function StatsContainer() {
  const { localeData } = useLanguage();
  const {
    role,
    profileLoading,
    profile,
    organization,
    orgLoading,
    orgError,
    exercises,
    assignments,
  } = useDashboardDataContext();

  const [counts, setCounts] = useState({
    doctors: 0,
    patients: 0,
    managers: 0,
    activePatients: 0,
  });
  const [medicalTitle, setMedicalTitle] = useState('—');

  useEffect(() => {
    const updateMedicalTitle = () => {
      const medicalTitleKey = (
        profile?.user_metadata as Record<string, unknown>
      )?.medical_title as string;
      const title =
        (localeData !== null &&
          localeData?.medicalTitles?.[
            medicalTitleKey as keyof typeof localeData.medicalTitles
          ]) ||
        medicalTitleKey ||
        '—';
      setMedicalTitle(title);
    };

    updateMedicalTitle();
  }, [profile, localeData]);

  useEffect(() => {
    const updateCounts = () => {
      if (!orgLoading && !orgError) {
        const doctorsCount = organization?.doctors_count || 0;
        const patientsCount = organization?.patients_count || 0;
        const managersCount = organization?.managers_count || 0;

        const activePatientsCount = assignments
          ? new Set(assignments.map((a) => a.assignment.patient_id)).size
          : 0;

        setCounts({
          doctors: doctorsCount,
          patients: patientsCount,
          managers: managersCount,
          activePatients: activePatientsCount,
        });
      }
    };

    updateCounts();
  }, [organization, orgLoading, orgError, assignments]);

  type ORG_TYPE = NonNullable<typeof localeData>['stats']['organization'];
  type DOC_TYPE = NonNullable<typeof localeData>['stats']['doctors'];

  type STATS_ROLE_TYPE = ORG_TYPE | DOC_TYPE;

  const stats = useMemo(() => {
    const statsRole: STATS_ROLE_TYPE =
      localeData !== null && localeData.stats !== null
        ? role === 'root' || role === 'manager'
          ? localeData.stats.organization
          : localeData.stats.doctors
        : ({} as STATS_ROLE_TYPE);

    return role === 'root' || role === 'manager'
      ? [
          {
            label: (statsRole as ORG_TYPE)?.doctors,
            desc: (statsRole as ORG_TYPE)?.doctorsDesc,
            value: counts.doctors,
            icon: Stethoscope,
            color: 'text-blue-600',
            bg: 'bg-blue-100',
          },
          {
            label: (statsRole as ORG_TYPE)?.managers,
            desc: (statsRole as ORG_TYPE)?.managersDesc,
            value: counts.managers,
            icon: Briefcase,
            color: 'text-yellow-600',
            bg: 'bg-yellow-100',
          },
          {
            label: (statsRole as ORG_TYPE)?.patients,
            desc: (statsRole as ORG_TYPE)?.patientsDesc,
            value: counts.patients,
            icon: Activity,
            color: 'text-green-600',
            bg: 'bg-green-100',
          },
          {
            label: (statsRole as ORG_TYPE)?.activePatients,
            desc: (statsRole as ORG_TYPE)?.activePatientsDesc,
            value: counts.activePatients,
            icon: Clock,
            color: 'text-red-600',
            bg: 'bg-red-100',
          },
        ]
      : [
          {
            label: (statsRole as DOC_TYPE)?.patients,
            desc: (statsRole as DOC_TYPE)?.patientsDesc,
            value: counts.patients,
            icon: Users,
            color: 'text-primary',
            bg: 'bg-primary/10',
          },
          {
            label: (statsRole as DOC_TYPE)?.exercises,
            desc: (statsRole as DOC_TYPE)?.exercisesDesc,
            value: exercises.length,
            icon: Dumbbell,
            color: 'text-blue-600',
            bg: 'bg-blue-100',
          },
          {
            label: (statsRole as DOC_TYPE)?.active,
            desc: (statsRole as DOC_TYPE)?.activeDesc,
            value: counts.activePatients,
            icon: Activity,
            color: 'text-green-600',
            bg: 'bg-green-100',
          },
          {
            label: (statsRole as DOC_TYPE)?.specialty,
            desc: (statsRole as DOC_TYPE)?.specialtyDesc,
            value: medicalTitle,
            icon: Stethoscope,
            color: 'text-violet-600',
            bg: 'bg-violet-100',
          },
        ];
  }, [role, counts, exercises, medicalTitle, localeData]);

  if (profileLoading) {
    return (
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <CardContainer key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-muted rounded w-2/3" />
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded w-1/2 mb-2" />
              <div className="h-3 bg-muted rounded w-full" />
            </CardContent>
          </CardContainer>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 items-stretch justify-stretch">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
}
