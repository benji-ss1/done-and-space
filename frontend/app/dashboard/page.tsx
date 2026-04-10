'use client';
import { useEffect, useState } from 'react';
import { reportsAPI, leadsAPI, propertiesAPI } from '@/lib/api';
import StatCard from '@/components/StatCard';
import Badge from '@/components/Badge';
import { Users, Building2, Handshake, Clock, TrendingUp, AlertCircle, Plus, Search, X, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState<any>(null);
  const [searching, setSearching] = useState(false);
  const [recentLeads, setRecentLeads] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const u = localStorage.getItem('user');
    if (u) setUser(JSON.parse(u));
    Promise.all([
      reportsAPI.getDashboard(),
      leadsAPI.getAll({ limit: 5 }),
    ]).then(([rep, leads]) => {
      setData(rep.data);
      setRecentLeads(leads.data?.slice(0, 5) || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!search.trim()) { setSearchResults(null); return; }
    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const [leads, props] = await Promise.all([
          leadsAPI.getAll({ limit: 100 }),
          propertiesAPI.getAll({ limit: 100 }),
        ]);
        const q = search.toLowerCase();
        setSearchResults({
          leads: (leads.data || []).filter((l: any) => l.full_name?.toLowerCase().includes(q) || l.phone?.includes(q)).slice(0, 4),
          properties: (props.data || []).filter((p: any) => p.title?.toLowerCase().includes(q) || p.city?.toLowerCase().includes(q)).slice(0, 4),
        });
      } catch {}
      setSearching(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div>
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28, gap: 20, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            {greeting()}, {user?.full_name?.split(' ')[0] || 'Admin'} 👋
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: 5, fontSize: 13.5 }}>
            Here's what's happening at Done & Space Properties today.
          </p>
        </div>
        {/* Quick actions */}
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => router.push('/dashboard/leads/new')}
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-secondary)', padding: '8px 14px', borderRadius: 9, fontSize: 12.5, fontWeight: 500, cursor: 'pointer', fontFamily: 'Outfit, sans-serif', transition: 'all 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#8B1A2F'; e.currentTarget.style.color = 'var(--text-primary)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}>
            <Plus size={13} /> New Lead
          </button>
          <button onClick={() => router.push('/dashboard/properties/new')}
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#8B1A2F', border: '1px solid #8B1A2F', color: 'white', padding: '8px 14px', borderRadius: 9, fontSize: 12.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'Outfit, sans-serif', transition: 'all 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.background = '#a01f37'}
            onMouseLeave={e => e.currentTarget.style.background = '#8B1A2F'}>
            <Plus size={13} /> New Property
          </button>
        </div>
      </div>

      {/* Global Search */}
      <div style={{ position: 'relative', marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 11, padding: '11px 16px', transition: 'border-color 0.15s' }}
          onFocus={() => {}} >
          <Search size={15} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search leads, properties, deals... (type to search)"
            style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: 13.5, fontFamily: 'Outfit, sans-serif' }} />
          {search && <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}><X size={14} /></button>}
          <span style={{ color: 'var(--text-muted)', fontSize: 11, border: '1px solid var(--border)', padding: '2px 6px', borderRadius: 5 }}>⌘K</span>
        </div>

        {/* Search dropdown */}
        {searchResults && (
          <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'var(--bg-elevated)', border: '1px solid var(--border-light)', borderRadius: 11, marginTop: 6, zIndex: 100, overflow: 'hidden', boxShadow: '0 20px 60px #00000060' }}>
            {searchResults.leads?.length > 0 && (
              <div>
                <div style={{ padding: '10px 16px 6px', color: 'var(--text-muted)', fontSize: 10.5, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Leads</div>
                {searchResults.leads.map((l: any) => (
                  <div key={l.id} onClick={() => { router.push(`/dashboard/leads/${l.id}`); setSearch(''); }}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', cursor: 'pointer', transition: 'background 0.1s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <div>
                      <div style={{ color: 'var(--text-primary)', fontSize: 13.5, fontWeight: 500 }}>{l.full_name}</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: 11.5, marginTop: 1 }}>{l.phone} · {l.source}</div>
                    </div>
                    <Badge status={l.status} />
                  </div>
                ))}
              </div>
            )}
            {searchResults.properties?.length > 0 && (
              <div style={{ borderTop: '1px solid var(--border)' }}>
                <div style={{ padding: '10px 16px 6px', color: 'var(--text-muted)', fontSize: 10.5, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Properties</div>
                {searchResults.properties.map((p: any) => (
                  <div key={p.id} onClick={() => { router.push('/dashboard/properties'); setSearch(''); }}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', cursor: 'pointer', transition: 'background 0.1s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <div>
                      <div style={{ color: 'var(--text-primary)', fontSize: 13.5, fontWeight: 500 }}>{p.title}</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: 11.5, marginTop: 1 }}>{p.city} · ZMW {Number(p.price).toLocaleString()}</div>
                    </div>
                    <Badge status={p.status} />
                  </div>
                ))}
              </div>
            )}
            {searchResults.leads?.length === 0 && searchResults.properties?.length === 0 && (
              <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>No results for "{search}"</div>
            )}
          </div>
        )}
      </div>

      {loading ? (
        <div style={{ color: 'var(--text-muted)', fontSize: 14 }}>Loading dashboard...</div>
      ) : (
        <>
          {/* Stat Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 24 }}>
            <StatCard label="Total Leads" value={data?.leads?.total ?? 0} icon={<Users size={15} />} trend="All time" accent="#3b82f6" />
            <StatCard label="New Leads" value={data?.leads?.new ?? 0} icon={<TrendingUp size={15} />} trend="Awaiting contact" trendUp accent="#8B1A2F" />
            <StatCard label="Hot Leads" value={data?.leads?.hot ?? 0} icon={<AlertCircle size={15} />} trend="Needs urgent action" trendUp accent="#ef4444" />
            <StatCard label="Active Deals" value={data?.deals?.active ?? 0} icon={<Handshake size={15} />} trend="In pipeline" trendUp accent="#a855f7" />
            <StatCard label="Published Listings" value={data?.properties?.published ?? 0} icon={<Building2 size={15} />} trend="Live on market" trendUp accent="#22c55e" />
            <StatCard label="Pending Approval" value={data?.properties?.pending ?? 0} icon={<Clock size={15} />} trend="Needs review" accent="#f5a623" />
          </div>

          {/* Bottom grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {/* Recent leads */}
            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 20px', borderBottom: '1px solid var(--border)' }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>Recent Leads</h3>
                <button onClick={() => router.push('/dashboard/leads')} style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: 12, cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>
                  View all <ArrowRight size={11} />
                </button>
              </div>
              {recentLeads.length === 0 ? (
                <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>No leads yet</div>
              ) : recentLeads.map((lead, i) => (
                <div key={lead.id} onClick={() => router.push(`/dashboard/leads/${lead.id}`)}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', borderBottom: i < recentLeads.length - 1 ? '1px solid var(--border)' : 'none', cursor: 'pointer', transition: 'background 0.1s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-elevated)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 30, height: 30, borderRadius: 8, background: 'var(--accent-light)', border: '1px solid var(--accent-mid)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c0374f', fontWeight: 700, fontSize: 12, flexShrink: 0 }}>
                      {lead.full_name?.[0]}
                    </div>
                    <div>
                      <div style={{ color: 'var(--text-primary)', fontSize: 13, fontWeight: 500 }}>{lead.full_name}</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: 11, marginTop: 1 }}>{lead.phone}</div>
                    </div>
                  </div>
                  <Badge status={lead.status} />
                </div>
              ))}
            </div>

            {/* Lead pipeline + system */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '18px 20px' }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 18 }}>Lead Pipeline</h3>
                {[
                  { label: 'New', value: data?.leads?.new ?? 0, color: '#3b82f6' },
                  { label: 'Warm', value: data?.leads?.warm ?? 0, color: '#f5a623' },
                  { label: 'Hot', value: data?.leads?.hot ?? 0, color: '#ef4444' },
                  { label: 'Converted', value: data?.leads?.converted ?? 0, color: '#22c55e' },
                ].map(item => {
                  const total = Math.max(data?.leads?.total || 1, 1);
                  const pct = Math.round((item.value / total) * 100);
                  return (
                    <div key={item.label} style={{ marginBottom: 14 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                        <span style={{ color: 'var(--text-secondary)', fontSize: 12.5 }}>{item.label}</span>
                        <span style={{ color: 'var(--text-primary)', fontSize: 12.5, fontWeight: 600, fontFamily: 'DM Mono, monospace' }}>{item.value}</span>
                      </div>
                      <div style={{ height: 5, background: 'var(--bg-elevated)', borderRadius: 3 }}>
                        <div style={{ height: '100%', width: `${pct || 0}%`, background: item.color, borderRadius: 3, minWidth: pct > 0 ? 8 : 0 }} />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '18px 20px' }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 14 }}>System Status</h3>
                {['API Backend', 'Database', 'File Storage', 'CRM Engine'].map(item => (
                  <div key={item} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid var(--border)' }}>
                    <span style={{ color: 'var(--text-secondary)', fontSize: 12.5 }}>{item}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 5px #22c55e80' }} />
                      <span style={{ color: '#22c55e', fontSize: 11.5, fontWeight: 500 }}>Operational</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
