// src/pages/Landing.jsx
import { useNavigate } from 'react-router-dom'

const DOMAIN_PILLS = [
  { label: 'VPC & Networking', weight: '20%' },
  { label: 'IAM & Security', weight: '16%' },
  { label: 'Compute', weight: '15%' },
  { label: 'Storage', weight: '14%' },
  { label: 'Databases', weight: '13%' },
  { label: 'HA & Resilience', weight: '12%' },
  { label: 'Messaging', weight: '6%' },
  { label: 'Cost & Ops', weight: '4%' },
]

export function Landing({ theme, toggleTheme }) {
  const navigate = useNavigate()
  const isDark = theme === 'dark'

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--color-bg)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 24px',
      position: 'relative',
    }}>

      {/* Subtle grid background */}
      <div style={{
        position: 'fixed',
        inset: 0,
        backgroundImage: `radial-gradient(circle, ${isDark ? 'rgba(255,255,255,0.025)' : 'rgba(0,0,0,0.04)'} 1px, transparent 1px)`,
        backgroundSize: '28px 28px',
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      {/* Glow */}
      <div style={{
        position: 'fixed',
        top: '20%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 500,
        height: 300,
        background: isDark
          ? 'radial-gradient(ellipse, rgba(255,153,0,0.06) 0%, transparent 70%)'
          : 'radial-gradient(ellipse, rgba(217,119,6,0.07) 0%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      {/* Theme toggle — top right */}
      <button
        onClick={toggleTheme}
        title={isDark ? 'Switch to light' : 'Switch to dark'}
        style={{
          position: 'fixed',
          top: 20,
          right: 20,
          zIndex: 10,
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border-emphasis)',
          borderRadius: 20,
          padding: '6px 12px',
          cursor: 'pointer',
          fontSize: 12,
          color: 'var(--color-text-secondary)',
          fontFamily: 'var(--font-mono)',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          transition: 'border-color 200ms ease',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--color-accent)' }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--color-border-emphasis)' }}
      >
        {isDark ? '☀️' : '🌙'} {isDark ? 'Light' : 'Dark'}
      </button>

      {/* Card */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        width: '100%',
        maxWidth: 560,
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
      }}>

        {/* Badge */}
        <div style={{ marginBottom: 28, display: 'flex', justifyContent: 'center' }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 11,
            fontFamily: 'var(--font-mono)',
            letterSpacing: '0.06em',
            padding: '5px 12px',
            background: 'var(--color-accent-dim)',
            border: '1px solid var(--color-accent-border)',
            borderRadius: 20,
            color: 'var(--color-accent)',
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: '50%',
              background: 'var(--color-accent)',
              display: 'inline-block',
              animation: 'pulse 2s ease-in-out infinite',
            }} />
            SAA-C03 · V1 · Claude Haiku
          </span>
        </div>

        {/* Headline */}
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <h1 style={{
            fontSize: 38,
            fontWeight: 600,
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
            color: 'var(--color-text-primary)',
            marginBottom: 14,
          }}>
            AWS Solutions<br />
            <span style={{ color: 'var(--color-accent)' }}>Architect</span> Study
          </h1>
          <p style={{
            fontSize: 15,
            color: 'var(--color-text-secondary)',
            lineHeight: 1.65,
            maxWidth: 400,
            margin: '0 auto',
          }}>
            Interactive diagrams, scenario questions, and an AI tutor — all scoped to the SAA-C03 exam.
          </p>
        </div>

        {/* Divider */}
        <div style={{
          height: 1,
          background: 'var(--color-border)',
          margin: '28px 0',
        }} />

        {/* Domain pills grid */}
        <div style={{ marginBottom: 32 }}>
          <div style={{
            fontSize: 10,
            fontFamily: 'var(--font-mono)',
            letterSpacing: '0.08em',
            color: 'var(--color-text-muted)',
            textTransform: 'uppercase',
            marginBottom: 12,
            textAlign: 'center',
          }}>
            8 exam domains
          </div>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 6,
            justifyContent: 'center',
          }}>
            {DOMAIN_PILLS.map(({ label, weight }) => (
              <div key={label} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '5px 11px',
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 20,
                fontSize: 12,
                color: 'var(--color-text-secondary)',
              }}>
                {label}
                <span style={{
                  fontSize: 10,
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--color-text-muted)',
                }}>
                  {weight}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Feature row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 8,
          marginBottom: 32,
        }}>
          {[
            { icon: '⬡', label: 'Interactive diagrams', sub: 'Click to inspect' },
            { icon: '◈', label: 'Scenario questions', sub: 'With trap callouts' },
            { icon: '◎', label: 'AI tutor', sub: 'Ask anything' },
          ].map(({ icon, label, sub }) => (
            <div key={label} style={{
              padding: '14px 12px',
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 10,
              textAlign: 'center',
            }}>
              <div style={{
                fontSize: 18,
                marginBottom: 6,
                color: 'var(--color-accent)',
                fontFamily: 'var(--font-mono)',
              }}>{icon}</div>
              <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: 2 }}>
                {label}
              </div>
              <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>
                {sub}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={() => navigate('/app')}
          style={{
            width: '100%',
            padding: '15px',
            background: 'var(--color-accent)',
            border: 'none',
            borderRadius: 10,
            fontSize: 15,
            fontWeight: 600,
            color: '#000',
            cursor: 'pointer',
            letterSpacing: '-0.01em',
            transition: 'opacity 150ms ease, transform 150ms ease',
            fontFamily: 'var(--font-display)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '0.88'
            e.currentTarget.style.transform = 'translateY(-1px)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '1'
            e.currentTarget.style.transform = 'translateY(0)'
          }}
        >
          Start Studying →
        </button>

        {/* Sub-CTA */}
        <p style={{
          textAlign: 'center',
          marginTop: 14,
          fontSize: 12,
          color: 'var(--color-text-muted)',
          fontFamily: 'var(--font-mono)',
        }}>
          Progress saved locally · No account needed
        </p>

      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>

    </div>
  )
}
