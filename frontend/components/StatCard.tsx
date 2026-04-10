interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
  accent?: string;
}
export default function StatCard({ label, value, icon, trend, trendUp, accent = '#8B1A2F' }: StatCardProps) {
  return (
    <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: 14, transition: 'all 0.2s', cursor: 'default' }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = accent + '50'; e.currentTarget.style.background = 'var(--bg-elevated)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg-surface)'; }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ color: 'var(--text-secondary)', fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{label}</span>
        <div style={{ background: accent + '18', color: accent, padding: '8px', borderRadius: 9, display: 'flex', border: `1px solid ${accent}30` }}>{icon}</div>
      </div>
      <div style={{ fontSize: 36, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.03em', fontFamily: 'Outfit, sans-serif' }}>{value}</div>
      {trend && (
        <div style={{ fontSize: 11.5, color: trendUp ? 'var(--green)' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 500 }}>
          <span>{trendUp ? '↑' : '→'}</span> {trend}
        </div>
      )}
    </div>
  );
}
