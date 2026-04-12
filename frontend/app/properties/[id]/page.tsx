'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import PropertyCard from '../../../components/PropertyCard';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://done-space-backend-production.up.railway.app/api/v1';

function formatPrice(price: number) {
  if (!price) return 'Price on request';
  return `ZMW ${price.toLocaleString()}`;
}

function formatDate(dateStr: string) {
  if (!dateStr) return 'Recently listed';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
}

export default function PropertyDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [property, setProperty] = useState<any>(null);
  const [similar, setSimilar] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Inquiry form state
  const [form, setForm] = useState({ full_name: '', phone: '', email: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState('');

  const setField = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`${API}/properties/public/${id}`)
      .then(r => {
        if (!r.ok) throw new Error('Not found');
        return r.json();
      })
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
          full_name: form.full_name,
          phone: form.phone,
          email: form.email || undefined,
          source: 'website',
          interest_type: property?.listing_type === 'let' ? 'rent' : 'buy',
          notes: `${form.message} | Property: ${property?.title} | Ref: ${property?.reference_no || 'N/A'}`,
          property_id: id,
        }),
      });
      if (!res.ok) throw new Error('Submission failed');
      setSubmitted(true);
    } catch (e: any) {
      setFormError(e.message || 'Something went wrong.');
    }
    setSubmitting(false);
  };

  const inputStyle: any = {
    width: '100%', background: 'var(--surface-warm, #FAF7F4)', border: '1px solid var(--border, #E8DDD6)',
    color: 'var(--ink, #0F0A08)', padding: '11px 14px', borderRadius: 2, fontSize: 13.5, outline: 'none',
    fontFamily: 'Outfit, sans-serif', boxSizing: 'border-box',
  };
  const labelStyle: any = {
    display: 'block', color: 'var(--ink-muted, #8C7B72)', fontSize: 10.5, fontWeight: 600,
    letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6,
  };

  if (loading) {
    return (
      <main style={{ background: 'var(--cream, #F8F3ED)', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 70 }}>
        <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: 15, color: 'var(--ink-muted, #8C7B72)' }}>Loading property details...</p>
      </main>
    );
  }

  if (notFound || !property) {
    return (
      <main style={{ background: 'var(--cream, #F8F3ED)', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 70 }}>
        <div style={{ textAlign: 'center', padding: '60px 24px' }}>
          <h1 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 36, fontWeight: 600, color: 'var(--ink, #0F0A08)', marginBottom: 16 }}>Property Not Found</h1>
          <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: 15, color: 'var(--ink-muted, #8C7B72)', marginBottom: 28 }}>This listing may no longer be available.</p>
          <Link href="/properties" style={{ background: 'var(--brand, #7B1D2A)', color: 'white', padding: '12px 24px', borderRadius: 2, textDecoration: 'none', fontFamily: 'Outfit, sans-serif', fontSize: 14, fontWeight: 600 }}>Browse All Properties</Link>
        </div>
      </main>
    );
  }

  const p = property;
  const isLet = p.listing_type === 'let';
  const image = p.images?.[0];
  const waText = encodeURIComponent(`I am interested in "${p.title}". Please contact me.`);

  return (
    <main style={{ background: 'var(--cream, #F8F3ED)', paddingTop: 70 }}>
      {/* Breadcrumb */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '20px 24px' }}>
        <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: 13, color: 'var(--ink-muted, #8C7B72)' }}>
          <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link>
          <span style={{ margin: '0 8px' }}>→</span>
          <Link href="/properties" style={{ color: 'inherit', textDecoration: 'none' }}>Properties</Link>
          <span style={{ margin: '0 8px' }}>→</span>
          <span style={{ color: 'var(--ink, #0F0A08)' }}>{p.title}</span>
        </p>
      </div>

      {/* Main content */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px 96px', display: 'grid', gridTemplateColumns: '1fr 380px', gap: 48, alignItems: 'start' }}>

        {/* ─── LEFT COLUMN ─── */}
        <div>
          {/* Image */}
          <div style={{ position: 'relative', height: 400, overflow: 'hidden', background: 'linear-gradient(135deg, var(--brand-light, #F2E8EA) 0%, var(--cream, #F8F3ED) 100%)', borderRadius: 4, marginBottom: 32 }}>
            {image ? (
              <img src={image} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                <svg width="64" height="64" viewBox="0 0 40 40" fill="none" opacity="0.25">
                  <path d="M8 28L20 12L32 28" stroke="var(--brand, #7B1D2A)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M14 28V22C14 20.895 14.895 20 16 20H24C25.105 20 26 20.895 26 22V28" stroke="var(--brand, #7B1D2A)" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
                <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 12, color: 'var(--ink-muted, #8C7B72)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  {p.property_type || 'Property'}
                </span>
              </div>
            )}
            {/* Badges */}
            <div style={{ position: 'absolute', top: 0, left: 0, background: isLet ? 'var(--gold, #C4992A)' : 'var(--brand, #7B1D2A)', color: isLet ? 'var(--ink, #0F0A08)' : 'white', padding: '6px 14px', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'Outfit, sans-serif' }}>
              {isLet ? 'TO LET' : 'FOR SALE'}
            </div>
            {p.reference_no && (
              <div style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.6)', color: 'white', padding: '4px 10px', fontSize: 11, fontFamily: 'Outfit, sans-serif', borderRadius: 2 }}>
                Ref: {p.reference_no}
              </div>
            )}
          </div>

          {/* Header */}
          <h1 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 600, color: 'var(--ink, #0F0A08)', lineHeight: 1.15, marginBottom: 8 }}>
            {p.title}
          </h1>
          {(p.city || p.province) && (
            <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: 16, color: 'var(--ink-muted, #8C7B72)', marginBottom: 16 }}>
              {[p.city, p.province].filter(Boolean).join(', ')}
            </p>
          )}
          <div style={{ marginBottom: 32 }}>
            <span style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 48, fontWeight: 700, color: 'var(--brand, #7B1D2A)', lineHeight: 1 }}>
              {formatPrice(p.price)}
            </span>
            {isLet && <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 15, color: 'var(--ink-muted, #8C7B72)', marginLeft: 8 }}>/month</span>}
          </div>

          {/* Stats bar */}
          {(p.bedrooms != null || p.bathrooms != null || p.size_sqm || p.property_type) && (
            <div style={{ display: 'flex', gap: 0, background: 'white', border: '1px solid var(--border, #E8DDD6)', borderRadius: 4, marginBottom: 32, overflow: 'hidden' }}>
              {[
                p.bedrooms != null && { label: 'Bedrooms', value: p.bedrooms },
                p.bathrooms != null && { label: 'Bathrooms', value: p.bathrooms },
                p.size_sqm && { label: 'Size', value: `${p.size_sqm}m²` },
                p.property_type && { label: 'Type', value: p.property_type.charAt(0).toUpperCase() + p.property_type.slice(1) },
              ].filter(Boolean).map((stat: any, i, arr) => (
                <div key={i} style={{ flex: 1, textAlign: 'center', padding: '18px 12px', borderRight: i < arr.length - 1 ? '1px solid var(--border, #E8DDD6)' : 'none' }}>
                  <div style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 24, fontWeight: 700, color: 'var(--ink, #0F0A08)', lineHeight: 1 }}>{stat.value}</div>
                  <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 11, color: 'var(--ink-muted, #8C7B72)', letterSpacing: '0.06em', textTransform: 'uppercase', marginTop: 4 }}>{stat.label}</div>
                </div>
              ))}
            </div>
          )}

          {/* Description */}
          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 24, fontWeight: 600, color: 'var(--ink, #0F0A08)', marginBottom: 14 }}>About This Property</h2>
            <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: 15, color: 'var(--ink-secondary, #4A3830)', lineHeight: 1.8 }}>
              {p.description || 'Contact us for full property details.'}
            </p>
          </div>

          {/* Details table */}
          <div style={{ background: 'var(--cream, #F8F3ED)', border: '1px solid var(--border, #E8DDD6)', padding: '24px', borderRadius: 4, marginBottom: 24 }}>
            <h3 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 18, fontWeight: 600, color: 'var(--ink, #0F0A08)', marginBottom: 18 }}>Property Details</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                {[
                  { label: 'Reference', value: p.reference_no || 'Available on request' },
                  { label: 'Listing Type', value: isLet ? 'To Let' : 'For Sale' },
                  { label: 'Property Type', value: p.property_type ? p.property_type.charAt(0).toUpperCase() + p.property_type.slice(1) : '—' },
                  { label: 'Status', value: 'Published / Available' },
                  { label: 'Province', value: p.province || '—' },
                  { label: 'City', value: p.city || '—' },
                  { label: 'Listed', value: formatDate(p.created_at) },
                  { label: 'Mandate Type', value: p.mandate_type || 'Contact for details' },
                ].map((row, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--border, #E8DDD6)' }}>
                    <td style={{ padding: '10px 0', fontFamily: 'Outfit, sans-serif', fontSize: 13, color: 'var(--ink-muted, #8C7B72)', fontWeight: 600, width: '40%' }}>{row.label}</td>
                    <td style={{ padding: '10px 0', fontFamily: 'Outfit, sans-serif', fontSize: 13, color: 'var(--ink, #0F0A08)' }}>{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Verification badge */}
          <div style={{ background: 'var(--gold-pale, #FBF5E6)', border: '1px solid var(--gold, #C4992A)', padding: '16px 20px', borderRadius: 4 }}>
            <p style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 16, fontWeight: 600, color: 'var(--brand, #7B1D2A)', marginBottom: 6 }}>Verified Listing</p>
            <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: 13, color: 'var(--ink-secondary, #4A3830)', lineHeight: 1.6 }}>
              This property has been reviewed and verified by Done &amp; Space Properties before publication.
              {p.reference_no && ` Reference: ${p.reference_no}`}
            </p>
          </div>
        </div>

        {/* ─── RIGHT COLUMN — Sticky Inquiry Card ─── */}
        <div style={{ position: 'sticky', top: 90 }}>
          <div style={{ background: 'white', border: '1px solid var(--border, #E8DDD6)', borderRadius: 4, borderTop: '3px solid var(--brand, #7B1D2A)', boxShadow: 'var(--shadow-card, 0 2px 16px rgba(15,10,8,0.08))', padding: '28px' }}>
            <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 18, fontWeight: 600, color: 'var(--ink, #0F0A08)', marginBottom: 6 }}>Interested in This Property?</h3>
            <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: 14, color: 'var(--ink-muted, #8C7B72)', marginBottom: 24 }}>Send us a message and we will arrange a viewing.</p>

            {submitted ? (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#f0fdf4', border: '1px solid #86efac', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                  <span style={{ color: '#22c55e', fontSize: 20 }}>✓</span>
                </div>
                <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: 15, fontWeight: 600, color: 'var(--ink, #0F0A08)', marginBottom: 6 }}>Inquiry Sent!</p>
                <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: 13.5, color: 'var(--ink-muted, #8C7B72)' }}>We will contact you within 24 hours.</p>
              </div>
            ) : (
              <>
                {formError && <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '10px 14px', borderRadius: 2, marginBottom: 14, fontSize: 13 }}>{formError}</div>}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div><label style={labelStyle}>Full Name *</label><input style={inputStyle} value={form.full_name} onChange={e => setField('full_name', e.target.value)} placeholder="Your full name" /></div>
                  <div><label style={labelStyle}>Phone *</label><input style={inputStyle} value={form.phone} onChange={e => setField('phone', e.target.value)} placeholder="+260..." /></div>
                  <div><label style={labelStyle}>Email</label><input type="email" style={inputStyle} value={form.email} onChange={e => setField('email', e.target.value)} placeholder="your@email.com" /></div>
                  <div>
                    <label style={labelStyle}>Message</label>
                    <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: 80 }} value={form.message} onChange={e => setField('message', e.target.value)} />
                  </div>
                  <button onClick={submitInquiry} disabled={submitting} style={{ background: 'var(--brand, #7B1D2A)', color: 'white', border: 'none', padding: '13px', borderRadius: 2, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'Outfit, sans-serif', opacity: submitting ? 0.7 : 1, width: '100%' }}>
                    {submitting ? 'Sending...' : 'Send Inquiry'}
                  </button>
                </div>
              </>
            )}

            <div style={{ borderTop: '1px solid var(--border, #E8DDD6)', marginTop: 20, paddingTop: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <a href={`https://wa.me/260971000000?text=${waText}`} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#25D366', color: 'white', padding: '11px', borderRadius: 2, fontFamily: 'Outfit, sans-serif', fontSize: 13.5, fontWeight: 600, textDecoration: 'none' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                WhatsApp About This Property
              </a>
              <a href="tel:+260971000000" style={{ display: 'block', textAlign: 'center', fontFamily: 'Outfit, sans-serif', fontSize: 14, color: 'var(--brand, #7B1D2A)', textDecoration: 'none', fontWeight: 500 }}>
                Or call: +260 971 000 000
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Similar properties */}
      {similar.length > 0 && (
        <section style={{ background: 'var(--surface-warm, #FAF7F4)', padding: '64px 24px' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto' }}>
            <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 32, fontWeight: 600, color: 'var(--ink, #0F0A08)', marginBottom: 36 }}>Similar Properties</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
              {similar.map(sp => <PropertyCard key={sp.id} property={sp} />)}
            </div>
          </div>
        </section>
      )}

      <style>{`
        @media (max-width: 900px) {
          main > div[style*="1fr 380px"] { grid-template-columns: 1fr !important; }
          main > div[style*="1fr 380px"] > div:last-child { position: static !important; }
          section > div > div[style*="repeat(3, 1fr)"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  );
}
