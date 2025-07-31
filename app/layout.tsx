import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ClientLayout from './ClientLayout'; // Import client-side layout

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TeleHealth - Connect with Healthcare Providers',
  description: 'Secure telemedicine platform connecting patients with qualified healthcare providers for convenient online consultations.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}