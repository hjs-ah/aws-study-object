// src/components/DomainHeader.jsx
export function DomainHeader({ domain, progress }) {
  const score = progress.score
  const attempted = Object.keys(progress.answeredQuestions ?? {}).length

  return (
    <div style={{
      padding: '24px 28px 0',
    }}>
      {/* Title row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <h1 style={{
              fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em',
              color: 'var(--color-text-primary)',
            }}>
              {domain.title}
            </h1>
            <span style={{
              fontSize: 11, fontFamily: 'var(--font-mono)',
              padding: '2px 8px',
              background: 'var(--color-accent-dim)',
              border: '1px solid var(--color-accent-border)',
              borderRadius: 20,
              color: 'var(--color-accent)',
            }}>
              {domain.weight}% of exam
            </span>
          </div>
          <p style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>
            {domain.description}
          </p>
        </div>

        {score !== null && (
          <div style={{ textAlign: 'right' }}>
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
          { label: 'Practice Q\'s', value: domain.questionCount },
          { label: 'Answered', value: attempted > 0 ? `${attempted}/${domain.questionCount}` : '—' },
        ].map(({ label, value }) => (
          <div key={label} style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            padding: '10px 14px',
          }}>
            <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 3 }}>{label}</div>
            <div style={{ fontSize: 18, fontWeight: 500, fontFamily: 'var(--font-mono)', color: 'var(--color-text-primary)' }}>
              {value}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
