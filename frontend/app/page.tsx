'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import PropertyCard from '../components/PropertyCard';
import InquiryForm from '../components/InquiryForm';
import { Search, Home, Key, TrendingUp, Users, Shield, Clock, ChevronRight, Star, Building2, MapPin } from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://done-space-backend-production.up.railway.app/api/v1';

const SERVICES = [
  { icon: <Home size={24} />, title: 'Buy Property', desc: 'Find your dream home from our curated selection of residential and commercial listings across Zambia.', href: '/buy' },
  { icon: <Key size={24} />, title: 'Rent a Home', desc: 'Discover quality rental properties from furnished apartments to family homes. Flexible terms available.', href: '/let' },
  { icon: <TrendingUp size={24} />, title: 'Sell Your Property', desc: 'Get maximum value for your property. Our agents handle everything from valuation to final sale.', href: '/sell' },
  { icon: <Building2 size={24} />, title: 'Landlord Services', desc: 'Full property management, tenant screening, and rent collection services for landlords.', href: '/landlords' },
  { icon: <Users size={24} />, title: 'For Agents', desc: 'Join our network of professional agents and access exclusive listings and tools.', href: '/agents' },
  { icon: <Shield size={24} />, title: 'Property Maintenance', desc: 'Comprehensive maintenance solutions to keep your property in perfect condition.', href: '/maintenance' },
];

const STATS = [
  { value: '500+', label: 'Properties Listed' },
  { value: '1,200+', label: 'Happy Clients' },
  { value: '10+', label: 'Years Experience' },
  { value: '9', label: 'Provinces Covered' },
];

const WHY_US = [
  { icon: <Shield size={20} />, title: 'Licensed & Regulated', desc: 'Fully licensed real estate agency operating under Zambia\'s property laws.' },
  { icon: <Clock size={20} />, title: 'Fast Turnaround', desc: 'Our team responds within 24 hours and closes deals faster than industry average.' },
  { icon: <Star size={20} />, title: 'Trusted Agents', desc: 'Verified, experienced agents who put your interests first every step of the way.' },
  { icon: <MapPin size={20} />, title: 'Nationwide Coverage', desc: 'Listings and agent presence across all provinces from Lusaka to Livingstone.' },
];

const SEARCH_TABS = ['buy', 'rent', 'sell'] as const;

export default function HomePage() {
  const [featured, setFeatured] = useState<any[]>([]);
  const [searchTab, setSearchTab] = useState<'buy' | 'rent' | 'sell'>('buy');
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

  return (
    <main style={{ background: '#0a0608', minHeight: '100vh', color: 'white' }}>

      {/* HERO */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', paddingTop: 68 }}>
        {/* Background */}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(139,26,47,0.18) 0%, transparent 70%), radial-gradient(ellipse 60% 50% at 80% 50%, rgba(139,26,47,0.08) 0%, transparent 60%)' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 24px', position: 'relative', width: '100%' }}>
          <div style={{ maxWidth: 760 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(139,26,47,0.12)', border: '1px solid rgba(139,26,47,0.25)', padding: '6px 14px', borderRadius: 20, marginBottom: 24 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#c0374f', boxShadow: '0 0 6px #c0374f' }} />
              <span style={{ color: '#c0374f', fontSize: 12, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Zambia's Trusted Property Partner</span>
            </div>

            <h1 style={{ fontSize: 'clamp(38px, 6vw, 68px)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.03em', marginBottom: 22 }}>
              Find Your Perfect<br />
              <span style={{ color: '#8B1A2F' }}>Property</span> in Zambia
            </h1>

            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 18, lineHeight: 1.7, marginBottom: 40, maxWidth: 560 }}>
              Buy, rent, sell or let with confidence. Done & Space Properties connects you with exceptional homes, apartments and commercial spaces across all provinces.
            </p>

            {/* Search bar */}
            <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, overflow: 'hidden', maxWidth: 620 }}>
              <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                {SEARCH_TABS.map(tab => (
                  <button key={tab} onClick={() => setSearchTab(tab)} style={{
                    flex: 1, padding: '12px', background: searchTab === tab ? 'rgba(139,26,47,0.2)' : 'transparent',
                    border: 'none', color: searchTab === tab ? '#c0374f' : 'rgba(255,255,255,0.45)',
                    fontSize: 13, fontWeight: searchTab === tab ? 600 : 400, cursor: 'pointer',
                    fontFamily: 'Outfit, sans-serif', textTransform: 'capitalize', transition: 'all 0.15s',
                  }}>
                    {tab === 'rent' ? 'Rent' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px' }}>
                <Search size={18} style={{ color: 'rgba(255,255,255,0.3)', flexShrink: 0 }} />
                <input
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search by location, type or keyword..."
                  style={{ flex: 1, background: 'none', border: 'none', color: 'white', fontSize: 14, outline: 'none', fontFamily: 'Outfit, sans-serif' }}
                />
                <Link href={`/properties?type=${searchTab === 'rent' ? 'let' : searchTab}&q=${encodeURIComponent(searchQuery)}`}
                  style={{ background: '#8B1A2F', color: 'white', padding: '9px 18px', borderRadius: 9, fontSize: 13.5, fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap' }}>
                  Search
                </Link>
              </div>
            </div>

            {/* Quick links */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 24 }}>
              {['Lusaka', 'Copperbelt', 'Livingstone', 'Ndola'].map(city => (
                <Link key={city} href={`/properties?location=${city}`} style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  color: 'rgba(255,255,255,0.45)', textDecoration: 'none', fontSize: 13,
                  padding: '5px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 20, transition: 'all 0.15s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.color = 'white'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.45)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; }}
                >
                  <MapPin size={11} /> {city}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section style={{ padding: '0 24px 80px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, background: 'rgba(255,255,255,0.06)', borderRadius: 14, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
            {STATS.map((s, i) => (
              <div key={i} style={{ background: 'rgba(10,6,8,0.9)', padding: '32px 24px', textAlign: 'center', borderRight: i < 3 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                <div style={{ color: '#c0374f', fontSize: 36, fontWeight: 800, letterSpacing: '-0.03em', fontFamily: 'Outfit, sans-serif' }}>{s.value}</div>
                <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, marginTop: 6 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section style={{ padding: '80px 24px', background: 'rgba(255,255,255,0.015)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ marginBottom: 48, maxWidth: 520 }}>
            <p style={{ color: '#8B1A2F', fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>Our Services</p>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 1.2 }}>Everything You Need<br /><span style={{ color: 'rgba(255,255,255,0.45)' }}>Under One Roof</span></h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {SERVICES.map(s => (
              <Link key={s.href} href={s.href} style={{ textDecoration: 'none' }}>
                <div style={{
                  background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 14, padding: '28px', transition: 'all 0.2s', cursor: 'pointer',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(139,26,47,0.35)'; e.currentTarget.style.background = 'rgba(139,26,47,0.06)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(139,26,47,0.15)', border: '1px solid rgba(139,26,47,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c0374f', marginBottom: 18 }}>
                    {s.icon}
                  </div>
                  <h3 style={{ color: 'white', fontSize: 16, fontWeight: 600, marginBottom: 10 }}>{s.title}</h3>
                  <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13.5, lineHeight: 1.65 }}>{s.desc}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#c0374f', fontSize: 13, fontWeight: 500, marginTop: 16 }}>
                    Learn more <ChevronRight size={14} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PROPERTIES */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 40, flexWrap: 'wrap', gap: 16 }}>
            <div>
              <p style={{ color: '#8B1A2F', fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>Properties</p>
              <h2 style={{ fontSize: 'clamp(26px, 4vw, 38px)', fontWeight: 700, letterSpacing: '-0.025em' }}>Featured Listings</h2>
            </div>
            <Link href="/properties" style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#c0374f', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>
              View all properties <ChevronRight size={16} />
            </Link>
          </div>

          {featured.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 22 }}>
              {featured.map(p => <PropertyCard key={p.id} property={p} />)}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'rgba(255,255,255,0.3)' }}>
              <Building2 size={40} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
              <p>Listings loading...</p>
            </div>
          )}
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section style={{ padding: '80px 24px', background: 'rgba(255,255,255,0.015)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
            <div>
              <p style={{ color: '#8B1A2F', fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>Why Choose Us</p>
              <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 1.2, marginBottom: 20 }}>
                Your Property Journey,<br />Done Right
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, lineHeight: 1.75, marginBottom: 32 }}>
                We combine deep local knowledge with professional standards to deliver an exceptional property experience — whether you're a first-time buyer or seasoned investor.
              </p>
              <Link href="/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#8B1A2F', color: 'white', padding: '12px 22px', borderRadius: 10, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
                Get Free Consultation <ChevronRight size={15} />
              </Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {WHY_US.map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 16, padding: '20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 9, background: 'rgba(139,26,47,0.15)', border: '1px solid rgba(139,26,47,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c0374f', flexShrink: 0 }}>
                    {item.icon}
                  </div>
                  <div>
                    <h3 style={{ color: 'white', fontSize: 14.5, fontWeight: 600, marginBottom: 5 }}>{item.title}</h3>
                    <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13.5, lineHeight: 1.6 }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* INQUIRY CTA */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, alignItems: 'start' }}>
            <div>
              <p style={{ color: '#8B1A2F', fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>Get In Touch</p>
              <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 1.2, marginBottom: 20 }}>
                Ready to Find Your<br />Perfect Property?
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, lineHeight: 1.75, marginBottom: 28 }}>
                Leave your details and one of our experienced agents will reach out to help you navigate the Zambian property market.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {['Free property consultation', 'Personalised property search', 'No obligation, no pressure'].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>
                    <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(139,26,47,0.2)', border: '1px solid rgba(139,26,47,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#c0374f' }} />
                    </div>
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '32px' }}>
              <h3 style={{ color: 'white', fontSize: 16, fontWeight: 600, marginBottom: 22 }}>Send an Inquiry</h3>
              <InquiryForm />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
