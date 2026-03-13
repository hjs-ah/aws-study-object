// src/components/diagrams/VPCDiagram.jsx
// Interactive VPC architecture diagram — click any component to highlight it
// and see a tooltip with exam-relevant detail.

import { useState } from 'react'

const COMPONENTS = {
  igw: {
    label: 'Internet Gateway',
    abbr: 'IGW',
    tip: 'Attaches to the VPC (not a subnet). The route table is what makes a subnet public — a public subnet has a route 0.0.0.0/0 → IGW.',
    trap: 'IGW itself doesn\'t have an AZ — it\'s horizontally scaled and HA by default.',
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
    tip: 'Free VPC endpoint for S3 and DynamoDB. Adds a route to the route table — no NAT Gateway needed. Traffic stays within AWS network. Interface Endpoints (PrivateLink) cost per hour.',
    trap: 'Gateway Endpoints (S3, DynamoDB) = free. Interface Endpoints (everything else) = hourly charge.',
  },
}

export function VPCDiagram() {
  const [active, setActive] = useState(null)

  const toggle = (key) => setActive((prev) => (prev === key ? null : key))

  const comp = active ? COMPONENTS[active] : null

  const Chip = ({ id, x, y, w = 80, h = 32 }) => {
    const c = COMPONENTS[id]
    const isActive = active === id
    return (
      <g
        onClick={() => toggle(id)}
        style={{ cursor: 'pointer' }}
      >
        <rect
          x={x} y={y} width={w} height={h} rx={6}
          fill={isActive ? 'var(--color-accent-dim)' : 'var(--color-surface-raised)'}
          stroke={isActive ? 'var(--color-accent)' : 'var(--color-border-emphasis)'}
          strokeWidth={isActive ? 1.5 : 1}
        />
        <text
          x={x + w / 2} y={y + h / 2 + 1}
          textAnchor="middle" dominantBaseline="middle"
          fill={isActive ? 'var(--color-accent)' : 'var(--color-text-secondary)'}
          fontSize={10} fontFamily="var(--font-mono)" fontWeight={isActive ? 600 : 400}
        >
          {c.abbr}
        </text>
      </g>
    )
  }

  const Label = ({ x, y, text, sub }) => (
    <g>
      <text x={x} y={y} fill="var(--color-text-muted)" fontSize={9}
        fontFamily="var(--font-mono)" fontWeight={500} letterSpacing="0.06em">
        {text.toUpperCase()}
      </text>
      {sub && (
        <text x={x} y={y + 12} fill="var(--color-text-muted)" fontSize={8} fontFamily="var(--font-mono)">
          {sub}
        </text>
      )}
    </g>
  )

  const Arrow = ({ x1, y1, x2, y2, label }) => {
    const mx = (x1 + x2) / 2
    const my = (y1 + y2) / 2
    return (
      <g>
        <defs>
          <marker id="arrowhead" markerWidth="6" markerHeight="4" refX="6" refY="2" orient="auto">
            <polygon points="0 0, 6 2, 0 4" fill="var(--color-border-emphasis)" />
          </marker>
        </defs>
        <line
          x1={x1} y1={y1} x2={x2} y2={y2}
          stroke="var(--color-border-emphasis)" strokeWidth={1} strokeDasharray="4 3"
          markerEnd="url(#arrowhead)"
        />
        {label && (
          <text x={mx} y={my - 4} textAnchor="middle" fill="var(--color-text-muted)"
            fontSize={8} fontFamily="var(--font-mono)">{label}</text>
        )}
      </g>
    )
  }

  return (
    <div>
      {/* Diagram */}
      <div style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        padding: '16px',
        marginBottom: 14,
        overflow: 'hidden',
      }}>
        <svg viewBox="0 0 560 260" style={{ width: '100%', display: 'block' }}>

          {/* VPC boundary */}
          <rect x={8} y={8} width={544} height={244} rx={10}
            fill="none" stroke="var(--color-border)" strokeWidth={1} strokeDasharray="6 3" />
          <Label x={18} y={24} text="VPC" sub="10.0.0.0/16" />

          {/* IGW — above VPC */}
          <Chip id="igw" x={245} y={14} w={70} h={26} />
          <Arrow x1={280} y1={40} x2={280} y2={62} />

          {/* Public subnet */}
          <rect x={20} y={52} width={520} height={68} rx={7}
            fill="rgba(91,156,246,0.04)" stroke="rgba(91,156,246,0.2)" strokeWidth={1} />
          <Label x={30} y={66} text="Public Subnet" sub="10.0.1.0/24 · AZ-a" />

          {/* ALB */}
          <Chip id="alb" x={80} y={74} w={80} h={30} />
          {/* NAT GW */}
          <Chip id="nat" x={230} y={74} w={80} h={30} />
          {/* NACL badge */}
          <Chip id="nacl" x={380} y={74} w={70} h={30} />
          {/* SG badge */}
          <Chip id="sg" x={460} y={74} w={60} h={30} />

          {/* Arrow ALB → EC2 */}
          <Arrow x1={120} y1={124} x2={120} y2={150} />
          {/* Arrow NAT → EC2 area */}
          <Arrow x1={270} y1={124} x2={270} y2={150} />

          {/* Private subnet */}
          <rect x={20} y={140} width={340} height={56} rx={7}
            fill="rgba(62,207,142,0.04)" stroke="rgba(62,207,142,0.2)" strokeWidth={1} />
          <Label x={30} y={154} text="Private Subnet" sub="10.0.2.0/24 · Multi-AZ" />
          <Chip id="ec2" x={120} y={158} w={90} h={28} />
          {/* S3 Endpoint */}
          <Chip id="s3ep" x={240} y={158} w={80} h={28} />

          {/* Arrow EC2 → RDS */}
          <Arrow x1={165} y1={200} x2={165} y2={222} />

          {/* Isolated subnet */}
          <rect x={20} y={210} width={200} height={36} rx={7}
            fill="rgba(240,96,96,0.04)" stroke="rgba(240,96,96,0.18)" strokeWidth={1} />
          <Label x={30} y={223} text="Isolated Subnet" sub="No internet route" />
          <Chip id="rds" x={120} y={218} w={70} h={22} />

          {/* Subnet legend */}
          <g transform="translate(380, 148)">
            {[
              { color: 'rgba(91,156,246,0.4)', label: 'Public' },
              { color: 'rgba(62,207,142,0.4)', label: 'Private' },
              { color: 'rgba(240,96,96,0.35)', label: 'Isolated' },
            ].map(({ color, label }, i) => (
              <g key={label} transform={`translate(0, ${i * 18})`}>
                <rect width={10} height={10} rx={2} fill={color} />
                <text x={14} y={9} fill="var(--color-text-muted)" fontSize={9} fontFamily="var(--font-mono)">{label}</text>
              </g>
            ))}
            <text x={0} y={62} fill="var(--color-text-muted)" fontSize={8} fontFamily="var(--font-mono)">
              Click a component
            </text>
            <text x={0} y={73} fill="var(--color-text-muted)" fontSize={8} fontFamily="var(--font-mono)">
              to inspect it →
            </text>
          </g>

        </svg>
      </div>

      {/* Tooltip panel */}
      <div style={{
        minHeight: 90,
        background: 'var(--color-surface)',
        border: `1px solid ${comp ? 'var(--color-accent-border)' : 'var(--color-border)'}`,
        borderRadius: 'var(--radius-md)',
        padding: '14px 16px',
        transition: 'border-color 200ms ease',
      }}>
        {!comp && (
          <p style={{ fontSize: 12, color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
            ← Click any component in the diagram to see exam notes
          </p>
        )}
        {comp && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span style={{
                fontSize: 10, fontFamily: 'var(--font-mono)', padding: '2px 8px',
                background: 'var(--color-accent-dim)', border: '1px solid var(--color-accent-border)',
                borderRadius: 20, color: 'var(--color-accent)',
              }}>{comp.abbr}</span>
              <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-primary)' }}>
                {comp.label}
              </span>
            </div>
            <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: 8 }}>
              {comp.tip}
            </p>
            <div style={{
              padding: '6px 10px',
              background: 'var(--color-warning-dim)',
              border: '1px solid rgba(245,158,11,0.25)',
              borderRadius: 'var(--radius-sm)',
              fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--color-warning)',
            }}>
              Exam trap: {comp.trap}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
