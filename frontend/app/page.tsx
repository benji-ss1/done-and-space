'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import PropertyCard from '../components/PropertyCard';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://done-space-backend-production.up.railway.app/api/v1';

/* ─── SCROLL REVEAL ─── */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.12 }
    );
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* ─── COUNTER ANIMATION ─── */
function useCounter(target: number, duration = 1800) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      let start: number | null = null;
      const step = (ts: number) => {
        if (!start) start = ts;
        const progress = Math.min((ts - start) / duration, 1);
        setCount(Math.floor(progress * target));
        if (progress < 1) requestAnimationFrame(step);
        else setCount(target);
      };
      requestAnimationFrame(step);
    }, { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
  }, [target, duration]);
  return { count, ref };
}

/* ─── STAT ITEM ─── */
function StatItem({ value, label }: { value: string; label: string }) {
  const numeric = parseInt(value.replace(/[^0-9]/g, ''), 10);
  const suffix  = value.replace(/[0-9,]/g, '');
  const { count, ref } = useCounter(numeric);
  return (
    <div style={{ textAlign: 'center', padding: '0 24px' }}>
      <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 56, fontWeight: 700, color: 'white', lineHeight: 1, marginBottom: 10 }}>
        <span ref={ref}>{count.toLocaleString()}</span>{suffix}
      </div>
      <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13, letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: "'Outfit', sans-serif", fontWeight: 500 }}>
        {label}
      </div>
    </div>
  );
}

/* ─── HERO SEARCH ─── */
function HeroSearch() {
  const router = useRouter();
  const [query, setQuery]   = useState('');
  const [type, setType]     = useState<'sale' | 'let'>('sale');

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    params.set('listing_type', type);
    router.push(`/properties?${params.toString()}`);
  };

  return (
    <div style={{ display: 'flex', gap: 0, background: 'white', borderRadius: 4, overflow: 'hidden', maxWidth: 640, width: '100%', boxShadow: '0 24px 64px rgba(0,0,0,0.35)' }}>
      {/* Type toggle */}
      <div style={{ display: 'flex', flexShrink: 0 }}>
        {(['sale', 'let'] as const).map(t => (
          <button key={t} onClick={() => setType(t)} style={{
            padding: '0 18px', height: 52, border: 'none', cursor: 'pointer',
            background: type === t ? 'var(--brand, #7B1828)' : 'var(--cream, #F5F0E8)',
            color: type === t ? 'white' : 'var(--ink-muted, #6B6B6B)',
            fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
            fontFamily: "'Outfit', sans-serif", transition: 'all 0.15s',
          }}>
            {t === 'sale' ? 'Buy' : 'Rent'}
          </button>
        ))}
      </div>
      {/* Input */}
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleSearch()}
        placeholder="Search area, property type, or reference..."
        style={{
          flex: 1, border: 'none', outline: 'none', padding: '0 16px',
          fontSize: 14, fontFamily: "'Outfit', sans-serif", color: 'var(--ink, #1A1A1A)',
          background: 'white',
        }}
      />
      <button onClick={handleSearch} style={{
        padding: '0 24px', height: 52, background: 'var(--ink, #1A1A1A)', color: 'white',
        border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
        fontFamily: "'Outfit', sans-serif", letterSpacing: '0.06em', textTransform: 'uppercase',
        transition: 'background 0.15s', flexShrink: 0,
      }}
        onMouseEnter={e => e.currentTarget.style.background = 'var(--brand, #7B1828)'}
        onMouseLeave={e => e.currentTarget.style.background = 'var(--ink, #1A1A1A)'}
      >
        Search
      </button>
    </div>
  );
}

/* ─── FEATURED PROPERTIES ─── */
function FeaturedGrid() {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    fetch(`${API}/properties?status=published&limit=4`)
      .then(r => r.json())
      .then(data => {
        const arr = Array.isArray(data) ? data : (data.data ?? data.properties ?? []);
        setProperties(arr.slice(0, 4));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '64px 0', color: 'rgba(255,255,255,0.35)', fontFamily: "'Outfit', sans-serif", fontSize: 14 }}>
      Loading listings...
    </div>
  );

  if (!properties.length) return (
    <div style={{ textAlign: 'center', padding: '64px 0', color: 'rgba(255,255,255,0.35)', fontFamily: "'Outfit', sans-serif", fontSize: 14 }}>
      No listings available.
    </div>
  );

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1 }}>
      {properties.map(p => (
        <div key={p.id} className="reveal">
          <PropertyCard property={p} />
        </div>
      ))}
    </div>
  );
}

/* ─── PAGE ─── */
export default function HomePage() {
  useReveal();

  return (
    <>
      {/* ════════ 1. HERO ════════ */}
      <section style={{ position: 'relative', height: '100vh', minHeight: 640, overflow: 'hidden' }}>
        {/* Background image */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: "url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1800&q=80')",
          backgroundSize: 'cover', backgroundPosition: 'center',
        }} />
        {/* Gradient overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, rgba(30,12,18,0.82) 0%, rgba(92,18,32,0.70) 50%, rgba(20,10,14,0.88) 100%)' }} />

        {/* Watermark */}
        <div style={{
          position: 'absolute', bottom: '-24px', left: '50%', transform: 'translateX(-50%)',
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: 'clamp(80px, 14vw, 200px)',
          fontWeight: 900, letterSpacing: '-0.04em',
          color: 'rgba(255,255,255,0.035)',
          whiteSpace: 'nowrap', pointerEvents: 'none', userSelect: 'none',
        }}>
          DONE &amp; SPACE
        </div>

        {/* Content */}
        <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', maxWidth: 1280, margin: '0 auto', padding: '0 40px' }}>
          <div style={{ maxWidth: 700 }}>
            <p className="reveal" style={{ color: 'var(--gold, #C9A84C)', fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 24, fontFamily: "'Outfit', sans-serif" }}>
              Zambia's Property Platform
            </p>
            <h1 className="reveal reveal-delay-1" style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 'clamp(40px, 6vw, 80px)',
              fontWeight: 700, lineHeight: 1.08, color: 'white',
              marginBottom: 28, letterSpacing: '-0.02em',
            }}>
              Property,<br />
              <em style={{ fontStyle: 'italic', color: 'rgba(255,255,255,0.70)' }}>done properly.</em>
            </h1>
            <p className="reveal reveal-delay-2" style={{ color: 'rgba(255,255,255,0.65)', fontSize: 16, lineHeight: 1.7, maxWidth: 520, marginBottom: 40, fontFamily: "'Outfit', sans-serif" }}>
              A licensed real estate platform built for Zambia. Every listing reviewed. Every transaction tracked. Every inquiry followed through.
            </p>
            <div className="reveal reveal-delay-3">
              <HeroSearch />
            </div>
          </div>

          {/* Scroll indicator */}
          <div style={{ position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 1, height: 48, background: 'linear-gradient(to bottom, rgba(255,255,255,0.35), transparent)' }} />
            <span style={{ color: 'rgba(255,255,255,0.30)', fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: "'Outfit', sans-serif" }}>Scroll</span>
          </div>
        </div>
      </section>

      {/* ════════ 2. FEATURE STATEMENTS ════════ */}
      <section style={{ background: 'var(--cream, #F5F0E8)', padding: '96px 40px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: 'var(--border, #E0D9CE)' }}>
            {[
              {
                n: '01',
                title: 'Every listing is verified.',
                body: 'Before any property appears on this platform, our compliance team confirms ownership, checks documentation, and approves the listing. No unverified property reaches you.',
              },
              {
                n: '02',
                title: 'Every inquiry is followed up.',
                body: 'When you submit an inquiry, it enters our CRM immediately. A qualified agent is assigned within the hour. You will receive a direct response, not an automated acknowledgement.',
              },
              {
                n: '03',
                title: 'Every transaction is tracked.',
                body: 'From the moment you express interest to the date of signing, every stage is documented. Offers, viewings, due diligence, title transfer. Nothing is lost to memory or email chains.',
              },
            ].map(item => (
              <div key={item.n} className="reveal" style={{ background: 'var(--cream, #F5F0E8)', padding: '56px 48px' }}>
                <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 10, fontWeight: 700, color: 'var(--brand, #7B1828)', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 28 }}>
                  {item.n}
                </div>
                <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 26, fontWeight: 700, color: 'var(--ink, #1A1A1A)', lineHeight: 1.25, marginBottom: 20 }}>
                  {item.title}
                </h3>
                <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 14.5, color: 'var(--ink-muted, #6B6B6B)', lineHeight: 1.75 }}>
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ 3. FEATURED PROPERTIES GALLERY ════════ */}
      <section style={{ background: 'var(--ink, #1A1A1A)', padding: '96px 0' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 40px', marginBottom: 48 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 10, fontWeight: 700, color: 'var(--gold, #C9A84C)', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 16 }}>
                Current Listings
              </p>
              <h2 className="reveal" style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 700, color: 'white', lineHeight: 1.1 }}>
                Featured Properties
              </h2>
            </div>
            <Link href="/properties" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              color: 'rgba(255,255,255,0.50)', textDecoration: 'none',
              fontSize: 13, fontFamily: "'Outfit', sans-serif", fontWeight: 500,
              letterSpacing: '0.06em', textTransform: 'uppercase',
              transition: 'color 0.15s',
            }}
              onMouseEnter={e => e.currentTarget.style.color = 'white'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.50)'}
            >
              View All Listings
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          </div>
        </div>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 40px' }}>
          <FeaturedGrid />
        </div>
      </section>

      {/* ════════ 4. SERVICES ════════ */}
      <section style={{ background: 'var(--cream-dark, #EDE8DC)', padding: '96px 40px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ marginBottom: 56 }}>
            <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 10, fontWeight: 700, color: 'var(--brand, #7B1828)', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 16 }}>
              What We Do
            </p>
            <h2 className="reveal" style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 700, color: 'var(--ink, #1A1A1A)', lineHeight: 1.1, maxWidth: 480 }}>
              A complete property service.
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {[
              {
                href: '/buy',
                title: 'Buying Property',
                body: 'Verified listings across all provinces. Every property is confirmed before it goes live. From Kabulonga stands to Copperbelt apartments, each listing is reviewed by our compliance team.',
                cta: 'Start Searching',
              },
              {
                href: '/sell',
                title: 'Selling Property',
                body: 'We connect you with serious, pre-qualified buyers and handle everything from listing to title transfer. Our team manages the process so you receive the best outcome at every stage.',
                cta: 'Get a Valuation',
              },
              {
                href: '/landlords',
                title: 'Letting Property',
                body: 'Quality tenant screening, lease management, and monthly rent collection. Landlords across Zambia rely on our team to manage tenancy so they do not have to.',
                cta: 'Let Your Property',
              },
            ].map((s, i) => (
              <div key={s.href} className="reveal" style={{ background: 'white', padding: '40px 36px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 10, fontWeight: 700, color: 'var(--brand, #7B1828)', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 20 }}>
                  {String(i + 1).padStart(2, '0')}
                </div>
                <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 22, fontWeight: 700, color: 'var(--ink, #1A1A1A)', lineHeight: 1.2, marginBottom: 16 }}>
                  {s.title}
                </h3>
                <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 14, color: 'var(--ink-muted, #6B6B6B)', lineHeight: 1.75, flex: 1, marginBottom: 28 }}>
                  {s.body}
                </p>
                <Link href={s.href} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  color: 'var(--brand, #7B1828)', textDecoration: 'none',
                  fontSize: 13, fontFamily: "'Outfit', sans-serif", fontWeight: 600,
                  letterSpacing: '0.06em', textTransform: 'uppercase',
                  transition: 'gap 0.15s',
                }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.gap = '12px'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.gap = '8px'; }}
                >
                  {s.cta}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </Link>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 16, display: 'flex', gap: 16 }}>
            {[
              { href: '/tenants', title: 'Finding a Rental', cta: 'Browse Rentals' },
              { href: '/development', title: 'Property Development', cta: 'Learn More' },
              { href: '/maintenance', title: 'Property Maintenance', cta: 'Learn More' },
            ].map((s, i) => (
              <div key={s.href} className="reveal" style={{ flex: 1, background: 'var(--cream, #F5F0E8)', padding: '28px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 14.5, fontWeight: 600, color: 'var(--ink, #1A1A1A)' }}>
                  {s.title}
                </span>
                <Link href={s.href} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  color: 'var(--brand, #7B1828)', textDecoration: 'none',
                  fontSize: 12, fontFamily: "'Outfit', sans-serif", fontWeight: 600,
                  letterSpacing: '0.06em', textTransform: 'uppercase', whiteSpace: 'nowrap',
                }}>
                  {s.cta}
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ 5. STATS ════════ */}
      <section style={{ background: 'var(--brand, #7B1828)', padding: '88px 40px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, background: 'rgba(255,255,255,0.08)' }}>
            {[
              { value: '850+',  label: 'Active Listings' },
              { value: '2400+', label: 'Deals Completed' },
              { value: '120+',  label: 'Agents Nationwide' },
              { value: '9+',    label: 'Provinces Covered' },
            ].map((stat, i) => (
              <div key={stat.label} style={{ background: 'var(--brand, #7B1828)', padding: '56px 24px' }}>
                <StatItem value={stat.value} label={stat.label} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ 6. EDITORIAL STATEMENT ════════ */}
      <section style={{ background: 'var(--ink, #1A1A1A)', padding: '96px 40px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
          <div>
            <p className="reveal" style={{ fontFamily: "'Outfit', sans-serif", fontSize: 10, fontWeight: 700, color: 'var(--gold, #C9A84C)', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 24 }}>
              Why Done and Space
            </p>
            <h2 className="reveal reveal-delay-1" style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(28px, 3.5vw, 48px)', fontWeight: 700, color: 'white', lineHeight: 1.15, letterSpacing: '-0.01em', marginBottom: 32 }}>
              Real estate in Zambia deserves a platform built for how it actually works here.
            </h2>
            <p className="reveal reveal-delay-2" style={{ fontFamily: "'Outfit', sans-serif", fontSize: 15, color: 'rgba(255,255,255,0.55)', lineHeight: 1.8, marginBottom: 20 }}>
              Most property platforms are built for markets with land registries that update in real time, banking systems that clear in two days, and buyers who expect everything online. Zambia is not that market.
            </p>
            <p className="reveal reveal-delay-2" style={{ fontFamily: "'Outfit', sans-serif", fontSize: 15, color: 'rgba(255,255,255,0.55)', lineHeight: 1.8, marginBottom: 40 }}>
              Done and Space was designed for the way property is actually bought, sold, and managed here. Relationships are central. Documentation matters. Title types vary. Deals take time and require people. Our platform is built around that reality.
            </p>
            <div className="reveal reveal-delay-3" style={{ display: 'flex', gap: 16 }}>
              <Link href="/about" style={{
                display: 'inline-block', background: 'white', color: 'var(--ink, #1A1A1A)',
                textDecoration: 'none', padding: '12px 28px', borderRadius: 4,
                fontSize: 13, fontWeight: 600, fontFamily: "'Outfit', sans-serif",
                letterSpacing: '0.06em', textTransform: 'uppercase',
                transition: 'background 0.15s',
              }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--cream, #F5F0E8)'}
                onMouseLeave={e => e.currentTarget.style.background = 'white'}
              >
                About Us
              </Link>
              <Link href="/contact" style={{
                display: 'inline-block', background: 'transparent', color: 'rgba(255,255,255,0.60)',
                textDecoration: 'none', padding: '12px 28px', borderRadius: 4,
                fontSize: 13, fontWeight: 600, fontFamily: "'Outfit', sans-serif",
                letterSpacing: '0.06em', textTransform: 'uppercase',
                border: '1.5px solid rgba(255,255,255,0.15)',
                transition: 'all 0.15s',
              }}
                onMouseEnter={e => { e.currentTarget.style.color = 'white'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.40)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.60)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; }}
              >
                Get in Touch
              </Link>
            </div>
          </div>

          {/* Right side — 3 pillar items */}
          <div className="reveal reveal-delay-1" style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {[
              {
                n: '01',
                title: 'Licensed and Accountable',
                body: 'We hold a valid real estate agency licence. Every agent on our platform operates under a signed mandate. Every listing is approved before publication.',
              },
              {
                n: '02',
                title: 'Zambian Market Knowledge',
                body: 'We know the difference between full title, leasehold, and occupancy licence. We understand how finance works here, how negotiations run, and what due diligence actually requires.',
              },
              {
                n: '03',
                title: 'End-to-End Support',
                body: 'From first inquiry to signed transfer. We do not hand you a listing and disappear. Our team stays with you through valuation, offer, documentation, and completion.',
              },
            ].map(item => (
              <div key={item.n} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', padding: '28px 28px', display: 'flex', gap: 20 }}>
                <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 10, fontWeight: 700, color: 'var(--brand-light, #9B2035)', letterSpacing: '0.12em', paddingTop: 4, flexShrink: 0 }}>
                  {item.n}
                </div>
                <div>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 14, fontWeight: 600, color: 'white', marginBottom: 8 }}>
                    {item.title}
                  </div>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13.5, color: 'rgba(255,255,255,0.45)', lineHeight: 1.7 }}>
                    {item.body}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ 7. CTA BAND ════════ */}
      <section style={{ background: 'var(--cream, #F5F0E8)', padding: '72px 40px', borderTop: '1px solid var(--border, #E0D9CE)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 40, flexWrap: 'wrap' }}>
          <div>
            <h2 className="reveal" style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(24px, 3vw, 40px)', fontWeight: 700, color: 'var(--ink, #1A1A1A)', lineHeight: 1.15, marginBottom: 12 }}>
              Ready to get started?
            </h2>
            <p className="reveal reveal-delay-1" style={{ fontFamily: "'Outfit', sans-serif", fontSize: 15, color: 'var(--ink-muted, #6B6B6B)', lineHeight: 1.6 }}>
              Book a consultation with our team today. No obligation, just a straight conversation about your property goals.
            </p>
          </div>
          <div className="reveal reveal-delay-2" style={{ display: 'flex', gap: 12, flexShrink: 0 }}>
            <Link href="/contact" style={{
              display: 'inline-block', background: 'var(--brand, #7B1828)', color: 'white',
              textDecoration: 'none', padding: '14px 32px', borderRadius: 4,
              fontSize: 13, fontWeight: 600, fontFamily: "'Outfit', sans-serif",
              letterSpacing: '0.06em', textTransform: 'uppercase',
              transition: 'background 0.15s',
            }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--brand-dark, #5C1220)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--brand, #7B1828)'}
            >
              Book a Consultation
            </Link>
            <Link href="/properties" style={{
              display: 'inline-block', background: 'transparent', color: 'var(--ink, #1A1A1A)',
              textDecoration: 'none', padding: '14px 32px', borderRadius: 4,
              fontSize: 13, fontWeight: 600, fontFamily: "'Outfit', sans-serif",
              letterSpacing: '0.06em', textTransform: 'uppercase',
              border: '1.5px solid var(--border, #E0D9CE)',
              transition: 'all 0.15s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--ink-muted, #6B6B6B)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border, #E0D9CE)'; }}
            >
              Browse Properties
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
