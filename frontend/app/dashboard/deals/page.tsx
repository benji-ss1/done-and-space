'use client';
import { useEffect, useState } from 'react';
import { dealsAPI } from '@/lib/api';
import Badge from '@/components/Badge';

const STAGE_ORDER = ['qualification','viewing','offer','negotiation','under_contract','completed','fallen_through'];

export default function DealsPage() {
  const [deals, setDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dealsAPI.getAll().then(res => { setDeals(res.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const totalValue = deals.reduce((sum, d) => sum + (Number(d.agreed_price) || 0), 0);
  const totalCommission = deals.reduce((sum, d) => sum + (Number(d.commission_amount) || 0), 0);

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>Deal Pipeline</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 4 }}>{deals.length} active deals</p>
      </div>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 28 }}>
        {[
          { label: 'Total Pipeline Value', value: `ZMW ${totalValue.toLocaleString()}`, color: '#3b82f6' },
          { label: 'Total Commission', value: `ZMW ${totalCommission.toLocaleString()}`, color: '#22c55e' },
          { label: 'Active Deals', value: deals.filter(d => !['completed','fallen_through'].includes(d.stage)).length, color: '#f5a623' },
        ].map(card => (
          <div key={card.label} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '20px 24px' }}>
            <div style={{ color: 'var(--text-secondary)', fontSize: 12, fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 10 }}>{card.label}</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: card.color, letterSpacing: '-0.02em', fontFamily: 'DM Mono, monospace' }}>{card.value}</div>
          </div>
        ))}
      </div>

      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['Ref', 'Property', 'Agent', 'Type', 'Agreed Price', 'Commission', 'Stage'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '14px 20px', color: 'var(--text-muted)', fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: 48, color: 'var(--text-muted)', fontSize: 13 }}>Loading deals...</td></tr>
            ) : deals.length === 0 ? (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: 64, color: 'var(--text-muted)', fontSize: 14 }}>
                <div style={{ marginBottom: 8, fontSize: 32 }}>🤝</div>No deals yet
              </td></tr>
            ) : deals.map((deal, i) => (
              <tr key={deal.id} style={{ borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? 'transparent' : '#ffffff03', transition: 'background 0.1s' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-elevated)')}
                onMouseLeave={e => (e.currentTarget.style.background = i % 2 === 0 ? 'transparent' : '#ffffff03')}>
                <td style={{ padding: '14px 20px', color: 'var(--text-muted)', fontSize: 11, fontFamily: 'DM Mono, monospace' }}>{deal.reference_no}</td>
                <td style={{ padding: '14px 20px', color: 'var(--text-primary)', fontWeight: 600, fontSize: 14 }}>{deal.properties?.title || '—'}</td>
                <td style={{ padding: '14px 20px', color: 'var(--text-secondary)', fontSize: 13 }}>{deal.users?.full_name || '—'}</td>
                <td style={{ padding: '14px 20px' }}>
                  <span style={{ background: deal.deal_type === 'sale' ? '#3b82f620' : '#22c55e20', color: deal.deal_type === 'sale' ? '#60a5fa' : '#4ade80', padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600 }}>
                    {deal.deal_type === 'sale' ? 'Sale' : 'Let'}
                  </span>
                </td>
                <td style={{ padding: '14px 20px', color: 'var(--text-primary)', fontSize: 13, fontFamily: 'DM Mono, monospace' }}>ZMW {Number(deal.agreed_price || 0).toLocaleString()}</td>
                <td style={{ padding: '14px 20px', color: '#4ade80', fontSize: 13, fontFamily: 'DM Mono, monospace' }}>ZMW {Number(deal.commission_amount || 0).toLocaleString()}</td>
                <td style={{ padding: '14px 20px' }}><Badge status={deal.stage} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
