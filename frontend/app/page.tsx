'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import PropertyCard from '../components/PropertyCard';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://done-space-backend-production.up.railway.app/api/v1';

const STATS = [
  { value: '850+',  label: 'Active Listings' },
  { value: '2,400+', label: 'Deals Completed' },
  { value: '120+',  label: 'Agents Nationwide' },
  { value: '18',    label: 'Provinces Covered' },
];

const SERVICES = [
  { title: 'Buy Property',            body: 'Verified listings across all provinces. Every listing is confirmed before it goes live. From Kabulonga stands to Copperbelt apartments, each property is reviewed by our compliance team.', href: '/buy' },
  { title: 'Sell Your Property',      body: 'We match you with serious, pre-qualified buyers and handle everything from listing to title transfer. Our team manages the process so you receive the best outcome at each stage.', href: '/sell' },
  { title: 'Let Your Property',       body: 'Quality tenant screening, lease management, and monthly rent collection. Landlords across Zambia rely on our team to handle tenancy so they do not have to.', href: '/landlords' },
  { title: 'Find a Rental',           body: 'Genuine rentals with no hidden fees, from Lusaka to Livingstone. Browse verified listings and move into a property that has been checked and approved before publication.', href: '/let' },
  { title: 'Property Development',    body: 'From stand development to full commercial builds, backed by market data and a network of trusted contractors. We manage the process from concept through to handover.', href: '/development' },
  { title: 'Property Maintenance',    body: 'Preventive care and responsive repairs with fast contractor dispatch, transparent pricing, and complete digital records maintained throughout every job.', href: '/maintenance' },
];

const JOURNEYS = [
  { title: 'For Buyers',    body: "We list verified properties across all areas of Zambia. Every listing is reviewed before it reaches you, from Kabulonga stands to Copperbelt apartments.", cta: 'Start Searching', href: '/buy' },
  { title: 'For Sellers',   body: 'Receive a proper market valuation and connect with qualified buyers. Our team manages the process from listing through to title transfer.', cta: 'Get a Valuation', href: '/sell' },
  { title: 'For Landlords', body: "We screen tenants carefully, collect rent monthly, and handle maintenance issues so you receive income without the operational burden.", cta: 'Let Your Property', href: '/landlords' },
  { title: 'For Tenants',   body: 'Find well-maintained rentals in the areas you prefer. All listings are verified before publication. Pricing is clear and agreed in writing from the start.', cta: 'Find Accommodation', href: '/tenants' },
];

const PLATFORM = [
  { n: '01', title: 'Front Office',         body: 'Property search, verified listings, and inquiry capture. Every public-facing interaction is structured and routed into our operations team.' },
  { n: '02', title: 'Lead Engine',          body: 'Every inquiry captured the moment it arrives. Qualified, categorised, and assigned automatically. No lead exists outside our system.' },
  { n: '03', title: 'CRM Pipeline',         body: 'Full lifecycle tracking from first contact to closing. Viewing scheduling, offer management, and interaction history in one place.' },
  { n: '04', title: 'Deal Engine',          body: 'Every transaction tracked end to end. Stage progression, document control, commission calculation, and closure records.' },
  { n: '05', title: 'Compliance',           body: 'Mandate control, ownership verification, audit trails, and approval workflows. Every listing is cleared before it goes live.' },
  { n: '06', title: 'Fraud Detection',      body: 'Duplicate listing detection, price anomaly alerts, identity verification, and communication logging protect every deal on the platform.' },
  { n: '07', title: 'Agent Network',        body: 'Controlled onboarding, territory allocation, performance tracking, and commission management. Growth without disorder.' },
  { n: '08', title: 'Analytics and Reporting', body: 'Lead conversion rates, agent performance, revenue tracking, and daily pipeline reports. Data that drives real decisions.' },
];

const ZAMBIA_WHY = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><path d="M12 6v12"/><path d="M9 9h4.5a2.5 2.5 0 0 1 0 5H9"/><path d="M9 15h5"/>
      </svg>
    ),
    title: 'Built for Cash Buyers',
    body: 'Most property transactions in Zambia are self-financed. Our platform is built around that reality. Listings include payment flexibility indicators and seller terms so buyers can assess each property on its actual conditions, not a mortgage assumption.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
      </svg>
    ),
    title: 'Title and Ownership Confirmed',
    body: 'Title deed status, leasehold classification, and encumbrance checks are completed before any listing reaches our platform. In a market where documentation remains a primary risk, this is not a feature. It is our minimum standard.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      </svg>
    ),
    title: 'Utilities Are Part of the Story',
    body: 'Borehole access, solar installation, backup power, and grid reliability are captured as first-class listing details. With ongoing energy pressures across Zambia, these factors directly affect a property\'s value and your daily quality of life.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
    title: 'Fast, Local Response',
    body: 'Every inquiry reaches a local agent who knows the area, understands market conditions, and responds the same day. Done and Space operates on WhatsApp because that is how business moves in Zambia.',
  },
];

const PROP_TYPES = ['Any Type', 'House', 'Apartment', 'Office', 'Commercial', 'Land'];
const PRICE_RANGES = ['Any Price', 'Up to ZMW 500K', 'ZMW 500K–2M', 'ZMW 2M–5M', 'ZMW 5M–10M', 'ZMW 10M+'];

export default function HomePage() {
  const router = useRouter();
  const [featured, setFeatured] = useState<any[]>([]);
  const [listingType, setListingType] = useState<'sale' | 'let'>('sale');
  const [location, setLocation] = useState('');
  const [propType, setPropType] = useState('Any Type');
  const [priceRange, setPriceRange] = useState('Any Price');

  useEffect(() => {
    fetch(`${API}/properties?limit=6&status=published`)
      .then(r => r.json())
      .then(data => {
        const list = Array.isArray(data) ? data : (data.data || data.properties || []);
        setFeatured(list.slice(0, 6));
      })
      .catch(() => {});
  }, []);

  const doSearch = () => {
    const params = new URLSearchParams();
    params.set('listing_type', listingType);
    if (location.trim()) params.set('q', location.trim());
    if (propType !== 'Any Type') params.set('property_type', propType.toLowerCase());
    router.push(`/properties?${params.toString()}`);
  };

  const inpStyle: React.CSSProperties = {
    width: '100%', border: '1.5px solid var(--border, #E0D9CE)', borderRadius: 4,
    padding: '10px 14px', fontSize: 14, outline: 'none',
    fontFamily: "'Outfit', system-ui, sans-serif", color: 'var(--ink, #1A1A1A)',
    background: 'white', boxSizing: 'border-box',
  };
  const lblStyle: React.CSSProperties = {
    display: 'block', fontSize: 11, fontWeight: 600, letterSpacing: '0.08em',
    textTransform: 'uppercase', color: 'var(--ink-muted, #6B6B6B)', marginBottom: 5,
    fontFamily: "'Outfit', system-ui, sans-serif",
  };

  return (
    <main style={{ background: 'var(--cream, #F5F0E8)' }}>

      {/* ─── HERO ─── */}
      <section style={{
        position: 'relative', minHeight: '92vh', display: 'flex', alignItems: 'center',
        paddingTop: 72, overflow: 'hidden',
      }}>
        {/* Background photo — replace with licensed image before go-live */}
        <Image
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=80&auto=format&fit=crop"
          alt=""
          fill
          priority
          style={{ objectFit: 'cover', objectPosition: 'center' }}
        />
        {/* Directional overlay: dark left → light right */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to right, rgba(0,0,0,0.58) 0%, rgba(0,0,0,0.35) 50%, rgba(0,0,0,0.15) 100%)',
          pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '80px 40px 100px', position: 'relative', width: '100%' }}>
          {/* Heading */}
          <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", lineHeight: 1.05, marginBottom: 24, maxWidth: 760 }}>
            <span style={{ display: 'block', fontSize: 'clamp(44px, 7vw, 82px)', fontWeight: 900, color: 'white' }}>Your Space.</span>
            <span style={{ display: 'block', fontSize: 'clamp(44px, 7vw, 82px)', fontWeight: 900, color: 'white', fontStyle: 'italic' }}>Perfectly Done.</span>
          </h1>

          <p style={{ color: 'rgba(255,255,255,0.72)', fontFamily: "'Outfit', sans-serif", fontSize: 18, maxWidth: 520, lineHeight: 1.7, marginBottom: 40 }}>
            Done and Space connects buyers, sellers, landlords, and tenants across Zambia through a platform built on documentation, accountability, and results.
          </p>

          {/* Search bar */}
          <div style={{ background: 'rgba(255,255,255,0.97)', borderRadius: 4, padding: '24px', maxWidth: 820, boxShadow: '0 24px 64px rgba(0,0,0,0.40)' }}>
            {/* Sale/Let toggle */}
            <div style={{ display: 'flex', gap: 4, marginBottom: 18, background: 'var(--cream, #F5F0E8)', borderRadius: 4, padding: 4, width: 'fit-content' }}>
              {(['sale', 'let'] as const).map(t => (
                <button key={t} onClick={() => setListingType(t)} style={{
                  padding: '7px 20px', border: 'none', borderRadius: 3, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  fontFamily: "'Outfit', sans-serif", transition: 'all 0.15s',
                  background: listingType === t ? 'var(--brand, #7B1828)' : 'transparent',
                  color: listingType === t ? 'white' : 'var(--ink-muted, #6B6B6B)',
                }}>
                  {t === 'sale' ? 'For Sale' : 'To Let'}
                </button>
              ))}
            </div>
            {/* Fields */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'flex-end' }}>
              <div style={{ flex: '1 1 180px', minWidth: 160 }}>
                <label style={lblStyle}>Location</label>
                <input value={location} onChange={e => setLocation(e.target.value)} onKeyDown={e => e.key === 'Enter' && doSearch()} placeholder="Area, suburb or town" style={inpStyle} />
              </div>
              <div style={{ flex: '1 1 160px', minWidth: 140 }}>
                <label style={lblStyle}>Property Type</label>
                <select value={propType} onChange={e => setPropType(e.target.value)} style={{ ...inpStyle, cursor: 'pointer' }}>
                  {PROP_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div style={{ flex: '1 1 160px', minWidth: 140 }}>
                <label style={lblStyle}>Price Range</label>
                <select value={priceRange} onChange={e => setPriceRange(e.target.value)} style={{ ...inpStyle, cursor: 'pointer' }}>
                  {PRICE_RANGES.map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
              <button onClick={doSearch} style={{ padding: '12px 32px', background: 'var(--brand, #7B1828)', color: 'white', border: 'none', borderRadius: 4, fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: "'Outfit', sans-serif", whiteSpace: 'nowrap', flexShrink: 0, alignSelf: 'flex-end' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--brand-dark, #5C1220)'}
                onMouseLeave={e => e.currentTarget.style.background = 'var(--brand, #7B1828)'}
              >
                Search
              </button>
            </div>
          </div>

          {/* Journey pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 24 }}>
            {[['For Buyers', '/buy'], ['For Sellers', '/sell'], ['For Landlords', '/landlords'], ['For Tenants', '/tenants']].map(([label, href]) => (
              <Link key={label} href={href} style={{
                color: 'rgba(255,255,255,0.75)', fontSize: 12, padding: '8px 18px',
                background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.20)',
                borderRadius: 40, fontFamily: "'Outfit', sans-serif", textDecoration: 'none', transition: 'all 0.15s',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.18)'; e.currentTarget.style.color = 'white'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.10)'; e.currentTarget.style.color = 'rgba(255,255,255,0.75)'; }}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Scroll hint */}
          <div style={{ position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, color: 'rgba(255,255,255,0.3)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: "'Outfit', sans-serif" }}>
            <span>Scroll</span>
            <div style={{ animation: 'heroBounce 2s ease-in-out infinite' }}>↓</div>
          </div>
        </div>
      </section>

      {/* ─── STATS BAR ─── */}
      <section style={{ background: 'var(--brand, #7B1828)', padding: '28px 40px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', gap: 20 }}>
          {STATS.map((s, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 32, fontWeight: 700, color: 'white', lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 11, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.60)', marginTop: 6 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── FEATURED LISTINGS ─── */}
      <section style={{ background: 'white', padding: '100px 40px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 48, flexWrap: 'wrap', gap: 16 }}>
            <div>
              <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--brand, #7B1828)', display: 'block', marginBottom: 10 }}>
                Current Listings
              </span>
              <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(30px, 4vw, 46px)', fontWeight: 700, color: 'var(--ink, #1A1A1A)', marginBottom: 8 }}>
                Properties Available Now
              </h2>
              <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 15, color: 'var(--ink-muted, #6B6B6B)', maxWidth: 480, lineHeight: 1.65 }}>
                Each property on our platform has been reviewed by our team before publication. Ownership is confirmed, documentation is checked, and pricing is verified against current market conditions.
              </p>
            </div>
            <Link href="/properties" style={{ color: 'var(--brand, #7B1828)', fontFamily: "'Outfit', sans-serif", fontSize: 14, fontWeight: 600, textDecoration: 'none', border: '1.5px solid var(--brand, #7B1828)', padding: '10px 22px', borderRadius: 4, whiteSpace: 'nowrap', transition: 'all 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--brand, #7B1828)'; e.currentTarget.style.color = 'white'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--brand, #7B1828)'; }}
            >
              View All Properties →
            </Link>
          </div>

          {featured.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28 }}>
              {featured.map(p => <PropertyCard key={p.id} property={p} />)}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28 }}>
              {[1, 2, 3].map(i => (
                <div key={i} style={{ background: 'var(--cream, #F5F0E8)', borderRadius: 4, height: 340, animation: 'pulse 1.5s ease-in-out infinite' }} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ─── BUILT FOR ZAMBIA ─── */}
      <section style={{ background: 'var(--cream, #F5F0E8)', padding: '96px 40px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ marginBottom: 56, maxWidth: 640 }}>
            <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--brand, #7B1828)', display: 'block', marginBottom: 12 }}>
              Why Done &amp; Space
            </span>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(30px, 4vw, 44px)', fontWeight: 700, color: 'var(--ink, #1A1A1A)', lineHeight: 1.15, marginBottom: 16 }}>
              Built for How Zambia Buys
            </h2>
            <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 15, color: 'var(--ink-muted, #6B6B6B)', lineHeight: 1.7 }}>
              We built this platform around how real estate actually works here, not how it works in London or Johannesburg.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
            {ZAMBIA_WHY.map((tile, i) => (
              <div key={i} style={{ background: 'white', border: '1px solid var(--border, #E0D9CE)', padding: '32px 24px', borderRadius: 4 }}>
                <div style={{ color: 'var(--brand, #7B1828)', marginBottom: 16 }}>{tile.icon}</div>
                <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 18, fontWeight: 600, color: 'var(--ink, #1A1A1A)', marginBottom: 10 }}>{tile.title}</h3>
                <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13.5, color: 'var(--ink-muted, #6B6B6B)', lineHeight: 1.7 }}>{tile.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SERVICES ─── */}
      <section style={{ background: 'white', padding: '96px 40px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ marginBottom: 56 }}>
            <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--brand, #7B1828)', display: 'block', marginBottom: 12 }}>
              Our Services
            </span>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 700, color: 'var(--ink, #1A1A1A)', lineHeight: 1.15 }}>
              Full Service.<br /><span style={{ color: 'var(--ink-muted, #6B6B6B)', fontWeight: 400 }}>Across Every Stage.</span>
            </h2>
            <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 15, color: 'var(--ink-muted, #6B6B6B)', maxWidth: 520, lineHeight: 1.7, marginTop: 16 }}>
              From the first enquiry to the final transfer, Done and Space manages every step of the property journey with structure, accountability, and clear communication throughout.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {SERVICES.map((s, i) => (
              <Link key={i} href={s.href} style={{ textDecoration: 'none', display: 'block' }}>
                <div style={{ background: 'white', border: '1px solid var(--border, #E0D9CE)', padding: '36px 28px', transition: 'all 0.25s', cursor: 'pointer', height: '100%' }}
                  onMouseEnter={e => { const d = e.currentTarget as HTMLDivElement; d.style.borderColor = 'var(--brand, #7B1828)'; d.style.transform = 'translateY(-3px)'; d.style.boxShadow = '0 12px 40px rgba(123,24,40,0.10)'; }}
                  onMouseLeave={e => { const d = e.currentTarget as HTMLDivElement; d.style.borderColor = 'var(--border, #E0D9CE)'; d.style.transform = 'translateY(0)'; d.style.boxShadow = 'none'; }}
                >
                  <div style={{ width: 36, height: 5, background: 'var(--brand, #7B1828)', marginBottom: 20 }} />
                  <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 20, fontWeight: 600, color: 'var(--ink, #1A1A1A)', marginBottom: 12 }}>{s.title}</h3>
                  <p style={{ color: 'var(--ink-muted, #6B6B6B)', fontSize: 14, lineHeight: 1.7, fontFamily: "'Outfit', sans-serif", marginBottom: 20 }}>{s.body}</p>
                  <span style={{ color: 'var(--brand, #7B1828)', fontSize: 13.5, fontWeight: 600, fontFamily: "'Outfit', sans-serif" }}>Learn more →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── THE PLATFORM — 8 Systems ─── */}
      <section style={{ background: 'white', padding: '100px 40px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--brand, #7B1828)', display: 'block', marginBottom: 16 }}>
            How It Works
          </span>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(36px, 5vw, 52px)', fontWeight: 700, color: 'var(--ink, #1A1A1A)', lineHeight: 1.1, marginBottom: 20, maxWidth: 720 }}>
            Eight Systems. One Platform.
          </h2>
          <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 17, color: 'var(--ink-muted, #6B6B6B)', maxWidth: 560, lineHeight: 1.7, marginBottom: 56 }}>
            Done and Space is a fully integrated real estate operating system, from first inquiry to title transfer.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {PLATFORM.map((card, i) => (
              <div key={i} style={{ background: 'var(--cream, #F5F0E8)', border: '1px solid var(--border, #E0D9CE)', padding: '24px', borderRadius: 4 }}>
                <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: 'var(--brand, #7B1828)', marginBottom: 12 }}>{card.n}</div>
                <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 17, fontWeight: 600, color: 'var(--ink, #1A1A1A)', marginBottom: 10 }}>{card.title}</h3>
                <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, color: 'var(--ink-muted, #6B6B6B)', lineHeight: 1.6 }}>{card.body}</p>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 24, background: 'var(--gold-pale, #FBF6EC)', border: '1px solid var(--gold, #C9A84C)', padding: '18px 24px', borderRadius: 4, textAlign: 'center' }}>
            <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, color: 'var(--ink-muted, #6B6B6B)' }}>
              We measure platform performance across strategic fit, functional completeness, CRM strength, control systems, compliance, and scalability. The minimum acceptable standard is 85 across all modules on every deal we handle.
            </p>
          </div>
        </div>
      </section>

      {/* ─── COMPLIANCE & TRUST ─── */}
      <section style={{ background: 'var(--ink, #1A1A1A)', padding: '96px 40px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0 }}>
            {([
              { title: 'Every Listing Reviewed', body: 'Before a property appears on this platform we confirm ownership documents, check for duplicate listings, and assess pricing against comparable transactions. Nothing reaches buyers unverified.', stat: 'No listing published without internal review.' },
              { title: 'No Inquiry Is Lost', body: 'Every message, form submission, and WhatsApp inquiry enters our CRM the moment it arrives with a timestamp, source, and category. It is assigned to a team member and tracked until there is a clear outcome.', stat: 'All inquiries assigned within the hour.' },
              { title: 'Agents Under Structure', body: 'Every Done and Space agent operates under defined territory allocation, performance tracking, and permissions. Commissionable agents have controlled platform access. Internal operations remain separate from public-facing participation.', stat: 'Defined permissions at every level.' },
            ] as { title: string; body: string; stat: string }[]).map((col, i) => (
              <div key={i} style={{ padding: '48px 40px', borderRight: i < 2 ? '1px solid rgba(255,255,255,0.08)' : 'none' }}>
                <div style={{ height: 4, width: '100%', background: 'var(--brand, #7B1828)', marginBottom: 28 }} />
                <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 22, fontWeight: 600, color: 'white', marginBottom: 16 }}>{col.title}</h3>
                <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 14, color: 'rgba(255,255,255,0.65)', lineHeight: 1.75, marginBottom: 28 }}>{col.body}</p>
                <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 20, fontWeight: 700, color: 'var(--gold, #C9A84C)' }}>{col.stat}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── WHO ARE YOU ─── */}
      <section style={{ background: 'var(--brand, #7B1828)', padding: '96px 40px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ marginBottom: 48, maxWidth: 600 }}>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 400, fontStyle: 'italic', color: 'white', lineHeight: 1.1, marginBottom: 16 }}>
              Who Are You?
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.65)', fontFamily: "'Outfit', sans-serif", fontSize: 16, lineHeight: 1.65 }}>
              We have a dedicated path for every client in Zambia.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {JOURNEYS.map((j, i) => (
              <div key={i}
                style={{ border: '1px solid rgba(255,255,255,0.18)', background: 'rgba(0,0,0,0.20)', padding: '36px 28px', transition: 'all 0.25s', cursor: 'pointer', display: 'flex', flexDirection: 'column', borderRadius: 4 }}
                onMouseEnter={e => { const d = e.currentTarget as HTMLDivElement; d.style.background = 'rgba(0,0,0,0.35)'; d.style.borderColor = 'rgba(201,168,76,0.50)'; }}
                onMouseLeave={e => { const d = e.currentTarget as HTMLDivElement; d.style.background = 'rgba(0,0,0,0.20)'; d.style.borderColor = 'rgba(255,255,255,0.18)'; }}
              >
                <div style={{ width: 32, height: 3, background: 'var(--gold, #C9A84C)', marginBottom: 20 }} />
                <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 24, fontWeight: 600, color: 'white', marginBottom: 14, lineHeight: 1.2 }}>{j.title}</h3>
                <p style={{ color: 'rgba(255,255,255,0.70)', fontFamily: "'Outfit', sans-serif", fontSize: 14, lineHeight: 1.7, flex: 1, marginBottom: 24 }}>{j.body}</p>
                <Link href={j.href} style={{ color: 'var(--gold, #C9A84C)', fontFamily: "'Outfit', sans-serif", fontSize: 13.5, fontWeight: 600, textDecoration: 'none' }}>{j.cta}</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── BUYERS GUIDE PREVIEW ─── */}
      <section style={{ background: 'var(--brand-dark, #5C1220)', padding: '80px 40px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr auto', gap: 40, alignItems: 'center' }}>
          <div>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 400, fontStyle: 'italic', color: 'white', marginBottom: 12, lineHeight: 1.15 }}>
              The Done and Space Guide to Buying Property in Zambia
            </h2>
            <p style={{ color: 'var(--gold, #C9A84C)', fontFamily: "'Outfit', sans-serif", fontSize: 15, lineHeight: 1.65 }}>
              Everything you need to know before signing anything, from title searches to transfer taxes.
            </p>
          </div>
          <Link href="/buyers-guide" style={{ background: 'var(--gold, #C9A84C)', color: 'var(--ink, #1A1A1A)', padding: '14px 28px', fontFamily: "'Outfit', sans-serif", fontSize: 14, fontWeight: 700, textDecoration: 'none', borderRadius: 4, whiteSpace: 'nowrap' }}>
            Read the Guide →
          </Link>
        </div>
      </section>

      {/* ─── CTA BAND ─── */}
      <section style={{ background: 'var(--gold, #C9A84C)', padding: '64px 40px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr auto', gap: 32, alignItems: 'center' }}>
          <div>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 700, color: 'var(--ink, #1A1A1A)', marginBottom: 8 }}>Ready to Begin?</h2>
            <p style={{ color: 'rgba(26,26,26,0.65)', fontFamily: "'Outfit', sans-serif", fontSize: 15 }}>Speak with a local agent. Real responses, same day.</p>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <a href="https://wa.me/260971000000" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--ink, #1A1A1A)', color: 'white', padding: '13px 24px', fontFamily: "'Outfit', sans-serif", fontSize: 14, fontWeight: 600, textDecoration: 'none', borderRadius: 4 }}>
              WhatsApp Us Now
            </a>
            <Link href="/properties" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'transparent', color: 'var(--ink, #1A1A1A)', padding: '13px 24px', fontFamily: "'Outfit', sans-serif", fontSize: 14, fontWeight: 600, textDecoration: 'none', borderRadius: 4, border: '2px solid var(--ink, #1A1A1A)' }}>
              Browse Properties
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        @media (max-width: 900px) {
          section > div > div[style*="repeat(3"] { grid-template-columns: repeat(2, 1fr) !important; }
          section > div > div[style*="repeat(4"] { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 600px) {
          section > div > div[style*="repeat("] { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 640px) {
          section[style*="padding: '80px 40px'"] > div { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  );
}
