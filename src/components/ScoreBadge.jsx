// src/components/ScoreBadge.jsx
// Compact score display for domain headers and sidebar.
// Shows % with color coding: green ≥80, yellow 60-79, red <60, gray = no attempts.

export default function ScoreBadge({ score, total, size = 'sm' }) {
  if (score === null || score === undefined) {
    return total > 0 ? null : (
      <span style={{
        fontSize: size === 'sm' ? '0.65rem' : '0.75rem',
        color: 'var(--text-muted)',
        padding: '2px 6px',
        borderRadius: '99px',
        background: 'var(--bg-tertiary)',
        whiteSpace: 'nowrap',
      }}>no attempts</span>
    )
  }

  const color = score >= 80 ? '#22c55e' : score >= 60 ? '#f59e0b' : '#ef4444'
  const bg = score >= 80 ? 'rgba(34,197,94,0.12)' : score >= 60 ? 'rgba(245,158,11,0.12)' : 'rgba(239,68,68,0.12)'

  return (
    <span style={{
      fontSize: size === 'sm' ? '0.65rem' : '0.8rem',
      fontWeight: 700,
      color,
      background: bg,
      padding: size === 'sm' ? '2px 7px' : '3px 10px',
      borderRadius: '99px',
      whiteSpace: 'nowrap',
      letterSpacing: '0.02em',
    }}>
      {score}%
    </span>
  )
}
