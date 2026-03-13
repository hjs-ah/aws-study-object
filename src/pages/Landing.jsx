// src/pages/Landing.jsx
// Landing page with cert selector dropdown + feature cards + release notes.

import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { CERTIFICATIONS } from '../data/certifications.js'
import { useTheme } from '../hooks/useTheme.js'

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

function ReleaseNotesSection() {
  const [releases, setReleases] = useState(FALLBACK_RELEASES)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    fetch('/api/releases')
      .then(r => r.json())
      .then(data => { if (data.releases?.length > 0) setReleases(data.releases) })
      .catch(() => {})
  }, [])

  const visible = expanded ? releases : releases.slice(0, 2)

  return (
    <div style={{ width: '100%', maxWidth: '680px', marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--color-border)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h3 style={{ margin: 0, fontSize: '0.78rem', fontWeight: 800, color: 'var(--color-text-primary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          🔖 Release Notes
        </h3>
        {releases.length > 2 && (
          <button onClick={() => setExpanded(e => !e)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.72rem', color: 'var(--color-text-muted)', padding: 0 }}>
            {expanded ? 'Show less ↑' : `Show all ${releases.length} ↓`}
          </button>
        )}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {visible.map((r, i) => {
          const cat = CATEGORY_COLORS[r.category] ?? CATEGORY_COLORS.Feature
          return (
            <div key={i} style={{ background: 'var(--color-surface)', borderRadius: '10px', padding: '0.75rem 1rem', display: 'flex', gap: '0.85rem', alignItems: 'flex-start', border: '1px solid var(--color-border)' }}>
              <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', paddingTop: '2px' }}>
                <span style={{ fontSize: '0.62rem', fontWeight: 800, color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>{r.version}</span>
                <span style={{ fontSize: '0.58rem', fontWeight: 700, color: cat.color, background: cat.bg, padding: '1px 6px', borderRadius: '99px', whiteSpace: 'nowrap' }}>{r.category}</span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.15rem' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>{r.title}</span>
                  <span style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', flexShrink: 0 }}>{r.date}</span>
                </div>
                <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>{r.description}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function Landing() {
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()
  const [selectedCert, setSelectedCert] = useState(CERTIFICATIONS[0])

  const cert = selectedCert
  const featureCards = [
    { icon: '🗺️', label: 'Interactive Diagrams', desc: 'Visual concept maps for every domain' },
    { icon: '🎯', label: 'Scenario Questions', desc: 'Exam-style practice with explanations' },
    { icon: '🤖', label: 'AI Tutor', desc: 'Ask anything, get instant guidance' },
  ]

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--color-bg)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '3.5rem 1rem 3rem',
      position: 'relative',
    }}>
      {/* Theme toggle top-right */}
      <button
        onClick={toggleTheme}
        style={{
          position: 'absolute', top: '1.25rem', right: '1.25rem',
          background: 'var(--color-surface)', border: '1px solid var(--color-border)',
          borderRadius: '20px', padding: '4px 12px', cursor: 'pointer',
          fontSize: '0.78rem', color: 'var(--color-text-muted)',
          display: 'flex', alignItems: 'center', gap: '5px',
          transition: 'all 0.15s',
        }}
      >
        {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
      </button>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem', maxWidth: '520px' }}>
        <div style={{ fontSize: '2.25rem', marginBottom: '0.6rem' }}>☁️</div>
        <h1 style={{ margin: '0 0 0.6rem', fontSize: 'clamp(1.6rem, 4vw, 2.25rem)', fontWeight: 900, color: 'var(--color-text-primary)', letterSpacing: '-0.02em' }}>
          AWS Certification Study
        </h1>
        <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
          AI-powered exam prep with interactive diagrams, practice questions, and a score engine.
        </p>
      </div>

      {/* Cert selector dropdown */}
      <div style={{ width: '100%', maxWidth: '680px', marginBottom: '1.5rem' }}>
        <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>
          Select Certification
        </label>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {CERTIFICATIONS.map(c => (
            <button
              key={c.slug}
              onClick={() => setSelectedCert(c)}
              style={{
                flex: 1, minWidth: '200px',
                padding: '0.75rem 1rem',
                background: selectedCert.slug === c.slug ? `${c.color}15` : 'var(--color-surface)',
                border: selectedCert.slug === c.slug ? `2px solid ${c.color}` : '2px solid var(--color-border)',
                borderRadius: '10px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                transition: 'all 0.15s',
                textAlign: 'left',
              }}
            >
              <span style={{ fontSize: '1.35rem' }}>{c.icon}</span>
              <div>
                <div style={{ fontSize: '0.62rem', fontWeight: 800, color: c.color, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{c.examCode}</div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>{c.title}</div>
              </div>
              {selectedCert.slug === c.slug && (
                <span style={{ marginLeft: 'auto', width: '8px', height: '8px', borderRadius: '50%', background: c.color, flexShrink: 0 }} />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Selected cert card */}
      <div style={{
        width: '100%', maxWidth: '680px',
        background: 'var(--color-surface)',
        border: `1px solid var(--color-border)`,
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: `0 4px 24px ${cert.color}18`,
      }}>
        {/* Color bar */}
        <div style={{ height: '4px', background: cert.color }} />

        <div style={{ padding: '1.75rem 2rem' }}>
          {/* Header row */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div>
              <div style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.2rem' }}>
                {cert.subtitle} · {cert.examCode}
              </div>
              <h2 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>
                {cert.icon} {cert.title}
              </h2>
            </div>
            <div style={{ display: 'flex', gap: '1.25rem', textAlign: 'center', flexShrink: 0 }}>
              {[
                { label: 'Domains', value: cert.domains.length },
                { label: 'Questions', value: cert.questionCount + '+' },
                { label: 'Passing', value: cert.passingScore + '%' },
              ].map(({ label, value }) => (
                <div key={label}>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: cert.color }}>{value}</div>
                  <div style={{ fontSize: '0.62rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          <p style={{ margin: '0 0 1.25rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
            {cert.description}
          </p>

          {/* Feature cards: 3 rounded rectangles */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
            {featureCards.map(({ icon, label, desc }) => (
              <div key={label} style={{
                background: 'var(--color-surface-raised)',
                border: '1px solid var(--color-border)',
                borderRadius: '10px',
                padding: '0.875rem',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '1.35rem', marginBottom: '0.3rem' }}>{icon}</div>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '0.2rem' }}>{label}</div>
                <div style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)', lineHeight: 1.4 }}>{desc}</div>
              </div>
            ))}
          </div>

          {/* Progress pill */}
          <div style={{ marginBottom: '1.25rem', textAlign: 'center' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
              💾 Progress saved locally · no account needed
            </span>
          </div>

          {/* CTA button */}
          <button
            onClick={() => navigate(`/app/${cert.slug}`)}
            style={{
              width: '100%',
              padding: '0.85rem',
              background: cert.color,
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '0.95rem',
              fontWeight: 800,
              color: '#fff',
              letterSpacing: '0.02em',
              transition: 'all 0.15s',
              boxShadow: `0 4px 14px ${cert.color}44`,
            }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '0.9'; e.currentTarget.style.transform = 'translateY(-1px)' }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'none' }}
          >
            Start Studying {cert.examCode} →
          </button>
        </div>
      </div>

      {/* Release Notes */}
      <ReleaseNotesSection />

      <p style={{ marginTop: '2rem', fontSize: '0.68rem', color: 'var(--color-text-muted)' }}>
        More certifications coming soon · Built with Amazon Bedrock &amp; Notion
      </p>
    </div>
  )
}
