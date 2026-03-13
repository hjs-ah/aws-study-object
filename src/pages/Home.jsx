// src/pages/Home.jsx
// Cert home — shows domain grid + score dashboard for a given certification.

import { useParams, useNavigate } from 'react-router-dom'
import { getCert } from '../data/certifications.js'
import { useScore } from '../hooks/useScore.js'
import ScoreBadge from '../components/ScoreBadge.jsx'

export default function Home() {
  const { certSlug } = useParams()
  const navigate = useNavigate()
  const cert = getCert(certSlug)
  const { getDomainScore, getDomainCounts, getOverallScore, isExamReady } = useScore(certSlug)

  if (!cert) {
    return (
      <div style={{ padding: '2rem', color: 'var(--text-primary)' }}>
        Certification not found. <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: cert?.color, cursor: 'pointer', textDecoration: 'underline' }}>Go back</button>
      </div>
    )
  }

  const overall = getOverallScore(cert.domains)
  const examReady = isExamReady(cert.domains)

  return (
    <div style={{ padding: '1.5rem', maxWidth: '800px', margin: '0 auto' }}>

      {/* Cert header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '1.75rem' }}>{cert.icon}</span>
          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {cert.examCode} · {cert.subtitle}
            </div>
            <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {cert.title}
            </h1>
          </div>
          {overall !== null && (
            <div style={{ marginLeft: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <ScoreBadge score={overall} size="lg" />
              {examReady && <span style={{ fontSize: '0.7rem', color: '#22c55e', marginTop: '2px' }}>Exam Ready ✓</span>}
            </div>
          )}
        </div>
      </div>

      {/* Domain grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
        {cert.domains.map((domain) => {
          const score = getDomainScore(domain.slug)
          const counts = getDomainCounts(domain.slug)
          return (
            <div
              key={domain.slug}
              onClick={() => navigate(`/app/${certSlug}/domain/${domain.slug}`)}
              style={{
                background: 'var(--bg-secondary)',
                borderRadius: '12px',
                padding: '1.25rem',
                cursor: 'pointer',
                border: '1px solid var(--border)',
                transition: 'all 0.15s',
                borderLeft: `3px solid ${domain.color}`,
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-tertiary)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-secondary)'}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>{domain.title}</span>
                <ScoreBadge score={score} />
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                {domain.weight}% of exam · {domain.questionCount} questions
              </div>
              {counts.total > 0 && (
                <div style={{ height: '3px', background: 'var(--bg-tertiary)', borderRadius: '99px', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', borderRadius: '99px', transition: 'width 0.4s ease',
                    width: `${score ?? 0}%`,
                    background: score >= 80 ? '#22c55e' : score >= 60 ? '#f59e0b' : '#ef4444',
                  }} />
                </div>
              )}
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                {counts.total === 0 ? 'Not started' : `${counts.correct}/${counts.total} correct`}
              </div>
            </div>
          )
        })}
      </div>

      {/* Score dashboard link */}
      <button
        onClick={() => navigate(`/app/${certSlug}/scores`)}
        style={{
          marginTop: '1.5rem', width: '100%', padding: '0.85rem',
          background: 'var(--bg-secondary)', border: '1px solid var(--border)',
          borderRadius: '10px', cursor: 'pointer', fontSize: '0.875rem',
          color: 'var(--text-primary)', fontWeight: 600,
          transition: 'background 0.15s',
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-tertiary)'}
        onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-secondary)'}
      >
        📊 View Full Score Dashboard →
      </button>
    </div>
  )
}
