'use client';
import InquiryForm from '../../components/InquiryForm';
import { Users, TrendingUp, Shield, Smartphone, DollarSign, Award, CheckCircle } from 'lucide-react';

const BENEFITS = [
  { icon: <DollarSign size={20} />, title: 'Competitive Commission', desc: 'Earn industry-leading commission on every successful deal, paid promptly and transparently.' },
  { icon: <TrendingUp size={20} />, title: 'Exclusive Listings', desc: 'Get early access to new listings and off-market opportunities before they go public.' },
  { icon: <Smartphone size={20} />, title: 'Agent Dashboard', desc: 'A powerful CRM to manage your leads, track deals, log interactions and monitor your pipeline.' },
  { icon: <Shield size={20} />, title: 'Brand & Support', desc: 'Market under the Done & Space brand with full marketing support, business cards, and training.' },
  { icon: <Users size={20} />, title: 'Team Environment', desc: 'Collaborate with a supportive team of professionals who share leads and market knowledge.' },
  { icon: <Award size={20} />, title: 'Recognition & Growth', desc: 'Performance-based rewards, agent of the month recognition, and a clear path to senior roles.' },
];

const REQUIREMENTS = [
  'Valid NRC / National ID',
  'At least 1 year real estate experience (preferred)',
  'Strong knowledge of your local property market',
  'Professional communication skills',
  'Smartphone with WhatsApp and email access',
  'Own transportation (advantageous)',
];

export default function AgentsPage() {
  return (
    <main style={{ background: '#0a0608', minHeight: '100vh', paddingTop: 68 }}>
      {/* Hero */}
      <section style={{ padding: '64px 24px 72px', background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(139,26,47,0.14) 0%, transparent 70%)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ maxWidth: 640, marginBottom: 56 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(139,26,47,0.12)', border: '1px solid rgba(139,26,47,0.25)', padding: '5px 12px', borderRadius: 20, marginBottom: 20 }}>
              <Users size={13} style={{ color: '#c0374f' }} />
              <span style={{ color: '#c0374f', fontSize: 11.5, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase' }}>For Agents</span>
            </div>
            <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 20 }}>
              Build Your Career<br /><span style={{ color: '#8B1A2F' }}>With Done & Space</span>
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 16, lineHeight: 1.75 }}>
              Join Zambia's growing real estate network. Whether you're an experienced agent or just getting started, we provide the tools, listings, and support to help you succeed.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {BENEFITS.map((b, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '24px' }}>
                <div style={{ width: 42, height: 42, borderRadius: 10, background: 'rgba(139,26,47,0.12)', border: '1px solid rgba(139,26,47,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c0374f', marginBottom: 16 }}>
                  {b.icon}
                </div>
                <h3 style={{ color: 'white', fontSize: 15, fontWeight: 600, marginBottom: 8 }}>{b.title}</h3>
                <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13.5, lineHeight: 1.65 }}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements + Form */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 420px', gap: 56, alignItems: 'start' }}>
          <div>
            <p style={{ color: '#8B1A2F', fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>Requirements</p>
            <h2 style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 700, letterSpacing: '-0.025em', marginBottom: 20 }}>What We Look For</h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14.5, lineHeight: 1.7, marginBottom: 28 }}>
              We're always looking for dedicated, professional people who are passionate about real estate and committed to delivering excellent client service.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {REQUIREMENTS.map((r, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'rgba(255,255,255,0.65)', fontSize: 14 }}>
                  <CheckCircle size={15} style={{ color: '#c0374f', flexShrink: 0 }} /> {r}
                </div>
              ))}
            </div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '28px' }}>
            <h3 style={{ color: 'white', fontSize: 16, fontWeight: 600, marginBottom: 6 }}>Apply to Join Our Team</h3>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, marginBottom: 20 }}>Leave your details and our team will be in touch within 2 working days.</p>
            <InquiryForm interestType="invest" compact />
          </div>
        </div>
      </section>
    </main>
  );
}
