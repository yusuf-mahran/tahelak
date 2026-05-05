'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { usePathname } from 'next/navigation';
import { LANGUAGE_DATA } from '@/types/languages';
import { useDashboardDataContext } from './DashboardDataContext';

type DashboardContextType = {
  sidebarItems: {
    navItems:
      | LANGUAGE_DATA['dashboardSidebarItems']
      | LANGUAGE_DATA['registrationSidebarItems'];
    activeItem:
      | LANGUAGE_DATA['dashboardSidebarItems'][number]
      | LANGUAGE_DATA['registrationSidebarItems'][number]
      | null;
  } | null;
};

const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined,
);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [sidebarItems, setSidebarItems] =
    useState<DashboardContextType['sidebarItems']>(null);

  const pathname = usePathname();
  const { localeData } = useLanguage();

  const { role: dashboardRole } = useDashboardDataContext();

  useEffect(() => {
    const filterAndSetItems = (
      navItems: LANGUAGE_DATA['dashboardSidebarItems'],
    ) => {
      if (!navItems[0].allowedRoles) return;

      const filtered = (navItems || []).filter((item) => {
        if (!item.allowedRoles) return true;
        return item.allowedRoles.includes(dashboardRole || '');
      });

      updateSidebarItems(filtered);
    };

    const updateSidebarItems = (
      filtered:
        | LANGUAGE_DATA['dashboardSidebarItems']
        | LANGUAGE_DATA['registrationSidebarItems'],
    ) => {
      const active =
        filtered.find(
          (item) =>
            item.href === pathname ||
            pathname.split('/')[2] === item.href?.split('/')[2],
        ) || null;

      setSidebarItems({
        navItems: filtered,
        activeItem: active,
      });
    };

    if (pathname.startsWith('/registration') && !dashboardRole) {
      updateSidebarItems(localeData?.registrationSidebarItems || []);
    } else if (pathname.startsWith('/dashboard')) {
      filterAndSetItems(localeData?.dashboardSidebarItems || []);
    } else {
      updateSidebarItems([]); // Clear sidebar for non-dashboard/registration routes
    }
  }, [pathname, localeData, dashboardRole]);

  return (
    <DashboardContext.Provider value={{ sidebarItems }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}
