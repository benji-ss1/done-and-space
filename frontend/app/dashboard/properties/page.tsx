'use client';
import { useEffect, useState } from 'react';
import { apiFetch } from '../../../lib/api';

const statusColor: any = { draft: '#5a4d50', pending_review: '#f5a623', approved: '#3b82f6', published: '#22c55e', rejected: '#ef4444', archived: '#5a4d50' };

export default function PropertiesPage() {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', listing_type: 'for_sale', property_type: 'house', price: '', address: '', city: '', province: '', bedrooms: '', bathrooms: '', size_sqm: '', description: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { loadProperties(); }, []);

  const loadProperties = async () => {
    try {
      const res = await apiFetch('/properties');
      setProperties(res.data || []);
    } catch (e) {} finally { setLoading(false); }
  };

  const handleSubmit = async () => {
    setSubmitting(true); setError('');
    try {
      await apiFetch('/properties', { method: 'POST', body: JSON.stringify({ ...form, price: parseFloat(form.price), bedrooms: form.bedrooms ? parseInt(form.bedrooms) : null, bathrooms: form.bathrooms ? parseInt(form.bathrooms) : null, size_sqm: form.size_sqm ? parseFloat(form.size_sqm) : null }) });
      setShowForm(false);
      setForm({ title: '', listing_type: 'for_sale', property_type: 'house', price: '', address: '', city: '', province: '', bedrooms: '', bathrooms: '', size_sqm: '', description: '' });
      loadProperties();
    } catch (e: any) { setError(e.message); } finally { setSubmitting(false); }
  };

  const handleAction = async (id: string, action: string) => {
    try {
      await apiFetch(`/properties/${id}/${action}`, { method: 'PATCH' });
      loadProperties();
    } catch (e) {}
  };

  const inputStyle: any = { width: '100%', background: 'var(--bg-elevated)', border: '1px solid var(--border-light)', color: 'var(--text-primary)', padding: '10px 13px', borderRadius: 8, fontSize: 13.5, outline: 'none', fontFamily: 'Outfit, sans-serif', boxSizing: 'border-box' };
  const labelStyle: any = { display: 'block', color: 'var(--text-secondary)', fontSize: 12, fontWeight: 500, marginBottom: 6 };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)' }}>Properties</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 2 }}>Manage all listings</p>
        </div>
        <button onClick={() => setShowForm(true)} style={{ background: '#8B1A2F', color: 'white', border: 'none', padding: '10px 20px', borderRadius: 9, fontSize: 13.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>+ New Property</button>
      </div>

      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 16, padding: 32, width: '100%', maxWidth: 560, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
              <h2 style={{ color: 'var(--text-primary)', fontSize: 17, fontWeight: 700 }}>New Property Listing</h2>
              <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 20 }}>×</button>
            </div>
            {error && <div style={{ background: '#ef444415', border: '1px solid #ef444430', color: '#f87171', padding: '10px 14px', borderRadius: 8, marginBottom: 16, fontSize: 13 }}>{error}</div>}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div><label style={labelStyle}>Property Title</label><input style={inputStyle} value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="e.g. 3 Bedroom House in Kabulonga" /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div><label style={labelStyle}>Listing Type</label>
                  <select style={inputStyle} value={form.listing_type} onChange={e => setForm({...form, listing_type: e.target.value})}>
                    <option value="for_sale">For Sale</option>
                    <option value="to_let">To Let</option>
                  </select>
                </div>
                <div><label style={labelStyle}>Property Type</label>
                  <select style={inputStyle} value={form.property_type} onChange={e => setForm({...form, property_type: e.target.value})}>
                    <option value="house">House</option>
                    <option value="apartment">Apartment</option>
                    <option value="land">Land</option>
                    <option value="commercial">Commercial</option>
                    <option value="office">Office</option>
                  </select>
                </div>
              </div>
              <div><label style={labelStyle}>Price (ZMW)</label><input style={inputStyle} type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} placeholder="e.g. 450000" /></div>
              <div><label style={labelStyle}>Address</label><input style={inputStyle} value={form.address} onChange={e => setForm({...form, address: e.target.value})} placeholder="Street address" /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div><label style={labelStyle}>City</label><input style={inputStyle} value={form.city} onChange={e => setForm({...form, city: e.target.value})} placeholder="e.g. Lusaka" /></div>
                <div><label style={labelStyle}>Province</label><input style={inputStyle} value={form.province} onChange={e => setForm({...form, province: e.target.value})} placeholder="e.g. Lusaka Province" /></div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                <div><label style={labelStyle}>Bedrooms</label><input style={inputStyle} type="number" value={form.bedrooms} onChange={e => setForm({...form, bedrooms: e.target.value})} /></div>
                <div><label style={labelStyle}>Bathrooms</label><input style={inputStyle} type="number" value={form.bathrooms} onChange={e => setForm({...form, bathrooms: e.target.value})} /></div>
                <div><label style={labelStyle}>Size (m²)</label><input style={inputStyle} value={form.size_sqm} onChange={e => setForm({...form, size_sqm: e.target.value})} /></div>
              </div>
              <div><label style={labelStyle}>Description</label><textarea style={{...inputStyle, minHeight: 80, resize: 'vertical'}} value={form.description} onChange={e => setForm({...form, description: e.target.value})} /></div>
              <button onClick={handleSubmit} disabled={submitting} style={{ background: '#8B1A2F', color: 'white', border: 'none', padding: '12px', borderRadius: 9, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'Outfit, sans-serif', marginTop: 4 }}>
                {submitting ? 'Submitting...' : 'Submit for Review'}
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 48 }}>Loading...</div> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {properties.length === 0 ? (
            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 14, padding: 48, textAlign: 'center', color: 'var(--text-muted)' }}>No properties yet. Click + New Property to add one.</div>
          ) : properties.map((p: any) => (
            <div key={p.id} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                  <span style={{ color: 'var(--text-primary)', fontSize: 14.5, fontWeight: 600 }}>{p.title}</span>
                  <span style={{ background: (statusColor[p.status] || '#5a4d50') + '25', color: statusColor[p.status] || '#5a4d50', padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600 }}>{p.status?.replace('_', ' ').toUpperCase()}</span>
                  <span style={{ background: '#3b82f620', color: '#3b82f6', padding: '2px 10px', borderRadius: 20, fontSize: 11 }}>{p.listing_type === 'for_sale' ? 'FOR SALE' : 'TO LET'}</span>
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: 12.5 }}>{p.city} · ZMW {Number(p.price).toLocaleString()} · {p.property_type}</div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                {p.status === 'pending_review' && <button onClick={() => handleAction(p.id, 'approve')} style={{ background: '#22c55e20', color: '#22c55e', border: '1px solid #22c55e30', padding: '6px 14px', borderRadius: 7, fontSize: 12.5, cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>Approve</button>}
                {p.status === 'approved' && <button onClick={() => handleAction(p.id, 'publish')} style={{ background: '#3b82f620', color: '#3b82f6', border: '1px solid #3b82f630', padding: '6px 14px', borderRadius: 7, fontSize: 12.5, cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>Publish</button>}
                {p.status === 'pending_review' && <button onClick={() => handleAction(p.id, 'reject')} style={{ background: '#ef444415', color: '#ef4444', border: '1px solid #ef444430', padding: '6px 14px', borderRadius: 7, fontSize: 12.5, cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>Reject</button>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
