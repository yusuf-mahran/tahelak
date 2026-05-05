export const dashboardSidebarItems = [
  {
    id: 'overview',
    title: 'Dashboard',
    description:
      'Get an overview of your organization’s performance and manage daily operations',
    href: '/dashboard',
    icon: 'LayoutDashboard',
    allowedRoles: ['root', 'manager', 'doctor', 'patient'],
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
    description: 'Manage doctor information, schedules, and specialties',
    href: '/dashboard/doctors',
    icon: 'Stethoscope',
    allowedRoles: ['root', 'manager'],
    action: {},
  },
  {
    id: 'managers',
    title: 'Managers',
    description:
      'Manage manager accounts and their permissions within the system',
    href: '/dashboard/managers',
    icon: 'UserCog',
    allowedRoles: ['root', 'manager'],
    action: {},
  },
  {
    id: 'patients',
    title: 'Patients',
    description:
      'Manage patient information, schedules, and treatment progress',
    href: '/dashboard/patients',
    icon: 'Users',
    allowedRoles: ['root', 'manager', 'doctor'],
    action: {},
  },
  {
    id: 'payment',
    title: 'Payment',
    description: 'Manage payment transactions and billing for the organization',
    href: '/dashboard/payment',
    icon: 'CreditCard',
    allowedRoles: ['root'],
    action: {},
  },
];

export const registrationSidebarItems = [
  {
    id: 'org',
    title: 'Organization Registration',
    description:
      'Register your organization and start your journey with us in improving healthcare',
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
      'Choose the plan that suits your organization’s needs and start your journey with us',
    href: '/registration/plans',
    icon: 'FileText',
    action: {},
  },
  {
    id: 'payment',
    title: 'Payment Methods',
    description:
      'Choose the payment method that suits your organization and complete the subscription process',
    href: '/registration/payment',
    icon: 'CreditCard',
    action: {},
  },
];

export const backLink = {
  registration: 'Back to Home',
  dashboard: 'Manage Organization',
};
