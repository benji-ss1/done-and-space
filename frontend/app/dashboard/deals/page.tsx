'use client';
export default function DealsPage() {
  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>Deals</h1>
      <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 32 }}>Transaction pipeline</p>
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 14, padding: 48, textAlign: 'center', color: 'var(--text-muted)' }}>
        No active deals yet. Deals are created when a lead progresses to offer stage.
      </div>
    </div>
  );
}
