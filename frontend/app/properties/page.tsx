'use client';
import { Suspense, useEffect, useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import PropertyCard from '../../components/PropertyCard';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://done-space-backend-production.up.railway.app/api/v1';

const PROP_TYPES = ['HOUSE', 'APARTMENT', 'OFFICE', 'COMMERCIAL', 'LAND'];
const BEDROOM_OPTIONS = ['Studio', '1', '2', '3', '4+'];
const AMENITIES = ['Pool', 'Gym', 'Parking', 'Balcony', 'Garden', 'Boardroom', 'Security System'];
const UTILITIES = ['Solar Panels', 'Borehole', 'Generator', 'Prepaid Electric'];
const BUYER_TYPES = ['Cash Buyer', 'Build in Phases', 'Negotiable'];
const TITLE_STATUS = ['Full Title', 'Leasehold', 'Occupancy Licence'];

const selStyle: React.CSSProperties = {
  border: '1.5px solid var(--border, #E0D9CE)', borderRadius: 4, padding: '10px 14px',
  fontSize: 14, outline: 'none', fontFamily: "'Outfit', sans-serif",
  color: 'var(--ink, #1A1A1A)', background: 'white', width: '100%', boxSizing: 'border-box' as const, cursor: 'pointer',
};
const inpStyle: React.CSSProperties = { ...selStyle, cursor: 'text' };
const lblStyle: React.CSSProperties = {
  display: 'block', fontSize: 10.5, fontWeight: 700, letterSpacing: '0.10em',
  textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)', marginBottom: 5,
  fontFamily: "'Outfit', sans-serif",
};

function PropertiesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Header search state
  const [listingType, setListingType] = useState<'sale' | 'let'>(
    (searchParams.get('listing_type') as 'sale' | 'let') || 'sale'
  );
  const [location, setLocation] = useState(searchParams.get('q') || '');
  const [propTypeFilter, setPropTypeFilter] = useState(searchParams.get('property_type') || '');
  const [priceRange, setPriceRange] = useState('Any Price');

  // Sidebar state
  const [selectedBeds, setSelectedBeds] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [selectedUtilities, setSelectedUtilities] = useState<string[]>([]);
  const [selectedBuyerTypes, setSelectedBuyerTypes] = useState<string[]>([]);
  const [selectedTitleStatus, setSelectedTitleStatus] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState(true); // active
  const [sortBy, setSortBy] = useState('newest');

  const toggleSet = <T,>(arr: T[], val: T): T[] =>
    arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val];

  const fetch_ = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({ status: 'published', limit: '50' });
    if (listingType !== 'sale') params.set('listing_type', listingType);
    if (propTypeFilter) params.set('property_type', propTypeFilter);

    fetch(`${API}/properties?${params}`)
      .then(r => r.json())
      .then(data => {
        let list = Array.isArray(data) ? data : (data.data || data.properties || []);
        // client-side location filter
        if (location.trim()) {
          const q = location.toLowerCase();
          list = list.filter((p: any) =>
            p.title?.toLowerCase().includes(q) ||
            p.location?.toLowerCase().includes(q) ||
            p.city?.toLowerCase().includes(q) ||
            p.province?.toLowerCase().includes(q)
          );
        }
        // bedroom filter
        if (selectedBeds.length > 0) {
          list = list.filter((p: any) => {
            if (!p.bedrooms && p.bedrooms !== 0) return false;
            return selectedBeds.some(b => {
              if (b === 'Studio') return p.bedrooms === 0;
              if (b === '4+') return p.bedrooms >= 4;
              return p.bedrooms === parseInt(b);
            });
          });
        }
        // type filter
        if (selectedTypes.length > 0) {
          list = list.filter((p: any) => selectedTypes.map(t => t.toLowerCase()).includes(p.property_type?.toLowerCase()));
        }
        // sort
        if (sortBy === 'price_asc') list.sort((a: any, b: any) => (a.price || 0) - (b.price || 0));
        else if (sortBy === 'price_desc') list.sort((a: any, b: any) => (b.price || 0) - (a.price || 0));
        else list.sort((a: any, b: any) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());

        setProperties(list);
      })
      .catch(() => setProperties([]))
      .finally(() => setLoading(false));
  }, [listingType, propTypeFilter, location, selectedBeds, selectedTypes, sortBy]);

  useEffect(() => { fetch_(); }, [fetch_]);

  const doSearch = () => { fetch_(); };

  const sidebarHdg: React.CSSProperties = {
    fontFamily: "'Outfit', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: '0.10em',
    textTransform: 'uppercase', color: 'var(--ink-muted, #6B6B6B)', marginBottom: 12, marginTop: 20,
  };
  const pillBtn = (active: boolean): React.CSSProperties => ({
    padding: '5px 12px', border: `1.5px solid ${active ? 'var(--brand, #7B1828)' : 'var(--border, #E0D9CE)'}`,
    borderRadius: 4, fontSize: 13, background: active ? 'var(--brand, #7B1828)' : 'transparent',
    color: active ? 'white' : 'var(--ink-muted, #6B6B6B)', cursor: 'pointer',
    fontFamily: "'Outfit', sans-serif", transition: 'all 0.15s',
  });

  return (
    <main style={{ background: 'var(--cream, #F5F0E8)', paddingTop: 72 }}>

      {/* ─── SEARCH HEADER ─── */}
      <div style={{ background: 'var(--brand, #7B1828)', padding: '24px 40px' }}>
        {/* Sale/Let toggle */}
        <div style={{ display: 'flex', gap: 0, marginBottom: 20, maxWidth: 380, background: 'rgba(0,0,0,0.25)', borderRadius: 4, padding: 4 }}>
          {(['sale', 'let'] as const).map(t => (
            <button key={t} onClick={() => setListingType(t)} style={{
              flex: 1, padding: '10px 20px', border: 'none', borderRadius: 3,
              fontFamily: "'Outfit', sans-serif", fontSize: 14, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
              background: listingType === t ? 'white' : 'transparent',
              color: listingType === t ? 'var(--brand, #7B1828)' : 'rgba(255,255,255,0.65)',
            }}>
              {t === 'sale' ? 'Search For Sale' : 'Search To Let'}
            </button>
          ))}
        </div>

        {/* Search fields */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'flex-end' }}>
          <div style={{ flex: '1 1 200px', minWidth: 160 }}>
            <label style={lblStyle}>Location</label>
            <input value={location} onChange={e => setLocation(e.target.value)} onKeyDown={e => e.key === 'Enter' && doSearch()} placeholder="City, area or region..." style={{ ...inpStyle, background: 'rgba(255,255,255,0.95)' }} />
          </div>
          <div style={{ flex: '1 1 160px', minWidth: 140 }}>
            <label style={lblStyle}>Property Type</label>
            <select value={propTypeFilter} onChange={e => setPropTypeFilter(e.target.value)} style={{ ...selStyle, background: 'rgba(255,255,255,0.95)' }}>
              <option value="">Any Type</option>
              {PROP_TYPES.map(t => <option key={t} value={t.toLowerCase()}>{t.charAt(0) + t.slice(1).toLowerCase()}</option>)}
            </select>
          </div>
          <div style={{ flex: '1 1 160px', minWidth: 140 }}>
            <label style={lblStyle}>Price Range</label>
            <select value={priceRange} onChange={e => setPriceRange(e.target.value)} style={{ ...selStyle, background: 'rgba(255,255,255,0.95)' }}>
              {['Any Price', 'Up to ZMW 500K', 'ZMW 500K–2M', 'ZMW 2M–5M', 'ZMW 5M–10M', 'ZMW 10M+'].map(r => <option key={r}>{r}</option>)}
            </select>
          </div>
          <button onClick={doSearch} style={{ padding: '11px 32px', background: 'var(--ink, #1A1A1A)', color: 'white', border: 'none', borderRadius: 4, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: "'Outfit', sans-serif", alignSelf: 'flex-end', flexShrink: 0 }}>
            Search
          </button>
        </div>

        {/* Extra filters */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, marginTop: 14, alignItems: 'center' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,0.70)', fontSize: 13, fontFamily: "'Outfit', sans-serif", cursor: 'pointer' }}>
            <div style={{ width: 36, height: 20, background: statusFilter ? 'var(--gold, #C9A84C)' : 'rgba(255,255,255,0.2)', borderRadius: 10, position: 'relative', transition: 'background 0.2s', cursor: 'pointer', flexShrink: 0 }} onClick={() => setStatusFilter(v => !v)}>
              <div style={{ width: 14, height: 14, background: 'white', borderRadius: '50%', position: 'absolute', top: 3, left: statusFilter ? 19 : 3, transition: 'left 0.2s' }} />
            </div>
            Active, Under Offer
          </label>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.70)', fontSize: 13, fontFamily: "'Outfit', sans-serif", cursor: 'pointer', outline: 'none' }}>
            <option value="newest" style={{ color: '#1A1A1A' }}>Sort: Newest</option>
            <option value="price_asc" style={{ color: '#1A1A1A' }}>Sort: Price ↑</option>
            <option value="price_desc" style={{ color: '#1A1A1A' }}>Sort: Price ↓</option>
          </select>
        </div>
      </div>

      {/* ─── MAIN LAYOUT: sidebar + results ─── */}
      <div style={{ maxWidth: 1340, margin: '0 auto', display: 'flex', gap: 24, padding: '24px 24px 80px', alignItems: 'flex-start' }}>

        {/* SIDEBAR */}
        <aside style={{ width: 220, flexShrink: 0, background: 'white', border: '1px solid var(--border, #E0D9CE)', borderRadius: 4, padding: '20px', position: 'sticky', top: 90, maxHeight: 'calc(100vh - 110px)', overflowY: 'auto' }}>

          {/* Price Range */}
          <div style={{ ...sidebarHdg, marginTop: 0 }}>Price Range</div>
          <div style={{ fontSize: 12, color: 'var(--brand, #7B1828)', fontWeight: 600, marginBottom: 8, fontFamily: "'Outfit', sans-serif", textAlign: 'center' }}>ZMW 500K – ZMW 10M+</div>
          <input type="range" min={500000} max={10000000} step={100000} style={{ width: '100%', accentColor: 'var(--brand, #7B1828)' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--ink-muted, #6B6B6B)', fontFamily: "'Outfit', sans-serif", marginTop: 4 }}>
            <span>ZMW 500K</span><span>ZMW 10M+</span>
          </div>

          {/* Bedrooms */}
          <div style={sidebarHdg}>Bedrooms</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {BEDROOM_OPTIONS.map(b => (
              <button key={b} onClick={() => setSelectedBeds(prev => toggleSet(prev, b))} style={pillBtn(selectedBeds.includes(b))}>{b}</button>
            ))}
          </div>

          {/* Property Type */}
          <div style={sidebarHdg}>Property Type</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {PROP_TYPES.map(t => (
              <label key={t} className="amenity-check" style={{ color: 'var(--ink-muted, #6B6B6B)', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontFamily: "'Outfit', sans-serif" }}>
                <input type="checkbox" checked={selectedTypes.includes(t)} onChange={() => setSelectedTypes(prev => toggleSet(prev, t))} style={{ accentColor: 'var(--brand, #7B1828)', width: 14, height: 14, cursor: 'pointer' }} />
                {t.charAt(0) + t.slice(1).toLowerCase()}
              </label>
            ))}
          </div>

          {/* Status */}
          <div style={sidebarHdg}>Status</div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: 'var(--ink-muted, #6B6B6B)', fontFamily: "'Outfit', sans-serif" }}>
            <div style={{ width: 34, height: 18, background: statusFilter ? 'var(--brand, #7B1828)' : 'var(--border, #E0D9CE)', borderRadius: 9, position: 'relative', transition: 'background 0.2s', cursor: 'pointer', flexShrink: 0 }} onClick={() => setStatusFilter(v => !v)}>
              <div style={{ width: 12, height: 12, background: 'white', borderRadius: '50%', position: 'absolute', top: 3, left: statusFilter ? 19 : 3, transition: 'left 0.2s' }} />
            </div>
            Active, Under Offer
          </label>

          {/* Amenities */}
          <div style={sidebarHdg}>Amenities</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {AMENITIES.map(a => (
              <label key={a} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: 'var(--ink-muted, #6B6B6B)', fontFamily: "'Outfit', sans-serif" }}>
                <input type="checkbox" checked={selectedAmenities.includes(a)} onChange={() => setSelectedAmenities(prev => toggleSet(prev, a))} style={{ accentColor: 'var(--brand, #7B1828)', width: 14, height: 14, cursor: 'pointer' }} />
                {a}
              </label>
            ))}
          </div>

          {/* Utilities */}
          <div style={sidebarHdg}>Utilities</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {UTILITIES.map(u => (
              <label key={u} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: 'var(--ink-muted, #6B6B6B)', fontFamily: "'Outfit', sans-serif" }}>
                <input type="checkbox" checked={selectedUtilities.includes(u)} onChange={() => setSelectedUtilities(prev => toggleSet(prev, u))} style={{ accentColor: 'var(--brand, #7B1828)', width: 14, height: 14, cursor: 'pointer' }} />
                {u}
              </label>
            ))}
          </div>

          {/* Buyer Type */}
          <div style={sidebarHdg}>Buyer Type</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {BUYER_TYPES.map(b => (
              <label key={b} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: 'var(--ink-muted, #6B6B6B)', fontFamily: "'Outfit', sans-serif" }}>
                <input type="checkbox" checked={selectedBuyerTypes.includes(b)} onChange={() => setSelectedBuyerTypes(prev => toggleSet(prev, b))} style={{ accentColor: 'var(--brand, #7B1828)', width: 14, height: 14, cursor: 'pointer' }} />
                {b}
              </label>
            ))}
          </div>

          {/* Title Status */}
          <div style={sidebarHdg}>Title Status</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {TITLE_STATUS.map(t => (
              <label key={t} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: 'var(--ink-muted, #6B6B6B)', fontFamily: "'Outfit', sans-serif" }}>
                <input type="checkbox" checked={selectedTitleStatus.includes(t)} onChange={() => setSelectedTitleStatus(prev => toggleSet(prev, t))} style={{ accentColor: 'var(--brand, #7B1828)', width: 14, height: 14, cursor: 'pointer' }} />
                {t}
              </label>
            ))}
          </div>

          {/* Reset */}
          {(selectedBeds.length + selectedTypes.length + selectedAmenities.length + selectedUtilities.length + selectedBuyerTypes.length + selectedTitleStatus.length > 0) && (
            <button onClick={() => { setSelectedBeds([]); setSelectedTypes([]); setSelectedAmenities([]); setSelectedUtilities([]); setSelectedBuyerTypes([]); setSelectedTitleStatus([]); }}
              style={{ marginTop: 16, width: '100%', padding: '8px', background: 'none', border: '1.5px solid var(--border, #E0D9CE)', borderRadius: 4, fontSize: 13, color: 'var(--ink-muted, #6B6B6B)', cursor: 'pointer', fontFamily: "'Outfit', sans-serif" }}>
              Clear Filters
            </button>
          )}
        </aside>

        {/* RESULTS */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 14, color: 'var(--ink-muted, #6B6B6B)', marginBottom: 20 }}>
            {loading ? 'Loading...' : `Showing ${properties.length} verified ${properties.length === 1 ? 'listing' : 'listings'} across Zambia. All properties title-checked before publication.`}
          </p>

          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
              {[1,2,3,4,5,6].map(i => (
                <div key={i} style={{ background: 'white', borderRadius: 4, height: 340, animation: 'pulse 1.5s ease-in-out infinite', border: '1px solid var(--border, #E0D9CE)' }} />
              ))}
            </div>
          ) : properties.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 24px', background: 'white', borderRadius: 4, border: '1px solid var(--border, #E0D9CE)' }}>
              <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 22, fontWeight: 600, color: 'var(--ink, #1A1A1A)', marginBottom: 10 }}>No properties found</h3>
              <p style={{ color: 'var(--ink-muted, #6B6B6B)', fontSize: 14, maxWidth: 400, margin: '0 auto 24px', lineHeight: 1.65, fontFamily: "'Outfit', sans-serif" }}>
                We may have properties not yet listed publicly. Contact our team — we often match clients before listings go live.
              </p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                <button onClick={() => { setSelectedBeds([]); setSelectedTypes([]); setSelectedAmenities([]); setLocation(''); }} style={{ background: 'none', border: '1.5px solid var(--border, #E0D9CE)', color: 'var(--ink-muted, #6B6B6B)', padding: '9px 18px', borderRadius: 4, fontSize: 13, cursor: 'pointer', fontFamily: "'Outfit', sans-serif" }}>Clear Filters</button>
                <a href="/contact" style={{ background: 'var(--brand, #7B1828)', color: 'white', padding: '9px 18px', borderRadius: 4, fontSize: 13, fontWeight: 600, textDecoration: 'none', fontFamily: "'Outfit', sans-serif" }}>Contact Our Team</a>
              </div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
              {properties.map(p => <PropertyCard key={p.id} property={p} />)}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        @media (max-width: 1100px) {
          main > div[style*="flex"] > div[style*="grid-template-columns: 'repeat(3"] { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 820px) {
          main > div[style*="display: 'flex'"] { flex-direction: column !important; }
          aside { position: static !important; width: 100% !important; max-height: none !important; }
        }
        @media (max-width: 600px) {
          main > div > div > div[style*="repeat(3"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  );
}

export default function PropertiesPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Outfit', sans-serif", color: 'var(--ink-muted, #6B6B6B)', background: 'var(--cream, #F5F0E8)' }}>
        Loading properties...
      </div>
    }>
      <PropertiesContent />
    </Suspense>
  );
}
