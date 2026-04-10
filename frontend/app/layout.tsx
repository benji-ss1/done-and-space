import type { Metadata } from 'next';
import { AuthProvider } from '../lib/auth';
import { QueryProvider } from '../lib/query-provider';
import './globals.css';

export const metadata: Metadata = {
  title: 'Done & Space Properties',
  description: 'Zambia\'s trusted property platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
