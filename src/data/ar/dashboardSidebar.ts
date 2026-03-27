export const dashboardSidebarItems = [
  {
    id: 'overview',
    title: 'لوحة التحكم',
    href: '/dashboard',
    icon: 'LayoutDashboard',
    action: {
      type: 'outline',
      href: '/dashboard',
      title: 'لوحة التحكم',
      tooltip: '',
    },
  },
  {
    id: 'doctors',
    title: 'الأطباء',
    href: '/dashboard/doctors',
    icon: 'Stethoscope',
    action: {},
  },
  {
    id: 'managers',
    title: 'المسئولين',
    href: '/dashboard/managers',
    icon: 'UserCog',
    action: {},
  },
  {
    id: 'patients',
    title: 'المرضى',
    href: '/dashboard/patients',
    icon: 'Users',
    action: {},
  },
  {
    id: 'payment',
    title: 'الدفع',
    href: '/dashboard/payment',
    icon: 'CreditCard',
    action: {},
  },
];

export const registrationSidebarItems = [
  {
    id: 'org',
    title: 'معلومات المؤسسة',
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
    href: '/registration/plans',
    icon: 'FileText',
    action: {},
  },
  {
    id: 'payment',
    title: 'آليات الدفع',
    href: '/registration/payment',
    icon: 'CreditCard',
    action: {},
  },
];
