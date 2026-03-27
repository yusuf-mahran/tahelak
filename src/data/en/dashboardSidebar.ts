export const dashboardSidebarItems = [
  {
    id: 'overview',
    title: 'Dashboard',
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
    href: '/dashboard/doctors',
    icon: 'Stethoscope',
    action: {},
  },
  {
    id: 'managers',
    title: 'Managers',
    href: '/dashboard/managers',
    icon: 'UserCog',
    action: {},
  },
  {
    id: 'patients',
    title: 'Patients',
    href: '/dashboard/patients',
    icon: 'Users',
    action: {},
  },
  {
    id: 'payment',
    title: 'Payment',
    href: '/dashboard/payment',
    icon: 'CreditCard',
    action: {},
  },
];

export const registrationSidebarItems = [
  {
    id: 'org',
    title: 'Organization Info',
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
    href: '/registration/plans',
    icon: 'FileText',
    action: {},
  },
  {
    id: 'payment',
    title: 'Payment Methods',
    href: '/registration/payment',
    icon: 'CreditCard',
    action: {},
  },
];
