'use client';

import { ExternalLink, Pencil, Trash2, MoreHorizontal } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import type { Database } from '@/lib/supabase';
import { useLanguage } from '@/context/LanguageContext';

type UserRow = Database['public']['Tables']['users']['Row'];

interface TableActionsProps {
  user: UserRow;
  role: string;
  onEdit: (user: UserRow) => void;
  onDelete: (user: UserRow) => void;
}

export default function TableActions({
  user,
  role,
  onEdit,
  onDelete,
}: TableActionsProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [nearBottom, setNearBottom] = useState(false);

  const { locale } = useLanguage();

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    const handlePosition = () => {
      const rect = ref.current && ref.current.getBoundingClientRect();
      const viewportHeight =
        window.innerHeight || document.documentElement.clientHeight;
      setNearBottom(rect ? rect.bottom > viewportHeight * 0.5 : false);
    };

    handlePosition();
    window.addEventListener('resize', handlePosition);
    document.addEventListener('mousedown', handler);
    return () => {
      window.removeEventListener('resize', handlePosition);
      document.removeEventListener('mousedown', handler);
    };
  }, [open]);

  const items = [
    {
      label: { en: 'View Profile', ar: 'الملف الشخصي' }[locale],
      icon: ExternalLink,
      onClick: () => {
        router.push(`/dashboard/${role}s/${user.id}`);
        setOpen(false);
      },
      danger: false,
    },
    {
      label: { en: 'Edit', ar: 'تعديل' }[locale],
      icon: Pencil,
      onClick: () => {
        onEdit(user);
        setOpen(false);
      },
      danger: false,
    },
    {
      label: { en: 'Delete', ar: 'حذف' }[locale],
      icon: Trash2,
      onClick: () => {
        onDelete(user);
        setOpen(false);
      },
      danger: true,
    },
  ];

  return (
    <td className="px-5 py-3.5">
      <div className="relative flex justify-end" ref={ref}>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className={cn(
            'h-7 w-7 rounded-lg flex items-center justify-center transition-all',
            'text-muted-foreground/40 hover:text-foreground',
            'opacity-0 group-hover:opacity-100',
            open && 'opacity-100 bg-muted/60 text-foreground',
          )}
          title="Actions"
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>

        {open && (
          // apply positioning to the top when near the bottom of the viewport
          <div
            id="float-menu"
            className={cn(
              'absolute z-50 end-0 w-44 rounded-xl border border-border/60 bg-blur shadow-lg shadow-black/10 overflow-hidden max-md:scale-60',
              nearBottom ? 'md:bottom-full md:mb-1 md:mt-0 mt-8' : 'mt-8',
              locale === 'ar'
                ? 'origin-top-left ar-position'
                : 'origin-top-right en-position',
            )}
          >
            {items.map(({ label, icon: Icon, onClick, danger }) => (
              <button
                key={label}
                type="button"
                onClick={onClick}
                className={cn(
                  'w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm font-medium transition-colors text-start',
                  danger
                    ? 'text-destructive hover:bg-destructive/8'
                    : 'text-foreground hover:bg-muted/60',
                )}
              >
                <Icon
                  className={cn(
                    'h-3.5 w-3.5',
                    danger ? 'text-destructive' : 'text-muted-foreground',
                  )}
                />
                {label}
              </button>
            ))}
          </div>
        )}
      </div>
    </td>
  );
}
