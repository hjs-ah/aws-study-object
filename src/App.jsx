// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Sidebar } from './components/Sidebar.jsx'
import { Home } from './pages/Home.jsx'
import { Domain } from './pages/Domain.jsx'
import { useProgress } from './hooks/useProgress.js'
import { useTheme } from './hooks/useTheme.js'
import './styles/tokens.css'

export default function App() {
  const { getDomainProgress, recordAnswer, getOverallStats } = useProgress()
  const { theme, toggleTheme } = useTheme()

  return (
    <BrowserRouter>
      <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
        <Sidebar getProgress={getDomainProgress} theme={theme} toggleTheme={toggleTheme} />

        <main style={{ flex: 1, overflowY: 'auto', background: 'var(--color-bg)' }}>
          <Routes>
            <Route
              path="/"
              element={
                <Home
                  getProgress={getDomainProgress}
                  getOverallStats={getOverallStats}
                />
              }
            />
            <Route
              path="/domain/:slug"
              element={
                <Domain
                  getDomainProgress={getDomainProgress}
                  recordAnswer={recordAnswer}
                />
              }
            />
            <Route path="*" element={<Home getProgress={getDomainProgress} getOverallStats={getOverallStats} />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
