'use client';
import Image from 'next/image';

interface LogoProps {
  variant?: 'dark' | 'light';
  width?: number;
}

export default function Logo({ variant = 'dark', width = 160 }: LogoProps) {
  const height = Math.round(width * 0.52);
  return (
    <Image
      src="/doneandspacelogo.jpg"
      alt="Done & Space Properties Limited"
      width={width}
      height={height}
      priority
      style={{
        objectFit: 'contain',
        objectPosition: 'center',
        // On dark variant (cream navbar): multiply blends the white JPG bg into cream
        mixBlendMode: variant === 'dark' ? 'multiply' : 'normal',
        filter: variant === 'light' ? 'brightness(0) invert(1)' : 'none',
      }}
    />
  );
}

// Named re-export for backwards compat with any import that uses { LogoHorizontal }
export { Logo as LogoHorizontal };
