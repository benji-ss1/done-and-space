'use client';

interface LogoProps {
  variant?: 'dark' | 'light';
  width?: number;
}

export default function Logo({ variant = 'dark', width = 160 }: LogoProps) {
  const isLight = variant === 'light';
  const containerWidth = width;
  const containerHeight = 48;
  // Negative marginTop crops out the stacked version at the top of the image,
  // leaving only the horizontal logo visible at the bottom.
  const marginTop = -52;

  return (
    <div style={{ overflow: 'hidden', height: `${containerHeight}px`, width: `${containerWidth}px` }}>
      <img
        src="/doneandspacelogo.jpg"
        alt="Done & Space Properties Limited"
        style={{
          width: `${containerWidth}px`,
          marginTop: `${marginTop}px`,
          display: 'block',
          filter: isLight ? 'brightness(0) invert(1)' : 'none',
        }}
      />
    </div>
  );
}

// Named re-export for any import that still uses { LogoHorizontal }
export { Logo as LogoHorizontal };
