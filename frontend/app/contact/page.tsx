'use client';
import InquiryForm from '../../components/InquiryForm';

const SUBJECTS = [
  'Property Inquiry', 'Valuation Request', 'Rental Inquiry',
  'Agent Application', 'Maintenance', 'General',
];

export default function ContactPage() {
  return (
    <main style={{ background: 'var(--cream, #F8F3ED)' }}>
      {/* Hero */}
      <section style={{ background: 'var(--brand, #7B1D2A)', padding: '80px 24px 72px', paddingTop: 'calc(70px + 64px)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gold-light, #E8B84B)', display: 'block', marginBottom: 14 }}>
            Contact Us
          </span>
          <h1 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 500, color: 'white', marginBottom: 16, lineHeight: 1.1 }}>
            Talk to a Real Person
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontFamily: 'Outfit, sans-serif', fontSize: 17, maxWidth: 500, lineHeight: 1.65 }}>
            No bots. No auto-replies. Our team is available Monday to Saturday.
          </p>
        </div>
      </section>

      {/* Contact cards */}
      <section style={{ padding: '0 24px', marginTop: -1 }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0, transform: 'translateY(-40px)', boxShadow: '0 16px 48px rgba(15,10,8,0.12)' }}>
          {/* Phone card */}
          <div style={{ background: 'white', padding: '36px 32px', borderTop: '3px solid var(--gold, #C4992A)', borderRight: '1px solid var(--border, #E8DDD6)' }}>
            <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted, #8C7B72)', marginBottom: 12 }}>Phone & WhatsApp</p>
            <p style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 28, fontWeight: 700, color: 'var(--brand, #7B1D2A)', marginBottom: 8 }}>+260 971 000 000</p>
            <p style={{ color: 'var(--ink-muted, #8C7B72)', fontFamily: 'Outfit, sans-serif', fontSize: 13.5, lineHeight: 1.6, marginBottom: 22 }}>
              Call or WhatsApp — we respond within the hour during business hours.
            </p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <a href="tel:+260971000000" style={{ background: 'var(--brand, #7B1D2A)', color: 'white', padding: '9px 18px', fontFamily: 'Outfit, sans-serif', fontSize: 13, fontWeight: 600, textDecoration: 'none', borderRadius: 2 }}>
                Call Now
              </a>
              <a href="https://wa.me/260971000000" target="_blank" rel="noopener noreferrer" style={{ background: '#25D366', color: 'white', padding: '9px 18px', fontFamily: 'Outfit, sans-serif', fontSize: 13, fontWeight: 600, textDecoration: 'none', borderRadius: 2 }}>
                WhatsApp
              </a>
            </div>
          </div>

          {/* Email card */}
          <div style={{ background: 'white', padding: '36px 32px', borderTop: '3px solid var(--border-strong, #C4B8B0)', borderRight: '1px solid var(--border, #E8DDD6)' }}>
            <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted, #8C7B72)', marginBottom: 12 }}>Email</p>
            <p style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 22, fontWeight: 600, color: 'var(--ink, #0F0A08)', marginBottom: 8, wordBreak: 'break-all' }}>info@doneandspace.com</p>
            <p style={{ color: 'var(--ink-muted, #8C7B72)', fontFamily: 'Outfit, sans-serif', fontSize: 13.5, lineHeight: 1.6, marginBottom: 22 }}>
              Email us and we will respond within 2 business hours.
            </p>
            <a href="mailto:info@doneandspace.com" style={{ display: 'inline-block', background: 'var(--surface-warm, #FAF7F4)', border: '1px solid var(--border, #E8DDD6)', color: 'var(--ink, #0F0A08)', padding: '9px 18px', fontFamily: 'Outfit, sans-serif', fontSize: 13, fontWeight: 600, textDecoration: 'none', borderRadius: 2 }}>
              Send Email
            </a>
          </div>

          {/* Office card */}
          <div style={{ background: 'white', padding: '36px 32px', borderTop: '3px solid var(--border-strong, #C4B8B0)' }}>
            <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted, #8C7B72)', marginBottom: 12 }}>Office</p>
            <p style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 24, fontWeight: 600, color: 'var(--ink, #0F0A08)', marginBottom: 8 }}>Lusaka, Zambia</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, color: 'var(--ink-muted, #8C7B72)', fontFamily: 'Outfit, sans-serif', fontSize: 13.5, lineHeight: 1.6 }}>
              <p>Cairo Road, Central Business District</p>
              <p>Monday–Friday: 8:00am – 5:00pm</p>
              <p>Saturday: 9:00am – 1:00pm</p>
            </div>
          </div>
        </div>
      </section>

      {/* Form section */}
      <section style={{ padding: '0 24px 96px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 540px', gap: 64, alignItems: 'start' }}>
          {/* Left copy */}
          <div style={{ paddingTop: 16 }}>
            <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gold, #C4992A)', display: 'block', marginBottom: 14 }}>
              Get in Touch
            </span>
            <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(30px, 4vw, 44px)', fontWeight: 600, color: 'var(--ink, #0F0A08)', lineHeight: 1.15, marginBottom: 20 }}>
              Send Us a Message
            </h2>
            <p style={{ color: 'var(--ink-secondary, #4A3830)', fontFamily: 'Outfit, sans-serif', fontSize: 15, lineHeight: 1.8, marginBottom: 32 }}>
              Whether you have a property to sell, need help finding the right home, or just want to understand the Zambian market — our team is ready to help. Leave your details and we will be in touch within 24 hours.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { title: 'Phone & WhatsApp', text: '+260 971 000 000' },
                { title: 'Email', text: 'info@doneandspace.com' },
                { title: 'Head Office', text: 'Cairo Road, Lusaka, Zambia' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--gold, #C4992A)', flexShrink: 0, marginTop: 7 }} />
                  <div>
                    <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-muted, #8C7B72)', marginBottom: 3 }}>{item.title}</p>
                    <p style={{ color: 'var(--ink, #0F0A08)', fontFamily: 'Outfit, sans-serif', fontSize: 14.5 }}>{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div style={{ background: 'white', border: '1px solid var(--border, #E8DDD6)', padding: '36px', borderTop: '3px solid var(--brand, #7B1D2A)' }}>
            <h3 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 24, fontWeight: 600, color: 'var(--ink, #0F0A08)', marginBottom: 6 }}>Your Message</h3>
            <p style={{ color: 'var(--ink-muted, #8C7B72)', fontFamily: 'Outfit, sans-serif', fontSize: 13.5, marginBottom: 24 }}>We respond to all inquiries within 24 hours.</p>
            <InquiryForm theme="light" />
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 900px) {
          section > div[style*="repeat(3, 1fr)"] { grid-template-columns: 1fr !important; }
          section > div[style*="540px"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  );
}
