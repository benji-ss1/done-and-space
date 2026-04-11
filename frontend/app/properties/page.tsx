'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import PropertyCard from '../../components/PropertyCard';
import { Search, SlidersHorizontal, Building2, X } from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://done-space-backend-production.up.railway.app/api/v1';

const TYPES = ['all', 'house', 'apartment', 'land', 'commercial', 'office'];
const LISTING_TYPES = [{ value: 'all', label: 'All' }, { value: 'sale', label: 'For Sale' }, { value: 'let', label: 'For Rent' }];
const PROVINCES = ['All Provinces', 'Lusaka', 'Copperbelt', 'Central', 'Eastern', 'Western', 'Northern', 'Luapula', 'North-Western', 'Southern', 'Muchinga'];

export default function PropertiesPage() {
  const searchParams = useSearchParams();
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [listingType, setListingType] = useState(searchParams.get('type') || 'all');
  const [propType, setPropType] = useState('all');
  const [province, setProvince] = useState('All Provinces');
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [showFilters, setShowFilters] = useState(false);

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

  const filtered = search.trim()
    ? properties.filter(p => {
        const q = search.toLowerCase();
        return p.title?.toLowerCase().includes(q) || p.location?.toLowerCase().includes(q) || p.city?.toLowerCase().includes(q);
      })
    : properties;

  const selStyle: any = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '9px 12px', borderRadius: 9, fontSize: 13, outline: 'none', fontFamily: 'Outfit, sans-serif', cursor: 'pointer' };

  return (
    <main style={{ background: '#0a0608', minHeight: '100vh', paddingTop: 68 }}>
      {/* Header */}
      <div style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '40px 24px 32px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <p style={{ color: '#8B1A2F', fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Properties</p>
          <h1 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700, letterSpacing: '-0.025em', marginBottom: 8 }}>All Properties</h1>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14 }}>{loading ? 'Loading...' : `${filtered.length} properties found`}</p>
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
        </div>

        {/* Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'rgba(255,255,255,0.3)' }}>Loading properties...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <Building2 size={48} style={{ color: 'rgba(255,255,255,0.1)', margin: '0 auto 16px', display: 'block' }} />
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 15 }}>No properties found matching your criteria.</p>
            <button onClick={() => { setSearch(''); setListingType('all'); setPropType('all'); setProvince('All Provinces'); }} style={{ marginTop: 16, background: 'none', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.5)', padding: '9px 18px', borderRadius: 8, fontSize: 13, cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>Clear Filters</button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 22 }}>
            {filtered.map(p => <PropertyCard key={p.id} property={p} />)}
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
