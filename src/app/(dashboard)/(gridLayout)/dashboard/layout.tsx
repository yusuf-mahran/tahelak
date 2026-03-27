import type { Metadata } from 'next';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import Sidebar from '@/components/shared/Sidebar';

export const metadata: Metadata = {
  title: 'Tahelak Dashboard',
  description: 'Manage car maintenance and medical records',
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-slate-50 overflow-hidden">
        <Sidebar aria-label="Dashboard navigation" />
        <main className="flex-1 overflow-y-auto p-8 pt-10 scroll-smooth">
          <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
