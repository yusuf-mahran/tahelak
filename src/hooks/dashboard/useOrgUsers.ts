'use client';

import { useCallback, useState } from 'react';
import { Database } from '@/lib/supabase';
import {
  type UserRole,
  getOrgUsers,
  getOrgUsersByRole,
  getOrgUsersByRoles,
  getOrgUsersExcludingRole,
  getProfileUser,
  updateUser,
  removeUser,
} from '@/repositories/users';
import { adminSignUp } from '@/repositories/adminAuth';

type UserRow = Database['public']['Tables']['users']['Row'];
type UserInsert = Database['public']['Tables']['users']['Insert'];
type UserUpdate = Database['public']['Tables']['users']['Update'];

export const useOrgUsers = () => {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAllOrgUsers = useCallback(async (orgId: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getOrgUsers({ organizationId: orgId });
      setUsers(data ?? []);
      return data;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch users';
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUsersByRole = useCallback(
    async (orgId: string, role: UserRole) => {
      try {
        setLoading(true);
        setError(null);
        const data = await getOrgUsersByRole(orgId, role);
        setUsers(data ?? []);
        return data;
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : 'Failed to fetch users';
        setError(msg);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const fetchUsersByRoles = useCallback(
    async (orgId: string, roles: UserRole[]) => {
      try {
        setLoading(true);
        setError(null);
        const data = await getOrgUsersByRoles(orgId, roles);
        setUsers(data ?? []);
        return data;
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : 'Failed to fetch users';
        setError(msg);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const fetchUsersExcludingRole = useCallback(
    async (orgId: string, excludeRole: UserRole) => {
      try {
        setLoading(true);
        setError(null);
        const data = await getOrgUsersExcludingRole(orgId, excludeRole);
        setUsers(data ?? []);
        return data;
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : 'Failed to fetch users';
        setError(msg);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const addUser = useCallback(
    async (
      data: UserInsert & { password: string },
    ): Promise<UserRow | null> => {
      try {
        setLoading(true);
        setError(null);
        const { password, ...safeData } = data;
        const { user: authUser } = await adminSignUp(safeData.email, password, {
          orgId: safeData.organization_id,
          userName: safeData.name,
          usrAge: safeData.age || null,
          usrImg: safeData.profile_img || null,
          usrMetadata: safeData.user_metadata,
          usrCreatedBy: safeData.created_by || null,
          ...safeData,
        } as Omit<UserInsert, 'id' | 'user_id'>);
        // adminSignUp creates the auth user; a DB trigger creates the users row.
        // Fetch the actual users table row so callers get the correct DB PK (id).
        const newUser = await getProfileUser(authUser.id);
        if (newUser) setUsers((prev) => [...prev, newUser]);
        return newUser;
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : 'Failed to create user';
        setError(msg);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const editUser = useCallback(async (userId: string, data: UserUpdate) => {
    try {
      setLoading(true);
      setError(null);
      const updated = await updateUser(userId, data);
      if (updated)
        setUsers((prev) => prev.map((u) => (u.id === userId ? updated : u)));
      return updated;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to update user';
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteUser = useCallback(async (userId: string) => {
    try {
      setLoading(true);
      setError(null);
      await removeUser(userId);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      return true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to delete user';
      setError(msg);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const filterByRole = useCallback(
    (role: UserRole) => users.filter((u) => u.role === role),
    [users],
  );

  const resetUsers = useCallback(() => setUsers([]), []);

  return {
    users,
    loading,
    error,
    fetchAllOrgUsers,
    fetchUsersByRole,
    fetchUsersByRoles,
    fetchUsersExcludingRole,
    addUser,
    editUser,
    deleteUser,
    filterByRole,
    resetUsers,
  };
};
