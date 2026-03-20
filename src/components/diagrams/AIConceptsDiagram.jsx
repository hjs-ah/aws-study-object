// src/components/diagrams/AIConceptsDiagram.jsx — Flowchart style for AIP
import { useState } from 'react'

const STEPS = [
  { id: 'data', label: 'Data Collection', abbr: 'Data', color: '#185FA5', tip: 'Raw data (text, images, tabular) is gathered, cleaned, and labeled. Quality of training data directly determines model quality. Structured vs unstructured data require different preprocessing.', trap: 'More data ≠ always better. Garbage in, garbage out. Biased training data produces biased models.' },
  { id: 'train', label: 'Model Training', abbr: 'Train', color: '#534AB7', tip: 'Model learns patterns by adjusting weights through forward pass → loss calculation → backpropagation → weight update. Epoch = one full pass through the training dataset.', trap: 'Overfitting = great on training data, poor on new data. Underfitting = poor on both. Regularization and validation sets help detect these.' },
  { id: 'eval', label: 'Evaluation', abbr: 'Eval', color: '#0F6E56', tip: 'Metrics depend on the task: Accuracy/Precision/Recall/F1 for classification; RMSE/MAE for regression; BLEU/ROUGE for text generation. Use a held-out test set never seen during training.', trap: 'Never evaluate on training data — you\'ll get inflated metrics. Always split: train / validation / test.' },
  { id: 'deploy', label: 'Deployment', abbr: 'Deploy', color: '#854F0B', tip: 'Model is served via an endpoint (REST API). Options: SageMaker Endpoints, Lambda + S3, or EC2. Consider latency, throughput, and cost. A/B testing new model versions against production.', trap: 'A deployed model doesn\'t stay accurate forever. Data drift (input distribution changes) and concept drift (the relationship changes) degrade performance over time.' },
  { id: 'monitor', label: 'Monitor & Retrain', abbr: 'Monitor', color: '#993C1D', tip: 'Track model performance in production. SageMaker Model Monitor detects data quality issues and bias drift. When performance drops, collect new data and retrain — the ML lifecycle is circular.', trap: 'Monitoring is often skipped but is critical for production AI. Without it, you won\'t know when your model goes stale.' },
]

export function AIConceptsDiagram() {
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
        <span style={{ color: 'var(--color-accent)' }}>↓</span> Click any step to see exam notes — ML lifecycle flows left to right
      </div>
      <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: 14, marginBottom: 12, overflowX: 'auto' }}>
        <svg viewBox="0 0 560 110" style={{ width: '100%', minWidth: 320, display: 'block' }}>
          <defs>
            <marker id="aiarr" markerWidth="6" markerHeight="4" refX="6" refY="2" orient="auto">
              <polygon points="0 0,6 2,0 4" fill="var(--color-border-emphasis)" />
            </marker>
          </defs>
          <text x={280} y={18} textAnchor="middle" fill={textSecondary} fontSize={9} fontFamily="var(--font-mono)" fontWeight={600}>ML LIFECYCLE — AI & ML CONCEPTS (AIF-C01)</text>
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
                <text x={x + 48} y={68} textAnchor="middle" dominantBaseline="middle"
                  fill={textSecondary} fontSize={8} fontFamily="var(--font-mono)">{i + 1}</text>
                {i < STEPS.length - 1 && (
                  <line x1={x + 98} y1={56} x2={x + 106} y2={56} stroke={border} strokeWidth={1} markerEnd="url(#aiarr)" />
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
export default AIConceptsDiagram
