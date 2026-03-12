import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { auth } from '@/auth';
import ClientProviders from './client-providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SaveMelin',
  description: 'Ahorra dinero en la compra de tus productos favoritos.',
  icons: {
    icon: '/assets/icons/savemelin-favicon.svg',
    shortcut: '/assets/icons/savemelin-favicon.svg',
    apple: '/assets/icons/savemelin-favicon.svg',
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <html lang='es'>
      <body className={inter.className}>
        <main className='overflow-x-hidden'>
          <ClientProviders session={session}>{children}</ClientProviders>
        </main>
      </body>
    </html>
  );
}
