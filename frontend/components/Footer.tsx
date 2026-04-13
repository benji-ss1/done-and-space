'use client';
import Link from 'next/link';
import Logo from './Logo';

const COLS = [
  {
    title: 'Properties',
    links: [
      { label: 'Properties for Sale', href: '/properties?listing_type=sale' },
      { label: 'Properties to Let',   href: '/properties?listing_type=let' },
      { label: 'New Developments',    href: '/development' },
      { label: 'Search by Area',      href: '/properties' },
      { label: 'Serviced Plots',        href: '/properties' },
      { label: 'Submit a Property',     href: '/sell' },
    ],
  },
  {
    title: 'Services',
    links: [
      { label: 'For Buyers',           href: '/buy' },
      { label: 'For Sellers',          href: '/sell' },
      { label: 'For Landlords',        href: '/landlords' },
      { label: 'For Tenants',          href: '/tenants' },
      { label: 'Property Maintenance', href: '/maintenance' },
      { label: 'Agent Network',        href: '/agents' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Done & Space', href: '/about' },
      { label: 'Careers',            href: '/careers' },
      { label: "Buyer's Guide",      href: '/buyers-guide' },
      { label: 'Contact Us',         href: '/contact' },
      { label: 'Privacy Policy',     href: '/contact' },
    ],
  },
];

const linkHover = {
  onMouseEnter: (e: React.MouseEvent<HTMLAnchorElement>) => { e.currentTarget.style.color = 'rgba(255,255,255,1)'; },
  onMouseLeave: (e: React.MouseEvent<HTMLAnchorElement>) => { e.currentTarget.style.color = 'rgba(255,255,255,0.60)'; },
};

export default function Footer() {
  return (
    <footer style={{ background: 'var(--brand-dark, #5C1220)', fontFamily: "'Outfit', system-ui, sans-serif" }}>

      {/* Main grid */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '64px 40px 0', display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr 1.2fr', gap: 40 }}>

        {/* Column 1 — Brand */}
        <div>
          <Logo variant="light" width={145} />
          <p style={{ color: 'rgba(255,255,255,0.60)', fontSize: 14, lineHeight: 1.7, marginTop: 16, maxWidth: 280, fontFamily: "'Outfit', sans-serif" }}>
            A licensed real estate agency operating across Zambia. Our platform is built for the way property is bought, sold, and managed here. Straightforward, documented, and accountable at every step.
          </p>
          <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
            {(['Facebook', 'Instagram', 'YouTube'] as const).map(name => (
              <a key={name} href="#" aria-label={name} style={{ width: 36, height: 36, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.20)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.55)', fontSize: 11, textDecoration: 'none', transition: 'all 0.15s', fontFamily: "'Outfit', sans-serif", fontWeight: 600 }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'white'; e.currentTarget.style.color = 'white'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.20)'; e.currentTarget.style.color = 'rgba(255,255,255,0.55)'; }}
              >
                {name[0]}
              </a>
            ))}
          </div>
        </div>

        {/* Columns 2 & 3 — Links */}
        {COLS.slice(0, 2).map(col => (
          <div key={col.title}>
            <h4 style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16, fontFamily: "'Outfit', sans-serif" }}>
              {col.title}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {col.links.map(link => (
                <Link key={link.label} href={link.href}
                  style={{ color: 'rgba(255,255,255,0.60)', fontSize: 14, textDecoration: 'none', transition: 'color 0.15s', fontFamily: "'Outfit', sans-serif" }}
                  {...linkHover}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        ))}

        {/* Column 4 — Contact */}
        <div>
          <h4 style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16, fontFamily: "'Outfit', sans-serif" }}>Contact Us</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <a href="tel:+260971000000" style={{ color: 'white', fontFamily: "'Playfair Display', Georgia, serif", fontSize: 18, fontWeight: 600, textDecoration: 'none' }}>
              +260 971 000 000
            </a>
            <a href="mailto:info@doneandspace.com" style={{ color: 'rgba(255,255,255,0.60)', fontSize: 13, textDecoration: 'none', fontFamily: "'Outfit', sans-serif" }}
              onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.90)'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.60)'}
            >
              info@doneandspace.com
            </a>
            <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13, fontFamily: "'Outfit', sans-serif" }}>Lusaka, Zambia</span>
            <span style={{ color: 'rgba(255,255,255,0.40)', fontSize: 12, fontFamily: "'Outfit', sans-serif" }}>Mon–Fri 8AM–6PM · Sat 9AM–2PM</span>
            <a href="https://wa.me/260971000000" target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#25D366', color: 'white', padding: '8px 16px', borderRadius: 4, fontSize: 13, fontWeight: 600, textDecoration: 'none', marginTop: 8, width: 'fit-content', fontFamily: "'Outfit', sans-serif" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* Compliance strip */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: 48, padding: '16px 40px', textAlign: 'center' }}>
        <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.35)', lineHeight: 1.8 }}>
          Done and Space Properties Limited. Licensed Real Estate Agency. Zambia. All listings reviewed before publication. Every inquiry tracked and assigned.
        </p>
      </div>

      {/* Copyright bar */}
      <div style={{ background: 'rgba(0,0,0,0.25)', padding: '16px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
        <p style={{ color: 'rgba(255,255,255,0.30)', fontSize: 12, fontFamily: "'Outfit', sans-serif" }}>
          {new Date().getFullYear()} Done and Space Properties Limited. All rights reserved.
        </p>
        <Link href="/dashboard" style={{ color: 'rgba(255,255,255,0.30)', fontSize: 12, textDecoration: 'none', fontFamily: "'Outfit', sans-serif", transition: 'color 0.15s' }}
          onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.65)'}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.30)'}
        >
          Internal Access
        </Link>
      </div>

      <style>{`
        @media (max-width: 900px) {
          footer > div:first-child { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 600px) {
          footer > div:first-child { grid-template-columns: 1fr !important; }
          footer > div[style*="padding: '16px 40px'"] { flex-direction: column; text-align: center; }
        }
      `}</style>
    </footer>
  );
}
