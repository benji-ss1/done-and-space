'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogoHorizontal } from './Logo';
import { Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Buy', href: '/buy' },
  { label: 'Rent', href: '/let' },
  { label: 'Sell', href: '/sell' },
  { label: 'Landlords', href: '/landlords' },
  { label: 'Tenants', href: '/tenants' },
  { label: 'Properties', href: '/properties' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const isHome = pathname === '/';
  const transparent = isHome && !scrolled && !mobileOpen;

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 900,
        background: transparent ? 'transparent' : 'rgba(10,6,7,0.95)',
        backdropFilter: transparent ? 'none' : 'blur(16px)',
        borderBottom: transparent ? 'none' : '1px solid rgba(255,255,255,0.06)',
        transition: 'background 0.3s ease, backdrop-filter 0.3s ease, border-color 0.3s ease',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <LogoHorizontal variant="light" size="sm" />
          </Link>

          {/* Desktop nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }} className="nav-desktop">
            {NAV_LINKS.map(link => (
              <Link key={link.href} href={link.href} style={{
                color: pathname === link.href ? 'white' : 'rgba(255,255,255,0.65)',
                textDecoration: 'none',
                padding: '7px 14px',
                borderRadius: 8,
                fontSize: 14,
                fontWeight: pathname === link.href ? 600 : 400,
                fontFamily: 'Outfit, sans-serif',
                background: pathname === link.href ? 'rgba(139,26,47,0.25)' : 'transparent',
                transition: 'all 0.15s',
              }}
                onMouseEnter={e => { if (pathname !== link.href) e.currentTarget.style.color = 'white'; }}
                onMouseLeave={e => { if (pathname !== link.href) e.currentTarget.style.color = 'rgba(255,255,255,0.65)'; }}
              >
                {link.label}
              </Link>
            ))}
            <Link href="/contact" style={{
              marginLeft: 12,
              background: '#8B1A2F',
              color: 'white',
              textDecoration: 'none',
              padding: '8px 18px',
              borderRadius: 9,
              fontSize: 13.5,
              fontWeight: 600,
              fontFamily: 'Outfit, sans-serif',
              transition: 'background 0.15s',
            }}
              onMouseEnter={e => e.currentTarget.style.background = '#a01f37'}
              onMouseLeave={e => e.currentTarget.style.background = '#8B1A2F'}
            >
              Contact Us
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(v => !v)}
            style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', display: 'none', padding: 4 }}
            className="nav-mobile-toggle"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div style={{ background: 'rgba(10,6,7,0.98)', borderTop: '1px solid rgba(255,255,255,0.08)', padding: '12px 24px 20px' }}>
            {NAV_LINKS.map(link => (
              <Link key={link.href} href={link.href} style={{
                display: 'block',
                color: pathname === link.href ? '#c0374f' : 'rgba(255,255,255,0.7)',
                textDecoration: 'none',
                padding: '11px 0',
                fontSize: 15,
                fontWeight: pathname === link.href ? 600 : 400,
                fontFamily: 'Outfit, sans-serif',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
              }}>
                {link.label}
              </Link>
            ))}
            <Link href="/contact" style={{
              display: 'block',
              marginTop: 14,
              background: '#8B1A2F',
              color: 'white',
              textDecoration: 'none',
              padding: '11px 18px',
              borderRadius: 9,
              fontSize: 14,
              fontWeight: 600,
              fontFamily: 'Outfit, sans-serif',
              textAlign: 'center',
            }}>
              Contact Us
            </Link>
          </div>
        )}
      </nav>

      <style>{`
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-mobile-toggle { display: block !important; }
        }
      `}</style>
    </>
  );
}
