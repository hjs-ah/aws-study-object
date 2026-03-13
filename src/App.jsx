// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Sidebar } from './components/Sidebar.jsx'
import { Landing } from './pages/Landing.jsx'
import { Home } from './pages/Home.jsx'
import { Domain } from './pages/Domain.jsx'
import { HowToUse } from './pages/HowToUse.jsx'
import { ReleaseNotes } from './pages/ReleaseNotes.jsx'
import { useProgress } from './hooks/useProgress.js'
import { useTheme } from './hooks/useTheme.js'
import './styles/tokens.css'

function AppShell({ getDomainProgress, recordAnswer, getOverallStats, theme, toggleTheme }) {
  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar getProgress={getDomainProgress} theme={theme} toggleTheme={toggleTheme} />
      <main style={{ flex: 1, overflowY: 'auto', background: 'var(--color-bg)', minWidth: 0 }}>
        <Routes>
          <Route path="/" element={<Home getProgress={getDomainProgress} getOverallStats={getOverallStats} />} />
          <Route path="/how-to-use" element={<HowToUse />} />
          <Route path="/release-notes" element={<ReleaseNotes />} />
          <Route path="/domain/:slug" element={<Domain getDomainProgress={getDomainProgress} recordAnswer={recordAnswer} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default function App() {
  const { getDomainProgress, recordAnswer, getOverallStats } = useProgress()
  const { theme, toggleTheme } = useTheme()
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing theme={theme} toggleTheme={toggleTheme} />} />
        <Route path="/app/*" element={
          <AppShell
            getDomainProgress={getDomainProgress}
            recordAnswer={recordAnswer}
            getOverallStats={getOverallStats}
            theme={theme}
            toggleTheme={toggleTheme}
          />
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}