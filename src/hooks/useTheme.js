// src/hooks/useTheme.js
// Priority: 1) localStorage saved preference  2) light (default)
import { useState, useEffect } from 'react'

function getInitialTheme() {
  try {
    const saved = localStorage.getItem('aws-study-theme')
    if (saved === 'dark' || saved === 'light') return saved
  } catch {}
  return 'light' // Always default to light
}

export function useTheme() {
  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    try { localStorage.setItem('aws-study-theme', theme) } catch {}
  }, [theme])

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))
  return { theme, toggleTheme }
}
