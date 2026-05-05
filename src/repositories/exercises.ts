import {
  findAll,
  findMany,
  insertOne,
  insertMany,
  updateById,
  deleteById,
  queryWithFilters,
} from '@/lib/supabase/db';
import type { Database } from '@/lib/supabase';

type ExerciseAssignmentInsert =
  Database['public']['Tables']['exercise_assignments']['Insert'];
type ExerciseAssignmentUpdate =
  Database['public']['Tables']['exercise_assignments']['Update'];
type AssignmentExerciseInsert =
  Database['public']['Tables']['assignment_exercises']['Insert'];

export const getOrgExercises = async () => {
  const { data, error } = await findAll('exercises');
  if (error) throw new Error(error);
  return data;
};

export const createExerciseAssignment = async (
  data: ExerciseAssignmentInsert,
) => {
  const { data: row, error } = await insertOne('exercise_assignments', data);
  if (error) throw new Error(error);
  return row!;
};

export const addAssignmentExercises = async (
  rows: AssignmentExerciseInsert[],
) => {
  const { data, error } = await insertMany('assignment_exercises', rows);
  if (error) throw new Error(error);
  return data ?? [];
};

export const getOrgAssignments = async (orgId: string) => {
  const { data } = await queryWithFilters(
    'exercise_assignments',
    [{ column: 'organization_id', operator: 'eq', value: orgId }],
    { pageSize: 1000, orderBy: 'created_at', ascending: false },
  );
  return data ?? null;
};

export const getAssignmentByRole = async (
  role: 'doctor' | 'patient',
  userId: string,
) => {
  const { data } = await queryWithFilters(
    'exercise_assignments',
    [
      {
        column: role === 'doctor' ? 'doctor_id' : 'patient_id',
        operator: 'eq',
        value: userId,
      },
    ],
    { pageSize: 1000, orderBy: 'created_at', ascending: false },
  );
  return data ?? [];
};

export const getAssignmentExercises = async (assignmentId: string) => {
  const { data, error } = await findMany(
    'assignment_exercises',
    'assignment_id',
    assignmentId,
  );
  if (error) throw new Error(error);
  return data ?? [];
};

export const updateExerciseAssignment = async (
  id: string,
  data: ExerciseAssignmentUpdate,
) => {
  const { data: row, error } = await updateById(
    'exercise_assignments',
    id,
    data,
  );
  if (error) throw new Error(error);
  return row!;
};

export const replaceAssignmentExercises = async (
  assignmentId: string,
  rows: AssignmentExerciseInsert[],
) => {
  const { data: existing } = await findMany(
    'assignment_exercises',
    'assignment_id',
    assignmentId,
  );
  await Promise.all(
    (existing ?? []).map((row) => deleteById('assignment_exercises', row.id)),
  );
  return addAssignmentExercises(rows);
};
