// src/components/diagrams/ComputeDiagram.jsx — Structural diagram
import { useState } from 'react'

const COMPONENTS = {
  ec2: { label: 'EC2 Instance Types', abbr: 'EC2', tip: 'Families: T (burstable credits), M (general purpose), C (compute-optimized), R (memory-optimized), I (storage-optimized), P/G (GPU). Match family to workload type on the exam.', trap: 'T-series credits: if credits run out the instance throttles to baseline CPU. Enable Unlimited mode to avoid this — but costs extra.' },
  lambda: { label: 'Lambda', abbr: 'λ', tip: 'Max 15-min timeout, 10GB memory, 512MB–10GB /tmp storage. Billed per 1ms. Concurrency: 1000 per region default. Package code in Layers for reuse.', trap: 'Lambda cannot run longer than 15 minutes. For longer tasks use ECS, Batch, or Step Functions.' },
  asg: { label: 'Auto Scaling Group', abbr: 'ASG', tip: 'Min/desired/max. Target Tracking = simplest policy (e.g. keep CPU at 50%). Step Scaling = respond to alarm thresholds. Predictive Scaling = ML-based forecasting.', trap: 'Scale-out adds instances (horizontal). Scale-up means bigger instance (vertical). Exam usually asks about horizontal scaling.' },
  ecs: { label: 'ECS / Fargate', abbr: 'ECS', tip: 'EC2 launch type: you manage cluster nodes. Fargate: AWS manages infrastructure. Task Definition defines container specs. Service maintains desired task count.', trap: 'ECS ≠ EKS. ECS is AWS-native; EKS is managed Kubernetes. Use EKS only if you need Kubernetes portability.' },
  pg: { label: 'Placement Groups', abbr: 'PG', tip: 'Cluster: same rack, lowest latency, single AZ. Spread: max 7 instances per AZ across distinct hardware. Partition: separate racks per partition, for Hadoop/Cassandra.', trap: 'Cluster placement groups sacrifice redundancy for speed. A single hardware failure can take down all instances.' },
  eb: { label: 'Elastic Beanstalk', abbr: 'EB', tip: 'PaaS — upload code, AWS manages EC2/ELB/ASG/RDS. You still have full access to underlying resources. Supports rolling, blue/green, and immutable deployments.', trap: 'Beanstalk is NOT serverless. It provisions EC2 instances. Lambda is the serverless compute choice.' },
}

export function ComputeDiagram() {
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
          {/* Containers */}
          <rect x={8} y={8} width={544} height={224} rx={10} fill="none" stroke={border} strokeWidth={1} strokeDasharray="6 3" />
          <text x={18} y={24} fill={textSecondary} fontSize={9} fontFamily="var(--font-mono)" fontWeight={600}>COMPUTE — SAA-C03 DOMAIN</text>

          {/* Serverless tier */}
          <rect x={20} y={32} width={520} height={52} rx={7} fill="rgba(91,156,246,0.05)" stroke="rgba(91,156,246,0.25)" strokeWidth={1} />
          <text x={30} y={46} fill={textSecondary} fontSize={9} fontFamily="var(--font-mono)" fontWeight={600}>SERVERLESS</text>
          <Chip id="lambda" x={130} y={40} w={80} h={28} />
          <Chip id="eb" x={260} y={40} w={90} h={28} />

          {/* Container tier */}
          <rect x={20} y={96} width={520} height={52} rx={7} fill="rgba(62,207,142,0.05)" stroke="rgba(62,207,142,0.25)" strokeWidth={1} />
          <text x={30} y={110} fill={textSecondary} fontSize={9} fontFamily="var(--font-mono)" fontWeight={600}>CONTAINERS</text>
          <Chip id="ecs" x={130} y={104} w={90} h={28} />

          {/* EC2 tier */}
          <rect x={20} y={160} width={520} height={60} rx={7} fill="rgba(245,158,11,0.05)" stroke="rgba(245,158,11,0.25)" strokeWidth={1} />
          <text x={30} y={174} fill={textSecondary} fontSize={9} fontFamily="var(--font-mono)" fontWeight={600}>EC2 — VIRTUAL MACHINES</text>
          <Chip id="ec2" x={80} y={172} w={90} h={32} />
          <Chip id="asg" x={200} y={172} w={80} h={32} />
          <Chip id="pg" x={310} y={172} w={90} h={32} />
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
export default ComputeDiagram
