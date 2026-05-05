'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from '../auth/useAuth';
import { useProfile } from './useProfile';
import { useOrg } from './useOrg';
import { useOrgUsers } from './useOrgUsers';
import { useExercises } from './useExercises';
import {
  PatientAssignment,
  useExerciseAssignment,
} from './useExerciseAssignment';
import { getProfileUser } from '@/repositories/users';
import type { UserRole } from '@/repositories/users';
import type { Database } from '@/lib/supabase';

type UserRow = Database['public']['Tables']['users']['Row'];

export const useDashboardData = () => {
  const { user } = useAuth();

  const {
    profile,
    loading: profileLoading,
    error: profileError,
    fetchProfile,
    resetProfile,
  } = useProfile();

  const {
    organization,
    loading: orgLoading,
    error: orgError,
    fetchOrganization,
    updateOrganization,
    resetOrg,
  } = useOrg();

  const {
    users,
    loading: usersLoading,
    error: usersError,
    fetchAllOrgUsers,
    fetchUsersExcludingRole,
    fetchUsersByRole,
    addUser,
    editUser,
    deleteUser,
    filterByRole,
    resetUsers,
  } = useOrgUsers();

  const {
    exercises,
    loading: exercisesLoading,
    error: exercisesError,
    fetchExercises,
    resetExercises,
  } = useExercises();

  const {
    isSubmitting: assignmentSubmitting,
    isLoading: assignmentLoading,
    error: assignmentError,
    submitAssignment,
    loadOrgAssignments,
    loadUserAssignmentByRole,
    updateAssignment,
  } = useExerciseAssignment();

  const [doctor, setDoctor] = useState<UserRow | null>(null);
  const [assignments, setAssignments] = useState<PatientAssignment[] | null>(
    null,
  );
  const [initialized, setInitialized] = useState(false);
  const fetchedRef = useRef(false);

  // ─── Logout cleanup ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!user?.id) {
      fetchedRef.current = false;
      setInitialized(false);
      setDoctor(null);
      resetProfile();
      resetOrg();
      resetUsers();
      resetExercises();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const role = (profile?.role as UserRole) ?? null;

  const loading =
    profileLoading || orgLoading || usersLoading || exercisesLoading;
  const error = profileError || orgError || usersError || exercisesError;

  // Fetch role-specific data after profile is loaded
  const fetchRoleData = useCallback(
    async (userProfile: UserRow) => {
      const orgId = userProfile.organization_id;
      const userRole = userProfile.role as UserRole;

      switch (userRole) {
        case 'root':
          await Promise.all([
            fetchOrganization(orgId),
            fetchAllOrgUsers(orgId),
            fetchExercises(),
            loadOrgAssignments(orgId).then(setAssignments),
          ]);
          break;

        case 'manager':
          await Promise.all([
            fetchOrganization(orgId),
            fetchUsersExcludingRole(orgId, 'root'),
            fetchExercises(),
            loadOrgAssignments(orgId),
          ]);
          break;

        case 'doctor':
          await Promise.all([
            fetchOrganization(orgId),
            fetchUsersByRole(orgId, 'patient'),
            fetchExercises(),
            loadUserAssignmentByRole('doctor', userProfile.user_id).then(
              setAssignments,
            ),
          ]);
          break;

        case 'patient':
          await Promise.all([
            fetchOrganization(orgId),
            fetchExercises(),
            loadUserAssignmentByRole('patient', userProfile.user_id).then(
              setAssignments,
            ),
            userProfile.created_by
              ? getProfileUser(userProfile.created_by).then(setDoctor)
              : Promise.resolve(),
          ]);
          break;
      }
    },
    [
      fetchOrganization,
      fetchAllOrgUsers,
      fetchUsersExcludingRole,
      fetchUsersByRole,
      fetchExercises,
      loadOrgAssignments,
      loadUserAssignmentByRole,
    ],
  );

  // Bootstrap: profile → role-specific data
  useEffect(() => {
    if (!user?.id || fetchedRef.current) return;
    fetchedRef.current = true;

    const init = async () => {
      const userProfile = await fetchProfile(user.id);
      if (userProfile) {
        await fetchRoleData(userProfile);
      }
      setInitialized(true);
    };

    init();
  }, [user?.id, fetchProfile, fetchRoleData]);

  // Refresh all data
  const refresh = useCallback(async () => {
    if (!user?.id) return;
    fetchedRef.current = false;
    const userProfile = await fetchProfile(user.id);
    if (userProfile) {
      await fetchRoleData(userProfile);
    }
  }, [user, fetchProfile, fetchRoleData]);

  return {
    // Auth
    role,
    initialized,

    // Profile
    profile,
    profileLoading,
    profileError,

    // Organization (root & manager)
    organization,
    orgLoading,
    orgError,
    updateOrganization,

    // Users
    users,
    usersLoading,
    usersError,
    filterByRole,

    // Patient's doctor
    doctor,

    // Exercises (doctor & patient)
    exercises,

    // Assignment CRUD
    assignments,
    assignmentSubmitting,
    assignmentLoading,
    assignmentError,
    submitAssignment,
    loadOrgAssignments,
    loadUserAssignmentByRole,
    updateAssignment,

    // User CRUD
    addUser,
    editUser,
    deleteUser,

    // State
    loading,
    error,

    // Refresh
    refresh,
  };
};
