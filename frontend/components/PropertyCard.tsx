import Link from 'next/link';
import { MapPin, Bed, Bath, Square } from 'lucide-react';

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
  };
}

const typeLabels: any = { house: 'House', apartment: 'Apartment', land: 'Land', commercial: 'Commercial', office: 'Office' };

function formatPrice(price: number, currency = 'ZMW', listingType: string) {
  if (!price) return 'Price on request';
  const formatted = price >= 1_000_000
    ? `${(price / 1_000_000).toFixed(1)}M`
    : price >= 1_000
    ? `${(price / 1_000).toFixed(0)}K`
    : price.toLocaleString();
  return `${currency} ${formatted}${listingType === 'let' ? '/mo' : ''}`;
}

export default function PropertyCard({ property: p }: PropertyCardProps) {
  const image = p.images?.[0];
  const location = [p.location, p.city, p.province].filter(Boolean).join(', ') || 'Zambia';

  return (
    <Link href={`/properties/${p.id}`} style={{ textDecoration: 'none' }}>
      <div style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 14,
        overflow: 'hidden',
        transition: 'transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
        cursor: 'pointer',
      }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'translateY(-3px)';
          e.currentTarget.style.borderColor = 'rgba(139,26,47,0.4)';
          e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.4)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        {/* Image */}
        <div style={{ position: 'relative', height: 200, background: 'rgba(255,255,255,0.04)', overflow: 'hidden' }}>
          {image ? (
            <img src={image} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="48" height="48" viewBox="0 0 40 40" fill="none">
                <path d="M8 28L20 12L32 28" stroke="rgba(255,255,255,0.15)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M14 28V22C14 20.895 14.895 20 16 20H24C25.105 20 26 20.895 26 22V28" stroke="rgba(255,255,255,0.15)" strokeWidth="2.2" strokeLinecap="round" />
              </svg>
            </div>
          )}
          {/* Badges */}
          <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 6 }}>
            <span style={{
              background: p.listing_type === 'let' ? '#3b82f6' : '#8B1A2F',
              color: 'white',
              padding: '3px 9px',
              borderRadius: 20,
              fontSize: 10.5,
              fontWeight: 700,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}>
              {p.listing_type === 'let' ? 'For Rent' : 'For Sale'}
            </span>
            {p.property_type && (
              <span style={{ background: 'rgba(0,0,0,0.55)', color: 'rgba(255,255,255,0.85)', padding: '3px 9px', borderRadius: 20, fontSize: 10.5, fontWeight: 600 }}>
                {typeLabels[p.property_type] || p.property_type}
              </span>
            )}
          </div>
          {p.furnished && (
            <span style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(34,197,94,0.85)', color: 'white', padding: '3px 9px', borderRadius: 20, fontSize: 10.5, fontWeight: 600 }}>
              Furnished
            </span>
          )}
        </div>

        {/* Content */}
        <div style={{ padding: '16px 18px' }}>
          <h3 style={{ color: 'rgba(255,255,255,0.9)', fontSize: 14.5, fontWeight: 600, lineHeight: 1.4, marginBottom: 6, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as any }}>
            {p.title}
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'rgba(255,255,255,0.38)', fontSize: 12, marginBottom: 14 }}>
            <MapPin size={11} style={{ flexShrink: 0 }} />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{location}</span>
          </div>

          {/* Stats */}
          {(p.bedrooms || p.bathrooms || p.size_sqm) && (
            <div style={{ display: 'flex', gap: 14, marginBottom: 14 }}>
              {p.bedrooms != null && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'rgba(255,255,255,0.45)', fontSize: 12 }}>
                  <Bed size={12} /> {p.bedrooms} bed
                </div>
              )}
              {p.bathrooms != null && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'rgba(255,255,255,0.45)', fontSize: 12 }}>
                  <Bath size={12} /> {p.bathrooms} bath
                </div>
              )}
              {p.size_sqm && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'rgba(255,255,255,0.45)', fontSize: 12 }}>
                  <Square size={12} /> {p.size_sqm} m²
                </div>
              )}
            </div>
          )}

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ color: '#c0374f', fontSize: 16, fontWeight: 700, fontFamily: 'Outfit, sans-serif' }}>
              {formatPrice(p.price, p.currency, p.listing_type)}
            </span>
            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11.5 }}>View →</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
