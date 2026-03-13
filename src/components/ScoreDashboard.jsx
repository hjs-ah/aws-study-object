// src/components/ScoreDashboard.jsx
// Full score breakdown by domain for a given certification.
// Shows: per-domain %, overall score, weak domains, exam-ready signal.

import { useNavigate } from 'react-router-dom'
import { useScore } from '../hooks/useScore.js'
import { getCert } from '../data/certifications.js'

export default function ScoreDashboard({ certSlug }) {
  const cert = getCert(certSlug)
  const navigate = useNavigate()
  const {
    getDomainScore,
    getDomainCounts,
    getWeakDomains,
    getOverallScore,
    isExamReady,
    resetCert,
    EXAM_READY_THRESHOLD,
  } = useScore(certSlug)

  if (!cert) return null

  const overall = getOverallScore(cert.domains)
  const examReady = isExamReady(cert.domains)
  const weakDomains = getWeakDomains(cert.domains)
  const totalAttempts = cert.domains.reduce((sum, d) => sum + getDomainCounts(d.slug).total, 0)

  return (
    <div style={{ padding: '1.5rem', maxWidth: '720px', margin: '0 auto' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-primary)' }}>
            Score Dashboard
          </h2>
          <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {cert.title} · {cert.examCode}
          </p>
        </div>
        {totalAttempts > 0 && (
          <button
            onClick={() => { if (confirm('Reset all scores for this certification?')) resetCert() }}
            style={{ background: 'none', border: '1px solid var(--border)', borderRadius: '6px',
              padding: '0.35rem 0.75rem', fontSize: '0.75rem', color: 'var(--text-muted)',
              cursor: 'pointer' }}
          >
            Reset Scores
          </button>
        )}
      </div>

      {/* Overall + Exam Ready */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ background: 'var(--bg-secondary)', borderRadius: '10px', padding: '1.25rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 800,
            color: overall === null ? 'var(--text-muted)' : overall >= 80 ? '#22c55e' : overall >= 60 ? '#f59e0b' : '#ef4444' }}>
            {overall === null ? '—' : `${overall}%`}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Overall Score</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{totalAttempts} questions answered</div>
        </div>

        <div style={{ background: examReady ? 'rgba(34,197,94,0.08)' : 'var(--bg-secondary)',
          border: examReady ? '1px solid rgba(34,197,94,0.3)' : '1px solid transparent',
          borderRadius: '10px', padding: '1.25rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem' }}>{examReady ? '✅' : totalAttempts === 0 ? '📝' : '📈'}</div>
          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: examReady ? '#22c55e' : 'var(--text-primary)', marginTop: '0.5rem' }}>
            {examReady ? 'Exam Ready!' : totalAttempts === 0 ? 'Start Practicing' : 'Keep Going'}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            {examReady ? `≥${EXAM_READY_THRESHOLD}% all domains` : `Need ${EXAM_READY_THRESHOLD}%+ per domain (min 5 questions)`}
          </div>
        </div>
      </div>

      {/* Weak domains alert */}
      {weakDomains.length > 0 && (
        <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)',
          borderRadius: '8px', padding: '0.85rem 1rem', marginBottom: '1.25rem',
          fontSize: '0.82rem', color: 'var(--text-primary)' }}>
          <strong style={{ color: '#ef4444' }}>⚠ Focus Areas:</strong>{' '}
          {weakDomains.map(d => d.title).join(', ')} — these domains need more practice.
        </div>
      )}

      {/* Per-domain breakdown */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {cert.domains.map((domain) => {
          const score = getDomainScore(domain.slug)
          const counts = getDomainCounts(domain.slug)
          const barColor = score === null ? 'var(--bg-tertiary)'
            : score >= 80 ? '#22c55e' : score >= 60 ? '#f59e0b' : '#ef4444'

          return (
            <div
              key={domain.slug}
              onClick={() => navigate(`/app/${certSlug}/domain/${domain.slug}`)}
              style={{ background: 'var(--bg-secondary)', borderRadius: '8px', padding: '0.85rem 1rem',
                cursor: 'pointer', transition: 'background 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-tertiary)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-secondary)'}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>{domain.title}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    {counts.correct}/{counts.total}
                  </span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: barColor }}>
                    {score === null ? '—' : `${score}%`}
                  </span>
                </div>
              </div>
              {/* Progress bar */}
              <div style={{ height: '4px', background: 'var(--bg-tertiary)', borderRadius: '99px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${score ?? 0}%`, background: barColor,
                  borderRadius: '99px', transition: 'width 0.4s ease' }} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
