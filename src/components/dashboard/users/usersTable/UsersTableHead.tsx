'use client';

import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Database } from '@/lib/supabase';
import { useLanguage } from '@/context/LanguageContext';

type UserRow = Database['public']['Tables']['users']['Row'];

export type SortKey = 'name' | 'email' | 'age' | 'created_at';
export type SortDir = 'asc' | 'desc';

interface UsersTableHeadProps {
  sortKey: SortKey;
  sortDir: SortDir;
  onSort: (key: SortKey) => void;
  detailColumn?: { header: string; getValue: (u: UserRow) => string };
}

function SortButton({
  col,
  sortKey,
  sortDir,
  onSort,
  children,
  className,
}: {
  col: SortKey;
  sortKey: SortKey;
  sortDir: SortDir;
  onSort: (key: SortKey) => void;
  children: React.ReactNode;
  className?: string;
}) {
  const active = sortKey === col;
  return (
    <button
      type="button"
      onClick={() => onSort(col)}
      className={cn(
        'flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest transition-colors',
        active
          ? 'text-primary'
          : 'text-muted-foreground/60 hover:text-muted-foreground',
        className,
      )}
    >
      {children}
      {active ? (
        sortDir === 'asc' ? (
          <ChevronUp className="h-3 w-3" />
        ) : (
          <ChevronDown className="h-3 w-3" />
        )
      ) : (
        <ChevronsUpDown className="h-3 w-3 opacity-40" />
      )}
    </button>
  );
}

export function UsersTableHead({
  sortKey,
  sortDir,
  onSort,
  detailColumn,
}: UsersTableHeadProps) {
  const { locale } = useLanguage();

  return (
    <thead>
      <tr className="border-b border-border/40 bg-muted/30">
        <th className="text-start px-5 py-3">
          <SortButton
            col="name"
            sortKey={sortKey}
            sortDir={sortDir}
            onSort={onSort}
          >
            {locale === 'ar' ? 'المستخدم' : 'User'}
          </SortButton>
        </th>
        <th className="text-start px-5 py-3 hidden sm:table-cell">
          <SortButton
            col="email"
            sortKey={sortKey}
            sortDir={sortDir}
            onSort={onSort}
          >
            {locale === 'ar' ? 'البريد الإلكتروني' : 'Email'}
          </SortButton>
        </th>
        {detailColumn && (
          <th className="text-start px-5 py-3 text-[11px] font-bold text-muted-foreground/60 uppercase tracking-widest hidden md:table-cell">
            {detailColumn.header}
          </th>
        )}
        <th className="text-start px-5 py-3 hidden lg:table-cell">
          <SortButton
            col="age"
            sortKey={sortKey}
            sortDir={sortDir}
            onSort={onSort}
          >
            {locale === 'ar' ? 'العمر' : 'Age'}
          </SortButton>
        </th>
        <th className="text-start px-5 py-3 hidden lg:table-cell">
          <SortButton
            col="created_at"
            sortKey={sortKey}
            sortDir={sortDir}
            onSort={onSort}
          >
            {locale === 'ar' ? 'انضم منذ' : 'Joined'}
          </SortButton>
        </th>
        <th className="px-5 py-3" />
      </tr>
    </thead>
  );
}
