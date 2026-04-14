'use client';
import Link from 'next/link';
import Logo from './Logo';

const COLS = [
  {
    title: 'Explore',
    links: [
      { label: 'Properties for Sale', href: '/properties?listing_type=sale' },
      { label: 'Properties to Let',   href: '/properties?listing_type=let' },
      { label: 'New Developments',    href: '/development' },
      { label: 'Search by Area',      href: '/properties' },
      { label: 'Serviced Plots',      href: '/properties' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Done and Space', href: '/about' },
      { label: 'Careers',              href: '/careers' },
      { label: "Buyer's Guide",        href: '/buyers-guide' },
      { label: 'Our Agents',           href: '/agents' },
      { label: 'Privacy Policy',       href: '/privacy' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Contact Us',           href: '/contact' },
      { label: 'For Buyers',           href: '/buy' },
      { label: 'For Sellers',          href: '/sell' },
      { label: 'For Landlords',        href: '/landlords' },
      { label: 'For Tenants',          href: '/tenants' },
    ],
  },
];

const linkStyle = {
  color: 'rgba(255,255,255,0.55)',
  fontSize: 13.5,
  textDecoration: 'none',
  fontFamily: "'Outfit', sans-serif",
  transition: 'color 0.15s',
  display: 'block',
};

export default function Footer() {
  return (
    <footer style={{ background: 'var(--bg-surface, #120f10)', fontFamily: "'Outfit', sans-serif" }}>

      {/* Top row — logo + CTA */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '48px 40px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
        <Logo variant="light" width={155} />
        <Link href="/contact" style={{
          display: 'inline-block',
          color: 'rgba(255,255,255,0.75)',
          textDecoration: 'none',
          padding: '10px 24px',
          border: '1px solid rgba(255,255,255,0.20)',
          borderRadius: 4,
          fontSize: 12.5,
          fontWeight: 600,
          fontFamily: "'Outfit', sans-serif",
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          transition: 'all 0.15s',
        }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.50)'; e.currentTarget.style.color = 'white'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.20)'; e.currentTarget.style.color = 'rgba(255,255,255,0.75)'; }}
        >
          Book a Consultation
        </Link>
      </div>

      {/* Divider */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 40px' }}>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }} />
      </div>

      {/* Main link grid */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '48px 40px', display: 'grid', gridTemplateColumns: '1.8fr 1fr 1fr 1fr', gap: 48 }}>

        {/* Brand column */}
        <div>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13.5, lineHeight: 1.75, maxWidth: 300, fontFamily: "'Outfit', sans-serif", marginBottom: 24 }}>
            A licensed real estate agency operating across Zambia. Built for the way property is actually bought, sold, and managed here. Straightforward, documented, and accountable at every step.
          </p>
          <div style={{ display: 'flex', gap: 10 }}>
            {(['F', 'I', 'Y'] as const).map((icon, i) => {
              const names = ['Facebook', 'Instagram', 'YouTube'];
              return (
                <a key={icon} href="#" aria-label={names[i]} style={{
                  width: 34, height: 34, borderRadius: '50%',
                  border: '1px solid rgba(255,255,255,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'rgba(255,255,255,0.45)', fontSize: 11, textDecoration: 'none',
                  fontFamily: "'Outfit', sans-serif", fontWeight: 700,
                  transition: 'all 0.15s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.45)'; e.currentTarget.style.color = 'white'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.color = 'rgba(255,255,255,0.45)'; }}
                >
                  {icon}
                </a>
              );
            })}
          </div>
        </div>

        {/* Link columns */}
        {COLS.map(col => (
          <div key={col.title}>
            <h4 style={{ color: 'rgba(255,255,255,0.25)', fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 20, fontFamily: "'Outfit', sans-serif" }}>
              {col.title}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {col.links.map(link => (
                <Link key={link.label} href={link.href} style={linkStyle}
                  onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.90)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.55)'}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, maxWidth: '100%' }}>
        <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 12, fontFamily: "'Outfit', sans-serif" }}>
          {new Date().getFullYear()} Done and Space Properties Limited. All rights reserved. Licensed Real Estate Agency. Zambia.
        </p>
        <Link href="/dashboard" style={{
          color: 'rgba(255,255,255,0.20)', fontSize: 12, textDecoration: 'none',
          fontFamily: "'Outfit', sans-serif", transition: 'color 0.15s',
        }}
          onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.55)'}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.20)'}
        >
          Internal Access
        </Link>
      </div>

      <style>{`
        @media (max-width: 900px) {
          footer > div:nth-child(4) { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 600px) {
          footer > div:nth-child(4) { grid-template-columns: 1fr !important; padding: 32px 24px !important; }
          footer > div:first-child  { padding: 32px 24px 24px !important; }
        }
      `}</style>
    </footer>
  );
}
