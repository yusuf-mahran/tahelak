'use client';

import { UserRole } from '@/repositories/users';
import { useDashboardDataContext } from '@/context/DashboardDataContext';
import Loader from '../utils/Loader';

interface RoleGuardProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function RoleGuard({
  allowedRoles,
  children,
  fallback = null,
}: RoleGuardProps) {
  const { role, profileLoading } = useDashboardDataContext();

  if (profileLoading) {
    return <Loader />;
  }

  if (!role || !allowedRoles.includes(role)) {
    return fallback ? <>{fallback}</> : null;
  }

  return <>{children}</>;
}
