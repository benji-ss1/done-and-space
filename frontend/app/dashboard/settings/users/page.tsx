'use client';
import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import Badge from '@/components/Badge';
import { Plus, Save, X, Shield } from 'lucide-react';

const ROLES = ['staff','agent','manager','admin','compliance','super_admin'];
const ZAMBIA_PROVINCES = ['Lusaka','Copperbelt','Central','Eastern','Western','Northern','Luapula','North-Western','Southern','Muchinga'];

const ROLE_COLORS: any = {
  super_admin: { bg: '#8B1A2F18', color: '#c0374f', border: '#8B1A2F35' },
  admin: { bg: '#ef444418', color: '#f87171', border: '#ef444430' },
  manager: { bg: '#f5a62318', color: '#f5a623', border: '#f5a62330' },
  staff: { bg: '#3b82f618', color: '#60a5fa', border: '#3b82f630' },
  agent: { bg: '#22c55e18', color: '#4ade80', border: '#22c55e30' },
  compliance: { bg: '#a855f718', color: '#c084fc', border: '#a855f730' },
};

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({ full_name: '', email: '', phone: '', password: '', role: 'staff', branch_id: '' });

  const load = async () => {
    try {
      const res = await apiFetch('/users');
      setUsers(Array.isArray(res) ? res : (res.data || []));
    } catch {}
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const createUser = async () => {
    if (!form.full_name || !form.email || !form.password) { setError('Name, email and password are required.'); return; }
    setSaving(true); setError(''); setSuccess('');
    try {
      await apiFetch('/users', { method: 'POST', body: JSON.stringify(form) });
      setSuccess('User created successfully.');
      setForm({ full_name: '', email: '', phone: '', password: '', role: 'staff', branch_id: '' });
      setShowForm(false);
      load();
    } catch (e: any) {
      setError(e.message || 'Failed to create user.');
    }
    setSaving(false);
  };

  const toggleActive = async (userId: string, current: boolean) => {
    await apiFetch(`/users/${userId}`, { method: 'PATCH', body: JSON.stringify({ is_active: !current }) });
    load();
  };

  const inputStyle = { width: '100%', background: 'var(--bg-elevated)', border: '1px solid var(--border-light)', color: 'var(--text-primary)', padding: '9px 12px', borderRadius: 8, fontSize: 13, outline: 'none', fontFamily: 'Outfit, sans-serif', boxSizing: 'border-box' as const };
  const labelStyle = { display: 'block', color: 'var(--text-muted)', fontSize: 10.5, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' as const, marginBottom: 6 };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>User Management</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 4 }}>{users.length} team members · Role-based access control</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#8B1A2F', border: 'none', color: 'white', padding: '9px 16px', borderRadius: 9, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>
          {showForm ? <><X size={13} /> Cancel</> : <><Plus size={13} /> Add User</>}
        </button>
      </div>

      {error && <div style={{ background: '#ef444415', border: '1px solid #ef444430', color: '#f87171', padding: '10px 14px', borderRadius: 9, marginBottom: 16, fontSize: 13 }}>{error}</div>}
      {success && <div style={{ background: '#22c55e15', border: '1px solid #22c55e30', color: '#4ade80', padding: '10px 14px', borderRadius: 9, marginBottom: 16, fontSize: 13 }}>{success}</div>}

      {/* Create form */}
      {showForm && (
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '24px', marginBottom: 20 }}>
          <h2 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Shield size={15} style={{ color: '#8B1A2F' }} /> Create New User
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 14 }}>
            <div>
              <label style={labelStyle}>Full Name *</label>
              <input value={form.full_name} onChange={e => set('full_name', e.target.value)} placeholder="James Mwanza" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Email Address *</label>
              <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="james@doneandspace.com" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Phone (Zambia)</label>
              <input value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+260971000000" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Password *</label>
              <input type="password" value={form.password} onChange={e => set('password', e.target.value)} placeholder="Minimum 8 characters" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Role *</label>
              <select value={form.role} onChange={e => set('role', e.target.value)} style={inputStyle}>
                {ROLES.map(r => <option key={r} value={r} style={{ textTransform: 'capitalize' }}>{r.replace(/_/g, ' ')}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button onClick={() => setShowForm(false)} style={{ background: 'none', border: '1px solid var(--border)', color: 'var(--text-secondary)', padding: '8px 16px', borderRadius: 8, fontSize: 13, cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>Cancel</button>
            <button onClick={createUser} disabled={saving}
              style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#8B1A2F', border: 'none', color: 'white', padding: '8px 18px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>
              <Save size={13} /> {saving ? 'Creating...' : 'Create User'}
            </button>
          </div>
        </div>
      )}

      {/* Role legend */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {ROLES.map(r => {
          const c = ROLE_COLORS[r];
          return (
            <div key={r} style={{ display: 'flex', alignItems: 'center', gap: 5, background: c.bg, border: `1px solid ${c.border}`, padding: '4px 10px', borderRadius: 20 }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: c.color }} />
              <span style={{ color: c.color, fontSize: 11, fontWeight: 500, textTransform: 'capitalize' }}>{r.replace(/_/g, ' ')}</span>
            </div>
          );
        })}
      </div>

      {/* Users table */}
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['Team Member', 'Email', 'Phone', 'Role', 'Status', 'Joined', 'Actions'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '13px 18px', color: 'var(--text-muted)', fontSize: 10.5, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)', fontSize: 13 }}>Loading users...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: 56, color: 'var(--text-muted)', fontSize: 13 }}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>👥</div>No users yet. Create your first team member above.
              </td></tr>
            ) : users.map((u, i) => {
              const rc = ROLE_COLORS[u.role] || ROLE_COLORS.staff;
              return (
                <tr key={u.id} style={{ borderBottom: i < users.length - 1 ? '1px solid var(--border)' : 'none', transition: 'background 0.1s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-elevated)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '13px 18px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: rc.bg, border: `1px solid ${rc.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: rc.color, fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
                        {u.full_name?.[0]}
                      </div>
                      <div style={{ color: 'var(--text-primary)', fontSize: 13.5, fontWeight: 500 }}>{u.full_name}</div>
                    </div>
                  </td>
                  <td style={{ padding: '13px 18px', color: 'var(--text-secondary)', fontSize: 12.5 }}>{u.email}</td>
                  <td style={{ padding: '13px 18px', color: 'var(--text-secondary)', fontSize: 12.5, fontFamily: 'DM Mono, monospace' }}>{u.phone || '—'}</td>
                  <td style={{ padding: '13px 18px' }}>
                    <span style={{ background: rc.bg, color: rc.color, border: `1px solid ${rc.border}`, padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, textTransform: 'capitalize' }}>
                      {u.role?.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td style={{ padding: '13px 18px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: u.is_active ? '#22c55e' : '#6b7280', boxShadow: u.is_active ? '0 0 5px #22c55e80' : 'none' }} />
                      <span style={{ color: u.is_active ? '#22c55e' : 'var(--text-muted)', fontSize: 12, fontWeight: 500 }}>{u.is_active ? 'Active' : 'Inactive'}</span>
                    </div>
                  </td>
                  <td style={{ padding: '13px 18px', color: 'var(--text-muted)', fontSize: 12 }}>{new Date(u.created_at).toLocaleDateString()}</td>
                  <td style={{ padding: '13px 18px' }}>
                    <button onClick={() => toggleActive(u.id, u.is_active)}
                      style={{ background: u.is_active ? '#ef444415' : '#22c55e15', border: `1px solid ${u.is_active ? '#ef444430' : '#22c55e30'}`, color: u.is_active ? '#f87171' : '#4ade80', padding: '5px 10px', borderRadius: 7, fontSize: 11.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>
                      {u.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
