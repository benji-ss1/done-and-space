'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import PropertyCard from '../../components/PropertyCard';
import InquiryForm from '../../components/InquiryForm';
import { Home, CheckCircle, ChevronRight, Search } from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://done-space-backend-production.up.railway.app/api/v1';

const STEPS = [
  { n: '01', title: 'Browse & Shortlist', desc: 'Explore our listings and tell us what you\'re looking for. We\'ll send you curated matches.' },
  { n: '02', title: 'Schedule Viewings', desc: 'Our agents arrange viewings at your convenience — weekends and evenings available.' },
  { n: '03', title: 'Make an Offer', desc: 'When you find the right property, we guide you through making a competitive offer.' },
  { n: '04', title: 'Complete the Deal', desc: 'We handle the paperwork, legal checks and transfer — right through to key handover.' },
];

export default function BuyPage() {
  const [properties, setProperties] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${API}/properties?listing_type=sale&status=published&limit=6`)
      .then(r => r.json())
      .then(data => {
        const list = Array.isArray(data) ? data : (data.data || data.properties || []);
        setProperties(list.slice(0, 6));
      })
      .catch(() => {});
  }, []);

  return (
    <main style={{ background: '#0a0608', minHeight: '100vh', paddingTop: 68 }}>
      {/* Hero */}
      <section style={{ padding: '64px 24px 72px', background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(139,26,47,0.14) 0%, transparent 70%)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 420px', gap: 60, alignItems: 'start' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(139,26,47,0.12)', border: '1px solid rgba(139,26,47,0.25)', padding: '5px 12px', borderRadius: 20, marginBottom: 20 }}>
              <Home size={13} style={{ color: '#c0374f' }} />
              <span style={{ color: '#c0374f', fontSize: 11.5, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase' }}>Buy Property</span>
            </div>
            <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 20 }}>
              Find Your Dream<br /><span style={{ color: '#8B1A2F' }}>Home in Zambia</span>
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 16, lineHeight: 1.75, marginBottom: 32, maxWidth: 500 }}>
              Whether you're looking for a family home, a stylish apartment, or a commercial investment, we have hundreds of properties for sale across all provinces.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 36 }}>
              {['Residential Homes', 'Apartments', 'Land', 'Commercial', 'Investment'].map(tag => (
                <span key={tag} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', padding: '5px 13px', borderRadius: 20, fontSize: 12.5 }}>{tag}</span>
              ))}
            </div>
            <Link href="/properties?type=sale" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#8B1A2F', color: 'white', padding: '13px 24px', borderRadius: 10, fontSize: 14.5, fontWeight: 600, textDecoration: 'none' }}>
              <Search size={16} /> Browse Properties for Sale
            </Link>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '28px' }}>
            <h3 style={{ color: 'white', fontSize: 16, fontWeight: 600, marginBottom: 6 }}>Interested in Buying?</h3>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, marginBottom: 20 }}>Let us help you find the right property.</p>
            <InquiryForm interestType="buy" compact />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: '80px 24px', background: 'rgba(255,255,255,0.015)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <p style={{ color: '#8B1A2F', fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>The Process</p>
            <h2 style={{ fontSize: 'clamp(26px, 4vw, 38px)', fontWeight: 700, letterSpacing: '-0.025em' }}>How Buying Works</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
            {STEPS.map((s, i) => (
              <div key={i} style={{ position: 'relative' }}>
                {i < STEPS.length - 1 && (
                  <div style={{ position: 'absolute', top: 22, left: 'calc(50% + 24px)', right: 0, height: 1, background: 'rgba(255,255,255,0.08)' }} />
                )}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                  <div style={{ width: 46, height: 46, borderRadius: '50%', background: 'rgba(139,26,47,0.15)', border: '1px solid rgba(139,26,47,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, zIndex: 1 }}>
                    <span style={{ color: '#c0374f', fontSize: 13, fontWeight: 700 }}>{s.n}</span>
                  </div>
                  <h3 style={{ color: 'white', fontSize: 15, fontWeight: 600, marginBottom: 8 }}>{s.title}</h3>
                  <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, lineHeight: 1.65 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Listings */}
      {properties.length > 0 && (
        <section style={{ padding: '80px 24px' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 36, flexWrap: 'wrap', gap: 12 }}>
              <h2 style={{ fontSize: 'clamp(24px, 3vw, 34px)', fontWeight: 700, letterSpacing: '-0.025em' }}>Properties for Sale</h2>
              <Link href="/properties?type=sale" style={{ color: '#c0374f', textDecoration: 'none', fontSize: 14, display: 'flex', alignItems: 'center', gap: 5 }}>
                View all <ChevronRight size={15} />
              </Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 22 }}>
              {properties.map(p => <PropertyCard key={p.id} property={p} />)}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
