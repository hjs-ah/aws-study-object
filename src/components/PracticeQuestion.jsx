// src/components/PracticeQuestion.jsx
import { useState } from 'react'

export function PracticeQuestion({ question, onAnswer }) {
  const [selected, setSelected] = useState(null)
  const [revealed, setRevealed] = useState(false)

  const handleSelect = (idx) => {
    if (revealed) return
    setSelected(idx)
  }

  const handleReveal = () => {
    if (selected === null) return
    setRevealed(true)
    onAnswer?.(selected === question.correct)
  }

  const handleNext = () => {
    setSelected(null)
    setRevealed(false)
  }

  const isCorrect = selected === question.correct

  return (
    <div style={{
      background: 'var(--color-surface)',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
    }}>
      {/* Question */}
      <div style={{ padding: '20px 22px 16px', borderBottom: '1px solid var(--color-border)' }}>
        <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)', marginBottom: 8 }}>
          {question.id}
        </div>
        <p style={{ fontSize: 14, lineHeight: 1.65, color: 'var(--color-text-primary)' }}>
          {question.question}
              </p>
              <p style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)', marginTop: 8 }}>↓ Choose an answer below, then tap Reveal answer
        </p>
      </div>

      {/* Options */}
      <div style={{ padding: '12px 22px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {question.options.map((option, idx) => {
          let bg = 'var(--color-surface-raised)'
          let border = 'var(--color-border)'
          let textColor = 'var(--color-text-primary)'

          if (revealed) {
            if (idx === question.correct) {
              bg = 'var(--color-success-dim)'
              border = 'var(--color-success)'
              textColor = 'var(--color-success)'
            } else if (idx === selected && idx !== question.correct) {
              bg = 'var(--color-danger-dim)'
              border = 'var(--color-danger)'
              textColor = 'var(--color-danger)'
            }
          } else if (idx === selected) {
            border = 'var(--color-accent)'
            bg = 'var(--color-accent-dim)'
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              style={{
                display: 'flex', alignItems: 'flex-start', gap: 12,
                padding: '12px 14px',
                background: bg,
                border: `1px solid ${border}`,
                borderRadius: 'var(--radius-sm)',
                cursor: revealed ? 'default' : 'pointer',
                textAlign: 'left',
                transition: 'var(--transition)',
                color: textColor,
              }}
            >
              <span style={{
                flexShrink: 0, width: 20, height: 20,
                background: idx === selected ? 'var(--color-accent-dim)' : 'var(--color-surface)',
                border: `1px solid ${idx === selected ? 'var(--color-accent)' : 'var(--color-border-emphasis)'}`,
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontFamily: 'var(--font-mono)', fontWeight: 500,
                color: idx === selected ? 'var(--color-accent)' : 'var(--color-text-muted)',
              }}>
                {String.fromCharCode(65 + idx)}
              </span>
              <span style={{ fontSize: 13, lineHeight: 1.55 }}>{option}</span>
            </button>
          )
        })}
      </div>

      {/* Action / Explanation */}
      <div style={{ padding: '12px 22px 20px' }}>
        {!revealed ? (
          <button
            onClick={handleReveal}
            disabled={selected === null}
            style={{
              padding: '9px 20px',
              background: selected !== null ? 'var(--color-accent)' : 'var(--color-surface-raised)',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              color: selected !== null ? '#000' : 'var(--color-text-muted)',
              fontSize: 13, fontWeight: 500,
              cursor: selected !== null ? 'pointer' : 'not-allowed',
              transition: 'var(--transition)',
            }}
          >
            Reveal answer
          </button>
        ) : (
          <div>
            {/* Result badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '4px 10px',
              background: isCorrect ? 'var(--color-success-dim)' : 'var(--color-danger-dim)',
              border: `1px solid ${isCorrect ? 'var(--color-success)' : 'var(--color-danger)'}`,
              borderRadius: 20, marginBottom: 12,
              fontSize: 12, fontWeight: 500,
              color: isCorrect ? 'var(--color-success)' : 'var(--color-danger)',
            }}>
              {isCorrect ? 'Correct' : 'Incorrect'}
            </div>

            {/* Explanation */}
            <p style={{
              fontSize: 13, lineHeight: 1.65,
              color: 'var(--color-text-secondary)',
              marginBottom: 10,
            }}>
              {question.explanation}
            </p>

            {/* Trap callout */}
            {question.trap && (
              <div style={{
                padding: '8px 12px',
                background: 'var(--color-warning-dim)',
                border: '1px solid rgba(245,158,11,0.3)',
                borderRadius: 'var(--radius-sm)',
                fontSize: 12, color: 'var(--color-warning)',
                marginBottom: 14,
                fontFamily: 'var(--font-mono)',
              }}>
                Exam trap: {question.trap}
              </div>
            )}

            <button
              onClick={handleNext}
              style={{
                padding: '8px 18px',
                background: 'transparent',
                border: '1px solid var(--color-border-emphasis)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--color-text-secondary)',
                fontSize: 13, cursor: 'pointer',
                transition: 'var(--transition)',
              }}
            >
              Next question →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
