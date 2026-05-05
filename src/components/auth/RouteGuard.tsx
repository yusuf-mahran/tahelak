'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useDashboardDataContext } from '@/context/DashboardDataContext';
import { useToast } from '@/hooks/useToast';
import { dashboardSidebarItems } from '@/data/en/dashboardSidebar';

export function RouteGuard() {
  const pathname = usePathname();
  const router = useRouter();
  const { role, profileLoading } = useDashboardDataContext();
  const { showToast } = useToast();

  useEffect(() => {
    if (profileLoading || !role) return;
    if (!pathname.startsWith('/dashboard')) return;

    // Find the most specific matching sidebar item
    // e.g. /dashboard/doctors/[id] → matches /dashboard/doctors (longer) over /dashboard
    const matched = dashboardSidebarItems
      .filter(
        (item) =>
          pathname === item.href || pathname.startsWith(item.href + '/'),
      )
      .sort((a, b) => b.href.length - a.href.length)[0];

    if (!matched?.allowedRoles) return;

    if (!matched.allowedRoles.includes(role)) {
      showToast({
        title: 'Access Denied',
        description: 'You do not have permission to access this page.',
        type: 'error',
      });
      router.replace('/dashboard');
    }
  }, [pathname, role, profileLoading, router, showToast]);

  return null;
}
