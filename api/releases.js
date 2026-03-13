// api/releases.js
// Fetches published release notes from the Notion "AWS Study App — Release Notes" database.
// Falls back gracefully if Notion is not configured.

const NOTION_API = 'https://api.notion.com/v1'
const NOTION_VERSION = '2022-06-28'

const RELEASES_DB_ID = process.env.NOTION_RELEASES_DB_ID || ''
const NOTION_API_KEY = process.env.NOTION_API_KEY || ''

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Cache-Control', 's-maxage=300') // cache 5 min

  if (!NOTION_API_KEY || !RELEASES_DB_ID) {
    return res.status(200).json({ items: [], source: 'not_configured' })
  }

  try {
    const response = await fetch(`${NOTION_API}/databases/${RELEASES_DB_ID}/query`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${NOTION_API_KEY}`,
        'Notion-Version': NOTION_VERSION,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filter: {
          property: 'Published',
          checkbox: { equals: true },
        },
        sorts: [{ property: 'Date', direction: 'descending' }],
        page_size: 50,
      }),
    })

    if (!response.ok) {
      return res.status(200).json({ items: [], source: 'error' })
    }

    const data = await response.json()

    const items = (data.results ?? []).map((page) => {
      const props = page.properties
      const get = (key) => {
        const p = props[key]
        if (!p) return ''
        if (p.type === 'title') return p.title?.map(t => t.plain_text).join('') ?? ''
        if (p.type === 'rich_text') return p.rich_text?.map(t => t.plain_text).join('') ?? ''
        if (p.type === 'select') return p.select?.name ?? ''
        if (p.type === 'date') return p.date?.start ?? ''
        if (p.type === 'checkbox') return p.checkbox ?? false
        return ''
      }

      return {
        id: page.id,
        title: get('Title'),
        version: get('Version'),
        date: get('Date'),
        category: get('Category'),
        description: get('Description'),
        details: get('Details'),
      }
    })

    res.status(200).json({ items, source: 'notion' })
  } catch (err) {
    console.error('Releases API error:', err)
    res.status(200).json({ items: [], source: 'error' })
  }
}
