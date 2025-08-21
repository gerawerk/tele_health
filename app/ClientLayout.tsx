// app/layout.tsx
'use client';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Toaster } from 'react-hot-toast';
import './globals.css';
import AuthProvider from '@/components/providers/AuthProvider';

export default function ClientLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith('/auth');
    const isdashPage = pathname.startsWith('/dashboard');

  return (
    <SessionProvider>
      <AuthProvider>
      {isAuthPage ? (
        // Layout for /auth pages (no Navbar/Footer)
        <>
          {children}
          <Toaster position="top-right" />
        </>
      ) : (
        // Layout for other pages (with Navbar/Footer)
        <div className="min-h-screen flex flex-col">
         {!isdashPage && <Navbar />}
          <main className="flex-1">{children}</main>
          {!isdashPage && <Footer />}
          <Toaster position="top-right" />
        </div>
      )}
          </AuthProvider>
    </SessionProvider>
  );
}