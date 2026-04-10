'use client';
import { useEffect, useState } from 'react';
import { propertiesAPI } from '@/lib/api';
import Badge from '@/components/Badge';
import { Search, CheckCircle, Globe } from 'lucide-react';

export default function PropertiesPage() {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const load = () => {
    propertiesAPI.getAll().then(res => { setProperties(res.data); setLoading(false); }).catch(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const handleApprove = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await propertiesAPI.approve(id);
    load();
  };
  const handlePublish = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await propertiesAPI.publish(id);
    load();
  };

  const statuses = ['all', 'draft', 'pending_review', 'approved', 'published', 'sold', 'archived'];
  const filtered = properties.filter(p => {
    const matchText = p.title?.toLowerCase().includes(filter.toLowerCase()) || p.city?.toLowerCase().includes(filter.toLowerCase());
    const matchStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchText && matchStatus;
  });

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>Properties</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 4 }}>{properties.length} total listings</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input value={filter} onChange={e => setFilter(e.target.value)} placeholder="Search by title or city..."
            style={{ width: '100%', background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-primary)', padding: '10px 12px 10px 36px', borderRadius: 10, fontSize: 13, outline: 'none', fontFamily: 'Outfit, sans-serif' }} />
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {statuses.map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              style={{ padding: '8px 14px', borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'Outfit, sans-serif', border: '1px solid', background: statusFilter === s ? '#f5a623' : 'var(--bg-surface)', color: statusFilter === s ? '#000' : 'var(--text-secondary)', borderColor: statusFilter === s ? '#f5a623' : 'var(--border)', transition: 'all 0.15s', textTransform: 'capitalize' }}>
              {s.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['Reference', 'Property', 'Type', 'Price (ZMW)', 'Location', 'Status', 'Actions'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '14px 20px', color: 'var(--text-muted)', fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: 48, color: 'var(--text-muted)', fontSize: 13 }}>Loading properties...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: 64, color: 'var(--text-muted)', fontSize: 14 }}>
                <div style={{ marginBottom: 8, fontSize: 32 }}>🏠</div>No properties found
              </td></tr>
            ) : filtered.map((p, i) => (
              <tr key={p.id} style={{ borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? 'transparent' : '#ffffff03', transition: 'background 0.1s' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-elevated)')}
                onMouseLeave={e => (e.currentTarget.style.background = i % 2 === 0 ? 'transparent' : '#ffffff03')}>
                <td style={{ padding: '14px 20px', color: 'var(--text-muted)', fontSize: 11, fontFamily: 'DM Mono, monospace' }}>{p.reference_no || '—'}</td>
                <td style={{ padding: '14px 20px' }}>
                  <div style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: 14 }}>{p.title}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: 11, marginTop: 2, textTransform: 'capitalize' }}>{p.property_type}</div>
                </td>
                <td style={{ padding: '14px 20px' }}>
                  <span style={{ background: p.type === 'sale' ? '#3b82f620' : '#22c55e20', color: p.type === 'sale' ? '#60a5fa' : '#4ade80', padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600 }}>
                    {p.type === 'sale' ? 'For Sale' : 'To Let'}
                  </span>
                </td>
                <td style={{ padding: '14px 20px', color: 'var(--text-primary)', fontSize: 13, fontWeight: 600, fontFamily: 'DM Mono, monospace' }}>{Number(p.price).toLocaleString()}</td>
                <td style={{ padding: '14px 20px', color: 'var(--text-secondary)', fontSize: 13 }}>{p.city}, {p.state}</td>
                <td style={{ padding: '14px 20px' }}><Badge status={p.status} /></td>
                <td style={{ padding: '14px 20px' }}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {p.status === 'pending_review' && (
                      <button onClick={e => handleApprove(p.id, e)} style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#3b82f620', border: '1px solid #3b82f640', color: '#60a5fa', padding: '5px 10px', borderRadius: 7, fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>
                        <CheckCircle size={12} /> Approve
                      </button>
                    )}
                    {p.status === 'approved' && (
                      <button onClick={e => handlePublish(p.id, e)} style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#22c55e20', border: '1px solid #22c55e40', color: '#4ade80', padding: '5px 10px', borderRadius: 7, fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>
                        <Globe size={12} /> Publish
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
