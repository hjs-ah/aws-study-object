// src/components/diagrams/MessagingDiagram.jsx — Structural diagram
import { useState } from 'react'

const COMPONENTS = {
  sqs: { label: 'SQS Standard', abbr: 'SQS', tip: 'At-least-once delivery. Best-effort ordering. Nearly unlimited throughput. Visibility timeout hides a message while being processed. DLQ captures failed messages after max retries.', trap: 'SQS Standard can deliver messages more than once (at-least-once). If your app cannot handle duplicates, use SQS FIFO.' },
  fifo: { label: 'SQS FIFO', abbr: 'FIFO', tip: 'Exactly-once processing. Strict ordering within message group. 300 TPS (3,000 with batching, 30,000 with high throughput). Message Group ID for ordering. Deduplication window: 5 min.', trap: 'FIFO throughput is limited. At 300 TPS base, FIFO is not suitable for very high-volume workloads that standard queues handle easily.' },
  sns: { label: 'SNS', abbr: 'SNS', tip: 'Pub/Sub. One message → multiple subscribers simultaneously. Fan-out pattern: SNS → multiple SQS queues. Supports HTTP, Lambda, SQS, Email, SMS, mobile push as subscribers.', trap: 'SNS does not store messages. If a subscriber is down, the message is lost (unless using SQS as a subscriber for durability).' },
  eb: { label: 'EventBridge', abbr: 'EB', tip: 'Formerly CloudWatch Events. Ingests events from 200+ AWS services and SaaS apps. Rules filter and route events to 20+ targets. Event buses for custom events. Schema registry.', trap: 'EventBridge has a 24-hour retry period. For guaranteed delivery, pair with SQS as a target. EventBridge is not a queue — it\'s an event router.' },
  kinesis: { label: 'Kinesis Data Streams', abbr: 'KDS', tip: 'Real-time streaming. Shards are the base unit (1 MB/s in, 2 MB/s out per shard). Retention: 24hr default, up to 365 days. Multiple consumers can read the same data.', trap: 'Kinesis requires you to manage shard capacity. Hot shards cause throttling. Use partition keys that distribute data evenly.' },
  firehose: { label: 'Kinesis Firehose', abbr: 'KFH', tip: 'Near-real-time delivery to S3, Redshift, OpenSearch, Splunk. Buffers data (buffer size or interval). Transforms with Lambda. No consumer code needed — fully managed.', trap: 'Firehose is NOT real-time — it has a buffer delay (60 seconds minimum). For real-time processing, use Kinesis Data Streams with a consumer application.' },
}

export function MessagingDiagram() {
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
          <text x={18} y={24} fill={textSecondary} fontSize={9} fontFamily="var(--font-mono)" fontWeight={600}>MESSAGING — SAA-C03 DOMAIN</text>

          {/* Queue-based */}
          <rect x={20} y={32} width={340} height={68} rx={7} fill="rgba(91,156,246,0.05)" stroke="rgba(91,156,246,0.25)" strokeWidth={1} />
          <text x={30} y={46} fill={textSecondary} fontSize={9} fontFamily="var(--font-mono)" fontWeight={600}>QUEUES — DECOUPLING / PULL</text>
          <Chip id="sqs" x={60} y={50} w={80} h={30} />
          <Chip id="fifo" x={180} y={50} w={80} h={30} />

          {/* Pub/sub */}
          <rect x={375} y={32} width={165} height={68} rx={7} fill="rgba(62,207,142,0.05)" stroke="rgba(62,207,142,0.25)" strokeWidth={1} />
          <text x={385} y={46} fill={textSecondary} fontSize={9} fontFamily="var(--font-mono)" fontWeight={600}>PUB/SUB — PUSH</text>
          <Chip id="sns" x={405} y={50} w={80} h={30} />

          {/* Event routing */}
          <rect x={20} y={114} width={165} height={68} rx={7} fill="rgba(83,74,183,0.05)" stroke="rgba(83,74,183,0.25)" strokeWidth={1} />
          <text x={30} y={128} fill={textSecondary} fontSize={9} fontFamily="var(--font-mono)" fontWeight={600}>EVENT ROUTING</text>
          <Chip id="eb" x={50} y={132} w={80} h={30} />

          {/* Streaming */}
          <rect x={200} y={114} width={340} height={68} rx={7} fill="rgba(245,158,11,0.05)" stroke="rgba(245,158,11,0.25)" strokeWidth={1} />
          <text x={210} y={128} fill={textSecondary} fontSize={9} fontFamily="var(--font-mono)" fontWeight={600}>STREAMING — REAL-TIME DATA</text>
          <Chip id="kinesis" x={230} y={132} w={80} h={30} />
          <Chip id="firehose" x={370} y={132} w={80} h={30} />
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
export default MessagingDiagram
