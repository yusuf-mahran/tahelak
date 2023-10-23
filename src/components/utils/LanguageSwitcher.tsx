'use client';

import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const LanguageSwitcher = () => {
  const { locale: currentLocale, changeLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: 'en', name: 'ENGLISH', flag: '🇺🇸' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  ];

  const handleLanguageChange = (locale: string) => {
    changeLanguage(locale as 'en' | 'ar');
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const currentLanguage =
    languages.find((l) => l.code === currentLocale) || languages[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-full border-border bg-secondary px-3 py-2 hover:bg-secondary/80 transition-colors"
      >
        <span className="text-lg leading-none">{currentLanguage.flag}</span>
        <svg
          className={cn(
            'w-3 h-3 text-muted-foreground transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </Button>

      {isOpen && (
        <div className="absolute bg-secondary bottom-full end-0 mt-2 w-40 overflow-hidden rounded-lg border border-border bg-popover text-popover-foreground shadow-sm z-50 animate-in fade-in zoom-in-95 duration-100">
          <div className="flex flex-col">
            {languages.map((language) => (
              <button
                type="button"
                key={language.code}
                onClick={() => handleLanguageChange(language.code)}
                className={cn(
                  'flex items-center justify-between px-3 py-2 text-sm transition-colors bg-muted hover:bg-secondary/20 hover:text-secondary-foreground group',
                  currentLocale === language.code && 'bg-muted'
                )}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg leading-none">{language.flag}</span>
                  <span
                    className={cn(
                      'font-medium',
                      currentLocale === language.code
                        ? 'text-foreground'
                        : 'text-muted-foreground group-hover:text-foreground'
                    )}
                  >
                    {language.name}
                  </span>
                </div>
                {currentLocale === language.code && (
                  <svg
                    className="w-3.5 h-3.5 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
