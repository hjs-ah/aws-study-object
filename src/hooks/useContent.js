// src/hooks/useContent.js
// Fetches content from Notion via /api/content, scoped by cert + domain + type.

import { useState, useEffect } from 'react'

export function useContent(domainSlug, type, certSlug) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [source, setSource] = useState(null)

  useEffect(() => {
    if (!domainSlug || !type) return
    setLoading(true)
    setError(null)

    const params = new URLSearchParams({ domainSlug, type })
    if (certSlug) params.set('certSlug', certSlug)

    fetch(`/api/content?${params}`)
      .then(r => r.json())
      .then(data => {
        setItems(data.items ?? [])
        setSource(data.source)
      })
      .catch(err => {
        setError(err.message)
        setItems([])
      })
      .finally(() => setLoading(false))
  }, [domainSlug, type, certSlug])

  return { items, loading, error, source }
}
