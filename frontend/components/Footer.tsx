'use client';
import Link from 'next/link';
import { LogoHorizontal } from './Logo';

const COLS = [
  {
    title: 'Properties',
    links: [
      { label: 'Properties for Sale', href: '/properties?type=sale' },
      { label: 'Properties to Let', href: '/properties?type=let' },
      { label: 'New Listings', href: '/properties' },
      { label: 'Search by Area', href: '/properties' },
    ],
  },
  {
    title: 'Services',
    links: [
      { label: 'For Buyers', href: '/buy' },
      { label: 'For Sellers', href: '/sell' },
      { label: 'For Landlords', href: '/landlords' },
      { label: 'For Tenants', href: '/tenants' },
      { label: 'Property Maintenance', href: '/maintenance' },
      { label: 'Agent Network', href: '/agents' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Done & Space', href: '/contact' },
      { label: 'Careers', href: '/careers' },
      { label: "Buyer's Guide", href: '/buyers-guide' },
      { label: 'Contact Us', href: '/contact' },
      { label: 'Privacy Policy', href: '#' },
    ],
  },
];

export default function Footer() {
  return (
    <footer style={{ background: 'var(--ink-deep, #1A0F0D)', borderTop: '3px solid var(--gold, #C4992A)', fontFamily: 'Outfit, sans-serif' }}>
      {/* Top row: logo + phone */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '36px 24px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20, borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <LogoHorizontal variant="light" size="md" />
        <div style={{ textAlign: 'right' }}>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>Questions? Call us now</p>
          <a href="tel:+260971000000" style={{ color: 'var(--gold, #C4992A)', fontSize: 22, fontWeight: 700, textDecoration: 'none', letterSpacing: '-0.01em', display: 'block' }}>
            +260 971 000 000
          </a>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, marginTop: 3 }}>Mon–Fri 8am–5pm · Sat 9am–1pm</p>
        </div>
      </div>

      {/* Four columns */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '48px 24px 40px', display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1.2fr', gap: 40 }}>
        {COLS.map(col => (
          <div key={col.title}>
            <h4 style={{ color: 'rgba(255,255,255,0.85)', fontSize: 11.5, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 20, fontFamily: 'Outfit, sans-serif' }}>
              {col.title}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
              {col.links.map(link => (
                <Link key={link.label} href={link.href}
                  style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13.5, transition: 'color 0.15s', fontFamily: 'Outfit, sans-serif' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.85)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        ))}

        {/* Get in touch column */}
        <div>
          <h4 style={{ color: 'rgba(255,255,255,0.85)', fontSize: 11.5, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 20 }}>Get in Touch</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <a href="tel:+260971000000" style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--gold, #C4992A)', fontSize: 13.5, textDecoration: 'none', fontWeight: 500 }}>
              +260 971 000 000
            </a>
            <a href="mailto:info@doneandspace.com" style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,0.5)', fontSize: 13.5, textDecoration: 'none' }}
              onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.85)'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
            >
              info@doneandspace.com
            </a>
            <span style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,0.4)', fontSize: 13.5 }}>
              Lusaka, Zambia
            </span>
            <a
              href="https://wa.me/260971000000"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#25D366', color: 'white', padding: '9px 16px', borderRadius: 2, fontSize: 13, fontWeight: 600, textDecoration: 'none', marginTop: 8, width: 'fit-content' }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '18px 24px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12 }}>
          © {new Date().getFullYear()} Done &amp; Space Properties Limited. All rights reserved.
        </p>
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>
          Licensed Real Estate Agency · Zambia
        </p>
        <div style={{ display: 'flex', gap: 16 }}>
          {['Facebook', 'Instagram', 'LinkedIn'].map(name => (
            <a key={name} href="#" style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, textDecoration: 'none', transition: 'color 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.3)'}
            >
              {name}
            </a>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          footer > div:nth-child(2) { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 600px) {
          footer > div:nth-child(2) { grid-template-columns: 1fr !important; }
          footer > div:first-child { flex-direction: column; text-align: left; }
          footer > div:first-child > div { text-align: left; }
        }
      `}</style>
    </footer>
  );
}
