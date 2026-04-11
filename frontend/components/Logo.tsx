import React from 'react';

interface LogoProps {
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
}

const sizes = { sm: { mark: 28, wordmark: 15 }, md: { mark: 36, wordmark: 18 }, lg: { mark: 48, wordmark: 24 } };

export function LogoHorizontal({ variant = 'light', size = 'md' }: LogoProps) {
  const s = sizes[size];
  const textColor = variant === 'light' ? '#FFFFFF' : '#1a0f11';
  const subColor = variant === 'light' ? 'rgba(255,255,255,0.55)' : 'rgba(26,15,17,0.5)';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, userSelect: 'none' }}>
      <svg width={s.mark} height={s.mark} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="40" height="40" rx="9" fill="#8B1A2F" />
        <path d="M8 28L20 12L32 28" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M14 28V22C14 20.895 14.895 20 16 20H24C25.105 20 26 20.895 26 22V28" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
        <circle cx="20" cy="17" r="2" fill="white" fillOpacity="0.6" />
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
        <span style={{ color: textColor, fontSize: s.wordmark, fontWeight: 700, fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.02em' }}>Done & Space</span>
        <span style={{ color: subColor, fontSize: s.wordmark * 0.6, fontWeight: 500, fontFamily: 'Outfit, sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: 1 }}>Properties</span>
      </div>
    </div>
  );
}

export function LogoStacked({ variant = 'light', size = 'md' }: LogoProps) {
  const s = sizes[size];
  const textColor = variant === 'light' ? '#FFFFFF' : '#1a0f11';
  const subColor = variant === 'light' ? 'rgba(255,255,255,0.55)' : 'rgba(26,15,17,0.5)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, userSelect: 'none' }}>
      <svg width={s.mark * 1.3} height={s.mark * 1.3} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="40" height="40" rx="9" fill="#8B1A2F" />
        <path d="M8 28L20 12L32 28" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M14 28V22C14 20.895 14.895 20 16 20H24C25.105 20 26 20.895 26 22V28" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
        <circle cx="20" cy="17" r="2" fill="white" fillOpacity="0.6" />
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: 1 }}>
        <span style={{ color: textColor, fontSize: s.wordmark, fontWeight: 700, fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.02em' }}>Done & Space</span>
        <span style={{ color: subColor, fontSize: s.wordmark * 0.65, fontWeight: 500, fontFamily: 'Outfit, sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 3 }}>Properties</span>
      </div>
    </div>
  );
}

export default LogoHorizontal;
