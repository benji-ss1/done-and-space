'use client';
import Link from 'next/link';
import InquiryForm from '../../components/InquiryForm';
import { Key, CheckCircle, Search, Shield, Phone, FileText, Home } from 'lucide-react';

const TIPS = [
  { icon: <FileText size={18} />, title: 'Prepare Your Documents', desc: 'Have your NRC, employment letter, last 3 payslips, and references ready before applying.' },
  { icon: <Search size={18} />, title: 'Browse & Shortlist', desc: 'Use our filters to find homes that match your budget, location, and size requirements.' },
  { icon: <Phone size={18} />, title: 'Schedule a Viewing', desc: 'Book a viewing through our platform or WhatsApp. Our agents can arrange same-day visits.' },
  { icon: <Shield size={18} />, title: 'Secure the Tenancy', desc: 'Once approved, sign your lease and pay the deposit. We ensure fair and transparent agreements.' },
];

const FAQ = [
  { q: 'How much deposit is required?', a: 'Typically 1-2 months rent as a security deposit, held in a separate account and returned at end of tenancy minus any valid deductions.' },
  { q: 'Can foreigners rent through Done & Space?', a: 'Yes. We assist expats and international clients. A valid work permit and employer letter are usually required.' },
  { q: 'What bills are included in rent?', a: 'This varies per property. Our listings clearly state what is and isn\'t included. Many furnished units include ZESCO, water and WiFi.' },
  { q: 'How do I report a maintenance issue?', a: 'You can report issues directly through our maintenance portal, WhatsApp, or by calling our office. We target a 48-hour response.' },
];

export default function TenantsPage() {
  return (
    <main style={{ background: '#0a0608', minHeight: '100vh', paddingTop: 68 }}>
      {/* Hero */}
      <section style={{ padding: '64px 24px 72px', background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(59,130,246,0.1) 0%, transparent 70%)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ maxWidth: 640, marginBottom: 48 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', padding: '5px 12px', borderRadius: 20, marginBottom: 20 }}>
              <Key size={13} style={{ color: '#60a5fa' }} />
              <span style={{ color: '#60a5fa', fontSize: 11.5, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase' }}>For Tenants</span>
            </div>
            <h1 style={{ fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 20 }}>
              Find Your Perfect<br /><span style={{ color: '#3b82f6' }}>Rental Home</span>
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 16, lineHeight: 1.75, marginBottom: 32 }}>
              We make renting easy, transparent and stress-free. Search verified listings, attend viewings and sign your lease — all with full support from our team.
            </p>
            <Link href="/let" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#3b82f6', color: 'white', padding: '13px 24px', borderRadius: 10, fontSize: 14.5, fontWeight: 600, textDecoration: 'none' }}>
              <Home size={16} /> Browse Available Rentals
            </Link>
          </div>

          {/* Steps */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18 }}>
            {TIPS.map((t, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '22px' }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#60a5fa', marginBottom: 14 }}>
                  {t.icon}
                </div>
                <h3 style={{ color: 'white', fontSize: 14, fontWeight: 600, marginBottom: 6 }}>{t.title}</h3>
                <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12.5, lineHeight: 1.6 }}>{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '80px 24px', background: 'rgba(255,255,255,0.015)' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 44 }}>
            <p style={{ color: '#3b82f6', fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>FAQ</p>
            <h2 style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 700, letterSpacing: '-0.025em' }}>Common Tenant Questions</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {FAQ.map((f, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '22px 24px' }}>
                <h3 style={{ color: 'white', fontSize: 15, fontWeight: 600, marginBottom: 10 }}>{f.q}</h3>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13.5, lineHeight: 1.7 }}>{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Inquiry */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 680, margin: '0 auto', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '40px' }}>
          <h2 style={{ color: 'white', fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Can't Find What You Need?</h2>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14, marginBottom: 28 }}>Send us your requirements and we'll match you with the right rental.</p>
          <InquiryForm interestType="rent" />
        </div>
      </section>
    </main>
  );
}
