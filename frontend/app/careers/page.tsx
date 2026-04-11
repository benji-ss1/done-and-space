import InquiryForm from '../../components/InquiryForm';
import { Briefcase, Heart, TrendingUp, Users, MapPin } from 'lucide-react';

const OPENINGS = [
  { title: 'Senior Property Agent', location: 'Lusaka', type: 'Full-time', dept: 'Sales' },
  { title: 'Property Management Officer', location: 'Lusaka', type: 'Full-time', dept: 'Operations' },
  { title: 'Digital Marketing Specialist', location: 'Lusaka / Remote', type: 'Full-time', dept: 'Marketing' },
  { title: 'Client Relations Associate', location: 'Ndola', type: 'Full-time', dept: 'Customer Success' },
  { title: 'Property Valuation Officer', location: 'Lusaka', type: 'Contract', dept: 'Valuations' },
];

const VALUES = [
  { icon: <Heart size={20} />, title: 'People First', desc: 'We put clients and team members at the centre of every decision.' },
  { icon: <TrendingUp size={20} />, title: 'Growth Mindset', desc: 'We invest in training and professional development for all staff.' },
  { icon: <Users size={20} />, title: 'Collaboration', desc: 'Great results come from great teams. We win together.' },
  { icon: <Briefcase size={20} />, title: 'Integrity', desc: 'We do what we say. Honest, transparent dealings with everyone.' },
];

export default function CareersPage() {
  return (
    <main style={{ background: '#0a0608', minHeight: '100vh', paddingTop: 68 }}>
      {/* Hero */}
      <section style={{ padding: '64px 24px 72px', background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(139,26,47,0.12) 0%, transparent 70%)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ maxWidth: 600, marginBottom: 56 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(139,26,47,0.12)', border: '1px solid rgba(139,26,47,0.25)', padding: '5px 12px', borderRadius: 20, marginBottom: 20 }}>
              <Briefcase size={13} style={{ color: '#c0374f' }} />
              <span style={{ color: '#c0374f', fontSize: 11.5, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase' }}>Careers</span>
            </div>
            <h1 style={{ fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 20 }}>
              Join the Team<br /><span style={{ color: '#8B1A2F' }}>Building Zambia's</span><br />Property Future
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 16, lineHeight: 1.75 }}>
              We're a fast-growing real estate company on a mission to make property transactions simple, transparent and accessible for everyone in Zambia.
            </p>
          </div>

          {/* Values */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18 }}>
            {VALUES.map((v, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '20px' }}>
                <div style={{ color: '#c0374f', marginBottom: 12 }}>{v.icon}</div>
                <h3 style={{ color: 'white', fontSize: 14, fontWeight: 600, marginBottom: 6 }}>{v.title}</h3>
                <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12.5, lineHeight: 1.6 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open roles */}
      <section style={{ padding: '80px 24px', background: 'rgba(255,255,255,0.015)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ marginBottom: 40 }}>
            <p style={{ color: '#8B1A2F', fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>Open Roles</p>
            <h2 style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 700, letterSpacing: '-0.025em' }}>Current Opportunities</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {OPENINGS.map((job, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
                <div>
                  <h3 style={{ color: 'white', fontSize: 15, fontWeight: 600, marginBottom: 6 }}>{job.title}</h3>
                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'rgba(255,255,255,0.4)', fontSize: 12.5 }}><MapPin size={12} />{job.location}</span>
                    <span style={{ background: 'rgba(139,26,47,0.12)', color: '#c0374f', border: '1px solid rgba(139,26,47,0.2)', padding: '2px 9px', borderRadius: 20, fontSize: 11.5, fontWeight: 500 }}>{job.dept}</span>
                    <span style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.08)', padding: '2px 9px', borderRadius: 20, fontSize: 11.5 }}>{job.type}</span>
                  </div>
                </div>
                <button style={{ background: '#8B1A2F', border: 'none', color: 'white', padding: '9px 18px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}
                  onClick={() => document.getElementById('careers-form')?.scrollIntoView({ behavior: 'smooth' })}>
                  Apply Now
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application form */}
      <section id="careers-form" style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 680, margin: '0 auto', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '40px' }}>
          <h2 style={{ color: 'white', fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Apply to Done & Space</h2>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14, marginBottom: 28 }}>Tell us about yourself and the role you're interested in. We review all applications within 5 working days.</p>
          <InquiryForm interestType="invest" />
        </div>
      </section>
    </main>
  );
}
