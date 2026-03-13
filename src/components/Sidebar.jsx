// src/components/Sidebar.jsx — Fixed-width sidebar with theme toggle at bottom

import { NavLink, useNavigate, useParams } from 'react-router-dom'
import { getCert } from '../data/certifications.js'
import { useScore } from '../hooks/useScore.js'
import ScoreBadge from './ScoreBadge.jsx'

export default function Sidebar({ isOpen, onClose, theme, toggleTheme }) {
  const { certSlug } = useParams()
  const navigate = useNavigate()
  const cert = getCert(certSlug)
  const { getDomainScore } = useScore(certSlug)

  const base = `/app/${certSlug}`

  function handleNav(action) {
    action()
    onClose()
  }

  return (
    <aside style={{
      width: '232px',
      height: '100%',
      flexShrink: 0,
      borderRight: '1px solid var(--color-border)',
      background: 'var(--color-surface)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>

      {/* Cert switcher */}
      <div
        onClick={() => handleNav(() => navigate('/'))}
        style={{
          padding: '0.9rem',
          borderBottom: '1px solid var(--color-border)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          transition: 'background 0.15s',
          flexShrink: 0,
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'var(--color-surface-hover)'}
        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
      >
        <span style={{ fontSize: '1.4rem', flexShrink: 0 }}>{cert?.icon ?? '☁️'}</span>
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <div style={{
            fontSize: '0.6rem', color: 'var(--color-text-muted)',
            textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 800,
          }}>
            {cert?.examCode}
          </div>
          <div style={{
            fontSize: '0.82rem', fontWeight: 700,
            color: 'var(--color-text-primary)',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            lineHeight: 1.25, marginTop: '1px',
          }}>
            {cert?.title}
          </div>
        </div>
        <span style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', flexShrink: 0 }}>↕</span>
      </div>

      {/* Getting Started */}
      <div style={{ padding: '0.65rem 0.9rem 0.15rem', flexShrink: 0 }}>
        <div style={{
          fontSize: '0.58rem', color: 'var(--color-text-muted)',
          textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 800,
        }}>
          Getting Started
        </div>
      </div>
      {[
        { to: `${base}/how-to-use`, label: '📖 How to Use' },
        { to: `${base}/scores`, label: '📊 Score Dashboard' },
      ].map(({ to, label }) => (
        <NavLink key={to} to={to} onClick={onClose}
          style={({ isActive }) => ({
            display: 'block',
            padding: '0.38rem 0.9rem',
            fontSize: '0.8rem',
            color: isActive ? 'var(--color-accent)' : 'var(--color-text-secondary)',
            background: isActive ? 'var(--color-surface-raised)' : 'transparent',
            textDecoration: 'none',
            borderRadius: '6px',
            margin: '0 0.3rem',
            transition: 'all 0.15s',
            fontWeight: isActive ? 600 : 400,
          })}
        >
          {label}
        </NavLink>
      ))}

      {/* Domains */}
      <div style={{ padding: '0.65rem 0.9rem 0.15rem', marginTop: '0.35rem', flexShrink: 0 }}>
        <div style={{
          fontSize: '0.58rem', color: 'var(--color-text-muted)',
          textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 800,
        }}>
          Domains
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', paddingBottom: '0.5rem' }}>
        {cert?.domains.map((domain) => {
          const score = getDomainScore(domain.slug)
          return (
            <NavLink
              key={domain.slug}
              to={`${base}/domain/${domain.slug}`}
              onClick={onClose}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.42rem 0.9rem',
                fontSize: '0.78rem',
                color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                background: isActive ? 'var(--color-surface-raised)' : 'transparent',
                textDecoration: 'none',
                borderRadius: '6px',
                margin: '0 0.3rem',
                transition: 'all 0.15s',
                borderLeft: isActive ? `2px solid ${domain.color}` : '2px solid transparent',
                fontWeight: isActive ? 600 : 400,
              })}
            >
              {/* Color dot */}
              <span style={{
                width: '6px', height: '6px', borderRadius: '50%',
                background: domain.color, flexShrink: 0,
              }} />
              {/* Domain name */}
              <span style={{
                flex: 1,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {domain.shortTitle ?? domain.title}
              </span>
              {/* Weight % */}
              <span style={{
                fontSize: '0.6rem', color: 'var(--color-text-muted)',
                fontWeight: 700, flexShrink: 0,
              }}>
                {domain.weight}%
              </span>
              {/* Score badge */}
              <ScoreBadge score={score} />
            </NavLink>
          )
        })}
      </div>

      {/* Bottom: theme toggle */}
      <div style={{
        borderTop: '1px solid var(--color-border)',
        padding: '0.6rem 0.9rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
          {theme === 'dark' ? 'Dark mode' : 'Light mode'}
        </span>
        <button
          onClick={toggleTheme}
          style={{
            background: 'var(--color-surface-raised)',
            border: '1px solid var(--color-border)',
            borderRadius: '20px',
            padding: '3px 10px',
            cursor: 'pointer',
            fontSize: '0.78rem',
            color: 'var(--color-text-secondary)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            transition: 'all 0.15s',
            fontFamily: 'inherit',
          }}
        >
          {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
        </button>
      </div>
    </aside>
  )
}
