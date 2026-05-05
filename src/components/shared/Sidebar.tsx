'use client';

import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  UserCog,
  Stethoscope,
  CreditCard,
  LogOut,
  Info,
  FileText,
  ArrowRight,
  Menu,
  X as CloseIcon,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDashboard } from '@/context/DashboardContext';
import { useAuth } from '@/hooks/auth/useAuth';
import { useLanguage } from '@/context/LanguageContext';
import { useEffect, useRef, useState } from 'react';
import { Modal } from '@/components/ui/modal';
import Skeleton from '../utils/Skeleton';
import { useDashboardDataContext } from '@/context/DashboardDataContext';
import Image from 'next/image';

export default function Sidebar() {
  const pathname = usePathname();
  const { handleLogout } = useAuth();
  const router = useRouter();
  const { sidebarItems } = useDashboard();
  const { localeData, locale } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutWarning, setShowLogoutWarning] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const { profile } = useDashboardDataContext();

  const backLinkText = sidebarItems?.activeItem?.href?.startsWith(
    '/registration',
  )
    ? localeData?.backLink.registration
    : localeData?.backLink.dashboard;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    const updateLoading = () => {
      setLoading(false);
    };

    if (localeData) {
      updateLoading();
    }
  }, [localeData]);

  if (loading) {
    return (
      // skeleton loader for sidebar
      <div className="w-full flex max-md:items-center md:flex-col h-full max-md:gap-4 overflow-y-auto animate-pulse">
        <Skeleton height={10} className="my-6 max-md:max-w-10" />

        <div className="flex-1 px-0 flex md:flex-col">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="relative">
              <div
                className={cn(
                  'flex items-center gap-3 lg:px-6 px-4 md:py-4 py-2 transition-all duration-200 group leading-10 lg:border-s-4 md:border-s-2 max-md:border-b-2',
                  'text-inherit border-border',
                )}
              >
                <Skeleton width={6} height={6} className="shrink-0" />
                <Skeleton className="hidden lg:inline" />
              </div>
            </div>
          ))}
        </div>

        <div className="max-md:w-10 max-md:ps-4 md:py-4 md:border-t max-md:border-s border-border md:mt-auto max-md:ms-auto max-md:flex justify-center items-center">
          <Skeleton rounded="md" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full flex md:flex-col h-full max-md:gap-4 sm:overflow-y-auto overflow-y-visible">
      <div className="flex items-center justify-between w-full md:block">
        <div className="md:py-6 md:mb-4 lg:mx-0 md:mx-auto max-md:my-auto flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-black font-bold text-sm hover:opacity-80 transition-opacity"
          >
            <div className="w-6 h-6 border border-black rounded-full flex items-center justify-center text-[10px]">
              <ArrowRight
                className={cn('h-3 w-3', locale === 'en' ? 'rotate-180' : '')}
              />
            </div>
            <span className="max-lg:hidden">{backLinkText}</span>
          </Link>
        </div>
      </div>

      <nav
        ref={menuRef}
        className={cn(
          'flex-1 px-0 transition-all duration-300 ease-in-out',
          'max-sm:absolute max-sm:inset-x-0 max-sm:top-full max-sm:z-50 max-sm:bg-background max-sm:border max-sm:border-border max-sm:backdrop-blur-md max-sm:shadow-xl max-sm:rounded-xl max-sm:mt-2',
          isOpen
            ? 'max-sm:opacity-100 max-sm:translate-y-0'
            : 'max-sm:opacity-0 max-sm:pointer-events-none max-sm:-translate-y-4',
        )}
      >
        <ul className="space-y-0 text-black/30 text-base max-md:flex max-sm:flex-col">
          {sidebarItems?.navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              pathname.split('/')[2] === item.href?.split('/')[2];
            const IconMap = {
              LayoutDashboard,
              Users,
              UserCog,
              Stethoscope,
              CreditCard,
              Info,
              FileText,
            };
            const Icon =
              IconMap[item.icon as keyof typeof IconMap] || LayoutDashboard;

            return (
              <li key={item.id} className="relative">
                <Link
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    'flex items-center gap-3 lg:ps-6 lg:pe-0 px-4 md:py-4 sm:py-2 py-4 transition-all duration-200 group leading-10 lg:border-s-4 md:border-s-2 max-md:border-b-2 sm:border-b-0 max-sm:border-b max-sm:last:border-b-0',
                    isActive
                      ? 'text-primary font-bold border-primary'
                      : 'border-border hover:text-primary hover:border-primary',
                  )}
                >
                  <Icon
                    className={cn(
                      'h-4 w-4 shrink-0',
                      isActive ? 'text-primary' : 'text-inherit',
                    )}
                  />
                  <span className="hidden lg:inline">{item.title}</span>
                  <span className="sm:hidden text-sm uppercase tracking-widest">
                    {item.title}
                  </span>
                </Link>
              </li>
            );
          })}

          {/* Mobile Profile/Logout inside the menu on mobile only */}
          {sidebarItems?.activeItem?.href?.startsWith('/dashboard') && (
            <li className="sm:hidden border-t border-border mt-2 p-4 space-y-4">
              <Link
                href="/dashboard/profile"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 py-2"
              >
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                  {profile?.name ? profile.name.charAt(0).toUpperCase() : 'I'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-foreground truncate">
                    {profile?.name ||
                      (locale === 'en' ? 'Username' : 'اسم المستخدم')}
                  </p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                    {locale === 'en' ? 'My Profile' : 'ملفي الشخصي'}
                  </p>
                </div>
              </Link>

              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  setShowLogoutWarning(true);
                }}
                className="w-full flex items-center gap-3 py-3 px-4 rounded-xl bg-destructive/5 text-destructive border border-destructive/10 text-sm font-bold uppercase tracking-widest"
              >
                <LogOut className="h-4 w-4" />
                <span>{locale === 'en' ? 'Log Out' : 'تسجيل الخروج'}</span>
              </button>
            </li>
          )}
        </ul>
      </nav>

      {/* Mobile Menu Toggle beside Backlink */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="sm:hidden p-1.5 text-primary bg-primary/5 rounded-lg border border-primary/20 hover:bg-primary/10 transition-colors"
      >
        {isOpen ? (
          <CloseIcon className="h-5 w-5" />
        ) : (
          <Menu className="h-5 w-5" />
        )}
      </button>

      {sidebarItems?.activeItem?.href?.startsWith('/dashboard') && (
        <div
          className={cn(
            'md:py-4 md:border-t max-md:border-s border-border md:mt-auto overflow-hidden',
            'max-md:ms-auto max-md:ps-2 max-md:flex justify-center items-center max-md:gap-2',
            'max-sm:hidden',
          )}
        >
          <button
            type="button"
            onClick={() => setShowLogoutWarning(true)}
            className="w-full flex items-center gap-3 px-2 md:px-4 py-2 rounded-lg border border-transparent text-accent-foreground/70 hover:text-accent-foreground hover:bg-destructive/5 hover:border-destructive/20 transition-all duration-200 group text-xs md:mb-4"
          >
            <LogOut className="h-4 w-4 group-hover:text-destructive" />
            <span className="font-medium lg:inline sm:hidden">
              {locale === 'en' ? 'Log Out' : 'تسجيل الخروج'}
            </span>
          </button>

          <Link
            href="/dashboard/profile"
            className="bg-accent/50 block p-1 md:p-2 rounded-lg border border-border hover:border-primary hover:bg-accent/70 transition-all duration-200 max-lg:mx-auto max-lg:w-fit"
          >
            <div className="flex items-center gap-2 max-lg:mx-auto max-lg:w-fit">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-[10px]">
                {profile?.profile_img ? (
                  <Image
                    src={profile.profile_img}
                    alt={profile.name}
                    width={50}
                    height={50}
                    className="w-6 h-6 rounded-full border border-border object-cover"
                  />
                ) : profile?.name ? (
                  profile.name.charAt(0).toUpperCase()
                ) : (
                  'I'
                )}
              </div>
              <div className="flex-1 min-w-0 lg:inline sm:hidden">
                <p className="text-[10px] font-medium truncate text-slate-600">
                  {profile?.name ||
                    (locale === 'en' ? 'Username' : 'اسم المستخدم')}
                </p>
              </div>
            </div>
          </Link>
        </div>
      )}
      {/* Logout confirmation modal */}
      <Modal
        isOpen={showLogoutWarning}
        onClose={() => setShowLogoutWarning(false)}
        title={locale === 'en' ? 'Log Out?' : 'تسجيل الخروج؟'}
        size="sm"
        confirmClose={false}
      >
        <div className="flex flex-col items-center gap-6 text-center">
          <p className="text-sm text-muted-foreground">
            {locale === 'en'
              ? 'You will be redirected to the login page.'
              : 'سيتم تحويلك إلى صفحة تسجيل الدخول.'}
          </p>
          <div className="flex w-full gap-3">
            <button
              type="button"
              onClick={() => setShowLogoutWarning(false)}
              className="flex-1 rounded-xl border border-border/60 bg-background py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted/30"
            >
              {locale === 'en' ? 'Cancel' : 'إلغاء'}
            </button>
            <button
              type="button"
              onClick={async () => {
                setShowLogoutWarning(false);
                await handleLogout();
                router.push('/login');
              }}
              className="flex-1 rounded-xl bg-destructive py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              {locale === 'en' ? 'Log Out' : 'خروج'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
