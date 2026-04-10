'use client';
import { useEffect, useState } from 'react';
import { apiFetch } from '../../../lib/api';

const roleColor: any = { super_admin: '#8B1A2F', admin: '#a855f7', manager: '#3b82f6', staff: '#22c55e', agent: '#f5a623', compliance: '#5a4d50' };

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ full_name: '', email: '', phone: '', role: 'staff', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { loadUsers(); }, []);

  const loadUsers = async () => {
    try {
      const res = await apiFetch('/users');
      setUsers(res.data || []);
    } catch (e) {} finally { setLoading(false); }
  };

  const handleSubmit = async () => {
    setSubmitting(true); setError('');
    try {
      await apiFetch('/users', { method: 'POST', body: JSON.stringify(form) });
      setShowForm(false);
      setForm({ full_name: '', email: '', phone: '', role: 'staff', password: '' });
      loadUsers();
    } catch (e: any) { setError(e.message); } finally { setSubmitting(false); }
  };

  const inputStyle: any = { width: '100%', background: 'var(--bg-elevated)', border: '1px solid var(--border-light)', color: 'var(--text-primary)', padding: '10px 13px', borderRadius: 8, fontSize: 13.5, outline: 'none', fontFamily: 'Outfit, sans-serif', boxSizing: 'border-box' };
  const labelStyle: any = { display: 'block', color: 'var(--text-secondary)', fontSize: 12, fontWeight: 500, marginBottom: 6 };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)' }}>User Management</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 2 }}>{users.length} team members</p>
        </div>
        <button onClick={() => setShowForm(true)} style={{ background: '#8B1A2F', color: 'white', border: 'none', padding: '10px 20px', borderRadius: 9, fontSize: 13.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>+ Add User</button>
      </div>

      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 16, padding: 32, width: '100%', maxWidth: 480 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
              <h2 style={{ color: 'var(--text-primary)', fontSize: 17, fontWeight: 700 }}>Add Team Member</h2>
              <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 20 }}>×</button>
            </div>
            {error && <div style={{ background: '#ef444415', border: '1px solid #ef444430', color: '#f87171', padding: '10px 14px', borderRadius: 8, marginBottom: 16, fontSize: 13 }}>{error}</div>}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div><label style={labelStyle}>Full Name</label><input style={inputStyle} value={form.full_name} onChange={e => setForm({...form, full_name: e.target.value})} /></div>
              <div><label style={labelStyle}>Email</label><input style={inputStyle} type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} /></div>
              <div><label style={labelStyle}>Phone</label><input style={inputStyle} value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="+260..." /></div>
              <div><label style={labelStyle}>Role</label>
                <select style={inputStyle} value={form.role} onChange={e => setForm({...form, role: e.target.value})}>
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                  <option value="staff">Staff</option>
                  <option value="agent">Agent</option>
                  <option value="compliance">Compliance</option>
                </select>
              </div>
              <div><label style={labelStyle}>Temporary Password</label><input style={inputStyle} type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} /></div>
              <button onClick={handleSubmit} disabled={submitting} style={{ background: '#8B1A2F', color: 'white', border: 'none', padding: '12px', borderRadius: 9, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>
                {submitting ? 'Creating...' : 'Create User'}
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 48 }}>Loading...</div> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {users.map((u: any) => (
            <div key={u.id} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '18px 22px', display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#8B1A2F', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 15, flexShrink: 0 }}>{u.full_name?.[0] || 'U'}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                  <span style={{ color: 'var(--text-primary)', fontSize: 14, fontWeight: 600 }}>{u.full_name}</span>
                  <span style={{ background: (roleColor[u.role] || '#5a4d50') + '25', color: roleColor[u.role] || '#5a4d50', padding: '2px 9px', borderRadius: 20, fontSize: 10.5, fontWeight: 600 }}>{u.role?.replace('_', ' ').toUpperCase()}</span>
                  {!u.is_active && <span style={{ background: '#ef444415', color: '#ef4444', padding: '2px 9px', borderRadius: 20, fontSize: 10.5 }}>INACTIVE</span>}
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>{u.email} · {u.phone}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
