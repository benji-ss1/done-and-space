'use client';
import { useState, useEffect } from 'react';
import { Save, Eye, EyeOff, Sparkles, Check, ExternalLink } from 'lucide-react';

export default function SettingsPage() {
  const [groqKey, setGroqKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const k = localStorage.getItem('groq_api_key');
    if (k) setGroqKey(k);
  }, []);

  const saveKey = () => {
    localStorage.setItem('groq_api_key', groqKey.trim());
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const clearKey = () => {
    localStorage.removeItem('groq_api_key');
    setGroqKey('');
  };

  const inputStyle = {
    width: '100%', background: 'var(--bg-elevated)', border: '1px solid var(--border-light)',
    color: 'var(--text-primary)', padding: '11px 42px 11px 14px', borderRadius: 10, fontSize: 14,
    outline: 'none', fontFamily: 'Outfit, sans-serif', boxSizing: 'border-box' as const,
    transition: 'border-color 0.2s',
  };

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: 4 }}>
          Settings
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
          Configure integrations and preferences for your dashboard
        </p>
      </div>

      {/* AI Configuration */}
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '28px', maxWidth: 600, marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <div style={{ width: 32, height: 32, background: '#8B1A2F18', border: '1px solid #8B1A2F30', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sparkles size={15} color="#8B1A2F" />
          </div>
          <h2 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>
            Simplify.AI — Groq Integration
          </h2>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: 12.5, marginBottom: 24, marginLeft: 42, lineHeight: 1.5 }}>
          Connect your Groq API key to enable the AI assistant. Your key is stored locally in your browser and never sent to our servers.
        </p>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', color: 'var(--text-muted)', fontSize: 10.5, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 8 }}>
            Groq API Key
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type={showKey ? 'text' : 'password'}
              value={groqKey}
              onChange={e => setGroqKey(e.target.value)}
              placeholder="gsk_..."
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = '#8B1A2F'}
              onBlur={e => e.target.style.borderColor = 'var(--border-light)'}
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: 11.5, marginTop: 8 }}>
            Get your free API key at{' '}
            <a href="https://console.groq.com" target="_blank" rel="noopener noreferrer"
              style={{ color: '#8B1A2F', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 3 }}>
              console.groq.com <ExternalLink size={10} />
            </a>
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button
            onClick={saveKey}
            disabled={!groqKey.trim()}
            style={{
              display: 'flex', alignItems: 'center', gap: 7,
              background: groqKey.trim() ? (saved ? '#22c55e' : '#8B1A2F') : '#2a2025',
              border: 'none', color: 'white', padding: '9px 18px', borderRadius: 9,
              fontSize: 13, fontWeight: 600, cursor: groqKey.trim() ? 'pointer' : 'not-allowed',
              fontFamily: 'Outfit, sans-serif', transition: 'background 0.2s',
            }}
          >
            {saved ? <><Check size={13} /> Saved!</> : <><Save size={13} /> Save Key</>}
          </button>
          {groqKey && (
            <button
              onClick={clearKey}
              style={{ background: 'none', border: '1px solid var(--border)', color: 'var(--text-muted)', padding: '9px 16px', borderRadius: 9, fontSize: 13, cursor: 'pointer', fontFamily: 'Outfit, sans-serif' }}
            >
              Remove
            </button>
          )}
        </div>
      </div>

      {/* Model info */}
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '28px', maxWidth: 600 }}>
        <h2 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 16 }}>AI Model</h2>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', background: 'var(--bg-elevated)', border: '1px solid var(--border-light)', borderRadius: 10 }}>
          <div>
            <div style={{ color: 'var(--text-primary)', fontSize: 13.5, fontWeight: 500, marginBottom: 2 }}>
              Llama 3.3 70B Versatile
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>
              via Groq · Fast inference · Real estate optimized
            </div>
          </div>
          <div style={{ background: '#22c55e18', border: '1px solid #22c55e30', color: '#22c55e', padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600 }}>
            Active
          </div>
        </div>
      </div>
    </div>
  );
}
