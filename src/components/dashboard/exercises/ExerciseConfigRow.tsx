'use client';

import { X } from 'lucide-react';
import type { ExerciseConfig } from '@/hooks/dashboard/useExerciseAssignment';
import type { Database } from '@/lib/supabase';

type ExerciseRow = Database['public']['Tables']['exercises']['Row'];

interface ExerciseConfigRowProps {
  exercise: ExerciseRow;
  config: ExerciseConfig;
  onChange: (config: ExerciseConfig) => void;
  onRemove: () => void;
}

const FIELDS: {
  key: keyof ExerciseConfig;
  label: string;
  min: number;
}[] = [
  { key: 'sets', label: 'Sets', min: 1 },
  { key: 'reps', label: 'Reps', min: 0 },
  { key: 'duration_seconds', label: 'Duration (s)', min: 0 },
  { key: 'frequency_per_day', label: 'Freq/day', min: 1 },
];

export function ExerciseConfigRow({
  exercise,
  config,
  onChange,
  onRemove,
}: ExerciseConfigRowProps) {
  const handleChange = (key: keyof ExerciseConfig, value: string) => {
    const num = parseInt(value, 10);
    onChange({ ...config, [key]: isNaN(num) ? 0 : num });
  };

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border/60 bg-muted/10 px-4 py-3">
      {/* Name */}
      <span className="min-w-30 flex-1 text-sm font-semibold text-foreground truncate">
        {exercise.name}
      </span>

      {/* Numeric inputs */}
      <div className="flex flex-wrap gap-2">
        {FIELDS.map(({ key, label, min }) => (
          <label key={key} className="flex flex-col items-center gap-1">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
              {label}
            </span>
            <input
              type="number"
              min={min}
              value={config[key]}
              onChange={(e) => handleChange(key, e.target.value)}
              className="w-16 rounded-lg border border-border bg-background px-2 py-1.5 text-center text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring/80"
            />
          </label>
        ))}
      </div>

      {/* Remove */}
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${exercise.name}`}
        className="ml-auto rounded-lg p-1.5 text-muted-foreground/60 transition-colors hover:bg-destructive/10 hover:text-destructive"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
