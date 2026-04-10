'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiFetch } from '../../lib/api';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({ totalLeads: 0, newLeads: 0, hotLeads: 0, activeDeals: 0, publishedListings: 0, pendingApproval: 0 });
  const [recentLeads, setRecentLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const userData = localStorage.getItem('user');
    if (!token) { router.push('/login'); return; }
    if (userData) setUser(JSON.parse(userData));
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [leadsRes, propsRes] = await Promise.allSettled([
        apiFetch('/leads'),
        apiFetch('/properties'),
      ]);
      const leads = leadsRes.status === 'fulfilled' ? leadsRes.value?.data || [] : [];
      const props = propsRes.status === 'fulfilled' ? propsRes.value?.data || [] : [];
      setStats({
        totalLeads: leads.length,
        newLeads: leads.filter((l: any) => l.status === 'new').length,
        hotLeads: leads.filter((l: any) => l.temperature === 'hot').length,
        activeDeals: 0,
        publishedListings: props.filter((p: any) => p.status === 'published').length,
        pendingApproval: props.filter((p: any) => p.status === 'pending_review').length,
      });
      setRecentLeads(leads.slice(0, 5));
    } catch (e) {} finally { setLoading(false); }
  };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const now = new Date();
  const dateStr = `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;

  const statCards = [
    { label: 'TOTAL LEADS', value: stats.totalLeads, sub: '→ All time', color: '#3b82f6' },
    { label: 'NEW LEADS', value: stats.newLeads, sub: '↑ Awaiting contact', color: '#8B1A2F' },
    { label: 'HOT LEADS', value: stats.hotLeads, sub: '↑ Needs urgent action', color: '#ef4444' },
    { label: 'ACTIVE DEALS', value: stats.activeDeals, sub: '↑ In pipeline', color: '#a855f7' },
    { label: 'PUBLISHED LISTINGS', value: stats.publishedListings, sub: '↑ Live on market', color: '#22c55e' },
    { label: 'PENDING APPROVAL', value: stats.pendingApproval, sub: '→ Needs review', color: '#f5a623' },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>{dateStr}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ background: '#8B1A2F', color: 'white', padding: '5px 14px', borderRadius: 8, fontSize: 11.5, fontWeight: 700, letterSpacing: '0.06em' }}>SUPER ADMIN</div>
        </div>
      </div>

      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
          {greeting}, {user?.full_name?.split(' ')[0] || 'Benjamin'} 👋
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Here's what's happening at Done & Space Properties today.</p>
      </div>

      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '12px 20px', marginBottom: 32, display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>🔍</span>
        <input placeholder="Search leads, properties, deals... (type to search)" style={{ background: 'none', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: 13.5, flex: 1, fontFamily: 'Outfit, sans-serif' }} />
        <span style={{ color: 'var(--text-muted)', fontSize: 11, background: 'var(--bg-elevated)', padding: '3px 8px', borderRadius: 5 }}>⌘K</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
        {statCards.map(card => (
          <div key={card.label} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '22px 24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div style={{ color: 'var(--text-muted)', fontSize: 11, fontWeight: 600, letterSpacing: '0.07em' }}>{card.label}</div>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: card.color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: card.color }} />
              </div>
            </div>
            <div style={{ fontSize: 36, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 10 }}>{loading ? '—' : card.value}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>{card.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div style={{ color: 'var(--text-primary)', fontSize: 14, fontWeight: 600 }}>Recent Leads</div>
            <Link href="/dashboard/leads" style={{ color: 'var(--accent)', fontSize: 12.5, textDecoration: 'none' }}>View all →</Link>
          </div>
          {recentLeads.length === 0 ? (
            <div style={{ color: 'var(--text-muted)', fontSize: 13, textAlign: 'center', padding: '32px 0' }}>No leads yet</div>
          ) : recentLeads.map((lead: any) => (
            <div key={lead.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
              <div style={{ color: 'var(--text-primary)', fontSize: 13 }}>{lead.full_name}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>{lead.status}</div>
            </div>
          ))}
        </div>

        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '24px' }}>
          <div style={{ color: 'var(--text-primary)', fontSize: 14, fontWeight: 600, marginBottom: 20 }}>Lead Pipeline</div>
          {[['New', stats.newLeads], ['Warm', 0], ['Hot', stats.hotLeads], ['Closed', 0]].map(([label, val]) => (
            <div key={label as string} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
              <div style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{label}</div>
              <div style={{ color: 'var(--text-primary)', fontSize: 13, fontWeight: 600 }}>{val}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
