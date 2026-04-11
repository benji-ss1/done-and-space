'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import PropertyCard from '../../components/PropertyCard';
import InquiryForm from '../../components/InquiryForm';
import { Key, ChevronRight, Search, Home, Shield, Clock } from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://done-space-backend-production.up.railway.app/api/v1';

const PERKS = [
  { icon: <Home size={20} />, title: 'Quality Homes', desc: 'Every rental listing is inspected and verified before being listed on our platform.' },
  { icon: <Shield size={20} />, title: 'Secure Tenancy', desc: 'Professionally drafted lease agreements that protect both tenant and landlord.' },
  { icon: <Clock size={20} />, title: 'Quick Move-In', desc: 'Streamlined tenant onboarding so you can move in as fast as 48 hours after approval.' },
];

export default function LetPage() {
  const [properties, setProperties] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${API}/properties?listing_type=let&status=published&limit=6`)
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
      <section style={{ padding: '64px 24px 72px', background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(59,130,246,0.1) 0%, transparent 70%)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 420px', gap: 60, alignItems: 'start' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', padding: '5px 12px', borderRadius: 20, marginBottom: 20 }}>
              <Key size={13} style={{ color: '#60a5fa' }} />
              <span style={{ color: '#60a5fa', fontSize: 11.5, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase' }}>Rent a Property</span>
            </div>
            <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 20 }}>
              Quality Rentals<br /><span style={{ color: '#3b82f6' }}>Across Zambia</span>
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 16, lineHeight: 1.75, marginBottom: 32, maxWidth: 500 }}>
              From furnished apartments in Lusaka to family homes on the Copperbelt, we have the perfect rental for every budget and lifestyle.
            </p>
            <div style={{ display: 'flex', gap: 16, marginBottom: 32 }}>
              {PERKS.map((p, i) => (
                <div key={i} style={{ flex: 1, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '16px' }}>
                  <div style={{ color: '#60a5fa', marginBottom: 8 }}>{p.icon}</div>
                  <h4 style={{ color: 'white', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{p.title}</h4>
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, lineHeight: 1.5 }}>{p.desc}</p>
                </div>
              ))}
            </div>
            <Link href="/properties?type=let" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#3b82f6', color: 'white', padding: '13px 24px', borderRadius: 10, fontSize: 14.5, fontWeight: 600, textDecoration: 'none' }}>
              <Search size={16} /> Browse Rentals
            </Link>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '28px' }}>
            <h3 style={{ color: 'white', fontSize: 16, fontWeight: 600, marginBottom: 6 }}>Looking to Rent?</h3>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, marginBottom: 20 }}>Tell us what you need and we'll find it.</p>
            <InquiryForm interestType="rent" compact />
          </div>
        </div>
      </section>

      {/* Listings */}
      {properties.length > 0 && (
        <section style={{ padding: '80px 24px' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 36, flexWrap: 'wrap', gap: 12 }}>
              <h2 style={{ fontSize: 'clamp(24px, 3vw, 34px)', fontWeight: 700, letterSpacing: '-0.025em' }}>Available Rentals</h2>
              <Link href="/properties?type=let" style={{ color: '#60a5fa', textDecoration: 'none', fontSize: 14, display: 'flex', alignItems: 'center', gap: 5 }}>
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
