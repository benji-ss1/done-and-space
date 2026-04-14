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
        <title>Done &amp; Space Properties | Buy, Sell &amp; Let Property in Zambia</title>
        <meta name="description" content="Zambia's trusted property platform. Find verified properties for sale and to let across Lusaka, Copperbelt, and all provinces. Done & Space Properties." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400;1,700&family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body
        className={isPublic ? 'public-site' : ''}
        style={{ background: isPublic ? 'var(--cream, #F8F3ED)' : undefined }}
      >
        {isPublic && <Navbar />}
        <main style={{ paddingTop: (isPublic && pathname !== '/') ? 72 : 0 }}>
          {children}
        </main>
        {isPublic && <Footer />}
        {isPublic && <WhatsAppFloat />}
      </body>
    </html>
  );
}
