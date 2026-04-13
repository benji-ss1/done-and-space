'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import PropertyCard from '../../../components/PropertyCard';
import Logo from '../../../components/Logo';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://done-space-backend-production.up.railway.app/api/v1';

const AMENITIES_LIST = ['Pool', 'Gym', 'Parking', 'Balcony', 'Garden', 'Boardroom', 'Generator', 'Security System', 'Borehole', 'Solar Panels'];

function formatPrice(price: number, isLet: boolean) {
  if (!price) return 'Price on request';
  const formatted = `ZMW ${price.toLocaleString()}`;
  return isLet ? `${formatted} / month` : formatted;
}
function formatDate(dateStr: string) {
  if (!dateStr) return 'Recently listed';
  return new Date(dateStr).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
}

const inputStyle: React.CSSProperties = {
  width: '100%', background: 'white', border: '1.5px solid var(--border, #E0D9CE)',
  color: 'var(--ink, #1A1A1A)', padding: '10px 14px', borderRadius: 4, fontSize: 14,
  outline: 'none', fontFamily: "'Outfit', sans-serif", boxSizing: 'border-box',
};
const labelStyle: React.CSSProperties = {
  display: 'block', color: 'var(--ink-muted, #6B6B6B)', fontSize: 10.5, fontWeight: 600,
  letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6, fontFamily: "'Outfit', sans-serif",
};

export default function PropertyDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [property, setProperty] = useState<any>(null);
  const [similar, setSimilar] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const [activeTab, setActiveTab] = useState<'description' | 'map' | 'tour' | 'contact'>('description');

  const [form, setForm] = useState({ full_name: '', phone: '', email: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState('');
  const setField = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`${API}/properties/public/${id}`)
      .then(r => { if (!r.ok) throw new Error('Not found'); return r.json(); })
      .then(data => {
        setProperty(data);
        setForm(f => ({ ...f, message: `I am interested in "${data.title}". Please contact me to arrange a viewing.` }));
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));

    fetch(`${API}/properties?status=published&limit=9`)
      .then(r => r.json())
      .then(data => {
        const list = Array.isArray(data) ? data : (data.data || data.properties || []);
        setSimilar(list.filter((p: any) => p.id !== id).slice(0, 3));
      })
      .catch(() => {});
  }, [id]);

  const submitInquiry = async () => {
    if (!form.full_name.trim() || !form.phone.trim()) { setFormError('Name and phone are required.'); return; }
    setSubmitting(true); setFormError('');
    try {
      const res = await fetch(`${API}/leads/inquiry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: form.full_name, phone: form.phone, email: form.email || undefined,
          source: 'website', interest_type: property?.listing_type === 'let' ? 'rent' : 'buy',
          notes: `${form.message} | Property: ${property?.title} | Ref: ${property?.reference_no || 'N/A'}`,
          property_id: id,
        }),
      });
      if (!res.ok) throw new Error('Submission failed');
      setSubmitted(true);
    } catch (e: any) { setFormError(e.message || 'Something went wrong.'); }
    setSubmitting(false);
  };

  if (loading) return (
    <main style={{ background: 'var(--cream, #F5F0E8)', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 72 }}>
      <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 15, color: 'var(--ink-muted, #6B6B6B)' }}>Loading property details...</p>
    </main>
  );

  if (notFound || !property) return (
    <main style={{ background: 'var(--cream, #F5F0E8)', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 72 }}>
      <div style={{ textAlign: 'center', padding: '60px 24px' }}>
        <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 36, fontWeight: 600, color: 'var(--ink, #1A1A1A)', marginBottom: 16 }}>Property Not Found</h1>
        <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 15, color: 'var(--ink-muted, #6B6B6B)', marginBottom: 28 }}>This listing may no longer be available.</p>
        <Link href="/properties" style={{ background: 'var(--brand, #7B1828)', color: 'white', padding: '12px 24px', borderRadius: 4, textDecoration: 'none', fontFamily: "'Outfit', sans-serif", fontSize: 14, fontWeight: 600 }}>Browse All Properties</Link>
      </div>
    </main>
  );

  const p = property;
  const isLet = p.listing_type === 'let';
  const images: string[] = p.images || [];
  const mainImg = images[activeImg] || null;
  const waText = encodeURIComponent(`I am interested in "${p.title}". Please contact me.`);

  return (
    <main style={{ background: 'var(--cream, #F5F0E8)', paddingTop: 72 }}>

      {/* ─── SEARCH STRIP (matches properties page) ─── */}
      <div style={{ background: 'var(--brand, #7B1828)', padding: '14px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
        <div style={{ display: 'flex', gap: 4, background: 'rgba(0,0,0,0.20)', borderRadius: 4, padding: 3 }}>
          {(['For Sale', 'To Let'] as const).map(t => (
            <div key={t} style={{ padding: '7px 18px', borderRadius: 3, fontSize: 13, fontWeight: 600, fontFamily: "'Outfit', sans-serif", background: t === (isLet ? 'To Let' : 'For Sale') ? 'white' : 'transparent', color: t === (isLet ? 'To Let' : 'For Sale') ? 'var(--brand, #7B1828)' : 'rgba(255,255,255,0.6)' }}>{t}</div>
          ))}
        </div>
        <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 13, fontFamily: "'Outfit', sans-serif" }}>
          Return to your search or <Link href="/properties" style={{ color: 'var(--gold, #C9A84C)', textDecoration: 'underline' }}>refine below</Link>
        </p>
      </div>

      {/* ─── PAGE TITLE ─── */}
      <div style={{ background: 'white', borderBottom: '1px solid var(--border, #E0D9CE)', padding: '20px 40px' }}>
        <div style={{ maxWidth: 1340, margin: '0 auto' }}>
          <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, color: 'var(--ink-muted, #6B6B6B)', marginBottom: 8 }}>
            <Link href="/" style={{ color: 'inherit' }}>Home</Link>
            <span style={{ margin: '0 8px' }}>›</span>
            <Link href="/properties" style={{ color: 'inherit' }}>Properties</Link>
            <span style={{ margin: '0 8px' }}>›</span>
            <span style={{ color: 'var(--ink, #1A1A1A)' }}>{p.title}</span>
          </p>
          <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 700, color: 'var(--ink, #1A1A1A)', lineHeight: 1.2 }}>{p.title}</h1>
          {p.reference_no && (
            <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 14, color: 'var(--ink-muted, #6B6B6B)', marginTop: 4 }}>(Ref: {p.reference_no})</p>
          )}
        </div>
      </div>

      {/* ─── THREE-PANEL LAYOUT ─── */}
      <div style={{ maxWidth: 1340, margin: '0 auto', padding: '28px 24px 80px', display: 'grid', gridTemplateColumns: '200px 1fr 280px', gap: 24, alignItems: 'start' }}>

        {/* ─── LEFT: Quick Specs ─── */}
        <aside style={{ background: 'white', border: '1px solid var(--border, #E0D9CE)', borderRadius: 4, padding: '20px', position: 'sticky', top: 90, fontSize: 13 }}>
          <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 15, fontWeight: 600, color: 'var(--ink, #1A1A1A)', marginBottom: 14 }}>Property Quick Specs</h3>

          <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted, #6B6B6B)', marginBottom: 10 }}>Amenities</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginBottom: 20 }}>
            {AMENITIES_LIST.map(a => (
              <label key={a} style={{ display: 'flex', alignItems: 'center', gap: 7, cursor: 'default', color: 'var(--ink-muted, #6B6B6B)', fontFamily: "'Outfit', sans-serif", fontSize: 13 }}>
                <input type="checkbox" readOnly style={{ accentColor: 'var(--brand, #7B1828)', width: 13, height: 13 }} />
                {a}
              </label>
            ))}
          </div>

          <div style={{ borderTop: '1px solid var(--border, #E0D9CE)', paddingTop: 14 }}>
            <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted, #6B6B6B)', marginBottom: 8 }}>Status</div>
            <div style={{ fontSize: 12, color: 'var(--ink, #1A1A1A)', fontFamily: "'Outfit', sans-serif", fontWeight: 500 }}>Active, Under Offer</div>
          </div>
        </aside>

        {/* ─── CENTER: Image + Details ─── */}
        <div style={{ minWidth: 0 }}>
          {/* Main image */}
          <div style={{ position: 'relative', height: 420, overflow: 'hidden', background: 'linear-gradient(135deg, var(--brand, #7B1828) 0%, var(--brand-dark, #5C1220) 100%)', borderRadius: 4, marginBottom: 10 }}>
            {mainImg ? (
              <img src={mainImg} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                <svg width="80" height="80" viewBox="0 0 50 42" fill="none" opacity="0.30">
                  <path d="M 4 28 C 10 18, 20 14, 28 18 C 36 22, 42 14, 46 10" stroke="white" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
                  <path d="M 4 35 C 10 25, 20 21, 28 25 C 36 29, 42 21, 46 17" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.45"/>
                </svg>
                <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                  {p.property_type || 'Property'}
                </span>
              </div>
            )}
            {/* Badges */}
            <div style={{ position: 'absolute', top: 0, left: 0, background: isLet ? 'var(--gold, #C9A84C)' : 'var(--brand, #7B1828)', color: isLet ? 'var(--ink, #1A1A1A)' : 'white', padding: '6px 14px', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: "'Outfit', sans-serif" }}>
              {isLet ? 'TO LET' : 'FOR SALE'}
            </div>
            {p.reference_no && (
              <div style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.60)', color: 'white', padding: '4px 10px', fontSize: 11, fontFamily: "'Outfit', sans-serif", borderRadius: 3 }}>
                {p.reference_no}
              </div>
            )}
            {/* Arrow nav */}
            {images.length > 1 && (
              <>
                <button onClick={() => setActiveImg(i => (i - 1 + images.length) % images.length)} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.50)', border: 'none', color: 'white', width: 36, height: 36, borderRadius: '50%', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>‹</button>
                <button onClick={() => setActiveImg(i => (i + 1) % images.length)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.50)', border: 'none', color: 'white', width: 36, height: 36, borderRadius: '50%', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>›</button>
              </>
            )}
          </div>

          {/* Thumbnail strip */}
          {images.length > 1 && (
            <div style={{ display: 'flex', gap: 8, marginBottom: 20, overflowX: 'auto', paddingBottom: 4 }}>
              {images.slice(0, 6).map((img, i) => (
                <div key={i} onClick={() => setActiveImg(i)} style={{ width: 80, height: 56, flexShrink: 0, borderRadius: 4, overflow: 'hidden', cursor: 'pointer', border: `2.5px solid ${activeImg === i ? 'var(--brand, #7B1828)' : 'transparent'}`, transition: 'border-color 0.15s' }}>
                  <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          )}

          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: '2px solid var(--border, #E0D9CE)', marginBottom: 24, overflowX: 'auto' }}>
            {([['description', 'Description'], ['map', 'Map & Area'], ['tour', 'Virtual Tour'], ['contact', 'Contact Agent']] as const).map(([key, label]) => (
              <button key={key} onClick={() => setActiveTab(key)} className={`prop-tab${activeTab === key ? ' active' : ''}`}>
                {label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          {activeTab === 'description' && (
            <div>
              {/* Specs list */}
              <div style={{ marginBottom: 24 }}>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[
                    p.bedrooms != null   && `Bedrooms: ${p.bedrooms}`,
                    p.bathrooms != null  && `Bathrooms: ${p.bathrooms}`,
                    p.size_sqm           && `Size: ${p.size_sqm} sqm`,
                    p.price              && `${isLet ? 'Rental' : 'Asking Price'}: ZMW ${p.price.toLocaleString()}${isLet ? '/month' : ''}`,
                    p.status             && 'Active, Under Offer',
                  ].filter(Boolean).map((item, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: "'Outfit', sans-serif", fontSize: 14, color: 'var(--ink-muted, #6B6B6B)' }}>
                      <span style={{ width: 6, height: 6, background: 'var(--brand, #7B1828)', borderRadius: '50%', flexShrink: 0 }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Description */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'start' }}>
                <div>
                  <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 18, fontWeight: 600, color: 'var(--ink, #1A1A1A)', marginBottom: 12 }}>About This Property</h3>
                  <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 14, color: 'var(--ink-muted, #6B6B6B)', lineHeight: 1.8 }}>
                    {p.description || 'This exceptional property delivers modern architecture with superior finishes throughout. Set in one of Lusaka\'s most sought-after addresses, the development features high-specification interiors, generous living space, and direct access to premier amenities.'}
                  </p>
                </div>

                {/* Inline contact form */}
                <div style={{ background: 'var(--cream, #F5F0E8)', border: '1px solid var(--border, #E0D9CE)', borderRadius: 4, padding: '20px' }}>
                  {submitted ? (
                    <div style={{ textAlign: 'center', padding: '16px 0' }}>
                      <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 16, fontWeight: 600, color: 'var(--brand, #7B1828)', marginBottom: 6 }}>Inquiry Sent!</p>
                      <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, color: 'var(--ink-muted, #6B6B6B)' }}>We will contact you within the hour.</p>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <input style={inputStyle} value={form.full_name} onChange={e => setField('full_name', e.target.value)} placeholder="Name" />
                      <input type="email" style={inputStyle} value={form.email} onChange={e => setField('email', e.target.value)} placeholder="Email" />
                      <input style={inputStyle} value={form.phone} onChange={e => setField('phone', e.target.value)} placeholder="Phone" />
                      <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: 70 }} value={form.message} onChange={e => setField('message', e.target.value)} placeholder="Message" />
                      {formError && <p style={{ color: '#dc2626', fontSize: 13, fontFamily: "'Outfit', sans-serif" }}>{formError}</p>}
                      <button onClick={submitInquiry} disabled={submitting} style={{ background: 'var(--brand, #7B1828)', color: 'white', border: 'none', padding: '11px', borderRadius: 4, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: "'Outfit', sans-serif", opacity: submitting ? 0.7 : 1 }}>
                        {submitting ? 'Sending...' : 'Send Inquiry'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'map' && (
            <div style={{ background: 'var(--cream, #F5F0E8)', border: '1px solid var(--border, #E0D9CE)', borderRadius: 4, padding: 24, textAlign: 'center', minHeight: 200 }}>
              <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 14, color: 'var(--ink-muted, #6B6B6B)', marginBottom: 8 }}>
                {[p.city, p.province, 'Zambia'].filter(Boolean).join(', ')}
              </p>
              <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, color: 'var(--ink-muted, #6B6B6B)' }}>Map view available on request. Contact us for exact location details.</p>
            </div>
          )}

          {activeTab === 'tour' && (
            <div style={{ background: 'var(--cream, #F5F0E8)', border: '1px solid var(--border, #E0D9CE)', borderRadius: 4, padding: 24, textAlign: 'center', minHeight: 200 }}>
              <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 14, color: 'var(--ink-muted, #6B6B6B)' }}>Virtual tour available on request. Contact our team to schedule a viewing.</p>
              <a href={`https://wa.me/260971000000?text=${waText}`} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', marginTop: 16, background: '#25D366', color: 'white', padding: '10px 20px', borderRadius: 4, fontFamily: "'Outfit', sans-serif", fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>Request a Virtual Tour</a>
            </div>
          )}

          {activeTab === 'contact' && (
            <div style={{ maxWidth: 400 }}>
              {submitted ? (
                <div style={{ textAlign: 'center', padding: '24px 0' }}>
                  <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 18, fontWeight: 600, color: 'var(--brand, #7B1828)', marginBottom: 8 }}>Inquiry Sent!</p>
                  <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 14, color: 'var(--ink-muted, #6B6B6B)' }}>We will contact you within the hour.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div><label style={labelStyle}>Full Name *</label><input style={inputStyle} value={form.full_name} onChange={e => setField('full_name', e.target.value)} placeholder="Your full name" /></div>
                  <div><label style={labelStyle}>Phone *</label><input style={inputStyle} value={form.phone} onChange={e => setField('phone', e.target.value)} placeholder="+260..." /></div>
                  <div><label style={labelStyle}>Email</label><input type="email" style={inputStyle} value={form.email} onChange={e => setField('email', e.target.value)} placeholder="your@email.com" /></div>
                  <div><label style={labelStyle}>Message</label><textarea style={{ ...inputStyle, resize: 'vertical', minHeight: 80 }} value={form.message} onChange={e => setField('message', e.target.value)} /></div>
                  {formError && <p style={{ color: '#dc2626', fontSize: 13, fontFamily: "'Outfit', sans-serif" }}>{formError}</p>}
                  <button onClick={submitInquiry} disabled={submitting} style={{ background: 'var(--brand, #7B1828)', color: 'white', border: 'none', padding: '12px', borderRadius: 4, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: "'Outfit', sans-serif", opacity: submitting ? 0.7 : 1 }}>
                    {submitting ? 'Sending...' : 'Send Inquiry'}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Property details table */}
          <div style={{ background: 'white', border: '1px solid var(--border, #E0D9CE)', borderRadius: 4, padding: '24px', marginTop: 32 }}>
            <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 18, fontWeight: 600, color: 'var(--ink, #1A1A1A)', marginBottom: 18 }}>Property Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
              {[
                { label: 'Reference No.', value: p.reference_no || '—' },
                { label: 'Listing Type',  value: isLet ? 'To Let' : 'For Sale' },
                { label: 'Property Type', value: p.property_type ? p.property_type.charAt(0).toUpperCase() + p.property_type.slice(1) : '—' },
                { label: 'Bedrooms',      value: p.bedrooms != null ? p.bedrooms : '—' },
                { label: 'Bathrooms',     value: p.bathrooms != null ? p.bathrooms : '—' },
                { label: 'Floor Size',    value: p.size_sqm ? `${p.size_sqm}m²` : '—' },
                { label: 'Province',      value: p.province || '—' },
                { label: 'City',          value: p.city || 'Lusaka, Zambia' },
                { label: 'Listed',        value: formatDate(p.created_at) },
                { label: 'Mandate',       value: p.mandate_type || 'Available on request' },
              ].map((row, i) => (
                <div key={i} style={{ borderBottom: '1px solid var(--border, #E0D9CE)', padding: '10px 0', paddingRight: i % 2 === 0 ? 20 : 0 }}>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 11, fontWeight: 700, color: 'var(--ink-muted, #6B6B6B)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 3 }}>{row.label}</div>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 14, color: 'var(--ink, #1A1A1A)' }}>{row.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Verification badge */}
          <div style={{ background: 'var(--gold-pale, #FBF6EC)', border: '1px solid var(--gold, #C9A84C)', padding: '16px 20px', borderRadius: 4, marginTop: 20, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
              <path d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-.44 3.896 3.745 3.745 0 01-3.896.44A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.896-.44 3.745 3.745 0 01-.44-3.896A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 01.44-3.896 3.745 3.745 0 013.896-.44A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.896.44 3.746 3.746 0 01.44 3.896A3.746 3.746 0 0121 12z" stroke="var(--gold, #C9A84C)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div>
              <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 15, fontWeight: 600, color: 'var(--brand, #7B1828)', marginBottom: 4 }}>Verified Listing</p>
              <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, color: 'var(--ink-muted, #6B6B6B)', lineHeight: 1.6 }}>
                This property has been reviewed and approved by Done &amp; Space Properties before publication.{p.reference_no && ` Reference: ${p.reference_no}`}
              </p>
            </div>
          </div>
        </div>

        {/* ─── RIGHT: Contact card + Related ─── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, position: 'sticky', top: 90 }}>

          {/* Price + Inquiry card */}
          <div style={{ background: 'white', border: '1px solid var(--border, #E0D9CE)', borderRadius: 4, borderTop: '3px solid var(--brand, #7B1828)', boxShadow: 'var(--shadow-card, 0 2px 16px rgba(123,24,40,0.08))' }}>
            {/* Agent header — real logo, light variant on dark bg */}
            <div style={{ background: 'var(--brand, #7B1828)', padding: '16px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <Logo variant="light" width={120} />
              {p.reference_no && <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.60)', marginTop: 6 }}>({p.reference_no})</p>}
              <div style={{ width: '100%', height: 1, background: 'rgba(255,255,255,0.15)', marginTop: 12 }} />
            </div>

            <div style={{ padding: '20px' }}>
              {/* Price */}
              <div style={{ textAlign: 'center', marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid var(--border, #E0D9CE)' }}>
                <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 28, fontWeight: 700, color: 'var(--brand, #7B1828)' }}>
                  {formatPrice(p.price, isLet)}
                </span>
              </div>

              {/* Schedule viewing */}
              <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 15, fontWeight: 600, color: 'var(--ink, #1A1A1A)', marginBottom: 14 }}>Schedule a Viewing</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
                <input type="date" style={{ ...inputStyle, background: 'var(--cream, #F5F0E8)' }} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <select style={{ ...inputStyle, background: 'var(--cream, #F5F0E8)', cursor: 'pointer' }}>
                    <option>Sun</option><option>Mon</option><option>Tue</option><option>Wed</option><option>Thu</option><option>Fri</option><option>Sat</option>
                  </select>
                  <select style={{ ...inputStyle, background: 'var(--cream, #F5F0E8)', cursor: 'pointer' }}>
                    <option>Morning</option><option>Afternoon</option><option>Evening</option>
                  </select>
                </div>
              </div>

              <button onClick={() => setActiveTab('contact')} style={{ width: '100%', background: 'var(--brand, #7B1828)', color: 'white', border: 'none', padding: '11px', borderRadius: 4, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: "'Outfit', sans-serif", marginBottom: 8 }}>
                Request Details
              </button>
              <button onClick={() => setActiveTab('description')} style={{ width: '100%', background: 'transparent', color: 'var(--brand, #7B1828)', border: '1.5px solid var(--brand, #7B1828)', padding: '10px', borderRadius: 4, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: "'Outfit', sans-serif", marginBottom: 14 }}>
                Details
              </button>

              {/* WhatsApp */}
              <a href={`https://wa.me/260971000000?text=${waText}`} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--cream, #F5F0E8)', border: '1px solid var(--border, #E0D9CE)', borderRadius: 4, padding: '12px 14px', textDecoration: 'none' }}>
                <div style={{ width: 36, height: 36, background: '#25D366', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                </div>
                <div>
                  <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 12, fontWeight: 600, color: 'var(--ink, #1A1A1A)', marginBottom: 2 }}>Chat with Done &amp; Space Agent</p>
                  <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 11, color: 'var(--ink-muted, #6B6B6B)' }}>Clear information and responsive communication are part of our operational discipline.</p>
                </div>
              </a>
            </div>
          </div>

          {/* Related listings */}
          {similar.length > 0 && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 16, fontWeight: 600, color: 'var(--ink, #1A1A1A)' }}>Related Listings</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {similar.slice(0, 2).map(sp => (
                  <div key={sp.id} style={{ background: 'white', border: '1px solid var(--border, #E0D9CE)', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ height: 100, background: sp.images?.[0] ? 'none' : 'linear-gradient(135deg, #7B1828, #5C1220)', position: 'relative' }}>
                      {sp.images?.[0] ? <img src={sp.images[0]} alt={sp.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : null}
                      <div style={{ position: 'absolute', top: 0, left: 0, background: sp.listing_type === 'let' ? 'var(--gold, #C9A84C)' : 'var(--brand, #7B1828)', color: sp.listing_type === 'let' ? 'var(--ink, #1A1A1A)' : 'white', padding: '3px 8px', fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: "'Outfit', sans-serif" }}>
                        {sp.listing_type === 'let' ? 'TO LET' : 'FOR SALE'}
                      </div>
                    </div>
                    <div style={{ padding: '10px 12px' }}>
                      <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 13, fontWeight: 600, color: 'var(--ink, #1A1A1A)', marginBottom: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{sp.title}</p>
                      {sp.reference_no && <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 11, color: 'var(--ink-muted, #6B6B6B)', marginBottom: 6 }}>({sp.reference_no})</p>}
                      {(sp.bedrooms != null || sp.bathrooms != null || sp.size_sqm) && <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 11, color: 'var(--ink-muted, #6B6B6B)', marginBottom: 4 }}>{[sp.bedrooms != null ? `${sp.bedrooms} Bed` : null, sp.bathrooms != null ? `${sp.bathrooms} Bath` : null, sp.size_sqm ? `${sp.size_sqm} sq²` : null].filter(Boolean).join(', ')}</p>}
                      {sp.price && <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 14, fontWeight: 700, color: 'var(--brand, #7B1828)', marginBottom: 8 }}>ZMW {sp.price.toLocaleString()}</p>}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                        <Link href={`/properties/${sp.id}`} style={{ display: 'block', textAlign: 'center', background: 'transparent', border: '1.5px solid var(--brand, #7B1828)', color: 'var(--brand, #7B1828)', padding: '6px', borderRadius: 3, fontSize: 11, fontWeight: 600, textDecoration: 'none', fontFamily: "'Outfit', sans-serif" }}>View Details</Link>
                        <a href="#" onClick={e => e.preventDefault()} style={{ display: 'block', textAlign: 'center', background: 'var(--brand, #7B1828)', color: 'white', padding: '6px', borderRadius: 3, fontSize: 11, fontWeight: 600, textDecoration: 'none', fontFamily: "'Outfit', sans-serif" }}>Book Viewing</a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 1100px) {
          main > div[style*="repeat(3,"] { grid-template-columns: 1fr !important; }
          main > div[style*="200px 1fr 280px"] { grid-template-columns: 1fr !important; }
          aside { position: static !important; }
          main > div[style*="200px 1fr 280px"] > div:last-child { position: static !important; }
        }
      `}</style>
    </main>
  );
}
