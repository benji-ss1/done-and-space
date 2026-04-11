'use client';
import InquiryForm from '../../components/InquiryForm';
import { TrendingUp, CheckCircle, DollarSign, Clock, Users, Star } from 'lucide-react';

const BENEFITS = [
  { icon: <DollarSign size={20} />, title: 'Maximum Sale Price', desc: 'Our agents use market data and negotiation expertise to get you the best price for your property.' },
  { icon: <Users size={20} />, title: 'Large Buyer Network', desc: 'Access our database of verified buyers actively looking for properties like yours.' },
  { icon: <Clock size={20} />, title: 'Fast Sale Guarantee', desc: 'Average time-to-offer is 3 weeks. We work with urgency while protecting your interests.' },
  { icon: <Star size={20} />, title: 'Full Service', desc: 'Valuation, professional photography, listing, viewings, negotiations — we handle everything.' },
];

const PROCESS = [
  { step: '01', title: 'Free Valuation', desc: 'We assess your property and provide a realistic market valuation at no cost.' },
  { step: '02', title: 'List & Market', desc: 'Professional photos, listing on our platform and targeted marketing to buyers.' },
  { step: '03', title: 'Manage Viewings', desc: 'We coordinate all viewings and provide you with feedback from every showing.' },
  { step: '04', title: 'Negotiate & Close', desc: 'We negotiate the best offer and handle all legal documentation through to completion.' },
];

export default function SellPage() {
  return (
    <main style={{ background: '#0a0608', minHeight: '100vh', paddingTop: 68 }}>
      {/* Hero */}
      <section style={{ padding: '64px 24px 72px', background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(34,197,94,0.08) 0%, transparent 70%)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 420px', gap: 60, alignItems: 'start' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', padding: '5px 12px', borderRadius: 20, marginBottom: 20 }}>
              <TrendingUp size={13} style={{ color: '#4ade80' }} />
              <span style={{ color: '#4ade80', fontSize: 11.5, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase' }}>Sell Property</span>
            </div>
            <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 20 }}>
              Sell Your Property<br /><span style={{ color: '#22c55e' }}>For the Best Price</span>
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 16, lineHeight: 1.75, maxWidth: 500, marginBottom: 32 }}>
              Our experienced agents will market your property professionally, attract qualified buyers, and negotiate the best possible price. Trusted by hundreds of Zambian homeowners.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {BENEFITS.map((b, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, padding: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10 }}>
                  <div style={{ color: '#4ade80', flexShrink: 0, marginTop: 2 }}>{b.icon}</div>
                  <div>
                    <h4 style={{ color: 'white', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{b.title}</h4>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12.5, lineHeight: 1.55 }}>{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '28px' }}>
            <h3 style={{ color: 'white', fontSize: 16, fontWeight: 600, marginBottom: 6 }}>Request a Free Valuation</h3>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, marginBottom: 20 }}>Tell us about your property and we'll be in touch within 24 hours.</p>
            <InquiryForm interestType="sell" compact />
          </div>
        </div>
      </section>

      {/* Process */}
      <section style={{ padding: '80px 24px', background: 'rgba(255,255,255,0.015)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <p style={{ color: '#22c55e', fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>How It Works</p>
            <h2 style={{ fontSize: 'clamp(26px, 4vw, 38px)', fontWeight: 700, letterSpacing: '-0.025em' }}>Our Selling Process</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
            {PROCESS.map((s, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <span style={{ color: '#4ade80', fontSize: 14, fontWeight: 700 }}>{s.step}</span>
                </div>
                <h3 style={{ color: 'white', fontSize: 15, fontWeight: 600, marginBottom: 8 }}>{s.title}</h3>
                <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, lineHeight: 1.65 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
