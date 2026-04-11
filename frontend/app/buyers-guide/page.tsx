'use client';
import Link from 'next/link';

const AREAS = [
  { name: 'Kabulonga', badge: 'PREMIUM', badgeColor: '#C4992A', desc: "Lusaka's most sought-after low-density area. Large stands, quiet streets, expat community, embassies nearby. Expect to pay a premium — but capital growth is strong.", range: 'ZMW 800,000 — 5,000,000+', bestFor: 'Families, investors, expats' },
  { name: 'Ibex Hill', badge: 'PREMIUM', badgeColor: '#C4992A', desc: 'Adjacent to Kabulonga. Hill-top location with views. Mix of established homes and new developments. Very popular with the Zambian professional class.', range: 'ZMW 600,000 — 3,000,000+', bestFor: 'Professionals, families' },
  { name: 'Woodlands', badge: 'POPULAR', badgeColor: '#7B1D2A', desc: "One of Lusaka's largest low-density suburbs. Good infrastructure, close to shopping centres and schools. Excellent for rental returns — always in demand.", range: 'ZMW 350,000 — 1,500,000', bestFor: 'First-time buyers, rental investment' },
  { name: 'Roma', badge: 'POPULAR', badgeColor: '#7B1D2A', desc: 'Central location with good connectivity. Mix of residential and light commercial. Popular with young professionals and small business owners.', range: 'ZMW 250,000 — 900,000', bestFor: 'Commuters, young professionals' },
  { name: 'Northmead', badge: 'AFFORDABLE', badgeColor: '#4A3830', desc: 'Established medium-density suburb. Good value for money. Close to East Park Mall and major routes. Growing infrastructure.', range: 'ZMW 150,000 — 500,000', bestFor: 'First-time buyers, rental investors' },
  { name: 'Chelston', badge: 'AFFORDABLE', badgeColor: '#4A3830', desc: 'Popular medium-density area in eastern Lusaka. Strong community, good schools nearby. High rental demand from lower-middle income market.', range: 'ZMW 120,000 — 400,000', bestFor: 'Buy-to-let investors' },
];

const STEPS = [
  { n: '01', title: 'Set Your Budget and Get Pre-Approved', body: "Before you look at a single listing, know your numbers. If you are taking a mortgage, approach your bank first — Zanaco, Stanchart, FNB Zambia and Absa all offer home loans. Get a pre-approval letter. This tells sellers you are serious and speeds up negotiations significantly." },
  { n: '02', title: 'Search for Properties', body: "Use a registered estate agency like Done & Space Properties. Verify that listings are genuine — ghost listings (properties that do not exist or are already sold) are a real problem in Zambia. We verify every listing before it goes live." },
  { n: '03', title: 'Conduct a Property Search', body: "Before making any offer, instruct a lawyer to conduct a property search at the Lands Ministry. This confirms: who legally owns the property, whether there are any caveats or encumbrances, the type of lease and when it expires, and outstanding rates or charges. This step is non-negotiable. Never skip it." },
  { n: '04', title: 'Make an Offer', body: "Your estate agent will present your offer to the seller. In Zambia, it is normal to negotiate 5–15% below asking price. Once agreed, both parties sign an Offer to Purchase — a legally binding document. Read it carefully." },
  { n: '05', title: 'Pay the Deposit', body: "Typically 10–20% of the purchase price. This is held by the estate agent or conveyancer. Get a receipt. Never pay cash directly to a seller." },
  { n: '06', title: 'Transfer of Ownership', body: "Your conveyancer (property lawyer) handles this. They prepare the transfer documents, submit to the Lands Ministry, and register the new title deed in your name. This process takes 30–90 days in Zambia — patience required." },
  { n: '07', title: 'Take the Keys', body: "Once the title deed is in your name and full payment is confirmed, you receive the keys. Congratulations — you now own property in Zambia." },
];

const COSTS = [
  { item: 'Property Transfer Tax', value: '5% of property value' },
  { item: 'Stamp Duty', value: '0.5% of property value' },
  { item: 'Legal / Conveyancing Fees', value: '2–3% of property value' },
  { item: 'Estate Agency Fee', value: 'Typically 5% (paid by seller)' },
  { item: 'Property Search', value: 'ZMW 500 — 2,000' },
  { item: 'Council Rates (annual)', value: 'Varies by area and rateable value' },
  { item: 'Title Deed Registration', value: 'ZMW 1,000 — 3,000' },
];

const RED_FLAGS = [
  'Sellers who rush you to sign without a property search',
  'Prices significantly below market rate (usually means problems)',
  "No title deed — only traditional ownership or 'agreement to sell'",
  'Cash-only deals with no receipt',
  'Agents who are not registered with ZEMA (Zambia Estate Management Agency)',
  'Properties advertised on Facebook only with no registered agent',
];

const KEY_TERMS = [
  { term: 'Stand', def: 'A plot of land ready for development' },
  { term: 'Title Deed', def: 'The legal document proving ownership' },
  { term: 'Leasehold', def: '99-year government lease (most common)' },
  { term: 'Freehold', def: 'Full outright ownership' },
  { term: 'Conveyancer', def: 'The lawyer who handles property transfers' },
  { term: 'Caveat', def: 'A legal flag on a property (always check this)' },
  { term: 'Rateable Value', def: "The council's assessed value for rates" },
];

const FAQ = [
  { q: 'Can foreigners buy property in Zambia?', a: 'Yes. Non-Zambian citizens can own property in Zambia. However, foreigners cannot own land outright — they hold a leasehold title. The process is the same as for citizens.' },
  { q: 'How long does a property transfer take?', a: 'Between 30–90 days from signing the Offer to Purchase to receiving your title deed. Delays are common at the Lands Ministry. Your conveyancer will manage this.' },
  { q: 'Do I need a lawyer?', a: 'Yes. A conveyancer (property lawyer) is required by law for all formal property transactions in Zambia. Done & Space Properties can recommend trusted conveyancers.' },
  { q: 'What is the difference between a stand and a house?', a: "A 'stand' in Zambian property refers to an empty plot of land, ready for development. A house is an existing structure. Stands are often bought for investment and developed later." },
  { q: 'Can I get a mortgage in Zambia?', a: 'Yes. Several banks offer mortgage products including Zanaco, First National Bank Zambia, Standard Chartered, and Absa. Typical terms: 15–25 year loans at 20–28% interest rates. Interest rates in Zambia are significantly higher than Western markets — factor this into your budget.' },
];

export default function BuyersGuidePage() {
  return (
    <main style={{ background: 'var(--cream, #F8F3ED)' }}>

      {/* HERO */}
      <section style={{ background: 'var(--brand-deep, #5C0A1A)', padding: '80px 24px 80px', paddingTop: 'calc(70px + 64px)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 10.5, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--gold, #C4992A)', display: 'block', marginBottom: 20 }}>
            Zambia Property Guide · 2026
          </span>
          <h1 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(36px, 6vw, 68px)', fontWeight: 500, color: 'white', lineHeight: 1.1, marginBottom: 20 }}>
            The Complete Guide to<br />Buying Property in Zambia
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontFamily: 'Outfit, sans-serif', fontSize: 17, lineHeight: 1.7, marginBottom: 28, maxWidth: 620 }}>
            Everything from searching stands in Kabulonga to signing title deeds — explained clearly.
          </p>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'Outfit, sans-serif', fontSize: 13 }}>
            By Done &amp; Space Properties · Updated April 2026 · 12 min read
          </p>
        </div>
      </section>

      {/* SECTION 1: Understanding the Market */}
      <section style={{ background: 'white', padding: '80px 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 260px', gap: 56, alignItems: 'start' }}>
          <div>
            <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 10.5, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gold, #C4992A)', display: 'block', marginBottom: 16 }}>
              Section 1
            </span>
            <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(26px, 4vw, 38px)', fontWeight: 600, color: 'var(--ink, #0F0A08)', marginBottom: 24, lineHeight: 1.2 }}>
              Understanding the Zambian Property Market
            </h2>
            <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: 15, lineHeight: 1.85, color: 'var(--ink-secondary, #4A3830)', display: 'flex', flexDirection: 'column', gap: 18 }}>
              <p>Zambia's property market is primarily centered in Lusaka, with a strong secondary market in the Copperbelt (Kitwe, Ndola, Chingola) and growing demand in Livingstone and Chipata.</p>
              <p>Property in Zambia is either <strong style={{ color: 'var(--ink, #0F0A08)' }}>Freehold</strong> (owned outright, mostly in traditional areas) or <strong style={{ color: 'var(--ink, #0F0A08)' }}>Leasehold</strong> (government lease, typically 99 years — this is the most common form for residential property in towns and cities).</p>
              <p>Understanding which type of title deed you are getting is the single most important step in any property transaction.</p>
            </div>
          </div>

          {/* Key terms sidebar */}
          <div style={{ background: 'var(--brand-ultra-light, #FBF5F6)', borderLeft: '3px solid var(--brand, #7B1D2A)', padding: '24px', borderRadius: 0 }}>
            <h4 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--brand, #7B1D2A)', marginBottom: 16 }}>
              Key Terms
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {KEY_TERMS.map((t, i) => (
                <div key={i}>
                  <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: 12.5, fontWeight: 700, color: 'var(--ink, #0F0A08)', marginBottom: 2 }}>{t.term}</p>
                  <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: 12.5, color: 'var(--ink-muted, #8C7B72)', lineHeight: 1.5 }}>{t.def}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: Best Areas */}
      <section style={{ background: 'var(--cream, #F8F3ED)', padding: '80px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 10.5, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gold, #C4992A)', display: 'block', marginBottom: 16 }}>
            Section 2
          </span>
          <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(26px, 4vw, 38px)', fontWeight: 600, color: 'var(--ink, #0F0A08)', marginBottom: 8, lineHeight: 1.2 }}>
            The Best Areas to Buy in Lusaka
          </h2>
          <p style={{ color: 'var(--ink-muted, #8C7B72)', fontFamily: 'Outfit, sans-serif', fontSize: 15, marginBottom: 44, lineHeight: 1.65 }}>
            Where you buy matters as much as what you buy. Here is our honest breakdown of Lusaka's key residential areas.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {AREAS.map((area, i) => (
              <div key={i} style={{ background: 'white', border: '1px solid var(--border, #E8DDD6)', padding: '28px', borderTop: '3px solid var(--border-strong, #C4B8B0)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <h3 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 22, fontWeight: 600, color: 'var(--ink, #0F0A08)' }}>{area.name}</h3>
                  <span style={{ background: area.badgeColor, color: area.badgeColor === '#C4992A' ? 'var(--ink, #0F0A08)' : 'white', padding: '3px 10px', fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', fontFamily: 'Outfit, sans-serif' }}>
                    {area.badge}
                  </span>
                </div>
                <p style={{ color: 'var(--ink-secondary, #4A3830)', fontFamily: 'Outfit, sans-serif', fontSize: 13.5, lineHeight: 1.65, marginBottom: 16 }}>{area.desc}</p>
                <div style={{ borderTop: '1px solid var(--border, #E8DDD6)', paddingTop: 14, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: 12, color: 'var(--ink-muted, #8C7B72)' }}><strong style={{ color: 'var(--brand, #7B1D2A)' }}>Price range:</strong> {area.range}</p>
                  <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: 12, color: 'var(--ink-muted, #8C7B72)' }}><strong style={{ color: 'var(--ink-secondary, #4A3830)' }}>Best for:</strong> {area.bestFor}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: Step-by-step */}
      <section style={{ background: 'white', padding: '80px 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 10.5, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gold, #C4992A)', display: 'block', marginBottom: 16 }}>
            Section 3
          </span>
          <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(26px, 4vw, 38px)', fontWeight: 600, color: 'var(--ink, #0F0A08)', marginBottom: 48, lineHeight: 1.2 }}>
            The Step-by-Step Buying Process in Zambia
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {STEPS.map((s, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: 24, paddingBottom: 36, borderBottom: i < STEPS.length - 1 ? '1px solid var(--border, #E8DDD6)' : 'none', marginBottom: i < STEPS.length - 1 ? 36 : 0 }}>
                <div style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 48, fontWeight: 700, color: 'var(--gold, #C4992A)', lineHeight: 1, opacity: 0.7 }}>
                  {s.n}
                </div>
                <div>
                  <h3 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 22, fontWeight: 600, color: 'var(--ink, #0F0A08)', marginBottom: 10 }}>{s.title}</h3>
                  <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: 14.5, lineHeight: 1.8, color: 'var(--ink-secondary, #4A3830)' }}>{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: Costs */}
      <section style={{ background: 'var(--brand, #7B1D2A)', padding: '80px 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 10.5, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gold-light, #E8B84B)', display: 'block', marginBottom: 16 }}>
            Section 4
          </span>
          <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(26px, 4vw, 38px)', fontWeight: 600, color: 'white', marginBottom: 36, lineHeight: 1.2 }}>
            Costs You Must Budget For
          </h2>
          <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 0, overflow: 'hidden', marginBottom: 28 }}>
            {COSTS.map((c, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderBottom: i < COSTS.length - 1 ? '1px solid rgba(255,255,255,0.08)' : 'none', flexWrap: 'wrap', gap: 8 }}>
                <span style={{ color: 'rgba(255,255,255,0.8)', fontFamily: 'Outfit, sans-serif', fontSize: 14.5 }}>{c.item}</span>
                <span style={{ color: 'var(--gold-light, #E8B84B)', fontFamily: 'Outfit, sans-serif', fontSize: 14.5, fontWeight: 600 }}>{c.value}</span>
              </div>
            ))}
          </div>
          <div style={{ background: 'rgba(196,153,42,0.15)', border: '1px solid rgba(196,153,42,0.3)', padding: '16px 20px' }}>
            <p style={{ color: 'var(--gold-light, #E8B84B)', fontFamily: 'Outfit, sans-serif', fontSize: 14, lineHeight: 1.6 }}>
              <strong>Always budget an additional 8–10% above the purchase price</strong> for transaction costs.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 5: Red Flags */}
      <section style={{ background: 'var(--cream, #F8F3ED)', padding: '80px 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 10.5, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gold, #C4992A)', display: 'block', marginBottom: 16 }}>
            Section 5
          </span>
          <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(26px, 4vw, 38px)', fontWeight: 600, color: 'var(--ink, #0F0A08)', marginBottom: 36, lineHeight: 1.2 }}>
            Red Flags to Watch Out For
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {RED_FLAGS.map((flag, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 16, background: 'white', border: '1px solid #fca5a5', borderLeft: '3px solid #dc2626', padding: '16px 20px' }}>
                <span style={{ color: '#dc2626', fontSize: 18, flexShrink: 0, lineHeight: 1.3 }}>⚠</span>
                <p style={{ color: 'var(--ink-secondary, #4A3830)', fontFamily: 'Outfit, sans-serif', fontSize: 14.5, lineHeight: 1.6 }}>{flag}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6: FAQ */}
      <section style={{ background: 'white', padding: '80px 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: 10.5, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gold, #C4992A)', display: 'block', marginBottom: 16 }}>
            Section 6
          </span>
          <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(26px, 4vw, 38px)', fontWeight: 600, color: 'var(--ink, #0F0A08)', marginBottom: 36, lineHeight: 1.2 }}>
            Frequently Asked Questions
          </h2>
          <div className="guide-faq">
            {FAQ.map((f, i) => (
              <details key={i}>
                <summary>{f.q}</summary>
                <div className="faq-answer">{f.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'var(--gold, #C4992A)', padding: '64px 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 24 }}>
          <div>
            <h2 style={{ fontFamily: 'Cormorant Garamond, Georgia, serif', fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 600, color: 'var(--ink-deep, #1A0F0D)', marginBottom: 8 }}>
              Ready to Start Your Property Search?
            </h2>
            <p style={{ color: 'rgba(15,10,8,0.6)', fontFamily: 'Outfit, sans-serif', fontSize: 15 }}>
              Our agents are ready to guide you through every step.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link href="/properties" style={{ background: 'var(--ink-deep, #1A0F0D)', color: 'white', padding: '13px 24px', fontFamily: 'Outfit, sans-serif', fontSize: 14, fontWeight: 600, textDecoration: 'none', borderRadius: 2, letterSpacing: '0.02em' }}>
              Browse Properties
            </Link>
            <Link href="/contact" style={{ background: 'transparent', color: 'var(--ink-deep, #1A0F0D)', padding: '13px 24px', fontFamily: 'Outfit, sans-serif', fontSize: 14, fontWeight: 600, textDecoration: 'none', borderRadius: 2, border: '2px solid var(--ink-deep, #1A0F0D)', letterSpacing: '0.02em' }}>
              Talk to an Agent
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 900px) {
          section > div[style*="260px"] { grid-template-columns: 1fr !important; }
          section > div > div[style*="repeat(3"] { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 600px) {
          section > div > div[style*="repeat(3"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  );
}
