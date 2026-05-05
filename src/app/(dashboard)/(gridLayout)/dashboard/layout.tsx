import type { Metadata } from 'next';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export const metadata: Metadata = {
  title: 'Tahelak Dashboard',
  description: 'Manage your Tahelak account, subscription, and more.',
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="w-full">{children}</div>
    </ProtectedRoute>
  );
}
