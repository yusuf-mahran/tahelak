import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tahelak',
  description: 'Car maintenance made easy',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
