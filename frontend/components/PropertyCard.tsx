import Link from 'next/link';

interface PropertyCardProps {
  property: {
    id: string;
    title: string;
    listing_type: 'sale' | 'let';
    property_type: string;
    price: number;
    currency?: string;
    bedrooms?: number;
    bathrooms?: number;
    size_sqm?: number;
    location?: string;
    city?: string;
    province?: string;
    images?: string[];
    status?: string;
    furnished?: boolean;
    reference?: string;
  };
}

const typeLabels: Record<string, string> = {
  house: 'House', apartment: 'Apartment', land: 'Land',
  commercial: 'Commercial', office: 'Office',
};

function formatPrice(price: number) {
  if (!price) return 'Price on request';
  if (price >= 1_000_000) return `ZMW ${(price / 1_000_000).toFixed(2)}M`;
  if (price >= 1_000) return `ZMW ${(price / 1_000).toFixed(0)}K`;
  return `ZMW ${price.toLocaleString()}`;
}

export default function PropertyCard({ property: p }: PropertyCardProps) {
  const image = p.images?.[0];
  const isLet = p.listing_type === 'let';

  return (
    <Link href={`/properties/${p.id}`} style={{ textDecoration: 'none', display: 'block' }}>
      <div
        style={{
          background: 'white',
          border: '1px solid var(--border, #E8DDD6)',
          borderRadius: 4,
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          cursor: 'pointer',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLDivElement).style.boxShadow = 'var(--shadow-hover, 0 12px 40px rgba(15,10,8,0.16))';
          (e.currentTarget as HTMLDivElement).style.borderColor = 'transparent';
          (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
          (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border, #E8DDD6)';
          (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
        }}
      >
        {/* Image */}
        <div style={{ position: 'relative', height: 220, overflow: 'hidden', background: 'linear-gradient(135deg, var(--brand-light, #F2E8EA) 0%, var(--cream, #F8F3ED) 100%)' }}>
          {image ? (
            <img src={image} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="56" height="56" viewBox="0 0 40 40" fill="none" opacity="0.3">
                <path d="M8 28L20 12L32 28" stroke="var(--brand, #7B1D2A)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M14 28V22C14 20.895 14.895 20 16 20H24C25.105 20 26 20.895 26 22V28" stroke="var(--brand, #7B1D2A)" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </div>
          )}
          {/* Listing type badge */}
          <div style={{
            position: 'absolute', top: 0, left: 0,
            background: isLet ? 'var(--gold, #C4992A)' : 'var(--brand, #7B1D2A)',
            color: isLet ? 'var(--ink, #0F0A08)' : 'white',
            padding: '6px 14px',
            fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
            fontFamily: 'Outfit, sans-serif',
          }}>
            {isLet ? 'TO LET' : 'FOR SALE'}
          </div>
          {/* Reference number */}
          {p.reference && (
            <div style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.6)', color: 'white', padding: '4px 10px', fontSize: 11, fontFamily: 'Outfit, sans-serif', borderRadius: 2 }}>
              Ref: {p.reference}
            </div>
          )}
        </div>

        {/* Content */}
        <div style={{ padding: '20px 20px 16px' }}>
          {/* Property type chip */}
          {p.property_type && (
            <div style={{ display: 'inline-block', background: 'var(--surface-warm, #FAF7F4)', color: 'var(--ink-secondary, #4A3830)', fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', padding: '3px 10px', borderRadius: 2, textTransform: 'uppercase', marginBottom: 10, fontFamily: 'Outfit, sans-serif' }}>
              {typeLabels[p.property_type] || p.property_type}
            </div>
          )}

          {/* Title */}
          <h3 style={{
            fontFamily: 'var(--font-display, "Cormorant Garamond", Georgia, serif)',
            fontSize: 20, fontWeight: 600, color: 'var(--ink, #0F0A08)',
            lineHeight: 1.25, marginBottom: 8,
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden',
          }}>
            {p.title}
          </h3>

          {/* Location */}
          <div style={{ color: 'var(--ink-muted, #8C7B72)', fontSize: 13, marginBottom: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {[p.city, p.province].filter(Boolean).join(', ') || p.location || 'Zambia'}
          </div>

          {/* Stats */}
          {(p.bedrooms != null || p.bathrooms != null || p.size_sqm) && (
            <div style={{ color: 'var(--ink-secondary, #4A3830)', fontSize: 13, marginBottom: 12 }}>
              {[
                p.bedrooms != null ? `${p.bedrooms} bed` : null,
                p.bathrooms != null ? `${p.bathrooms} bath` : null,
                p.size_sqm ? `${p.size_sqm}m²` : null,
              ].filter(Boolean).join(' · ')}
            </div>
          )}

          {/* Divider */}
          <div style={{ borderTop: '1px solid var(--border, #E8DDD6)', margin: '14px 0' }} />

          {/* Price + CTA */}
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
            <div>
              <span style={{
                fontFamily: 'var(--font-display, "Cormorant Garamond", Georgia, serif)',
                fontSize: 26, fontWeight: 700, color: 'var(--brand, #7B1D2A)',
              }}>
                {formatPrice(p.price)}
              </span>
              {isLet && <span style={{ color: 'var(--ink-muted, #8C7B72)', fontSize: 13, marginLeft: 4, fontFamily: 'Outfit, sans-serif' }}>/month</span>}
            </div>
            <span style={{ color: 'var(--brand, #7B1D2A)', fontSize: 13, fontWeight: 600, letterSpacing: '0.03em', fontFamily: 'Outfit, sans-serif', whiteSpace: 'nowrap' }}>
              View Details →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
