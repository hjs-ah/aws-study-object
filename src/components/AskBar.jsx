// src/components/AskBar.jsx
import { useState } from 'react'
import { useAsk } from '../hooks/useAsk.js'

export function AskBar({ domainSlug, certSlug, domainTitle }) {
  const [input, setInput] = useState('')
  const { ask, answer, loading, error, clear } = useAsk(domainSlug, certSlug)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!input.trim()) return
    ask(input.trim())
    setInput('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <div style={{
      borderTop: '1px solid var(--color-border)',
      padding: '10px 16px',
      background: 'var(--color-surface)',
      flexShrink: 0,
    }}>

      {/* Answer panel — compact, ~40% of original height */}
      {(answer || error || loading) && (
        <div style={{
          marginBottom: 8,
          padding: '8px 34px 8px 10px',
          background: 'var(--color-surface-raised)',
          border: `1px solid ${error ? 'var(--color-danger)' : 'var(--color-border)'}`,
          borderRadius: 'var(--radius-md)',
          position: 'relative',
          maxHeight: 110,
          overflowY: 'auto',
        }}>
          {loading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, color: 'var(--color-text-muted)' }}>
              <div style={{
                width: 12, height: 12, flexShrink: 0,
                border: '2px solid var(--color-border-emphasis)',
                borderTopColor: 'var(--color-accent)',
                borderRadius: '50%',
                animation: 'spin 0.7s linear infinite',
              }} />
              <span style={{ fontSize: 12 }}>Thinking…</span>
            </div>
          )}
          {error && <p style={{ fontSize: 12, color: 'var(--color-danger)', lineHeight: 1.5 }}>{error}</p>}
          {answer && (
            <p style={{ fontSize: 12, lineHeight: 1.6, color: 'var(--color-text-primary)', whiteSpace: 'pre-wrap', paddingRight: 4 }}>
              {answer}
            </p>
          )}

          {/* Close button — colored circle */}
          {(answer || error) && (
            <button
              onClick={clear}
              title="Clear answer"
              style={{
                position: 'absolute', top: 6, right: 6,
                width: 20, height: 20,
                borderRadius: '50%',
                background: error ? 'var(--color-danger)' : 'var(--color-accent)',
                border: 'none',
                color: '#000',
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 700,
                lineHeight: 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
                opacity: 0.85,
                transition: 'opacity 150ms ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = '1' }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.85' }}
            >
              ×
            </button>
          )}
        </div>
      )}

      {/* Input row */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        {/* AI badge */}
        <div style={{
          flexShrink: 0,
          width: 24, height: 24,
          background: 'var(--color-accent-dim)',
          border: '1px solid var(--color-accent-border)',
          borderRadius: 6,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 9, fontWeight: 700, color: 'var(--color-accent)',
          fontFamily: 'var(--font-mono)',
          letterSpacing: '0.02em',
        }}>AI</div>

        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Ask anything about ${domainTitle}… (Enter to send)`}
          disabled={loading}
          style={{
            flex: 1,
            padding: '8px 12px',
            background: 'var(--color-surface-raised)',
            border: '1px solid var(--color-border-emphasis)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--color-text-primary)',
            fontSize: 13,
            outline: 'none',
            transition: 'border-color 150ms ease',
          }}
          onFocus={(e) => { e.target.style.borderColor = 'var(--color-accent)' }}
          onBlur={(e) => { e.target.style.borderColor = 'var(--color-border-emphasis)' }}
        />

        <button
          onClick={handleSubmit}
          disabled={loading || !input.trim()}
          style={{
            flexShrink: 0,
            padding: '8px 14px',
            background: loading || !input.trim() ? 'var(--color-surface-raised)' : 'var(--color-accent)',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            color: loading || !input.trim() ? 'var(--color-text-muted)' : '#000',
            fontSize: 12, fontWeight: 600,
            cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
            transition: 'background 150ms ease, color 150ms ease',
            whiteSpace: 'nowrap',
          }}
        >
          Ask →
        </button>
      </div>

      {/* Subtle hint */}
      <div style={{
        fontSize: 10, color: 'var(--color-text-muted)',
        fontFamily: 'var(--font-mono)',
        marginTop: 5,
        paddingLeft: 32,
      }}>
        AI-powered · scoped to {domainTitle} · charged per query
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

export default AskBar
