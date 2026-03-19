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
    resetDomain,
    EXAM_READY_THRESHOLD,
  } = useScore(certSlug)

  if (!cert) return null

  const overall = getOverallScore(cert.domains)
  const examReady = isExamReady(cert.domains)
  const weakDomains = getWeakDomains(cert.domains)
  const totalAttempts = cert.domains.reduce((sum, d) => sum + getDomainCounts(d.slug).total, 0)

  return (
    <div style={{ padding: '1.5rem', maxWidth: '720px', margin: '0 auto', position: 'relative' }}>
      {/* Cloud watermark — upper right */}
      <img
        src="/cloud.png"
        alt=""
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '-20px',
          right: '-40px',
          width: '260px',
          opacity: 0.05,
          pointerEvents: 'none',
          userSelect: 'none',
          filter: 'grayscale(1)',
          zIndex: 0,
        }}
      />

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--color-text-primary)' }}>
            Score Dashboard
          </h2>
          <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
            {cert.title} · {cert.examCode}
          </p>
        </div>
        {totalAttempts > 0 && (
          <button
            onClick={() => { if (confirm('Reset all scores for this certification?')) resetCert() }}
            style={{ background: 'none', border: '1px solid var(--color-border)', borderRadius: '6px',
              padding: '0.35rem 0.75rem', fontSize: '0.75rem', color: 'var(--color-text-muted)',
              cursor: 'pointer' }}
          >
            Reset Scores
          </button>
        )}
      </div>

      {/* Overall + Exam Ready */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ background: 'var(--color-surface)', borderRadius: '10px', padding: '1.25rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 800,
            color: overall === null ? 'var(--color-text-muted)' : overall >= 80 ? '#22c55e' : overall >= 60 ? '#f59e0b' : '#ef4444' }}>
            {overall === null ? '—' : `${overall}%`}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>Overall Score</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>{totalAttempts} questions answered</div>
        </div>

        <div style={{ background: examReady ? 'rgba(34,197,94,0.08)' : 'var(--color-surface)',
          border: examReady ? '1px solid rgba(34,197,94,0.3)' : '1px solid transparent',
          borderRadius: '10px', padding: '1.25rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem' }}>{examReady ? '✅' : totalAttempts === 0 ? '📝' : '📈'}</div>
          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: examReady ? '#22c55e' : 'var(--color-text-primary)', marginTop: '0.5rem' }}>
            {examReady ? 'Exam Ready!' : totalAttempts === 0 ? 'Start Practicing' : 'Keep Going'}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
            {examReady ? `≥${EXAM_READY_THRESHOLD}% all domains` : `Need ${EXAM_READY_THRESHOLD}%+ per domain (min 5 questions)`}
          </div>
        </div>
      </div>

      {/* Weak domains alert */}
      {weakDomains.length > 0 && (
        <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)',
          borderRadius: '8px', padding: '0.85rem 1rem', marginBottom: '1.25rem',
          fontSize: '0.82rem', color: 'var(--color-text-primary)' }}>
          <strong style={{ color: '#ef4444' }}>⚠ Focus Areas:</strong>{' '}
          {weakDomains.map(d => d.title).join(', ')} — these domains need more practice.
        </div>
      )}

      {/* Per-domain breakdown */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {cert.domains.map((domain) => {
          const score = getDomainScore(domain.slug)
          const counts = getDomainCounts(domain.slug)
          const barColor = score === null ? 'var(--color-surface-raised)'
            : score >= 80 ? '#22c55e' : score >= 60 ? '#f59e0b' : '#ef4444'

          return (
            <div
              key={domain.slug}
              style={{ background: 'var(--color-surface)', borderRadius: '8px', padding: '0.85rem 1rem',
                transition: 'background 0.15s', position: 'relative' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                {/* Clickable domain name */}
                <span
                  onClick={() => navigate(`/app/${certSlug}/domain/${domain.slug}`)}
                  style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary)', cursor: 'pointer' }}
                  onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
                  onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
                >
                  {domain.title}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                    {counts.correct}/{counts.total}
                  </span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: barColor }}>
                    {score === null ? '—' : `${score}%`}
                  </span>
                  {counts.total > 0 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        if (confirm(`Reset scores for ${domain.title}?`)) resetDomain(domain.slug)
                      }}
                      title="Reset this domain's scores"
                      style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        fontSize: '0.68rem', color: 'var(--color-text-muted)',
                        padding: '2px 6px', borderRadius: '4px',
                        border: '1px solid var(--color-border)',
                        fontFamily: 'inherit', lineHeight: 1,
                        transition: 'all 0.15s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = '#ef4444'; e.currentTarget.style.color = '#ef4444' }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.color = 'var(--color-text-muted)' }}
                    >
                      ↺ reset
                    </button>
                  )}
                </div>
              </div>
              {/* Progress bar */}
              <div style={{ height: '4px', background: 'var(--color-surface-raised)', borderRadius: '99px', overflow: 'hidden' }}>
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
