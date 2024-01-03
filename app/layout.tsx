import Navbar from '@/components/Navbar';
import './globals.css';
import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { Toaster } from 'react-hot-toast';
import ClientOnly from '@/components/ClientOnly';
import { auth } from '@/auth';
import { SessionProvider } from 'next-auth/react';

const inter = Inter({ subsets: ['latin'] });
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'SaveMelin',
  description: 'Ahorra dinero en la compra de tus productos favoritos.',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <html lang='es'>
        <body className={inter.className}>
          <main className='overflow-x-hidden'>
            <ClientOnly>
              <Toaster position='top-center' reverseOrder={false} />
              <Navbar />
              {children}
              <Analytics />
            </ClientOnly>
          </main>
        </body>
      </html>
    </SessionProvider>
  );
}
