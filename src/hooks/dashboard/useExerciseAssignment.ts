'use client';

import { useState } from 'react';
import {
  createExerciseAssignment,
  addAssignmentExercises,
  updateExerciseAssignment,
  replaceAssignmentExercises,
  getAssignmentByRole,
  getAssignmentExercises,
  getOrgAssignments,
} from '@/repositories/exercises';
import type { Database } from '@/lib/supabase';

type ExerciseAssignmentRow =
  Database['public']['Tables']['exercise_assignments']['Row'];
type AssignmentExerciseRow =
  Database['public']['Tables']['assignment_exercises']['Row'];

export interface ExerciseConfig {
  sets: number;
  reps: number;
  duration_seconds: number;
  frequency_per_day: number;
}

export interface AssignmentFormData {
  title: string;
  start_date: string;
  end_date?: string | null;
  status: string;
  notes?: string | null;
}

export interface ExerciseItem {
  exerciseId: string;
  orderIndex: number;
  config: ExerciseConfig;
}

export interface PatientAssignment {
  assignment: ExerciseAssignmentRow;
  exercises: AssignmentExerciseRow[];
}

export function useExerciseAssignment() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitAssignment = async (
    patientId: string,
    doctorId: string,
    organizationId: string,
    assignmentData: AssignmentFormData,
    exerciseItems: ExerciseItem[],
  ): Promise<ExerciseAssignmentRow | null> => {
    setIsSubmitting(true);
    setError(null);
    try {
      const assignment = await createExerciseAssignment({
        patient_id: patientId,
        doctor_id: doctorId,
        organization_id: organizationId,
        title: assignmentData.title,
        start_date: assignmentData.start_date,
        end_date: assignmentData.end_date ?? null,
        status: assignmentData.status,
        notes: assignmentData.notes ?? null,
      });

      await addAssignmentExercises(
        exerciseItems.map((item) => ({
          assignment_id: assignment.id,
          exercise_id: item.exerciseId,
          sets: item.config.sets,
          reps: item.config.reps,
          duration_seconds: item.config.duration_seconds,
          frequency_per_day: item.config.frequency_per_day,
          order_index: item.orderIndex,
        })),
      );

      return assignment;
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Failed to create assignment';
      setError(msg);
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  const loadOrgAssignments = async (
    orgId: string,
  ): Promise<PatientAssignment[] | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const assignment = await getOrgAssignments(orgId);
      if (!assignment) return null;
      const exercises = await Promise.all(
        assignment.map((a) => getAssignmentExercises(a.id)),
      );
      return assignment.map((a, index) => ({
        assignment: a,
        exercises: exercises[index],
      }));
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Failed to load assignment';
      setError(msg);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserAssignmentByRole = async (
    role: 'doctor' | 'patient',
    userId: string,
  ): Promise<PatientAssignment[] | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const assignment = await getAssignmentByRole(role, userId);
      if (!assignment) return null;
      const exercises = await Promise.all(
        assignment.map((a) => getAssignmentExercises(a.id)),
      );
      return assignment.map((a, index) => ({
        assignment: a,
        exercises: exercises[index],
      }));
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Failed to load assignment';
      setError(msg);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateAssignment = async (
    assignmentId: string,
    assignmentData: AssignmentFormData,
    exerciseItems: ExerciseItem[],
  ): Promise<ExerciseAssignmentRow | null> => {
    setIsSubmitting(true);
    setError(null);
    try {
      const assignment = await updateExerciseAssignment(assignmentId, {
        title: assignmentData.title,
        start_date: assignmentData.start_date,
        end_date: assignmentData.end_date ?? null,
        status: assignmentData.status,
        notes: assignmentData.notes ?? null,
      });

      await replaceAssignmentExercises(
        assignmentId,
        exerciseItems.map((item) => ({
          assignment_id: assignmentId,
          exercise_id: item.exerciseId,
          sets: item.config.sets,
          reps: item.config.reps,
          duration_seconds: item.config.duration_seconds,
          frequency_per_day: item.config.frequency_per_day,
          order_index: item.orderIndex,
        })),
      );

      return assignment;
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Failed to update assignment';
      setError(msg);
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    isLoading,
    error,
    submitAssignment,
    loadOrgAssignments,
    loadUserAssignmentByRole,
    updateAssignment,
  };
}
