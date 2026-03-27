'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { usePathname } from 'next/navigation';
import { LANGUAGE_DATA } from '@/types/languages';

type DashboardContextType = {
  sidebarItems: {
    navItems: LANGUAGE_DATA['dashboardSidebarItems'];
    activeItem: LANGUAGE_DATA['dashboardSidebarItems'][number] | null;
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

  useEffect(() => {
    const updateSidebarItems = async (
      navItems: LANGUAGE_DATA['dashboardSidebarItems'],
      activeItem: LANGUAGE_DATA['dashboardSidebarItems'][number] | null,
    ) => {
      setSidebarItems({
        navItems,
        activeItem,
      });
    };

    if (pathname.startsWith('/registration')) {
      updateSidebarItems(
        localeData?.registrationSidebarItems || [],
        localeData?.registrationSidebarItems?.find(
          (item) => item.href === pathname,
        ) || null,
      );
    } else if (pathname.startsWith('/dashboard')) {
      updateSidebarItems(
        localeData?.dashboardSidebarItems || [],
        localeData?.dashboardSidebarItems?.find(
          (item) => item.href === pathname,
        ) || null,
      );
    } else {
      updateSidebarItems([], null);
    }
  }, [pathname, localeData]);

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
