'use client';
import { useState } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://done-space-backend-production.up.railway.app/api/v1';

const SERVICE_CATEGORIES = [
  { title: 'Plumbing & Water', body: 'Pipes, taps, geysers, drainage, toilets, and water pressure issues across the property.' },
  { title: 'Electrical Systems', body: 'Circuit breakers, wiring, lighting, ZESCO connection issues, and safety inspections.' },
  { title: 'Structural & Building', body: 'Cracks, roof leaks, doors, windows, gates, flooring, and general building defects.' },
  { title: 'HVAC & Climate', body: 'Air conditioning installation, servicing, repairs, and ventilation systems.' },
  { title: 'Security Systems', body: 'Alarm systems, electric fencing, CCTV, access control, and locks.' },
  { title: 'Preventive Servicing', body: 'Scheduled inspections, gutter clearing, pest control, and routine maintenance to prevent failures before they occur.' },
];

const AI_BENEFITS = [
  'Predictive scheduling — service before breakdown',
  'Full cost tracking per property',
  'Tenant communication automated',
  'Service history linked to each property',
];

const STEPS = [
  { n: '01', title: 'Submit Your Request', body: 'Fill in the form below with property details and issue description.' },
  { n: '02', title: 'We Log & Assign', body: 'Your request enters our system immediately. A technician is assigned.' },
  { n: '03', title: 'Resolution & Report', body: 'We fix the issue and send you a completion report.' },
];

export default function MaintenancePage() {
  const [form, setForm] = useState({
    full_name: '', phone: '', email: '', property_address: '',
    category: '', urgency: '', issue: '', role: 'Tenant',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [refNumber] = useState(() => `MNT-${Date.now().toString().slice(-8)}`);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const submit = async () => {
    if (!form.full_name.trim() || !form.phone.trim() || !form.issue.trim()) {
      setError('Name, phone, and issue description are required.');
      return;
    }
    setSubmitting(true); setError('');
    try {
      const res = await fetch(`${API}/leads/inquiry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: form.full_name,
          phone: form.phone,
          email: form.email || undefined,
          source: 'other',
          interest_type: 'rent',
          notes: `MAINTENANCE REQUEST [${form.urgency || 'Routine'}] · Ref: ${refNumber} · Category: ${form.category || 'General'} · Role: ${form.role} · Address: ${form.property_address || 'Not provided'} · Issue: ${form.issue}`,
        }),
      });
      if (!res.ok) throw new Error('Submission failed');
      setSubmitted(true);
    } catch (e: any) {
      setError(e.message || 'Something went wrong. Please try again or call us directly.');
    }
    setSubmitting(false);
  };

  const inputStyle: any = {
    width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
    color: 'white', padding: '11px 14px', borderRadius: 2, fontSize: 13.5, outline: 'none',
    fontFamily: 'Outfit, sans-serif', boxSizing: 'border-box',
  };
  const labelStyle: any = {
    display: 'block', color: 'rgba(255,255,255,0.5)', fontSize: 10.5, fontWeight: 600,
    letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6, fontFamily: 'Outfit, sans-serif',
  };

  return (
    <main>
      {/* ─── HERO ─── */}
      <section style={{
        background: 'linear-gradient(150deg, #3A0510 0%, #5C0A1A 100%)',
        padding: '120px 24px 80px', minHeight: '40vh', display: 'flex', alignItems: 'center',
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', width: '100%' }}>
          <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--gold, #C4992A)', display: 'block', marginBottom: 20 }}>
            Property Maintenance
          </span>
          <h1 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(36px, 5vw, 52px)', fontWeight: 600, color: 'white', lineHeight: 1.1, marginBottom: 20, maxWidth: 700 }}>
            Report a Maintenance Issue
          </h1>
          <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: 17, color: 'rgba(255,255,255,0.75)', maxWidth: 560, lineHeight: 1.7, marginBottom: 28 }}>
            Submit your request and our property management team will respond within 24 hours. Every request is logged, assigned, and tracked to completion.
          </p>
          <div style={{ display: 'inline-block', border: '1px solid rgba(196,153,42,0.5)', color: 'var(--gold-light, #E8B84B)', padding: '8px 18px', borderRadius: 20, fontFamily: 'Outfit, sans-serif', fontSize: 12.5, fontWeight: 600, letterSpacing: '0.06em' }}>
            24-Hour Response Commitment
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section style={{ background: '#FFFFFF', padding: '80px 24px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gold, #C4992A)', display: 'block', marginBottom: 16 }}>Process</span>
          <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 600, color: 'var(--ink, #0F0A08)', marginBottom: 48, lineHeight: 1.15 }}>How It Works</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 }}>
            {STEPS.map((step, i) => (
              <div key={i} style={{ borderLeft: '3px solid var(--gold, #C4992A)', paddingLeft: 24 }}>
                <div style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 36, fontWeight: 700, color: 'var(--gold, #C4992A)', opacity: 0.6, lineHeight: 1, marginBottom: 12 }}>{step.n}</div>
                <h3 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 20, fontWeight: 600, color: 'var(--ink, #0F0A08)', marginBottom: 8 }}>{step.title}</h3>
                <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: 14, color: 'var(--ink-secondary, #4A3830)', lineHeight: 1.65 }}>{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SERVICE CATEGORIES ─── */}
      <section style={{ background: 'var(--cream, #F8F3ED)', padding: '80px 24px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gold, #C4992A)', display: 'block', marginBottom: 16 }}>Services</span>
          <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 600, color: 'var(--ink, #0F0A08)', marginBottom: 48, lineHeight: 1.15 }}>What We Handle</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {SERVICE_CATEGORIES.map((s, i) => (
              <div key={i} style={{ background: 'white', border: '1px solid var(--border, #E8DDD6)', padding: '28px', borderRadius: 4 }}>
                <h3 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 20, fontWeight: 600, color: 'var(--ink, #0F0A08)', marginBottom: 10, lineHeight: 1.2 }}>{s.title}</h3>
                <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: 14, color: 'var(--ink-secondary, #4A3830)', lineHeight: 1.65 }}>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── INTELLIGENT MAINTENANCE + FORM ─── */}
      <section style={{ background: 'var(--brand, #7B1D2A)', padding: '80px 24px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 520px', gap: 64, alignItems: 'start' }}>
          {/* Left — pitch */}
          <div>
            <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gold, #C4992A)', display: 'block', marginBottom: 20 }}>Intelligent Maintenance</span>
            <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 600, color: 'white', lineHeight: 1.15, marginBottom: 24 }}>
              We Don't Wait for Problems.
            </h2>
            <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: 15, color: 'rgba(255,255,255,0.75)', lineHeight: 1.8, marginBottom: 36 }}>
              Our AI-assisted maintenance system monitors property assets, schedules preventive servicing, and alerts management before failures occur. Longer asset life. Fewer emergency call-outs. Happier tenants.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {AI_BENEFITS.map((b, i) => (
                <div key={i} style={{ borderLeft: '3px solid var(--gold, #C4992A)', paddingLeft: 20 }}>
                  <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: 14.5, color: 'rgba(255,255,255,0.8)', lineHeight: 1.5 }}>{b}</p>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 40, padding: '20px 24px', background: 'rgba(0,0,0,0.15)', borderRadius: 2 }}>
              <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>For emergencies, call us directly:</p>
              <a href="tel:+260971000000" style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 28, fontWeight: 700, color: 'var(--gold-light, #E8B84B)', textDecoration: 'none' }}>
                +260 971 000 000
              </a>
            </div>
          </div>

          {/* Right — form */}
          <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.12)', padding: '36px', borderRadius: 2 }}>
            <h3 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 24, fontWeight: 600, color: 'white', marginBottom: 6 }}>Submit a Maintenance Request</h3>
            <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: 13.5, color: 'rgba(255,255,255,0.5)', marginBottom: 24 }}>Fill in the details and we will coordinate the repair.</p>

            {submitted ? (
              <div style={{ textAlign: 'center', padding: '32px 0' }}>
                <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <span style={{ color: '#22c55e', fontSize: 24 }}>✓</span>
                </div>
                <h3 style={{ color: 'white', fontSize: 18, fontWeight: 700, marginBottom: 8, fontFamily: 'Outfit, sans-serif' }}>Request Received!</h3>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, fontFamily: 'Outfit, sans-serif', lineHeight: 1.6 }}>
                  Reference number: <strong style={{ color: 'var(--gold-light, #E8B84B)' }}>{refNumber}</strong><br />
                  Our team will contact you within 24 hours.<br />
                  For emergencies: <a href="tel:+260971000000" style={{ color: 'var(--gold-light, #E8B84B)' }}>+260 971 000 000</a>
                </p>
              </div>
            ) : (
              <>
                {error && <div style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171', padding: '10px 14px', borderRadius: 2, marginBottom: 16, fontSize: 13 }}>{error}</div>}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div><label style={labelStyle}>Your Name *</label><input style={inputStyle} value={form.full_name} onChange={e => set('full_name', e.target.value)} placeholder="Full name" /></div>
                    <div><label style={labelStyle}>Phone *</label><input style={inputStyle} value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+260..." /></div>
                  </div>
                  <div><label style={labelStyle}>Email</label><input type="email" style={inputStyle} value={form.email} onChange={e => set('email', e.target.value)} placeholder="your@email.com" /></div>
                  <div><label style={labelStyle}>Property Address *</label><input style={inputStyle} value={form.property_address} onChange={e => set('property_address', e.target.value)} placeholder="Street, area, city" /></div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div>
                      <label style={labelStyle}>Issue Category</label>
                      <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.category} onChange={e => set('category', e.target.value)}>
                        <option value="">Select category</option>
                        <option value="Plumbing">Plumbing</option>
                        <option value="Electrical">Electrical</option>
                        <option value="Structural">Structural</option>
                        <option value="HVAC/AC">HVAC/AC</option>
                        <option value="Security">Security</option>
                        <option value="Preventive">Preventive</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label style={labelStyle}>Urgency Level</label>
                      <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.urgency} onChange={e => set('urgency', e.target.value)}>
                        <option value="">Select urgency</option>
                        <option value="Emergency">Emergency — Immediate risk to safety</option>
                        <option value="Urgent">Urgent — Needs attention within 48 hours</option>
                        <option value="Routine">Routine — Within the week is fine</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Describe the Issue *</label>
                    <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: 90 }} value={form.issue} onChange={e => set('issue', e.target.value)} placeholder="What needs to be fixed? Any relevant details..." />
                  </div>
                  <div>
                    <label style={labelStyle}>You Are a</label>
                    <div style={{ display: 'flex', gap: 16 }}>
                      {['Tenant', 'Owner'].map(r => (
                        <label key={r} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontFamily: 'Outfit, sans-serif', fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>
                          <input type="radio" name="role" value={r} checked={form.role === r} onChange={e => set('role', e.target.value)} style={{ accentColor: 'var(--gold, #C4992A)' }} />
                          {r}
                        </label>
                      ))}
                    </div>
                  </div>
                  <button onClick={submit} disabled={submitting} style={{ background: 'var(--gold, #C4992A)', color: 'var(--ink, #0F0A08)', border: 'none', padding: '13px', borderRadius: 2, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'Outfit, sans-serif', opacity: submitting ? 0.7 : 1, letterSpacing: '0.02em' }}>
                    {submitting ? 'Submitting...' : 'Submit Request'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 900px) {
          section > div[style*="repeat(3, 1fr)"] { grid-template-columns: 1fr 1fr !important; }
          section > div[style*="1fr 520px"] { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 600px) {
          section > div[style*="repeat(3, 1fr)"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  );
}
