// src/pages/Home.jsx — Cert home with domain grid, score bars, and stat cards

import { useParams, useNavigate } from 'react-router-dom'
import { getCert } from '../data/certifications.js'
import { useScore } from '../hooks/useScore.js'
import ScoreBadge from '../components/ScoreBadge.jsx'

export default function Home() {
  const { certSlug } = useParams()
  const navigate = useNavigate()
  const cert = getCert(certSlug)
  const { getDomainScore, getDomainCounts, getOverallScore, isExamReady } = useScore(certSlug)

  if (!cert) return (
    <div style={{ padding: '2rem', color: 'var(--color-text-primary)' }}>
      Certification not found. <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: 'var(--color-accent)', cursor: 'pointer', textDecoration: 'underline' }}>Go back</button>
    </div>
  )

  const overall = getOverallScore(cert.domains)
  const examReady = isExamReady(cert.domains)

  return (
    <div style={{ padding: '1.75rem', maxWidth: '820px', margin: '0 auto' }}>
      {/* Cert header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: '1.75rem' }}>
        <span style={{ fontSize: '2rem' }}>{cert.icon}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
            {cert.examCode} · {cert.subtitle}
          </div>
          <h1 style={{ margin: 0, fontSize: '1.45rem', fontWeight: 800, color: 'var(--color-text-primary)', lineHeight: 1.2 }}>
            {cert.title}
          </h1>
        </div>
        {overall !== null && (
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <ScoreBadge score={overall} size="lg" />
            {examReady && <div style={{ fontSize: '0.68rem', color: 'var(--color-success)', marginTop: '3px', fontWeight: 700 }}>Exam Ready ✓</div>}
          </div>
        )}
      </div>

      {/* Stat pills row */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {[
          { label: 'Domains', value: cert.domains.length },
          { label: 'Questions', value: cert.questionCount + '+' },
          { label: 'Pass Score', value: cert.passingScore + '%' },
        ].map(({ label, value }) => (
          <div key={label} style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: '8px',
            padding: '0.5rem 1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}>
            <span style={{ fontSize: '1rem', fontWeight: 800, color: cert.color }}>{value}</span>
            <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
          </div>
        ))}
      </div>

      {/* Domain grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(235px, 1fr))', gap: '1rem' }}>
        {cert.domains.map((domain) => {
          const score = getDomainScore(domain.slug)
          const counts = getDomainCounts(domain.slug)
          return (
            <div
              key={domain.slug}
              onClick={() => navigate(`/app/${certSlug}/domain/${domain.slug}`)}
              style={{
                background: 'var(--color-surface)',
                borderRadius: '12px',
                padding: '1.25rem',
                cursor: 'pointer',
                border: '1px solid var(--color-border)',
                borderLeft: `3px solid ${domain.color}`,
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-surface-raised)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--color-surface)'; e.currentTarget.style.transform = 'none' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.3rem' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-text-primary)', lineHeight: 1.25 }}>{domain.title}</span>
                <ScoreBadge score={score} />
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>
                <span style={{ fontWeight: 700, color: domain.color }}>{domain.weight}%</span> of exam · {domain.questionCount} questions
              </div>
              {/* Progress bar */}
              <div style={{ height: '4px', background: 'var(--color-surface-raised)', borderRadius: '99px', overflow: 'hidden', marginBottom: '0.4rem' }}>
                <div style={{
                  height: '100%', borderRadius: '99px', transition: 'width 0.4s ease',
                  width: counts.total > 0 ? `${score ?? 0}%` : '0%',
                  background: score >= 80 ? 'var(--color-success)' : score >= 60 ? 'var(--color-warning)' : score !== null ? 'var(--color-danger)' : 'transparent',
                }} />
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
                {counts.total === 0 ? 'Not started' : `${counts.correct}/${counts.total} correct`}
              </div>
            </div>
          )
        })}
      </div>

      {/* Score dashboard CTA */}
      <button
        onClick={() => navigate(`/app/${certSlug}/scores`)}
        style={{
          marginTop: '1.5rem', width: '100%', padding: '0.875rem',
          background: 'var(--color-surface)', border: '1px solid var(--color-border)',
          borderRadius: '10px', cursor: 'pointer', fontSize: '0.875rem',
          color: 'var(--color-text-primary)', fontWeight: 600, transition: 'background 0.15s',
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'var(--color-surface-raised)'}
        onMouseLeave={e => e.currentTarget.style.background = 'var(--color-surface)'}
      >
        📊 View Full Score Dashboard →
      </button>
    </div>
  )
}
