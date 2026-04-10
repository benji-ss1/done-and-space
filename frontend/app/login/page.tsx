'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Outfit, sans-serif' }}>
      <div style={{ width: '100%', maxWidth: 420, padding: '0 24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 40 }}>
          <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
            <rect width="44" height="44" rx="12" fill="#8B1A2F"/>
            <path d="M10 11h11c5.5 0 8.5 3.5 8.5 8.5S26.5 28 21 28H10V11z" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M14 31h14" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            <path d="M17 35h11" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <h1 style={{ color: 'var(--text-primary)', fontSize: 22, fontWeight: 700, marginTop: 16, letterSpacing: '-0.02em' }}>Done & Space Properties</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 4 }}>Management System · Zambia</p>
        </div>
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '36px 32px' }}>
          <h2 style={{ color: 'var(--text-primary)', fontSize: 17, fontWeight: 600, marginBottom: 4 }}>Sign in to your account</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 12.5, marginBottom: 28 }}>Enter your credentials to access the dashboard</p>
          {error && (
            <div style={{ background: '#ef444415', border: '1px solid #ef444430', color: '#f87171', padding: '10px 14px', borderRadius: 9, marginBottom: 20, fontSize: 13 }}>{error}</div>
          )}
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: 12.5, fontWeight: 500, marginBottom: 8 }}>Email Address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                style={{ width: '100%', background: 'var(--bg-elevated)', border: '1px solid var(--border-light)', color: 'var(--text-primary)', padding: '11px 14px', borderRadius: 9, fontSize: 14, outline: 'none', fontFamily: 'Outfit, sans-serif', boxSizing: 'border-box' }}
                placeholder="you@doneandspace.com" required />
            </div>
            <div>
              <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: 12.5, fontWeight: 500, marginBottom: 8 }}>Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                style={{ width: '100%', background: 'var(--bg-elevated)', border: '1px solid var(--border-light)', color: 'var(--text-primary)', padding: '11px 14px', borderRadius: 9, fontSize: 14, outline: 'none', fontFamily: 'Outfit, sans-serif', boxSizing: 'border-box' }}
                placeholder="••••••••" required />
            </div>
            <button type="submit" disabled={loading}
              style={{ background: loading ? '#5a1020' : '#8B1A2F', color: 'white', border: 'none', padding: '12px', borderRadius: 9, fontSize: 14, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'Outfit, sans-serif', marginTop: 4 }}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: 11.5, textAlign: 'center', marginTop: 24 }}>
          Done & Space Properties Limited © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
