'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: '▦' },
  { href: '/dashboard/leads', label: 'Leads & CRM', icon: '👤' },
  { href: '/dashboard/properties', label: 'Properties', icon: '🏠' },
  { href: '/dashboard/deals', label: 'Deals', icon: '🤝' },
  { href: '/dashboard/agents', label: 'Agents', icon: '🧑‍💼' },
  { href: '/dashboard/reports', label: 'Reports', icon: '📊' },
  { href: '/dashboard/users', label: 'User Management', icon: '⚙️' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const userData = localStorage.getItem('user');
    if (!token) { router.push('/login'); return; }
    if (userData) setUser(JSON.parse(userData));
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    router.push('/login');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-base)', fontFamily: 'Outfit, sans-serif' }}>
      {/* Sidebar */}
      <div style={{ width: 240, background: 'var(--bg-surface)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, bottom: 0 }}>
        <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, background: '#8B1A2F', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, color: 'white' }}>D</div>
            <div>
              <div style={{ color: 'var(--text-primary)', fontSize: 13.5, fontWeight: 700 }}>Done & Space</div>
              <div style={{ color: 'var(--text-muted)', fontSize: 11 }}>Properties Limited · Zambia</div>
            </div>
          </div>
        </div>
        <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ color: 'var(--text-muted)', fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', padding: '0 8px', marginBottom: 8 }}>MAIN MENU</div>
          {navItems.map(item => {
            const active = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 8, background: active ? 'var(--accent-light)' : 'transparent', color: active ? 'var(--accent)' : 'var(--text-secondary)', textDecoration: 'none', fontSize: 13.5, fontWeight: active ? 600 : 400, transition: 'all 0.15s' }}>
                <span style={{ fontSize: 15 }}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div style={{ padding: '16px 12px', borderTop: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px' }}>
            <div style={{ width: 30, height: 30, background: '#8B1A2F', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: 'white' }}>
              {user?.full_name?.[0] || 'U'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ color: 'var(--text-primary)', fontSize: 12.5, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.full_name || 'User'}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: 10.5 }}>{user?.role?.replace('_', ' ').toUpperCase() || 'STAFF'}</div>
            </div>
            <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 16 }} title="Logout">→</button>
          </div>
        </div>
      </div>
      {/* Main content */}
      <div style={{ marginLeft: 240, flex: 1, padding: '32px 36px', minHeight: '100vh' }}>
        {children}
      </div>
    </div>
  );
}
