export const dashboardSidebarItems = [
  {
    id: 'overview',
    title: 'لوحة التحكم',
    description: 'احصل على نظرة شاملة على أداء مؤسستك وإدارة العمليات اليومية',
    href: '/dashboard',
    icon: 'LayoutDashboard',
    allowedRoles: ['root', 'manager', 'doctor', 'patient'],
    actions: {},
  },
  {
    id: 'doctors',
    title: 'الأطباء',
    description: 'إدارة معلومات الأطباء، جداولهم، وتخصصاتهم',
    href: '/dashboard/doctors',
    icon: 'Stethoscope',
    allowedRoles: ['root', 'manager'],
    action: {},
  },
  {
    id: 'managers',
    title: 'المسئولين',
    description: 'إدارة حسابات المسئولين وصلاحياتهم داخل النظام',
    href: '/dashboard/managers',
    icon: 'UserCog',
    allowedRoles: ['root', 'manager'],
    action: {},
  },
  {
    id: 'patients',
    title: 'المرضى',
    description: 'إدارة معلومات المرضى، جداولهم، وتقدمهم العلاجي',
    href: '/dashboard/patients',
    icon: 'Users',
    allowedRoles: ['root', 'manager', 'doctor'],
    action: {},
  },
  {
    id: 'payment',
    title: 'الدفع',
    description: 'إدارة عمليات الدفع والفواتير للمؤسسة',
    href: '/dashboard/payment',
    icon: 'CreditCard',
    allowedRoles: ['root'],
    action: {},
  },
];

export const registrationSidebarItems = [
  {
    id: 'org',
    title: 'تسجيل المؤسسة',
    description: 'سجل مؤسستك وابدأ رحلتك معنا فى تحسين الرعاية الصحية',
    href: '/registration',
    icon: 'Info',
    action: {
      type: 'secondary',
      href: '/login',
      title: 'تسجيل الدخول',
      tooltip: 'لديك حساب بالفعل؟ قم بتسجيل الدخول',
    },
  },
  {
    id: 'subscription',
    title: 'باقات الاشتراك',
    description: 'اختر الباقة التي تناسب احتياجات مؤسستك وابدأ رحلتك معنا',
    href: '/registration/plans',
    icon: 'FileText',
    action: {},
  },
  {
    id: 'payment',
    title: 'آليات الدفع',
    description: 'اختر طريقة الدفع المناسبة لمؤسستك وأكمل عملية الاشتراك',
    href: '/registration/payment',
    icon: 'CreditCard',
    action: {},
  },
];

export const backLink = {
  registration: 'العودة إلى الرئيسية',
  dashboard: 'إدارة المؤسسة',
};
