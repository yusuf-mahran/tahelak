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
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useDashboard } from '@/context/DashboardContext';

export default function Sidebar() {
  const pathname = usePathname();
  const { signOut, user } = useAuth();
  const router = useRouter();
  const { sidebarItems } = useDashboard();

  const backLinkText = sidebarItems?.activeItem?.href?.startsWith(
    'registration',
  )
    ? 'سجل مؤسستك'
    : 'ادارة المؤسسة';

  const handleLogout = async () => {
    await signOut();
    router.push('/login');
  };

  return (
    <div className="w-full flex md:flex-col h-full max-md:gap-4 overflow-y-auto">
      <div className="md:py-6 md:mb-4 lg:mx-0 md:mx-auto max-md:my-auto ">
        <Link
          href="/"
          className="flex items-center gap-2 text-black font-bold text-sm hover:opacity-80 transition-opacity"
        >
          <div className="w-6 h-6 border border-black rounded-full flex items-center justify-center text-[10px]">
            <ArrowRight className="h-3 w-3" />
          </div>
          <span className="max-lg:hidden">{backLinkText}</span>
        </Link>
      </div>

      <nav className="flex-1 px-0">
        <ul className="space-y-0 text-black/30 text-base max-md:flex">
          {sidebarItems?.navItems.map((item) => {
            const isActive = pathname === item.href;
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
                  className={cn(
                    'flex items-center gap-3 lg:px-6 px-4 md:py-4 py-2 transition-all duration-200 group leading-10 lg:border-s-4 md:border-s-2 max-md:border-b-2',
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
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {sidebarItems?.activeItem?.href?.startsWith('/dashboard') && (
        <div className="md:py-4 md:border-t max-md:border-s border-border md:mt-auto max-md:ms-auto max-md:flex justify-center items-center">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all duration-200 group text-xs md:mb-4"
          >
            <LogOut className="h-4 w-4 group-hover:text-red-400" />
            <span className="font-medium max-lg:hidden">تسجيل الخروج</span>
          </button>

          <div className="bg-slate-50 p-2 rounded-lg border border-border">
            <div className="flex items-center gap-2 max-lg:mx-auto max-lg:w-fit">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-[10px]">
                {user?.user_metadata?.institutionName
                  ? user.user_metadata.institutionName.charAt(0).toUpperCase()
                  : 'I'}
              </div>
              <div className="flex-1 min-w-0 max-lg:hidden">
                <p className="text-[10px] font-medium truncate text-slate-600">
                  {user?.user_metadata?.institutionName || 'اسم المؤسسة'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
