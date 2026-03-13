// src/App.jsx — Routing with cert-scoped paths

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

function AppShell() {
  const { certSlug } = useParams()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { theme, toggle } = useTheme()

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--bg-primary)' }}>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Top bar */}
        <div style={{ height: '44px', borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 1rem', background: 'var(--bg-secondary)', flexShrink: 0 }}>
          <button onClick={() => setSidebarOpen(o => !o)}
            style={{ background: 'none', border: 'none', cursor: 'pointer',
              fontSize: '1rem', color: 'var(--text-muted)', padding: '4px' }}>
            ☰
          </button>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.04em' }}>
            AWS Study
          </span>
          <button onClick={toggle}
            style={{ background: 'none', border: 'none', cursor: 'pointer',
              fontSize: '0.9rem', color: 'var(--text-muted)', padding: '4px' }}>
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>

        {/* Main content */}
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
        {/* Legacy redirect — old /app/* links go to SAA */}
        <Route path="/app/*" element={<Navigate to="/app/saa-c03" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
