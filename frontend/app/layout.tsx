'use client';
import './globals.css';
import { usePathname } from 'next/navigation';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WhatsAppFloat from '../components/WhatsAppFloat';

const DASHBOARD_PREFIX = '/dashboard';
const AUTH_PATHS = ['/login'];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith(DASHBOARD_PREFIX);
  const isAuth = AUTH_PATHS.some(p => pathname.startsWith(p));
  const isPublic = !isDashboard && !isAuth;

  return (
    <html lang="en">
      <head>
        <title>Done &amp; Space Properties — Zambia Real Estate</title>
        <meta name="description" content="Find your perfect property in Zambia. Buy, rent, sell, or let with Done & Space Properties — Lusaka's trusted real estate agency." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={isPublic ? 'public-site' : ''} style={{ background: isPublic ? '#0a0608' : undefined }}>
        {isPublic && <Navbar />}
        {children}
        {isPublic && <Footer />}
        {isPublic && <WhatsAppFloat />}
      </body>
    </html>
  );
}
