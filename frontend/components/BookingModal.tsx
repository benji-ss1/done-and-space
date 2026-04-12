'use client';
import { useState, useEffect } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://done-space-backend-production.up.railway.app/api/v1';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyTitle?: string;
  propertyRef?: string;
  propertyId?: string;
}

const today = new Date().toISOString().split('T')[0];

export default function BookingModal({ isOpen, onClose, propertyTitle, propertyRef, propertyId }: BookingModalProps) {
  const [form, setForm] = useState({ full_name: '', phone: '', email: '', date: '', time: 'Morning', notes: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) { setSubmitted(false); setError(''); setForm({ full_name: '', phone: '', email: '', date: '', time: 'Morning', notes: '' }); }
  }, [isOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    if (isOpen) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

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
          source: 'website',
          interest_type: 'buy',
          notes: `Viewing request for: ${propertyTitle || 'property'}${propertyRef ? ` (Ref: ${propertyRef})` : ''}. Preferred date: ${form.date || 'flexible'}. Time: ${form.time}. ${form.notes}`.trim(),
          property_id: propertyId || undefined,
        }),
      });
      if (!res.ok) throw new Error('Failed');
      setSubmitted(true);
    } catch {
      setError('Something went wrong. Please call us directly on +260 971 000 000.');
    }
    setSubmitting(false);
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', border: '1.5px solid var(--border, #E0D9CE)', borderRadius: 4,
    padding: '10px 14px', fontSize: 14, outline: 'none',
    fontFamily: 'Outfit, sans-serif', color: 'var(--ink, #1A1A1A)',
    boxSizing: 'border-box', background: 'white',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: 11, fontWeight: 600, letterSpacing: '0.08em',
    textTransform: 'uppercase', color: 'var(--ink-muted, #6B6B6B)', marginBottom: 5,
    fontFamily: 'Outfit, sans-serif',
  };

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 2000, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div style={{
        background: 'white', borderRadius: 6, padding: '36px', maxWidth: 480, width: '100%',
        position: 'relative', animation: 'bookingSlideUp 0.25s ease',
        maxHeight: '90vh', overflowY: 'auto',
      }}>
        {/* Close */}
        <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-muted, #6B6B6B)', fontSize: 20, lineHeight: 1, padding: 4 }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--ink, #1A1A1A)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--ink-muted, #6B6B6B)'}
        >
          ×
        </button>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div style={{ width: 56, height: 56, background: 'var(--gold-pale, #FBF6EC)', border: '2px solid var(--gold, #C9A84C)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="var(--gold, #C9A84C)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
            <h3 style={{ fontFamily: 'var(--font-display, "Playfair Display", Georgia, serif)', fontSize: 22, fontWeight: 600, color: 'var(--ink, #1A1A1A)', marginBottom: 10 }}>Viewing Requested</h3>
            <p style={{ color: 'var(--ink-muted, #6B6B6B)', fontSize: 14, lineHeight: 1.65, maxWidth: 340, margin: '0 auto 24px' }}>
              We will call you within the hour to confirm your viewing of <strong>{propertyTitle}</strong>.
            </p>
            <button onClick={onClose} style={{ background: 'var(--brand, #7B1828)', color: 'white', border: 'none', padding: '11px 28px', borderRadius: 4, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}>
              Close
            </button>
          </div>
        ) : (
          <>
            <h2 style={{ fontFamily: 'var(--font-display, "Playfair Display", Georgia, serif)', fontSize: 22, fontWeight: 600, color: 'var(--ink, #1A1A1A)', marginBottom: 4 }}>Book a Viewing</h2>
            {propertyTitle && (
              <p style={{ color: 'var(--ink-muted, #6B6B6B)', fontSize: 13, marginBottom: 24 }}>
                {propertyTitle}{propertyRef ? ` · ${propertyRef}` : ''}
              </p>
            )}

            {error && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '9px 14px', borderRadius: 4, marginBottom: 16, fontSize: 13, fontFamily: 'Outfit, sans-serif' }}>
                {error}
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={labelStyle}>Full Name <span style={{ color: '#dc2626' }}>*</span></label>
                <input value={form.full_name} onChange={e => set('full_name', e.target.value)} placeholder="Your full name" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Phone <span style={{ color: '#dc2626' }}>*</span></label>
                <input value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+260 97X XXX XXX" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Email</label>
                <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="your@email.com" style={inputStyle} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={labelStyle}>Preferred Date</label>
                  <input type="date" value={form.date} min={today} onChange={e => set('date', e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Preferred Time</label>
                  <select value={form.time} onChange={e => set('time', e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
                    <option>Morning</option>
                    <option>Afternoon</option>
                    <option>Evening</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={labelStyle}>Notes (optional)</label>
                <textarea value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Any specific requirements?" rows={3}
                  style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.5 }} />
              </div>
              <button onClick={submit} disabled={submitting} style={{
                background: submitting ? 'var(--ink-muted, #6B6B6B)' : 'var(--brand, #7B1828)',
                color: 'white', border: 'none', padding: '13px', borderRadius: 4,
                fontSize: 14, fontWeight: 600, cursor: submitting ? 'not-allowed' : 'pointer',
                fontFamily: 'Outfit, sans-serif', width: '100%', marginTop: 4,
              }}>
                {submitting ? 'Submitting...' : 'Confirm Viewing Request'}
              </button>
            </div>
          </>
        )}
      </div>

      <style>{`
        @keyframes bookingSlideUp {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
