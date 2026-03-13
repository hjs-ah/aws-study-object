// src/components/diagrams/IAMDiagram.jsx
import { useState } from 'react'

const COMPONENTS = {
  user: { label: 'IAM User', abbr: 'User', tip: 'A long-term identity with static credentials (access key + secret). Avoid for applications — use roles instead. Best practice: MFA enabled, least-privilege policy attached.', trap: 'Never embed IAM user access keys in application code or EC2 user data. Always use roles.' },
  role: { label: 'IAM Role', abbr: 'Role', tip: 'Temporary credentials via STS. Assumed by services (EC2, Lambda), users, or cross-account principals. No long-term credentials — tokens expire automatically.', trap: 'EC2 instance profiles attach one role to an EC2 instance. Lambda, ECS tasks all use execution roles.' },
  policy: { label: 'IAM Policy', abbr: 'Policy', tip: 'JSON document defining Allow/Deny on Actions + Resources. Identity-based policies attach to users/roles. Resource-based policies attach to resources (S3 bucket policy, KMS key policy).', trap: 'Explicit Deny always wins. If any policy denies, the request is denied regardless of allows.' },
  scp: { label: 'Service Control Policy', abbr: 'SCP', tip: 'AWS Organizations guardrails. Set the maximum permissions ceiling for accounts in an OU. SCPs never grant permissions — they only restrict.', trap: 'SCP sets the ceiling; IAM policy sets the floor. BOTH must allow an action for it to succeed.' },
  sts: { label: 'Security Token Service', abbr: 'STS', tip: 'AssumeRole returns temporary credentials (AccessKeyId, SecretAccessKey, SessionToken). Used for cross-account access, federation, and service-to-service calls.', trap: 'STS credentials expire — this is a feature, not a bug. Rotate automatically unlike long-term keys.' },
  cognito: { label: 'Cognito', abbr: 'Cognito', tip: 'User Pools = authentication (sign-up, sign-in, JWT tokens). Identity Pools = exchange tokens for temporary AWS credentials to access AWS resources directly.', trap: 'User Pools ≠ Identity Pools. User Pools authenticate users. Identity Pools authorize AWS resource access.' },
  kms: { label: 'KMS', abbr: 'KMS', tip: 'Managed encryption keys. Customer Managed Keys (CMK) give full control. KMS integrates natively with S3, EBS, RDS, Lambda, SSM.', trap: 'KMS key policy is REQUIRED — even if your IAM policy allows KMS, the key policy must also allow the caller.' },
}

export function IAMDiagram() {
  const [active, setActive] = useState(null)
  const toggle = (key) => setActive((prev) => (prev === key ? null : key))
  const comp = active ? COMPONENTS[active] : null

  const textPrimary = 'var(--color-text-primary)'
  const textSecondary = 'var(--color-text-secondary)'
  const border = 'var(--color-border-emphasis)'
  const surfaceRaised = 'var(--color-surface-raised)'
  const accent = 'var(--color-accent)'
  const accentDim = 'var(--color-accent-dim)'

  const Chip = ({ id, x, y, w = 72, h = 30 }) => {
    const c = COMPONENTS[id]
    const isActive = active === id
    return (
      <g onClick={() => toggle(id)} style={{ cursor: 'pointer' }}>
        <rect x={x} y={y} width={w} height={h} rx={6}
          fill={isActive ? accentDim : surfaceRaised}
          stroke={isActive ? accent : border}
          strokeWidth={isActive ? 1.5 : 1} />
        <text x={x + w / 2} y={y + h / 2 + 1} textAnchor="middle" dominantBaseline="middle"
          fill={isActive ? accent : textPrimary}
          fontSize={10} fontFamily="var(--font-mono)" fontWeight={isActive ? 700 : 500}>
          {c.abbr}
        </text>
      </g>
    )
  }

  const DashedLine = ({ x1, y1, x2, y2, label }) => (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={border} strokeWidth={1} strokeDasharray="4 3" />
      {label && <text x={(x1+x2)/2} y={(y1+y2)/2 - 4} textAnchor="middle"
        fill={textSecondary} fontSize={8} fontFamily="var(--font-mono)">{label}</text>}
    </g>
  )

  return (
    <div>
      <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ color: 'var(--color-accent)' }}>↓</span>
        Click any component to inspect it
      </div>

      <div style={{
        background: 'var(--color-surface)', border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)', padding: '14px', marginBottom: 12, overflowX: 'auto',
      }}>
        <svg viewBox="0 0 560 220" style={{ width: '100%', minWidth: 320, display: 'block' }}>

          {/* Org boundary */}
          <rect x={8} y={8} width={300} height={50} rx={8}
            fill="none" stroke={border} strokeDasharray="5 3" strokeWidth={1} />
          <text x={18} y={22} fill={textSecondary} fontSize={9} fontFamily="var(--font-mono)" fontWeight={600} letterSpacing="0.05em">AWS ORGANIZATIONS</text>
          <Chip id="scp" x={100} y={26} w={60} h={24} />

          {/* IAM core */}
          <rect x={8} y={68} width={300} height={136} rx={8}
            fill="none" stroke={border} strokeDasharray="5 3" strokeWidth={1} />
          <text x={18} y={84} fill={textSecondary} fontSize={9} fontFamily="var(--font-mono)" fontWeight={600} letterSpacing="0.05em">IAM CORE</text>

          <Chip id="user" x={20} y={94} />
          <Chip id="role" x={130} y={94} />
          <Chip id="policy" x={240} y={94} />

          <DashedLine x1={92} y1={109} x2={130} y2={109} label="assumes" />
          <DashedLine x1={202} y1={109} x2={240} y2={109} label="attached" />

          <Chip id="sts" x={75} y={154} w={60} />
          <Chip id="kms" x={175} y={154} w={60} />

          <DashedLine x1={165} y1={109} x2={105} y2={154} />

          {/* Auth services */}
          <rect x={330} y={68} width={220} height={80} rx={8}
            fill="none" stroke={border} strokeDasharray="5 3" strokeWidth={1} />
          <text x={340} y={84} fill={textSecondary} fontSize={9} fontFamily="var(--font-mono)" fontWeight={600} letterSpacing="0.05em">AUTH SERVICES</text>
          <Chip id="cognito" x={380} y={94} w={80} />
          <DashedLine x1={380} y1={109} x2={308} y2={109} label="federates" />

          {/* Hint */}
          <text x={340} y={170} fill={textSecondary} fontSize={9} fontFamily="var(--font-mono)">← click boxes for exam notes</text>
        </svg>
      </div>

      <div style={{
        minHeight: 80, background: 'var(--color-surface)',
        border: `1px solid ${comp ? 'var(--color-accent-border)' : 'var(--color-border)'}`,
        borderRadius: 'var(--radius-md)', padding: '12px 14px', transition: 'border-color 200ms ease',
      }}>
        {!comp && <p style={{ fontSize: 12, color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>← Select a component above to see exam notes and traps</p>}
        {comp && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7 }}>
              <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', padding: '2px 8px', background: 'var(--color-accent-dim)', border: '1px solid var(--color-accent-border)', borderRadius: 20, color: 'var(--color-accent)' }}>{comp.abbr}</span>
              <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-primary)' }}>{comp.label}</span>
            </div>
            <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: 8 }}>{comp.tip}</p>
            <div style={{ padding: '6px 10px', background: 'var(--color-warning-dim)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: 'var(--radius-sm)', fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--color-warning)' }}>
              Exam trap: {comp.trap}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
