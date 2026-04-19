'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Particles } from '@/components/ui/particles';
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
    <div className="relative min-h-screen overflow-hidden w-full" style={{ background: '#0c0a0b', fontFamily: 'Outfit, sans-serif' }}>
      {/* Particles background */}
      <Particles
        color="#8B1A2F"
        quantity={80}
        ease={20}
        size={0.5}
        className="absolute inset-0"
      />
      <Particles
        color="#555555"
        quantity={60}
        ease={40}
        size={0.3}
        className="absolute inset-0"
      />

      {/* Radial glows */}
      <div aria-hidden className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <div style={{
          position: 'absolute', top: 0, left: '50%', transform: 'translate(-50%, -40%)',
          width: 700, height: 700, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139,26,47,0.12) 0%, transparent 70%)',
        }} />
        <div style={{
          position: 'absolute', bottom: 0, right: '20%', transform: 'translateY(30%)',
          width: 500, height: 500, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139,26,47,0.06) 0%, transparent 70%)',
        }} />
      </div>

      {/* Main content */}
      <div style={{ position: 'relative', zIndex: 10, display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ width: '100%', maxWidth: 400 }}>

          {/* Brand header */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 40, textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{ width: 40, height: 40, background: '#8B1A2F', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Building2 size={20} color="white" />
              </div>
              <span style={{ color: '#f5f0f1', fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em' }}>
                Done & Space
              </span>
            </div>
            <h1 style={{ color: '#f5f0f1', fontSize: 24, fontWeight: 700, marginBottom: 6, letterSpacing: '-0.02em' }}>
              Dashboard
            </h1>
            <p style={{ color: '#5a4d50', fontSize: 12, letterSpacing: '0.05em' }}>
              powered by{' '}
              <span style={{ color: '#8B1A2F', fontWeight: 600 }}>Simplify.AI</span>
            </p>
          </div>

          {/* Sign in card */}
          <div style={{
            background: 'rgba(18, 15, 16, 0.8)',
            border: '1px solid #2a2025',
            borderRadius: 20,
            padding: '36px 32px',
            backdropFilter: 'blur(12px)',
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
                <label style={{ display: 'block', color: '#5a4d50', fontSize: 11, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 8 }}>
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@doneandspace.com"
                  required
                  style={{
                    width: '100%', background: '#1a1518', border: '1px solid #2a2025',
                    color: '#f5f0f1', padding: '11px 14px', borderRadius: 10, fontSize: 14,
                    outline: 'none', fontFamily: 'Outfit, sans-serif', boxSizing: 'border-box',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={e => e.target.style.borderColor = '#8B1A2F'}
                  onBlur={e => e.target.style.borderColor = '#2a2025'}
                />
              </div>

              <div>
                <label style={{ display: 'block', color: '#5a4d50', fontSize: 11, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 8 }}>
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
                      width: '100%', background: '#1a1518', border: '1px solid #2a2025',
                      color: '#f5f0f1', padding: '11px 42px 11px 14px', borderRadius: 10, fontSize: 14,
                      outline: 'none', fontFamily: 'Outfit, sans-serif', boxSizing: 'border-box',
                      transition: 'border-color 0.2s',
                    }}
                    onFocus={e => e.target.style.borderColor = '#8B1A2F'}
                    onBlur={e => e.target.style.borderColor = '#2a2025'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#5a4d50', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
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
                  transition: 'background 0.2s',
                  letterSpacing: '0.02em',
                }}
                onMouseEnter={e => { if (!loading) (e.target as HTMLElement).style.background = '#9B2035'; }}
                onMouseLeave={e => { if (!loading) (e.target as HTMLElement).style.background = '#8B1A2F'; }}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          </div>

          {/* Footer */}
          <p style={{ color: '#332830', fontSize: 11.5, textAlign: 'center', marginTop: 24 }}>
            Done & Space Properties Limited © {new Date().getFullYear()} · Zambia
          </p>
        </div>
      </div>
    </div>
  );
}
