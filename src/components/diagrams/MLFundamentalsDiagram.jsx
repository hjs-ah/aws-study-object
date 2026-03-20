// src/components/diagrams/MLFundamentalsDiagram.jsx — Flowchart for AIP
import { useState } from 'react'

const STEPS = [
  { id: 'supervised', label: 'Supervised Learning', abbr: 'Supervised', color: '#185FA5', tip: 'Trained on labeled data (input → correct output). Classification (discrete labels) and Regression (continuous values). Examples: spam detection, price prediction, image classification.', trap: 'Supervised ≠ Unsupervised. Supervised needs labeled data (expensive). Unsupervised finds patterns without labels. Know when to use each.' },
  { id: 'unsupervised', label: 'Unsupervised Learning', abbr: 'Unsupervised', color: '#534AB7', tip: 'Finds patterns in unlabeled data. Clustering (K-means, DBSCAN) groups similar data. Dimensionality reduction (PCA) compresses features. Anomaly detection finds outliers.', trap: 'Unsupervised learning does NOT have a ground truth to evaluate against during training. Evaluation is harder — often requires domain expertise or downstream task performance.' },
  { id: 'rl', label: 'Reinforcement Learning', abbr: 'RL', color: '#0F6E56', tip: 'Agent learns by interacting with an environment, receiving rewards or penalties. Policy = strategy for choosing actions. Used in robotics, game playing, RLHF (aligning LLMs).', trap: 'RLHF (Reinforcement Learning from Human Feedback) is how modern LLMs are fine-tuned to be helpful. This is different from classic RL — humans provide the reward signal.' },
  { id: 'neural', label: 'Neural Networks', abbr: 'Neural', color: '#854F0B', tip: 'Layers of connected nodes. Input → Hidden layers → Output. Deep learning = many hidden layers. CNNs for images. RNNs/LSTMs for sequences. Transformers for text (foundation of LLMs).', trap: 'Deep learning requires large amounts of data and compute. For small datasets, traditional ML (decision trees, SVM) often outperforms deep learning.' },
  { id: 'eval', label: 'Model Evaluation', abbr: 'Metrics', color: '#993C1D', tip: 'Accuracy = (TP+TN)/total. Precision = TP/(TP+FP). Recall = TP/(TP+FN). F1 = harmonic mean of P&R. ROC-AUC for ranking. Choose metric based on the cost of false positives vs false negatives.', trap: 'High accuracy on imbalanced datasets is misleading. If 99% of data is class A, predicting A always gives 99% accuracy but is useless. Use F1, precision, recall instead.' },
]

export function MLFundamentalsDiagram() {
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
        <span style={{ color: 'var(--color-accent)' }}>↓</span> Click any concept — ML fundamentals for AIF-C01
      </div>
      <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: 14, marginBottom: 12, overflowX: 'auto' }}>
        <svg viewBox="0 0 560 110" style={{ width: '100%', minWidth: 320, display: 'block' }}>
          <defs>
            <marker id="mlarr" markerWidth="6" markerHeight="4" refX="6" refY="2" orient="auto">
              <polygon points="0 0,6 2,0 4" fill="var(--color-border-emphasis)" />
            </marker>
          </defs>
          <text x={280} y={18} textAnchor="middle" fill={textSecondary} fontSize={9} fontFamily="var(--font-mono)" fontWeight={600}>ML FUNDAMENTALS — AIF-C01</text>
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
                  fill={textSecondary} fontSize={7} fontFamily="var(--font-mono)">{step.label.split(' ')[0]}</text>
              </g>
            )
          })}
        </svg>
      </div>
      <div style={{ minHeight: 80, background: 'var(--color-surface)', border: `1px solid ${current ? 'var(--color-accent-border)' : border}`, borderRadius: 'var(--radius-md)', padding: '12px 14px', transition: 'border-color 200ms ease' }}>
        {!current && <p style={{ fontSize: 12, color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>← Select a concept above to see exam notes</p>}
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
export default MLFundamentalsDiagram
