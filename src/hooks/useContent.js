// src/hooks/useContent.js
// Fetches domain content from Notion via /api/content.
// Falls back to the local seed JSON if Notion returns no items.
//
// Return shape: { questions, loading, error, source }
// source: 'notion' | 'seed' — shown in the domain header sync indicator

import { useState, useEffect } from 'react'

// Static seed loaders — same files Domain.jsx used to import directly
const SEED_LOADERS = {
  vpc:       () => import('../data/questions/vpc.json'),
  iam:       () => import('../data/questions/iam.json'),
  compute:   () => import('../data/questions/compute.json'),
  storage:   () => import('../data/questions/storage.json'),
  databases: () => import('../data/questions/databases.json'),
  ha:        () => import('../data/questions/ha.json'),
  messaging: () => import('../data/questions/messaging.json'),
  cost:      () => import('../data/questions/cost.json'),
}

async function loadSeed(slug) {
  const loader = SEED_LOADERS[slug]
  if (!loader) return []
  const mod = await loader()
  return mod.default
}

export function useContent(domainSlug, type = 'question') {
  const [questions, setQuestions] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [source, setSource] = useState(null) // 'notion' | 'seed'
  const [notionConfigured, setNotionConfigured] = useState(null)

  useEffect(() => {
    if (!domainSlug) return
    let cancelled = false

    async function fetch() {
      setLoading(true)
      setError(null)
      setQuestions(null)
      setSource(null)

      try {
        // 1. Try Notion first
        const res = await window.fetch(`/api/content?domain=${domainSlug}&type=${type}`)
        const data = await res.json()

        if (cancelled) return

        setNotionConfigured(data.configured ?? false)

        if (data.items?.length > 0) {
          // Notion has content for this domain — use it
          setQuestions(data.items)
          setSource('notion')
          setLoading(false)
          return
        }

        // 2. Notion returned nothing (empty domain or not configured) — use seed
        const seed = await loadSeed(domainSlug)
        if (!cancelled) {
          setQuestions(seed)
          setSource('seed')
        }
      } catch (err) {
        if (cancelled) return
        // Network error — fall back to seed silently
        try {
          const seed = await loadSeed(domainSlug)
          setQuestions(seed)
          setSource('seed')
        } catch {
          setError('Failed to load questions.')
          setQuestions([])
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetch()
    return () => { cancelled = true }
  }, [domainSlug])

  return { questions, loading, error, source, notionConfigured }
}
