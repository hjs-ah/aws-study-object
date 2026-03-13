// api/content.js — Vercel serverless function
// Fetches questions and content from Notion filtered by domain slug.
// Falls back gracefully: returns { source: 'notion', items: [] } with empty
// items if Notion is not configured or returns no rows for this domain.
// The frontend handles the empty case by falling back to seed JSON.
// ─────────────────────────────────────────────────────────────────────────────

const NOTION_API = 'https://api.notion.com/v1'
const NOTION_VERSION = '2022-06-28'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { domain, type = 'question' } = req.query

  if (!domain) {
    return res.status(400).json({ error: 'domain query param required' })
  }

  const apiKey = process.env.NOTION_API_KEY
  const databaseId = process.env.NOTION_DATABASE_ID

  // Graceful no-config fallback — frontend will use seed JSON
  if (!apiKey || !databaseId) {
    return res.status(200).json({ source: 'notion', items: [], configured: false })
  }

  try {
    const response = await fetch(`${NOTION_API}/databases/${databaseId}/query`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Notion-Version': NOTION_VERSION,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filter: {
          and: [
            { property: 'Domain', select: { equals: domain } },
            { property: 'Type', select: { equals: type } },
          ],
        },
        sorts: [{ timestamp: 'created_time', direction: 'ascending' }],
        page_size: 100,
      }),
    })

    if (!response.ok) {
      const err = await response.json()
      console.error('Notion API error:', err)
      // Return empty — frontend falls back to seed JSON
      return res.status(200).json({ source: 'notion', items: [], configured: true, error: err.message })
    }

    const data = await response.json()
    const items = data.results.map(pageToItem)

    return res.status(200).json({
      source: 'notion',
      configured: true,
      items,
      hasMore: data.has_more,
    })
  } catch (err) {
    console.error('content.js fetch error:', err)
    return res.status(200).json({ source: 'notion', items: [], configured: true, error: err.message })
  }
}

// ── Transform a Notion page row into a flat question/content object ──────────
function pageToItem(page) {
  const p = page.properties

  const getText = (prop) => {
    if (!prop) return ''
    if (prop.type === 'title') return prop.title?.map((t) => t.plain_text).join('') ?? ''
    if (prop.type === 'rich_text') return prop.rich_text?.map((t) => t.plain_text).join('') ?? ''
    return ''
  }

  const getSelect = (prop) => prop?.select?.name ?? null
  const getNumber = (prop) => prop?.number ?? null

  const optionsRaw = getText(p.Options)
  const options = optionsRaw
    ? optionsRaw.split('|').map((o) => o.trim()).filter(Boolean)
    : []

  return {
    id: page.id,
    // Question text lives in the Title column
    question: getText(p.Title),
    domain: getSelect(p.Domain),
    type: getSelect(p.Type),
    difficulty: getSelect(p.Difficulty),
    options,
    correct: getNumber(p.Answer),  // 0-indexed
    explanation: getText(p.Explanation),
    trap: getText(p.Trap),
    body: getText(p.Body),
    notionUrl: page.url,
    createdAt: page.created_time,
  }
}