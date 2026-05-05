'use client';

import { Search, UserPlus, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';

interface UsersTableToolbarProps {
  title: string;
  Icon?: React.ElementType<{ className?: string }>;
  totalCount: number;
  visibleCount: number;
  search: string;
  onSearchChange: (value: string) => void;
  activeFilterCount: number;
  showFilters: boolean;
  onToggleFilters: () => void;
  onAddClick: () => void;
}

export function UsersTableToolbar({
  title,
  Icon,
  totalCount,
  visibleCount,
  search,
  onSearchChange,
  activeFilterCount,
  showFilters,
  onToggleFilters,
  onAddClick,
}: UsersTableToolbarProps) {
  const { locale } = useLanguage();

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      {/* Title + stats */}
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 ring-1 ring-primary/20">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        )}
        <div>
          <h2 className="text-lg font-bold text-foreground leading-tight">
            {title}
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {visibleCount !== totalCount ? (
              <>
                <span className="font-semibold text-primary">
                  {visibleCount}
                </span>
                <span className="text-muted-foreground/60">
                  {' '}
                  {locale === 'ar' ? 'من' : 'of'} {totalCount}
                </span>
              </>
            ) : (
              <>
                <span className="font-semibold text-primary">{totalCount}</span>
                <span className="text-muted-foreground/60">
                  {' '}
                  {locale === 'ar' ? 'مسجل' : 'registered'}
                </span>
              </>
            )}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2 w-full md:w-auto">
        {/* Search */}
        <div className="relative flex-1 md:flex-none">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/40 pointer-events-none" />
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={locale === 'ar' ? 'بحث…' : 'Search…'}
            className="h-9 w-full md:w-52 rounded-xl border border-border/60 bg-background pl-9 pr-8 text-sm placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
          />
          {search && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-muted-foreground transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Filter toggle */}
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleFilters}
          className={cn(
            'h-9 gap-1.5 rounded-xl transition-all border font-medium',
            activeFilterCount > 0
              ? 'border-primary/40 bg-primary/8 text-primary hover:bg-primary/12'
              : showFilters
                ? 'border-primary/30 bg-primary/5 text-primary'
                : 'border-border/60 text-muted-foreground hover:border-border hover:text-foreground',
          )}
        >
          <Filter className="h-3.5 w-3.5" />
          {activeFilterCount > 0 ? (
            <span className="h-4.5 w-4.5 rounded-full bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center">
              {activeFilterCount}
            </span>
          ) : locale === 'ar' ? (
            'الفلاتر'
          ) : (
            'Filters'
          )}
        </Button>

        {/* Add button */}
        <Button
          size="sm"
          onClick={onAddClick}
          className="h-9 gap-1.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-sm shadow-primary/20 shrink-0"
        >
          <UserPlus className="h-4 w-4" />
          {locale === 'ar' ? 'إضافة' : 'Add'}
        </Button>
      </div>
    </div>
  );
}
