'use client';
import { useState } from 'react';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://done-space-backend-production.up.railway.app/api/v1';

const AI_CARDS = [
  { n: '01', title: 'Intelligent Site Selection', body: 'AI analyzes demographics, income levels, infrastructure quality, and market demand to identify high-potential development sites.' },
  { n: '02', title: 'Predictive Market Intelligence', body: 'Demand forecasting and pricing models show what the market will need — before you commit capital to a development.' },
  { n: '03', title: 'Smart Design Optimization', body: 'Layout efficiency analysis and environmental performance simulation ensure every unit delivers maximum liveability and value.' },
  { n: '04', title: 'Cost & Resource Control', body: 'Real-time budget monitoring and supplier benchmarking reduce waste and improve completion margins on every project.' },
  { n: '05', title: 'Project Risk Intelligence', body: 'Timeline, budget, and market shift monitoring with automated alerts — so management sees problems before they become crises.' },
];

const STAGES = [
  { n: '1', title: 'Concept & Feasibility', body: 'Site analysis, demand study, and financial modelling' },
  { n: '2', title: 'Planning & Approvals', body: 'Architectural design, council submissions, regulatory compliance' },
  { n: '3', title: 'Infrastructure Development', body: 'Foundation, services, road access, and utilities' },
  { n: '4', title: 'Construction', body: 'Quality-controlled build with milestone reporting' },
  { n: '5', title: 'Marketing & Pre-Sales', body: 'Unit launches, buyer qualification, deposit management' },
  { n: '6', title: 'Handover & Transfer', body: 'Snagging, title transfer, and client handover' },
];

const INVESTOR_BENEFITS = [
  'Market-validated site selection before any capital commitment',
  'Transparent cost reporting and milestone tracking',
  'Pre-qualified buyer database for faster unit sales',
  'Legal and compliance support from start to transfer',
];

export default function DevelopmentPage() {
  const [form, setForm] = useState({ full_name: '', phone: '', email: '', interest: '', budget: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const submit = async () => {
    if (!form.full_name.trim() || !form.phone.trim()) { setError('Name and phone are required.'); return; }
    setSubmitting(true); setError('');
    try {
      const res = await fetch(`${API}/leads/inquiry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: form.full_name,
          phone: form.phone,
          email: form.email || undefined,
          interest_type: 'invest',
          source: 'website',
          notes: `Development inquiry. Interest: ${form.interest}. Budget: ${form.budget}. ${form.message}`.trim(),
        }),
      });
      if (!res.ok) throw new Error('Submission failed');
      setSubmitted(true);
    } catch (e: any) {
      setError(e.message || 'Something went wrong. Please try again.');
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
        position: 'relative', minHeight: '90vh', display: 'flex', alignItems: 'center',
        background: 'linear-gradient(150deg, #0F0A08 0%, #1A0F0D 50%, #2A1008 100%)',
        padding: '120px 24px 80px', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(196,153,42,0.06) 1px, transparent 0)', backgroundSize: '32px 32px', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: '60% 40%', gap: 64, alignItems: 'center', width: '100%', position: 'relative' }}>
          {/* Left */}
          <div>
            <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--gold, #C4992A)', display: 'block', marginBottom: 24 }}>
              Property Development
            </span>
            <h1 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', lineHeight: 1.05, marginBottom: 28 }}>
              <span style={{ display: 'block', fontSize: 'clamp(40px, 5vw, 68px)', fontWeight: 600, color: 'white' }}>We Don't Just Build Properties.</span>
              <span style={{ display: 'block', fontSize: 'clamp(40px, 5vw, 68px)', fontWeight: 600, color: 'white' }}>We Build Data-Backed</span>
              <span style={{ display: 'block', fontSize: 'clamp(40px, 5vw, 68px)', fontWeight: 300, fontStyle: 'italic', color: 'var(--gold-light, #E8B84B)' }}>Investments.</span>
            </h1>
            <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: 18, color: 'rgba(255,255,255,0.75)', maxWidth: 520, lineHeight: 1.7, marginBottom: 36 }}>
              Done &amp; Space Properties brings AI-assisted intelligence to every development — from site selection to final handover. Higher ROI. Faster completion. Reduced risk.
            </p>
            <div style={{ display: 'flex', gap: 20, marginBottom: 36, flexWrap: 'wrap' }}>
              {['AI Site Selection', 'Demand Forecasting', 'Cost Optimization'].map((item, i) => (
                <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 7, fontFamily: 'Outfit, sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.65)' }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--gold, #C4992A)', display: 'inline-block', flexShrink: 0 }} />
                  {item}
                </span>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button onClick={() => document.getElementById('dev-form')?.scrollIntoView({ behavior: 'smooth' })} style={{ background: 'var(--gold, #C4992A)', color: 'var(--ink, #0F0A08)', border: 'none', padding: '14px 28px', fontFamily: 'Outfit, sans-serif', fontSize: 14, fontWeight: 700, cursor: 'pointer', borderRadius: 2, letterSpacing: '0.02em' }}>
                Discuss Your Development
              </button>
              <button onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })} style={{ background: 'transparent', color: 'white', border: '1px solid rgba(255,255,255,0.3)', padding: '14px 28px', fontFamily: 'Outfit, sans-serif', fontSize: 14, fontWeight: 500, cursor: 'pointer', borderRadius: 2 }}>
                View Current Projects
              </button>
            </div>
          </div>

          {/* Right — architectural blueprint grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, opacity: 0.85 }}>
            {Array.from({ length: 9 }, (_, i) => (
              <div key={i} style={{
                aspectRatio: '1', borderRadius: 2,
                background: [0, 4, 8].includes(i) ? 'rgba(123,29,42,0.25)' : [2, 6].includes(i) ? 'rgba(196,153,42,0.15)' : 'transparent',
                border: `1px solid ${[1, 3, 5, 7].includes(i) ? 'rgba(196,153,42,0.3)' : 'rgba(255,255,255,0.08)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {[0, 4, 8].includes(i) && <div style={{ width: '50%', height: '50%', border: '1px solid rgba(196,153,42,0.4)', borderRadius: 1 }} />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── AI CAPABILITIES ─── */}
      <section style={{ background: 'var(--cream, #F8F3ED)', padding: '96px 24px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gold, #C4992A)', display: 'block', marginBottom: 16 }}>Intelligence</span>
          <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 600, color: 'var(--ink, #0F0A08)', lineHeight: 1.15, marginBottom: 56 }}>
            Intelligence at Every Stage
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16 }}>
            {AI_CARDS.map((card, i) => (
              <div key={i} style={{ background: 'white', border: '1px solid var(--border, #E8DDD6)', padding: '32px 24px', borderRadius: 4, minWidth: 0 }}>
                <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: 'var(--gold, #C4992A)', marginBottom: 14 }}>{card.n}</div>
                <h3 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 20, fontWeight: 600, color: 'var(--ink, #0F0A08)', marginBottom: 12, lineHeight: 1.2 }}>{card.title}</h3>
                <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: 14, color: 'var(--ink-secondary, #4A3830)', lineHeight: 1.65 }}>{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PROCESS TIMELINE ─── */}
      <section style={{ background: '#FFFFFF', padding: '96px 24px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gold, #C4992A)', display: 'block', marginBottom: 16 }}>Process</span>
          <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 600, color: 'var(--ink, #0F0A08)', lineHeight: 1.15, marginBottom: 64 }}>
            From Concept to Completion
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 0, position: 'relative' }}>
            {/* Connecting line */}
            <div style={{ position: 'absolute', top: 20, left: '8%', right: '8%', height: 1, background: 'var(--gold, #C4992A)', opacity: 0.3, zIndex: 0 }} />
            {STAGES.map((stage, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '0 12px', position: 'relative', zIndex: 1 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', border: '2px solid var(--gold, #C4992A)', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20, flexShrink: 0 }}>
                  <span style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 16, fontWeight: 700, color: 'var(--gold, #C4992A)' }}>{stage.n}</span>
                </div>
                <h3 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 16, fontWeight: 600, color: 'var(--ink, #0F0A08)', marginBottom: 8, lineHeight: 1.3 }}>{stage.title}</h3>
                <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: 12.5, color: 'var(--ink-muted, #8C7B72)', lineHeight: 1.6 }}>{stage.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CURRENT PROJECTS ─── */}
      <section id="projects" style={{ background: 'var(--brand, #7B1D2A)', padding: '80px 24px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(30px, 4vw, 44px)', fontWeight: 600, color: 'white', marginBottom: 48, textAlign: 'center' }}>
            Current Development Projects
          </h2>
          <div style={{ maxWidth: 600, margin: '0 auto', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', padding: '48px', textAlign: 'center', borderRadius: 2 }}>
            <div style={{ width: 48, height: 48, border: '1px solid rgba(196,153,42,0.5)', borderRadius: '50%', margin: '0 auto 24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: 'var(--gold, #C4992A)', fontSize: 20 }}>·</span>
            </div>
            <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: 15, color: 'rgba(255,255,255,0.75)', lineHeight: 1.75, marginBottom: 28 }}>
              Project information is released by management approval only. Contact us to discuss current and upcoming development opportunities.
            </p>
            <button onClick={() => document.getElementById('dev-form')?.scrollIntoView({ behavior: 'smooth' })} style={{ background: 'var(--gold, #C4992A)', color: 'var(--ink, #0F0A08)', border: 'none', padding: '13px 28px', fontFamily: 'Outfit, sans-serif', fontSize: 14, fontWeight: 700, cursor: 'pointer', borderRadius: 2 }}>
              Enquire About Projects
            </button>
          </div>
        </div>
      </section>

      {/* ─── INVESTOR SECTION ─── */}
      <section id="dev-form" style={{ background: 'var(--ink-deep, #1A0F0D)', padding: '96px 24px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 500px', gap: 72, alignItems: 'start' }}>
          {/* Left */}
          <div>
            <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--gold, #C4992A)', display: 'block', marginBottom: 20 }}>
              For Investors
            </span>
            <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(30px, 4vw, 42px)', fontWeight: 600, color: 'white', lineHeight: 1.15, marginBottom: 24 }}>
              Property Investment That Makes Sense
            </h2>
            <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: 15, color: 'rgba(255,255,255,0.7)', lineHeight: 1.8, marginBottom: 36 }}>
              Done &amp; Space connects serious investors with verified development opportunities across Zambia. We provide the data, market analysis, and deal structure — you provide the capital. We build what the market needs, not what we guess.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {INVESTOR_BENEFITS.map((b, i) => (
                <div key={i} style={{ borderLeft: '3px solid var(--gold, #C4992A)', paddingLeft: 20 }}>
                  <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: 14.5, color: 'rgba(255,255,255,0.75)', lineHeight: 1.5 }}>{b}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — inquiry form */}
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', padding: '36px', borderRadius: 2 }}>
            <h3 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 24, fontWeight: 600, color: 'white', marginBottom: 6 }}>
              Discuss a Development Opportunity
            </h3>
            <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: 13.5, color: 'rgba(255,255,255,0.5)', marginBottom: 24 }}>We respond within 24 hours.</p>

            {submitted ? (
              <div style={{ textAlign: 'center', padding: '32px 0' }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <span style={{ color: '#22c55e', fontSize: 22 }}>✓</span>
                </div>
                <h3 style={{ color: 'white', fontSize: 17, fontWeight: 700, marginBottom: 8, fontFamily: 'Outfit, sans-serif' }}>Inquiry Received</h3>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13.5, fontFamily: 'Outfit, sans-serif' }}>Our development team will be in touch within 24 hours.</p>
              </div>
            ) : (
              <>
                {error && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171', padding: '10px 14px', borderRadius: 2, marginBottom: 16, fontSize: 13 }}>{error}</div>}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div><label style={labelStyle}>Full Name *</label><input style={inputStyle} value={form.full_name} onChange={e => set('full_name', e.target.value)} placeholder="Your name" /></div>
                    <div><label style={labelStyle}>Phone *</label><input style={inputStyle} value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+260..." /></div>
                  </div>
                  <div><label style={labelStyle}>Email</label><input type="email" style={inputStyle} value={form.email} onChange={e => set('email', e.target.value)} placeholder="your@email.com" /></div>
                  <div>
                    <label style={labelStyle}>Type of Interest</label>
                    <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.interest} onChange={e => set('interest', e.target.value)}>
                      <option value="">Select interest type</option>
                      <option value="Develop My Own Land">Develop My Own Land</option>
                      <option value="Co-invest in Existing Project">Co-invest in Existing Project</option>
                      <option value="Purchase Development Units">Purchase Development Units</option>
                      <option value="General Development Inquiry">General Development Inquiry</option>
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Budget Range</label>
                    <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.budget} onChange={e => set('budget', e.target.value)}>
                      <option value="">Select budget range</option>
                      <option value="Under ZMW 500,000">Under ZMW 500,000</option>
                      <option value="ZMW 500K - 2M">ZMW 500K – 2M</option>
                      <option value="ZMW 2M - 10M">ZMW 2M – 10M</option>
                      <option value="Above ZMW 10M">Above ZMW 10M</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Message / Details</label>
                    <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: 80 }} value={form.message} onChange={e => set('message', e.target.value)} placeholder="Tell us about your development goals..." />
                  </div>
                  <button onClick={submit} disabled={submitting} style={{ background: 'var(--gold, #C4992A)', color: 'var(--ink, #0F0A08)', border: 'none', padding: '13px', borderRadius: 2, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'Outfit, sans-serif', opacity: submitting ? 0.7 : 1, letterSpacing: '0.02em' }}>
                    {submitting ? 'Sending...' : 'Submit Inquiry'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 1100px) {
          section > div[style*="repeat(5, 1fr)"] { grid-template-columns: repeat(3, 1fr) !important; }
          section > div[style*="repeat(6, 1fr)"] { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 900px) {
          section > div[style*="60% 40%"] { grid-template-columns: 1fr !important; }
          section > div[style*="1fr 500px"] { grid-template-columns: 1fr !important; }
          section > div[style*="repeat(5, 1fr)"] { grid-template-columns: repeat(2, 1fr) !important; }
          section > div[style*="repeat(6, 1fr)"] { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 600px) {
          section > div[style*="repeat(5, 1fr)"],
          section > div[style*="repeat(6, 1fr)"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  );
}
