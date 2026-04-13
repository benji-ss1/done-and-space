'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Logo from './Logo';
import { Menu, X } from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://done-space-backend-production.up.railway.app/api/v1';

const NAV_LINKS = [
  { label: 'Buy', href: '/buy' },
  { label: 'Rent', href: '/let' },
  { label: 'Sell', href: '/sell' },
  { label: 'Properties', href: '/properties' },
  { label: 'Development', href: '/development' },
  { label: 'Careers', href: '/careers' },
  { label: 'Agents', href: '/agents' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [signInOpen, setSignInOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signingIn, setSigningIn] = useState(false);
  const [signInError, setSignInError] = useState('');
  const pathname = usePathname();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); setSignInOpen(false); }, [pathname]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setSignInOpen(false);
      }
    };
    if (signInOpen) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [signInOpen]);

  const handleSignIn = async () => {
    if (!email || !password) { setSignInError('Email and password required.'); return; }
    setSigningIn(true); setSignInError('');
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error('Invalid credentials');
      const data = await res.json();
      localStorage.setItem('access_token', data.access_token || data.token || '');
      if (data.user) localStorage.setItem('user', JSON.stringify(data.user));
      window.location.href = '/dashboard';
    } catch {
      setSignInError('Invalid credentials. Please try again.');
    }
    setSigningIn(false);
  };

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 900,
        background: 'rgba(245,240,232,0.97)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border, #E0D9CE)',
        boxShadow: scrolled ? '0 2px 16px rgba(0,0,0,0.07)' : 'none',
        transition: 'box-shadow 0.3s ease',
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', height: 72, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

          {/* Logo */}
          <Link href="/" style={{ textDecoration: 'none', flexShrink: 0 }}>
            <Logo variant="dark" width={155} />
          </Link>

          {/* Desktop center nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }} className="nav-desktop">
            {NAV_LINKS.map(link => {
              const active = pathname === link.href;
              return (
                <Link key={link.href} href={link.href} style={{
                  color: active ? 'var(--brand, #7B1828)' : 'var(--ink-muted, #6B6B6B)',
                  textDecoration: 'none',
                  padding: '6px 4px',
                  fontSize: 13.5,
                  fontWeight: active ? 600 : 500,
                  fontFamily: "'Outfit', sans-serif",
                  letterSpacing: '0.01em',
                  transition: 'color 0.15s',
                  borderBottom: active ? '2px solid var(--brand, #7B1828)' : '2px solid transparent',
                }}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.color = 'var(--ink, #1A1A1A)'; }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.color = 'var(--ink-muted, #6B6B6B)'; }}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Desktop right: phone + sign in + CTA */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }} className="nav-desktop">
            <a href="tel:+260971000000" style={{ color: 'var(--ink-muted, #6B6B6B)', textDecoration: 'none', fontSize: 12.5, fontWeight: 500, fontFamily: "'Outfit', sans-serif", transition: 'color 0.15s', whiteSpace: 'nowrap' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--ink, #1A1A1A)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--ink-muted, #6B6B6B)'}
            >
              +260 971 000 000
            </a>

            {/* Sign In button + dropdown */}
            <div ref={dropdownRef} style={{ position: 'relative' }}>
              <button onClick={() => { setSignInOpen(v => !v); setSignInError(''); }} style={{
                background: 'transparent',
                border: '1px solid var(--border, #E0D9CE)',
                color: 'var(--ink, #1A1A1A)',
                padding: '7px 16px',
                borderRadius: 4,
                fontSize: 13,
                fontWeight: 500,
                cursor: 'pointer',
                fontFamily: "'Outfit', sans-serif",
                transition: 'all 0.15s',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--ink-muted, #6B6B6B)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border, #E0D9CE)'; }}
              >
                Sign In
              </button>

              {signInOpen && (
                <div style={{
                  position: 'absolute', top: 'calc(100% + 12px)', right: 0,
                  width: 320, background: 'white',
                  border: '1px solid var(--border, #E0D9CE)',
                  borderRadius: 6, padding: '24px',
                  boxShadow: '0 16px 48px rgba(0,0,0,0.12)',
                  zIndex: 1000,
                }}>
                  <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 18, fontWeight: 600, color: 'var(--ink, #1A1A1A)', marginBottom: 4 }}>Team &amp; Agent Login</p>
                  <p style={{ color: 'var(--ink-muted, #6B6B6B)', fontSize: 13, lineHeight: 1.5, marginBottom: 20 }}>
                    Access your Done &amp; Space dashboard.
                  </p>
                  {signInError && (
                    <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '8px 12px', borderRadius: 4, marginBottom: 14, fontSize: 12.5 }}>
                      {signInError}
                    </div>
                  )}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div>
                      <label style={{ display: 'block', color: 'var(--ink-muted, #6B6B6B)', fontSize: 10.5, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 5 }}>Email Address</label>
                      <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        style={{ width: '100%', border: '1px solid var(--border, #E0D9CE)', borderRadius: 4, padding: '9px 12px', fontSize: 13.5, outline: 'none', fontFamily: "'Outfit', sans-serif", color: 'var(--ink, #1A1A1A)', boxSizing: 'border-box' }}
                        onKeyDown={e => e.key === 'Enter' && handleSignIn()}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', color: 'var(--ink-muted, #6B6B6B)', fontSize: 10.5, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 5 }}>Password</label>
                      <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                        placeholder="••••••••"
                        style={{ width: '100%', border: '1px solid var(--border, #E0D9CE)', borderRadius: 4, padding: '9px 12px', fontSize: 13.5, outline: 'none', fontFamily: "'Outfit', sans-serif", color: 'var(--ink, #1A1A1A)', boxSizing: 'border-box' }}
                        onKeyDown={e => e.key === 'Enter' && handleSignIn()}
                      />
                    </div>
                    <button onClick={handleSignIn} disabled={signingIn} style={{
                      background: 'var(--brand, #7B1828)', color: 'white', border: 'none',
                      padding: '11px', borderRadius: 4, fontSize: 13.5, fontWeight: 600,
                      cursor: 'pointer', fontFamily: "'Outfit', sans-serif",
                      opacity: signingIn ? 0.7 : 1,
                    }}>
                      {signingIn ? 'Signing In...' : 'Sign In'}
                    </button>
                  </div>
                  <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--border, #E0D9CE)' }}>
                    <p style={{ color: 'var(--ink-muted, #6B6B6B)', fontSize: 12, lineHeight: 1.5 }}>
                      Not registered? <Link href="/contact" style={{ color: 'var(--brand, #7B1828)', fontWeight: 600 }}>Contact us</Link> to get access.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Book a Consultation CTA */}
            <Link href="/contact" style={{
              background: 'var(--brand, #7B1828)',
              color: 'white',
              textDecoration: 'none',
              padding: '9px 20px',
              borderRadius: 4,
              fontSize: 13,
              fontWeight: 600,
              fontFamily: "'Outfit', sans-serif",
              letterSpacing: '0.01em',
              transition: 'background 0.15s',
              whiteSpace: 'nowrap',
            }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--brand-dark, #5C1220)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--brand, #7B1828)'}
            >
              Book a Consultation
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(v => !v)}
            style={{ background: 'none', border: 'none', color: 'var(--ink, #1A1A1A)', cursor: 'pointer', display: 'none', padding: 4 }}
            className="nav-mobile-toggle"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile full-screen overlay */}
        {mobileOpen && (
          <div style={{ background: 'var(--brand, #7B1828)', minHeight: '100vh', padding: '20px 32px 48px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1, paddingTop: 16 }}>
              {NAV_LINKS.map(link => (
                <Link key={link.href} href={link.href} style={{
                  display: 'block',
                  color: pathname === link.href ? 'var(--gold, #C9A84C)' : 'rgba(255,255,255,0.85)',
                  textDecoration: 'none',
                  padding: '14px 0',
                  fontSize: 28,
                  fontWeight: 300,
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontStyle: 'italic',
                  borderBottom: '1px solid rgba(255,255,255,0.1)',
                  letterSpacing: '-0.01em',
                }}>
                  {link.label}
                </Link>
              ))}
              <Link href="/contact" style={{
                display: 'block',
                color: 'rgba(255,255,255,0.85)',
                textDecoration: 'none',
                padding: '14px 0',
                fontSize: 28,
                fontWeight: 300,
                fontFamily: "'Playfair Display', Georgia, serif",
                fontStyle: 'italic',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
              }}>
                Contact
              </Link>
            </div>
            <div style={{ marginTop: 40, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button onClick={() => { setMobileOpen(false); setSignInOpen(true); }} style={{ width: '100%', background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.25)', color: 'white', padding: '13px', borderRadius: 4, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: "'Outfit', sans-serif" }}>
                Sign In
              </button>
              <Link href="/contact" style={{ display: 'block', textAlign: 'center', background: 'var(--gold, #C9A84C)', color: 'var(--ink, #1A1A1A)', padding: '13px', borderRadius: 4, fontSize: 14, fontWeight: 700, textDecoration: 'none', fontFamily: "'Outfit', sans-serif" }}>
                Book a Consultation
              </Link>
            </div>
          </div>
        )}
      </nav>

      <style>{`
        @media (max-width: 900px) {
          .nav-desktop { display: none !important; }
          .nav-mobile-toggle { display: flex !important; }
        }
      `}</style>
    </>
  );
}
