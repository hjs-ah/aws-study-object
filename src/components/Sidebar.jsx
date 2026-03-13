// src/components/Sidebar.jsx
import { NavLink } from 'react-router-dom'
import { DOMAINS } from '../data/domains.js'

export function Sidebar({ getProgress }) {
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
      }}>
        <NavLink
          to="/"
          style={{ fontSize: 12, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 6 }}
        >
          Dashboard
        </NavLink>
        <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>
          V1 · Claude Haiku
        </div>
      </div>
    </aside>
  )
}
