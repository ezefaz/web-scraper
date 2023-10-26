import Navbar from '@/components/Navbar';
import './globals.css';
import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { Toaster } from 'react-hot-toast';
import { Providers } from './providers';
import { getServerSession } from 'next-auth';

const inter = Inter({ subsets: ['latin'] });
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'SaveMelin',
  description: 'Seguí precios de tus productos favoritos y ahorrá dinero en tus compras online.',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession();

  console.log('HOLA -->', session);

  return (
    <Providers>
      <html lang='en'>
        <body className={inter.className}>
          <main className='max-w-10xl m-auto overflow-x-hidden'>
            <Toaster position='top-center' reverseOrder={false} />
            <Navbar session={session} />
            {children}
            <Analytics />
          </main>
        </body>
      </html>
    </Providers>
  );
}
