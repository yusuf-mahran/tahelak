'use client';

import { useLanguage } from '@/context/LanguageContext';

export default function EmptyUsers({
  role = 'user',
  Icon,
  search,
  activeFilterCount,
  setSearch,
  setFilters,
  openCreate,
}: {
  role: string;
  Icon?: React.ComponentType<{ className?: string }>;
  search: string;
  activeFilterCount: number;
  setSearch: (val: string) => void;
  setFilters: (filters: {
    joinedYears: string[];
    ageRanges: string[];
    detailValues: string[];
  }) => void;
  openCreate: () => void;
}) {
  const { locale } = useLanguage();

  const roleLabel = role.charAt(0).toUpperCase() + role.slice(1);

  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="relative mb-5">
        <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-primary/10 to-primary/5 ring-1 ring-primary/10 flex items-center justify-center">
          {Icon && <Icon className="h-9 w-9 text-primary/40" />}
        </div>
        <div className="absolute inset-0 rounded-2xl bg-primary/5 blur-xl -z-10" />
      </div>
      {search || activeFilterCount > 0 ? (
        <>
          <p className="text-base font-semibold text-foreground/80 mb-1">
            {locale === 'ar' ? 'لم يتم العثور على نتائج' : 'No results found'}
          </p>
          <p className="text-sm text-muted-foreground max-w-xs">
            {locale === 'ar'
              ? 'حاول تعديل البحث أو الفلاتر للعثور على ما تبحث عنه.'
              : "Try adjusting your search or filters to find what you're looking for."}
          </p>
          <button
            type="button"
            onClick={() => {
              setSearch('');
              setFilters({
                joinedYears: [],
                ageRanges: [],
                detailValues: [],
              });
            }}
            className="mt-4 text-sm font-medium text-primary hover:underline"
          >
            {locale === 'ar' ? 'مسح جميع الفلاتر' : 'Clear all filters'}
          </button>
        </>
      ) : (
        <>
          <p className="text-base font-semibold text-foreground/80 mb-1">
            {locale === 'ar'
              ? `لا يوجد ${roleLabel}s بعد`
              : `No ${roleLabel}s yet`}
          </p>
          <p className="text-sm text-muted-foreground max-w-xs mb-5">
            {locale === 'ar'
              ? `ابدأ بإضافة أول ${roleLabel} إلى النظام.`
              : `Get started by adding your first ${roleLabel} to the system.`}
          </p>
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold shadow-sm shadow-primary/20 hover:bg-primary/90 transition-colors"
          >
            {locale === 'ar'
              ? `أضف أول ${roleLabel}`
              : `Add First ${roleLabel}`}
          </button>
        </>
      )}
    </div>
  );
}
