// src/pages/Home.jsx
import { Link } from 'react-router-dom'
import { DOMAINS, getTotalQuestions } from '../data/domains.js'

export function Home({ getProgress, getOverallStats }) {
  const stats = getOverallStats()
  const totalQ = getTotalQuestions()

  return (
    <div style={{ padding: '28px', maxWidth: 900, margin: '0 auto' }}>
      {/* Hero */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{
          fontSize: 28, fontWeight: 600, letterSpacing: '-0.02em',
          color: 'var(--color-text-primary)', marginBottom: 6,
        }}>
          AWS Solutions Architect
        </h1>
        <p style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>
          SAA-C03 · 8 domains · {totalQ} practice questions
        </p>
      </div>

      {/* Overall stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 28 }}>
        {[
          { label: 'Domains attempted', value: `${stats.attempted}/8` },
          { label: 'Average score', value: stats.avgScore !== null ? `${stats.avgScore}%` : '—' },
          { label: 'Total answers', value: stats.totalAttempts },
        ].map(({ label, value }) => (
          <div key={label} style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            padding: '16px 20px',
          }}>
            <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 6 }}>{label}</div>
            <div style={{
              fontSize: 26, fontWeight: 600, fontFamily: 'var(--font-mono)',
              color: 'var(--color-text-primary)',
            }}>
              {value}
            </div>
          </div>
        ))}
      </div>

      {/* Domain grid */}
      <div style={{ marginBottom: 12 }}>
        <h2 style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 12, fontWeight: 400 }}>
          All domains
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
          {DOMAINS.map((domain) => {
            const prog = getProgress(domain.slug)
            const score = prog.score
            const attempted = Object.keys(prog.answeredQuestions ?? {}).length

            return (
              <Link
                key={domain.slug}
                to={`/domain/${domain.slug}`}
                style={{
                  display: 'block',
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '16px 18px',
                  transition: 'var(--transition)',
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-border-emphasis)'
                  e.currentTarget.style.background = 'var(--color-surface-raised)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-border)'
                  e.currentTarget.style.background = 'var(--color-surface)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: 2 }}>
                      {domain.title}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>
                      {domain.questionCount} questions
                    </div>
                  </div>
                  <span style={{
                    fontSize: 10, fontFamily: 'var(--font-mono)',
                    padding: '2px 7px',
                    background: 'var(--color-accent-dim)',
                    border: '1px solid var(--color-accent-border)',
                    borderRadius: 20,
                    color: 'var(--color-accent)',
                  }}>
                    {domain.weight}%
                  </span>
                </div>

                {/* Progress bar */}
                <div style={{
                  height: 3, background: 'var(--color-border)',
                  borderRadius: 2, overflow: 'hidden', marginBottom: 6,
                }}>
                  <div style={{
                    width: score !== null ? `${score}%` : '0%',
                    height: '100%',
                    background: score >= 80 ? 'var(--color-success)' : score >= 60 ? 'var(--color-warning)' : score !== null ? 'var(--color-danger)' : 'transparent',
                    borderRadius: 2,
                    transition: 'width 600ms ease',
                  }} />
                </div>

                <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>
                  {score !== null ? `${score}% · ${attempted} answered` : 'Not started'}
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
