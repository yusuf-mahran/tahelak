'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronDown, X, Minus, Plus } from 'lucide-react';
import { ExercisesGallery } from './ExercisesGallery';
import { useDashboardDataContext } from '@/context/DashboardDataContext';
import { cn } from '@/lib/utils';
import type { ExerciseConfig } from '@/hooks/dashboard/useExerciseAssignment';
import type { Database } from '@/lib/supabase';

type ExerciseRow = Database['public']['Tables']['exercises']['Row'];

export type ExerciseSelectionMap = Map<string, ExerciseConfig>;

const DEFAULT_CONFIG: ExerciseConfig = {
  sets: 3,
  reps: 10,
  duration_seconds: 0,
  frequency_per_day: 1,
};

interface ExerciseSelectionWithConfigProps {
  /** Map of exerciseId → ExerciseConfig (controlled) */
  value: ExerciseSelectionMap;
  onChange: (map: ExerciseSelectionMap) => void;
  /** Show required error state on the gallery */
  requiredError?: boolean;
}

// ─── NumberStepper ────────────────────────────────────────────────────────────

function NumberStepper({
  label,
  value,
  min,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground whitespace-nowrap">
        {label}
      </span>
      <div className="flex items-center rounded-xl border border-border bg-background shadow-sm">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          aria-label={`Decrease ${label}`}
          className="flex h-9 w-9 items-center justify-center rounded-l-xl text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <Minus className="h-3 w-3" />
        </button>
        <span className="w-10 select-none text-center text-sm font-bold tabular-nums text-foreground">
          {value}
        </span>
        <button
          type="button"
          onClick={() => onChange(value + 1)}
          aria-label={`Increase ${label}`}
          className="flex h-9 w-9 items-center justify-center rounded-r-xl text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <Plus className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}

// ─── ExerciseConfigCard ───────────────────────────────────────────────────────

function ExerciseConfigCard({
  exercise,
  config,
  index,
  isExpanded,
  onExpandToggle,
  onChange,
  onRemove,
  onDone,
}: {
  exercise: ExerciseRow;
  config: ExerciseConfig;
  index: number;
  isExpanded: boolean;
  onExpandToggle: () => void;
  onChange: (c: ExerciseConfig) => void;
  onRemove: () => void;
  onDone: () => void;
}) {
  const collapsedSummary = [
    `${config.sets}×${config.reps}`,
    config.duration_seconds > 0 ? `${config.duration_seconds}s` : null,
    `${config.frequency_per_day}/day`,
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6, scale: 0.97 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      className={cn(
        'rounded-2xl border-2 overflow-hidden transition-[border-color,box-shadow] duration-200',
        isExpanded
          ? 'border-primary/35 bg-card shadow-lg shadow-primary/6'
          : 'border-border/50 bg-muted/5 hover:border-border/70',
      )}
    >
      {/* ── Header ── */}
      <div className="flex items-center gap-2 px-3 py-3">
        {/* Expand toggle takes the main row */}
        <button
          type="button"
          onClick={onExpandToggle}
          aria-expanded={isExpanded}
          aria-controls={`exercise-panel-${exercise.id}`}
          className="flex flex-1 min-w-0 items-center gap-3 rounded-xl text-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          {/* Step badge */}
          <span
            className={cn(
              'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors duration-200',
              isExpanded
                ? 'bg-primary text-white shadow-sm shadow-primary/30'
                : 'bg-muted/60 text-muted-foreground',
            )}
          >
            {index + 1}
          </span>

          {/* Name */}
          <span className="flex-1 min-w-0 text-sm font-semibold text-foreground truncate">
            {exercise.name}
          </span>

          {/* Collapsed summary */}
          {!isExpanded && (
            <span className="shrink-0 text-[11px] font-medium text-muted-foreground tabular-nums">
              {collapsedSummary}
            </span>
          )}

          <ChevronDown
            className={cn(
              'h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200',
              isExpanded && 'rotate-180',
            )}
          />
        </button>

        {/* Remove button — separate from expand toggle */}
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${exercise.name}`}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-muted-foreground/40 transition-colors hover:bg-destructive/10 hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* ── Expanded config panel ── */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            id={`exercise-panel-${exercise.id}`}
            key="panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div className="border-t border-border/40 px-5 pb-5 pt-4 space-y-5">
              {/* Steppers */}
              <div className="flex flex-wrap justify-center gap-5">
                <NumberStepper
                  label="Sets"
                  value={config.sets}
                  min={1}
                  onChange={(v) => onChange({ ...config, sets: v })}
                />
                <NumberStepper
                  label="Reps"
                  value={config.reps}
                  min={0}
                  onChange={(v) => onChange({ ...config, reps: v })}
                />
                <NumberStepper
                  label="Duration (s)"
                  value={config.duration_seconds}
                  min={0}
                  onChange={(v) => onChange({ ...config, duration_seconds: v })}
                />
                <NumberStepper
                  label="Freq / day"
                  value={config.frequency_per_day}
                  min={1}
                  onChange={(v) =>
                    onChange({ ...config, frequency_per_day: v })
                  }
                />
              </div>

              {/* Done — collapses panel and advances to next exercise */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={onDone}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                  Done
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── ExerciseSelectionWithConfig ──────────────────────────────────────────────

export function ExerciseSelectionWithConfig({
  value,
  onChange,
  requiredError = false,
}: ExerciseSelectionWithConfigProps) {
  const { exercises } = useDashboardDataContext();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const selectedIds = new Set(value.keys());

  const handleToggle = (id: string) => {
    const next = new Map(value);
    if (next.has(id)) {
      next.delete(id);
      if (expandedId === id) {
        // Re-focus the last remaining exercise if any
        const remaining = [...next.keys()];
        setExpandedId(remaining[remaining.length - 1] ?? null);
      }
    } else {
      next.set(id, { ...DEFAULT_CONFIG });
      setExpandedId(id); // Auto-expand newly added exercise
    }
    onChange(next);
  };

  const handleConfigChange = (id: string, config: ExerciseConfig) => {
    const next = new Map(value);
    next.set(id, config);
    onChange(next);
  };

  const handleDone = (currentId: string) => {
    const keys = [...value.keys()];
    const nextId = keys[keys.indexOf(currentId) + 1] ?? null;
    setExpandedId(nextId);
  };

  const selectedExercises = [...value.keys()]
    .map((id) => exercises.find((e) => e.id === id))
    .filter((e): e is NonNullable<typeof e> => e !== undefined);

  return (
    <div className="space-y-6">
      <ExercisesGallery
        selectedIds={selectedIds}
        onToggle={handleToggle}
        requiredToSelect
        requiredError={requiredError}
      />

      <AnimatePresence>
        {selectedExercises.length > 0 && (
          <motion.section
            key="config-section"
            aria-label="Configure selected exercises"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.2 }}
            className="space-y-3"
          >
            {/* Section header */}
            <div className="flex items-center justify-between px-1">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Configure exercises
              </p>
              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary tabular-nums">
                {selectedExercises.length} selected
              </span>
            </div>

            {/* Vertical card flow */}
            <div className="space-y-2">
              <AnimatePresence mode="popLayout">
                {selectedExercises.map((exercise, i) => (
                  <ExerciseConfigCard
                    key={exercise.id}
                    exercise={exercise}
                    config={value.get(exercise.id)!}
                    index={i}
                    isExpanded={expandedId === exercise.id}
                    onExpandToggle={() =>
                      setExpandedId(
                        expandedId === exercise.id ? null : exercise.id,
                      )
                    }
                    onChange={(cfg) => handleConfigChange(exercise.id, cfg)}
                    onRemove={() => handleToggle(exercise.id)}
                    onDone={() => handleDone(exercise.id)}
                  />
                ))}
              </AnimatePresence>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}
