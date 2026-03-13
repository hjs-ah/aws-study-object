// src/components/diagrams/VPCDiagram.jsx
// Interactive VPC architecture diagram. Click any component for exam notes.

import { useState } from 'react'

const COMPONENTS = {
  igw: {
    label: 'Internet Gateway',
    abbr: 'IGW',
    tip: 'Attaches to the VPC (not a subnet). The route table is what makes a subnet public — a public subnet has a route 0.0.0.0/0 → IGW.',
    trap: "IGW itself doesn't have an AZ — it's horizontally scaled and HA by default.",
  },
  alb: {
    label: 'Application Load Balancer',
    abbr: 'ALB',
    tip: 'Lives in the public subnet. Layer 7 (HTTP/HTTPS). Routes to EC2 ASG in private subnet via Security Group rules. Use NLB instead for TCP/UDP or static IPs.',
    trap: 'ALB health checks use HTTP/HTTPS. NLB uses TCP. Different failure detection behavior.',
  },
  nat: {
    label: 'NAT Gateway',
    abbr: 'NAT GW',
    tip: 'Must be placed in the PUBLIC subnet. Private subnet route table points 0.0.0.0/0 → NAT GW. Allows outbound internet for private instances; blocks all inbound.',
    trap: 'NAT Gateway in the PRIVATE subnet is the #1 exam trap. Always public subnet.',
  },
  ec2: {
    label: 'EC2 Auto Scaling Group',
    abbr: 'EC2 ASG',
    tip: 'Application servers in private subnet. No direct internet access. Reach internet via NAT GW. Accept traffic only from ALB Security Group.',
    trap: 'Private subnet = can reach internet via NAT. Isolated subnet = no internet at all.',
  },
  rds: {
    label: 'RDS Multi-AZ',
    abbr: 'RDS',
    tip: 'In an isolated subnet with no route to the internet. Multi-AZ = synchronous standby in another AZ for automatic failover. Standby is NOT readable.',
    trap: 'Multi-AZ standby ≠ Read Replica. Standby = HA. Read Replica = read scaling (async).',
  },
  sg: {
    label: 'Security Groups',
    abbr: 'SG',
    tip: 'Stateful — return traffic automatically allowed. Allow-only rules (no deny). Applied at the instance/ENI level. Reference other SGs by ID for tier-to-tier rules.',
    trap: 'Security Groups CANNOT deny — only allow. Use NACLs to block specific IPs.',
  },
  nacl: {
    label: 'Network ACL',
    abbr: 'NACL',
    tip: 'Stateless — must explicitly allow both inbound AND outbound. Applied at subnet level. Supports ALLOW and DENY rules. Rules evaluated in order by rule number.',
    trap: 'NACLs are stateless: if you allow inbound port 80, you must also allow outbound ephemeral ports (1024–65535) for the response.',
  },
  s3ep: {
    label: 'S3 Gateway Endpoint',
    abbr: 'S3 EP',
    tip: 'Free VPC endpoint for S3 and DynamoDB. Adds a route to the route table — no NAT Gateway needed. Traffic stays within AWS network.',
    trap: 'Gateway Endpoints (S3, DynamoDB) = free. Interface Endpoints (everything else) = hourly charge.',
  },
}

export function VPCDiagram() {
  const [active, setActive] = useState(null)
  const toggle = (key) => setActive((prev) => (prev === key ? null : key))
  const comp = active ? COMPONENTS[active] : null

  // Use CSS custom properties so colors respond to theme
  const textPrimary = 'var(--color-text-primary)'
  const textSecondary = 'var(--color-text-secondary)'
  const textMuted = 'var(--color-text-muted)'
  const border = 'var(--color-border-emphasis)'
  const surfaceRaised = 'var(--color-surface-raised)'
  const accent = 'var(--color-accent)'
  const accentDim = 'var(--color-accent-dim)'

  const Chip = ({ id, x, y, w = 80, h = 32 }) => {
    const c = COMPONENTS[id]
    const isActive = active === id
    return (
      <g onClick={() => toggle(id)} style={{ cursor: 'pointer' }}>
        <rect x={x} y={y} width={w} height={h} rx={6}
          fill={isActive ? accentDim : surfaceRaised}
          stroke={isActive ? accent : border}
          strokeWidth={isActive ? 1.5 : 1} />
        <text x={x + w / 2} y={y + h / 2 + 1}
          textAnchor="middle" dominantBaseline="middle"
          fill={isActive ? accent : textPrimary}
          fontSize={10} fontFamily="var(--font-mono)" fontWeight={isActive ? 700 : 500}>
          {c.abbr}
        </text>
      </g>
    )
  }

  const Arrow = ({ x1, y1, x2, y2 }) => (
    <g>
      <defs>
        <marker id="arr" markerWidth="6" markerHeight="4" refX="6" refY="2" orient="auto">
          <polygon points="0 0, 6 2, 0 4" fill={border} />
        </marker>
      </defs>
      <line x1={x1} y1={y1} x2={x2} y2={y2}
        stroke={border} strokeWidth={1} strokeDasharray="4 3"
        markerEnd="url(#arr)" />
    </g>
  )

  return (
    <div>
      {/* Instruction hint */}
      <div style={{
        fontSize: 11, fontFamily: 'var(--font-mono)',
        color: 'var(--color-text-muted)',
        marginBottom: 8,
        display: 'flex', alignItems: 'center', gap: 6,
      }}>
        <span style={{ color: 'var(--color-accent)' }}>↓</span>
        Click any component in the diagram to inspect it
      </div>

      <div style={{
        background: 'var(--color-surface)', border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)', padding: '14px', marginBottom: 12,
        overflowX: 'auto',
      }}>
        <svg viewBox="0 0 560 260" style={{ width: '100%', minWidth: 320, display: 'block' }}>

          {/* VPC boundary */}
          <rect x={8} y={8} width={544} height={244} rx={10}
            fill="none" stroke={border} strokeWidth={1} strokeDasharray="6 3" />
          <text x={18} y={24} fill={textSecondary} fontSize={9}
            fontFamily="var(--font-mono)" fontWeight={600} letterSpacing="0.05em">VPC · 10.0.0.0/16</text>

          {/* IGW */}
          <Chip id="igw" x={245} y={14} w={70} h={26} />
          <Arrow x1={280} y1={40} x2={280} y2={62} />

          {/* Public subnet */}
          <rect x={20} y={52} width={520} height={68} rx={7}
            fill="rgba(91,156,246,0.06)" stroke="rgba(91,156,246,0.3)" strokeWidth={1} />
          <text x={30} y={66} fill={textSecondary} fontSize={9}
            fontFamily="var(--font-mono)" fontWeight={600}>PUBLIC SUBNET · 10.0.1.0/24 · AZ-a</text>

          <Chip id="alb" x={80} y={74} w={80} h={30} />
          <Chip id="nat" x={230} y={74} w={80} h={30} />
          <Chip id="nacl" x={380} y={74} w={70} h={30} />
          <Chip id="sg" x={460} y={74} w={60} h={30} />

          <Arrow x1={120} y1={124} x2={120} y2={150} />
          <Arrow x1={270} y1={124} x2={270} y2={150} />

          {/* Private subnet */}
          <rect x={20} y={140} width={340} height={56} rx={7}
            fill="rgba(62,207,142,0.05)" stroke="rgba(62,207,142,0.3)" strokeWidth={1} />
          <text x={30} y={154} fill={textSecondary} fontSize={9}
            fontFamily="var(--font-mono)" fontWeight={600}>PRIVATE SUBNET · 10.0.2.0/24 · Multi-AZ</text>
          <Chip id="ec2" x={120} y={158} w={90} h={28} />
          <Chip id="s3ep" x={240} y={158} w={80} h={28} />

          <Arrow x1={165} y1={200} x2={165} y2={222} />

          {/* Isolated subnet */}
          <rect x={20} y={210} width={200} height={36} rx={7}
            fill="rgba(240,96,96,0.05)" stroke="rgba(240,96,96,0.3)" strokeWidth={1} />
          <text x={30} y={223} fill={textSecondary} fontSize={9}
            fontFamily="var(--font-mono)" fontWeight={600}>ISOLATED · No internet route</text>
          <Chip id="rds" x={120} y={218} w={70} h={22} />

          {/* Legend */}
          <g transform="translate(382, 150)">
            {[
              { color: 'rgba(91,156,246,0.5)', label: 'Public' },
              { color: 'rgba(62,207,142,0.5)', label: 'Private' },
              { color: 'rgba(240,96,96,0.45)', label: 'Isolated' },
            ].map(({ color, label }, i) => (
              <g key={label} transform={`translate(0,${i * 18})`}>
                <rect width={10} height={10} rx={2} fill={color} />
                <text x={14} y={9} fill={textSecondary} fontSize={9} fontFamily="var(--font-mono)">{label}</text>
              </g>
            ))}
          </g>
        </svg>
      </div>

      {/* Tooltip panel */}
      <div style={{
        minHeight: 80,
        background: 'var(--color-surface)',
        border: `1px solid ${comp ? 'var(--color-accent-border)' : 'var(--color-border)'}`,
        borderRadius: 'var(--radius-md)', padding: '12px 14px',
        transition: 'border-color 200ms ease',
      }}>
        {!comp && (
          <p style={{ fontSize: 12, color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
            ← Select a component above to see exam notes and traps
          </p>
        )}
        {comp && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7 }}>
              <span style={{
                fontSize: 10, fontFamily: 'var(--font-mono)', padding: '2px 8px',
                background: 'var(--color-accent-dim)', border: '1px solid var(--color-accent-border)',
                borderRadius: 20, color: 'var(--color-accent)',
              }}>{comp.abbr}</span>
              <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-primary)' }}>{comp.label}</span>
            </div>
            <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: 8 }}>{comp.tip}</p>
            <div style={{
              padding: '6px 10px',
              background: 'var(--color-warning-dim)', border: '1px solid rgba(245,158,11,0.25)',
              borderRadius: 'var(--radius-sm)', fontSize: 11, fontFamily: 'var(--font-mono)',
              color: 'var(--color-warning)',
            }}>
              Exam trap: {comp.trap}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
