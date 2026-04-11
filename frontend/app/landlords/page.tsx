'use client';
import InquiryForm from '../../components/InquiryForm';
import { Building2, DollarSign, Shield, Users, Wrench, BarChart3, CheckCircle } from 'lucide-react';

const SERVICES = [
  { icon: <Users size={20} />, title: 'Tenant Screening', desc: 'We verify employment, references and rental history so you only get reliable, qualified tenants.' },
  { icon: <DollarSign size={20} />, title: 'Rent Collection', desc: 'Automated monthly rent collection with detailed payment records and direct transfer to your account.' },
  { icon: <Wrench size={20} />, title: 'Maintenance Coordination', desc: 'We handle all maintenance requests, sourcing trusted contractors to keep your property in top condition.' },
  { icon: <BarChart3 size={20} />, title: 'Monthly Reporting', desc: 'Detailed monthly statements covering income, expenses, and occupancy status for your records.' },
  { icon: <Shield size={20} />, title: 'Legal Compliance', desc: 'We ensure all tenancy agreements, deposits, and notices comply with Zambia\'s tenancy laws.' },
  { icon: <Building2 size={20} />, title: 'Property Inspections', desc: 'Regular inspections with photographic reports to protect your investment over time.' },
];

const FEES = [
  { plan: 'Letting Only', price: '8%', desc: 'of first month\'s rent', features: ['Tenant marketing', 'Screening & vetting', 'Lease preparation', 'Move-in coordination'] },
  { plan: 'Full Management', price: '10%', desc: 'of monthly rent', features: ['Everything in Letting', 'Rent collection', 'Maintenance management', 'Monthly reporting', 'Tenant relations', 'Annual inspections'], highlight: true },
];

export default function LandlordsPage() {
  return (
    <main style={{ background: '#0a0608', minHeight: '100vh', paddingTop: 68 }}>
      {/* Hero */}
      <section style={{ padding: '64px 24px 72px', background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(139,26,47,0.14) 0%, transparent 70%)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ maxWidth: 700, marginBottom: 56 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(139,26,47,0.12)', border: '1px solid rgba(139,26,47,0.25)', padding: '5px 12px', borderRadius: 20, marginBottom: 20 }}>
              <Building2 size={13} style={{ color: '#c0374f' }} />
              <span style={{ color: '#c0374f', fontSize: 11.5, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase' }}>Landlord Services</span>
            </div>
            <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 20 }}>
              Let Us Manage<br /><span style={{ color: '#8B1A2F' }}>Your Property</span>
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 16, lineHeight: 1.75, maxWidth: 560 }}>
              Focus on growing your portfolio while we handle the day-to-day. Our full property management service covers everything from tenant sourcing to maintenance — so you earn without the stress.
            </p>
          </div>

          {/* Services grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {SERVICES.map((s, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '24px' }}>
                <div style={{ width: 42, height: 42, borderRadius: 10, background: 'rgba(139,26,47,0.12)', border: '1px solid rgba(139,26,47,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c0374f', marginBottom: 16 }}>
                  {s.icon}
                </div>
                <h3 style={{ color: 'white', fontSize: 15, fontWeight: 600, marginBottom: 8 }}>{s.title}</h3>
                <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13.5, lineHeight: 1.65 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section style={{ padding: '80px 24px', background: 'rgba(255,255,255,0.015)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <p style={{ color: '#8B1A2F', fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>Pricing</p>
            <h2 style={{ fontSize: 'clamp(26px, 4vw, 38px)', fontWeight: 700, letterSpacing: '-0.025em' }}>Simple, Transparent Fees</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24, maxWidth: 700, margin: '0 auto' }}>
            {FEES.map((f, i) => (
              <div key={i} style={{
                background: f.highlight ? 'rgba(139,26,47,0.1)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${f.highlight ? 'rgba(139,26,47,0.3)' : 'rgba(255,255,255,0.07)'}`,
                borderRadius: 14, padding: '28px',
              }}>
                {f.highlight && <div style={{ background: '#8B1A2F', color: 'white', fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', padding: '3px 10px', borderRadius: 20, display: 'inline-block', marginBottom: 12 }}>Most Popular</div>}
                <h3 style={{ color: 'white', fontSize: 17, fontWeight: 700, marginBottom: 4 }}>{f.plan}</h3>
                <div style={{ marginBottom: 20 }}>
                  <span style={{ color: '#c0374f', fontSize: 36, fontWeight: 800 }}>{f.price}</span>
                  <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, marginLeft: 6 }}>{f.desc}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {f.features.map((feat, j) => (
                    <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,0.65)', fontSize: 13.5 }}>
                      <CheckCircle size={14} style={{ color: '#c0374f', flexShrink: 0 }} /> {feat}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Inquiry */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '40px' }}>
          <h2 style={{ color: 'white', fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Register Your Property</h2>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14, marginBottom: 28 }}>Let us know about your property and we'll call you to discuss the best management plan.</p>
          <InquiryForm interestType="let" />
        </div>
      </section>
    </main>
  );
}
