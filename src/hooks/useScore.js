// src/hooks/useScore.js
// Score Engine — tracks right/wrong answers per domain per certification.
// Persisted in localStorage so progress survives page refreshes.

import { useState, useCallback } from 'react'

const STORAGE_KEY = 'aws-study-scores-v1'
const EXAM_READY_THRESHOLD = 80
const WEAK_DOMAIN_THRESHOLD = 60

function loadScores() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveScores(scores) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(scores))
  } catch {}
}

export function useScore(certSlug) {
  const [scores, setScores] = useState(loadScores)
  const certScores = scores[certSlug] ?? {}

  const recordAnswer = useCallback((domainSlug, isCorrect) => {
    setScores((prev) => {
      const updated = {
        ...prev,
        [certSlug]: {
          ...prev[certSlug],
          [domainSlug]: {
            correct: ((prev[certSlug]?.[domainSlug]?.correct) ?? 0) + (isCorrect ? 1 : 0),
            total:   ((prev[certSlug]?.[domainSlug]?.total)   ?? 0) + 1,
          },
        },
      }
      saveScores(updated)
      return updated
    })
  }, [certSlug])

  const getDomainScore = useCallback((domainSlug) => {
    const d = certScores[domainSlug]
    if (!d || d.total === 0) return null
    return Math.round((d.correct / d.total) * 100)
  }, [certScores])

  const getDomainCounts = useCallback((domainSlug) => {
    return certScores[domainSlug] ?? { correct: 0, total: 0 }
  }, [certScores])

  const getWeakDomains = useCallback((domains) => {
    return domains.filter((d) => {
      const counts = certScores[d.slug]
      if (!counts || counts.total < 3) return false
      return (counts.correct / counts.total) * 100 < WEAK_DOMAIN_THRESHOLD
    })
  }, [certScores])

  const getOverallScore = useCallback((domains) => {
    const attempted = domains.filter((d) => certScores[d.slug]?.total > 0)
    if (attempted.length === 0) return null
    const totalCorrect = attempted.reduce((sum, d) => sum + (certScores[d.slug]?.correct ?? 0), 0)
    const totalAttempts = attempted.reduce((sum, d) => sum + (certScores[d.slug]?.total ?? 0), 0)
    return Math.round((totalCorrect / totalAttempts) * 100)
  }, [certScores])

  const isExamReady = useCallback((domains) => {
    return domains.every((d) => {
      const counts = certScores[d.slug]
      if (!counts || counts.total < 5) return false
      return (counts.correct / counts.total) * 100 >= EXAM_READY_THRESHOLD
    })
  }, [certScores])

  // Reset all scores for this cert
  const resetCert = useCallback(() => {
    setScores((prev) => {
      const updated = { ...prev }
      delete updated[certSlug]
      saveScores(updated)
      return updated
    })
  }, [certSlug])

  // Reset scores for a single domain within this cert
  const resetDomain = useCallback((domainSlug) => {
    setScores((prev) => {
      const updated = {
        ...prev,
        [certSlug]: { ...prev[certSlug] },
      }
      if (updated[certSlug]) {
        delete updated[certSlug][domainSlug]
      }
      saveScores(updated)
      return updated
    })
  }, [certSlug])

  return {
    recordAnswer,
    getDomainScore,
    getDomainCounts,
    getWeakDomains,
    getOverallScore,
    isExamReady,
    resetCert,
    resetDomain,
    EXAM_READY_THRESHOLD,
    WEAK_DOMAIN_THRESHOLD,
  }
}
