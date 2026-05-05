import {
  Calculator,
  Lock,
  Mail,
  Stethoscope,
  UserCog,
  Users,
  UsersRound,
} from 'lucide-react';
import type { DynamicFormField } from '@/components/ui/dynamic-form';
import {
  doctorSchema,
  doctorEditSchema,
  managerSchema,
  managerEditSchema,
  patientSchema,
  patientEditSchema,
  getDoctorMetadata,
  getManagerMetadata,
  getPatientMetadata,
  getDoctorDefaultEditValues,
  getManagerDefaultEditValues,
  getPatientDefaultEditValues,
  getDoctorSubtitle,
  getManagerSubtitle,
  getPatientCondition,
} from '@/data/en/users';

// Re-export language-agnostic schemas + helpers so consumers only need one import
export {
  doctorSchema,
  doctorEditSchema,
  managerSchema,
  managerEditSchema,
  patientSchema,
  patientEditSchema,
  getDoctorMetadata,
  getManagerMetadata,
  getPatientMetadata,
  getDoctorDefaultEditValues,
  getManagerDefaultEditValues,
  getPatientDefaultEditValues,
  getDoctorSubtitle,
  getManagerSubtitle,
  getPatientCondition,
};

// ─── Arabic medical title options ─────────────────────────────────────────────

export const medicalTitleOptionsAr = [
  { value: 'specialist', label: 'أخصائي' },
  { value: 'consultant', label: 'استشاري' },
  { value: 'professor', label: 'أستاذ' },
  { value: 'resident', label: 'مقيم' },
  { value: 'general_practitioner', label: 'طبيب عام' },
  { value: 'surgeon', label: 'جراح' },
  { value: 'intern', label: 'متدرب' },
] as const;

// ─── Arabic form fields ───────────────────────────────────────────────────────

export const doctorFields: DynamicFormField[] = [
  {
    name: 'image',
    label: 'الصورة الشخصية',
    type: 'image',
    required: false,
  },
  {
    name: 'name',
    label: 'اسم الطبيب',
    type: 'text',
    placeholder: 'د. محمد أحمد',
    required: true,
    icon: UsersRound,
    section: { key: 'personal', label: 'المعلومات الشخصية', icon: UsersRound },
  },
  {
    name: 'age',
    label: 'العمر',
    type: 'number',
    placeholder: '35',
    required: true,
    icon: Calculator,
    section: { key: 'personal', label: 'المعلومات الشخصية', icon: UsersRound },
  },
  {
    name: 'medical_title',
    label: 'اللقب الطبي',
    type: 'select',
    options: [...medicalTitleOptionsAr],
    required: true,
    section: { key: 'personal', label: 'المعلومات الشخصية', icon: UsersRound },
  },
  {
    name: 'email',
    label: 'البريد الإلكتروني',
    type: 'email',
    placeholder: 'doctor@hospital.com',
    required: true,
    icon: Mail,
    section: { key: 'account', label: 'بيانات الحساب', icon: Lock },
  },
  {
    name: 'password',
    label: 'كلمة المرور',
    type: 'password',
    placeholder: 'أنشئ كلمة مرور آمنة',
    required: true,
    icon: Lock,
    section: { key: 'account', label: 'بيانات الحساب', icon: Lock },
  },
];

export const doctorEditFields: DynamicFormField[] = [
  {
    name: 'image',
    label: 'الصورة الشخصية',
    type: 'image',
    required: false,
  },
  {
    name: 'name',
    label: 'اسم الطبيب',
    type: 'text',
    required: true,
    section: { key: 'personal', label: 'المعلومات الشخصية', icon: UsersRound },
  },
  {
    name: 'age',
    label: 'العمر',
    type: 'number',
    required: false,
    icon: Calculator,
    section: { key: 'personal', label: 'المعلومات الشخصية', icon: UsersRound },
  },
  {
    name: 'medical_title',
    label: 'اللقب الطبي',
    type: 'select',
    options: [...medicalTitleOptionsAr],
    required: true,
    section: { key: 'personal', label: 'المعلومات الشخصية', icon: UsersRound },
  },
];

export const managerFields: DynamicFormField[] = [
  {
    name: 'image',
    label: 'الصورة الشخصية',
    type: 'image',
    required: false,
  },
  {
    name: 'name',
    label: 'اسم المدير',
    type: 'text',
    required: true,
    icon: UsersRound,
    section: { key: 'personal', label: 'المعلومات الشخصية', icon: UsersRound },
  },
  {
    name: 'age',
    label: 'العمر',
    type: 'number',
    required: false,
    icon: Calculator,
    section: { key: 'personal', label: 'المعلومات الشخصية', icon: UsersRound },
  },
  {
    name: 'email',
    label: 'البريد الإلكتروني',
    type: 'email',
    required: true,
    icon: Mail,
    section: { key: 'account', label: 'بيانات الحساب', icon: Lock },
  },
  {
    name: 'password',
    label: 'كلمة المرور',
    type: 'password',
    required: true,
    icon: Lock,
    section: { key: 'account', label: 'بيانات الحساب', icon: Lock },
  },
];

export const managerEditFields: DynamicFormField[] = [
  {
    name: 'image',
    label: 'الصورة الشخصية',
    type: 'image',
    required: false,
  },
  {
    name: 'name',
    label: 'اسم المدير',
    type: 'text',
    required: true,
    section: { key: 'personal', label: 'المعلومات الشخصية', icon: UsersRound },
  },
  {
    name: 'age',
    label: 'العمر',
    type: 'number',
    required: false,
    icon: Calculator,
    section: { key: 'personal', label: 'المعلومات الشخصية', icon: UsersRound },
  },
];

export const patientFields: DynamicFormField[] = [
  {
    name: 'image',
    label: 'الصورة الشخصية',
    type: 'image',
    required: false,
  },
  {
    name: 'name',
    label: 'اسم المريض',
    type: 'text',
    required: true,
    icon: UsersRound,
    section: { key: 'personal', label: 'المعلومات الشخصية', icon: UsersRound },
  },
  {
    name: 'age',
    label: 'العمر',
    type: 'number',
    required: false,
    icon: Calculator,
    section: { key: 'personal', label: 'المعلومات الشخصية', icon: UsersRound },
  },
  {
    name: 'email',
    label: 'البريد الإلكتروني',
    type: 'email',
    required: true,
    icon: Mail,
    section: { key: 'account', label: 'بيانات الحساب', icon: Lock },
  },
  {
    name: 'password',
    label: 'كلمة المرور',
    type: 'password',
    required: true,
    icon: Lock,
    section: { key: 'account', label: 'بيانات الحساب', icon: Lock },
  },
];

export const patientEditFields: DynamicFormField[] = [
  {
    name: 'image',
    label: 'الصورة الشخصية',
    type: 'image',
    required: false,
  },
  {
    name: 'name',
    label: 'اسم المريض',
    type: 'text',
    required: true,
    section: { key: 'personal', label: 'المعلومات الشخصية', icon: UsersRound },
  },
  {
    name: 'age',
    label: 'العمر',
    type: 'number',
    required: false,
    icon: Calculator,
    section: { key: 'personal', label: 'المعلومات الشخصية', icon: UsersRound },
  },
];

// ─── Arabic role configs ──────────────────────────────────────────────────────

export const doctorConfig = {
  role: 'doctor' as const,
  title: 'جميع الأطباء',
  listTitle: 'قائمة الأطباء',
  icon: Stethoscope,
  fields: doctorFields,
  editFields: doctorEditFields,
  schema: doctorSchema,
  editSchema: doctorEditSchema,
  getMetadata: getDoctorMetadata,
  getDefaultEditValues: getDoctorDefaultEditValues,
  getSubtitle: getDoctorSubtitle,
  detailColumn: { header: 'اللقب', getValue: getDoctorSubtitle },
  detailBasePath: '/dashboard/doctors',
};

export const managerConfig = {
  role: 'manager' as const,
  title: 'جميع المديرين',
  listTitle: 'قائمة المديرين',
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
  title: 'جميع المرضى',
  listTitle: 'قائمة المرضى',
  icon: Users,
  fields: patientFields,
  editFields: patientEditFields,
  schema: patientSchema,
  editSchema: patientEditSchema,
  getMetadata: getPatientMetadata,
  getDefaultEditValues: getPatientDefaultEditValues,
  getSubtitle: getPatientCondition,
  detailColumn: { header: 'الحالة', getValue: getPatientCondition },
  detailBasePath: '/dashboard/patients',
};
