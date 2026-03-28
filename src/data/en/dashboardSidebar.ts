export const dashboardSidebarItems = [
  {
    id: 'overview',
    title: 'Dashboard',
    description: 'Overview of hospital performance and statistics',
    href: '/dashboard',
    icon: 'LayoutDashboard',
    action: {
      type: 'outline',
      href: '/dashboard',
      title: 'Dashboard',
      tooltip: '',
    },
  },
  {
    id: 'doctors',
    title: 'Doctors',
    description: 'Manage doctor information and their schedules',
    href: '/dashboard/doctors',
    icon: 'Stethoscope',
    action: {},
  },
  {
    id: 'managers',
    title: 'Managers',
    description: 'Manage manager information and their permissions',
    href: '/dashboard/managers',
    icon: 'UserCog',
    action: {},
  },
  {
    id: 'patients',
    title: 'Patients',
    description: 'Manage patient information and their medical records',
    href: '/dashboard/patients',
    icon: 'Users',
    action: {},
  },
  {
    id: 'payment',
    title: 'Payment',
    description: 'Manage payment transactions and invoices',
    href: '/dashboard/payment',
    icon: 'CreditCard',
    action: {},
  },
];

export const registrationSidebarItems = [
  {
    id: 'org',
    title: 'Organization Info',
    description:
      'Register your organization information and details to become a part of our family',
    href: '/registration',
    icon: 'Info',
    action: {
      type: 'secondary',
      href: '/login',
      title: 'Login',
      tooltip: 'Already have an account? Log in',
    },
  },
  {
    id: 'subscription',
    title: 'Subscription Plans',
    description:
      'Flexible plans that suit your organization size and expectations',
    href: '/registration/plans',
    icon: 'FileText',
    action: {},
  },
  {
    id: 'payment',
    title: 'Payment Methods',
    description:
      'Choose the payment method that suits you to complete the subscription process',
    href: '/registration/payment',
    icon: 'CreditCard',
    action: {},
  },
];
