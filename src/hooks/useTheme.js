// src/hooks/useTheme.js
// Manages dark/light theme.
// Priority: 1) localStorage saved preference  2) OS prefers-color-scheme  3) dark
// Applies data-theme attribute to <html> — CSS variable swap does the rest.

import { useState, useEffect } from 'react'

const STORAGE_KEY = 'aws-study-theme'

function getInitialTheme() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'light' || saved === 'dark') return saved
  } catch { /* localStorage blocked */ }

  if (window.matchMedia?.('(prefers-color-scheme: light)').matches) return 'light'
  return 'dark'
}

export function useTheme() {
  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    try { localStorage.setItem(STORAGE_KEY, theme) } catch { /* ignore */ }
  }, [theme])

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))

  return { theme, toggleTheme }
}
