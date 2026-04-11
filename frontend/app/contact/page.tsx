'use client';
import InquiryForm from '../../components/InquiryForm';
import { Phone, Mail, MapPin, Clock, MessageCircle } from 'lucide-react';

const OFFICES = [
  {
    city: 'Lusaka (Head Office)',
    address: 'Cairo Road, Central Business District',
    phone: '+260 971 000 000',
    email: 'lusaka@doneandspace.com',
    hours: 'Mon–Fri: 8am–5pm, Sat: 9am–1pm',
  },
  {
    city: 'Copperbelt',
    address: 'Broadway, Ndola',
    phone: '+260 972 000 000',
    email: 'copperbelt@doneandspace.com',
    hours: 'Mon–Fri: 8am–5pm',
  },
];

export default function ContactPage() {
  return (
    <main style={{ background: '#0a0608', minHeight: '100vh', paddingTop: 68 }}>
      {/* Header */}
      <section style={{ padding: '64px 24px 56px', background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(139,26,47,0.12) 0%, transparent 70%)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <p style={{ color: '#8B1A2F', fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>Contact Us</p>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 16 }}>Get In Touch</h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 16, maxWidth: 480, lineHeight: 1.7 }}>
            Whether you're buying, selling or renting — our team is ready to help. Reach out through any of the channels below.
          </p>
        </div>
      </section>

      {/* Main content */}
      <section style={{ padding: '0 24px 80px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 440px', gap: 56, alignItems: 'start' }}>
          {/* Left */}
          <div>
            {/* Office cards */}
            <h2 style={{ color: 'white', fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Our Offices</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 40 }}>
              {OFFICES.map((office, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '24px' }}>
                  <h3 style={{ color: 'white', fontSize: 15, fontWeight: 600, marginBottom: 16 }}>{office.city}</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {[
                      { icon: <MapPin size={13} />, text: office.address },
                      { icon: <Phone size={13} />, text: office.phone },
                      { icon: <Mail size={13} />, text: office.email },
                      { icon: <Clock size={13} />, text: office.hours },
                    ].map((item, j) => (
                      <div key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, color: 'rgba(255,255,255,0.5)', fontSize: 13.5 }}>
                        <span style={{ color: '#c0374f', marginTop: 1, flexShrink: 0 }}>{item.icon}</span>
                        {item.text}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* WhatsApp */}
            <div style={{ background: 'rgba(37,211,102,0.07)', border: '1px solid rgba(37,211,102,0.15)', borderRadius: 14, padding: '24px', display: 'flex', alignItems: 'center', gap: 18 }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <MessageCircle size={22} style={{ color: 'white' }} />
              </div>
              <div>
                <h3 style={{ color: 'white', fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Chat on WhatsApp</h3>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>Get instant responses from our team. Available during business hours.</p>
                <a href="https://wa.me/260971000000" target="_blank" rel="noopener noreferrer"
                  style={{ display: 'inline-block', marginTop: 10, color: '#4ade80', fontSize: 13.5, fontWeight: 600, textDecoration: 'none' }}>
                  +260 971 000 000 →
                </a>
              </div>
            </div>
          </div>

          {/* Form */}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '32px', position: 'sticky', top: 88 }}>
            <h2 style={{ color: 'white', fontSize: 18, fontWeight: 700, marginBottom: 6 }}>Send Us a Message</h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13.5, marginBottom: 24 }}>We respond to all inquiries within 24 hours.</p>
            <InquiryForm />
          </div>
        </div>
      </section>
    </main>
  );
}
