import { UsersList } from './UsersList';
import { useLanguage } from '@/context/LanguageContext';
import * as enUsers from '@/data/en/users';
import * as arUsers from '@/data/ar/users';

export function DoctorsList() {
  const { locale } = useLanguage();
  const cfg = locale === 'ar' ? arUsers.doctorConfig : enUsers.doctorConfig;

  return (
    <UsersList
      role={cfg.role}
      title={cfg.listTitle}
      icon={cfg.icon}
      fields={cfg.fields}
      schema={cfg.schema}
      detailBasePath={cfg.detailBasePath}
      getSubtitle={cfg.getSubtitle}
      getMetadata={cfg.getMetadata}
      getDefaultEditValues={cfg.getDefaultEditValues}
    />
  );
}
