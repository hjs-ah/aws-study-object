// api/content.js — Notion content fetch
// Queries the unified Notion DB filtered by certification + domain + type.
// Falls back gracefully if Notion env vars are not set.

export default async function handler(req, res) {
  const { domainSlug, type, certSlug } = req.query

  if (!domainSlug || !type) {
    return res.status(400).json({ error: 'domainSlug and type are required' })
  }

  if (!process.env.NOTION_API_KEY || !process.env.NOTION_DATABASE_ID) {
    return res.status(200).json({ items: [], source: 'no-notion-config' })
  }

  try {
    // Build filter: domain + type, optionally scoped to certification
    const andFilters = [
      { property: 'Domain', select: { equals: domainSlug } },
      { property: 'Type',   select: { equals: type } },
    ]
    if (certSlug) {
      andFilters.push({ property: 'Certification', select: { equals: certSlug } })
    }

    const response = await fetch(
      `https://api.notion.com/v1/databases/${process.env.NOTION_DATABASE_ID}/query`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.NOTION_API_KEY}`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filter: { and: andFilters },
          sorts: [{ property: 'Difficulty', direction: 'ascending' }],
        }),
      }
    )

    if (!response.ok) {
      console.error('Notion error:', response.status, await response.text())
      return res.status(200).json({ items: [], source: 'notion-error' })
    }

    const data = await response.json()
    const items = data.results.map((page) => ({
      id: page.id,
      title: page.properties.Title?.title?.[0]?.plain_text ?? '',
      body: page.properties.Body?.rich_text?.[0]?.plain_text ?? '',
      answer: page.properties.Answer?.number ?? null,
      options: page.properties.Options?.rich_text?.[0]?.plain_text ?? '',
      explanation: page.properties.Explanation?.rich_text?.[0]?.plain_text ?? '',
      trap: page.properties.Trap?.rich_text?.[0]?.plain_text ?? '',
      difficulty: page.properties.Difficulty?.select?.name ?? 'medium',
      domain: page.properties.Domain?.select?.name ?? domainSlug,
      certification: page.properties.Certification?.select?.name ?? certSlug,
      type: page.properties.Type?.select?.name ?? type,
    }))

    return res.status(200).json({ items, source: 'notion' })
  } catch (err) {
    console.error('Notion fetch error:', err)
    return res.status(200).json({ items: [], source: 'error' })
  }
}
