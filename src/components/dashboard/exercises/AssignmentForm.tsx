'use client';

import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import {
  ExerciseSelectionWithConfig,
  type ExerciseSelectionMap,
} from './ExerciseSelectionWithConfig';
import { Button } from '@/components/ui/button';
import { useDashboardDataContext } from '@/context/DashboardDataContext';
import type { ExerciseItem } from '@/hooks/dashboard/useExerciseAssignment';

const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'done', label: 'Done' },
  { value: 'cancelled', label: 'Cancelled' },
];

interface AssignmentFormProps {
  patientId: string;
  /** users.id (PK) of the doctor — FK for exercise_assignments.doctor_id */
  doctorId: string;
  organizationId: string;
  onSuccess: () => void;
  /** When true, loads and edits the patient's existing assignment */
  isEditMode?: boolean;
}

export function AssignmentForm({
  patientId,
  doctorId,
  organizationId,
  onSuccess,
  isEditMode = false,
}: AssignmentFormProps) {
  const today = new Date().toISOString().split('T')[0];

  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState('active');
  const [notes, setNotes] = useState('');
  const [exercises, setExercises] = useState<ExerciseSelectionMap>(new Map());
  const [exercisesError, setExercisesError] = useState(false);
  const [loadedAssignmentId, setLoadedAssignmentId] = useState<string | null>(
    null,
  );

  const {
    assignmentSubmitting: isSubmitting,
    assignmentLoading: isLoading,
    assignmentError: error,
    submitAssignment,
    loadUserAssignmentByRole,
    updateAssignment,
  } = useDashboardDataContext();

  // Pre-fill form when editing
  useEffect(() => {
    if (!isEditMode) return;
    loadUserAssignmentByRole('patient', patientId).then((result) => {
      if (!result || result.length === 0) return;
      const { assignment, exercises: assignmentExercises } = result[0];
      setLoadedAssignmentId(assignment.id);
      setTitle(assignment.title);
      setStartDate(assignment.start_date.split('T')[0]);
      setEndDate(assignment.end_date ? assignment.end_date.split('T')[0] : '');
      setStatus(assignment.status);
      setNotes(assignment.notes ?? '');

      const map: ExerciseSelectionMap = new Map();
      assignmentExercises.forEach((ae) => {
        map.set(ae.exercise_id, {
          sets: ae.sets,
          reps: ae.reps,
          duration_seconds: ae.duration_seconds,
          frequency_per_day: ae.frequency_per_day,
        });
      });
      setExercises(map);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditMode, patientId]);

  const buildExerciseItems = (): ExerciseItem[] =>
    [...exercises.entries()].map(([exerciseId, config], index) => ({
      exerciseId,
      orderIndex: index,
      config,
    }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (exercises.size === 0) {
      setExercisesError(true);
      return;
    }
    setExercisesError(false);

    const assignmentData = {
      title,
      start_date: startDate,
      end_date: endDate || null,
      status,
      notes: notes || null,
    };

    let result;
    if (isEditMode && loadedAssignmentId) {
      result = await updateAssignment(
        loadedAssignmentId,
        assignmentData,
        buildExerciseItems(),
      );
    } else {
      result = await submitAssignment(
        patientId,
        doctorId,
        organizationId,
        assignmentData,
        buildExerciseItems(),
      );
    }

    if (result) onSuccess();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Assignment fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Title */}
        <div className="sm:col-span-2 space-y-1.5">
          <label className="text-sm font-semibold text-muted-foreground/80">
            Title <span className="text-destructive">*</span>
          </label>
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Post-surgery recovery plan"
            className="h-10 w-full rounded-xl border border-border/60 bg-muted/20 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring/80"
          />
        </div>

        {/* Start date */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-muted-foreground/80">
            Start date <span className="text-destructive">*</span>
          </label>
          <input
            required
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="h-10 w-full rounded-xl border border-border/60 bg-muted/20 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring/80"
          />
        </div>

        {/* End date */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-muted-foreground/80">
            End date
          </label>
          <input
            type="date"
            value={endDate}
            min={startDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="h-10 w-full rounded-xl border border-border/60 bg-muted/20 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring/80"
          />
        </div>

        {/* Status */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-muted-foreground/80">
            Status <span className="text-destructive">*</span>
          </label>
          <select
            required
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="h-10 w-full rounded-xl border border-border/60 bg-muted/20 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring/80"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Notes */}
        <div className="sm:col-span-2 space-y-1.5">
          <label className="text-sm font-semibold text-muted-foreground/80">
            Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            placeholder="Optional clinical notes…"
            className="w-full rounded-xl border border-border/60 bg-muted/20 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring/80"
          />
        </div>
      </div>

      {/* Exercise selection + config */}
      <ExerciseSelectionWithConfig
        value={exercises}
        onChange={setExercises}
        requiredError={exercisesError}
      />

      {error && <p className="text-sm font-medium text-destructive">{error}</p>}

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isEditMode ? 'Update Assignment' : 'Create Assignment'}
      </Button>
    </form>
  );
}
