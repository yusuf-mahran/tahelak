'use client';

import Sidebar from '@/components/shared/Sidebar';
import { Button } from '@/components/ui';
import { useDashboard } from '@/context/DashboardContext';
import Link from 'next/link';

export default function GridLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { sidebarItems } = useDashboard();
  const activeItem = sidebarItems?.activeItem;

  return (
    <div className="min-h-full grid lg:grid-cols-[16rem_1fr] md:grid-cols-[4rem_1fr] grid-rows-[auto_1fr] gap-4 justify-stretch">
      <aside className="w-full md:h-[calc(100dvh-9rem-1px)] shrink-0 md:border-e max-md:border-b border-border md:pe-4 max-md:py-4">
        <Sidebar />
      </aside>

      {/* Main content area */}
      <main className="max-h-[calc(100dvh-18rem-1px)] md:max-h-[calc(100dvh-9rem-1px)] md:flex-1 py-6">
        <article className="h-fit max-h-full bg-background rounded-lg overflow-auto shadow-[0_0_5px_rgba(158,158,158,0.5)] py-10 px-6">
          <div className="animate-in fade-in duration-500">
            <header className="mb-6 border-b border-border pb-4 flex max-xs:flex-col justify-between items-center">
              <h1 className="text-xl font-bold flex-1 max-xs:text-center">
                {activeItem?.title || 'لوحة التحكم'}
              </h1>
              {activeItem?.action?.href && activeItem?.action && (
                <div
                  className={`relative flex flex-col items-center xs:items-end gap-2 ${activeItem?.action?.tooltip ? 'max-xs:mt-8' : ''}`}
                >
                  {activeItem?.action?.tooltip !== '' && (
                    <span className="text-xs absolute -top-6 text-muted-foreground py-1 whitespace-nowrap">
                      {activeItem?.action?.tooltip}
                    </span>
                  )}
                  <Button
                    variant={
                      (activeItem.action.type as 'secondary' | 'default') ||
                      'default'
                    }
                    size="sm"
                  >
                    <Link href={activeItem.action.href}>
                      {activeItem.action.title}
                    </Link>
                  </Button>
                </div>
              )}
            </header>
            <main className="mt-10">{children}</main>
          </div>
        </article>
      </main>
    </div>
  );
}
