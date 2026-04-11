import Link from 'next/link';
import { LogoHorizontal } from './Logo';
import { Phone, Mail, MapPin, Globe, Share2 } from 'lucide-react';

const col = (title: string, links: { label: string; href: string }[]) => ({ title, links });

const COLUMNS = [
  col('Services', [
    { label: 'Buy Property', href: '/buy' },
    { label: 'Rent a Home', href: '/let' },
    { label: 'Sell Property', href: '/sell' },
    { label: 'For Landlords', href: '/landlords' },
    { label: 'For Tenants', href: '/tenants' },
    { label: 'For Agents', href: '/agents' },
  ]),
  col('Company', [
    { label: 'All Properties', href: '/properties' },
    { label: 'Careers', href: '/careers' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'Maintenance', href: '/maintenance' },
  ]),
  col('Legal', [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'Cookie Policy', href: '#' },
  ]),
];

export default function Footer() {
  return (
    <footer style={{ background: '#080508', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '64px 24px 0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 48, marginBottom: 56 }}>
          {/* Brand column */}
          <div>
            <LogoHorizontal variant="light" size="md" />
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13.5, lineHeight: 1.7, marginTop: 18, maxWidth: 280 }}>
              Zambia's trusted real estate partner. We connect buyers, sellers, landlords and tenants with exceptional properties across all provinces.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginTop: 22 }}>
              <a href="tel:+260971000000" style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontSize: 13 }}>
                <Phone size={13} style={{ color: '#8B1A2F', flexShrink: 0 }} /> +260 971 000 000
              </a>
              <a href="mailto:info@doneandspace.com" style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontSize: 13 }}>
                <Mail size={13} style={{ color: '#8B1A2F', flexShrink: 0 }} /> info@doneandspace.com
              </a>
              <span style={{ display: 'flex', alignItems: 'flex-start', gap: 8, color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>
                <MapPin size={13} style={{ color: '#8B1A2F', flexShrink: 0, marginTop: 1 }} /> Cairo Road, Lusaka, Zambia
              </span>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 20, flexWrap: 'wrap' }}>
              {['Facebook', 'Instagram', 'LinkedIn'].map((name, i) => (
                <a key={i} href="#" style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 11px', borderRadius: 8, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.45)', fontSize: 12, textDecoration: 'none', transition: 'all 0.15s', fontFamily: 'Outfit, sans-serif' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(139,26,47,0.2)'; e.currentTarget.style.color = '#c0374f'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(255,255,255,0.45)'; }}>
                  <Share2 size={11} /> {name}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {COLUMNS.map(col => (
            <div key={col.title}>
              <h4 style={{ color: 'rgba(255,255,255,0.9)', fontSize: 12.5, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 18 }}>{col.title}</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
                {col.links.map(link => (
                  <Link key={link.href} href={link.href} style={{ color: 'rgba(255,255,255,0.42)', textDecoration: 'none', fontSize: 13.5, fontFamily: 'Outfit, sans-serif', transition: 'color 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.85)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.42)'}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
          <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 12.5 }}>© {new Date().getFullYear()} Done & Space Properties Ltd. All rights reserved.</p>
          <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 12 }}>Licensed Real Estate Agency · Zambia</p>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          footer > div > div:first-child { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}
