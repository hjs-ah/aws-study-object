// src/components/DomainHeader.jsx
import { useNavigate } from 'react-router-dom'

export default function DomainHeader({ domain, certSlug, children }) {
  const navigate = useNavigate()

  return (
    <div style={{
      padding: '0.85rem 1rem',
      borderBottom: '1px solid var(--border)',
      background: 'var(--bg-secondary)',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      flexShrink: 0,
    }}>
      <button
        onClick={() => navigate(`/app/${certSlug}`)}
        style={{ background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--text-muted)', fontSize: '0.85rem', padding: '2px 4px' }}
      >
        ←
      </button>

      <div style={{
        width: '8px', height: '8px', borderRadius: '50%',
        background: domain?.color ?? 'var(--accent)', flexShrink: 0,
      }} />

      <h2 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', flex: 1 }}>
        {domain?.title}
      </h2>

      {/* Score badge + counts passed as children */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {children}
      </div>
    </div>
  )
}
