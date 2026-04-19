'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SparklesCore } from '@/components/ui/sparkles';
import { Eye, EyeOff, Building2 } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      localStorage.setItem('access_token', data.accessToken);
      localStorage.setItem('user', JSON.stringify(data.user));
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#000000', fontFamily: 'Outfit, sans-serif', overflow: 'hidden' }}>

      {/* Full-screen sparkles layer */}
      <div style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        <SparklesCore
          id="login-sparkles"
          background="transparent"
          minSize={0.4}
          maxSize={1.4}
          particleDensity={90}
          particleColor="#ffffff"
          speed={0.8}
          className="w-full h-full"
        />
      </div>

      {/* Crimson glow orbs */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{
          position: 'absolute', top: '-10%', left: '-5%',
          width: 600, height: 600, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139,26,47,0.18) 0%, transparent 65%)',
        }} />
        <div style={{
          position: 'absolute', bottom: '-15%', right: '-5%',
          width: 500, height: 500, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139,26,47,0.12) 0%, transparent 65%)',
        }} />
      </div>

      {/* Horizontal gradient line (Acme-style) */}
      <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', width: '100%', maxWidth: 680, pointerEvents: 'none' }}>
        <div style={{ position: 'relative', height: 1, width: '100%' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, transparent, #8B1A2F, transparent)', filter: 'blur(2px)', opacity: 0.6 }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, transparent, #8B1A2F88, transparent)' }} />
        </div>
        {/* Center glow dot */}
        <div style={{ position: 'absolute', top: -4, left: '50%', transform: 'translateX(-50%)', width: 8, height: 8, borderRadius: '50%', background: '#c0374f', boxShadow: '0 0 12px 4px #8B1A2F80' }} />
      </div>

      {/* Mask to fade sparkles at edges */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 80% 70% at 50% 50%, transparent 40%, #000000 100%)',
      }} />

      {/* Main content */}
      <div style={{
        position: 'relative', zIndex: 10,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        minHeight: '100vh', padding: 24,
      }}>
        {/* Brand header */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 36, textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <div style={{ width: 42, height: 42, background: '#8B1A2F', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(139,26,47,0.5)' }}>
              <Building2 size={22} color="white" />
            </div>
            <span style={{ color: '#f5f0f1', fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em' }}>
              Done & Space
            </span>
          </div>
          <h1 style={{ color: '#f5f0f1', fontSize: 26, fontWeight: 700, marginBottom: 6, letterSpacing: '-0.02em', lineHeight: 1 }}>
            Dashboard
          </h1>
          <p style={{ color: '#5a4d50', fontSize: 12.5, letterSpacing: '0.04em' }}>
            powered by{' '}
            <span style={{ color: '#8B1A2F', fontWeight: 700 }}>Simplify.AI</span>
          </p>
        </div>

        {/* Sign in card */}
        <div style={{
          width: '100%', maxWidth: 400,
          background: 'rgba(10, 8, 9, 0.85)',
          border: '1px solid #1e1a1c',
          borderRadius: 20,
          padding: '36px 32px',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 0 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(139,26,47,0.08)',
        }}>
          <h2 style={{ color: '#f5f0f1', fontSize: 17, fontWeight: 600, marginBottom: 4 }}>
            Sign in to your account
          </h2>
          <p style={{ color: '#5a4d50', fontSize: 12.5, marginBottom: 28 }}>
            Enter your credentials to access the dashboard
          </p>

          {error && (
            <div style={{ background: '#ef444415', border: '1px solid #ef444430', color: '#f87171', padding: '10px 14px', borderRadius: 10, marginBottom: 20, fontSize: 13 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <label style={{ display: 'block', color: '#5a4d50', fontSize: 10.5, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@doneandspace.com"
                required
                style={{
                  width: '100%', background: '#0f0c0d', border: '1px solid #1e1a1c',
                  color: '#f5f0f1', padding: '11px 14px', borderRadius: 10, fontSize: 14,
                  outline: 'none', fontFamily: 'Outfit, sans-serif', boxSizing: 'border-box',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = '#8B1A2F'}
                onBlur={e => e.target.style.borderColor = '#1e1a1c'}
              />
            </div>

            <div>
              <label style={{ display: 'block', color: '#5a4d50', fontSize: 10.5, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={{
                    width: '100%', background: '#0f0c0d', border: '1px solid #1e1a1c',
                    color: '#f5f0f1', padding: '11px 42px 11px 14px', borderRadius: 10, fontSize: 14,
                    outline: 'none', fontFamily: 'Outfit, sans-serif', boxSizing: 'border-box',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={e => e.target.style.borderColor = '#8B1A2F'}
                  onBlur={e => e.target.style.borderColor = '#1e1a1c'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#5a4d50', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0 }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                background: loading ? '#5a1020' : '#8B1A2F',
                color: 'white', border: 'none', padding: '13px',
                borderRadius: 10, fontSize: 14, fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'Outfit, sans-serif', marginTop: 4,
                transition: 'background 0.2s, box-shadow 0.2s',
                boxShadow: loading ? 'none' : '0 0 20px rgba(139,26,47,0.35)',
                letterSpacing: '0.02em',
              }}
              onMouseEnter={e => { if (!loading) { (e.target as HTMLElement).style.background = '#9B2035'; } }}
              onMouseLeave={e => { if (!loading) { (e.target as HTMLElement).style.background = '#8B1A2F'; } }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p style={{ color: '#1e1a1c', fontSize: 11.5, textAlign: 'center', marginTop: 28 }}>
          Done & Space Properties Limited © {new Date().getFullYear()} · Zambia
        </p>
      </div>
    </div>
  );
}
