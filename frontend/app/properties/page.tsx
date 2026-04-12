'use client';
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import PropertyCard from '../../components/PropertyCard';
import { Search, SlidersHorizontal, Building2, X } from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://done-space-backend-production.up.railway.app/api/v1';

const TYPES = ['all', 'house', 'apartment', 'land', 'commercial', 'office'];
const LISTING_TYPES = [{ value: 'all', label: 'All' }, { value: 'sale', label: 'For Sale' }, { value: 'let', label: 'For Rent' }];
const PROVINCES = ['All Provinces', 'Lusaka', 'Copperbelt', 'Central', 'Eastern', 'Western', 'Northern', 'Luapula', 'North-Western', 'Southern', 'Muchinga'];

function PropertiesContent() {
  const searchParams = useSearchParams();
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [listingType, setListingType] = useState(searchParams.get('type') || 'all');
  const [propType, setPropType] = useState('all');
  const [province, setProvince] = useState('All Provinces');
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ status: 'published', limit: '50' });
    if (listingType !== 'all') params.set('listing_type', listingType);
    if (propType !== 'all') params.set('property_type', propType);

    fetch(`${API}/properties?${params}`)
      .then(r => r.json())
      .then(data => {
        let list = Array.isArray(data) ? data : (data.data || data.properties || []);
        if (province !== 'All Provinces') list = list.filter((p: any) => p.province === province || p.city === province || p.location?.includes(province));
        if (search.trim()) {
          const q = search.toLowerCase();
          list = list.filter((p: any) => p.title?.toLowerCase().includes(q) || p.location?.toLowerCase().includes(q) || p.city?.toLowerCase().includes(q));
        }
        setProperties(list);
      })
      .catch(() => setProperties([]))
      .finally(() => setLoading(false));
  }, [listingType, propType, province]);

  const baseFiltered = search.trim()
    ? properties.filter(p => {
        const q = search.toLowerCase();
        return p.title?.toLowerCase().includes(q) || p.location?.toLowerCase().includes(q) || p.city?.toLowerCase().includes(q);
      })
    : properties;

  const filtered = [...baseFiltered].sort((a, b) => {
    if (sortBy === 'price_asc') return (a.price || 0) - (b.price || 0);
    if (sortBy === 'price_desc') return (b.price || 0) - (a.price || 0);
    return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
  });

  const selStyle: any = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '9px 12px', borderRadius: 9, fontSize: 13, outline: 'none', fontFamily: 'Outfit, sans-serif', cursor: 'pointer' };

  return (
    <main style={{ background: '#0a0608', minHeight: '100vh', paddingTop: 68 }}>
      {/* Header */}
      <div style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '40px 24px 32px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <p style={{ color: '#8B1A2F', fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Properties</p>
          <h1 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700, letterSpacing: '-0.025em', marginBottom: 8 }}>All Properties</h1>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14 }}>{loading ? 'Loading...' : `${filtered.length} ${filtered.length === 1 ? 'property' : 'properties'} found — all listings verified before publication`}</p>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
        {/* Filters */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 32, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: 220, display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 9, padding: '0 14px' }}>
            <Search size={15} style={{ color: 'rgba(255,255,255,0.3)', flexShrink: 0 }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search properties..." style={{ flex: 1, background: 'none', border: 'none', color: 'white', fontSize: 13.5, outline: 'none', padding: '10px 0', fontFamily: 'Outfit, sans-serif' }} />
            {search && <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer' }}><X size={14} /></button>}
          </div>

          <div style={{ display: 'flex', gap: 4, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 9, padding: 4 }}>
            {LISTING_TYPES.map(t => (
              <button key={t.value} onClick={() => setListingType(t.value)} style={{
                padding: '7px 14px', borderRadius: 7, border: 'none', fontSize: 13,
                background: listingType === t.value ? '#8B1A2F' : 'transparent',
                color: listingType === t.value ? 'white' : 'rgba(255,255,255,0.5)',
                cursor: 'pointer', fontFamily: 'Outfit, sans-serif', fontWeight: listingType === t.value ? 600 : 400,
              }}>{t.label}</button>
            ))}
          </div>

          <select value={propType} onChange={e => setPropType(e.target.value)} style={selStyle}>
            {TYPES.map(t => <option key={t} value={t}>{t === 'all' ? 'All Types' : t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
          </select>

          <select value={province} onChange={e => setProvince(e.target.value)} style={selStyle}>
            {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
          </select>

          <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={selStyle}>
            <option value="newest">Newest First</option>
            <option value="price_asc">Price: Low–High</option>
            <option value="price_desc">Price: High–Low</option>
          </select>
        </div>

        {/* Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'rgba(255,255,255,0.3)' }}>Loading properties...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <Building2 size={48} style={{ color: 'rgba(255,255,255,0.1)', margin: '0 auto 16px', display: 'block' }} />
            <h3 style={{ color: 'white', fontSize: 18, fontWeight: 600, marginBottom: 10, fontFamily: 'Outfit, sans-serif' }}>No properties found</h3>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14, maxWidth: 480, margin: '0 auto 20px', lineHeight: 1.65 }}>
              We may have properties not yet listed publicly. Contact our team directly — we often match clients before listings go live.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={() => { setSearch(''); setListingType('all'); setPropType('all'); setProvince('All Provinces'); }} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.5)', padding: '9px 18px', borderRadius: 8, fontSize: 13, cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>Clear Filters</button>
              <a href="/contact" style={{ background: '#8B1A2F', color: 'white', padding: '9px 18px', borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: 'none', fontFamily: 'Outfit, sans-serif' }}>Contact Our Team</a>
              <a href="https://wa.me/260971000000" target="_blank" rel="noopener noreferrer" style={{ background: '#25D366', color: 'white', padding: '9px 18px', borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: 'none', fontFamily: 'Outfit, sans-serif' }}>WhatsApp Us</a>
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 22 }}>
            {filtered.map(p => <PropertyCard key={p.id} property={p} />)}
          </div>
        )}

        {/* Bottom CTA */}
        {!loading && (
          <div style={{ background: 'var(--cream, #F8F3ED)', border: '1px solid rgba(255,255,255,0.08)', marginTop: 56, padding: '48px', textAlign: 'center', borderRadius: 4 }}>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12, fontFamily: 'Outfit, sans-serif' }}>Can&apos;t Find What You&apos;re Looking For?</p>
            <h3 style={{ color: 'white', fontFamily: 'Outfit, sans-serif', fontSize: 18, fontWeight: 600, marginBottom: 10 }}>Tell us what you need</h3>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14, maxWidth: 440, margin: '0 auto 24px', lineHeight: 1.65 }}>
              We will search our full database — including unlisted properties — to find what you are looking for.
            </p>
            <a href="/buy" style={{ display: 'inline-block', background: '#8B1A2F', color: 'white', padding: '12px 24px', borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: 'none', fontFamily: 'Outfit, sans-serif' }}>
              Submit a Property Request
            </a>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 900px) {
          main > div:last-child > div:last-child { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 600px) {
          main > div:last-child > div:last-child { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  );
}

export default function PropertiesPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Outfit, sans-serif', color: 'rgba(255,255,255,0.3)', background: '#0a0608' }}>
        Loading properties...
      </div>
    }>
      <PropertiesContent />
    </Suspense>
  );
}
