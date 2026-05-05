'use client';

import { useState, useMemo } from 'react';
import { CardContent, CardHeader } from '@/components/ui/card';
import { DynamicFormField } from '@/components/ui/dynamic-form';
import CardContainer from '@/components/shared/CardContainer';
import { useDashboardDataContext } from '@/context/DashboardDataContext';
import type { UserRole } from '@/repositories/users';
import type { Database } from '@/lib/supabase';
import { z } from 'zod';
import { useLanguage } from '@/context/LanguageContext';
import { useUserActions } from '../../../../hooks/dashboard/useUserActions';
import { UserCreateModal } from '../UserCreateModal';
import { UserDeleteModal } from '../UserDeleteModal';
import { UsersTableToolbar } from './UsersTableToolbar';
import { UsersTableFilters } from './UsersTableFilters';
import { UsersTableHead, type SortKey, type SortDir } from './UsersTableHead';
import { UsersTableRow } from './UsersTableRow';
import TableSkeleton from './TableSkeleton';
import EmptyUsers from './EmptyUsers';

type UserRow = Database['public']['Tables']['users']['Row'];

export interface UsersTableProps {
  role: UserRole;
  title: string;
  icon?: React.ComponentType<{ className?: string }>;
  /** Column header + value extractor for role-specific detail */
  detailColumn?: {
    header: string;
    getValue: (user: UserRow) => string;
  };
  fields: DynamicFormField[];
  schema: z.ZodObject<z.ZodRawShape>;
  getMetadata?: (formData: Record<string, unknown>) => Record<string, unknown>;
  getDefaultEditValues?: (user: UserRow) => Record<string, unknown>;
}

export function UsersTable({
  role,
  title,
  icon: Icon,
  detailColumn,
  fields,
  schema,
  getMetadata,
  getDefaultEditValues,
}: UsersTableProps) {
  const { users, usersLoading, profile, organization } =
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
    createdBy:
      role === 'patient' && profile?.role === 'doctor'
        ? (profile?.user_id ?? null)
        : null,
  });

  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    joinedYears: [] as string[],
    ageRanges: [] as string[],
    detailValues: [] as string[],
  });

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const filterOptions = useMemo(() => {
    const joinedYears = [
      ...new Set(
        filteredUsers.map((u) =>
          new Date(u.created_at || '').getFullYear().toString(),
        ),
      ),
    ]
      .sort()
      .reverse();

    const detailValues = detailColumn
      ? [
          ...new Set(
            filteredUsers
              .map((u) => detailColumn.getValue(u))
              .filter((v) => v && v !== '—'),
          ),
        ].sort()
      : [];

    const ageBuckets = [
      { key: 'lt20', label: 'Under 20', test: (a: number) => a < 20 },
      {
        key: '20-29',
        label: '20 – 29',
        test: (a: number) => a >= 20 && a < 30,
      },
      {
        key: '30-39',
        label: '30 – 39',
        test: (a: number) => a >= 30 && a < 40,
      },
      {
        key: '40-49',
        label: '40 – 49',
        test: (a: number) => a >= 40 && a < 50,
      },
      { key: '50plus', label: '50+', test: (a: number) => a >= 50 },
    ].filter((b) => filteredUsers.some((u) => u.age != null && b.test(u.age)));

    return { joinedYears, detailValues, ageBuckets };
  }, [filteredUsers, detailColumn]);

  const activeFilterCount =
    filters.joinedYears.length +
    filters.ageRanges.length +
    filters.detailValues.length;

  const toggleFilter = (
    key: keyof typeof filters,
    val: string,
    checked: boolean,
  ) => {
    setFilters((f) => {
      const current = f[key] as string[];
      return {
        ...f,
        [key]: checked ? [...current, val] : current.filter((v) => v !== val),
      };
    });
  };

  const visibleUsers = filteredUsers
    .filter((u) => {
      if (
        search &&
        !u.name.toLowerCase().includes(search.toLowerCase()) &&
        !u.email.toLowerCase().includes(search.toLowerCase())
      )
        return false;
      if (
        filters.joinedYears.length > 0 &&
        !filters.joinedYears.includes(
          new Date(u.created_at || '').getFullYear().toString(),
        )
      )
        return false;
      if (
        filters.detailValues.length > 0 &&
        detailColumn &&
        !filters.detailValues.includes(detailColumn.getValue(u))
      )
        return false;
      if (filters.ageRanges.length > 0) {
        const age = u.age ?? null;
        if (age === null) return false;
        if (
          !filters.ageRanges.some((rk) =>
            filterOptions.ageBuckets.find((b) => b.key === rk)?.test(age),
          )
        )
          return false;
      }
      return true;
    })
    .sort((a, b) => {
      let av: string | number = '';
      let bv: string | number = '';
      if (sortKey === 'name') {
        av = a.name.toLowerCase();
        bv = b.name.toLowerCase();
      } else if (sortKey === 'email') {
        av = a.email.toLowerCase();
        bv = b.email.toLowerCase();
      } else if (sortKey === 'age') {
        av = a.age ?? -1;
        bv = b.age ?? -1;
      } else {
        av = a.created_at ?? '';
        bv = b.created_at ?? '';
      }
      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

  const roleLabel = role.charAt(0).toUpperCase() + role.slice(1);

  return (
    <>
      {/* User creation modal */}
      <UserCreateModal
        isOpen={isCreateOpen}
        onClose={closeCreate}
        role={role}
        title={`Add New ${roleLabel}`}
        fields={fields}
        schema={schema}
        onCreateUser={handleCreate}
        isLoading={isCreateSubmitting}
        isRoot={profile?.role === 'root'}
        doctors={users.filter((u) => u.role === 'doctor')}
        doctorId={profile?.user_id ?? ''}
        organizationId={organization?.id ?? ''}
      />

      {/* Edit modal */}
      <UserCreateModal
        isOpen={isEditOpen}
        onClose={closeEdit}
        role={role}
        title={locale === 'ar' ? `تعديل ${roleLabel}` : `Edit ${roleLabel}`}
        fields={editFields}
        schema={editSchema as z.ZodObject<z.ZodRawShape>}
        onCreateUser={async () => null}
        isLoading={isSubmitting}
        doctorId={profile?.user_id ?? ''}
        organizationId={organization?.id ?? ''}
        defaultValues={
          selectedUser ? getEditDefaults?.(selectedUser) : undefined
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

      <CardContainer className="border-none shadow-none overflow-hidden">
        <CardHeader className="px-0 flex flex-col gap-3 pb-4 pt-0">
          <UsersTableToolbar
            title={title}
            Icon={Icon}
            totalCount={filteredUsers.length}
            visibleCount={visibleUsers.length}
            search={search}
            onSearchChange={setSearch}
            activeFilterCount={activeFilterCount}
            showFilters={showFilters}
            onToggleFilters={() => setShowFilters((v) => !v)}
            onAddClick={openCreate}
          />
          <UsersTableFilters
            show={showFilters}
            filterOptions={filterOptions}
            filters={filters}
            detailColumnHeader={detailColumn?.header}
            activeFilterCount={activeFilterCount}
            onToggleFilter={toggleFilter}
            onClearFilters={() =>
              setFilters({ joinedYears: [], ageRanges: [], detailValues: [] })
            }
          />
        </CardHeader>

        <CardContent className="p-0">
          {usersLoading && filteredUsers.length === 0 ? (
            <TableSkeleton
              sortKey={sortKey}
              sortDir={sortDir}
              toggleSort={toggleSort}
              detailColumn={detailColumn}
            />
          ) : visibleUsers.length === 0 ? (
            <EmptyUsers
              role={role}
              Icon={Icon}
              search={search}
              activeFilterCount={activeFilterCount}
              setSearch={setSearch}
              setFilters={setFilters}
              openCreate={openCreate}
            />
          ) : (
            <div className="overflow-x-auto  min-h-[30dvh] rounded-xl overflow-hidden">
              <table className="w-full text-sm h-full">
                <UsersTableHead
                  sortKey={sortKey}
                  sortDir={sortDir}
                  onSort={toggleSort}
                  detailColumn={detailColumn}
                />
                <tbody>
                  {visibleUsers.map((user) => (
                    <UsersTableRow
                      key={user.id}
                      user={user}
                      role={role}
                      detailColumn={detailColumn}
                      onEdit={openEdit}
                      onDelete={openDelete}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </CardContainer>
    </>
  );
}
