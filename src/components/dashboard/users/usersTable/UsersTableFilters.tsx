'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, User, Activity, X, SlidersHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';

type FilterKey = 'joinedYears' | 'ageRanges' | 'detailValues';

export interface FilterOptions {
  joinedYears: string[];
  detailValues: string[];
  ageBuckets: { key: string; label: string }[];
}

export interface ActiveFilters {
  joinedYears: string[];
  ageRanges: string[];
  detailValues: string[];
}

interface UsersTableFiltersProps {
  show: boolean;
  filterOptions: FilterOptions;
  filters: ActiveFilters;
  detailColumnHeader?: string;
  activeFilterCount: number;
  onToggleFilter: (key: FilterKey, val: string, checked: boolean) => void;
  onClearFilters: () => void;
}

function Chip({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'px-3 py-1.5 rounded-lg text-xs font-medium transition-all border',
        selected
          ? 'bg-primary/10 border-primary/40 text-primary shadow-sm'
          : 'bg-muted/20 border-border/40 text-muted-foreground hover:bg-muted/50 hover:border-border hover:text-foreground',
      )}
    >
      {children}
    </button>
  );
}

function FilterGroup({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ElementType<{ className?: string }>;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center gap-1.5">
        <div className="h-5 w-5 rounded-md bg-muted/40 flex items-center justify-center">
          <Icon className="h-3 w-3 text-muted-foreground/70" />
        </div>
        <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">
          {label}
        </span>
      </div>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

export function UsersTableFilters({
  show,
  filterOptions,
  filters,
  detailColumnHeader,
  activeFilterCount,
  onToggleFilter,
  onClearFilters,
}: UsersTableFiltersProps) {
  const { locale } = useLanguage();

  const hasAnyOptions =
    filterOptions.joinedYears.length > 0 ||
    filterOptions.ageBuckets.length > 0 ||
    (detailColumnHeader && filterOptions.detailValues.length > 0);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ type: 'spring', duration: 0.35, bounce: 0 }}
          className="overflow-hidden"
        >
          <div className="rounded-xl border border-border/50 bg-muted/10 p-4 mt-1">
            {/* Filter header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground/60" />
                <span className="text-xs font-semibold text-muted-foreground">
                  {locale === 'ar' ? 'تصفية حسب' : 'Filter by'}
                </span>
                {activeFilterCount > 0 && (
                  <span className="h-5 min-w-5 px-1.5 rounded-full bg-primary/15 text-primary text-[10px] font-bold flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </div>
              {activeFilterCount > 0 && (
                <button
                  type="button"
                  onClick={onClearFilters}
                  className="flex items-center gap-1 text-[11px] font-semibold text-destructive/70 hover:text-destructive transition-colors"
                >
                  <X className="h-3 w-3" />
                  {locale === 'ar' ? 'مسح الكل' : 'Clear all'}
                </button>
              )}
            </div>

            {hasAnyOptions ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {filterOptions.joinedYears.length > 0 && (
                  <FilterGroup
                    icon={Calendar}
                    label={locale === 'ar' ? 'تاريخ الانضمام' : 'Date Joined'}
                  >
                    {filterOptions.joinedYears.map((y) => (
                      <Chip
                        key={y}
                        selected={filters.joinedYears.includes(y)}
                        onClick={() =>
                          onToggleFilter(
                            'joinedYears',
                            y,
                            !filters.joinedYears.includes(y),
                          )
                        }
                      >
                        {y}
                      </Chip>
                    ))}
                  </FilterGroup>
                )}
                {filterOptions.ageBuckets.length > 0 && (
                  <FilterGroup
                    icon={User}
                    label={locale === 'ar' ? 'الفئة العمرية' : 'Age Group'}
                  >
                    {filterOptions.ageBuckets.map((b) => (
                      <Chip
                        key={b.key}
                        selected={filters.ageRanges.includes(b.key)}
                        onClick={() =>
                          onToggleFilter(
                            'ageRanges',
                            b.key,
                            !filters.ageRanges.includes(b.key),
                          )
                        }
                      >
                        {b.label}
                      </Chip>
                    ))}
                  </FilterGroup>
                )}
                {detailColumnHeader &&
                  filterOptions.detailValues.length > 0 && (
                    <FilterGroup icon={Activity} label={detailColumnHeader}>
                      {filterOptions.detailValues.map((v) => (
                        <Chip
                          key={v}
                          selected={filters.detailValues.includes(v)}
                          onClick={() =>
                            onToggleFilter(
                              'detailValues',
                              v,
                              !filters.detailValues.includes(v),
                            )
                          }
                        >
                          {v}
                        </Chip>
                      ))}
                    </FilterGroup>
                  )}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground/50 text-center py-2">
                {locale === 'ar'
                  ? 'لا توجد خيارات تصفية متاحة.'
                  : 'No filter options available.'}
              </p>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
