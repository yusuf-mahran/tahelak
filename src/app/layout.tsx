import type { Metadata } from 'next';
import { Cairo } from 'next/font/google';
import './globals.css';
import { cookies } from 'next/headers';
import { LanguageProvider } from '@/context/LanguageContext';
import { getDictionary } from '@/lib/get-dictionary';
import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';
import { LANGUAGE_DATA } from '@/types/languages';
import { ToastContainer } from 'react-toastify';

const cairo = Cairo({
  variable: '--font-cairo',
  subsets: ['latin', 'arabic'],
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
      <body className={`${cairo.className} antialiased`}>
        <LanguageProvider initialLocale={locale} initialData={initialData}>
          <Navbar />
          {children}
          <Footer />
          <ToastContainer />
        </LanguageProvider>
      </body>
    </html>
  );
}
