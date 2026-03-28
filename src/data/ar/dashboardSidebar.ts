export const dashboardSidebarItems = [
  {
    id: 'overview',
    title: 'لوحة التحكم',
    description: 'نظرة عامة على أداء المستشفى وإحصائياته',
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
    description: 'إدارة معلومات الأطباء وجدول مواعيدهم',
    href: '/dashboard/doctors',
    icon: 'Stethoscope',
    action: {},
  },
  {
    id: 'managers',
    title: 'المسئولين',
    description: 'إدارة معلومات المسئولين وصلاحياتهم',
    href: '/dashboard/managers',
    icon: 'UserCog',
    action: {},
  },
  {
    id: 'patients',
    title: 'المرضى',
    description: 'إدارة معلومات المرضى وسجلاتهم الطبية',
    href: '/dashboard/patients',
    icon: 'Users',
    action: {},
  },
  {
    id: 'payment',
    title: 'الدفع',
    description: 'إدارة عمليات الدفع والفواتير',
    href: '/dashboard/payment',
    icon: 'CreditCard',
    action: {},
  },
];

export const registrationSidebarItems = [
  {
    id: 'org',
    title: 'معلومات المؤسسة',
    description: 'قم بتسجيل معلومات وتفاصيل مؤسستك وكن فردًا من عائلتنا',
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
    description: 'باقات مرنة تناسب حجم مؤسستك وتوقعاتك',
    href: '/registration/plans',
    icon: 'FileText',
    action: {},
  },
  {
    id: 'payment',
    title: 'آليات الدفع',
    description: 'اختر طريقة الدفع المناسبة لك لإتمام عملية الاشتراك',
    href: '/registration/payment',
    icon: 'CreditCard',
    action: {},
  },
];
