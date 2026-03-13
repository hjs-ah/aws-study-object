// src/components/Sidebar.jsx
// Cert-scoped sidebar. Shows domains for the current cert with score badges.

import { NavLink, useNavigate, useParams } from 'react-router-dom'
import { useState } from 'react'
import { getCert } from '../data/certifications.js'
import { useScore } from '../hooks/useScore.js'
import ScoreBadge from './ScoreBadge.jsx'

export default function Sidebar({ isOpen, onClose }) {
  const { certSlug } = useParams()
  const navigate = useNavigate()
  const cert = getCert(certSlug)
  const { getDomainScore } = useScore(certSlug)

  const base = `/app/${certSlug}`

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div onClick={onClose} style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          zIndex: 40, display: 'none',
        }} className="mobile-overlay" />
      )}

      <aside style={{
        width: '220px', flexShrink: 0, borderRight: '1px solid var(--border)',
        background: 'var(--bg-secondary)', display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
      }}>
        {/* Cert switcher at top */}
        <div
          onClick={() => navigate('/')}
          style={{ padding: '1rem', borderBottom: '1px solid var(--border)',
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <span style={{ fontSize: '1.25rem' }}>{cert?.icon ?? '☁️'}</span>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              {cert?.examCode}
            </div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {cert?.title}
            </div>
          </div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>↕</span>
        </div>

        {/* Getting Started */}
        <div style={{ padding: '0.75rem 0.75rem 0.25rem', fontSize: '0.65rem',
          color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
          Getting Started
        </div>
        {[
          { to: `${base}/how-to-use`, label: '📖 How to Use' },
          { to: `${base}/scores`, label: '📊 Score Dashboard' },
        ].map(({ to, label }) => (
          <NavLink key={to} to={to} onClick={onClose}
            style={({ isActive }) => ({
              display: 'block', padding: '0.4rem 0.75rem', fontSize: '0.8rem',
              color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
              background: isActive ? 'var(--bg-tertiary)' : 'transparent',
              textDecoration: 'none', borderRadius: '6px', margin: '0 0.25rem',
              transition: 'all 0.15s',
            })}>
            {label}
          </NavLink>
        ))}

        {/* Domains */}
        <div style={{ padding: '0.75rem 0.75rem 0.25rem', marginTop: '0.5rem',
          fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase',
          letterSpacing: '0.08em', fontWeight: 700 }}>
          Domains
        </div>

        <div style={{ flex: 1, overflow: 'auto' }}>
          {cert?.domains.map((domain) => {
            const score = getDomainScore(domain.slug)
            return (
              <NavLink key={domain.slug}
                to={`${base}/domain/${domain.slug}`}
                onClick={onClose}
                style={({ isActive }) => ({
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '0.45rem 0.75rem', fontSize: '0.8rem',
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  background: isActive ? 'var(--bg-tertiary)' : 'transparent',
                  textDecoration: 'none', borderRadius: '6px', margin: '0 0.25rem',
                  transition: 'all 0.15s', borderLeft: isActive ? `2px solid ${domain.color}` : '2px solid transparent',
                })}>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                  {domain.shortTitle ?? domain.title}
                </span>
                <ScoreBadge score={score} />
              </NavLink>
            )
          })}
        </div>
      </aside>
    </>
  )
}
