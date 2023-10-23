'use client';

import { Input } from '@/components/ui/input';
import { useLanguage } from '@/context/LanguageContext';

export const Search = () => {
  const { localeData } = useLanguage();
  return (
    <div className="relative w-full md:max-w-sm">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      </div>
      <Input
        type="search"
        placeholder={localeData?.ctaMenu.search || 'Search...'}
        className="pl-9 h-9 w-full md:w-50 lg:w-75 placeholder:text-muted-foreground/50"
      />
    </div>
  );
};
