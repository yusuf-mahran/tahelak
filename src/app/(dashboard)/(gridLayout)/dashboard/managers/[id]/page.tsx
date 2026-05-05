'use client';

import { useParams, useRouter } from 'next/navigation';
import { Building2, MapPin, Users } from 'lucide-react';
import { useDashboardDataContext } from '@/context/DashboardDataContext';
import {
  UserDetailPage,
  DetailSection,
} from '@/components/dashboard/users/UserDetailPage';
import { useLanguage } from '@/context/LanguageContext';
import * as enUsers from '@/data/en/users';
import * as arUsers from '@/data/ar/users';

// ─── Org detail row ───────────────────────────────────────────────────────────

function OrgStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
        {label}
      </span>
      <span className="text-lg font-bold text-foreground">{value}</span>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ManagerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { users, loading, organization } = useDashboardDataContext();
  const { locale } = useLanguage();

  const cfg = locale === 'ar' ? arUsers.managerConfig : enUsers.managerConfig;
  const user = users.find((u) => u.id === id && u.role === 'manager');

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
        <p className="text-muted-foreground font-medium">Manager not found.</p>
        <button
          onClick={() => router.push('/dashboard/managers')}
          className="text-sm text-primary underline"
        >
          Back to Managers
        </button>
      </div>
    );
  }

  const sub = organization?.subscription as
    | { expires_at?: string }
    | null
    | undefined;

  return (
    <UserDetailPage
      user={user}
      backHref="/dashboard/managers"
      editFields={cfg.editFields}
      editSchema={cfg.editSchema}
      getMetadata={cfg.getMetadata}
      getDefaultEditValues={cfg.getDefaultEditValues}
    >
      {/* Organization overview */}
      <DetailSection title="Organization Overview" icon={Building2}>
        {organization ? (
          <div className="space-y-4">
            {/* Org name + address */}
            <div className="flex flex-col gap-1">
              <span className="text-base font-semibold text-foreground">
                {organization.name}
              </span>
              {organization.address && (
                <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5 shrink-0" />
                  {organization.address}
                </span>
              )}
            </div>

            {/* Counts */}
            <div className="grid grid-cols-3 gap-4 pt-2 border-t border-border/40">
              <OrgStat label="Doctors" value={organization.doctors_count} />
              <OrgStat label="Managers" value={organization.managers_count} />
              <OrgStat label="Patients" value={organization.patients_count} />
            </div>

            {/* Subscription */}
            {sub?.expires_at && (
              <div className="pt-2 border-t border-border/40 flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="text-sm text-muted-foreground">
                  Subscription expires{' '}
                  <strong className="text-foreground">
                    {new Date(sub.expires_at).toLocaleDateString()}
                  </strong>
                </span>
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground py-4 text-center">
            Organization data not available.
          </p>
        )}
      </DetailSection>
    </UserDetailPage>
  );
}
