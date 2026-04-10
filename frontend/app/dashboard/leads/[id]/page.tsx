'use client';
import { useEffect, useState } from 'react';
import { leadsAPI } from '@/lib/api';
import Badge from '@/components/Badge';
import { ArrowLeft, Phone, Mail, MessageSquare, Eye, FileText, Save, Plus } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';

const STATUSES = ['new','contacted','qualified','warm','hot','cold','lost','converted'];
const INTERACTION_TYPES = ['call','email','whatsapp','viewing','note','meeting'];

export default function LeadDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [lead, setLead] = useState<any>(null);
  const [interactions, setInteractions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showLog, setShowLog] = useState(false);
  const [logForm, setLogForm] = useState({ type: 'call', notes: '', outcome: '', new_status: '', next_action_date: '' });

  const load = async () => {
    try {
      const res = await leadsAPI.getOne(id);
      setLead(res.data);
    } catch {}
    setLoading(false);
  };
  useEffect(() => { load(); }, [id]);

  const updateStatus = async (status: string) => {
    setSaving(true);
    await leadsAPI.update(id, { status });
    await load();
    setSaving(false);
  };

  const submitLog = async () => {
    if (!logForm.notes.trim()) return;
    setSaving(true);
    await leadsAPI.interact(id, logForm);
    setLogForm({ type: 'call', notes: '', outcome: '', new_status: '', next_action_date: '' });
    setShowLog(false);
    await load();
    setSaving(false);
  };

  const TYPE_ICONS: any = { call: <Phone size={12} />, email: <Mail size={12} />, whatsapp: <MessageSquare size={12} />, viewing: <Eye size={12} />, note: <FileText size={12} />, meeting: <FileText size={12} /> };
  const TYPE_COLOR: any = { call: '#22c55e', email: '#3b82f6', whatsapp: '#22c55e', viewing: '#a855f7', note: '#f5a623', meeting: '#f5a623' };

  if (loading) return <div style={{ color: 'var(--text-muted)', padding: 32 }}>Loading lead...</div>;
  if (!lead) return <div style={{ color: 'var(--text-muted)', padding: 32 }}>Lead not found.</div>;

  return (
    <div>
      {/* Back */}
      <button onClick={() => router.push('/dashboard/leads')} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: 13, cursor: 'pointer', fontFamily: 'Outfit, sans-serif', marginBottom: 24 }}>
        <ArrowLeft size={14} /> Back to Leads
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 16 }}>
        {/* Left — lead info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Header card */}
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--accent-light)', border: '1px solid var(--accent-mid)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c0374f', fontWeight: 700, fontSize: 20 }}>
                  {lead.full_name?.[0]}
                </div>
                <div>
                  <h1 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>{lead.full_name}</h1>
                  <div style={{ color: 'var(--text-muted)', fontSize: 12.5, marginTop: 3 }}>Added {new Date(lead.created_at).toLocaleDateString()} · Source: {lead.source}</div>
                </div>
              </div>
              <Badge status={lead.status} />
            </div>

            {/* Contact details */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                { label: 'Phone', value: lead.phone, mono: true },
                { label: 'Email', value: lead.email || '—', mono: false },
                { label: 'Interest', value: lead.interest_type || '—', capitalize: true },
                { label: 'Budget (ZMW)', value: lead.budget_max ? Number(lead.budget_max).toLocaleString() : '—', mono: true },
                { label: 'Preferred Location', value: lead.preferred_location || '—' },
                { label: 'Next Action', value: lead.next_action_date ? new Date(lead.next_action_date).toLocaleDateString() : '—' },
              ].map(f => (
                <div key={f.label} style={{ background: 'var(--bg-elevated)', borderRadius: 9, padding: '12px 14px' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: 10.5, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 5 }}>{f.label}</div>
                  <div style={{ color: 'var(--text-primary)', fontSize: 13.5, fontFamily: (f as any).mono ? 'DM Mono, monospace' : 'inherit', textTransform: (f as any).capitalize ? 'capitalize' : 'none' }}>{f.value}</div>
                </div>
              ))}
            </div>

            {lead.notes && (
              <div style={{ marginTop: 14, background: 'var(--bg-elevated)', borderRadius: 9, padding: '12px 14px' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: 10.5, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 5 }}>Notes</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: 13.5, lineHeight: 1.6 }}>{lead.notes}</div>
              </div>
            )}
          </div>

          {/* Interaction log */}
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>Activity Log</h3>
              <button onClick={() => setShowLog(!showLog)}
                style={{ display: 'flex', alignItems: 'center', gap: 5, background: '#8B1A2F', border: 'none', color: 'white', padding: '6px 12px', borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>
                <Plus size={12} /> Log Activity
              </button>
            </div>

            {showLog && (
              <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', background: 'var(--bg-elevated)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
                  <div>
                    <label style={{ color: 'var(--text-muted)', fontSize: 11, display: 'block', marginBottom: 5 }}>Type</label>
                    <select value={logForm.type} onChange={e => setLogForm({ ...logForm, type: e.target.value })}
                      style={{ width: '100%', background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-primary)', padding: '8px 10px', borderRadius: 7, fontSize: 13, fontFamily: 'Outfit, sans-serif', outline: 'none' }}>
                      {INTERACTION_TYPES.map(t => <option key={t} value={t} style={{ textTransform: 'capitalize' }}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ color: 'var(--text-muted)', fontSize: 11, display: 'block', marginBottom: 5 }}>Update Status</label>
                    <select value={logForm.new_status} onChange={e => setLogForm({ ...logForm, new_status: e.target.value })}
                      style={{ width: '100%', background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-primary)', padding: '8px 10px', borderRadius: 7, fontSize: 13, fontFamily: 'Outfit, sans-serif', outline: 'none' }}>
                      <option value="">Keep current</option>
                      {STATUSES.map(s => <option key={s} value={s} style={{ textTransform: 'capitalize' }}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <textarea value={logForm.notes} onChange={e => setLogForm({ ...logForm, notes: e.target.value })}
                  placeholder="What happened? What was discussed? What are the next steps?"
                  rows={3}
                  style={{ width: '100%', background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-primary)', padding: '10px 12px', borderRadius: 7, fontSize: 13, fontFamily: 'Outfit, sans-serif', outline: 'none', resize: 'vertical', boxSizing: 'border-box', marginBottom: 10 }} />
                <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                  <button onClick={() => setShowLog(false)} style={{ background: 'none', border: '1px solid var(--border)', color: 'var(--text-secondary)', padding: '7px 14px', borderRadius: 7, fontSize: 12.5, cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>Cancel</button>
                  <button onClick={submitLog} disabled={saving}
                    style={{ display: 'flex', alignItems: 'center', gap: 5, background: '#8B1A2F', border: 'none', color: 'white', padding: '7px 14px', borderRadius: 7, fontSize: 12.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>
                    <Save size={12} /> {saving ? 'Saving...' : 'Save Log'}
                  </button>
                </div>
              </div>
            )}

            {/* Interactions list */}
            <div>
              {(!lead.lead_interactions || lead.lead_interactions.length === 0) ? (
                <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>No activity logged yet. Log your first interaction above.</div>
              ) : [...lead.lead_interactions].reverse().map((i: any, idx: number) => (
                <div key={i.id} style={{ padding: '14px 20px', borderBottom: idx < lead.lead_interactions.length - 1 ? '1px solid var(--border)' : 'none', display: 'flex', gap: 12 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 7, background: (TYPE_COLOR[i.type] || '#888') + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', color: TYPE_COLOR[i.type] || '#888', flexShrink: 0, marginTop: 2 }}>
                    {TYPE_ICONS[i.type]}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ color: 'var(--text-primary)', fontSize: 13, fontWeight: 500, textTransform: 'capitalize' }}>{i.type}</span>
                      <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>{new Date(i.interaction_date).toLocaleDateString()} {new Date(i.interaction_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.6 }}>{i.notes}</div>
                    {i.outcome && <div style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 4 }}>Outcome: {i.outcome}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Update status */}
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '18px' }}>
            <h3 style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 14 }}>Update Status</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {STATUSES.map(s => (
                <button key={s} onClick={() => updateStatus(s)} disabled={lead.status === s || saving}
                  style={{ textAlign: 'left', padding: '9px 12px', borderRadius: 8, fontSize: 12.5, fontWeight: lead.status === s ? 600 : 400, cursor: lead.status === s ? 'default' : 'pointer', fontFamily: 'Outfit, sans-serif', textTransform: 'capitalize', border: '1px solid', background: lead.status === s ? 'var(--accent-light)' : 'transparent', color: lead.status === s ? '#c0374f' : 'var(--text-secondary)', borderColor: lead.status === s ? 'var(--accent-mid)' : 'transparent', transition: 'all 0.15s' }}
                  onMouseEnter={e => { if (lead.status !== s) e.currentTarget.style.background = 'var(--bg-elevated)'; }}
                  onMouseLeave={e => { if (lead.status !== s) e.currentTarget.style.background = 'transparent'; }}>
                  {lead.status === s ? '✓ ' : ''}{s}
                </button>
              ))}
            </div>
          </div>

          {/* Quick actions */}
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '18px' }}>
            <h3 style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 14 }}>Quick Actions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { label: 'Log a Call', icon: <Phone size={13} />, type: 'call' },
                { label: 'Send WhatsApp', icon: <MessageSquare size={13} />, type: 'whatsapp' },
                { label: 'Schedule Viewing', icon: <Eye size={13} />, type: 'viewing' },
                { label: 'Add Note', icon: <FileText size={13} />, type: 'note' },
              ].map(a => (
                <button key={a.type} onClick={() => { setLogForm({ ...logForm, type: a.type }); setShowLog(true); }}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 12px', borderRadius: 8, background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-secondary)', fontSize: 13, cursor: 'pointer', fontFamily: 'Outfit, sans-serif', transition: 'all 0.15s', textAlign: 'left' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#8B1A2F50'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}>
                  {a.icon} {a.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
