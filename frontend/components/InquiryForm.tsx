'use client';
import { useState } from 'react';
import { Send, CheckCircle } from 'lucide-react';

interface InquiryFormProps {
  propertyId?: string;
  propertyTitle?: string;
  interestType?: 'buy' | 'rent' | 'sell' | 'let' | 'invest';
  compact?: boolean;
}

export default function InquiryForm({ propertyId, propertyTitle, interestType = 'buy', compact = false }: InquiryFormProps) {
  const [form, setForm] = useState({ full_name: '', phone: '', email: '', message: '', interest_type: interestType });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const submit = async () => {
    if (!form.full_name.trim() || !form.phone.trim()) { setError('Name and phone are required.'); return; }
    setSubmitting(true); setError('');
    try {
      const API = process.env.NEXT_PUBLIC_API_URL || 'https://done-space-backend-production.up.railway.app/api/v1';
      const payload: any = {
        full_name: form.full_name,
        phone: form.phone,
        interest_type: form.interest_type,
        source: 'website',
      };
      if (form.email) payload.email = form.email;
      if (form.message) payload.notes = form.message;
      if (propertyId) payload.property_id = propertyId;
      if (propertyTitle) payload.notes = `Re: ${propertyTitle}. ${form.message || ''}`.trim();

      const res = await fetch(`${API}/leads/inquiry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.message || 'Submission failed');
      }
      setSubmitted(true);
    } catch (e: any) {
      setError(e.message || 'Something went wrong. Please try again.');
    }
    setSubmitting(false);
  };

  const inputStyle: any = {
    width: '100%',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: 'white',
    padding: compact ? '9px 12px' : '11px 14px',
    borderRadius: 9,
    fontSize: 13.5,
    outline: 'none',
    fontFamily: 'Outfit, sans-serif',
    boxSizing: 'border-box',
    transition: 'border-color 0.15s',
  };
  const labelStyle: any = { display: 'block', color: 'rgba(255,255,255,0.45)', fontSize: 11, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 6 };

  if (submitted) {
    return (
      <div style={{ textAlign: 'center', padding: compact ? '24px 0' : '40px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
          <CheckCircle size={40} style={{ color: '#22c55e' }} />
        </div>
        <h3 style={{ color: 'white', fontSize: 17, fontWeight: 700, marginBottom: 8 }}>Inquiry Received!</h3>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13.5, lineHeight: 1.6 }}>
          Thank you, {form.full_name.split(' ')[0]}. Our team will contact you within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <div>
      {error && (
        <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', padding: '10px 14px', borderRadius: 8, marginBottom: 14, fontSize: 13 }}>
          {error}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: compact ? 12 : 16 }}>
        <div>
          <label style={labelStyle}>Full Name *</label>
          <input value={form.full_name} onChange={e => set('full_name', e.target.value)} placeholder="Your full name" style={inputStyle}
            onFocus={e => e.currentTarget.style.borderColor = 'rgba(139,26,47,0.6)'}
            onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <label style={labelStyle}>Phone *</label>
            <input value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+260..." style={inputStyle}
              onFocus={e => e.currentTarget.style.borderColor = 'rgba(139,26,47,0.6)'}
              onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
            />
          </div>
          <div>
            <label style={labelStyle}>Email</label>
            <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="your@email.com" style={inputStyle}
              onFocus={e => e.currentTarget.style.borderColor = 'rgba(139,26,47,0.6)'}
              onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
            />
          </div>
        </div>

        {!compact && (
          <div>
            <label style={labelStyle}>I'm interested in</label>
            <select value={form.interest_type} onChange={e => set('interest_type', e.target.value)} style={inputStyle}>
              <option value="buy">Buying a property</option>
              <option value="rent">Renting a property</option>
              <option value="sell">Selling my property</option>
              <option value="let">Letting my property</option>
              <option value="invest">Investment opportunities</option>
            </select>
          </div>
        )}

        <div>
          <label style={labelStyle}>Message</label>
          <textarea value={form.message} onChange={e => set('message', e.target.value)}
            placeholder={propertyTitle ? `I'm interested in "${propertyTitle}"...` : 'Tell us what you\'re looking for...'}
            rows={compact ? 2 : 3}
            style={{ ...inputStyle, resize: 'vertical' }}
            onFocus={e => e.currentTarget.style.borderColor = 'rgba(139,26,47,0.6)'}
            onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
          />
        </div>

        <button onClick={submit} disabled={submitting} style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          background: '#8B1A2F', border: 'none', color: 'white',
          padding: compact ? '10px' : '13px',
          borderRadius: 9, fontSize: 14, fontWeight: 600, cursor: 'pointer',
          fontFamily: 'Outfit, sans-serif', transition: 'background 0.15s',
          opacity: submitting ? 0.7 : 1,
        }}
          onMouseEnter={e => { if (!submitting) e.currentTarget.style.background = '#a01f37'; }}
          onMouseLeave={e => e.currentTarget.style.background = '#8B1A2F'}
        >
          <Send size={14} /> {submitting ? 'Sending...' : 'Send Inquiry'}
        </button>
      </div>
    </div>
  );
}
