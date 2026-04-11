'use client';
import { useState } from 'react';
import { Wrench, CheckCircle, Clock, Phone, AlertTriangle, Zap, Droplets, ThermometerSun, Home, Shield } from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://done-space-backend-production.up.railway.app/api/v1';

const SERVICES = [
  { icon: <Zap size={18} />, title: 'Electrical', desc: 'Wiring, circuit breakers, lighting, and ZESCO installations.' },
  { icon: <Droplets size={18} />, title: 'Plumbing', desc: 'Pipes, taps, toilets, geysers, and drainage issues.' },
  { icon: <ThermometerSun size={18} />, title: 'HVAC / AC', desc: 'Air conditioning servicing, installation and repairs.' },
  { icon: <Home size={18} />, title: 'General Repairs', desc: 'Painting, tiling, doors, windows, roofing and plastering.' },
  { icon: <Shield size={18} />, title: 'Security Systems', desc: 'Alarm systems, CCTV installation, access control.' },
  { icon: <Wrench size={18} />, title: 'Appliance Repair', desc: 'Fridge, washing machine, oven, geyser and more.' },
];

const PRIORITIES = [
  { value: 'emergency', label: 'Emergency', desc: 'Immediate risk — flooding, gas leak, no power' },
  { value: 'urgent', label: 'Urgent', desc: 'Affects daily life — broken geyser, blocked drain' },
  { value: 'routine', label: 'Routine', desc: 'Non-urgent — minor repairs, general maintenance' },
];

export default function MaintenancePage() {
  const [form, setForm] = useState({ full_name: '', phone: '', email: '', issue: '', priority: 'routine', property_address: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const submit = async () => {
    if (!form.full_name || !form.phone || !form.issue) { setError('Name, phone and issue description are required.'); return; }
    setSubmitting(true); setError('');
    try {
      const res = await fetch(`${API}/leads/inquiry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: form.full_name,
          phone: form.phone,
          email: form.email || undefined,
          source: 'website',
          interest_type: 'buy',
          notes: `MAINTENANCE REQUEST [${form.priority.toUpperCase()}] — Address: ${form.property_address || 'Not provided'}. Issue: ${form.issue}`,
        }),
      });
      if (!res.ok) throw new Error('Submission failed');
      setSubmitted(true);
    } catch (e: any) {
      setError(e.message || 'Something went wrong. Please try again or call us directly.');
    }
    setSubmitting(false);
  };

  const inputStyle: any = { width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '11px 14px', borderRadius: 9, fontSize: 13.5, outline: 'none', fontFamily: 'Outfit, sans-serif', boxSizing: 'border-box' };
  const labelStyle: any = { display: 'block', color: 'rgba(255,255,255,0.45)', fontSize: 11, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 6 };

  return (
    <main style={{ background: '#0a0608', minHeight: '100vh', paddingTop: 68 }}>
      {/* Hero */}
      <section style={{ padding: '64px 24px 72px', background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(245,166,35,0.08) 0%, transparent 70%)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ maxWidth: 600, marginBottom: 52 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(245,166,35,0.1)', border: '1px solid rgba(245,166,35,0.2)', padding: '5px 12px', borderRadius: 20, marginBottom: 20 }}>
              <Wrench size={13} style={{ color: '#f5a623' }} />
              <span style={{ color: '#f5a623', fontSize: 11.5, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase' }}>Maintenance</span>
            </div>
            <h1 style={{ fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 20 }}>
              Property Maintenance<br /><span style={{ color: '#f5a623' }}>That Gets Done</span>
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 16, lineHeight: 1.75 }}>
              Fast, reliable maintenance solutions for tenants and property owners. Report an issue and our team will coordinate the right contractor.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
            {SERVICES.map((s, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '20px' }}>
                <div style={{ color: '#f5a623', marginBottom: 10 }}>{s.icon}</div>
                <h3 style={{ color: 'white', fontSize: 14, fontWeight: 600, marginBottom: 5 }}>{s.title}</h3>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12.5, lineHeight: 1.55 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Request form */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 480px', gap: 56, alignItems: 'start' }}>
          <div>
            <p style={{ color: '#f5a623', fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>Response Times</p>
            <h2 style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 700, letterSpacing: '-0.025em', marginBottom: 20 }}>Our Commitment to You</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {PRIORITIES.map((p, i) => (
                <div key={i} style={{ display: 'flex', gap: 16, padding: '18px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 9, background: i === 0 ? 'rgba(239,68,68,0.1)' : i === 1 ? 'rgba(245,166,35,0.1)' : 'rgba(34,197,94,0.1)', border: `1px solid ${i === 0 ? 'rgba(239,68,68,0.2)' : i === 1 ? 'rgba(245,166,35,0.2)' : 'rgba(34,197,94,0.2)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {i === 0 ? <AlertTriangle size={18} style={{ color: '#f87171' }} /> : <Clock size={18} style={{ color: i === 1 ? '#f5a623' : '#4ade80' }} />}
                  </div>
                  <div>
                    <h3 style={{ color: 'white', fontSize: 14.5, fontWeight: 600, marginBottom: 3 }}>{p.label}</h3>
                    <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13 }}>{p.desc}</p>
                    <p style={{ color: i === 0 ? '#f87171' : i === 1 ? '#f5a623' : '#4ade80', fontSize: 12.5, fontWeight: 600, marginTop: 4 }}>
                      {i === 0 ? 'Response within 2 hours' : i === 1 ? 'Response within 24 hours' : 'Response within 48–72 hours'}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 28, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '20px 24px' }}>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, marginBottom: 6 }}>For emergencies, call us directly:</p>
              <a href="tel:+260971000000" style={{ color: 'white', fontSize: 18, fontWeight: 700, textDecoration: 'none' }}>+260 971 000 000</a>
            </div>
          </div>

          {/* Form */}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '32px' }}>
            <h2 style={{ color: 'white', fontSize: 18, fontWeight: 700, marginBottom: 6 }}>Submit a Maintenance Request</h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, marginBottom: 24 }}>Fill in the form and we'll coordinate the repair.</p>

            {submitted ? (
              <div style={{ textAlign: 'center', padding: '32px 0' }}>
                <CheckCircle size={44} style={{ color: '#22c55e', margin: '0 auto 14px', display: 'block' }} />
                <h3 style={{ color: 'white', fontSize: 17, fontWeight: 700, marginBottom: 8 }}>Request Received!</h3>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13.5 }}>We'll contact you shortly to arrange the repair.</p>
              </div>
            ) : (
              <>
                {error && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', padding: '10px 14px', borderRadius: 8, marginBottom: 16, fontSize: 13 }}>{error}</div>}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div><label style={labelStyle}>Full Name *</label><input style={inputStyle} value={form.full_name} onChange={e => set('full_name', e.target.value)} placeholder="Your name" /></div>
                    <div><label style={labelStyle}>Phone *</label><input style={inputStyle} value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+260..." /></div>
                  </div>
                  <div><label style={labelStyle}>Email</label><input type="email" style={inputStyle} value={form.email} onChange={e => set('email', e.target.value)} placeholder="your@email.com" /></div>
                  <div><label style={labelStyle}>Property Address</label><input style={inputStyle} value={form.property_address} onChange={e => set('property_address', e.target.value)} placeholder="Street, Area, City" /></div>
                  <div>
                    <label style={labelStyle}>Priority Level</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {PRIORITIES.map(p => (
                        <label key={p.value} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '10px 14px', background: form.priority === p.value ? 'rgba(245,166,35,0.08)' : 'rgba(255,255,255,0.02)', border: `1px solid ${form.priority === p.value ? 'rgba(245,166,35,0.25)' : 'rgba(255,255,255,0.07)'}`, borderRadius: 8, transition: 'all 0.15s' }}>
                          <input type="radio" name="priority" value={p.value} checked={form.priority === p.value} onChange={e => set('priority', e.target.value)} style={{ accentColor: '#f5a623' }} />
                          <div>
                            <div style={{ color: 'white', fontSize: 13, fontWeight: 500 }}>{p.label}</div>
                            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>{p.desc}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div><label style={labelStyle}>Describe the Issue *</label><textarea style={{ ...inputStyle, resize: 'vertical', minHeight: 90 }} value={form.issue} onChange={e => set('issue', e.target.value)} placeholder="What needs to be fixed? Any relevant details..." /></div>
                  <button onClick={submit} disabled={submitting} style={{ background: '#f5a623', border: 'none', color: '#1a0f11', padding: '13px', borderRadius: 9, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'Outfit, sans-serif', opacity: submitting ? 0.7 : 1 }}>
                    {submitting ? 'Submitting...' : 'Submit Request'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
