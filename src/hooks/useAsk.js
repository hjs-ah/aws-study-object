// src/hooks/useAsk.js
// Manages AI ask bar state: query, response, loading, session count.
// Calls the /api/ask serverless function — never hits Anthropic directly from browser.
// Phase 5 (Nova): only api/ask.js changes — this hook stays identical.

import { useState, useRef } from 'react'

export function useAsk(domainSlug) {
  const [answer, setAnswer] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const sessionCount = useRef(0)

  const ask = async (question) => {
    if (!question.trim()) return
    setLoading(true)
    setError(null)
    setAnswer(null)
    sessionCount.current += 1

    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          domainSlug,
          sessionCount: sessionCount.current,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? 'Something went wrong. Please try again.')
        return
      }

      setAnswer(data.answer)
    } catch {
      setError('Network error. Check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  const clear = () => {
    setAnswer(null)
    setError(null)
  }

  return { ask, answer, loading, error, clear, sessionCount: sessionCount.current }
}
