import React from 'react';

interface LogoProps {
  variant?: 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg';
}

// The mark: two flowing parallel wave strokes (double-S rotated 90°)
// Matches the reference image exactly — no filled shapes, no letterforms
function LogoMark({ color }: { color: string }) {
  return (
    <svg
      width="52"
      height="44"
      viewBox="0 0 52 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ color, flexShrink: 0 }}
    >
      {/* Top wave — thicker, full opacity */}
      <path
        d="M4 22 C 10 12, 20 10, 26 16 C 32 22, 42 18, 50 10"
        stroke="currentColor"
        strokeWidth="3.8"
        strokeLinecap="round"
        fill="none"
      />
      {/* Bottom wave — thinner, lower opacity, same curve shifted down */}
      <path
        d="M4 30 C 10 20, 20 18, 26 24 C 32 30, 42 26, 50 18"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
        opacity="0.42"
      />
      {/* Thin baseline rule */}
      <rect x="4" y="37" width="44" height="2" rx="1" fill="currentColor" opacity="0.10" />
    </svg>
  );
}

export function LogoHorizontal({ variant = 'dark', size = 'md' }: LogoProps) {
  const isDark = variant === 'dark';
  const markColor  = isDark ? '#7B1828' : 'rgba(255,255,255,0.88)';
  const nameColor  = isDark ? '#7B1828' : '#FFFFFF';
  const subColor   = isDark ? '#9A9A9A' : 'rgba(255,255,255,0.42)';

  const nameSz = { sm: 16, md: 18, lg: 22 }[size];
  const subSz  = { sm: 8.5, md: 9.5, lg: 11 }[size];
  const scale  = { sm: 0.72, md: 1, lg: 1.2 }[size];

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, userSelect: 'none' }}>
      <div style={{ transform: `scale(${scale})`, transformOrigin: 'left center', flexShrink: 0 }}>
        <LogoMark color={markColor} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
        <span style={{
          color: nameColor, fontSize: nameSz, fontWeight: 700,
          fontFamily: "'Playfair Display', Georgia, serif",
          letterSpacing: '0.01em', lineHeight: 1.1, display: 'block',
        }}>
          Done &amp; Space
        </span>
        <span style={{
          color: subColor, fontSize: subSz, fontWeight: 400,
          fontFamily: "'Outfit', system-ui, sans-serif",
          letterSpacing: '0.13em', textTransform: 'uppercase',
          display: 'block', marginTop: 3,
        }}>
          Properties Limited
        </span>
      </div>
    </div>
  );
}

export function LogoStacked({ variant = 'dark', size = 'md' }: LogoProps) {
  const isDark = variant === 'dark';
  const markColor = isDark ? '#7B1828' : 'rgba(255,255,255,0.88)';
  const nameColor = isDark ? '#7B1828' : '#FFFFFF';
  const subColor  = isDark ? '#9A9A9A' : 'rgba(255,255,255,0.42)';
  const nameSz = { sm: 14, md: 17, lg: 21 }[size];
  const subSz  = { sm: 8, md: 9.5, lg: 11 }[size];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, userSelect: 'none' }}>
      <LogoMark color={markColor} />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <span style={{ color: nameColor, fontSize: nameSz, fontWeight: 700, fontFamily: "'Playfair Display', Georgia, serif", letterSpacing: '0.01em' }}>
          Done &amp; Space
        </span>
        <span style={{ color: subColor, fontSize: subSz, fontWeight: 400, fontFamily: "'Outfit', system-ui, sans-serif", letterSpacing: '0.13em', textTransform: 'uppercase', marginTop: 3 }}>
          Properties Limited
        </span>
      </div>
    </div>
  );
}

export default LogoHorizontal;
