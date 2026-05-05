import { UsersList } from './UsersList';
import { useLanguage } from '@/context/LanguageContext';
import * as enUsers from '@/data/en/users';
import * as arUsers from '@/data/ar/users';

export function ManagersList() {
  const { locale } = useLanguage();
  const cfg = locale === 'ar' ? arUsers.managerConfig : enUsers.managerConfig;

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
