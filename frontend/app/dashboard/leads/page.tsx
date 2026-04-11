'use client';
import { useEffect, useState } from 'react';
import { apiFetch } from '../../../lib/api';

const tempColor: any = { cold: '#3b82f6', warm: '#f5a623', hot: '#ef4444' };
const statusColor: any = { new: '#8B1A2F', contacted: '#3b82f6', qualified: '#a855f7', viewing_scheduled: '#f5a623', offer_made: '#22c55e', closed_won: '#22c55e', closed_lost: '#ef4444', nurturing: '#5a4d50' };

export default function LeadsPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ full_name: '', email: '', phone: '', source: 'website', interest_type: 'buy', budget_min: '', budget_max: '', notes: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => { loadLeads(); }, []);

  const loadLeads = async () => {
    try {
      const result = await apiFetch('/leads');
      console.log('Leads API response:', result);
      const list = Array.isArray(result) ? result : (result.data || result.leads || []);
      setLeads(list);
    } catch (e) {
      console.error('Failed to load leads:', e);
    } finally { setLoading(false); }
  };

  const handleSubmit = async () => {
    setSubmitting(true); setError('');
    try {
      await apiFetch('/leads', { method: 'POST', body: JSON.stringify({ ...form, budget_min: form.budget_min ? parseFloat(form.budget_min) : null, budget_max: form.budget_max ? parseFloat(form.budget_max) : null }) });
      setShowForm(false);
      setForm({ full_name: '', email: '', phone: '', source: 'website', interest_type: 'buy', budget_min: '', budget_max: '', notes: '' });
      loadLeads();
    } catch (e: any) { setError(e.message); } finally { setSubmitting(false); }
  };

  const filtered = filter === 'all' ? leads : leads.filter(l => l.temperature === filter || l.status === filter);
  const inputStyle: any = { width: '100%', background: 'var(--bg-elevated)', border: '1px solid var(--border-light)', color: 'var(--text-primary)', padding: '10px 13px', borderRadius: 8, fontSize: 13.5, outline: 'none', fontFamily: 'Outfit, sans-serif', boxSizing: 'border-box' };
  const labelStyle: any = { display: 'block', color: 'var(--text-secondary)', fontSize: 12, fontWeight: 500, marginBottom: 6 };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)' }}>Leads & CRM</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 2 }}>{leads.length} total leads</p>
        </div>
        <button onClick={() => setShowForm(true)} style={{ background: '#8B1A2F', color: 'white', border: 'none', padding: '10px 20px', borderRadius: 9, fontSize: 13.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>+ New Lead</button>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {['all', 'new', 'hot', 'warm', 'cold'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ background: filter === f ? '#8B1A2F' : 'var(--bg-surface)', color: filter === f ? 'white' : 'var(--text-secondary)', border: '1px solid var(--border)', padding: '7px 16px', borderRadius: 8, fontSize: 12.5, cursor: 'pointer', fontFamily: 'Outfit, sans-serif', textTransform: 'capitalize' }}>{f}</button>
        ))}
      </div>

      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 16, padding: 32, width: '100%', maxWidth: 520, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
              <h2 style={{ color: 'var(--text-primary)', fontSize: 17, fontWeight: 700 }}>New Lead</h2>
              <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 20 }}>×</button>
            </div>
            {error && <div style={{ background: '#ef444415', border: '1px solid #ef444430', color: '#f87171', padding: '10px 14px', borderRadius: 8, marginBottom: 16, fontSize: 13 }}>{error}</div>}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div><label style={labelStyle}>Full Name</label><input style={inputStyle} value={form.full_name} onChange={e => setForm({...form, full_name: e.target.value})} placeholder="Contact full name" /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div><label style={labelStyle}>Email</label><input style={inputStyle} type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} /></div>
                <div><label style={labelStyle}>Phone</label><input style={inputStyle} value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="+260..." /></div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div><label style={labelStyle}>Source</label>
                  <select style={inputStyle} value={form.source} onChange={e => setForm({...form, source: e.target.value})}>
                    <option value="website">Website</option>
                    <option value="whatsapp">WhatsApp</option>
                    <option value="referral">Referral</option>
                    <option value="agent">Agent</option>
                    <option value="walk_in">Walk In</option>
                    <option value="social">Social Media</option>
                    <option value="facebook">Facebook</option>
                    <option value="email">Email</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div><label style={labelStyle}>Interest</label>
                  <select style={inputStyle} value={form.interest_type} onChange={e => setForm({...form, interest_type: e.target.value})}>
                    <option value="buy">Buy</option>
                    <option value="rent">Rent</option>
                    <option value="sell">Sell</option>
                    <option value="let">Let</option>
                    <option value="invest">Invest</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div><label style={labelStyle}>Budget Min (ZMW)</label><input style={inputStyle} type="number" value={form.budget_min} onChange={e => setForm({...form, budget_min: e.target.value})} /></div>
                <div><label style={labelStyle}>Budget Max (ZMW)</label><input style={inputStyle} type="number" value={form.budget_max} onChange={e => setForm({...form, budget_max: e.target.value})} /></div>
              </div>
              <div><label style={labelStyle}>Notes</label><textarea style={{...inputStyle, minHeight: 80, resize: 'vertical'}} value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} /></div>
              <button onClick={handleSubmit} disabled={submitting} style={{ background: '#8B1A2F', color: 'white', border: 'none', padding: '12px', borderRadius: 9, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>
                {submitting ? 'Creating...' : 'Create Lead'}
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 48 }}>Loading...</div> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.length === 0 ? (
            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 14, padding: 48, textAlign: 'center', color: 'var(--text-muted)' }}>No leads found.</div>
          ) : filtered.map((lead: any) => (
            <div key={lead.id} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '18px 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 5 }}>
                  <span style={{ color: 'var(--text-primary)', fontSize: 14, fontWeight: 600 }}>{lead.full_name}</span>
                  {lead.temperature && <span style={{ background: (tempColor[lead.temperature] || '#5a4d50') + '25', color: tempColor[lead.temperature] || '#5a4d50', padding: '2px 9px', borderRadius: 20, fontSize: 10.5, fontWeight: 600 }}>{lead.temperature?.toUpperCase()}</span>}
                  <span style={{ background: (statusColor[lead.status] || '#5a4d50') + '25', color: statusColor[lead.status] || '#5a4d50', padding: '2px 9px', borderRadius: 20, fontSize: 10.5, fontWeight: 600 }}>{lead.status?.replace('_', ' ').toUpperCase()}</span>
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>{lead.phone} · {lead.source} · {lead.interest_type}</div>
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>{new Date(lead.created_at).toLocaleDateString()}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
