// src/components/PracticeQuestion.jsx
// Multiple-choice question with instant feedback + score engine callback.

import { useState } from 'react'

export default function PracticeQuestion({ question, onAnswer }) {
  const [selected, setSelected] = useState(null)
  const [revealed, setRevealed] = useState(false)

  if (!question) return null

  const options = Array.isArray(question.options)
    ? question.options
    : typeof question.options === 'string'
      ? question.options.split('\n').filter(Boolean)
      : []

  const correctIndex = typeof question.answer === 'number' ? question.answer : 0

  function handleSelect(idx) {
    if (revealed) return
    setSelected(idx)
    setRevealed(true)
    if (onAnswer) onAnswer(idx === correctIndex)
  }

  const diffColor = question.difficulty === 'hard' ? '#a855f7'
    : question.difficulty === 'medium' ? '#f59e0b' : '#6b7280'

  return (
    <div style={{
      background: 'var(--color-surface)',
      borderRadius: '12px',
      padding: '1.25rem',
      border: '1px solid var(--color-border)',
    }}>
      {/* Question header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', gap: '0.5rem' }}>
        <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text-primary)', lineHeight: 1.5, flex: 1 }}>
          {question.question}
        </p>
        <span style={{
          fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em',
          color: diffColor, background: `${diffColor}18`, padding: '2px 8px', borderRadius: '99px',
          whiteSpace: 'nowrap', flexShrink: 0,
        }}>
          {question.difficulty}
        </span>
      </div>

      {/* Options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {options.map((opt, idx) => {
          let bg = 'var(--color-bg)'
          let border = 'var(--color-border)'
          let color = 'var(--color-text-primary)'

          if (revealed) {
            if (idx === correctIndex) { bg = 'rgba(34,197,94,0.12)'; border = '#22c55e'; color = '#22c55e' }
            else if (idx === selected) { bg = 'rgba(239,68,68,0.12)'; border = '#ef4444'; color = '#ef4444' }
          } else if (idx === selected) {
            bg = 'var(--color-surface-raised)'
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              style={{
                background: bg, border: `1px solid ${border}`, borderRadius: '8px',
                padding: '0.65rem 0.9rem', textAlign: 'left', cursor: revealed ? 'default' : 'pointer',
                fontSize: '0.85rem', color, transition: 'all 0.15s', width: '100%',
              }}
            >
              {opt}
            </button>
          )
        })}
      </div>

      {/* Explanation */}
      {revealed && (
        <div style={{ marginTop: '1rem', padding: '0.85rem', background: 'var(--color-surface-raised)',
          borderRadius: '8px', fontSize: '0.82rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
          <strong style={{ color: 'var(--color-text-primary)' }}>Explanation: </strong>
          {question.explanation}
          {question.trap && (
            <div style={{ marginTop: '0.5rem', color: '#f59e0b' }}>
              <strong>⚠ Exam Trap: </strong>{question.trap}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
