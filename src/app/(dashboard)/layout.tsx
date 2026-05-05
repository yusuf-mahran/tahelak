'use client';

import { DashboardProvider } from '@/context/DashboardContext';
import { DashboardDataProvider } from '@/context/DashboardDataContext';
import { Suspense } from 'react';

export default function RegistrationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex md:h-[calc(100dvh-9rem-1px)] h-[calc(100dvh-11.1rem-1px)] overflow-hidden">
      <main className="flex-1 scroll-smooth">
        <div className="h-full max-w-430 md:px-10 px-6 mx-auto">
          <Suspense
            fallback={
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-primary"></div>
              </div>
            }
          >
            <DashboardDataProvider>
              <DashboardProvider>{children}</DashboardProvider>
            </DashboardDataProvider>
          </Suspense>
        </div>
      </main>
    </div>
  );
}
