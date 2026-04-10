'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Users, Building2, Handshake, UserCheck, LogOut, Bell, BarChart2, Settings } from 'lucide-react';

const NAV = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/leads', label: 'Leads & CRM', icon: Users },
  { href: '/dashboard/properties', label: 'Properties', icon: Building2 },
  { href: '/dashboard/deals', label: 'Deals', icon: Handshake },
  { href: '/dashboard/agents', label: 'Agents', icon: UserCheck },
  { href: '/dashboard/reports', label: 'Reports', icon: BarChart2 },
  { href: '/dashboard/settings/users', label: 'User Management', icon: Settings },
];

const LogoMark = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <rect width="32" height="32" rx="8" fill="#8B1A2F"/>
    <path d="M7 8h8c4 0 6 2.5 6 6s-2 6-6 6H7V8z" stroke="white" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
    <path d="M11 20h10" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M13 23h8" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);

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

  const logout = () => { localStorage.clear(); router.push('/login'); };

  const ADMIN_ROLES = ['super_admin', 'admin', 'manager'];
  const canSeeUsers = ADMIN_ROLES.includes(user?.role);

  const visibleNav = NAV.filter(n => {
    if (n.href === '/dashboard/settings/users') return canSeeUsers;
    return true;
  });

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-base)' }}>
      <aside style={{ width: 240, background: 'var(--bg-surface)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 50 }}>
        <div style={{ padding: '22px 20px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <LogoMark />
            <div>
              <div style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: 14, lineHeight: 1 }}>Done & Space</div>
              <div style={{ color: 'var(--text-muted)', fontSize: 10, marginTop: 3, letterSpacing: '0.04em' }}>Properties Limited · Zambia</div>
            </div>
          </div>
        </div>

        <nav style={{ flex: 1, padding: '14px 10px', display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0 10px', marginBottom: 8 }}>Main Menu</div>
          {visibleNav.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
            return (
              <Link key={href} href={href} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '9px 11px', borderRadius: 8, textDecoration: 'none', fontWeight: active ? 600 : 400, fontSize: 13, background: active ? '#8B1A2F18' : 'transparent', color: active ? '#c0374f' : 'var(--text-secondary)', border: `1px solid ${active ? '#8B1A2F35' : 'transparent'}`, transition: 'all 0.15s' }}
                onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'var(--bg-elevated)'; e.currentTarget.style.color = 'var(--text-primary)'; }}}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}}>
                <Icon size={15} strokeWidth={active ? 2.2 : 1.8} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div style={{ padding: '12px', borderTop: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '10px 11px', borderRadius: 9, background: 'var(--bg-elevated)' }}>
            <div style={{ width: 30, height: 30, borderRadius: 7, background: '#8B1A2F18', border: '1px solid #8B1A2F35', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c0374f', fontWeight: 700, fontSize: 12, flexShrink: 0 }}>
              {user?.full_name?.[0] || 'A'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ color: 'var(--text-primary)', fontSize: 12, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.full_name || 'Admin'}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: 10, marginTop: 1, textTransform: 'capitalize' }}>{user?.role?.replace(/_/g, ' ')}</div>
            </div>
            <button onClick={logout} title="Sign out" style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4, borderRadius: 5, display: 'flex', transition: 'color 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
              <LogOut size={13} />
            </button>
          </div>
        </div>
      </aside>

      <div style={{ marginLeft: 240, flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <header style={{ height: 56, background: 'var(--bg-surface)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 28px', position: 'sticky', top: 0, zIndex: 40 }}>
          <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>
            {new Date().toLocaleDateString('en-ZM', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-muted)', width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <Bell size={13} />
            </div>
            <div style={{ background: '#8B1A2F', color: 'white', fontSize: 10.5, fontWeight: 700, padding: '5px 11px', borderRadius: 6, letterSpacing: '0.04em' }}>
              {user?.role?.replace(/_/g, ' ').toUpperCase()}
            </div>
          </div>
        </header>
        <main style={{ flex: 1, padding: '28px 32px' }}>{children}</main>
      </div>
    </div>
  );
}
