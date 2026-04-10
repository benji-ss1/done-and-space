'use client';
import { useEffect, useState } from 'react';
import { agentsAPI } from '@/lib/api';
import Badge from '@/components/Badge';
import { ChevronRight } from 'lucide-react';

export default function AgentsPage() {
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  const load = () => {
    agentsAPI.getApplications().then(res => { setApps(res.data); setLoading(false); }).catch(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: string) => {
    await agentsAPI.updateStatus(id, status);
    load();
  };

  const NEXT_STATUS: any = { new: 'screening', screening: 'interview', interview: 'hired' };
  const NEXT_LABEL: any = { new: 'Move to Screening', screening: 'Move to Interview', interview: 'Hire Agent' };
  const NEXT_COLOR: any = { new: '#f5a623', screening: '#a855f7', interview: '#22c55e' };

  const statuses = ['all', 'new', 'screening', 'interview', 'hired', 'rejected'];
  const filtered = apps.filter(a => statusFilter === 'all' || a.status === statusFilter);

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>Agent Applications</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 4 }}>{apps.length} total applications</p>
      </div>

      <div style={{ display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap' }}>
        {statuses.map(s => (
          <button key={s} onClick={() => setStatusFilter(s)}
            style={{ padding: '8px 14px', borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'Outfit, sans-serif', border: '1px solid', background: statusFilter === s ? '#f5a623' : 'var(--bg-surface)', color: statusFilter === s ? '#000' : 'var(--text-secondary)', borderColor: statusFilter === s ? '#f5a623' : 'var(--border)', transition: 'all 0.15s', textTransform: 'capitalize' }}>
            {s}
          </button>
        ))}
      </div>

      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['Applicant', 'Contact', 'Region', 'Experience', 'Status', 'Action'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '14px 20px', color: 'var(--text-muted)', fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: 48, color: 'var(--text-muted)', fontSize: 13 }}>Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: 64, color: 'var(--text-muted)', fontSize: 14 }}>
                <div style={{ marginBottom: 8, fontSize: 32 }}>👤</div>No applications found
              </td></tr>
            ) : filtered.map((app, i) => (
              <tr key={app.id} style={{ borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? 'transparent' : '#ffffff03', transition: 'background 0.1s' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-elevated)')}
                onMouseLeave={e => (e.currentTarget.style.background = i % 2 === 0 ? 'transparent' : '#ffffff03')}>
                <td style={{ padding: '14px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 8, background: '#f5a62320', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f5a623', fontWeight: 700, fontSize: 13 }}>{app.full_name?.[0]}</div>
                    <div>
                      <div style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: 14 }}>{app.full_name}</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: 11, marginTop: 1 }}>{new Date(app.created_at).toLocaleDateString()}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '14px 20px' }}>
                  <div style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{app.email}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 1, fontFamily: 'DM Mono, monospace' }}>{app.phone}</div>
                </td>
                <td style={{ padding: '14px 20px', color: 'var(--text-secondary)', fontSize: 13 }}>{app.region}</td>
                <td style={{ padding: '14px 20px', color: 'var(--text-secondary)', fontSize: 13 }}>{app.experience_years} {app.experience_years === 1 ? 'year' : 'years'}</td>
                <td style={{ padding: '14px 20px' }}><Badge status={app.status} /></td>
                <td style={{ padding: '14px 20px' }}>
                  {NEXT_STATUS[app.status] && (
                    <button onClick={() => updateStatus(app.id, NEXT_STATUS[app.status])}
                      style={{ display: 'flex', alignItems: 'center', gap: 4, background: NEXT_COLOR[app.status] + '20', border: `1px solid ${NEXT_COLOR[app.status]}40`, color: NEXT_COLOR[app.status], padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>
                      {NEXT_LABEL[app.status]} <ChevronRight size={12} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
