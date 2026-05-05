'use client';

export function SectionHeading({
  icon: Icon,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/10">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <span className="text-xs font-bold uppercase tracking-[0.12em] text-foreground/50">
        {label}
      </span>
      <div className="flex-1 h-px bg-border/50" />
    </div>
  );
}
