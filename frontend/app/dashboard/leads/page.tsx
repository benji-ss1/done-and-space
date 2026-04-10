'use client';
import { useEffect, useState } from 'react';
import { leadsAPI } from '@/lib/api';
import Badge from '@/components/Badge';
import { Search, Filter } from 'lucide-react';

export default function LeadsPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    leadsAPI.getAll().then(res => { setLeads(res.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const filtered = leads.filter(l => {
    const matchText = l.full_name?.toLowerCase().includes(filter.toLowerCase()) || l.phone?.includes(filter);
    const matchStatus = statusFilter === 'all' || l.status === statusFilter;
    return matchText && matchStatus;
  });

  const statuses = ['all', 'new', 'contacted', 'qualified', 'warm', 'hot', 'converted', 'lost'];

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>Leads & CRM</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 4 }}>{leads.length} total leads in system</p>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input value={filter} onChange={e => setFilter(e.target.value)} placeholder="Search by name or phone..."
            style={{ width: '100%', background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-primary)', padding: '10px 12px 10px 36px', borderRadius: 10, fontSize: 13, outline: 'none', fontFamily: 'Outfit, sans-serif' }} />
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {statuses.map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              style={{ padding: '8px 14px', borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: 'pointer', textTransform: 'capitalize', fontFamily: 'Outfit, sans-serif', border: '1px solid', background: statusFilter === s ? '#f5a623' : 'var(--bg-surface)', color: statusFilter === s ? '#000' : 'var(--text-secondary)', borderColor: statusFilter === s ? '#f5a623' : 'var(--border)', transition: 'all 0.15s' }}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['Name', 'Contact', 'Source', 'Interest', 'Budget (ZMW)', 'Status', 'Assigned', 'Date'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '14px 20px', color: 'var(--text-muted)', fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} style={{ textAlign: 'center', padding: 48, color: 'var(--text-muted)', fontSize: 13 }}>Loading leads...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={8} style={{ textAlign: 'center', padding: 64, color: 'var(--text-muted)', fontSize: 14 }}>
                <div style={{ marginBottom: 8, fontSize: 32 }}>📋</div>
                No leads found
              </td></tr>
            ) : filtered.map((lead, i) => (
              <tr key={lead.id} style={{ borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? 'transparent' : '#ffffff03', transition: 'background 0.1s', cursor: 'pointer' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-elevated)')}
                onMouseLeave={e => (e.currentTarget.style.background = i % 2 === 0 ? 'transparent' : '#ffffff03')}>
                <td style={{ padding: '14px 20px' }}>
                  <div style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: 14 }}>{lead.full_name}</div>
                  {lead.email && <div style={{ color: 'var(--text-muted)', fontSize: 11, marginTop: 2 }}>{lead.email}</div>}
                </td>
                <td style={{ padding: '14px 20px', color: 'var(--text-secondary)', fontSize: 13, fontFamily: 'DM Mono, monospace' }}>{lead.phone}</td>
                <td style={{ padding: '14px 20px', color: 'var(--text-secondary)', fontSize: 13, textTransform: 'capitalize' }}>{lead.source}</td>
                <td style={{ padding: '14px 20px', color: 'var(--text-secondary)', fontSize: 13, textTransform: 'capitalize' }}>{lead.interest_type || '—'}</td>
                <td style={{ padding: '14px 20px', color: 'var(--text-secondary)', fontSize: 13 }}>
                  {lead.budget_max ? `${Number(lead.budget_max).toLocaleString()}` : '—'}
                </td>
                <td style={{ padding: '14px 20px' }}><Badge status={lead.status} /></td>
                <td style={{ padding: '14px 20px', color: 'var(--text-muted)', fontSize: 12 }}>{lead.users?.full_name || 'Unassigned'}</td>
                <td style={{ padding: '14px 20px', color: 'var(--text-muted)', fontSize: 12 }}>{new Date(lead.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
