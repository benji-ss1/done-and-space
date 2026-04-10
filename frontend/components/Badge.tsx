const COLORS: any = {
  new: { bg: '#3b82f620', color: '#60a5fa', label: 'New' },
  contacted: { bg: '#a855f720', color: '#c084fc', label: 'Contacted' },
  qualified: { bg: '#6366f120', color: '#818cf8', label: 'Qualified' },
  warm: { bg: '#f5a62320', color: '#f5a623', label: 'Warm' },
  hot: { bg: '#ef444420', color: '#f87171', label: 'Hot' },
  cold: { bg: '#ffffff10', color: '#6b7280', label: 'Cold' },
  lost: { bg: '#ffffff08', color: '#4b5563', label: 'Lost' },
  converted: { bg: '#22c55e20', color: '#4ade80', label: 'Converted' },
  draft: { bg: '#ffffff10', color: '#6b7280', label: 'Draft' },
  pending_review: { bg: '#f5a62320', color: '#f5a623', label: 'Pending Review' },
  approved: { bg: '#3b82f620', color: '#60a5fa', label: 'Approved' },
  published: { bg: '#22c55e20', color: '#4ade80', label: 'Published' },
  under_offer: { bg: '#a855f720', color: '#c084fc', label: 'Under Offer' },
  sold: { bg: '#ffffff10', color: '#9ca3af', label: 'Sold' },
  archived: { bg: '#ffffff08', color: '#4b5563', label: 'Archived' },
  qualification: { bg: '#ffffff10', color: '#6b7280', label: 'Qualification' },
  viewing: { bg: '#3b82f620', color: '#60a5fa', label: 'Viewing' },
  offer: { bg: '#f5a62320', color: '#f5a623', label: 'Offer' },
  negotiation: { bg: '#f9731620', color: '#fb923c', label: 'Negotiation' },
  under_contract: { bg: '#a855f720', color: '#c084fc', label: 'Under Contract' },
  completed: { bg: '#22c55e20', color: '#4ade80', label: 'Completed' },
  fallen_through: { bg: '#ef444420', color: '#f87171', label: 'Fallen Through' },
  hired: { bg: '#22c55e20', color: '#4ade80', label: 'Hired' },
  rejected: { bg: '#ef444420', color: '#f87171', label: 'Rejected' },
  screening: { bg: '#f5a62320', color: '#f5a623', label: 'Screening' },
  interview: { bg: '#a855f720', color: '#c084fc', label: 'Interview' },
};

export default function Badge({ status }: { status: string }) {
  const s = COLORS[status] || { bg: '#ffffff10', color: '#9ca3af', label: status };
  return (
    <span style={{ background: s.bg, color: s.color, padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, letterSpacing: '0.03em', whiteSpace: 'nowrap' }}>
      {s.label}
    </span>
  );
}
