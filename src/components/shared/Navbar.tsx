'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Search } from '@/components/shared/Search';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/auth/useAuth';
import { MenuIcon, SearchIcon, X } from 'lucide-react';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { localeData } = useLanguage();
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);
  const { user } = useAuth();
  const isLoginPage = pathname.startsWith('/login');
  const showSearch =
    pathname !== '/' && !pathname.startsWith('/registration') && !isLoginPage;

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    if (isSearchOpen) setIsSearchOpen(false);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (isOpen) setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsSearchOpen(false);
      }
    };

    if (isOpen || isSearchOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, isSearchOpen]);

  return (
    <header
      ref={navRef}
      className="sticky top-0 left-0 right-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60"
    >
      <div className="mx-auto flex h-16 items-center justify-between md:px-10 px-6 max-w-430">
        <Link
          href={pathname.startsWith('/dashboard') ? '/dashboard' : '/'}
          className="flex items-center gap-2"
        >
          <Image
            src="/tahelak.svg"
            alt="tahelak logo"
            width={100}
            height={40}
            className="h-10 w-auto"
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {localeData?.navMenu.map((item, index) => (
            <Link
              key={index}
              href={
                index === 0 && pathname.startsWith('/dashboard')
                  ? '/dashboard'
                  : item.link
              }
              className="text-base font-medium transition-colors hover:text-primary"
            >
              {item.title}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          {user && showSearch ? (
            <Search />
          ) : (
            <Button href="/dashboard" variant="default" size="lg">
              {localeData?.ctaMenu.title.register}
            </Button>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex items-center gap-2 md:hidden">
          {user && showSearch && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSearch}
              aria-label="Toggle search"
            >
              <SearchIcon className="h-5 w-5" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <MenuIcon className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div
        className={cn(
          'md:hidden border-t border-border/40 bg-background overflow-hidden transition-all duration-300 ease-in-out',
          isSearchOpen ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0',
        )}
      >
        <div className="container mx-auto py-3 px-4">
          <Search />
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          'md:hidden border-t border-border/40 bg-background overflow-hidden transition-all duration-300 ease-in-out',
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0',
        )}
      >
        <div className="container mx-auto py-4 px-4 flex flex-col gap-4">
          {localeData?.navMenu.map((item, index) => (
            <Link
              key={index}
              href={
                index === 0 && pathname.startsWith('/dashboard')
                  ? '/dashboard'
                  : item.link
              }
              className="text-sm font-medium text-center transition-colors hover:text-primary py-2"
              onClick={() => setIsOpen(false)}
            >
              {item.title}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
};
