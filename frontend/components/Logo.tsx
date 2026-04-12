import React from 'react';

interface LogoProps {
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
}

// The SVG mark: two flowing parallel wave-stroke lines in brand maroon
// Replicates the reference image logo exactly — no filled shapes, no letterforms
function LogoMark({ color, opacity2 = 0.42 }: { color: string; opacity2?: number }) {
  return (
    <svg width="48" height="40" viewBox="0 0 50 42" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Line 1 — top wave, thicker, full opacity */}
      <path
        d="M 4 28 C 10 18, 20 14, 28 18 C 36 22, 42 14, 46 10"
        stroke={color}
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Line 2 — bottom wave, thinner, partial opacity */}
      <path
        d="M 4 35 C 10 25, 20 21, 28 25 C 36 29, 42 21, 46 17"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        opacity={opacity2}
      />
    </svg>
  );
}

export function LogoHorizontal({ variant = 'dark', size = 'md' }: LogoProps) {
  const isDark = variant === 'dark';
  const markColor   = isDark ? '#7B1828' : 'rgba(255,255,255,0.90)';
  const nameColor   = isDark ? '#7B1828' : '#FFFFFF';
  const subColor    = isDark ? '#9A9A9A' : 'rgba(255,255,255,0.45)';

  const nameSizes   = { sm: 15, md: 18, lg: 22 };
  const subSizes    = { sm: 8,  md: 9.5, lg: 11 };
  const markScale   = { sm: 0.70, md: 1.0, lg: 1.25 };
  const sc = markScale[size];

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, userSelect: 'none' }}>
      <div style={{ transform: `scale(${sc})`, transformOrigin: 'left center', flexShrink: 0 }}>
        <LogoMark color={markColor} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <span style={{
          color: nameColor,
          fontSize: nameSizes[size],
          fontWeight: 700,
          fontFamily: "'Playfair Display', Georgia, serif",
          letterSpacing: '0.01em',
          lineHeight: 1.1,
          display: 'block',
        }}>
          Done &amp; Space
        </span>
        <span style={{
          color: subColor,
          fontSize: subSizes[size],
          fontWeight: 400,
          fontFamily: "'Outfit', system-ui, sans-serif",
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          display: 'block',
          marginTop: 2,
        }}>
          Properties Limited
        </span>
      </div>
    </div>
  );
}

export function LogoStacked({ variant = 'dark', size = 'md' }: LogoProps) {
  const isDark = variant === 'dark';
  const markColor = isDark ? '#7B1828' : 'rgba(255,255,255,0.90)';
  const nameColor = isDark ? '#7B1828' : '#FFFFFF';
  const subColor  = isDark ? '#9A9A9A' : 'rgba(255,255,255,0.45)';
  const nameSizes = { sm: 14, md: 17, lg: 21 };
  const subSizes  = { sm: 8,  md: 9.5, lg: 11 };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, userSelect: 'none' }}>
      <LogoMark color={markColor} />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <span style={{ color: nameColor, fontSize: nameSizes[size], fontWeight: 700, fontFamily: "'Playfair Display', Georgia, serif", letterSpacing: '0.01em' }}>
          Done &amp; Space
        </span>
        <span style={{ color: subColor, fontSize: subSizes[size], fontWeight: 400, fontFamily: "'Outfit', system-ui, sans-serif", letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: 2 }}>
          Properties Limited
        </span>
      </div>
    </div>
  );
}

export default LogoHorizontal;
