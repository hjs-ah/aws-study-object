// src/App.jsx — Routing with cert-scoped paths + responsive layout

import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom'
import { useState } from 'react'
import Landing from './pages/Landing.jsx'
import Home from './pages/Home.jsx'
import Domain from './pages/Domain.jsx'
import HowToUse from './pages/HowToUse.jsx'
import ReleaseNotes from './pages/ReleaseNotes.jsx'
import ScoreDashboard from './components/ScoreDashboard.jsx'
import Sidebar from './components/Sidebar.jsx'
import { useTheme } from './hooks/useTheme.js'
import { useIsMobile } from './hooks/useMediaQuery.js'

function AppShell() {
  const { certSlug } = useParams()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const isMobile = useIsMobile()

  const closeSidebar = () => setDrawerOpen(false)

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--color-bg)' }}>

      {/* Mobile: dark overlay behind drawer */}
      {isMobile && drawerOpen && (
        <div
          onClick={closeSidebar}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.52)',
            zIndex: 45,
          }}
        />
      )}

      {/* Sidebar — fixed drawer on mobile, static on desktop */}
      <div style={{
        position: isMobile ? 'fixed' : 'relative',
        top: 0,
        left: isMobile ? (drawerOpen ? 0 : '-240px') : 0,
        height: '100%',
        zIndex: isMobile ? 50 : 1,
        transition: isMobile ? 'left 0.25s cubic-bezier(0.4,0,0.2,1)' : 'none',
        flexShrink: 0,
      }}>
        <Sidebar
          isOpen={drawerOpen}
          onClose={closeSidebar}
          theme={theme}
          toggleTheme={toggleTheme}
        />
      </div>

      {/* Main column */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        {/* Top bar */}
        <div style={{
          height: '48px',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 1rem',
          background: 'var(--color-surface)',
          flexShrink: 0,
        }}>
          <button
            onClick={() => setDrawerOpen(o => !o)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: '1.1rem', color: 'var(--color-text-muted)',
              padding: '4px 6px', borderRadius: '6px', lineHeight: 1,
              display: 'flex', alignItems: 'center',
            }}
            aria-label="Toggle menu"
          >
            {drawerOpen ? '✕' : '☰'}
          </button>

          <span style={{
            fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.08em',
            textTransform: 'uppercase', color: 'var(--color-text-muted)',
          }}>
            AWS Study
          </span>

          {/* Spacer to visually center title */}
          <div style={{ width: '34px' }} />
        </div>

        {/* Page content */}
        <div style={{ flex: 1, overflow: 'auto' }}>
          <Routes>
            <Route index element={<Home />} />
            <Route path="domain/:domainSlug" element={<Domain />} />
            <Route path="scores" element={<ScoreDashboard certSlug={certSlug} />} />
            <Route path="how-to-use" element={<HowToUse />} />
            <Route path="release-notes" element={<ReleaseNotes />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/app/:certSlug/*" element={<AppShell />} />
        <Route path="/app/*" element={<Navigate to="/app/saa-c03" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
