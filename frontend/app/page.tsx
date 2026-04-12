'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import PropertyCard from '../components/PropertyCard';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://done-space-backend-production.up.railway.app/api/v1';

const SEARCH_TABS = ['Buy', 'Rent', 'Sell'] as const;

const SERVICES = [
  { title: 'Buy Property', body: 'Verified listings across all provinces. From Kabulonga stands to Copperbelt apartments. Every listing confirmed before going live.', href: '/buy' },
  { title: 'Expert Valuation & Marketing', body: 'We match you with serious, pre-qualified buyers and handle everything to transfer. Maximum price, minimum hassle.', href: '/sell' },
  { title: 'Let Your Property', body: 'Quality tenant screening, lease management, and monthly rent collection. Peace of mind for landlords across Zambia.', href: '/landlords' },
  { title: 'Find Rental Accommodation', body: 'Genuine rentals. No hidden fees. Lusaka to Livingstone. Browse verified listings and move in with confidence.', href: '/let' },
  { title: 'Property Development', body: 'From stand development to full commercial builds. Backed by market data and a network of trusted contractors.', href: '/contact' },
  { title: 'Property Maintenance', body: 'Preventive care and responsive repairs for property owners. Fast contractor dispatch, transparent pricing.', href: '/maintenance' },
];

const JOURNEYS = [
  { title: 'I Want to Buy', body: "Looking for a 3-bedroom in Woodlands, a stand in Ibex Hill, or a commercial space in town? We have Zambia's most verified listings.", cta: 'Start Searching →', href: '/buy' },
  { title: 'I Want to Sell', body: 'Get a proper market valuation and access to genuine buyers. No time-wasters. We handle everything from listing to title transfer.', cta: 'Get a Valuation →', href: '/sell' },
  { title: "I'm a Landlord", body: "Tired of chasing rent? We screen tenants properly, collect monthly, and handle maintenance so you don't have to.", cta: 'Let Your Property →', href: '/landlords' },
  { title: 'I Need to Rent', body: 'Find genuine, well-maintained rentals in the areas you want. Transparent pricing. Move-in ready. No surprises.', cta: 'Find Accommodation →', href: '/tenants' },
];

const STATS = [
  { value: '500+', label: 'Properties Listed' },
  { value: '1,200+', label: 'Satisfied Clients' },
  { value: '10+', label: 'Years in Market' },
  { value: '9', label: 'Provinces Covered' },
];

const WHY_POINTS = [
  'All listings verified before going live',
  'Licensed and registered in Zambia',
  'Dedicated agent for every transaction',
  'Nationwide coverage across all 10 provinces',
  'Transparent fees — no hidden charges',
];

export default function HomePage() {
  const [featured, setFeatured] = useState<any[]>([]);
  const [searchTab, setSearchTab] = useState<'Buy' | 'Rent' | 'Sell'>('Buy');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch(`${API}/properties?limit=6&status=published`)
      .then(r => r.json())
      .then(data => {
        const list = Array.isArray(data) ? data : (data.data || data.properties || []);
        setFeatured(list.slice(0, 6));
      })
      .catch(() => {});
  }, []);

  const searchHref = `/properties?type=${searchTab === 'Rent' ? 'let' : searchTab.toLowerCase()}${searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ''}`;

  return (
    <main style={{ background: 'var(--cream, #F8F3ED)' }}>

      {/* ─── HERO ─── */}
      <section style={{
        position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center',
        paddingTop: 70, overflow: 'hidden',
        background: 'linear-gradient(150deg, #3A0510 0%, #5C0A1A 45%, #4A0814 100%)',
      }}>
        {/* Dot grid texture */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.04) 1px, transparent 0)', backgroundSize: '28px 28px', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '80px 24px 100px', position: 'relative', width: '100%' }}>
          {/* Label pill */}
          <div style={{ display: 'inline-block', border: '1px solid rgba(196,153,42,0.5)', color: 'var(--gold-light, #E8B84B)', padding: '6px 16px', borderRadius: 2, fontSize: 11, letterSpacing: '0.15em', fontFamily: 'Outfit, sans-serif', fontWeight: 500, marginBottom: 28, textTransform: 'uppercase' }}>
            Lusaka · Copperbelt · Zambia
          </div>

          {/* H1 */}
          <h1 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', lineHeight: 1.08, marginBottom: 24, maxWidth: 700 }}>
            <span style={{ display: 'block', fontSize: 'clamp(42px, 7vw, 80px)', fontWeight: 300, fontStyle: 'italic', color: 'white' }}>Your Property.</span>
            <span style={{ display: 'block', fontSize: 'clamp(42px, 7vw, 80px)', fontWeight: 300, fontStyle: 'italic', color: 'white' }}>Our Expertise.</span>
            <span style={{ display: 'block', fontSize: 'clamp(42px, 7vw, 80px)', fontWeight: 700, fontStyle: 'normal', color: 'var(--gold-light, #E8B84B)' }}>Done Right.</span>
          </h1>

          {/* Subtext */}
          <p style={{ color: 'rgba(255,255,255,0.8)', fontFamily: 'Outfit, sans-serif', fontSize: 18, maxWidth: 520, lineHeight: 1.7, marginBottom: 40 }}>
            From Kabulonga to Kitwe — Zambia's most trusted platform for buying, selling, letting and developing property.
          </p>

          {/* Search bar */}
          <div style={{ background: 'white', borderRadius: 4, overflow: 'hidden', maxWidth: 620, boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
            {/* Tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid #E8DDD6' }}>
              {SEARCH_TABS.map(tab => (
                <button key={tab} onClick={() => setSearchTab(tab)} style={{
                  flex: 1, padding: '13px 8px',
                  background: searchTab === tab ? 'var(--brand-ultra-light, #FBF5F6)' : 'transparent',
                  border: 'none',
                  borderBottom: searchTab === tab ? '2px solid var(--brand, #7B1D2A)' : '2px solid transparent',
                  color: searchTab === tab ? 'var(--brand, #7B1D2A)' : '#8C7B72',
                  fontSize: 13, fontWeight: searchTab === tab ? 600 : 400,
                  cursor: 'pointer', fontFamily: 'Outfit, sans-serif',
                  letterSpacing: '0.04em', transition: 'all 0.15s',
                }}>
                  {tab}
                </button>
              ))}
            </div>
            {/* Input row */}
            <div style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', gap: 12 }}>
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (window.location.href = searchHref)}
                placeholder="Search by area, e.g. Kabulonga, Woodlands, Ibex Hill..."
                style={{ flex: 1, border: 'none', outline: 'none', fontSize: 14, fontFamily: 'Outfit, sans-serif', color: '#0F0A08', background: 'transparent' }}
              />
              <Link href={searchHref} style={{ background: 'var(--gold, #C4992A)', color: 'var(--ink, #0F0A08)', padding: '9px 20px', borderRadius: 2, fontSize: 13.5, fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap', letterSpacing: '0.03em' }}>
                Search
              </Link>
            </div>
          </div>

          {/* Area chips */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 20 }}>
            {['Lusaka', 'Copperbelt', 'Livingstone', 'Kitwe'].map((city, i) => (
              <Link key={i} href={`/properties?location=${city}`}
                style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: 13, padding: '5px 13px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 2, fontFamily: 'Outfit, sans-serif', transition: 'all 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.14)'; e.currentTarget.style.color = 'white'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}
              >
                {city}
              </Link>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.35)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'Outfit, sans-serif' }}>
          <span>Scroll</span>
          <div style={{ animation: 'heroBounce 2s ease-in-out infinite' }}>↓</div>
        </div>
      </section>

      {/* ─── STATS ─── */}
      <section style={{ background: '#FFFFFF', padding: '40px 24px', borderBottom: '1px solid var(--border, #E8DDD6)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
          {STATS.map((s, i) => (
            <div key={i} style={{
              textAlign: 'center', padding: '20px',
              borderRight: i < 3 ? '1px solid var(--gold, #C4992A)' : 'none',
            }}>
              <div style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(36px, 4vw, 52px)', fontWeight: 700, color: 'var(--brand, #7B1D2A)', lineHeight: 1 }}>
                {s.value}
              </div>
              <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted, #8C7B72)', marginTop: 8 }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── SERVICES ─── */}
      <section style={{ background: '#F8F3ED', padding: '96px 24px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ marginBottom: 56 }}>
            <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gold, #C4992A)', display: 'block', marginBottom: 12 }}>
              Our Services
            </span>
            <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 600, color: 'var(--ink, #0F0A08)', lineHeight: 1.15 }}>
              Everything Property.<br /><span style={{ color: 'var(--ink-muted, #8C7B72)', fontWeight: 300 }}>Under One Roof.</span>
            </h2>
            <p style={{ color: 'var(--ink-muted, #8C7B72)', fontSize: 16, marginTop: 14, maxWidth: 480, fontFamily: 'Outfit, sans-serif', lineHeight: 1.65 }}>
              From your first home to your next investment — we cover all of Zambia.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {SERVICES.map((s, i) => (
              <Link key={i} href={s.href} style={{ textDecoration: 'none' }}>
                <div style={{
                  background: 'white', border: '1px solid var(--border, #E8DDD6)',
                  borderRadius: 0, padding: '36px 28px', transition: 'all 0.25s ease', cursor: 'pointer', height: '100%',
                }}
                  onMouseEnter={e => { const d = e.currentTarget as HTMLDivElement; d.style.borderColor = 'var(--brand, #7B1D2A)'; d.style.transform = 'translateY(-3px)'; d.style.boxShadow = '0 12px 40px rgba(15,10,8,0.1)'; }}
                  onMouseLeave={e => { const d = e.currentTarget as HTMLDivElement; d.style.borderColor = 'var(--border, #E8DDD6)'; d.style.transform = 'translateY(0)'; d.style.boxShadow = 'none'; }}
                >
                  {/* Geometric icon */}
                  <div style={{ width: 40, height: 40, marginBottom: 20 }}>
                    <div style={{ width: 24, height: 24, background: 'var(--brand, #7B1D2A)', borderRadius: 0, opacity: 0.8 }} />
                    <div style={{ width: 14, height: 14, background: 'var(--gold, #C4992A)', borderRadius: 0, marginTop: -8, marginLeft: 12 }} />
                  </div>
                  <h3 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 22, fontWeight: 600, color: 'var(--ink, #0F0A08)', marginBottom: 12, lineHeight: 1.2 }}>
                    {s.title}
                  </h3>
                  <p style={{ color: 'var(--ink-muted, #8C7B72)', fontSize: 14, lineHeight: 1.7, fontFamily: 'Outfit, sans-serif', marginBottom: 20 }}>
                    {s.body}
                  </p>
                  <span style={{ color: 'var(--brand, #7B1D2A)', fontSize: 13.5, fontWeight: 600, fontFamily: 'Outfit, sans-serif', letterSpacing: '0.02em' }}>
                    Learn more →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURED PROPERTIES ─── */}
      <section style={{ background: '#FAF7F4', padding: '96px 24px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 48, flexWrap: 'wrap', gap: 16 }}>
            <div>
              <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gold, #C4992A)', display: 'block', marginBottom: 10 }}>
                Properties
              </span>
              <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(30px, 4vw, 44px)', fontWeight: 600, color: 'var(--ink, #0F0A08)' }}>
                Featured Listings
              </h2>
            </div>
            <Link href="/properties" style={{ color: 'var(--brand, #7B1D2A)', fontFamily: 'Outfit, sans-serif', fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
              View All Properties →
            </Link>
          </div>

          {featured.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
              {featured.map(p => <PropertyCard key={p.id} property={p} />)}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--ink-faint, #C4B8B0)' }}>
              <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: 15 }}>Loading listings...</p>
            </div>
          )}
        </div>
      </section>

      {/* ─── WHY DONE & SPACE ─── */}
      <section style={{ background: '#FFFFFF', padding: '96px 24px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 72, alignItems: 'center' }}>
          <div>
            <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gold, #C4992A)', display: 'block', marginBottom: 16 }}>
              Why Choose Us
            </span>
            <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(32px, 4vw, 50px)', fontWeight: 600, color: 'var(--ink, #0F0A08)', lineHeight: 1.15, marginBottom: 24 }}>
              Built on Trust.<br />Backed by Results.
            </h2>
            <p style={{ color: 'var(--ink-secondary, #4A3830)', fontFamily: 'Outfit, sans-serif', fontSize: 15, lineHeight: 1.8, marginBottom: 18 }}>
              Done & Space Properties was founded with one mission — to make property transactions in Zambia simple, transparent and fair. Whether you are a first-time buyer in Northmead or an investor developing in the Copperbelt, we bring the same discipline to every deal.
            </p>
            <p style={{ color: 'var(--ink-muted, #8C7B72)', fontFamily: 'Outfit, sans-serif', fontSize: 15, lineHeight: 1.8, marginBottom: 36 }}>
              We verify every listing. We screen every inquiry. We track every deal from first contact to final transfer. Nothing falls through the cracks.
            </p>
            <Link href="/contact" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--brand, #7B1D2A)', color: 'white', padding: '14px 28px', fontSize: 14, fontWeight: 600, letterSpacing: '0.04em', fontFamily: 'Outfit, sans-serif', textDecoration: 'none', borderRadius: 2 }}>
              Contact Our Team
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {WHY_POINTS.map((point, i) => (
              <div key={i} style={{ borderLeft: '3px solid var(--gold, #C4992A)', paddingLeft: 20 }}>
                <p style={{ color: 'var(--ink, #0F0A08)', fontFamily: 'Outfit, sans-serif', fontSize: 15, fontWeight: 500, lineHeight: 1.5 }}>
                  {point}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── BUYERS GUIDE PREVIEW ─── */}
      <section style={{ background: '#5C0A1A', padding: '80px 24px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr auto', gap: 40, alignItems: 'center' }}>
          <div>
            <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(26px, 4vw, 42px)', fontWeight: 400, fontStyle: 'italic', color: 'white', marginBottom: 12, lineHeight: 1.15 }}>
              The Done &amp; Space Guide to Buying Property in Zambia
            </h2>
            <p style={{ color: 'var(--gold-light, #E8B84B)', fontFamily: 'Outfit, sans-serif', fontSize: 15, lineHeight: 1.65 }}>
              Everything you need to know before signing anything — from title searches to transfer taxes.
            </p>
          </div>
          <Link href="/buyers-guide" style={{ background: 'var(--gold, #C4992A)', color: 'var(--ink, #0F0A08)', padding: '14px 28px', fontFamily: 'Outfit, sans-serif', fontSize: 14, fontWeight: 700, textDecoration: 'none', borderRadius: 2, whiteSpace: 'nowrap', letterSpacing: '0.02em' }}>
            Download the Guide →
          </Link>
        </div>
      </section>

      {/* ─── CTA BAND ─── */}
      <section style={{ background: '#C4992A', padding: '64px 24px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr auto', gap: 32, alignItems: 'center' }}>
          <div>
            <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, color: 'var(--ink-deep, #1A0F0D)', marginBottom: 8 }}>
              Ready to Get Started?
            </h2>
            <p style={{ color: 'rgba(15,10,8,0.65)', fontFamily: 'Outfit, sans-serif', fontSize: 15 }}>
              Talk to a real person. No bots. No delays.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <a href="https://wa.me/260971000000" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--ink-deep, #1A0F0D)', color: 'white', padding: '13px 24px', fontFamily: 'Outfit, sans-serif', fontSize: 14, fontWeight: 600, textDecoration: 'none', borderRadius: 2, letterSpacing: '0.02em' }}>
              WhatsApp Us Now
            </a>
            <Link href="/properties" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'transparent', color: 'var(--ink-deep, #1A0F0D)', padding: '13px 24px', fontFamily: 'Outfit, sans-serif', fontSize: 14, fontWeight: 600, textDecoration: 'none', borderRadius: 2, border: '2px solid var(--ink-deep, #1A0F0D)', letterSpacing: '0.02em' }}>
              Browse Properties
            </Link>
          </div>
        </div>
      </section>

      {/* ─── WHO ARE YOU ─── */}
      <section style={{ background: '#3A0510', padding: '96px 24px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ marginBottom: 56, maxWidth: 600 }}>
            <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 400, fontStyle: 'italic', color: 'white', lineHeight: 1.1, marginBottom: 16 }}>
              Who Are You?
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'Outfit, sans-serif', fontSize: 16, lineHeight: 1.65 }}>
              We have a dedicated path for every client in Zambia.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {JOURNEYS.map((j, i) => (
              <div key={i}
                style={{ border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.05)', padding: '44px 32px', borderRadius: 0, transition: 'all 0.25s ease', cursor: 'pointer', display: 'flex', flexDirection: 'column' }}
                onMouseEnter={e => { const d = e.currentTarget as HTMLDivElement; d.style.background = 'rgba(255,255,255,0.1)'; d.style.borderColor = 'rgba(196,153,42,0.4)'; }}
                onMouseLeave={e => { const d = e.currentTarget as HTMLDivElement; d.style.background = 'rgba(255,255,255,0.05)'; d.style.borderColor = 'rgba(255,255,255,0.12)'; }}
              >
                <div style={{ width: 40, height: 3, background: 'var(--gold, #C4992A)', marginBottom: 24 }} />
                <h3 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 30, fontWeight: 600, color: 'white', marginBottom: 16, lineHeight: 1.15 }}>
                  {j.title}
                </h3>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontFamily: 'Outfit, sans-serif', fontSize: 14.5, lineHeight: 1.7, flex: 1, marginBottom: 28 }}>
                  {j.body}
                </p>
                <Link href={j.href} style={{ color: 'var(--gold-light, #E8B84B)', fontFamily: 'Outfit, sans-serif', fontSize: 13.5, fontWeight: 600, textDecoration: 'none', letterSpacing: '0.02em' }}>
                  {j.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 900px) {
          section > div > div[style*="repeat(3"] { grid-template-columns: repeat(2, 1fr) !important; }
          section > div > div[style*="repeat(4"] { grid-template-columns: repeat(2, 1fr) !important; }
          section > div[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; }
          section > div[style*="grid-template-columns: 1fr auto"] { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 600px) {
          section > div > div[style*="repeat("] { grid-template-columns: 1fr !important; }
          section > div[style*="repeat(4, 1fr)"] { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </main>
  );
}
