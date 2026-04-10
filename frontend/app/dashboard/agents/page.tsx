'use client';
import { useEffect, useState } from 'react';
import { apiFetch } from '../../../lib/api';
export default function AgentsPage() {
  const [agents, setAgents] = useState<any[]>([]);
  useEffect(() => { apiFetch('/users?role=agent').then(r => setAgents(r.data || [])).catch(() => {}); }, []);
  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>Agents</h1>
      <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 32 }}>{agents.length} registered agents</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {agents.length === 0 ? (
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 14, padding: 48, textAlign: 'center', color: 'var(--text-muted)' }}>No agents yet. Add agents via User Management and assign them the Agent role.</div>
        ) : agents.map((a: any) => (
          <div key={a.id} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '18px 22px' }}>
            <div style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{a.full_name}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 4 }}>{a.email} · {a.phone}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
