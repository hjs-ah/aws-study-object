// src/components/TabBar.jsx

const TAB_LABELS = {
  'concepts': 'Concept Map',
  'scenarios': 'Scenario Q\'s',
  'architecture-trap': 'Architecture Trap',
  'lab': 'Lab Guide',
}

export default function TabBar({ tabs, active, onChange, color }) {
  return (
    <div style={{
      display: 'flex', gap: 0, borderBottom: '1px solid var(--color-border)',
      background: 'var(--color-surface)', overflowX: 'auto', flexShrink: 0, paddingLeft: '0.25rem',
    }}>
      {tabs.map((tab) => (
        <button key={tab} onClick={() => onChange(tab)} style={{
          padding: '0.65rem 1.1rem',
          background: 'none', border: 'none',
          borderBottom: active === tab ? `2px solid ${color ?? 'var(--color-accent)'}` : '2px solid transparent',
          color: active === tab ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
          fontSize: '0.8rem',
          fontWeight: active === tab ? 700 : 400,
          cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.15s',
          fontFamily: 'inherit',
        }}>
          {TAB_LABELS[tab] ?? tab}
        </button>
      ))}
    </div>
  )
}
