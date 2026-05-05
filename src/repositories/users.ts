import { Database } from '@/lib/supabase';
import {
  findMany,
  findOne,
  updateById,
  deleteById,
  queryWithFilters,
} from '@/lib/supabase/db';
import { adminSignUp } from './adminAuth';

export type UserRole = 'root' | 'manager' | 'doctor' | 'patient';

type UserInsert = Database['public']['Tables']['users']['Insert'];
type UserUpdate = Database['public']['Tables']['users']['Update'];

// ─── Read ─────────────────────────────────────────────────────────────────────

export const getProfileUser = async (userId: string) => {
  const { data, error } = await findOne('users', 'user_id', userId);
  if (error) throw new Error(error);
  return data;
};

export const getOrgUsers = async ({
  organizationId,
}: {
  organizationId: string;
}) => {
  const { data, error } = await findMany(
    'users',
    'organization_id',
    organizationId,
  );
  if (error) throw new Error(error);
  return data;
};

export const getOrgUsersByRole = async (
  organizationId: string,
  role: UserRole,
) => {
  const { data, error } = await queryWithFilters(
    'users',
    [
      { column: 'organization_id', operator: 'eq', value: organizationId },
      { column: 'role', operator: 'eq', value: role },
    ],
    { pageSize: 1000 },
  );
  if (error) throw new Error(error);
  return data;
};

export const getOrgUsersByRoles = async (
  organizationId: string,
  roles: UserRole[],
) => {
  const { data, error } = await queryWithFilters(
    'users',
    [
      { column: 'organization_id', operator: 'eq', value: organizationId },
      { column: 'role', operator: 'in', value: roles },
    ],
    { pageSize: 1000 },
  );
  if (error) throw new Error(error);
  return data;
};

export const getOrgUsersExcludingRole = async (
  organizationId: string,
  excludeRole: UserRole,
) => {
  const { data, error } = await queryWithFilters(
    'users',
    [
      { column: 'organization_id', operator: 'eq', value: organizationId },
      { column: 'role', operator: 'neq', value: excludeRole },
    ],
    { pageSize: 1000 },
  );
  if (error) throw new Error(error);
  return data;
};

// ─── Write ────────────────────────────────────────────────────────────────────

export const createUser = async (
  data: Omit<UserInsert, 'user_id'> & { password: string },
) => {
  const { password, ...safeUserData } = data;
  const { user: signUpUser } = await adminSignUp(
    safeUserData.email,
    password,
    safeUserData,
  );
  if (!signUpUser) throw new Error('Failed to create user in auth');

  const { data: createdUser, error } = await findOne(
    'users',
    'user_id',
    signUpUser.id,
  );
  if (error) throw new Error(error);
  if (!createdUser) {
    // If the user was created in auth but not in the database, we should ideally delete the auth user to avoid orphaned accounts. This is a bit complex, so for now we'll just throw an error and log it for manual cleanup.
    throw new Error(
      'Failed to create user in database after creating auth user',
    );
  }
  return createdUser;
};

export const updateUser = async (userId: string, data: UserUpdate) => {
  const { data: updatedUser, error } = await updateById('users', userId, data);
  if (error) throw new Error(error);
  return updatedUser;
};

export const removeUser = async (userId: string) => {
  const { data: success, error } = await deleteById('users', userId);
  if (error) throw new Error(error);
  return success;
};
