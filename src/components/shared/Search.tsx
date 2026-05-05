import { Input } from '@/components/ui/input';
import { useLanguage } from '@/context/LanguageContext';
import { SearchIcon } from 'lucide-react';

export const Search = () => {
  const { localeData } = useLanguage();

  return (
    <div className="relative w-full md:max-w-sm">
      <Input
        type="search"
        placeholder={localeData?.ctaMenu.search || 'Search...'}
        icon={SearchIcon}
        className="h-16"
      />
    </div>
  );
};
