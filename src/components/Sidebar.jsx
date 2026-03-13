// src/components/Sidebar.jsx
import { NavLink } from 'react-router-dom'
import { DOMAINS } from '../data/domains.js'

function ThemeToggle({ theme, toggleTheme }) {
  const isDark = theme === 'dark'

  return (
    <button
      onClick={toggleTheme}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 7,
        padding: '6px 10px',
        background: 'var(--color-surface-raised)',
        border: '1px solid var(--color-border-emphasis)',
        borderRadius: 20,
        cursor: 'pointer',
        width: '100%',
        transition: 'background 200ms ease, border-color 200ms ease',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--color-accent)' }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--color-border-emphasis)' }}
    >
      {/* Track */}
      <div style={{
        width: 28, height: 16,
        background: isDark ? 'var(--color-accent-dim)' : 'var(--color-accent)',
        border: `1px solid ${isDark ? 'var(--color-accent-border)' : 'var(--color-accent)'}`,
        borderRadius: 8,
        position: 'relative',
        flexShrink: 0,
        transition: 'background 250ms ease, border-color 250ms ease',
      }}>
        {/* Knob */}
        <div style={{
          position: 'absolute',
          top: 2, left: isDark ? 2 : 12,
          width: 10, height: 10,
          borderRadius: '50%',
          background: isDark ? 'var(--color-accent)' : '#fff',
          transition: 'left 250ms ease, background 250ms ease',
        }} />
      </div>

      {/* Label */}
      <span style={{
        fontSize: 11,
        color: 'var(--color-text-secondary)',
        fontFamily: 'var(--font-mono)',
        letterSpacing: '0.02em',
      }}>
        {isDark ? 'Dark' : 'Light'}
      </span>

      {/* Icon */}
      <span style={{ marginLeft: 'auto', fontSize: 12 }}>
        {isDark ? '🌙' : '☀️'}
      </span>
    </button>
  )
}

export function Sidebar({ getProgress, theme, toggleTheme }) {
  return (
    <aside style={{
      width: 'var(--sidebar-width)',
      flexShrink: 0,
      background: 'var(--color-surface)',
      borderRight: '1px solid var(--color-border)',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      position: 'sticky',
      top: 0,
      overflow: 'hidden',
    }}>
      {/* Logo */}
      <div style={{
        padding: '20px 16px 16px',
        borderBottom: '1px solid var(--color-border)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 30, height: 30,
            background: 'var(--color-accent-dim)',
            border: '1px solid var(--color-accent-border)',
            borderRadius: 'var(--radius-sm)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13, fontWeight: 600, color: 'var(--color-accent)',
            fontFamily: 'var(--font-mono)',
          }}>A</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: '-0.01em' }}>AWS Study</div>
            <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>SAA-C03</div>
          </div>
        </div>
      </div>

      {/* Domain nav */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '8px 8px' }}>
        <div style={{
          fontSize: 10, fontWeight: 500, color: 'var(--color-text-muted)',
          letterSpacing: '0.08em', padding: '8px 8px 6px', textTransform: 'uppercase',
        }}>
          Domains
        </div>

        {DOMAINS.map((domain) => {
          const prog = getProgress(domain.slug)
          const score = prog.score
          const hasStarted = score !== null

          return (
            <NavLink
              key={domain.slug}
              to={`/domain/${domain.slug}`}
              style={({ isActive }) => ({
                display: 'block',
                padding: '7px 8px',
                borderRadius: 'var(--radius-sm)',
                background: isActive ? 'var(--color-surface-hover)' : 'transparent',
                borderLeft: isActive ? `2px solid var(--color-accent)` : '2px solid transparent',
                marginBottom: 2,
                transition: 'var(--transition)',
              })}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, fontWeight: 400, color: 'var(--color-text-primary)' }}>
                  {domain.shortTitle}
                </span>
                <span style={{
                  fontSize: 10, fontFamily: 'var(--font-mono)',
                  color: 'var(--color-text-muted)',
                }}>
                  {domain.weight}%
                </span>
              </div>

              {hasStarted && (
                <div style={{ marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{
                    flex: 1, height: 2,
                    background: 'var(--color-border)',
                    borderRadius: 1, overflow: 'hidden',
                  }}>
                    <div style={{
                      width: `${score}%`, height: '100%',
                      background: score >= 80 ? 'var(--color-success)' : score >= 60 ? 'var(--color-warning)' : 'var(--color-danger)',
                      borderRadius: 1,
                      transition: 'width 400ms ease',
                    }} />
                  </div>
                  <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>
                    {score}%
                  </span>
                </div>
              )}

              {!hasStarted && (
                <div style={{ fontSize: 10, color: 'var(--color-text-muted)', marginTop: 2 }}>
                  Not started
                </div>
              )}
            </NavLink>
          )
        })}
      </nav>

      {/* Bottom nav */}
      <div style={{
        padding: '12px 16px',
        borderTop: '1px solid var(--color-border)',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}>
        <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <NavLink
            to="/"
            style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}
          >
            Dashboard
          </NavLink>
          <div style={{ fontSize: 11, color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
            V1 · Haiku
          </div>
        </div>
      </div>
    </aside>
  )
}
