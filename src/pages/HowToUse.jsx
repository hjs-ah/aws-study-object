// src/pages/HowToUse.jsx
// Visual welcome/onboarding page. Appears above VPC in the concept map area.

export function HowToUse() {
  const steps = [
    {
      icon: '① ',
      label: 'Pick a Domain',
      color: '#ff9900',
      desc: 'Use the left sidebar to choose one of 8 exam domains. The % weight shows how much each domain counts on the SAA-C03 exam. Start with the highest-weight domains first.',
      diagram: <SidebarMini />,
    },
    {
      icon: '② ',
      label: 'Study the Concept Map',
      color: '#5b9cf6',
      desc: 'The Concept Map tab shows an interactive architecture diagram. Click any component box to see exam notes and the most common traps. Great for visual learners.',
      diagram: <DiagramMini />,
    },
    {
      icon: '③ ',
      label: 'Test with Scenarios',
      color: '#3ecf8e',
      desc: 'The Scenarios tab gives you multiple-choice questions. Choose your answer, then tap Reveal. Your score is tracked per domain and shown in the sidebar.',
      diagram: <QuestionMini />,
    },
    {
      icon: '④ ',
      label: 'Spot Architecture Flaws',
      color: '#f06060',
      desc: 'The Architecture Trap tab shows real-looking but broken AWS setups. Identify what\'s wrong, then reveal the explanation and the correct fix. This is where most exam points are won or lost.',
      diagram: <TrapMini />,
    },
    {
      icon: '⑤ ',
      label: 'Ask the AI Tutor',
      color: '#a78bfa',
      desc: 'The Ask bar at the bottom of every domain page is scoped to that domain\'s context. Type any question — "When should I use NLB vs ALB?" — and get a targeted exam-focused answer. Each query costs a fraction of a cent.',
      diagram: <AskMini />,
    },
    {
      icon: '⑥ ',
      label: 'Review Key Terms',
      color: '#f59e0b',
      desc: 'At the bottom of every Concept Map, you\'ll find clickable keyword chips. Tap any term to see its definition in a tooltip. Tap the × to dismiss.',
      diagram: <GlossaryMini />,
    },
  ]

  return (
    <div style={{ padding: '20px 20px 32px', maxWidth: 820, margin: '0 auto' }}>

      {/* Hero */}
      <div style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        padding: '20px 22px',
        marginBottom: 24,
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: 0, right: 0, bottom: 0, width: 160,
          background: 'linear-gradient(135deg, transparent, rgba(255,153,0,0.06))',
          pointerEvents: 'none',
        }} />
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10,
        }}>
          <div style={{
            padding: '4px 10px', fontSize: 10, fontFamily: 'var(--font-mono)',
            background: 'var(--color-accent-dim)', border: '1px solid var(--color-accent-border)',
            borderRadius: 20, color: 'var(--color-accent)', fontWeight: 600, letterSpacing: '0.05em',
          }}>AWS SAA-C03 Study Guide</div>
        </div>
        <h1 style={{
          fontSize: 22, fontWeight: 700, color: 'var(--color-text-primary)',
          margin: '0 0 8px', letterSpacing: '-0.02em',
          fontFamily: 'var(--font-display)',
        }}>Welcome — Here's How to Use This App</h1>
        <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.7, margin: 0 }}>
          This study tool is organized around the 8 domains of the AWS Solutions Architect Associate exam.
          Each domain has an interactive diagram, scenario questions, architecture trap exercises, an AI tutor, and key term glossary.
          Follow the steps below to get the most out of each study session.
        </p>
      </div>

      {/* Step cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {steps.map((step) => (
          <div key={step.icon} style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            display: 'flex', flexDirection: 'row',
          }}>
            {/* Color bar */}
            <div style={{ width: 4, flexShrink: 0, background: step.color }} />

            <div style={{ flex: 1, padding: '14px 16px', display: 'flex', gap: 14, alignItems: 'flex-start', flexWrap: 'wrap' }}>
              {/* Text */}
              <div style={{ flex: 1, minWidth: 180 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: step.color, fontWeight: 700 }}>{step.icon}</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-primary)' }}>{step.label}</span>
                </div>
                <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', lineHeight: 1.65, margin: 0 }}>
                  {step.desc}
                </p>
              </div>
              {/* Mini diagram */}
              <div style={{ flexShrink: 0, width: 180 }}>
                {step.diagram}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom nav hint */}
      <div style={{
        marginTop: 20, padding: '12px 16px',
        background: 'var(--color-accent-dim)',
        border: '1px solid var(--color-accent-border)',
        borderRadius: 'var(--radius-md)',
        fontSize: 12, color: 'var(--color-text-secondary)', lineHeight: 1.6,
      }}>
        <span style={{ fontWeight: 600, color: 'var(--color-accent)' }}>Ready to start? </span>
        Click any domain in the left sidebar to open it. The sidebar also shows your score progress per domain once you've answered questions. Aim for 80%+ across all domains before scheduling your exam.
      </div>
    </div>
  )
}

// ── Mini diagram illustrations ─────────────────────────────────────────────

function SidebarMini() {
  const items = ['VPC & Networking', 'IAM & Security', 'Compute', 'Storage']
  return (
    <div style={{
      background: 'var(--color-surface-raised)', border: '1px solid var(--color-border)',
      borderRadius: 8, padding: 8, fontSize: 11,
    }}>
      <div style={{ fontSize: 9, color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)', marginBottom: 6, letterSpacing: '0.06em' }}>DOMAINS</div>
      {items.map((name, i) => (
        <div key={name} style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '4px 6px', marginBottom: 3,
          background: i === 0 ? 'var(--color-surface-hover)' : 'transparent',
          borderLeft: i === 0 ? '2px solid var(--color-accent)' : '2px solid transparent',
          borderRadius: 4,
        }}>
          <span style={{ fontSize: 10, color: i === 0 ? 'var(--color-text-primary)' : 'var(--color-text-muted)' }}>{name}</span>
          <span style={{
            fontSize: 9, fontFamily: 'var(--font-mono)', padding: '1px 5px',
            background: 'var(--color-accent-dim)', border: '1px solid var(--color-accent-border)',
            borderRadius: 8, color: 'var(--color-accent)',
          }}>{[20,16,15,14][i]}%</span>
        </div>
      ))}
    </div>
  )
}

function DiagramMini() {
  return (
    <div style={{
      background: 'var(--color-surface-raised)', border: '1px solid var(--color-border)',
      borderRadius: 8, padding: 10,
    }}>
      <div style={{ fontSize: 9, color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)', marginBottom: 8, letterSpacing: '0.06em' }}>CONCEPT MAP — click to inspect</div>
      <svg viewBox="0 0 160 80" style={{ width: '100%', display: 'block' }}>
        {[
          { label: 'IGW', x: 60, y: 5, active: false },
          { label: 'ALB', x: 60, y: 30, active: true },
          { label: 'EC2', x: 60, y: 55, active: false },
        ].map(({ label, x, y, active }) => (
          <g key={label}>
            <rect x={x - 22} y={y} width={44} height={18} rx={4}
              fill={active ? 'rgba(255,153,0,0.15)' : 'var(--color-surface)'}
              stroke={active ? 'rgba(255,153,0,0.5)' : 'rgba(255,255,255,0.1)'} strokeWidth={active ? 1.5 : 1} />
            <text x={x} y={y + 13} textAnchor="middle" fill={active ? '#ff9900' : 'var(--color-text-secondary)'} fontSize={8} fontFamily="monospace">{label}</text>
          </g>
        ))}
        <line x1={60} y1={23} x2={60} y2={30} stroke="rgba(255,255,255,0.1)" strokeWidth={1} strokeDasharray="3 2" />
        <line x1={60} y1={48} x2={60} y2={55} stroke="rgba(255,255,255,0.1)" strokeWidth={1} strokeDasharray="3 2" />
        {/* Tooltip bubble */}
        <rect x={88} y={26} width={65} height={28} rx={5} fill="var(--color-surface)" stroke="rgba(255,153,0,0.3)" strokeWidth={1} />
        <text x={120} y={37} textAnchor="middle" fill="var(--color-accent)" fontSize={7} fontFamily="monospace">ALB — Layer 7</text>
        <text x={120} y={47} textAnchor="middle" fill="var(--color-text-muted)" fontSize={6} fontFamily="monospace">Path-based routing</text>
      </svg>
    </div>
  )
}

function QuestionMini() {
  return (
    <div style={{
      background: 'var(--color-surface-raised)', border: '1px solid var(--color-border)',
      borderRadius: 8, padding: 10, fontSize: 10,
    }}>
      <div style={{ fontSize: 9, color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)', marginBottom: 6 }}>SCENARIO QUESTION</div>
      <div style={{ fontSize: 11, color: 'var(--color-text-primary)', marginBottom: 8, lineHeight: 1.4 }}>
        Which allows private EC2 to reach the internet?
      </div>
      {['IGW', 'NAT Gateway ✓', 'VPC Endpoint', 'Security Group'].map((opt, i) => (
        <div key={opt} style={{
          padding: '3px 7px', marginBottom: 3, fontSize: 10, borderRadius: 5,
          background: i === 1 ? 'rgba(62,207,142,0.12)' : 'var(--color-surface)',
          border: `1px solid ${i === 1 ? 'rgba(62,207,142,0.35)' : 'var(--color-border)'}`,
          color: i === 1 ? 'var(--color-success)' : 'var(--color-text-secondary)',
        }}>{opt}</div>
      ))}
    </div>
  )
}

function TrapMini() {
  return (
    <div style={{
      background: 'var(--color-surface-raised)', border: '1px solid var(--color-border)',
      borderRadius: 8, padding: 10,
    }}>
      <div style={{ fontSize: 9, color: 'var(--color-danger)', fontFamily: 'var(--font-mono)', marginBottom: 6 }}>⚠ WHAT'S WRONG?</div>
      {[
        { label: 'ALB (public subnet)', wrong: false },
        { label: 'NAT GW (private!) ← WRONG', wrong: true },
        { label: 'EC2 (private subnet)', wrong: false },
      ].map((node) => (
        <div key={node.label} style={{
          padding: '4px 7px', marginBottom: 4, borderRadius: 5, fontSize: 10,
          background: node.wrong ? 'rgba(240,96,96,0.1)' : 'var(--color-surface)',
          border: `1px solid ${node.wrong ? 'rgba(240,96,96,0.35)' : 'var(--color-border)'}`,
          color: node.wrong ? 'var(--color-danger)' : 'var(--color-text-secondary)',
        }}>{node.label}</div>
      ))}
    </div>
  )
}

function AskMini() {
  return (
    <div style={{
      background: 'var(--color-surface-raised)', border: '1px solid var(--color-border)',
      borderRadius: 8, padding: 10,
    }}>
      <div style={{ fontSize: 9, color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)', marginBottom: 8 }}>AI TUTOR — bottom of page</div>
      <div style={{
        display: 'flex', gap: 6, alignItems: 'center',
        background: 'var(--color-surface)', border: '1px solid var(--color-border)',
        borderRadius: 6, padding: '5px 8px', marginBottom: 6,
      }}>
        <div style={{ fontSize: 8, padding: '1px 5px', background: 'var(--color-accent-dim)', border: '1px solid var(--color-accent-border)', borderRadius: 4, color: 'var(--color-accent)', fontFamily: 'monospace' }}>AI</div>
        <span style={{ fontSize: 9, color: 'var(--color-text-muted)' }}>Ask anything about VPC…</span>
      </div>
      <div style={{ fontSize: 10, color: 'var(--color-text-secondary)', lineHeight: 1.4, fontStyle: 'italic' }}>
        "NAT Gateway must live in the public subnet because private subnets have no route to IGW…"
      </div>
    </div>
  )
}

function GlossaryMini() {
  return (
    <div style={{
      background: 'var(--color-surface-raised)', border: '1px solid var(--color-border)',
      borderRadius: 8, padding: 10,
    }}>
      <div style={{ fontSize: 9, color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)', marginBottom: 8 }}>KEY TERMS — bottom of concept map</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 8 }}>
        {['Subnet', 'IGW', 'NAT Gateway', 'NACL'].map((t, i) => (
          <span key={t} style={{
            fontSize: 9, padding: '3px 8px',
            background: i === 2 ? 'var(--color-accent-dim)' : 'var(--color-surface)',
            border: `1px solid ${i === 2 ? 'var(--color-accent)' : 'var(--color-border)'}`,
            borderRadius: 12, color: i === 2 ? 'var(--color-accent)' : 'var(--color-text-muted)',
          }}>{t}</span>
        ))}
      </div>
      <div style={{
        background: 'var(--color-surface)', border: '1px solid var(--color-accent-border)',
        borderRadius: 6, padding: '6px 8px', fontSize: 9, color: 'var(--color-text-secondary)', lineHeight: 1.5,
        position: 'relative',
      }}>
        <span style={{ color: 'var(--color-accent)', fontFamily: 'monospace', fontWeight: 600 }}>NAT Gateway</span>
        <br/>Must be in the PUBLIC subnet…
        <span style={{
          position: 'absolute', top: 4, right: 5, width: 13, height: 13,
          background: 'var(--color-accent)', borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 9, color: '#000', fontWeight: 700, cursor: 'pointer',
        }}>×</span>
      </div>
    </div>
  )
}

export default HowToUse
