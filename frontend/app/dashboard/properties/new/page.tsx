'use client';
import { useState } from 'react';
import { propertiesAPI } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';

export default function NewPropertyPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '', description: '', listing_type: 'sale', property_type: 'apartment',
    price: '', bedrooms: '', bathrooms: '', size_sqm: '',
    address: '', city: '', province: 'Lusaka',
    mandate_type: 'exclusive', mandate_expiry: '',
  });

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const ZAMBIA_PROVINCES = ['Lusaka','Copperbelt','Central','Eastern','Western','Northern','Luapula','North-Western','Southern','Muchinga'];

  const submit = async () => {
    if (!form.title || !form.price || !form.address || !form.city) { setError('Title, price, address and city are required.'); return; }
    setSaving(true); setError('');
    try {
      await propertiesAPI.create({
        ...form,
        price: Number(form.price),
        bedrooms: form.bedrooms ? Number(form.bedrooms) : undefined,
        bathrooms: form.bathrooms ? Number(form.bathrooms) : undefined,
        size_sqm: form.size_sqm ? Number(form.size_sqm) : undefined,
        mandate_expiry: form.mandate_expiry || undefined,
      });
      router.push('/dashboard/properties');
    } catch (e: any) {
      setError(e.response?.data?.message || 'Failed to create property.');
    }
    setSaving(false);
  };

  const inputStyle = { width: '100%', background: 'var(--bg-elevated)', border: '1px solid var(--border-light)', color: 'var(--text-primary)', padding: '10px 13px', borderRadius: 9, fontSize: 13.5, outline: 'none', fontFamily: 'Outfit, sans-serif', boxSizing: 'border-box' as const };
  const labelStyle = { display: 'block', color: 'var(--text-muted)', fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' as const, marginBottom: 7 };

  return (
    <div style={{ maxWidth: 760 }}>
      <button onClick={() => router.push('/dashboard/properties')} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: 13, cursor: 'pointer', fontFamily: 'Outfit, sans-serif', marginBottom: 24 }}>
        <ArrowLeft size={14} /> Back to Properties
      </button>

      <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: 6 }}>Add New Property</h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: 13.5, marginBottom: 28 }}>Submit a new listing for review and approval.</p>

      {error && <div style={{ background: '#ef444415', border: '1px solid #ef444430', color: '#f87171', padding: '10px 14px', borderRadius: 9, marginBottom: 20, fontSize: 13 }}>{error}</div>}

      {/* Basic Info */}
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '24px', marginBottom: 16 }}>
        <h2 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 18 }}>Basic Information</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Property Title *</label>
            <input value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. 3-Bedroom House in Kabulonga" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Listing Type *</label>
            <select value={form.listing_type} onChange={e => set('listing_type', e.target.value)} style={inputStyle}>
              <option value="sale">For Sale</option>
              <option value="let">To Let</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Property Type *</label>
            <select value={form.property_type} onChange={e => set('property_type', e.target.value)} style={inputStyle}>
              {['apartment','house','land','commercial','mixed_use'].map(t => <option key={t} value={t} style={{ textTransform: 'capitalize' }}>{t.replace('_',' ')}</option>)}
            </select>
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Description</label>
            <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={3} placeholder="Describe the property in detail..." style={{ ...inputStyle, resize: 'vertical' }} />
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '24px', marginBottom: 16 }}>
        <h2 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 18 }}>Pricing & Size</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 16 }}>
          <div style={{ gridColumn: '1 / 3' }}>
            <label style={labelStyle}>Price (ZMW) *</label>
            <input type="number" value={form.price} onChange={e => set('price', e.target.value)} placeholder="0" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Size (m²)</label>
            <input type="number" value={form.size_sqm} onChange={e => set('size_sqm', e.target.value)} placeholder="0" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Bedrooms</label>
            <input type="number" value={form.bedrooms} onChange={e => set('bedrooms', e.target.value)} placeholder="0" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Bathrooms</label>
            <input type="number" value={form.bathrooms} onChange={e => set('bathrooms', e.target.value)} placeholder="0" style={inputStyle} />
          </div>
        </div>
      </div>

      {/* Location */}
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '24px', marginBottom: 16 }}>
        <h2 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 18 }}>Location</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Street Address *</label>
            <input value={form.address} onChange={e => set('address', e.target.value)} placeholder="e.g. Plot 12, Independence Avenue" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>City / Area *</label>
            <input value={form.city} onChange={e => set('city', e.target.value)} placeholder="e.g. Lusaka" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Province</label>
            <select value={form.province} onChange={e => set('province', e.target.value)} style={inputStyle}>
              {ZAMBIA_PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Mandate */}
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '24px', marginBottom: 24 }}>
        <h2 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 18 }}>Mandate Details</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <label style={labelStyle}>Mandate Type</label>
            <select value={form.mandate_type} onChange={e => set('mandate_type', e.target.value)} style={inputStyle}>
              <option value="exclusive">Exclusive</option>
              <option value="open">Open</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Mandate Expiry</label>
            <input type="date" value={form.mandate_expiry} onChange={e => set('mandate_expiry', e.target.value)} style={inputStyle} />
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
        <button onClick={() => router.push('/dashboard/properties')} style={{ background: 'none', border: '1px solid var(--border)', color: 'var(--text-secondary)', padding: '10px 20px', borderRadius: 9, fontSize: 13.5, cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>Cancel</button>
        <button onClick={submit} disabled={saving}
          style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#8B1A2F', border: 'none', color: 'white', padding: '10px 22px', borderRadius: 9, fontSize: 13.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>
          <Save size={14} /> {saving ? 'Saving...' : 'Submit for Review'}
        </button>
      </div>
    </div>
  );
}
