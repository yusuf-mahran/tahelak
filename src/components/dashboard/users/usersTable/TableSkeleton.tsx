import { Database } from '@/lib/supabase';
import { UsersTableHead, type SortKey, type SortDir } from './UsersTableHead';

type UserRow = Database['public']['Tables']['users']['Row'];

export default function TableSkeleton({
  sortKey,
  sortDir,
  toggleSort,
  detailColumn,
}: {
  sortKey: SortKey;
  sortDir: SortDir;
  toggleSort: (key: SortKey) => void;
  detailColumn?: {
    header: string;
    getValue: (user: UserRow) => string;
  };
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <UsersTableHead
          sortKey={sortKey}
          sortDir={sortDir}
          onSort={toggleSort}
          detailColumn={detailColumn}
        />
        <tbody>
          {Array.from({ length: 5 }).map((_, i) => (
            <tr key={i} className="border-b border-border/30 last:border-0">
              <td className="px-5 py-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-muted/50 animate-pulse shrink-0" />
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="h-3.5 w-28 rounded-full bg-muted/50 animate-pulse" />
                    <div className="h-2.5 w-20 rounded-full bg-muted/40 animate-pulse sm:hidden" />
                  </div>
                </div>
              </td>
              <td className="px-5 py-3.5 hidden sm:table-cell">
                <div className="h-3 w-36 rounded-full bg-muted/50 animate-pulse" />
              </td>
              {detailColumn && (
                <td className="px-5 py-3.5 hidden md:table-cell">
                  <div className="h-5 w-20 rounded-full bg-muted/50 animate-pulse" />
                </td>
              )}
              <td className="px-5 py-3.5 hidden lg:table-cell">
                <div className="h-3 w-8 rounded-full bg-muted/50 animate-pulse" />
              </td>
              <td className="px-5 py-3.5 hidden lg:table-cell">
                <div className="h-3 w-20 rounded-full bg-muted/50 animate-pulse" />
              </td>
              <td className="px-5 py-3.5">
                <div className="flex justify-end">
                  <div className="h-7 w-7 rounded-lg bg-muted/50 animate-pulse" />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
