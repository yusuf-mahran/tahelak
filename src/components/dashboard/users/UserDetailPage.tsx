'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Mail, Calendar, Hash, Pencil, Trash2 } from 'lucide-react';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import CardContainer from '@/components/shared/CardContainer';
import type { Database } from '@/lib/supabase';
import { z } from 'zod';
import type { DynamicFormField } from '@/components/ui/dynamic-form';
import type { UserRole } from '@/repositories/users';
import { useUserActions } from '@/hooks/dashboard/useUserActions';
import { UserCreateModal } from './UserCreateModal';
import { UserDeleteModal } from './UserDeleteModal';
import { useLanguage } from '@/context/LanguageContext';
import { useDashboardDataContext } from '@/context/DashboardDataContext';

type UserRow = Database['public']['Tables']['users']['Row'];

export interface UserDetailPageProps {
  user: UserRow;
  backHref: string;
  editFields: DynamicFormField[];
  editSchema: z.ZodObject<z.ZodRawShape>;
  getMetadata?: (formData: Record<string, unknown>) => Record<string, unknown>;
  getDefaultEditValues?: (user: UserRow) => Record<string, unknown>;
  detailBadge?: string;
  children?: React.ReactNode;
}

export function UserDetailPage({
  user,
  backHref,
  editFields,
  editSchema,
  getMetadata,
  getDefaultEditValues,
  detailBadge,
  children,
}: UserDetailPageProps) {
  const router = useRouter();
  const { locale } = useLanguage();
  const { profile, organization } = useDashboardDataContext();

  const {
    isEditOpen,
    isDeleteOpen,
    isSubmitting,
    selectedUser,
    openEdit,
    openDelete,
    closeEdit,
    closeDelete,
    handleEdit,
    handleDeleteConfirm,
  } = useUserActions({
    role: user.role as UserRole,
    fields: editFields,
    schema: editSchema,
    getMetadata,
    getDefaultEditValues,
    onAfterDelete: () => router.push(backHref),
  });

  return (
    <>
      {/* Edit modal */}
      <UserCreateModal
        isOpen={isEditOpen}
        onClose={closeEdit}
        role={user.role as UserRole}
        title={
          locale === 'ar'
            ? `تعديل المستخدم`
            : `Edit ${user.role.charAt(0).toUpperCase() + user.role.slice(1)}`
        }
        fields={editFields}
        schema={editSchema}
        onCreateUser={async () => null}
        isLoading={isSubmitting}
        doctorId={profile?.user_id ?? ''}
        organizationId={organization?.id ?? ''}
        defaultValues={
          getDefaultEditValues ? getDefaultEditValues(user) : undefined
        }
        isEditMode
        editingUser={selectedUser}
        onUpdateUser={handleEdit}
      />

      {/* Delete modal */}
      <UserDeleteModal
        role={user.role}
        selectedUser={selectedUser}
        isDeleteOpen={isDeleteOpen}
        onDeleteConfirm={handleDeleteConfirm}
        onDeleteClose={closeDelete}
      />

      <div className="space-y-6">
        {/* Back navigation */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push(backHref)}
          className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground -ml-1"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        {/* Profile header card */}
        <CardContainer>
          <CardContent className="pt-6 pb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              {/* Avatar */}
              <div className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-primary/20 shadow-md shrink-0">
                {user.profile_img ? (
                  <Image
                    src={user.profile_img}
                    alt={user.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <span className="h-full w-full flex items-center justify-center bg-muted/20 text-muted-foreground">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>

              {/* Name / badges */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h1 className="text-2xl font-bold text-foreground leading-tight">
                    {user.name}
                  </h1>
                  <span className="text-[11px] font-bold text-primary/70 uppercase tracking-widest bg-primary/5 px-2.5 py-0.5 rounded-full">
                    {user.role}
                  </span>
                  {detailBadge && (
                    <span className="text-[11px] font-bold text-blue-600/80 uppercase tracking-widest bg-blue-50 dark:bg-blue-900/20 px-2.5 py-0.5 rounded-full">
                      {detailBadge}
                    </span>
                  )}
                </div>

                {/* Info row */}
                <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 shrink-0" />
                    {user.email}
                  </span>
                  {user.age != null && (
                    <span className="flex items-center gap-1.5">
                      <Hash className="h-3.5 w-3.5 shrink-0" />
                      Age {user.age}
                    </span>
                  )}
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 shrink-0" />
                    Joined{' '}
                    {new Date(
                      user.created_at || '5/5/2026',
                    ).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Edit / Delete buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openEdit(user)}
                  className="flex items-center gap-1.5 border-primary/20 hover:bg-primary/5 text-primary font-bold rounded-xl"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openDelete(user)}
                  className="flex items-center gap-1.5 border-destructive/20 hover:bg-destructive/5 text-destructive font-bold rounded-xl"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </Button>
              </div>
            </div>
          </CardContent>
        </CardContainer>

        {/* Role-specific content */}
        {children}
      </div>
    </>
  );
}

// ─── Reusable section card ────────────────────────────────────────────────────

export function DetailSection({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon?: React.ElementType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <CardContainer>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          {Icon && <Icon className="h-4 w-4 text-primary" />}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">{children}</CardContent>
    </CardContainer>
  );
}

// ─── Placeholder list ─────────────────────────────────────────────────────────

export function PlaceholderList({ message }: { message: string }) {
  return (
    <p className="text-sm text-muted-foreground py-4 text-center">{message}</p>
  );
}
