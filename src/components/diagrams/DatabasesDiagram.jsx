// src/components/diagrams/DatabasesDiagram.jsx — Structural diagram
import { useState } from 'react'

const COMPONENTS = {
  rds: { label: 'RDS Multi-AZ', abbr: 'RDS', tip: 'Synchronous replication to a standby instance. Automatic failover in 1-2 min. Standby is NOT readable or accessible. Supports MySQL, PostgreSQL, Oracle, SQL Server, MariaDB.', trap: 'Multi-AZ standby ≠ Read Replica. Standby = HA/failover only. Read Replica = async, readable, used for scaling reads.' },
  aurora: { label: 'Aurora', abbr: 'Aurora', tip: '6 copies of data across 3 AZs automatically. 15 Aurora Replicas. Up to 5× faster than MySQL. Aurora Global spans regions with <1s replication. Serverless v2 for variable workloads.', trap: 'Aurora does NOT use Multi-AZ like RDS. Aurora stores 6 copies across 3 AZs by default — this is built into the storage layer, not a separate standby.' },
  dynamo: { label: 'DynamoDB', abbr: 'DDB', tip: 'NoSQL key-value and document. On-Demand or Provisioned capacity. Global Tables for multi-region active-active. Streams for change data capture. DAX for microsecond caching.', trap: 'DynamoDB throttling: if you exceed provisioned RCU/WCU you get ProvisionedThroughputExceededException. Use On-Demand mode to avoid this complexity.' },
  elasticache: { label: 'ElastiCache', abbr: 'Cache', tip: 'Redis: persistence, pub/sub, sorted sets, geospatial, replication groups. Memcached: simple, multi-threaded, no persistence. Redis preferred for most use cases.', trap: 'ElastiCache is not persistent by default (Memcached). Redis can persist to disk. Don\'t use Memcached if you need data durability or replication.' },
  redshift: { label: 'Redshift', abbr: 'RS', tip: 'OLAP columnar data warehouse. Massively parallel processing (MPP). RA3 nodes decouple compute from storage. Redshift Spectrum queries S3 directly without loading data.', trap: 'Redshift is OLAP (analytics). RDS is OLTP (transactions). Never use Redshift for transactional workloads — it\'s not designed for single-row inserts/updates.' },
  dax: { label: 'DynamoDB DAX', abbr: 'DAX', tip: 'In-memory cache specifically for DynamoDB. Drop-in compatible with DynamoDB API. Reduces read latency from milliseconds to microseconds. Only for DynamoDB.', trap: 'DAX is ONLY for DynamoDB. ElastiCache can cache any database. Use DAX when DynamoDB reads are the bottleneck.' },
}

export function DatabasesDiagram() {
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
        <svg viewBox="0 0 560 260" style={{ width: '100%', minWidth: 320, display: 'block' }}>
          <rect x={8} y={8} width={544} height={244} rx={10} fill="none" stroke={border} strokeWidth={1} strokeDasharray="6 3" />
          <text x={18} y={24} fill={textSecondary} fontSize={9} fontFamily="var(--font-mono)" fontWeight={600}>DATABASES — SAA-C03 DOMAIN</text>

          {/* Relational */}
          <rect x={20} y={32} width={340} height={68} rx={7} fill="rgba(91,156,246,0.05)" stroke="rgba(91,156,246,0.25)" strokeWidth={1} />
          <text x={30} y={46} fill={textSecondary} fontSize={9} fontFamily="var(--font-mono)" fontWeight={600}>RELATIONAL — OLTP</text>
          <Chip id="rds" x={50} y={50} w={80} h={30} />
          <Chip id="aurora" x={170} y={50} w={80} h={30} />

          {/* Analytics */}
          <rect x={375} y={32} width={165} height={68} rx={7} fill="rgba(83,74,183,0.05)" stroke="rgba(83,74,183,0.25)" strokeWidth={1} />
          <text x={385} y={46} fill={textSecondary} fontSize={9} fontFamily="var(--font-mono)" fontWeight={600}>ANALYTICS — OLAP</text>
          <Chip id="redshift" x={415} y={50} w={85} h={30} />

          {/* NoSQL */}
          <rect x={20} y={114} width={340} height={68} rx={7} fill="rgba(62,207,142,0.05)" stroke="rgba(62,207,142,0.25)" strokeWidth={1} />
          <text x={30} y={128} fill={textSecondary} fontSize={9} fontFamily="var(--font-mono)" fontWeight={600}>NOSQL — KEY/VALUE · DOCUMENT</text>
          <Chip id="dynamo" x={50} y={132} w={80} h={30} />
          <Chip id="dax" x={160} y={132} w={70} h={30} />

          {/* Caching */}
          <rect x={375} y={114} width={165} height={68} rx={7} fill="rgba(245,158,11,0.05)" stroke="rgba(245,158,11,0.25)" strokeWidth={1} />
          <text x={385} y={128} fill={textSecondary} fontSize={9} fontFamily="var(--font-mono)" fontWeight={600}>IN-MEMORY CACHE</text>
          <Chip id="elasticache" x={395} y={132} w={85} h={30} />

          {/* Decision guide */}
          <rect x={20} y={196} width={520} height={40} rx={7} fill="var(--color-surface-raised)" stroke={border} strokeWidth={1} />
          <text x={30} y={212} fill={textSecondary} fontSize={9} fontFamily="var(--font-mono)">OLTP → RDS/Aurora  ·  NoSQL/scale → DynamoDB  ·  Analytics → Redshift  ·  Caching → ElastiCache</text>
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
export default DatabasesDiagram
