'use client';

import Sidebar from '@/components/shared/Sidebar';
import { Button, TypographyH1 } from '@/components/ui';
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
            <header className="mb-6 border-b border-border pb-4 flex max-md:flex-col justify-between items-center gap-4">
              <div className="space-y-2 max-md:text-center">
                <TypographyH1
                  style={{ fontSize: '2.5rem' }}
                  className="border-none pb-0 font-bold max-xs:text-center"
                >
                  {activeItem?.title || 'لوحة التحكم'}
                </TypographyH1>
                <p className="text-slate-500 font-medium">
                  {activeItem?.description ||
                    'مرحبًا بك في لوحة التحكم الخاصة بك. هنا يمكنك إدارة إعدادات حسابك، عرض تحليلاتك، ومتابعة نشاطك.'}
                </p>
              </div>
              {activeItem?.action?.href && activeItem?.action && (
                <div className="flex flex-col items-center md:items-end gap-2">
                  {activeItem?.action?.tooltip !== '' && (
                    <span className="text-xs text-muted-foreground py-1 whitespace-nowrap">
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
