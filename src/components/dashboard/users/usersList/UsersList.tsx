'use client';

import {
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { TypographyP } from '@/components/ui/typography';
import { ChevronRight, Edit, Trash, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Loading from './Loading';
import Link from 'next/link';
import { Modal } from '@/components/ui/modal';
import { DynamicForm, DynamicFormField } from '@/components/ui/dynamic-form';
import { z } from 'zod';
import { useDashboardDataContext } from '@/context/DashboardDataContext';
import type { UserRole } from '@/repositories/users';
import type { Database } from '@/lib/supabase';
import CardContainer from '@/components/shared/CardContainer';
import { useLanguage } from '@/context/LanguageContext';
import { cn } from '@/lib/utils';
import { useUserActions } from '../../../../hooks/dashboard/useUserActions';
import { UserCreateModal } from '../UserCreateModal';
import { UserDeleteModal } from '../UserDeleteModal';
import Error from './Error';

type UserRow = Database['public']['Tables']['users']['Row'];

export interface UserListProps {
  role: UserRole;
  title: string;
  /** Icon rendered next to the title */
  icon?: React.ElementType<{ className?: string }>;
  /** All form fields, including password (used for create) */
  fields: DynamicFormField[];
  /** Full Zod schema used for creation */
  schema: z.ZodObject<z.ZodRawShape>;
  /** Base path for the detail → link, e.g. "/dashboard/doctors" */
  detailBasePath?: string;
  /** Returns the badge text shown below each user's name */
  getSubtitle?: (user: UserRow) => string;
  /** Extracts user_metadata from form data */
  getMetadata?: (formData: Record<string, unknown>) => Record<string, unknown>;
  /** Returns default values to pre-fill the edit form */
  getDefaultEditValues?: (user: UserRow) => Record<string, unknown>;
}

export function UsersList({
  role,
  title,
  icon: Icon,
  fields,
  schema,
  detailBasePath,
  getSubtitle,
  getMetadata,
  getDefaultEditValues,
}: UserListProps) {
  const { users, usersLoading, usersError, profile, organization } =
    useDashboardDataContext();
  const { locale } = useLanguage();

  const filteredUsers = users.filter((u) => u.role === role);

  const {
    editFields,
    editSchema,
    isCreateOpen,
    isCreateSubmitting,
    isEditOpen,
    isDeleteOpen,
    selectedUser,
    isSubmitting,
    openCreate,
    closeCreate,
    openEdit,
    closeEdit,
    openDelete,
    closeDelete,
    handleCreate,
    handleEdit,
    handleDeleteConfirm,
    getDefaultEditValues: getEditDefaults,
  } = useUserActions({
    role,
    fields,
    schema,
    getMetadata,
    getDefaultEditValues,
  });

  if (usersLoading && filteredUsers.length === 0) return <Loading />;
  if (usersError) return <Error usersError={usersError} />;

  return (
    <>
      {/* Edit modal */}
      <UserCreateModal
        isOpen={isEditOpen}
        onClose={closeEdit}
        role={role}
        title={
          locale === 'ar'
            ? `تعديل المستخدم`
            : `Edit ${role.charAt(0).toUpperCase() + role.slice(1)}`
        }
        fields={editFields}
        schema={editSchema as z.ZodObject<z.ZodRawShape>}
        onCreateUser={async () => null}
        isLoading={isSubmitting}
        doctorId={profile?.user_id ?? ''}
        organizationId={organization?.id ?? ''}
        defaultValues={
          selectedUser && getEditDefaults
            ? getEditDefaults(selectedUser)
            : undefined
        }
        isEditMode
        editingUser={selectedUser}
        onUpdateUser={handleEdit}
      />

      {/* Delete modal */}
      <UserDeleteModal
        role={role}
        selectedUser={selectedUser}
        isDeleteOpen={isDeleteOpen}
        onDeleteConfirm={handleDeleteConfirm}
        onDeleteClose={closeDelete}
      />

      <Modal
        isOpen={isCreateOpen}
        onClose={closeCreate}
        title={
          locale === 'ar'
            ? `تسجيل ${role === 'doctor' ? 'طبيب' : 'مدير'}`
            : `Register ${role.charAt(0).toUpperCase() + role.slice(1)}`
        }
        size="lg"
      >
        <DynamicForm
          fields={fields}
          schema={schema}
          onSubmit={handleCreate}
          submitLabel={
            locale === 'ar'
              ? `تسجيل ${role === 'doctor' ? 'طبيب' : 'مدير'}`
              : `Register ${role.charAt(0).toUpperCase() + role.slice(1)}`
          }
          isLoading={isCreateSubmitting}
        />
      </Modal>

      <CardContainer className="overflow-hidden min-h-96">
        <CardHeader className="flex flex-col xs:flex-row items-center justify-between gap-2 pb-4">
          <div className="space-y-1">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              {Icon && <Icon className="h-5 w-5 text-primary" />}
              {title}
            </CardTitle>
            <CardDescription>
              {locale === 'ar'
                ? `${filteredUsers.length} مسجلين`
                : `${filteredUsers.length} registered`}
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => openCreate()}
            className="flex border-primary/20 hover:bg-primary/5 text-primary font-bold gap-2 rounded-xl"
          >
            <UserPlus className="h-4 w-4" />
            {locale === 'ar'
              ? `إضافة ${role === 'doctor' ? 'طبيب' : 'مدير'}`
              : `Add ${role.charAt(0).toUpperCase() + role.slice(1)}`}
          </Button>
        </CardHeader>

        <CardContent className="p-0">
          <div className="divide-y divide-border/50">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="group p-4 flex items-center justify-between hover:bg-muted/30 transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-primary/10 shadow-sm group-hover:scale-105 transition-transform duration-300">
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
                  <div>
                    <TypographyP className="m-0 font-bold text-foreground">
                      {user.name}
                    </TypographyP>
                    {getSubtitle && (
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] font-bold text-primary/60 uppercase tracking-widest bg-primary/5 px-2 py-0.5 rounded-full">
                          {getSubtitle(user)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEdit(user)}
                    className="h-8 w-8 hover:bg-primary/10 hover:text-primary rounded-lg"
                  >
                    <Edit className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openDelete(user)}
                    className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive rounded-lg"
                  >
                    <Trash className="h-3.5 w-3.5" />
                  </Button>
                  {detailBasePath && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-lg group/btn"
                      asChild
                    >
                      <Link href={`${detailBasePath}/${user.id}`}>
                        <ChevronRight
                          className={cn(
                            'h-3.5 w-3.5',
                            locale === 'ar' ? 'rotate-180' : '',
                          )}
                        />
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            ))}

            {filteredUsers.length === 0 && (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  {Icon && (
                    <Icon className="h-8 w-8 text-muted-foreground/30" />
                  )}
                </div>
                <TypographyP className="text-muted-foreground text-sm font-medium">
                  No {role}s found
                </TypographyP>
              </div>
            )}
          </div>
        </CardContent>
      </CardContainer>
    </>
  );
}
