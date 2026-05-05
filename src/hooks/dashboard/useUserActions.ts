import { useState } from 'react';
import { z } from 'zod';
import { uploadImageToCloudinary } from '@/lib/cloudinary';
import { useDashboardDataContext } from '@/context/DashboardDataContext';
import type { Database, Json } from '@/lib/supabase';
import type { UserRole } from '@/repositories/users';
import type { DynamicFormField } from '@/components/ui/dynamic-form';

type UserRow = Database['public']['Tables']['users']['Row'];

interface UseUserActionsOptions {
  role: UserRole;
  fields: DynamicFormField[];
  schema: z.ZodObject<z.ZodRawShape>;
  getMetadata?: (formData: Record<string, unknown>) => Record<string, unknown>;
  getDefaultEditValues?: (user: UserRow) => Record<string, unknown>;
  /** Optional created_by user_id to attach to newly created users */
  createdBy?: string | null;
  /** Called after a user is successfully deleted (e.g., navigate back on detail page) */
  onAfterDelete?: () => void;
}

export function useUserActions({
  role,
  fields,
  schema,
  getMetadata,
  getDefaultEditValues,
  createdBy = null,
  onAfterDelete,
}: UseUserActionsOptions) {
  const { organization, addUser, editUser, deleteUser } =
    useDashboardDataContext();

  const editFields = fields.filter(
    (f) => f.name !== 'password' && f.name !== 'email',
  );
  const editSchema = schema
    .partial()
    .omit({ password: true, email: true } as Record<string, true>);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isCreateSubmitting, setIsCreateSubmitting] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserRow | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openCreate = () => setIsCreateOpen(true);
  const closeCreate = () => setIsCreateOpen(false);

  const openEdit = (user: UserRow) => {
    setSelectedUser(user);
    setIsEditOpen(true);
  };

  const closeEdit = () => {
    setIsEditOpen(false);
    setSelectedUser(null);
  };

  const openDelete = (user: UserRow) => {
    setSelectedUser(user);
    setIsDeleteOpen(true);
  };

  const closeDelete = () => {
    setIsDeleteOpen(false);
    setSelectedUser(null);
  };

  const handleCreate = async (
    formData: Record<string, unknown>,
  ): Promise<UserRow | null> => {
    if (!organization?.id) return null;
    setIsCreateSubmitting(true);
    try {
      let imageUrl: string | null = null;
      if (formData.image instanceof File) {
        const uploaded = await uploadImageToCloudinary(formData.image);
        if (uploaded) imageUrl = uploaded.secure_url;
      }
      const newUser = await addUser({
        name: formData.name as string,
        email: formData.email as string,
        password: formData.password as string,
        role,
        organization_id: organization.id,
        age: (formData.age as number) ?? null,
        user_metadata: (getMetadata?.(formData) ?? {}) as Json,
        profile_img: imageUrl,
        created_by: (formData.createdBy as string | null) ?? createdBy ?? null,
      } as Parameters<typeof addUser>[0]);
      return newUser ?? null;
    } catch (error) {
      console.error(`Error creating ${role}:`, error);
      return null;
    } finally {
      setIsCreateSubmitting(false);
    }
  };

  const handleEdit = async (
    formData: Record<string, unknown>,
  ): Promise<UserRow | null> => {
    if (!selectedUser) return null;
    setIsSubmitting(true);
    try {
      let imageUrl = selectedUser.profile_img;
      if (formData.image instanceof File) {
        const uploaded = await uploadImageToCloudinary(formData.image);
        if (uploaded) imageUrl = uploaded.secure_url;
      }
      const updated = await editUser(selectedUser.id, {
        name: formData.name as string,
        age: (formData.age as number) ?? null,
        user_metadata: {
          ...(selectedUser.user_metadata as Record<string, unknown>),
          ...(getMetadata?.(formData) ?? {}),
        } as Json,
        profile_img: imageUrl,
      });
      return updated ?? null;
    } catch (error) {
      console.error(`Error updating ${role}:`, error);
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedUser) return;
    try {
      await deleteUser(selectedUser.id);
      onAfterDelete?.();
    } catch (error) {
      console.error(`Error deleting ${role}:`, error);
    } finally {
      closeDelete();
    }
  };

  return {
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
    getDefaultEditValues,
  };
}
