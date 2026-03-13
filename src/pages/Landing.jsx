// src/pages/Landing.jsx
// Two-path certification chooser + release notes feed.

import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { CERTIFICATIONS } from '../data/certifications.js'

// Static fallback releases
const FALLBACK_RELEASES = [
  { version: 'v1.3', date: 'Mar 2026', category: 'Feature', title: 'AI Practitioner Path + Score Engine', description: 'Full AIF-C01 learning path added. Score engine tracks right/wrong per domain with exam-ready signal.' },
  { version: 'v1.2', date: 'Feb 2026', category: 'Feature', title: 'Architecture Trap + Builder', description: 'Interactive broken architecture scenarios and drag-and-drop builder across all SAA domains.' },
  { version: 'v1.1', date: 'Jan 2026', category: 'Content', title: 'Glossary Terms + Diagrams', description: 'Clickable SVG diagrams for VPC and IAM. 50+ glossary keyword chips with definition popovers.' },
  { version: 'v1.0', date: 'Dec 2025', category: 'Feature', title: 'Initial Launch', description: 'SAA-C03 study app with 8 domains, practice questions, AI ask bar, and Notion CMS integration.' },
]

const CATEGORY_COLORS = {
  Feature: { color: '#185FA5', bg: 'rgba(24,95,165,0.12)' },
  Fix: { color: '#0F6E56', bg: 'rgba(15,110,86,0.12)' },
  Content: { color: '#854F0B', bg: 'rgba(133,79,11,0.12)' },
  Performance: { color: '#534AB7', bg: 'rgba(83,74,183,0.12)' },
  Breaking: { color: '#993C1D', bg: 'rgba(153,60,29,0.12)' },
}

function CertCard({ cert }) {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate(`/app/${cert.slug}`)}
      style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border)',
        borderRadius: '16px',
        padding: '2rem',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = cert.color
        e.currentTarget.style.transform = 'translateY(-3px)'
        e.currentTarget.style.boxShadow = `0 8px 24px ${cert.color}22`
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--border)'
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: cert.color }} />

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div style={{ fontSize: '2.5rem' }}>{cert.icon}</div>
        <span style={{
          fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em',
          color: cert.color, background: `${cert.color}18`,
          padding: '3px 10px', borderRadius: '99px',
        }}>
          {cert.examCode}
        </span>
      </div>

      <div>
        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.25rem' }}>
          {cert.subtitle}
        </div>
        <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2 }}>
          {cert.title}
        </h2>
      </div>

      <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
        {cert.description}
      </p>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        {[
          { label: 'Domains', value: cert.domains.length },
          { label: 'Questions', value: cert.questionCount + '+' },
          { label: 'Passing', value: cert.passingScore + '%' },
        ].map(({ label, value }) => (
          <div key={label} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: cert.color }}>{value}</div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
          </div>
        ))}
      </div>

      <div style={{
        marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        paddingTop: '1rem', borderTop: '1px solid var(--border)',
      }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          {cert.domains.map(d => d.title).slice(0, 3).join(' · ')}
          {cert.domains.length > 3 && ` + ${cert.domains.length - 3} more`}
        </span>
        <span style={{ fontSize: '1.1rem', color: cert.color }}>→</span>
      </div>
    </div>
  )
}

function ReleaseNotesSection() {
  const [releases, setReleases] = useState(FALLBACK_RELEASES)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    fetch('/api/releases')
      .then(r => r.json())
      .then(data => { if (data.releases?.length > 0) setReleases(data.releases) })
      .catch(() => {}) // silently fall back
  }, [])

  const visible = expanded ? releases : releases.slice(0, 2)

  return (
    <div style={{
      width: '100%',
      maxWidth: '720px',
      marginTop: '3rem',
      paddingTop: '2rem',
      borderTop: '1px solid var(--border)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <h3 style={{ margin: 0, fontSize: '0.85rem', fontWeight: 700,
          color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          🔖 Release Notes
        </h3>
        {releases.length > 2 && (
          <button
            onClick={() => setExpanded(e => !e)}
            style={{ background: 'none', border: 'none', cursor: 'pointer',
              fontSize: '0.75rem', color: 'var(--text-muted)', padding: 0 }}
          >
            {expanded ? 'Show less ↑' : `Show all ${releases.length} ↓`}
          </button>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {visible.map((r, i) => {
          const cat = CATEGORY_COLORS[r.category] ?? CATEGORY_COLORS.Feature
          return (
            <div key={i} style={{
              background: 'var(--bg-secondary)',
              borderRadius: '10px',
              padding: '0.85rem 1rem',
              display: 'flex',
              gap: '0.85rem',
              alignItems: 'flex-start',
              border: '1px solid var(--border)',
            }}>
              <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', paddingTop: '2px' }}>
                <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)',
                  fontFamily: 'monospace', letterSpacing: '0.04em' }}>{r.version}</span>
                <span style={{ fontSize: '0.6rem', fontWeight: 700, color: cat.color,
                  background: cat.bg, padding: '1px 6px', borderRadius: '99px', whiteSpace: 'nowrap' }}>
                  {r.category}
                </span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.2rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>{r.title}</span>
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', flexShrink: 0 }}>{r.date}</span>
                </div>
                <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {r.description}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function Landing() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-primary)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '4rem 1rem 3rem',
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '3rem', maxWidth: '540px' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>☁️</div>
        <h1 style={{ margin: '0 0 0.75rem', fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
          fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          AWS Certification Study
        </h1>
        <p style={{ margin: 0, fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          AI-powered exam prep with interactive diagrams, practice questions, and a score engine.
          Choose your certification path to begin.
        </p>
      </div>

      {/* Cert cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem',
        width: '100%',
        maxWidth: '720px',
      }}>
        {CERTIFICATIONS.map((cert) => (
          <CertCard key={cert.slug} cert={cert} />
        ))}
      </div>

      {/* Release Notes */}
      <ReleaseNotesSection />

      <p style={{ marginTop: '2rem', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
        More certifications coming soon · Built with Amazon Bedrock &amp; Notion
      </p>
    </div>
  )
}
