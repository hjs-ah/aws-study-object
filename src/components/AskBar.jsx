// src/components/AskBar.jsx
import { useState } from 'react'
import { useAsk } from '../hooks/useAsk.js'

export function AskBar({ domainSlug, domainTitle }) {
  const [input, setInput] = useState('')
  const { ask, answer, loading, error, clear } = useAsk(domainSlug)

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
      padding: '16px 28px',
      background: 'var(--color-surface)',
    }}>
      {/* Answer display */}
      {(answer || error || loading) && (
        <div style={{
          marginBottom: 14,
          padding: '14px 16px',
          background: 'var(--color-surface-raised)',
          border: `1px solid ${error ? 'var(--color-danger)' : 'var(--color-border)'}`,
          borderRadius: 'var(--radius-md)',
          position: 'relative',
        }}>
          {loading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--color-text-muted)' }}>
              <div style={{
                width: 14, height: 14,
                border: '2px solid var(--color-border-emphasis)',
                borderTopColor: 'var(--color-accent)',
                borderRadius: '50%',
                animation: 'spin 0.7s linear infinite',
              }} />
              <span style={{ fontSize: 13 }}>Thinking...</span>
            </div>
          )}
          {error && (
            <p style={{ fontSize: 13, color: 'var(--color-danger)' }}>{error}</p>
          )}
          {answer && (
            <>
              <p style={{ fontSize: 13, lineHeight: 1.7, color: 'var(--color-text-primary)', whiteSpace: 'pre-wrap' }}>
                {answer}
              </p>
              <button
                onClick={clear}
                style={{
                  position: 'absolute', top: 10, right: 10,
                  background: 'transparent', border: 'none',
                  color: 'var(--color-text-muted)', cursor: 'pointer',
                  fontSize: 16, lineHeight: 1,
                }}
              >
                ×
              </button>
            </>
          )}
        </div>
      )}

      {/* Input row */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <div style={{
            position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
            width: 22, height: 22,
            background: 'var(--color-accent-dim)',
            border: '1px solid var(--color-accent-border)',
            borderRadius: 6,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 10, fontWeight: 600, color: 'var(--color-accent)',
            fontFamily: 'var(--font-mono)',
          }}>AI</div>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Ask anything about ${domainTitle}…`}
            disabled={loading}
            style={{
              width: '100%',
              padding: '11px 14px 11px 44px',
              background: 'var(--color-surface-raised)',
              border: '1px solid var(--color-border-emphasis)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--color-text-primary)',
              fontSize: 13,
              outline: 'none',
              transition: 'var(--transition)',
            }}
          />
        </div>
        <button
          type="submit"
          disabled={loading || !input.trim()}
          style={{
            padding: '11px 18px',
            background: loading || !input.trim() ? 'var(--color-surface-raised)' : 'var(--color-accent)',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            color: loading || !input.trim() ? 'var(--color-text-muted)' : '#000',
            fontSize: 13, fontWeight: 500,
            cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
            transition: 'var(--transition)',
            whiteSpace: 'nowrap',
          }}
        >
          Ask →
        </button>
      </form>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
