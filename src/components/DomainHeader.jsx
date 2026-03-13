// src/components/DomainHeader.jsx
import { useNavigate } from 'react-router-dom'

export default function DomainHeader({ domain, certSlug, children }) {
  const navigate = useNavigate()
  return (
    <div style={{
      padding: '0.85rem 1.1rem',
      borderBottom: '1px solid var(--color-border)',
      background: 'var(--color-surface)',
      display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0,
    }}>
      <button onClick={() => navigate(`/app/${certSlug}`)} style={{
        background: 'none', border: 'none', cursor: 'pointer',
        color: 'var(--color-text-muted)', fontSize: '0.9rem', padding: '2px 6px',
        borderRadius: '4px', fontFamily: 'inherit',
      }}>
        ←
      </button>
      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: domain?.color ?? 'var(--color-accent)', flexShrink: 0 }} />
      <h2 style={{ margin: 0, fontSize: '0.97rem', fontWeight: 700, color: 'var(--color-text-primary)', flex: 1 }}>
        {domain?.title}
        {domain?.weight && <span style={{ marginLeft: '0.5rem', fontSize: '0.7rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>{domain.weight}% of exam</span>}
      </h2>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>{children}</div>
    </div>
  )
}
