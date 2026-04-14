'use client';

interface LogoProps {
  variant?: 'dark' | 'light';
  width?: number;
}

export default function Logo({ variant = 'dark', width = 152 }: LogoProps) {
  return (
    <div style={{
      width: `${width}px`,
      height: '46px',
      overflow: 'hidden',
      flexShrink: 0,
    }}>
      <img
        src="/doneandspacelogo.jpg"
        alt="Done and Space Properties Limited"
        style={{
          position: 'relative',
          width: `${width}px`,
          display: 'block',
          filter: variant === 'light' ? 'brightness(0) invert(1)' : 'none',
          mixBlendMode: variant === 'dark' ? 'multiply' : 'normal',
        }}
      />
    </div>
  );
}

export { Logo as LogoHorizontal };
