'use client';

import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';
import type { Database } from '@/lib/supabase';

type UserRow = Database['public']['Tables']['users']['Row'];

interface UserDeleteModalProps {
  role: string;
  selectedUser: UserRow | null;
  isDeleteOpen: boolean;
  onDeleteConfirm: () => Promise<void>;
  onDeleteClose: () => void;
}

export function UserDeleteModal({
  role,
  selectedUser,
  isDeleteOpen,
  onDeleteConfirm,
  onDeleteClose,
}: UserDeleteModalProps) {
  const { locale } = useLanguage();

  const roleLabel = role.charAt(0).toUpperCase() + role.slice(1);
  const roleAr =
    role === 'doctor' ? 'الطبيب' : role === 'manager' ? 'المدير' : roleLabel;

  return (
    <>
      <Modal
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        title={locale === 'ar' ? `حذف ${roleAr}` : `Delete ${roleLabel}`}
        size="sm"
        confirmClose={false}
      >
        <div className="flex flex-col gap-6">
          <p className="text-sm text-muted-foreground">
            {locale === 'ar'
              ? `هل أنت متأكد أنك تريد حذف ${selectedUser?.name ?? ''}؟ لا يمكن التراجع عن هذا الإجراء.`
              : `Are you sure you want to delete ${selectedUser?.name ?? ''}? This action cannot be undone.`}
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={onDeleteClose}>
              {locale === 'ar' ? 'إلغاء' : 'Cancel'}
            </Button>
            <Button variant="destructive" size="sm" onClick={onDeleteConfirm}>
              {locale === 'ar' ? 'حذف' : 'Delete'}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
