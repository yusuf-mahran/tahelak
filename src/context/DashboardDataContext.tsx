'use client';

import { createContext, useContext } from 'react';
import { useDashboardData } from '@/hooks/dashboard/useDashboard';

type DashboardDataContextType = ReturnType<typeof useDashboardData>;

const DashboardDataContext = createContext<
  DashboardDataContextType | undefined
>(undefined);

export function DashboardDataProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const data = useDashboardData();

  return (
    <DashboardDataContext.Provider value={data}>
      {children}
    </DashboardDataContext.Provider>
  );
}

export function useDashboardDataContext() {
  const context = useContext(DashboardDataContext);
  if (!context) {
    throw new Error(
      'useDashboardDataContext must be used within a DashboardDataProvider',
    );
  }
  return context;
}
