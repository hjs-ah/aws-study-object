// src/hooks/useProgress.js
// Reads and writes study progress to localStorage.
// Keyed by domain slug so each domain tracks independently.
// Phase 4: swap localStorage calls to Supabase for cross-device sync.

import { useState, useCallback } from 'react'

const STORAGE_KEY = 'aws-study-progress'

const defaultDomainState = () => ({
  answeredQuestions: {},  // { questionId: { correct: bool, attempts: number, lastSeen: timestamp } }
  score: null,            // percentage 0-100, null = not attempted
  lastVisited: null,
  totalAttempts: 0,
})

const loadAll = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

const saveAll = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    console.warn('localStorage unavailable — progress will not persist')
  }
}

export function useProgress() {
  const [progress, setProgress] = useState(() => loadAll())

  const getDomainProgress = useCallback((slug) => {
    return progress[slug] ?? defaultDomainState()
  }, [progress])

  const recordAnswer = useCallback((slug, questionId, correct) => {
    setProgress((prev) => {
      const all = { ...prev }
      const domain = { ...(all[slug] ?? defaultDomainState()) }
      const existing = domain.answeredQuestions[questionId] ?? { correct: false, attempts: 0 }

      domain.answeredQuestions = {
        ...domain.answeredQuestions,
        [questionId]: {
          correct: existing.correct || correct, // once correct, stays correct
          attempts: existing.attempts + 1,
          lastSeen: Date.now(),
        },
      }

      domain.totalAttempts += 1
      domain.lastVisited = Date.now()

      // Recalculate score from answered questions
      const answered = Object.values(domain.answeredQuestions)
      if (answered.length > 0) {
        const correctCount = answered.filter((q) => q.correct).length
        domain.score = Math.round((correctCount / answered.length) * 100)
      }

      all[slug] = domain
      saveAll(all)
      return all
    })
  }, [])

  const getOverallStats = useCallback(() => {
    const domains = Object.values(progress)
    if (domains.length === 0) return { attempted: 0, avgScore: null, totalAttempts: 0 }

    const attempted = domains.filter((d) => d.score !== null).length
    const scores = domains.filter((d) => d.score !== null).map((d) => d.score)
    const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null

    return {
      attempted,
      avgScore,
      totalAttempts: domains.reduce((sum, d) => sum + d.totalAttempts, 0),
    }
  }, [progress])

  const resetDomain = useCallback((slug) => {
    setProgress((prev) => {
      const all = { ...prev }
      delete all[slug]
      saveAll(all)
      return all
    })
  }, [])

  return { getDomainProgress, recordAnswer, getOverallStats, resetDomain }
}
