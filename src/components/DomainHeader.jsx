// src/components/DomainHeader.jsx
export function DomainHeader({ domain, progress, source, notionConfigured }) {
  const score = progress.score
  const attempted = Object.keys(progress.answeredQuestions ?? {}).length

  const syncBadge = () => {
    if (source === 'notion') {
      return { label: 'Notion live', color: 'var(--color-success)', bg: 'var(--color-success-dim)', border: 'rgba(62,207,142,0.25)', dot: true }
    }
    if (notionConfigured === false) {
      return { label: 'Notion not configured', color: 'var(--color-text-muted)', bg: 'var(--color-surface-raised)', border: 'var(--color-border)', dot: false }
    }
    if (source === 'seed') {
      return { label: 'Seed data', color: 'var(--color-warning)', bg: 'var(--color-warning-dim)', border: 'rgba(245,158,11,0.25)', dot: false }
    }
    return null
  }

  const badge = syncBadge()

  return (
    <div style={{ padding: '24px 28px 0' }}>
      {/* Title row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
            <h1 style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--color-text-primary)' }}>
              {domain.title}
            </h1>
            <span style={{
              fontSize: 11, fontFamily: 'var(--font-mono)', padding: '2px 8px',
              background: 'var(--color-accent-dim)', border: '1px solid var(--color-accent-border)',
              borderRadius: 20, color: 'var(--color-accent)',
            }}>
              {domain.weight}% of exam
            </span>

            {/* Notion sync indicator */}
            {badge && (
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                fontSize: 10, fontFamily: 'var(--font-mono)',
                padding: '2px 8px',
                background: badge.bg,
                border: `1px solid ${badge.border}`,
                borderRadius: 20,
                color: badge.color,
              }}>
                {badge.dot && (
                  <span style={{
                    width: 5, height: 5, borderRadius: '50%',
                    background: badge.color, display: 'inline-block',
                    animation: 'pulse 2s ease-in-out infinite',
                  }} />
                )}
                {badge.label}
              </span>
            )}
          </div>
          <p style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>
            {domain.description}
          </p>
        </div>

        {score !== null && (
          <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 12 }}>
            <div style={{
              fontSize: 28, fontWeight: 600, fontFamily: 'var(--font-mono)',
              color: score >= 80 ? 'var(--color-success)' : score >= 60 ? 'var(--color-warning)' : 'var(--color-danger)',
            }}>
              {score}%
            </div>
            <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>best score</div>
          </div>
        )}
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 20 }}>
        {[
          { label: 'Concepts', value: domain.concepts },
          { label: "Practice Q's", value: domain.questionCount },
          { label: 'Answered', value: attempted > 0 ? `${attempted}/${domain.questionCount}` : '—' },
        ].map(({ label, value }) => (
          <div key={label} style={{
            background: 'var(--color-surface)', border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)', padding: '10px 14px',
          }}>
            <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 3 }}>{label}</div>
            <div style={{ fontSize: 18, fontWeight: 500, fontFamily: 'var(--font-mono)', color: 'var(--color-text-primary)' }}>
              {value}
            </div>
          </div>
        ))}
      </div>

      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
    </div>
  )
}
