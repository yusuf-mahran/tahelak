'use client';

import { useMemo, useState } from 'react';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { ModalSided } from '@/components/ui/modal-sided';
import { DynamicForm } from '@/components/ui/dynamic-form';
import type { DynamicFormField } from '@/components/ui/dynamic-form';
import { AssignmentForm } from '@/components/dashboard/exercises/AssignmentForm';
import { StepBar } from './form/StepBar';
import { DoctorPicker } from './form/DoctorPicker';
import { PatientSuccessCard } from './form/PatientSuccessCard';
import { CloseConfirmOverlay } from '@/components/ui/close-confirm-overlay';
import {
  MedicalHistoryForm,
  type MedicalHistoryData,
} from './form/MedicalHistoryForm';
import { useLanguage } from '@/context/LanguageContext';
import type { UserRole } from '@/repositories/users';
import { updateUser } from '@/repositories/users';
import type { Database } from '@/lib/supabase';

type UserRow = Database['public']['Tables']['users']['Row'];

// ─── Translations builder ─────────────────────────────────────────────────────

function buildTranslations(isAr: boolean) {
  return {
    stepInfo: isAr ? 'بيانات المريض' : 'Patient Info',
    stepMedical: isAr ? 'التاريخ الطبي' : 'Medical History',
    stepExercise: isAr ? 'البرنامج الرياضي' : 'Exercise Plan',
    sectionDoctor: isAr ? 'تعيين الطبيب المعالج' : 'Assign to Doctor',
    continueToMedical: isAr
      ? 'المتابعة للتاريخ الطبي'
      : 'Continue to Medical History',
    saveInfo: isAr ? 'حفظ البيانات' : 'Save Info',
    saveMedical: isAr ? 'حفظ التاريخ الطبي' : 'Save Medical History',
    creating: isAr ? 'جارٍ الإنشاء…' : 'Creating...',
    saving: isAr ? 'جارٍ الحفظ…' : 'Saving...',
    patientCreated: isAr ? 'تم إنشاء الحساب' : 'Profile created',
    patientEditing: isAr ? 'تعديل الملف' : 'Editing profile',
    buildTitle: isAr
      ? 'الآن نبني برنامجه الرياضي'
      : 'Now build their exercise program',
    buildSub: (name: string) =>
      isAr
        ? `عيّن تمارين وجدولاً مناسباً لـ ${name}`
        : `Assign exercises and schedule for ${name}`,
    register: (label: string) =>
      isAr ? `تسجيل ${label}` : `Register ${label}`,
    update: (label: string) => (isAr ? `تحديث ${label}` : `Update ${label}`),
  };
}

// ─── Main Export: UserCreateModal ─────────────────────────────────────────────

export interface UserCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: UserRole;
  title: string;
  fields: DynamicFormField[];
  schema: z.ZodObject<z.ZodRawShape>;
  onCreateUser: (data: Record<string, unknown>) => Promise<UserRow | null>;
  isLoading: boolean;
  isRoot?: boolean;
  doctors?: UserRow[];
  doctorId?: string;
  organizationId?: string;
  defaultValues?: Record<string, unknown>;
  /** Edit mode — pass the user being updated */
  isEditMode?: boolean;
  editingUser?: UserRow | null;
  onUpdateUser?: (data: Record<string, unknown>) => Promise<UserRow | null>;
}

export function UserCreateModal({
  isOpen,
  onClose,
  role,
  title,
  fields,
  schema,
  onCreateUser,
  isLoading,
  isRoot = false,
  doctors = [],
  doctorId = '',
  organizationId = '',
  defaultValues,
  isEditMode = false,
  editingUser = null,
  onUpdateUser,
}: UserCreateModalProps) {
  const { locale } = useLanguage();
  const isAr = locale === 'ar';
  const t = buildTranslations(isAr);

  const isPatient = role === 'patient';
  const roleLabel = role.charAt(0).toUpperCase() + role.slice(1);

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [createdPatient, setCreatedPatient] = useState<UserRow | null>(null);
  const [step3DoctorId, setStep3DoctorId] = useState(doctorId);
  const [selectedDoctorId, setSelectedDoctorId] = useState(
    doctors[0]?.user_id ?? doctorId,
  );

  // Step-navigation guard (edit mode only)
  const [pendingStep, setPendingStep] = useState<1 | 2 | 3 | null>(null);
  const [showStepConfirm, setShowStepConfirm] = useState(false);

  // The patient whose data drives steps 2 & 3
  const activePatient = isEditMode ? editingUser : createdPatient;

  // Initial medical history from editing user's metadata
  const initialMedicalHistory = useMemo<MedicalHistoryData | undefined>(() => {
    if (!isEditMode || !editingUser?.user_metadata) return undefined;
    const meta = editingUser.user_metadata as Record<string, unknown>;
    if (!meta.complaint) return undefined;
    return meta as unknown as MedicalHistoryData;
  }, [isEditMode, editingUser]);

  const resetState = () => {
    setStep(1);
    setCreatedPatient(null);
    setStep3DoctorId(doctorId);
    setSelectedDoctorId(doctors[0]?.user_id ?? doctorId);
    setPendingStep(null);
    setShowStepConfirm(false);
  };

  const handleClose = () => {
    onClose();
    setTimeout(resetState, 350);
  };

  // ── Step navigation (edit mode guard) ─────────────────────────────────────
  const handleStepClick = (target: number) => {
    if (target === step) return;
    setPendingStep(target as 1 | 2 | 3);
    setShowStepConfirm(true);
  };

  const handleConfirmDiscard = () => {
    if (pendingStep) setStep(pendingStep);
    setPendingStep(null);
    setShowStepConfirm(false);
  };

  const handleKeepEditing = () => {
    setPendingStep(null);
    setShowStepConfirm(false);
  };

  // ── Step 1: create or update patient info ──────────────────────────────────
  const handleFormSubmit = async (data: Record<string, unknown>) => {
    const payload: Record<string, unknown> = { ...data };
    if (isPatient && isRoot && selectedDoctorId)
      payload.createdBy = selectedDoctorId;

    if (isEditMode) {
      const user = await onUpdateUser?.(payload);
      if (!user) return;
      if (isPatient) setStep(2);
      else handleClose();
    } else {
      const user = await onCreateUser(payload);
      if (!user) return;
      if (isPatient) {
        setCreatedPatient(user);
        setStep3DoctorId(isRoot ? selectedDoctorId : doctorId);
        setStep(2);
      } else {
        handleClose();
      }
    }
  };

  // ── Step 2: medical history ────────────────────────────────────────────────
  const handleMedicalHistorySubmit = async (data: MedicalHistoryData) => {
    if (activePatient) {
      await updateUser(activePatient.id, {
        user_metadata:
          data as unknown as Database['public']['Tables']['users']['Update']['user_metadata'],
      });
    }
    setStep(3);
  };

  const slideVariants = {
    enter: { opacity: 0, x: isAr ? -24 : 24 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: isAr ? 24 : -24 },
  };

  return (
    <ModalSided isOpen={isOpen} onClose={handleClose} title={title}>
      {/* Relative wrapper so CloseConfirmOverlay (absolute) is contained */}
      <div className="relative flex flex-col min-h-full">
        {isPatient && (
          <StepBar
            currentStep={step}
            steps={[
              { label: t.stepInfo },
              { label: t.stepMedical },
              { label: t.stepExercise },
            ]}
            onStepClick={isEditMode ? handleStepClick : undefined}
          />
        )}

        <AnimatePresence mode="wait">
          {/* ── Step 1: Patient info ── */}
          {step === 1 && (
            <motion.div
              key="step1"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              {/* In edit mode show the patient card above the form */}
              {isEditMode && isPatient && activePatient && (
                <div className="px-6 pt-6 pb-2">
                  <PatientSuccessCard
                    patient={activePatient}
                    createdLabel={t.patientEditing}
                  />
                </div>
              )}
              <DynamicForm
                fields={fields}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                schema={schema as any}
                defaultValues={defaultValues}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onSubmit={handleFormSubmit as any}
                isLoading={isLoading}
                submitLabel={
                  isEditMode
                    ? isPatient
                      ? t.saveInfo
                      : t.update(roleLabel)
                    : isPatient
                      ? t.continueToMedical
                      : t.register(roleLabel)
                }
                loadingLabel={isEditMode ? t.saving : t.creating}
                renderExtra={
                  isPatient && isRoot && doctors.length > 0
                    ? () => (
                        <DoctorPicker
                          doctors={doctors}
                          selectedId={selectedDoctorId}
                          sectionLabel={t.sectionDoctor}
                          onSelect={setSelectedDoctorId}
                        />
                      )
                    : undefined
                }
              />
            </motion.div>
          )}

          {/* ── Step 2: Medical history ── */}
          {step === 2 && activePatient && (
            <motion.div
              key="step2"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              <div className="px-6 pt-6 pb-2">
                <PatientSuccessCard
                  patient={activePatient}
                  createdLabel={
                    isEditMode ? t.patientEditing : t.patientCreated
                  }
                />
              </div>
              <MedicalHistoryForm
                key={activePatient.user_id}
                onSubmit={handleMedicalHistorySubmit}
                locale={locale}
                initialValues={initialMedicalHistory}
                submitLabel={
                  isEditMode
                    ? t.saveMedical
                    : undefined /* falls back to default */
                }
              />
            </motion.div>
          )}

          {/* ── Step 3: Exercise plan ── */}
          {step === 3 && activePatient && (
            <motion.div
              key="step3"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              <div className="px-6 pt-7 pb-8 space-y-6">
                <PatientSuccessCard
                  patient={activePatient}
                  createdLabel={
                    isEditMode ? t.patientEditing : t.patientCreated
                  }
                />
                <div>
                  <h3 className="text-lg font-bold text-foreground">
                    {t.buildTitle}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                    {t.buildSub(activePatient.name)}
                  </p>
                </div>
                <AssignmentForm
                  patientId={activePatient.user_id}
                  doctorId={step3DoctorId}
                  organizationId={organizationId}
                  onSuccess={handleClose}
                  isEditMode={isEditMode}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step-navigation confirmation (edit mode only) */}
        <CloseConfirmOverlay
          show={showStepConfirm}
          onKeep={handleKeepEditing}
          onDiscard={handleConfirmDiscard}
          locale={locale}
          align="end"
        />
      </div>
    </ModalSided>
  );
}
