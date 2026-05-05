import {
  Calculator,
  Lock,
  Mail,
  Stethoscope,
  UserCog,
  Users,
  UsersRound,
} from 'lucide-react';
import { z } from 'zod';
import type { DynamicFormField } from '@/components/ui/dynamic-form';
import type { Database } from '@/lib/supabase';

type UserRow = Database['public']['Tables']['users']['Row'];

// ─── Medical title options ─────────────────────────────────────────────────────

export const medicalTitleOptions = [
  { value: 'specialist', label: 'Specialist' },
  { value: 'consultant', label: 'Consultant' },
  { value: 'professor', label: 'Professor' },
  { value: 'resident', label: 'Resident' },
  { value: 'general_practitioner', label: 'General Practitioner' },
  { value: 'surgeon', label: 'Surgeon' },
  { value: 'intern', label: 'Intern' },
] as const;

// ─── Schemas (language-agnostic) ─────────────────────────────────────────────

export const doctorSchema = z.object({
  image: z.any().optional(),
  name: z.string().min(3, 'Name must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  medical_title: z.string().min(2, 'Medical title is required'),
  age: z.coerce.number().min(22, 'Age must be at least 22'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const doctorEditSchema = z.object({
  image: z.any().optional(),
  name: z.string().min(3, 'Name must be at least 3 characters'),
  age: z.coerce.number().min(22, 'Age must be at least 22').optional(),
  medical_title: z.string().min(2, 'Medical title is required'),
});

export const managerSchema = z.object({
  image: z.any().optional(),
  name: z.string().min(3, 'Name must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  age: z.coerce.number().min(18, 'Age must be at least 18').optional(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const managerEditSchema = z.object({
  image: z.any().optional(),
  name: z.string().min(3, 'Name must be at least 3 characters'),
  age: z.coerce.number().min(18, 'Age must be at least 18').optional(),
});

export const patientSchema = z.object({
  image: z.any().optional(),
  name: z.string().min(3, 'Name must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  age: z.coerce.number().min(1, 'Age must be at least 1').optional(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const patientEditSchema = z.object({
  image: z.any().optional(),
  name: z.string().min(3, 'Name must be at least 3 characters'),
  age: z.coerce.number().min(1, 'Age must be at least 1').optional(),
});

// ─── Metadata extractors (language-agnostic) ─────────────────────────────────

export const getDoctorMetadata = (formData: Record<string, unknown>) => ({
  medical_title: formData.medical_title,
});

export const getManagerMetadata = (): Record<string, unknown> => ({});

export const getPatientMetadata = (): Record<string, unknown> => ({});

// ─── Default edit value extractors (language-agnostic) ───────────────────────

export const getDoctorDefaultEditValues = (user: UserRow) => ({
  name: user.name,
  age: user.age ?? undefined,
  medical_title:
    ((user.user_metadata as Record<string, unknown>)
      ?.medical_title as string) ?? '',
});

export const getManagerDefaultEditValues = (user: UserRow) => ({
  name: user.name,
  age: user.age ?? undefined,
});

export const getPatientDefaultEditValues = (user: UserRow) => ({
  name: user.name,
  age: user.age ?? undefined,
});

// ─── Subtitle / detail extractors (language-agnostic) ────────────────────────

export const getDoctorSubtitle = (user: UserRow) =>
  ((user.user_metadata as Record<string, unknown>)?.medical_title as string) ||
  'General';

export const getManagerSubtitle = () => 'Manager';

export const getPatientCondition = (user: UserRow) =>
  ((user.user_metadata as Record<string, unknown>)?.condition as string) || '—';

// ─── English form fields ──────────────────────────────────────────────────────

export const doctorFields: DynamicFormField[] = [
  {
    name: 'image',
    label: 'Profile Picture',
    type: 'image',
    required: false,
  },
  {
    name: 'name',
    label: 'Doctor Name',
    type: 'text',
    placeholder: 'Dr. John Smith',
    required: true,
    icon: UsersRound,
    section: { key: 'personal', label: 'Personal Details', icon: UsersRound },
  },
  {
    name: 'age',
    label: 'Age',
    type: 'number',
    placeholder: '35',
    required: true,
    icon: Calculator,
    section: { key: 'personal', label: 'Personal Details', icon: UsersRound },
  },
  {
    name: 'medical_title',
    label: 'Medical Title',
    type: 'select',
    options: [...medicalTitleOptions],
    required: true,
    section: { key: 'personal', label: 'Personal Details', icon: UsersRound },
  },
  {
    name: 'email',
    label: 'Email Address',
    type: 'email',
    placeholder: 'doctor@hospital.com',
    required: true,
    icon: Mail,
    section: { key: 'account', label: 'Account Access', icon: Lock },
  },
  {
    name: 'password',
    label: 'Account Password',
    type: 'password',
    placeholder: 'Create a secure password',
    required: true,
    icon: Lock,
    section: { key: 'account', label: 'Account Access', icon: Lock },
  },
];

export const doctorEditFields: DynamicFormField[] = [
  {
    name: 'image',
    label: 'Profile Picture',
    type: 'image',
    required: false,
  },
  {
    name: 'name',
    label: 'Doctor Name',
    type: 'text',
    required: true,
    section: { key: 'personal', label: 'Personal Details', icon: UsersRound },
  },
  {
    name: 'age',
    label: 'Age',
    type: 'number',
    required: false,
    icon: Calculator,
    section: { key: 'personal', label: 'Personal Details', icon: UsersRound },
  },
  {
    name: 'medical_title',
    label: 'Medical Title',
    type: 'select',
    options: [...medicalTitleOptions],
    required: true,
    section: { key: 'personal', label: 'Personal Details', icon: UsersRound },
  },
];

export const managerFields: DynamicFormField[] = [
  {
    name: 'image',
    label: 'Profile Picture',
    type: 'image',
    required: false,
  },
  {
    name: 'name',
    label: 'Manager Name',
    type: 'text',
    required: true,
    icon: UsersRound,
    section: { key: 'personal', label: 'Personal Details', icon: UsersRound },
  },
  {
    name: 'age',
    label: 'Age',
    type: 'number',
    required: false,
    icon: Calculator,
    section: { key: 'personal', label: 'Personal Details', icon: UsersRound },
  },
  {
    name: 'email',
    label: 'Email Address',
    type: 'email',
    required: true,
    icon: Mail,
    section: { key: 'account', label: 'Account Access', icon: Lock },
  },
  {
    name: 'password',
    label: 'Account Password',
    type: 'password',
    required: true,
    icon: Lock,
    section: { key: 'account', label: 'Account Access', icon: Lock },
  },
];

export const managerEditFields: DynamicFormField[] = [
  {
    name: 'image',
    label: 'Profile Picture',
    type: 'image',
    required: false,
  },
  {
    name: 'name',
    label: 'Manager Name',
    type: 'text',
    required: true,
    section: { key: 'personal', label: 'Personal Details', icon: UsersRound },
  },
  {
    name: 'age',
    label: 'Age',
    type: 'number',
    required: false,
    icon: Calculator,
    section: { key: 'personal', label: 'Personal Details', icon: UsersRound },
  },
];

export const patientFields: DynamicFormField[] = [
  {
    name: 'image',
    label: 'Profile Picture',
    type: 'image',
    required: false,
  },
  {
    name: 'name',
    label: 'Patient Name',
    type: 'text',
    required: true,
    icon: UsersRound,
    section: { key: 'personal', label: 'Personal Details', icon: UsersRound },
  },
  {
    name: 'age',
    label: 'Age',
    type: 'number',
    required: false,
    icon: Calculator,
    section: { key: 'personal', label: 'Personal Details', icon: UsersRound },
  },
  {
    name: 'email',
    label: 'Email Address',
    type: 'email',
    required: true,
    icon: Mail,
    section: { key: 'account', label: 'Account Access', icon: Lock },
  },
  {
    name: 'password',
    label: 'Account Password',
    type: 'password',
    required: true,
    icon: Lock,
    section: { key: 'account', label: 'Account Access', icon: Lock },
  },
];

export const patientEditFields: DynamicFormField[] = [
  {
    name: 'image',
    label: 'Profile Picture',
    type: 'image',
    required: false,
  },
  {
    name: 'name',
    label: 'Patient Name',
    type: 'text',
    required: true,
    section: { key: 'personal', label: 'Personal Details', icon: UsersRound },
  },
  {
    name: 'age',
    label: 'Age',
    type: 'number',
    required: false,
    icon: Calculator,
    section: { key: 'personal', label: 'Personal Details', icon: UsersRound },
  },
];

// ─── Role configs ─────────────────────────────────────────────────────────────

export const doctorConfig = {
  role: 'doctor' as const,
  title: 'All Doctors',
  listTitle: 'Doctors List',
  icon: Stethoscope,
  fields: doctorFields,
  editFields: doctorEditFields,
  schema: doctorSchema,
  editSchema: doctorEditSchema,
  getMetadata: getDoctorMetadata,
  getDefaultEditValues: getDoctorDefaultEditValues,
  getSubtitle: getDoctorSubtitle,
  detailColumn: { header: 'Title', getValue: getDoctorSubtitle },
  detailBasePath: '/dashboard/doctors',
};

export const managerConfig = {
  role: 'manager' as const,
  title: 'All Managers',
  listTitle: 'Managers List',
  icon: UserCog,
  fields: managerFields,
  editFields: managerEditFields,
  schema: managerSchema,
  editSchema: managerEditSchema,
  getMetadata: getManagerMetadata,
  getDefaultEditValues: getManagerDefaultEditValues,
  getSubtitle: getManagerSubtitle,
  detailColumn: undefined,
  detailBasePath: '/dashboard/managers',
};

export const patientConfig = {
  role: 'patient' as const,
  title: 'All Patients',
  listTitle: 'Patients List',
  icon: Users,
  fields: patientFields,
  editFields: patientEditFields,
  schema: patientSchema,
  editSchema: patientEditSchema,
  getMetadata: getPatientMetadata,
  getDefaultEditValues: getPatientDefaultEditValues,
  getSubtitle: getPatientCondition,
  detailColumn: { header: 'Condition', getValue: getPatientCondition },
  detailBasePath: '/dashboard/patients',
};
