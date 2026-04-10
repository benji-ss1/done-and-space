'use client';
import { useEffect, useState } from 'react';
import { apiFetch } from '../../../lib/api';
export default function ReportsPage() {
  const [data, setData] = useState({ leads: 0, properties: 0, users: 0 });
  useEffect(() => {
    Promise.allSettled([apiFetch('/leads'), apiFetch('/properties'), apiFetch('/users')]).then(([l, p, u]) => {
      setData({ leads: l.status === 'fulfilled' ? (l.value?.data?.length || 0) : 0, properties: p.status === 'fulfilled' ? (p.value?.data?.length || 0) : 0, users: u.status === 'fulfilled' ? (u.value?.data?.length || 0) : 0 });
    });
  }, []);
  const cards = [{ label: 'Total Leads', value: data.leads, color: '#8B1A2F' }, { label: 'Total Properties', value: data.properties, color: '#3b82f6' }, { label: 'Team Members', value: data.users, color: '#22c55e' }];
  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>Reports</h1>
      <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 32 }}>Business overview</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {cards.map(c => (
          <div key={c.label} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '28px 24px' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: 12, marginBottom: 12 }}>{c.label}</div>
            <div style={{ fontSize: 40, fontWeight: 700, color: c.color }}>{c.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
