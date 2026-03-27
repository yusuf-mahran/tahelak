import { AuthRedirect } from '@/components/auth/ProtectedRoute';

export default function RegistrationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthRedirect>{children}</AuthRedirect>;
}
