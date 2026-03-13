// src/components/TabBar.jsx

const TAB_LABELS = {
  'concepts': 'Concept Map',
  'scenarios': 'Practice',
  'architecture-trap': 'Arch Trap',
  'lab': 'Lab Guide',
  'cheat-sheet': 'Cheat Sheet',
}

export default function TabBar({ tabs, active, onChange, color }) {
  return (
    <div style={{
      display: 'flex', gap: '0', borderBottom: '1px solid var(--border)',
      background: 'var(--bg-secondary)', overflowX: 'auto', flexShrink: 0,
    }}>
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          style={{
            padding: '0.6rem 1rem',
            background: 'none',
            border: 'none',
            borderBottom: active === tab ? `2px solid ${color ?? 'var(--accent)'}` : '2px solid transparent',
            color: active === tab ? 'var(--text-primary)' : 'var(--text-muted)',
            fontSize: '0.78rem',
            fontWeight: active === tab ? 700 : 400,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            transition: 'all 0.15s',
          }}
        >
          {TAB_LABELS[tab] ?? tab}
        </button>
      ))}
    </div>
  )
}
