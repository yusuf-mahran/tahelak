'use client';

import React, { createContext, useContext, useState } from 'react';
import { getDictionary } from '@/lib/get-dictionary';
import { LANGUAGE_DATA } from '@/types/languages';
import { useRouter } from 'next/navigation';

type Locale = 'en' | 'ar';

interface LanguageContextType {
  locale: Locale;
  changeLanguage: (locale: Locale) => void;
  localeData: LANGUAGE_DATA | null;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

export const LanguageProvider = ({
  children,
  initialLocale,
  initialData,
}: {
  children: React.ReactNode;
  initialLocale: Locale;
  initialData: LANGUAGE_DATA;
}) => {
  const [locale, setLocale] = useState<Locale>(initialLocale);
  const [localeData, setLocaleData] = useState<LANGUAGE_DATA>(initialData);
  const router = useRouter();

  const changeLanguage = async (newLocale: Locale) => {
    setLocale(newLocale);
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    const data = await getDictionary(newLocale);
    setLocaleData(data);
    router.refresh();
  };

  return (
    <LanguageContext.Provider value={{ locale, changeLanguage, localeData }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
