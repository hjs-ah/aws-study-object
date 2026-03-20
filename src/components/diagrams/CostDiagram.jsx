// src/components/diagrams/CostDiagram.jsx — Structural diagram
import { useState } from 'react'

const COMPONENTS = {
  ri: { label: 'Reserved Instances', abbr: 'RI', tip: '1 or 3-year commitment. Standard RI: up to 72% discount, no changes. Convertible RI: can change instance family, OS, tenancy — less discount. Can be sold on Reserved Instance Marketplace.', trap: 'Standard RI cannot be modified across instance families. Convertible RI can, but at a lower discount rate. Know the difference for cost optimization scenarios.' },
  sp: { label: 'Savings Plans', abbr: 'SP', tip: 'Compute Savings Plans: any instance family, region, OS, tenancy — most flexible. EC2 Instance Savings Plans: specific family in a specific region, higher discount. Commitment is $/hour spend.', trap: 'Savings Plans apply automatically to the most expensive usage first. You don\'t need to specify instance types upfront — this is the key advantage over RIs.' },
  spot: { label: 'Spot Instances', abbr: 'Spot', tip: 'Up to 90% discount. Can be interrupted with 2-minute warning. Best for batch processing, stateless apps, CI/CD, big data. Spot Fleets mix instance types for stability.', trap: 'Spot Instances are NOT suitable for workloads that cannot be interrupted. Databases, in-memory caches, and production web servers should use On-Demand or RI.' },
  cw: { label: 'CloudWatch', abbr: 'CW', tip: 'Metrics: 5-minute default, 1-minute detailed monitoring (extra cost). Logs: ingest, retain, query. Alarms: trigger SNS/ASG/EC2 actions. Dashboards. Contributor Insights. Anomaly Detection.', trap: 'CloudWatch does NOT monitor applications inside EC2 by default. Use the CloudWatch Agent to collect memory, disk, and custom application metrics.' },
  ct: { label: 'CloudTrail', abbr: 'CT', tip: 'Records API calls (management events) by default for 90 days. Enable a Trail to send to S3 for longer retention and cross-account aggregation. Data events (S3 object-level) cost extra.', trap: 'CloudTrail records WHO did WHAT. CloudWatch records WHAT is happening NOW (metrics/logs). Often confused on the exam.' },
  ta: { label: 'Trusted Advisor', abbr: 'TA', tip: 'Checks across 5 categories: Cost Optimization, Security, Fault Tolerance, Performance, Service Limits. Basic: 7 core checks free. Business/Enterprise support: all 400+ checks.', trap: 'Trusted Advisor is not real-time monitoring. It provides periodic recommendations. Use AWS Security Hub or Config for real-time compliance.' },
}

export function CostDiagram() {
  const [active, setActive] = useState(null)
  const toggle = (key) => setActive(p => p === key ? null : key)
  const comp = active ? COMPONENTS[active] : null
  const border = 'var(--color-border-emphasis)'
  const surfaceRaised = 'var(--color-surface-raised)'
  const accent = 'var(--color-accent)'
  const accentDim = 'var(--color-accent-dim)'
  const textPrimary = 'var(--color-text-primary)'
  const textSecondary = 'var(--color-text-secondary)'

  const Chip = ({ id, x, y, w = 80, h = 32 }) => {
    const c = COMPONENTS[id]; const isActive = active === id
    return (
      <g onClick={() => toggle(id)} style={{ cursor: 'pointer' }}>
        <rect x={x} y={y} width={w} height={h} rx={6} fill={isActive ? accentDim : surfaceRaised} stroke={isActive ? accent : border} strokeWidth={isActive ? 1.5 : 1} />
        <text x={x + w/2} y={y + h/2 + 1} textAnchor="middle" dominantBaseline="middle" fill={isActive ? accent : textPrimary} fontSize={10} fontFamily="var(--font-mono)" fontWeight={isActive ? 700 : 500}>{c.abbr}</text>
      </g>
    )
  }

  return (
    <div>
      <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ color: accent }}>↓</span> Click any service to see exam notes
      </div>
      <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: 14, marginBottom: 12, overflowX: 'auto' }}>
        <svg viewBox="0 0 560 240" style={{ width: '100%', minWidth: 320, display: 'block' }}>
          <rect x={8} y={8} width={544} height={224} rx={10} fill="none" stroke={border} strokeWidth={1} strokeDasharray="6 3" />
          <text x={18} y={24} fill={textSecondary} fontSize={9} fontFamily="var(--font-mono)" fontWeight={600}>COST & OPERATIONS — SAA-C03 DOMAIN</text>

          {/* Pricing models */}
          <rect x={20} y={32} width={520} height={68} rx={7} fill="rgba(62,207,142,0.05)" stroke="rgba(62,207,142,0.25)" strokeWidth={1} />
          <text x={30} y={46} fill={textSecondary} fontSize={9} fontFamily="var(--font-mono)" fontWeight={600}>PRICING MODELS — discount ↑ · flexibility ↓</text>
          <Chip id="spot" x={60} y={50} w={80} h={30} />
          <Chip id="ri" x={180} y={50} w={80} h={30} />
          <Chip id="sp" x={300} y={50} w={80} h={30} />
          <text x={415} y={60} fill={textSecondary} fontSize={8} fontFamily="var(--font-mono)">On-Demand</text>
          <text x={415} y={72} fill={textSecondary} fontSize={8} fontFamily="var(--font-mono)">(no discount)</text>

          {/* Observability */}
          <rect x={20} y={114} width={520} height={98} rx={7} fill="rgba(91,156,246,0.05)" stroke="rgba(91,156,246,0.25)" strokeWidth={1} />
          <text x={30} y={128} fill={textSecondary} fontSize={9} fontFamily="var(--font-mono)" fontWeight={600}>OBSERVABILITY & GOVERNANCE</text>
          <Chip id="cw" x={50} y={132} w={80} h={30} />
          <Chip id="ct" x={160} y={132} w={80} h={30} />
          <Chip id="ta" x={290} y={132} w={90} h={30} />
          <text x={30} y={182} fill={textSecondary} fontSize={8} fontFamily="var(--font-mono)">CW = metrics/logs/alarms  ·  CT = API audit trail  ·  TA = best practice checks</text>
        </svg>
      </div>
      <div style={{ minHeight: 80, background: 'var(--color-surface)', border: `1px solid ${comp ? 'var(--color-accent-border)' : 'var(--color-border)'}`, borderRadius: 'var(--radius-md)', padding: '12px 14px', transition: 'border-color 200ms ease' }}>
        {!comp && <p style={{ fontSize: 12, color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>← Select a service above to see exam notes and traps</p>}
        {comp && (<>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7 }}>
            <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', padding: '2px 8px', background: 'var(--color-accent-dim)', border: '1px solid var(--color-accent-border)', borderRadius: 20, color: accent }}>{comp.abbr}</span>
            <span style={{ fontSize: 13, fontWeight: 500, color: textPrimary }}>{comp.label}</span>
          </div>
          <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: 8 }}>{comp.tip}</p>
          <div style={{ padding: '6px 10px', background: 'var(--color-warning-dim)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: 'var(--radius-sm)', fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--color-warning)' }}>Exam trap: {comp.trap}</div>
        </>)}
      </div>
    </div>
  )
}
export default CostDiagram
