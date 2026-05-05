'use client';

import Image from 'next/image';
import { Mail, Calendar } from 'lucide-react';
import type { Database } from '@/lib/supabase';
import TableActions from './TableActions';

type UserRow = Database['public']['Tables']['users']['Row'];

interface UsersTableRowProps {
  user: UserRow;
  role: string;
  detailColumn?: { header: string; getValue: (u: UserRow) => string };
  onEdit: (user: UserRow) => void;
  onDelete: (user: UserRow) => void;
}

const AVATAR_COLORS = [
  'from-red-500 to-red-950',
  'from-green-500 to-green-950',
  'from-blue-500 to-blue-950',
  'from-yellow-500 to-yellow-950',
  'from-purple-500 to-purple-950',
  'from-pink-500 to-pink-950',
  'from-indigo-500 to-indigo-950',
  'from-teal-500 to-teal-950',
  'from-orange-500 to-orange-950',
  'from-cyan-500 to-cyan-950',
];

function avatarGradient(name: string) {
  const idx = name.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
}

export function UsersTableRow({
  user,
  role,
  detailColumn,
  onEdit,
  onDelete,
}: UsersTableRowProps) {
  return (
    <tr className="top-position relative group border-b border-border/30 last:border-0 hover:bg-muted/20 transition-colors duration-150">
      {/* Avatar + Name */}
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-3">
          <div className="relative w-9 h-9 rounded-lg overflow-hidden shrink-0 ring-2 ring-border/40 group-hover:ring-primary/20 transition-all">
            {user.profile_img ? (
              <Image
                src={user.profile_img}
                alt={user.name}
                fill
                className="object-cover"
              />
            ) : (
              <div
                className={`h-full w-full flex items-center justify-center bg-linear-to-br ${avatarGradient(user.name)}`}
              >
                <span className="text-sm font-bold text-white">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-foreground text-sm leading-tight truncate">
              {user.name}
            </p>
            <p className="text-xs text-muted-foreground truncate sm:hidden flex items-center gap-1 mt-0.5">
              <Mail className="h-3 w-3 shrink-0" />
              {user.email}
            </p>
          </div>
        </div>
      </td>

      {/* Email */}
      <td className="px-5 py-3.5 hidden sm:table-cell">
        <span className="text-sm text-muted-foreground truncate max-w-45 block">
          {user.email}
        </span>
      </td>

      {/* Role-specific detail */}
      {detailColumn && (
        <td className="px-5 py-3.5 hidden md:table-cell">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-primary/8 text-primary ring-1 ring-primary/20">
            {detailColumn.getValue(user)}
          </span>
        </td>
      )}

      {/* Age */}
      <td className="px-5 py-3.5 hidden lg:table-cell">
        <span className="text-sm text-muted-foreground">
          {user.age != null ? (
            <span className="font-medium text-foreground/80">{user.age}</span>
          ) : (
            <span className="text-muted-foreground/40">—</span>
          )}
        </span>
      </td>

      {/* Joined */}
      <td className="px-5 py-3.5 hidden lg:table-cell">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Calendar className="h-3 w-3 shrink-0 opacity-50" />
          <span className="text-xs">
            {new Date(user.created_at ?? '').toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </span>
        </div>
      </td>

      {/* Actions */}
      <TableActions
        user={user}
        role={role}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </tr>
  );
}
