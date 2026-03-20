// src/components/diagrams/GenAIDiagram.jsx — Flowchart for AIP Gen AI domain
import { useState } from 'react'

const STEPS = [
  { id: 'prompt', label: 'Prompt', abbr: 'Prompt', color: '#185FA5', tip: 'The input text sent to the model. Includes system prompt (instructions/persona), few-shot examples (optional), and user message. Prompt engineering = crafting effective inputs.', trap: 'Longer prompts cost more tokens. System prompts are reused across calls — use prompt caching (available in Claude/Bedrock) to reduce cost by ~90% on repeated system prompts.' },
  { id: 'tokenize', label: 'Tokenization', abbr: 'Tokens', color: '#534AB7', tip: 'Text is split into tokens (roughly 3-4 characters or 0.75 words each). "Hello world" ≈ 2 tokens. Models have a context window limit (max tokens for input + output combined).', trap: 'Context window = input + output tokens combined. If your input is 90% of the context window, the model has very little room to generate output.' },
  { id: 'generate', label: 'Generation', abbr: 'Generate', color: '#0F6E56', tip: 'Model predicts the next token using attention over the context. Temperature controls randomness (0 = deterministic, 1 = creative). Top-P/Top-K control token sampling distribution.', trap: 'Temperature 0 is NOT always best — it can make responses repetitive. Use 0 for factual/code tasks, higher values for creative writing.' },
  { id: 'rag', label: 'RAG', abbr: 'RAG', color: '#854F0B', tip: 'Retrieval-Augmented Generation: retrieve relevant documents from a vector store, inject them into the prompt, then generate. Grounds the model in your data. Bedrock Knowledge Bases implements RAG.', trap: 'RAG does not update the model\'s weights. It just provides context at inference time. Fine-tuning actually changes weights. Both are valid but for different use cases.' },
  { id: 'output', label: 'Output', abbr: 'Output', color: '#993C1D', tip: 'Generated text (or structured JSON with tool use). Evaluate with human feedback, automated metrics (ROUGE, BLEU), or model-as-judge. Guardrails filter harmful outputs.', trap: 'LLMs can hallucinate — generate confident but incorrect facts. Always implement human review or automated fact-checking for high-stakes outputs.' },
]

export function GenAIDiagram() {
  const [active, setActive] = useState(null)
  const toggle = (id) => setActive(p => p === id ? null : id)
  const current = active ? STEPS.find(s => s.id === active) : null
  const border = 'var(--color-border-emphasis)'
  const surfaceRaised = 'var(--color-surface-raised)'
  const textPrimary = 'var(--color-text-primary)'
  const textSecondary = 'var(--color-text-secondary)'

  return (
    <div>
      <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ color: 'var(--color-accent)' }}>↓</span> Click any step — generative AI flow from prompt to output
      </div>
      <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: 14, marginBottom: 12, overflowX: 'auto' }}>
        <svg viewBox="0 0 560 110" style={{ width: '100%', minWidth: 320, display: 'block' }}>
          <defs>
            <marker id="genarr" markerWidth="6" markerHeight="4" refX="6" refY="2" orient="auto">
              <polygon points="0 0,6 2,0 4" fill="var(--color-border-emphasis)" />
            </marker>
          </defs>
          <text x={280} y={18} textAnchor="middle" fill={textSecondary} fontSize={9} fontFamily="var(--font-mono)" fontWeight={600}>GENERATIVE AI FLOW — AIF-C01</text>
          {STEPS.map((step, i) => {
            const x = 20 + i * 108
            const isActive = active === step.id
            return (
              <g key={step.id} onClick={() => toggle(step.id)} style={{ cursor: 'pointer' }}>
                <rect x={x} y={30} width={96} height={52} rx={8}
                  fill={isActive ? `${step.color}22` : surfaceRaised}
                  stroke={isActive ? step.color : border}
                  strokeWidth={isActive ? 1.5 : 1} />
                <text x={x + 48} y={52} textAnchor="middle" dominantBaseline="middle"
                  fill={isActive ? step.color : textPrimary}
                  fontSize={10} fontFamily="var(--font-mono)" fontWeight={700}>{step.abbr}</text>
                {i < STEPS.length - 1 && (
                  <line x1={x + 98} y1={56} x2={x + 106} y2={56} stroke={border} strokeWidth={1} markerEnd="url(#genarr)" />
                )}
              </g>
            )
          })}
        </svg>
      </div>
      <div style={{ minHeight: 80, background: 'var(--color-surface)', border: `1px solid ${current ? 'var(--color-accent-border)' : border}`, borderRadius: 'var(--radius-md)', padding: '12px 14px', transition: 'border-color 200ms ease' }}>
        {!current && <p style={{ fontSize: 12, color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>← Select a step above to see exam notes</p>}
        {current && (<>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7 }}>
            <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', padding: '2px 8px', background: `${current.color}18`, border: `1px solid ${current.color}44`, borderRadius: 20, color: current.color }}>{current.abbr}</span>
            <span style={{ fontSize: 13, fontWeight: 500, color: textPrimary }}>{current.label}</span>
          </div>
          <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: 8 }}>{current.tip}</p>
          <div style={{ padding: '6px 10px', background: 'var(--color-warning-dim)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: 'var(--radius-sm)', fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--color-warning)' }}>Exam trap: {current.trap}</div>
        </>)}
      </div>
    </div>
  )
}
export default GenAIDiagram
