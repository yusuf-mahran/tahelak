'use client';

import { useState, useMemo } from 'react';
import { Search, Dumbbell } from 'lucide-react';
import { LottiePreview } from './LottiePreview';
import { useDashboardDataContext } from '@/context/DashboardDataContext';

interface ExercisesGalleryProps {
  /** Controlled selection set (exercise IDs) — when provided, component uses this instead of internal state */
  selectedIds?: Set<string>;
  /** Controlled toggle handler — called with exercise.id */
  onToggle?: (id: string) => void;
  /** Whether selecting at least one exercise is required (for form validation) */
  requiredToSelect?: boolean;
  requiredError?: boolean;
}

export function ExercisesGallery({
  selectedIds: externalSelectedIds,
  onToggle: externalOnToggle,
  requiredToSelect = false,
  requiredError = false,
}: ExercisesGalleryProps = {}) {
  const [search, setSearch] = useState('');
  const [internalSelectedIds, setInternalSelectedIds] = useState<Set<string>>(
    new Set(),
  );

  const { exercises } = useDashboardDataContext();

  const isControlled = externalSelectedIds !== undefined;
  const selectedIds = isControlled ? externalSelectedIds : internalSelectedIds;

  const toggleSelect = (id: string) => {
    if (isControlled) {
      externalOnToggle?.(id);
    } else {
      setInternalSelectedIds((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      });
    }
  };

  const visible = useMemo(
    () =>
      exercises.filter((e) =>
        e.name.toLowerCase().includes(search.toLowerCase()),
      ),
    [search, exercises],
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Dumbbell className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold text-foreground">Exercises</h2>
          <span className="text-xs font-semibold text-muted-foreground bg-muted/40 px-2 py-0.5 rounded-full">
            {visible.length}
          </span>
          {requiredToSelect && (
            <span className="text-xs font-semibold text-destructive bg-destructive/10 px-2 py-0.5 rounded-full">
              required
            </span>
          )}
          {selectedIds.size > 0 && (
            <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
              {selectedIds.size} selected
            </span>
          )}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-56">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/50 pointer-events-none" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search exercises…"
            className="h-8 w-full rounded-lg border border-border bg-muted/30 pl-8 pr-3 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring/80"
          />
        </div>
      </div>

      {requiredToSelect && requiredError && (
        <p className="text-[11px] font-bold text-destructive px-1">
          Please select at least 1 exercise.
        </p>
      )}

      {/* Grid */}
      {visible.length > 0 ? (
        <div className="max-h-96 overflow-y-auto rounded-xl border border-border/50 p-3 bg-muted/10">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {visible.map((exercise) => (
              <LottiePreview
                key={exercise.id}
                src={exercise.src}
                name={exercise.name}
                selected={selectedIds.has(exercise.id)}
                onSelect={() => toggleSelect(exercise.id)}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Dumbbell className="h-12 w-12 text-muted-foreground/20 mb-3" />
          <p className="text-sm text-muted-foreground font-medium">
            No exercises match &ldquo;{search}&rdquo;
          </p>
        </div>
      )}
    </div>
  );
}
