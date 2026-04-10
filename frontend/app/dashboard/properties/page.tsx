'use client';
import { useEffect, useState } from 'react';
import { apiFetch } from '../../../lib/api';

const statusColor: any = {
  draft: '#5a4d50',
  pending_review: '#f5a623',
  approved: '#3b82f6',
  published: '#22c55e',
  rejected: '#ef4444',
  archived: '#5a4d50',
};

const PROVINCES = ['Lusaka','Copperbelt','Central','Eastern','Luapula','Muchinga','Northern','North-Western','Southern','Western'];

export default function PropertiesPage() {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '',
    listing_type: 'for_sale',
    property_type: 'house',
    description: '',
    price: '',
    size_sqm: '',
    bedrooms: '',
    bathrooms: '',
    address: '',
    city: '',
    province: 'Lusaka',
    mandate_type: 'exclusive',
    mandate_expiry: '',
  });

  useEffect(() => { loadProperties(); }, []);

  const loadProperties = async () => {
    setLoading(true);
    try {
      const res = await apiFetch('/properties');
      setProperties(res.data || []);
    } catch (e) {
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!form.title || !form.price || !form.city) {
      setError('Title, price, and city are required.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const payload: any = {
        title: form.title,
        listing_type: form.listing_type,
        property_type: form.property_type,
        price: parseFloat(form.price),
        city: form.city,
      };
      if (form.description) payload.description = form.description;
      if (form.address) payload.address = form.address;
      if (form.province) payload.province = form.province;
      if (form.bedrooms) payload.bedrooms = parseInt(form.bedrooms);
      if (form.bathrooms) payload.bathrooms = parseInt(form.bathrooms);
      if (form.size_sqm) payload.size_sqm = parseFloat(form.size_sqm);
      if (form.mandate_type) payload.mandate_type = form.mandate_type;
      if (form.mandate_expiry) payload.mandate_expiry = form.mandate_expiry;

      await apiFetch('/properties', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      setShowForm(false);
      setForm({ title: '', listing_type: 'for_sale', property_type: 'house', description: '', price: '', size_sqm: '', bedrooms: '', bathrooms: '', address: '', city: '', province: 'Lusaka', mandate_type: 'exclusive', mandate_expiry: '' });
      loadProperties();
    } catch (e: any) {
      setError(e.message || 'Failed to create property');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAction = async (id: string, action: string) => {
    try {
      await apiFetch(`/properties/${id}/${action}`, { method: 'PATCH' });
      loadProperties();
    } catch (e: any) {
      alert(e.message);
    }
  };

  const inp: any = {
    width: '100%',
    background: 'var(--bg-elevated)',
    border: '1px solid var(--border-light)',
    color: 'var(--text-primary)',
    padding: '10px 13px',
    borderRadius: 8,
    fontSize: 13.5,
    outline: 'none',
    fontFamily: 'Outfit, sans-serif',
    boxSizing: 'border-box',
  };
  const lbl: any = { display: 'block', color: 'var(--text-secondary)', fontSize: 11.5, fontWeight: 500, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)' }}>Properties</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 2 }}>Manage all listings — {properties.length} total</p>
        </div>
        <button onClick={() => { setShowForm(true); setError(''); }} style={{ background: '#8B1A2F', color: 'white', border: 'none', padding: '10px 22px', borderRadius: 9, fontSize: 13.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>
          + New Property
        </button>
      </div>

      {/* MODAL */}
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 16, padding: 32, width: '100%', maxWidth: 580, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ color: 'var(--text-primary)', fontSize: 17, fontWeight: 700 }}>New Property Listing</h2>
              <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 22, lineHeight: 1 }}>×</button>
            </div>

            {error && (
              <div style={{ background: '#ef444415', border: '1px solid #ef444430', color: '#f87171', padding: '10px 14px', borderRadius: 8, marginBottom: 20, fontSize: 13 }}>{error}</div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {/* Title */}
              <div>
                <label style={lbl}>Property Title *</label>
                <input style={inp} value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="e.g. 3 Bedroom House in Kabulonga" />
              </div>

              {/* Type row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label style={lbl}>Listing Type *</label>
                  <select style={inp} value={form.listing_type} onChange={e => setForm({...form, listing_type: e.target.value})}>
                    <option value="for_sale">For Sale</option>
                    <option value="to_let">To Let</option>
                  </select>
                </div>
                <div>
                  <label style={lbl}>Property Type *</label>
                  <select style={inp} value={form.property_type} onChange={e => setForm({...form, property_type: e.target.value})}>
                    <option value="house">House</option>
                    <option value="apartment">Apartment</option>
                    <option value="land">Land</option>
                    <option value="commercial">Commercial</option>
                    <option value="office">Office</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label style={lbl}>Description</label>
                <textarea style={{...inp, minHeight: 80, resize: 'vertical'}} value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Describe the property..." />
              </div>

              {/* Price + Size */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label style={lbl}>Price (ZMW) *</label>
                  <input style={inp} type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} placeholder="450000" />
                </div>
                <div>
                  <label style={lbl}>Size (m²)</label>
                  <input style={inp} type="number" value={form.size_sqm} onChange={e => setForm({...form, size_sqm: e.target.value})} placeholder="180" />
                </div>
              </div>

              {/* Beds + Baths */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label style={lbl}>Bedrooms</label>
                  <input style={inp} type="number" value={form.bedrooms} onChange={e => setForm({...form, bedrooms: e.target.value})} />
                </div>
                <div>
                  <label style={lbl}>Bathrooms</label>
                  <input style={inp} type="number" value={form.bathrooms} onChange={e => setForm({...form, bathrooms: e.target.value})} />
                </div>
              </div>

              {/* Address */}
              <div>
                <label style={lbl}>Street Address</label>
                <input style={inp} value={form.address} onChange={e => setForm({...form, address: e.target.value})} placeholder="15 Kabulonga Road" />
              </div>

              {/* City + Province */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label style={lbl}>City / Area *</label>
                  <input style={inp} value={form.city} onChange={e => setForm({...form, city: e.target.value})} placeholder="Lusaka" />
                </div>
                <div>
                  <label style={lbl}>Province</label>
                  <select style={inp} value={form.province} onChange={e => setForm({...form, province: e.target.value})}>
                    {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>

              {/* Mandate */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label style={lbl}>Mandate Type</label>
                  <select style={inp} value={form.mandate_type} onChange={e => setForm({...form, mandate_type: e.target.value})}>
                    <option value="exclusive">Exclusive</option>
                    <option value="open">Open</option>
                    <option value="sole">Sole</option>
                  </select>
                </div>
                <div>
                  <label style={lbl}>Mandate Expiry</label>
                  <input style={inp} type="date" value={form.mandate_expiry} onChange={e => setForm({...form, mandate_expiry: e.target.value})} />
                </div>
              </div>

              {/* Submit */}
              <button onClick={handleSubmit} disabled={submitting} style={{ background: submitting ? '#5a1020' : '#8B1A2F', color: 'white', border: 'none', padding: '13px', borderRadius: 9, fontSize: 14, fontWeight: 600, cursor: submitting ? 'not-allowed' : 'pointer', fontFamily: 'Outfit, sans-serif', marginTop: 4 }}>
                {submitting ? 'Submitting...' : 'Submit for Review'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LIST */}
      {loading ? (
        <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 60 }}>Loading properties...</div>
      ) : properties.length === 0 ? (
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 14, padding: 60, textAlign: 'center', color: 'var(--text-muted)' }}>
          No properties yet. Click + New Property to add your first listing.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {properties.map((p: any) => (
            <div key={p.id} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
                  <span style={{ color: 'var(--text-primary)', fontSize: 14.5, fontWeight: 600 }}>{p.title}</span>
                  <span style={{ background: (statusColor[p.status] || '#5a4d50') + '25', color: statusColor[p.status] || '#9a8d90', padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600 }}>
                    {p.status?.replace(/_/g, ' ').toUpperCase()}
                  </span>
                  <span style={{ background: '#3b82f620', color: '#3b82f6', padding: '2px 10px', borderRadius: 20, fontSize: 11 }}>
                    {p.listing_type === 'for_sale' ? 'FOR SALE' : 'TO LET'}
                  </span>
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: 12.5 }}>
                  {p.city}{p.province ? ` · ${p.province}` : ''} · ZMW {Number(p.price || 0).toLocaleString()} · {p.property_type}
                  {p.bedrooms ? ` · ${p.bedrooms} bed` : ''}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                {p.status === 'pending_review' && (
                  <>
                    <button onClick={() => handleAction(p.id, 'approve')} style={{ background: '#22c55e20', color: '#22c55e', border: '1px solid #22c55e40', padding: '7px 14px', borderRadius: 7, fontSize: 12.5, cursor: 'pointer', fontFamily: 'Outfit, sans-serif', fontWeight: 500 }}>Approve</button>
                    <button onClick={() => handleAction(p.id, 'reject')} style={{ background: '#ef444415', color: '#ef4444', border: '1px solid #ef444430', padding: '7px 14px', borderRadius: 7, fontSize: 12.5, cursor: 'pointer', fontFamily: 'Outfit, sans-serif', fontWeight: 500 }}>Reject</button>
                  </>
                )}
                {p.status === 'approved' && (
                  <button onClick={() => handleAction(p.id, 'publish')} style={{ background: '#3b82f620', color: '#3b82f6', border: '1px solid #3b82f640', padding: '7px 14px', borderRadius: 7, fontSize: 12.5, cursor: 'pointer', fontFamily: 'Outfit, sans-serif', fontWeight: 500 }}>Publish</button>
                )}
                {p.status === 'published' && (
                  <span style={{ color: '#22c55e', fontSize: 12.5, fontWeight: 600 }}>✓ Live</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
