'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Trash2,
  Calendar,
  Clock,
  FileText,
  ArrowRight,
  Stethoscope,
  AlertCircle,
  MessageSquare,
  Check,
  Droplets,
  Activity,
  Heart,
  Flame,
  ArrowUpDown,
  Wind,
  Scale,
  Zap,
  Pill,
  Thermometer,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { SectionHeading } from './SectionHeading';

// ─── Exported types ───────────────────────────────────────────────────────────

export interface PTHistoryEntry {
  id: string;
  startDate: string;
  duration: string;
  notes: string;
}

export interface MedicalHistoryData {
  complaint: string;
  hasPhysicalTherapyHistory: boolean;
  ptHistory: PTHistoryEntry[];
  selectedDiseases: string[];
  otherDiseases: string;
  additionalNotes: string;
}

// ─── Chronic disease catalog ──────────────────────────────────────────────────

const DISEASES = [
  {
    id: 'diabetes',
    label: 'Diabetes',
    labelAr: 'السكري',
    icon: Droplets,
  },
  {
    id: 'hypertension',
    label: 'Hypertension',
    labelAr: 'ضغط الدم',
    icon: Activity,
  },
  {
    id: 'heart_disease',
    label: 'Heart Disease',
    labelAr: 'أمراض القلب',
    icon: Heart,
  },
  {
    id: 'arthritis',
    label: 'Arthritis',
    labelAr: 'التهاب المفاصل',
    icon: Flame,
  },
  {
    id: 'back_pain',
    label: 'Back Pain',
    labelAr: 'آلام الظهر',
    icon: ArrowUpDown,
  },
  {
    id: 'asthma',
    label: 'Asthma / COPD',
    labelAr: 'الربو / الرئة',
    icon: Wind,
  },
  {
    id: 'obesity',
    label: 'Obesity',
    labelAr: 'السمنة',
    icon: Scale,
  },
  {
    id: 'neurological',
    label: 'Neurological',
    labelAr: 'حالة عصبية',
    icon: Zap,
  },
  {
    id: 'post_surgery',
    label: 'Post-Surgery',
    labelAr: 'ما بعد العملية',
    icon: Pill,
  },
  {
    id: 'thyroid',
    label: 'Thyroid',
    labelAr: 'الغدة الدرقية',
    icon: Thermometer,
  },
] as const;

// ─── PTSessionCard ────────────────────────────────────────────────────────────

interface PTSessionErrors {
  startDate?: string;
  duration?: string;
}

function PTSessionCard({
  session,
  index,
  isAr,
  fieldErrors,
  onChange,
  onRemove,
}: {
  session: PTHistoryEntry;
  index: number;
  isAr: boolean;
  fieldErrors?: PTSessionErrors;
  onChange: (s: PTHistoryEntry) => void;
  onRemove: () => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97, y: -4 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="rounded-2xl border border-border/50 bg-muted/5 p-4 space-y-3"
    >
      {/* Header row */}
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
            {index + 1}
          </span>
          {isAr ? 'جلسة علاج' : 'Session'}
        </span>
        <button
          type="button"
          onClick={onRemove}
          aria-label={isAr ? 'إزالة الجلسة' : 'Remove session'}
          className="rounded-lg p-1.5 text-muted-foreground/40 transition-colors hover:bg-destructive/10 hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Date + Duration */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            <Calendar className="h-3 w-3" />
            {isAr ? 'تاريخ البدء' : 'Start Date'}
          </label>
          <input
            type="date"
            value={session.startDate}
            onChange={(e) =>
              onChange({ ...session, startDate: e.target.value })
            }
            aria-invalid={!!fieldErrors?.startDate}
            className={cn(
              'w-full rounded-xl border bg-background px-3 py-2 text-sm text-foreground scheme-light dark:scheme-dark focus:outline-none focus:ring-2 focus:ring-primary/60',
              fieldErrors?.startDate ? 'border-destructive' : 'border-border',
            )}
          />
          {fieldErrors?.startDate && (
            <p className="mt-1 text-xs font-semibold text-destructive">
              {fieldErrors.startDate}
            </p>
          )}
        </div>
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            <Clock className="h-3 w-3" />
            {isAr ? 'المدة' : 'Duration'}
          </label>
          <input
            type="text"
            value={session.duration}
            onChange={(e) => onChange({ ...session, duration: e.target.value })}
            placeholder={isAr ? 'مثال: 3 أشهر' : 'e.g. 3 months'}
            aria-invalid={!!fieldErrors?.duration}
            className={cn(
              'w-full rounded-xl border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/60',
              fieldErrors?.duration ? 'border-destructive' : 'border-border',
            )}
          />
          {fieldErrors?.duration && (
            <p className="mt-1 text-xs font-semibold text-destructive">
              {fieldErrors.duration}
            </p>
          )}
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-1.5">
        <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          <FileText className="h-3 w-3" />
          {isAr ? 'ملاحظات' : 'Notes'}
          <span className="normal-case tracking-normal font-normal text-muted-foreground/50">
            ({isAr ? 'اختياري' : 'optional'})
          </span>
        </label>
        <textarea
          value={session.notes}
          onChange={(e) => onChange({ ...session, notes: e.target.value })}
          rows={2}
          placeholder={
            isAr ? 'أي تفاصيل إضافية عن الجلسة...' : 'Any additional details…'
          }
          className="w-full resize-none rounded-xl border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/60"
        />
      </div>
    </motion.div>
  );
}

// ─── MedicalHistoryForm ───────────────────────────────────────────────────────

interface MedicalHistoryFormProps {
  onSubmit: (data: MedicalHistoryData) => void | Promise<void>;
  locale?: string;
  initialValues?: MedicalHistoryData;
  submitLabel?: string;
}

export function MedicalHistoryForm({
  onSubmit,
  locale,
  initialValues,
  submitLabel,
}: MedicalHistoryFormProps) {
  const isAr = locale === 'ar';

  const [complaint, setComplaint] = useState(initialValues?.complaint ?? '');
  const [hasHistory, setHasHistory] = useState<boolean | null>(
    initialValues != null ? initialValues.hasPhysicalTherapyHistory : null,
  );
  const [ptSessions, setPtSessions] = useState<PTHistoryEntry[]>(
    initialValues?.ptHistory?.length
      ? initialValues.ptHistory.map((e) => ({
          id: e.id || crypto.randomUUID(),
          startDate: e.startDate,
          duration: e.duration,
          notes: e.notes,
        }))
      : [],
  );
  const [selectedDiseases, setSelectedDiseases] = useState<string[]>(
    initialValues?.selectedDiseases ?? [],
  );
  const [otherDiseases, setOtherDiseases] = useState(
    initialValues?.otherDiseases ?? '',
  );
  const [additionalNotes, setAdditionalNotes] = useState(
    initialValues?.additionalNotes ?? '',
  );
  const [errors, setErrors] = useState<{ complaint?: string }>({});
  const [sessionErrors, setSessionErrors] = useState<
    Record<string, PTSessionErrors>
  >({});

  const addSession = () => {
    setPtSessions((prev) => [
      ...prev,
      { id: crypto.randomUUID(), startDate: '', duration: '', notes: '' },
    ]);
  };

  const updateSession = (id: string, updated: PTHistoryEntry) => {
    setPtSessions((prev) => prev.map((s) => (s.id === id ? updated : s)));
    // Clear field-level errors as the user fills them in
    setSessionErrors((prev) => {
      if (!prev[id]) return prev;
      const next = { ...prev[id] };
      if (updated.startDate) delete next.startDate;
      if (updated.duration) delete next.duration;
      return { ...prev, [id]: next };
    });
  };

  const removeSession = (id: string) => {
    setPtSessions((prev) => {
      const next = prev.filter((s) => s.id !== id);
      if (next.length === 0) setHasHistory(false);
      return next;
    });
  };

  const toggleDisease = (id: string) => {
    setSelectedDiseases((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id],
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};
    if (!complaint.trim()) {
      newErrors.complaint = isAr
        ? 'يرجى وصف الشكوى الرئيسية'
        : 'Please describe the main complaint';
    }

    // Validate each PT session requires start date + duration
    const newSessionErrors: Record<string, PTSessionErrors> = {};
    if (hasHistory === true) {
      for (const session of ptSessions) {
        const fe: PTSessionErrors = {};
        if (!session.startDate)
          fe.startDate = isAr ? 'أدخل تاريخ البدء' : 'Start date is required';
        if (!session.duration.trim())
          fe.duration = isAr ? 'أدخل المدة' : 'Duration is required';
        if (fe.startDate || fe.duration) newSessionErrors[session.id] = fe;
      }
    }

    if (
      Object.keys(newErrors).length > 0 ||
      Object.keys(newSessionErrors).length > 0
    ) {
      setErrors(newErrors);
      setSessionErrors(newSessionErrors);
      return;
    }
    onSubmit({
      complaint: complaint.trim(),
      hasPhysicalTherapyHistory: hasHistory === true,
      ptHistory: hasHistory === true ? ptSessions : [],
      selectedDiseases,
      otherDiseases: otherDiseases.trim(),
      additionalNotes: additionalNotes.trim(),
    });
  };

  return (
    <form onSubmit={handleSubmit} dir={isAr ? 'rtl' : undefined} noValidate>
      <div className="px-6 pb-8 pt-7 space-y-8">
        {/* ── Section 1: Complaint ── */}
        <div>
          <SectionHeading
            icon={MessageSquare}
            label={isAr ? 'الشكوى الرئيسية' : 'Main Complaint'}
          />
          <div>
            <textarea
              value={complaint}
              onChange={(e) => {
                setComplaint(e.target.value);
                if (e.target.value.trim()) {
                  setErrors((prev) => ({ ...prev, complaint: undefined }));
                }
              }}
              rows={3}
              placeholder={
                isAr
                  ? 'صف شكوى المريض الرئيسية — مكان الألم، متى بدأ، وشدته...'
                  : "Describe the patient's main complaint — pain location, onset, and severity…"
              }
              aria-invalid={!!errors.complaint}
              className={cn(
                'w-full resize-none rounded-2xl border bg-muted/5 px-4 py-3 text-sm placeholder:text-muted-foreground/40 transition-shadow focus:outline-none focus:ring-2 focus:ring-primary/60',
                errors.complaint ? 'border-destructive' : 'border-border',
              )}
            />
            <AnimatePresence>
              {errors.complaint && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-1.5 px-1 text-xs font-semibold text-destructive"
                >
                  {errors.complaint}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── Section 2: Physical Therapy History ── */}
        <div>
          <SectionHeading
            icon={Stethoscope}
            label={isAr ? 'تاريخ العلاج الطبيعي' : 'Physical Therapy History'}
          />

          {/* Yes / No toggle */}
          <div
            role="group"
            aria-label={
              isAr
                ? 'هل يوجد تاريخ سابق للعلاج الطبيعي؟'
                : 'Previous physical therapy?'
            }
            className="inline-flex w-full overflow-hidden rounded-xl border border-border/50 text-sm font-semibold"
          >
            {(
              [
                { v: false, label: isAr ? 'لا' : 'No' },
                { v: true, label: isAr ? 'نعم' : 'Yes' },
              ] as const
            ).map(({ v, label }) => (
              <button
                key={String(v)}
                type="button"
                role="radio"
                aria-checked={hasHistory === v}
                onClick={() => {
                  setHasHistory(v);
                  if (v && ptSessions.length === 0) {
                    setPtSessions([
                      {
                        id: crypto.randomUUID(),
                        startDate: '',
                        duration: '',
                        notes: '',
                      },
                    ]);
                  }
                }}
                className={cn(
                  'flex flex-1 items-center justify-center gap-2 py-2.5 transition-colors',
                  hasHistory === v
                    ? 'bg-primary text-white'
                    : 'bg-background text-muted-foreground hover:bg-muted/30',
                  v ? 'border-s border-border/50' : '',
                )}
              >
                {hasHistory === v && v && (
                  <Check className="h-3.5 w-3.5" strokeWidth={3} />
                )}
                {label}
              </button>
            ))}
          </div>

          {/* Session list (animated) */}
          <AnimatePresence initial={false}>
            {hasHistory === true && (
              <motion.div
                key="sessions"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.28, ease: 'easeInOut' }}
                style={{ overflow: 'hidden' }}
              >
                <div className="mt-4 space-y-3">
                  <AnimatePresence mode="popLayout">
                    {ptSessions.map((session, i) => (
                      <PTSessionCard
                        key={session.id}
                        session={session}
                        index={i}
                        isAr={isAr}
                        fieldErrors={sessionErrors[session.id]}
                        onChange={(updated) =>
                          updateSession(session.id, updated)
                        }
                        onRemove={() => removeSession(session.id)}
                      />
                    ))}
                  </AnimatePresence>

                  <button
                    type="button"
                    onClick={addSession}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border/50 py-3 text-sm font-semibold text-muted-foreground transition-colors hover:border-primary/40 hover:bg-primary/3 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <Plus className="h-4 w-4" />
                    {isAr ? 'إضافة جلسة أخرى' : 'Add another session'}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Section 3: Chronic Diseases ── */}
        <div>
          <SectionHeading
            icon={AlertCircle}
            label={isAr ? 'الأمراض المزمنة' : 'Chronic Diseases'}
          />

          <div
            role="group"
            aria-label={
              isAr ? 'اختر الأمراض المزمنة' : 'Select chronic diseases'
            }
            className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 sm:gap-3"
          >
            {DISEASES.map(({ id, label, labelAr, icon: Icon }) => {
              const isSelected = selectedDiseases.includes(id);
              return (
                <button
                  key={id}
                  type="button"
                  role="checkbox"
                  aria-checked={isSelected}
                  onClick={() => toggleDisease(id)}
                  className={cn(
                    'relative flex flex-col items-center gap-2 rounded-2xl border-2 px-2 py-3 text-center transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                    isSelected
                      ? 'border-primary bg-primary/8 shadow-md shadow-primary/10'
                      : 'border-border/40 bg-muted/5 hover:border-border/60 hover:bg-muted/15',
                  )}
                >
                  {/* Selected checkmark badge */}
                  <AnimatePresence>
                    {isSelected && (
                      <motion.span
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{
                          type: 'spring',
                          damping: 18,
                          stiffness: 400,
                        }}
                        className="absolute -top-1.5 -end-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary shadow"
                      >
                        <Check
                          className="h-2.5 w-2.5 text-white"
                          strokeWidth={3}
                        />
                      </motion.span>
                    )}
                  </AnimatePresence>

                  {/* Icon */}
                  <div
                    className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-xl transition-colors duration-150',
                      isSelected ? 'bg-primary/15' : 'bg-muted/30',
                    )}
                  >
                    <Icon
                      className={cn(
                        'h-5 w-5 transition-colors duration-150',
                        isSelected ? 'text-primary' : 'text-muted-foreground',
                      )}
                    />
                  </div>

                  {/* Label */}
                  <span
                    className={cn(
                      'text-[11px] font-semibold leading-tight transition-colors duration-150',
                      isSelected ? 'text-primary' : 'text-foreground/70',
                    )}
                  >
                    {isAr ? labelAr : label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Other condition text input */}
          <div className="mt-3">
            <input
              type="text"
              value={otherDiseases}
              onChange={(e) => setOtherDiseases(e.target.value)}
              placeholder={
                isAr
                  ? 'أمراض أخرى غير مذكورة أعلاه...'
                  : 'Other condition not listed above…'
              }
              className="w-full rounded-xl border border-border bg-background/60 px-4 py-2.5 text-sm placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/60"
            />
          </div>
        </div>

        {/* ── Section 4: Additional Notes ── */}
        <div>
          <SectionHeading
            icon={FileText}
            label={isAr ? 'ملاحظات إضافية' : 'Additional Notes'}
          />
          <textarea
            value={additionalNotes}
            onChange={(e) => setAdditionalNotes(e.target.value)}
            rows={3}
            placeholder={
              isAr
                ? 'أي معلومات إضافية تتعلق بحالة المريض...'
                : "Any other relevant information about the patient's condition…"
            }
            className="w-full resize-none rounded-2xl border border-border bg-muted/5 px-4 py-3 text-sm placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/60"
          />
        </div>

        {/* ── Submit ── */}
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 rounded-2xl bg-primary py-5 text-base font-bold text-white shadow-lg shadow-primary/20 transition-all hover:shadow-primary/30 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          {submitLabel ??
            (isAr ? 'المتابعة للبرنامج الرياضي' : 'Continue to Exercise Plan')}
          <ArrowRight className={cn('h-4 w-4', isAr && 'rotate-180')} />
        </button>
      </div>
    </form>
  );
}
