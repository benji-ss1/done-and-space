'use client';
import { useEffect, useState } from 'react';
import { reportsAPI } from '@/lib/api';
import { TrendingUp, Users, Building2, Handshake } from 'lucide-react';

export default function ReportsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      reportsAPI.getDashboard(),
      reportsAPI.getLeads(),
      reportsAPI.getListings(),
    ]).then(([dash, leads, listings]) => {
      setData({ dashboard: dash.data, leads: leads.data, listings: listings.data });
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const Section = ({ title, children }: any) => (
    <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden', marginBottom: 16 }}>
      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{title}</h3>
      </div>
      <div style={{ padding: '20px' }}>{children}</div>
    </div>
  );

  const Metric = ({ label, value, sub, color = 'var(--text-primary)' }: any) => (
    <div style={{ background: 'var(--bg-elevated)', borderRadius: 10, padding: '16px 18px' }}>
      <div style={{ color: 'var(--text-muted)', fontSize: 10.5, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 700, color, letterSpacing: '-0.02em', fontFamily: 'Outfit, sans-serif' }}>{value}</div>
      {sub && <div style={{ color: 'var(--text-muted)', fontSize: 11.5, marginTop: 5 }}>{sub}</div>}
    </div>
  );

  const Bar = ({ label, value, total, color }: any) => {
    const pct = total > 0 ? Math.round((value / total) * 100) : 0;
    return (
      <div style={{ marginBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: 13, textTransform: 'capitalize' }}>{label.replace(/_/g, ' ')}</span>
          <div style={{ display: 'flex', gap: 10 }}>
            <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>{pct}%</span>
            <span style={{ color: 'var(--text-primary)', fontSize: 13, fontWeight: 600, minWidth: 20, textAlign: 'right' }}>{value}</span>
          </div>
        </div>
        <div style={{ height: 6, background: 'var(--bg-elevated)', borderRadius: 3 }}>
          <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 3, transition: 'width 0.8s ease', minWidth: pct > 0 ? 6 : 0 }} />
        </div>
      </div>
    );
  };

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>Reports & Analytics</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 4 }}>Live data from your CRM and property system</p>
      </div>

      {loading ? (
        <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>Loading reports...</div>
      ) : (
        <>
          {/* Overview */}
          <Section title="Business Overview">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
              <Metric label="Total Leads" value={data?.dashboard?.leads?.total ?? 0} sub="All time" color="#3b82f6" />
              <Metric label="Converted" value={data?.dashboard?.leads?.converted ?? 0} sub="Leads won" color="#22c55e" />
              <Metric label="Active Deals" value={data?.dashboard?.deals?.active ?? 0} sub="In pipeline" color="#8B1A2F" />
              <Metric label="Published" value={data?.dashboard?.properties?.published ?? 0} sub="Live listings" color="#a855f7" />
            </div>
          </Section>

          {/* Lead breakdown */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <Section title="Lead Status Breakdown">
              <div>
                {[
                  { label: 'new', value: data?.dashboard?.leads?.new ?? 0, color: '#3b82f6' },
                  { label: 'contacted', value: data?.dashboard?.leads?.contacted ?? 0, color: '#a855f7' },
                  { label: 'warm', value: data?.dashboard?.leads?.warm ?? 0, color: '#f5a623' },
                  { label: 'hot', value: data?.dashboard?.leads?.hot ?? 0, color: '#ef4444' },
                  { label: 'converted', value: data?.dashboard?.leads?.converted ?? 0, color: '#22c55e' },
                  { label: 'lost', value: data?.dashboard?.leads?.lost ?? 0, color: '#6b7280' },
                ].map(item => (
                  <Bar key={item.label} label={item.label} value={item.value} total={data?.dashboard?.leads?.total || 1} color={item.color} />
                ))}
              </div>
            </Section>

            <Section title="Property Listing Status">
              <div>
                {[
                  { label: 'published', value: data?.dashboard?.properties?.published ?? 0, color: '#22c55e' },
                  { label: 'pending review', value: data?.dashboard?.properties?.pending ?? 0, color: '#f5a623' },
                  { label: 'draft', value: data?.dashboard?.properties?.draft ?? 0, color: '#6b7280' },
                  { label: 'sold / let', value: data?.dashboard?.properties?.closed ?? 0, color: '#3b82f6' },
                ].map(item => (
                  <Bar key={item.label} label={item.label} value={item.value} total={data?.dashboard?.properties?.total || 1} color={item.color} />
                ))}
              </div>
            </Section>
          </div>

          {/* Lead source table */}
          {data?.leads?.by_source && (
            <Section title="Lead Sources">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
                {Object.entries(data.leads.by_source).map(([source, count]: any) => (
                  <div key={source} style={{ background: 'var(--bg-elevated)', borderRadius: 9, padding: '14px 16px', textAlign: 'center' }}>
                    <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>{count}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: 11.5, marginTop: 4, textTransform: 'capitalize' }}>{source.replace(/_/g, ' ')}</div>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Data note */}
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 5px #22c55e80', flexShrink: 0 }} />
            <p style={{ color: 'var(--text-muted)', fontSize: 12.5 }}>All data is pulled live from your Supabase database. Charts and agent performance reports will populate automatically as your team adds leads, properties, and deals.</p>
          </div>
        </>
      )}
    </div>
  );
}
