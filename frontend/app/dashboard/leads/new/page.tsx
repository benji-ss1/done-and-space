'use client';
import { useState } from 'react';
import { leadsAPI } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import axios from 'axios';

export default function NewLeadPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    full_name: '', email: '', phone: '', source: 'website',
    interest_type: 'buying', budget_min: '', budget_max: '',
    preferred_area: '', notes: '',
  });

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const submit = async () => {
    if (!form.full_name || !form.phone) { setError('Name and phone are required.'); return; }
    setSaving(true);
    setError('');
    try {
      await axios.post('http://localhost:3001/api/v1/leads/inquiry', {
        ...form,
        budget_min: form.budget_min ? Number(form.budget_min) : undefined,
        budget_max: form.budget_max ? Number(form.budget_max) : undefined,
      });
      router.push('/dashboard/leads');
    } catch (e: any) {
      setError(e.response?.data?.message || 'Failed to create lead.');
    }
    setSaving(false);
  };

  const inputStyle = { width: '100%', background: 'var(--bg-elevated)', border: '1px solid var(--border-light)', color: 'var(--text-primary)', padding: '10px 13px', borderRadius: 9, fontSize: 13.5, outline: 'none', fontFamily: 'Outfit, sans-serif', boxSizing: 'border-box' as const };
  const labelStyle = { display: 'block', color: 'var(--text-muted)', fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' as const, marginBottom: 7 };

  return (
    <div style={{ maxWidth: 680 }}>
      <button onClick={() => router.push('/dashboard/leads')} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: 13, cursor: 'pointer', fontFamily: 'Outfit, sans-serif', marginBottom: 24 }}>
        <ArrowLeft size={14} /> Back to Leads
      </button>

      <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: 6 }}>Add New Lead</h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: 13.5, marginBottom: 28 }}>Capture a new lead into the CRM system.</p>

      {error && <div style={{ background: '#ef444415', border: '1px solid #ef444430', color: '#f87171', padding: '10px 14px', borderRadius: 9, marginBottom: 20, fontSize: 13 }}>{error}</div>}

      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '28px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Full Name *</label>
            <input value={form.full_name} onChange={e => set('full_name', e.target.value)} placeholder="e.g. James Mwanza" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Phone Number *</label>
            <input value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+260971000000" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Email Address</label>
            <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="james@email.com" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Lead Source</label>
            <select value={form.source} onChange={e => set('source', e.target.value)} style={inputStyle}>
              {['website','whatsapp','referral','walk_in','social_media','phone_call','agent'].map(s => <option key={s} value={s} style={{ textTransform: 'capitalize' }}>{s.replace(/_/g,' ')}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Interest Type</label>
            <select value={form.interest_type} onChange={e => set('interest_type', e.target.value)} style={inputStyle}>
              {['buying','selling','renting','landlord'].map(s => <option key={s} value={s} style={{ textTransform: 'capitalize' }}>{s}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Budget Min (ZMW)</label>
            <input type="number" value={form.budget_min} onChange={e => set('budget_min', e.target.value)} placeholder="0" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Budget Max (ZMW)</label>
            <input type="number" value={form.budget_max} onChange={e => set('budget_max', e.target.value)} placeholder="0" style={inputStyle} />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Preferred Location</label>
            <input value={form.preferred_area} onChange={e => set('preferred_area', e.target.value)} placeholder="e.g. Lusaka, Kabulonga" style={inputStyle} />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Notes</label>
            <textarea value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Any additional details about this lead..." rows={3}
              style={{ ...inputStyle, resize: 'vertical' }} />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 24 }}>
          <button onClick={() => router.push('/dashboard/leads')} style={{ background: 'none', border: '1px solid var(--border)', color: 'var(--text-secondary)', padding: '9px 18px', borderRadius: 9, fontSize: 13.5, cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>Cancel</button>
          <button onClick={submit} disabled={saving}
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#8B1A2F', border: 'none', color: 'white', padding: '9px 20px', borderRadius: 9, fontSize: 13.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>
            <Save size={14} /> {saving ? 'Saving...' : 'Create Lead'}
          </button>
        </div>
      </div>
    </div>
  );
}
