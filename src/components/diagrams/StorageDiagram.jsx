// src/components/diagrams/StorageDiagram.jsx — Structural diagram
import { useState } from 'react'

const COMPONENTS = {
  s3std: { label: 'S3 Standard', abbr: 'STD', tip: 'Default class. 99.999999999% durability (11 9s). Millisecond retrieval. No minimum storage duration. Best for frequently accessed data.', trap: 'S3 durability ≠ availability. Durability = data won\'t be lost. Availability = data is accessible. Standard is 99.99% available.' },
  s3ia: { label: 'S3 Standard-IA', abbr: 'S-IA', tip: 'Infrequent Access — lower storage cost, retrieval fee applies. 30-day minimum storage. Same 11 9s durability. Good for backups and DR.', trap: 'IA has a retrieval fee. If data is accessed frequently, Standard is cheaper. Exam tests this cost tradeoff.' },
  glacier: { label: 'Glacier Flexible', abbr: 'GFX', tip: 'Retrieval: Expedited 1-5 min, Standard 3-5 hr, Bulk 5-12 hr. Cheapest for archives. 90-day minimum storage. Vault Lock for compliance.', trap: 'Glacier Flexible ≠ Glacier Instant. Instant = milliseconds. Flexible = hours. Know both for the exam.' },
  ebs: { label: 'EBS Volumes', abbr: 'EBS', tip: 'gp3 = default (3000 IOPS, 125 MB/s base, 16TB). io2 = 64,000 IOPS, SANs. st1 = throughput HDD (MapReduce). sc1 = cold HDD (archives). Tied to single AZ.', trap: 'EBS cannot be attached to instances in a different AZ. Snapshots are cross-region capable. gp2 vs gp3: gp3 is cheaper and configurable.' },
  efs: { label: 'EFS', abbr: 'EFS', tip: 'NFS v4 file system mountable by many EC2 instances simultaneously across AZs. Auto-scales. Two modes: Regional (multi-AZ) and One Zone (cheaper). Lifecycle moves cold files to IA.', trap: 'EFS is for Linux only (NFS). For Windows shared storage use FSx for Windows File Server. EFS costs ~3× more than EBS per GB.' },
  sg: { label: 'Storage Gateway', abbr: 'S-GW', tip: 'Hybrid cloud storage bridge. File Gateway: NFS/SMB access to S3. Volume Gateway: iSCSI block storage backed by S3. Tape Gateway: virtual tape library to Glacier.', trap: 'Storage Gateway runs on-premises (VM or hardware appliance). It\'s not an AWS-hosted service — it\'s for extending on-prem storage to AWS.' },
}

export function StorageDiagram() {
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
        <svg viewBox="0 0 560 250" style={{ width: '100%', minWidth: 320, display: 'block' }}>
          <rect x={8} y={8} width={544} height={234} rx={10} fill="none" stroke={border} strokeWidth={1} strokeDasharray="6 3" />
          <text x={18} y={24} fill={textSecondary} fontSize={9} fontFamily="var(--font-mono)" fontWeight={600}>STORAGE — SAA-C03 DOMAIN</text>

          {/* S3 Object storage tier */}
          <rect x={20} y={32} width={520} height={68} rx={7} fill="rgba(91,156,246,0.05)" stroke="rgba(91,156,246,0.25)" strokeWidth={1} />
          <text x={30} y={46} fill={textSecondary} fontSize={9} fontFamily="var(--font-mono)" fontWeight={600}>S3 OBJECT STORAGE — HOT → COLD</text>
          <Chip id="s3std" x={60} y={52} w={80} h={30} />
          <Chip id="s3ia" x={175} y={52} w={70} h={30} />
          <Chip id="glacier" x={278} y={52} w={72} h={30} />
          {/* Arrow hot to cold */}
          <line x1={140} y1={67} x2={173} y2={67} stroke={border} strokeWidth={1} markerEnd="url(#sarr)" />
          <line x1={245} y1={67} x2={276} y2={67} stroke={border} strokeWidth={1} markerEnd="url(#sarr)" />
          <defs><marker id="sarr" markerWidth="6" markerHeight="4" refX="6" refY="2" orient="auto"><polygon points="0 0,6 2,0 4" fill="var(--color-border-emphasis)" /></marker></defs>
          <text x={420} y={62} fill={textSecondary} fontSize={8} fontFamily="var(--font-mono)">cost ↓ · retrieval ↑</text>

          {/* Block storage */}
          <rect x={20} y={114} width={250} height={56} rx={7} fill="rgba(62,207,142,0.05)" stroke="rgba(62,207,142,0.25)" strokeWidth={1} />
          <text x={30} y={128} fill={textSecondary} fontSize={9} fontFamily="var(--font-mono)" fontWeight={600}>BLOCK STORAGE</text>
          <Chip id="ebs" x={80} y={130} w={80} h={30} />

          {/* File storage */}
          <rect x={290} y={114} width={250} height={56} rx={7} fill="rgba(245,158,11,0.05)" stroke="rgba(245,158,11,0.25)" strokeWidth={1} />
          <text x={300} y={128} fill={textSecondary} fontSize={9} fontFamily="var(--font-mono)" fontWeight={600}>FILE STORAGE</text>
          <Chip id="efs" x={360} y={130} w={70} h={30} />

          {/* Hybrid */}
          <rect x={20} y={184} width={520} height={46} rx={7} fill="rgba(240,96,96,0.04)" stroke="rgba(240,96,96,0.2)" strokeWidth={1} />
          <text x={30} y={198} fill={textSecondary} fontSize={9} fontFamily="var(--font-mono)" fontWeight={600}>HYBRID — ON-PREMISES TO AWS</text>
          <Chip id="sg" x={210} y={192} w={90} h={28} />
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
export default StorageDiagram
