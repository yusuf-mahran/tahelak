'use client';

import Link from 'next/link';
import { Button, TypographyH1 } from '../ui';
import { useDashboard } from '@/context/DashboardContext';
import { useEffect, useState } from 'react';

export default function GridHeader() {
  const { sidebarItems } = useDashboard();
  const activeItem = sidebarItems?.activeItem;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const updateLoadingState = () => {
      if (activeItem || activeItem === null) {
        setIsLoading(false);
      }
    };
    updateLoadingState();
  }, [sidebarItems, activeItem]);

  if (isLoading) {
    return (
      <div className="mb-6 border-b border-border pb-4 flex max-md:flex-col justify-between items-center gap-4 animate-pulse">
        <div className="w-full space-y-4">
          <div className="h-8 md:w-1/2 w-8/12 bg-muted rounded max-md:mx-auto"></div>
          <div className="h-4 md:w-2/3 w-10/12 bg-muted rounded max-md:mx-auto"></div>
        </div>
        <div className="flex flex-col items-center md:items-end gap-2">
          <div className="h-8 w-24 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <header className="mb-6 border-b border-border pb-4 flex max-md:flex-col justify-between items-center gap-4">
      <div className="space-y-2 max-md:text-center">
        <TypographyH1
          style={{ fontSize: '2.5rem' }}
          className="border-none pb-0 font-bold max-xs:text-center"
        >
          {activeItem?.title}
        </TypographyH1>
        <p className="text-slate-500 font-medium">{activeItem?.description}</p>
      </div>
      {activeItem?.action && 'href' in activeItem.action && (
        <div className="flex flex-col items-center md:items-end gap-2">
          {activeItem?.action?.tooltip !== '' && (
            <span className="text-xs text-muted-foreground py-1 whitespace-nowrap">
              {activeItem?.action?.tooltip}
            </span>
          )}
          <Button
            variant={
              (activeItem.action.type as 'secondary' | 'default') || 'default'
            }
            size="sm"
          >
            <Link href={activeItem.action.href || ''}>
              {activeItem.action.title}
            </Link>
          </Button>
        </div>
      )}
    </header>
  );
}
