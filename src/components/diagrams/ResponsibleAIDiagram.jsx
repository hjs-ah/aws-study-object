// src/components/diagrams/ResponsibleAIDiagram.jsx — Flowchart for AIP
import { useState } from 'react'

const STEPS = [
  { id: 'bias', label: 'Bias Detection', abbr: 'Bias', color: '#993C1D', tip: 'Bias in training data leads to biased predictions. SageMaker Clarify detects bias in datasets and model predictions. Measure: demographic parity, equal opportunity, disparate impact.', trap: 'Removing sensitive attributes (like race) from training data does NOT eliminate bias. Proxy variables (zip code, name) can still introduce it.' },
  { id: 'explainability', label: 'Explainability', abbr: 'Explain', color: '#854F0B', tip: 'SHAP values show feature importance. SageMaker Clarify generates explanations. Black-box models (deep learning) are harder to explain than tree-based models. Explainability ≠ interpretability.', trap: 'Explainability tools show correlation, not causation. A feature being important doesn\'t mean changing it will change the outcome.' },
  { id: 'privacy', label: 'Privacy', abbr: 'Privacy', color: '#534AB7', tip: 'Differential privacy adds statistical noise to protect individual records. PII detection with Comprehend. Data minimization: collect only what\'s needed. AWS Macie finds sensitive data in S3.', trap: 'Federated learning trains models on local data without centralizing it — addresses privacy but adds complexity. Know the concept for the exam.' },
  { id: 'transparency', label: 'Transparency', abbr: 'Transprncy', color: '#185FA5', tip: 'Model cards document model purpose, training data, limitations, and intended use. AWS Bedrock model cards describe FM characteristics. Transparency enables informed trust.', trap: 'Transparency to users ≠ open-source. A model can be transparent about its limitations without revealing its weights.' },
  { id: 'governance', label: 'Governance', abbr: 'Govern', color: '#0F6E56', tip: 'AWS AI Service Cards describe capabilities and limitations. Bedrock Guardrails filter harmful inputs/outputs. Human review workflows (A2I) for sensitive decisions. Audit trails via CloudTrail.', trap: 'Governance is not just technical — it includes policies, roles, and processes. Exam may test organizational aspects of responsible AI.' },
]

export function ResponsibleAIDiagram() {
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
        <span style={{ color: 'var(--color-accent)' }}>↓</span> Click any pillar — responsible AI framework for AIF-C01
      </div>
      <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: 14, marginBottom: 12, overflowX: 'auto' }}>
        <svg viewBox="0 0 560 110" style={{ width: '100%', minWidth: 320, display: 'block' }}>
          <text x={280} y={18} textAnchor="middle" fill={textSecondary} fontSize={9} fontFamily="var(--font-mono)" fontWeight={600}>RESPONSIBLE AI PILLARS — AIF-C01</text>
          {STEPS.map((step, i) => {
            const x = 20 + i * 108
            const isActive = active === step.id
            return (
              <g key={step.id} onClick={() => toggle(step.id)} style={{ cursor: 'pointer' }}>
                <rect x={x} y={28} width={96} height={64} rx={8}
                  fill={isActive ? `${step.color}22` : surfaceRaised}
                  stroke={isActive ? step.color : border}
                  strokeWidth={isActive ? 1.5 : 1} />
                <text x={x + 48} y={52} textAnchor="middle" dominantBaseline="middle"
                  fill={isActive ? step.color : textPrimary}
                  fontSize={9} fontFamily="var(--font-mono)" fontWeight={700}>{step.abbr}</text>
                <text x={x + 48} y={68} textAnchor="middle" dominantBaseline="middle"
                  fill={textSecondary} fontSize={7} fontFamily="var(--font-mono)">{step.label}</text>
              </g>
            )
          })}
        </svg>
      </div>
      <div style={{ minHeight: 80, background: 'var(--color-surface)', border: `1px solid ${current ? 'var(--color-accent-border)' : border}`, borderRadius: 'var(--radius-md)', padding: '12px 14px', transition: 'border-color 200ms ease' }}>
        {!current && <p style={{ fontSize: 12, color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>← Select a pillar above to see exam notes</p>}
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
export default ResponsibleAIDiagram
