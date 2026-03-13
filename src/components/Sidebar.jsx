// src/components/Sidebar.jsx
import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { DOMAINS } from '../data/domains.js'

function ThemeToggle({ theme, toggleTheme }) {
  const isDark = theme === 'dark'
  return (
    <button
      onClick={toggleTheme}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      style={{
        display: 'flex', alignItems: 'center', gap: 7,
        padding: '6px 10px',
        background: 'var(--color-surface-raised)',
        border: '1px solid var(--color-border-emphasis)',
        borderRadius: 20, cursor: 'pointer', width: '100%',
        transition: 'border-color 200ms ease',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--color-accent)' }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--color-border-emphasis)' }}
    >
      <div style={{
        width: 28, height: 16,
        background: isDark ? 'var(--color-accent-dim)' : 'var(--color-accent)',
        border: `1px solid ${isDark ? 'var(--color-accent-border)' : 'var(--color-accent)'}`,
        borderRadius: 8, position: 'relative', flexShrink: 0,
        transition: 'background 250ms ease',
      }}>
        <div style={{
          position: 'absolute', top: 2, left: isDark ? 2 : 12,
          width: 10, height: 10, borderRadius: '50%',
          background: isDark ? 'var(--color-accent)' : '#fff',
          transition: 'left 250ms ease',
        }} />
      </div>
      <span style={{ fontSize: 11, color: 'var(--color-text-secondary)', fontFamily: 'var(--font-mono)' }}>
        {isDark ? 'Dark' : 'Light'}
      </span>
      <span style={{ marginLeft: 'auto', fontSize: 12 }}>{isDark ? '🌙' : '☀️'}</span>
    </button>
  )
}

// Utility nav link used above the domain list
function QuickLink({ to, icon, label, onClick, badge }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      style={({ isActive }) => ({
        display: 'flex', alignItems: 'center', gap: 7,
        padding: '6px 8px',
        borderRadius: 'var(--radius-sm)',
        background: isActive ? 'var(--color-accent-dim)' : 'transparent',
        borderLeft: isActive ? '2px solid var(--color-accent)' : '2px solid transparent',
        textDecoration: 'none',
        transition: 'background 150ms ease',
      })}
    >
      <span style={{ fontSize: 13 }}>{icon}</span>
      <span style={{ fontSize: 12, color: 'var(--color-text-secondary)', flex: 1 }}>{label}</span>
      {badge && (
        <span style={{
          fontSize: 9, fontFamily: 'var(--font-mono)', padding: '1px 5px',
          background: 'var(--color-accent-dim)', border: '1px solid var(--color-accent-border)',
          borderRadius: 8, color: 'var(--color-accent)',
        }}>{badge}</span>
      )}
    </NavLink>
  )
}

export function Sidebar({ getProgress, theme, toggleTheme }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const close = () => setMobileOpen(false)

  const sidebarContent = (
    <>
      {/* Logo / Header */}
      <div style={{ padding: '14px 14px 10px', borderBottom: '1px solid var(--color-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 28, height: 28,
            background: 'var(--color-accent-dim)', border: '1px solid var(--color-accent-border)',
            borderRadius: 'var(--radius-sm)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, fontWeight: 700, color: 'var(--color-accent)', fontFamily: 'var(--font-mono)',
          }}>A</div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-primary)', letterSpacing: '-0.01em' }}>AWS Study</div>
            <div style={{ fontSize: 10, color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>SAA-C03</div>
          </div>
          <button onClick={close} className="sidebar-close-btn" style={{
            marginLeft: 'auto', background: 'none', border: 'none',
            color: 'var(--color-text-muted)', fontSize: 18, cursor: 'pointer', display: 'none',
          }}>×</button>
        </div>
      </div>

      {/* ── Quick nav — ABOVE domains ────────────────────────────────── */}
      <div style={{ padding: '8px 6px 0' }}>
        <div style={{
          fontSize: 9, fontWeight: 600, color: 'var(--color-text-muted)',
          letterSpacing: '0.08em', textTransform: 'uppercase',
          padding: '0 8px 5px',
        }}>Getting Started</div>

        <QuickLink to="/app/how-to-use"   icon="📖" label="How to Use"     onClick={close} />
        <QuickLink to="/app/release-notes" icon="🔖" label="Release Notes"  onClick={close} badge="new" />
        <QuickLink to="/app"              icon="⬛" label="Dashboard"       onClick={close} />
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: 'var(--color-border)', margin: '8px 10px' }} />

      {/* ── Domain list ─────────────────────────────────────────────── */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '0 6px' }}>
        <div style={{
          fontSize: 9, fontWeight: 600, color: 'var(--color-text-muted)',
          letterSpacing: '0.08em', textTransform: 'uppercase',
          padding: '0 8px 5px',
        }}>Domains — tap to study</div>

        {DOMAINS.map((domain) => {
          const prog = getProgress(domain.slug)
          const score = prog.score
          const hasStarted = score !== null

          return (
            <NavLink
              key={domain.slug}
              to={`/app/domain/${domain.slug}`}
              onClick={close}
              style={({ isActive }) => ({
                display: 'block',
                padding: '6px 8px',
                borderRadius: 'var(--radius-sm)',
                background: isActive ? 'var(--color-surface-hover)' : 'transparent',
                borderLeft: isActive ? '2px solid var(--color-accent)' : '2px solid transparent',
                marginBottom: 1,
                transition: 'background 150ms ease',
                textDecoration: 'none',
              })}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, color: 'var(--color-text-primary)' }}>{domain.shortTitle}</span>
                <span style={{
                  fontSize: 10, fontFamily: 'var(--font-mono)', padding: '1px 6px',
                  background: 'var(--color-accent-dim)', border: '1px solid var(--color-accent-border)',
                  borderRadius: 10, color: 'var(--color-accent)', fontWeight: 500,
                }}>{domain.weight}%</span>
              </div>

              {hasStarted ? (
                <div style={{ marginTop: 3, display: 'flex', alignItems: 'center', gap: 5 }}>
                  <div style={{ flex: 1, height: 2, background: 'var(--color-border)', borderRadius: 1, overflow: 'hidden' }}>
                    <div style={{
                      width: `${score}%`, height: '100%',
                      background: score >= 80 ? 'var(--color-success)' : score >= 60 ? 'var(--color-warning)' : 'var(--color-danger)',
                      borderRadius: 1, transition: 'width 400ms ease',
                    }} />
                  </div>
                  <span style={{ fontSize: 9, fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>{score}%</span>
                </div>
              ) : (
                <div style={{ fontSize: 9, color: 'var(--color-text-muted)', marginTop: 1 }}>tap to start →</div>
              )}
            </NavLink>
          )
        })}
      </nav>

      {/* Bottom: theme toggle */}
      <div style={{ padding: '8px 10px', borderTop: '1px solid var(--color-border)' }}>
        <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        <div style={{ marginTop: 6, fontSize: 9, color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)', textAlign: 'center' }}>
          V1.3 · Claude Haiku
        </div>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile hamburger */}
      <button onClick={() => setMobileOpen(true)} className="sidebar-hamburger" style={{
        display: 'none', position: 'fixed', top: 12, left: 12, zIndex: 200,
        background: 'var(--color-surface)', border: '1px solid var(--color-border-emphasis)',
        borderRadius: 8, padding: '7px 10px', cursor: 'pointer',
        color: 'var(--color-text-primary)', fontSize: 16,
      }}>☰</button>

      {/* Mobile backdrop */}
      {mobileOpen && (
        <div onClick={close} style={{
          position: 'fixed', inset: 0, zIndex: 150,
          background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(2px)',
        }} />
      )}

      <aside className={`sidebar-root ${mobileOpen ? 'sidebar-open' : ''}`} style={{
        width: 'var(--sidebar-width)', flexShrink: 0,
        background: 'var(--color-surface)', borderRight: '1px solid var(--color-border)',
        display: 'flex', flexDirection: 'column', height: '100vh',
        position: 'sticky', top: 0, overflow: 'hidden', zIndex: 160,
      }}>
        {sidebarContent}
      </aside>

      <style>{`
        @media (max-width: 640px) {
          .sidebar-hamburger { display: flex !important; align-items: center; }
          .sidebar-close-btn { display: flex !important; }
          .sidebar-root { position: fixed !important; top: 0; left: 0; height: 100vh; transform: translateX(-100%); transition: transform 280ms ease; box-shadow: 4px 0 24px rgba(0,0,0,0.3); }
          .sidebar-root.sidebar-open { transform: translateX(0) !important; }
        }
      `}</style>
    </>
  )
}
