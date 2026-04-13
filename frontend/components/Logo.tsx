'use client';

interface LogoProps {
  variant?: 'dark' | 'light';
  width?: number;
}

export default function Logo({ variant = 'dark', width = 148 }: LogoProps) {
  return (
    <div style={{
      position: 'relative',
      width: `${width}px`,
      height: '46px',
      overflow: 'hidden',
      flexShrink: 0,
    }}>
      <img
        src="/doneandspacelogo.jpg"
        alt="Done and Space Properties Limited"
        style={{
          position: 'absolute',
          width: `${width}px`,
          bottom: 0,
          left: 0,
          filter: variant === 'light' ? 'brightness(0) invert(1)' : 'none',
        }}
      />
    </div>
  );
}

// Named re-export for any import that still uses { LogoHorizontal }
export { Logo as LogoHorizontal };
