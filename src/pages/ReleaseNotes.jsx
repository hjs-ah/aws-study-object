// src/pages/ReleaseNotes.jsx
// Fetches release notes from Notion via /api/releases
// Falls back to static data if Notion is not configured.

import { useState, useEffect } from 'react'

const STATIC_NOTES = [
  {
    id: 'v1.3-arch-trap',
    title: 'Architecture Trap Tab — Interactive Flaw Detection',
    version: 'v1.3',
    date: '2026-03-13',
    category: 'Feature',
    description: "New 'Architecture Trap' tab on every domain. Shows plausible but flawed AWS architectures — identify what's wrong, click the broken component, then reveal the explanation and the correct fix.",
  },
  {
    id: 'v1.3-glossary',
    title: 'Glossary Key Terms — Clickable Definitions',
    version: 'v1.3',
    date: '2026-03-13',
    category: 'Feature',
    description: '50+ keyword chips at the bottom of every Concept Map. Tap any term to see its definition in a tooltip. Orange × button to dismiss. Covers all 8 exam domains.',
  },
  {
    id: 'v1.3-how-to-use',
    title: 'How to Use Page + Sidebar Navigation',
    version: 'v1.3',
    date: '2026-03-13',
    category: 'Feature',
    description: 'Added a full visual onboarding page with 6 illustrated steps. Linked from the sidebar above the domain list so it\'s the first thing new users see.',
  },
  {
    id: 'v1.3-arch-builder',
    title: 'Architecture Builder — Drag & Drop MVP',
    version: 'v1.3',
    date: '2026-03-13',
    category: 'Feature',
    description: 'New drag-and-drop architecture builder in the Architecture Trap tab. Drag AWS components onto a canvas to build architectures. Turns green when correct, red when wrong.',
  },
  {
    id: 'v1.3-notion-badge',
    title: 'Notion CMS Status Badge on Generic Diagrams',
    version: 'v1.3',
    date: '2026-03-13',
    category: 'Feature',
    description: 'Domains without custom SVG diagrams now show a live Notion status badge — pulsing green, yellow, or gray based on connection status.',
  },
  {
    id: 'v1.3-light-default',
    title: 'Default Mode Changed to Light Theme',
    version: 'v1.3',
    date: '2026-03-13',
    category: 'Fix',
    description: 'App now defaults to light mode. OS dark mode preference is still respected. Saved preference always takes priority.',
  },
  {
    id: 'v1.2-askbar',
    title: 'AskBar Height Reduced + Colored Close Button',
    version: 'v1.2',
    date: '2026-03-12',
    category: 'Fix',
    description: 'AI answer panel reduced ~60% in height with scroll for long answers. Close button is now a colored accent circle. Billing hint added.',
  },
  {
    id: 'v1.2-mobile',
    title: 'Mobile Responsive — Sidebar Drawer',
    version: 'v1.2',
    date: '2026-03-12',
    category: 'Feature',
    description: 'App is now mobile-friendly. On screens under 640px, the sidebar becomes a slide-in drawer accessed via a hamburger button.',
  },
  {
    id: 'v1.0-launch',
    title: 'Initial App Launch — Phase 3',
    version: 'v1.0',
    date: '2026-03-11',
    category: 'Feature',
    description: 'Full study app: 8 AWS SAA-C03 domains, interactive VPC and IAM SVG diagrams, Notion CMS, Claude Haiku AI tutor, dark/light theme, progress tracking.',
  },
]

const CATEGORY_COLORS = {
  Feature:     { bg: 'rgba(91,156,246,0.1)',  border: 'rgba(91,156,246,0.3)',  text: '#5b9cf6' },
  Fix:         { bg: 'rgba(62,207,142,0.1)',  border: 'rgba(62,207,142,0.3)',  text: '#3ecf8e' },
  Content:     { bg: 'rgba(255,153,0,0.1)',   border: 'rgba(255,153,0,0.3)',   text: '#ff9900' },
  Performance: { bg: 'rgba(167,139,250,0.1)', border: 'rgba(167,139,250,0.3)', text: '#a78bfa' },
  Breaking:    { bg: 'rgba(240,96,96,0.1)',   border: 'rgba(240,96,96,0.3)',   text: '#f06060' },
}

function CategoryPill({ category }) {
  const c = CATEGORY_COLORS[category] ?? CATEGORY_COLORS.Feature
  return (
    <span style={{
      fontSize: 9, fontFamily: 'var(--font-mono)', fontWeight: 600,
      padding: '2px 8px', borderRadius: 10,
      background: c.bg, border: `1px solid ${c.border}`, color: c.text,
      letterSpacing: '0.04em',
    }}>{category}</span>
  )
}

function formatDate(iso) {
  if (!iso) return ''
  try {
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  } catch { return iso }
}

// Group notes by version
function groupByVersion(notes) {
  const groups = {}
  notes.forEach((n) => {
    const v = n.version || 'v?'
    if (!groups[v]) groups[v] = { version: v, date: n.date, items: [] }
    groups[v].items.push(n)
  })
  return Object.values(groups)
}

export function ReleaseNotes() {
  const [notes, setNotes] = useState(STATIC_NOTES)
  const [source, setSource] = useState('static')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/releases')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.items?.length) {
          setNotes(data.items)
          setSource('notion')
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const groups = groupByVersion(notes)

  return (
    <div style={{ padding: '20px 20px 40px', maxWidth: 760, margin: '0 auto' }}>

      {/* Header */}
      <div style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)', padding: '18px 20px', marginBottom: 24,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <span style={{ fontSize: 18 }}>🔖</span>
          <h1 style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-text-primary)', margin: 0, letterSpacing: '-0.02em' }}>
            Release Notes
          </h1>
          {source === 'notion' ? (
            <span style={{
              fontSize: 9, fontFamily: 'var(--font-mono)', padding: '2px 8px', borderRadius: 10,
              background: 'rgba(62,207,142,0.1)', border: '1px solid rgba(62,207,142,0.3)',
              color: 'var(--color-success)', marginLeft: 'auto',
              display: 'flex', alignItems: 'center', gap: 4,
            }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--color-success)', animation: 'pulse 2s infinite' }} />
              Notion live
            </span>
          ) : (
            <span style={{
              fontSize: 9, fontFamily: 'var(--font-mono)', padding: '2px 8px', borderRadius: 10,
              background: 'rgba(100,100,100,0.08)', border: '1px solid rgba(100,100,100,0.2)',
              color: 'var(--color-text-muted)', marginLeft: 'auto',
            }}>Static · Connect Notion for live feed</span>
          )}
        </div>
        <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
          What's new in the AWS SAA-C03 study app. Add entries to the <strong>AWS Study App — Release Notes</strong> database in your Notion workspace to publish updates here automatically.
        </p>
      </div>

      {/* Add to Notion hint */}
      <div style={{
        padding: '10px 14px', marginBottom: 20,
        background: 'var(--color-accent-dim)', border: '1px solid var(--color-accent-border)',
        borderRadius: 'var(--radius-md)', fontSize: 12, color: 'var(--color-text-secondary)',
        display: 'flex', gap: 10, alignItems: 'flex-start',
      }}>
        <span style={{ color: 'var(--color-accent)', fontWeight: 700, flexShrink: 0 }}>💡</span>
        <span>
          To publish a new update: open <strong style={{ color: 'var(--color-text-primary)' }}>Cloud Learning Objects → AWS Study App — Release Notes</strong> in Notion, add a row, check <strong style={{ color: 'var(--color-text-primary)' }}>Published</strong>, and it will appear here on next load.
        </span>
      </div>

      {loading && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--color-text-muted)', fontSize: 13, padding: 12 }}>
          <div style={{ width: 12, height: 12, border: '2px solid var(--color-border-emphasis)', borderTopColor: 'var(--color-accent)', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
          Checking Notion for updates…
        </div>
      )}

      {/* Version groups */}
      {groups.map((group, gi) => (
        <div key={group.version} style={{ marginBottom: 28 }}>
          {/* Version header */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12,
          }}>
            <div style={{
              fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-mono)',
              color: gi === 0 ? 'var(--color-accent)' : 'var(--color-text-secondary)',
              padding: '3px 10px',
              background: gi === 0 ? 'var(--color-accent-dim)' : 'var(--color-surface-raised)',
              border: `1px solid ${gi === 0 ? 'var(--color-accent-border)' : 'var(--color-border)'}`,
              borderRadius: 20,
            }}>
              {group.version}
              {gi === 0 && <span style={{ fontSize: 9, marginLeft: 6, opacity: 0.7 }}>latest</span>}
            </div>
            <div style={{ fontSize: 11, color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
              {formatDate(group.date)}
            </div>
            <div style={{ flex: 1, height: 1, background: 'var(--color-border)' }} />
          </div>

          {/* Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {group.items.map((item) => (
              <div key={item.id} style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                padding: '12px 14px',
                display: 'flex', gap: 12,
              }}>
                {/* Left bar */}
                <div style={{
                  width: 3, flexShrink: 0, borderRadius: 2,
                  background: CATEGORY_COLORS[item.category]?.text ?? '#888',
                }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5, flexWrap: 'wrap' }}>
                    <CategoryPill category={item.category} />
                    <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-primary)' }}>
                      {item.title}
                    </span>
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100% { opacity:1 } 50% { opacity:0.4 } }
      `}</style>
    </div>
  )
}

export default ReleaseNotes
