// src/components/TabBar.jsx
export function TabBar({ tabs, activeTab, onTabChange }) {
  return (
    <div style={{
      display: 'flex',
      borderBottom: '1px solid var(--color-border)',
      padding: '0 28px',
      gap: 0,
    }}>
      {tabs.map((tab) => {
        const isActive = tab === activeTab
        return (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            style={{
              padding: '10px 16px',
              fontSize: 13,
              fontWeight: isActive ? 500 : 400,
              color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
              background: 'transparent',
              border: 'none',
              borderBottom: isActive ? '2px solid var(--color-accent)' : '2px solid transparent',
              marginBottom: '-1px',
              cursor: 'pointer',
              transition: 'var(--transition)',
              whiteSpace: 'nowrap',
            }}
          >
            {tab}
          </button>
        )
      })}
    </div>
  )
}
