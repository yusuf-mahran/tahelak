import type { Metadata } from 'next';
import { Cairo, Tomorrow } from 'next/font/google';
import { cookies } from 'next/headers';
import { LanguageProvider } from '../context/LanguageContext';
import { AuthProvider } from '../context/AuthContext';
import './globals.css';
import { getDictionary } from '@/lib/get-dictionary';
import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';
import { LANGUAGE_DATA } from '@/types/languages';

const cairo = Cairo({
  variable: '--font-cairo',
  subsets: ['latin', 'arabic'],
});

const tomorrow = Tomorrow({
  variable: '--font-tomorrow',
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
  title: 'Tahelak',
  description: 'Car maintenance made easy',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get('NEXT_LOCALE')?.value;
  const locale = localeCookie === 'en' ? 'en' : 'ar';
  const dir = locale === 'en' ? 'ltr' : 'rtl';
  const initialData: LANGUAGE_DATA = await getDictionary(locale);

  return (
    <html lang={locale} dir={dir}>
      <body
        className={`${
          locale === 'ar' ? cairo.className : tomorrow.className
        } antialiased`}
      >
        <AuthProvider>
          <LanguageProvider initialLocale={locale} initialData={initialData}>
            <Navbar />
            {children}
            <Footer />
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
