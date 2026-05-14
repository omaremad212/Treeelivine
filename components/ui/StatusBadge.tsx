'use client'

const STATUS_COLORS: Record<string, string> = {
  active: 'var(--success)',
  inactive: 'var(--text-muted)',
  lead: 'var(--info)',
  prospect: 'var(--warning)',
  churned: 'var(--danger)',
  pending: 'var(--warning)',
  in_progress: 'var(--info)',
  in_review: 'var(--accent)',
  completed: 'var(--success)',
  cancelled: 'var(--text-muted)',
  paid: 'var(--success)',
  unpaid: 'var(--warning)',
  overdue: 'var(--danger)',
  draft: 'var(--text-muted)',
  approved: 'var(--success)',
  rejected: 'var(--danger)',
  high: 'var(--danger)',
  medium: 'var(--warning)',
  low: 'var(--text-muted)',
}

export default function StatusBadge({ status, label }: { status: string; label?: string }) {
  const color = STATUS_COLORS[status] || 'var(--text-muted)'
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
      fontSize: '0.75rem', fontWeight: 500,
      padding: '0.2rem 0.6rem', borderRadius: 20,
      background: color + '22', color,
      border: `1px solid ${color}44`,
      whiteSpace: 'nowrap',
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: color, display: 'inline-block' }} />
      {label || status.replace(/_/g, ' ')}
    </span>
  )
}
