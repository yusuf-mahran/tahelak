'use client';

import { UsersTable } from '@/components/dashboard/users/usersTable/UsersTable';
import { useLanguage } from '@/context/LanguageContext';
import * as enUsers from '@/data/en/users';
import * as arUsers from '@/data/ar/users';

export default function DoctorsPage() {
  const { locale } = useLanguage();
  const cfg = locale === 'ar' ? arUsers.doctorConfig : enUsers.doctorConfig;

  return (
    <UsersTable
      role={cfg.role}
      title={cfg.title}
      icon={cfg.icon}
      detailColumn={cfg.detailColumn}
      fields={cfg.fields}
      schema={cfg.schema}
      getMetadata={cfg.getMetadata}
      getDefaultEditValues={cfg.getDefaultEditValues}
    />
  );
}
