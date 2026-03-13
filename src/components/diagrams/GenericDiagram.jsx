// src/components/diagrams/GenericDiagram.jsx
// Used for domains without a custom interactive SVG diagram yet.
// Shows topic chips with a Notion CMS status indicator.

import { useState, useEffect } from 'react'

const DOMAIN_TOPICS = {
  compute:   ['EC2 Types', 'Spot vs Reserved', 'Auto Scaling', 'Lambda', 'ECS Fargate', 'EKS', 'Placement Groups', 'Beanstalk'],
  storage:   ['S3 Storage Classes', 'Lifecycle Policies', 'EBS Types', 'EFS', 'Glacier', 'Storage Gateway', 'S3 Transfer Accel'],
  databases: ['RDS Multi-AZ', 'Read Replicas', 'Aurora', 'DynamoDB', 'ElastiCache Redis', 'DAX', 'Redshift'],
  ha:        ['ALB vs NLB vs GLB', 'ASG', 'Route 53 Routing', 'CloudFront', 'DR Strategies', 'Global Accelerator'],
  messaging: ['SQS Standard', 'SQS FIFO', 'SNS Fan-Out', 'EventBridge', 'Kinesis Streams', 'Kinesis Firehose'],
  cost:      ['Reserved Instances', 'Savings Plans', 'Spot', 'CloudWatch', 'CloudTrail', 'Cost Explorer', 'Trusted Advisor'],
}

// Notion connection status: checks env via a simple flag from the API
function NotionBadge({ domain }) {
  const [status, setStatus] = useState('checking') // 'checking' | 'live' | 'seed' | 'none'

  useEffect(() => {
    // Ping the content API to check Notion status for this domain
    fetch(`/api/content?domain=${domain.slug}&type=concept`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) { setStatus('none'); return }
        if (data.source === 'notion') setStatus('live')
        else if (data.notionConfigured) setStatus('seed')
        else setStatus('none')
      })
      .catch(() => setStatus('none'))
  }, [domain.slug])

  const configs = {
    checking: { dot: '#888', label: 'Checking Notion…',    bg: 'rgba(100,100,100,0.08)', border: 'rgba(100,100,100,0.2)' },
    live:     { dot: '#3ecf8e', label: 'Notion live',       bg: 'rgba(62,207,142,0.1)',   border: 'rgba(62,207,142,0.3)' },
    seed:     { dot: '#f59e0b', label: 'Seed data',         bg: 'rgba(245,158,11,0.1)',   border: 'rgba(245,158,11,0.3)' },
    none:     { dot: '#888',    label: 'Notion not set up', bg: 'rgba(100,100,100,0.06)', border: 'rgba(100,100,100,0.15)' },
  }
  const { dot, label, bg, border } = configs[status]

  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '4px 10px', borderRadius: 20, fontSize: 10,
      background: bg, border: `1px solid ${border}`,
      fontFamily: 'var(--font-mono)', color: 'var(--color-text-secondary)',
    }}>
      <span style={{
        width: 6, height: 6, borderRadius: '50%', background: dot, flexShrink: 0,
        ...(status === 'live' ? { animation: 'pulse 2s ease-in-out infinite' } : {}),
      }} />
      {label}
    </div>
  )
}

export function GenericDiagram({ domain }) {
  const topics = DOMAIN_TOPICS[domain.slug] ?? []

  return (
    <div>
      {/* Instruction hint */}
      <div style={{
        fontSize: 11, fontFamily: 'var(--font-mono)',
        color: 'var(--color-text-muted)', marginBottom: 8,
        display: 'flex', alignItems: 'center', gap: 6,
      }}>
        <span style={{ color: 'var(--color-accent)' }}>↓</span>
        Tap any topic chip below to see its connection to the exam
      </div>

      {/* Main diagram area */}
      <div style={{
        background: 'var(--color-surface)', border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)', padding: '16px 20px', marginBottom: 14,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-primary)' }}>
            {domain.title} — Core Topics
          </span>
          <NotionBadge domain={domain} />
        </div>

        {/* Topic chips grid */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
          {topics.map((topic) => (
            <TopicChip key={topic} topic={topic} domainSlug={domain.slug} />
          ))}
        </div>

        {/* Notion CMS hint */}
        <div style={{
          marginTop: 14, padding: '10px 12px',
          background: 'var(--color-surface-raised)', border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-sm)', fontSize: 11, fontFamily: 'var(--font-mono)',
          color: 'var(--color-text-muted)', lineHeight: 1.6,
        }}>
          <span style={{ color: 'var(--color-info)' }}>ℹ </span>
          Add concept-type rows to Notion with Domain = <strong style={{ color: 'var(--color-text-secondary)' }}>{domain.slug}</strong> to power this diagram from your own notes.
          Interactive SVG diagrams for this domain are planned for a future update.
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  )
}

// ── Topic chip with hover exam tip ────────────────────────────────────────
const TOPIC_TIPS = {
  'EC2 Types':           'Know the families: T (burstable), M (general), C (compute), R (memory), I (storage), P/G (GPU). Match workload to family.',
  'Spot vs Reserved':    'Spot = interruptible, 90% off. Reserved = 1-3yr commitment, 72% off. On-Demand = pay as you go. Savings Plans = flexible commitment.',
  'Auto Scaling':        'Scale Out (add instances) vs Scale Up (bigger instance). Target Tracking = simplest. Cooldown periods prevent rapid scaling.',
  'Lambda':              'Max 15-min timeout. Billed per 1ms. Concurrency limits. Use Layers for shared code. Avoid for long-running tasks.',
  'ECS Fargate':         'EC2 launch type = you manage the cluster nodes. Fargate = AWS manages. Fargate costs more but eliminates operational overhead.',
  'EKS':                 'Managed Kubernetes. Use when you need Kubernetes features or portability. ECS is simpler if you don\'t need K8s specifically.',
  'Placement Groups':    'Cluster = low latency single AZ. Spread = 7 instances max per AZ, across hardware. Partition = Hadoop/Cassandra style isolation.',
  'Beanstalk':           'PaaS — you upload code, AWS manages the rest. Good for web apps. Underlying resources (EC2, ELB) are still visible and accessible.',
  'S3 Storage Classes':  'Standard → Standard-IA → One Zone-IA → Glacier Instant → Glacier Flexible → Glacier Deep Archive. Cost vs retrieval speed tradeoff.',
  'Lifecycle Policies':  'Automate transitions between storage classes. E.g., Standard for 30 days, then Glacier. Cannot transition to One Zone-IA from Standard-IA.',
  'EBS Types':           'gp3 = default general purpose. io2 = highest IOPS (64,000+). st1 = throughput HDD (MapReduce). sc1 = cold HDD. Cannot attach EBS across AZs.',
  'EFS':                 'NFS file system mountable by many EC2 instances simultaneously across AZs. Scales automatically. More expensive than EBS per GB.',
  'Glacier':             'Expedited: 1-5 min. Standard: 3-5 hr. Bulk: 5-12 hr. Glacier Instant Retrieval: milliseconds. Choose based on retrieval frequency.',
  'Storage Gateway':     'Hybrid storage bridge. File Gateway (NFS/SMB), Volume Gateway (iSCSI block), Tape Gateway (virtual tape library). Backs up to S3.',
  'RDS Multi-AZ':        'Synchronous replication to standby. Automatic failover. Standby NOT readable. Different from Read Replicas (async, readable).',
  'Read Replicas':       'Async replication. 5 per RDS instance. Can be cross-region. Can be promoted to standalone. Used for read scaling, NOT failover.',
  'Aurora':              '6 copies across 3 AZs automatically. 15 read replicas. Global Database spans regions. Aurora Serverless for variable workloads.',
  'DynamoDB':            'On-Demand vs Provisioned. Global Tables for multi-region. Streams for change capture. TTL for automatic item expiry. DAX for caching.',
  'ElastiCache Redis':   'Redis: persistence, pub/sub, sorted sets, replication. Memcached: simple, multi-threaded. Use Redis for sessions, leaderboards, caching.',
  'DAX':                 'DynamoDB-specific cache. Milliseconds → microseconds. Compatible with DynamoDB API. Use when DynamoDB is the bottleneck.',
  'Redshift':            'OLAP data warehouse. Columnar storage. Redshift Spectrum queries S3 directly. RA3 nodes separate compute from storage.',
  'ALB vs NLB vs GLB':   'ALB = Layer 7, HTTP/S, path routing. NLB = Layer 4, TCP/UDP, static IP. GLB = Layer 3/4, inline traffic inspection (firewalls, IDS).',
  'ASG':                 'Min/desired/max instance counts. Health checks replace unhealthy instances. Warm pools reduce cold start time.',
  'Route 53 Routing':    'Weighted: A/B traffic splits. Latency: lowest RTT. Failover: primary/secondary. Geolocation: by country/continent. Geoproximity: bias.',
  'CloudFront':          'OAC replaces OAI for S3 origin access. TTL controls caching. Lambda@Edge/CloudFront Functions run at edge. 400+ PoPs.',
  'DR Strategies':       'Backup & Restore → Pilot Light → Warm Standby → Multi-Site Active-Active. Lower RTO/RPO = higher cost. Know the names for the exam.',
  'Global Accelerator':  'Static IPs + anycast routing to the nearest AWS edge. Good for TCP/UDP apps. Different from CloudFront (CloudFront is HTTP/CDN).',
  'SQS Standard':        'At-least-once delivery. Best-effort ordering. Nearly unlimited throughput. Use DLQ for failed message handling.',
  'SQS FIFO':            'Exactly-once processing. Strict order within message group. 300 TPS (3,000 with batching). Deduplication window: 5 minutes.',
  'SNS Fan-Out':         'One SNS topic → multiple SQS queues simultaneously. Classic fan-out pattern for decoupled parallel processing.',
  'EventBridge':         'Formerly CloudWatch Events. Ingests events from AWS services and SaaS. Route via rules to 20+ target types.',
  'Kinesis Streams':     'Real-time streaming. Retention: 24hr–365d. Multiple consumers. Data Streams for custom processing; use Firehose for delivery.',
  'Kinesis Firehose':    'Near-real-time delivery to S3, Redshift, OpenSearch. Buffers data. No consumer code needed. Simpler than Data Streams.',
  'Reserved Instances':  '1 or 3 years. Standard RI = no change. Convertible RI = can change instance type. Scheduled RI = specific recurring windows.',
  'Savings Plans':       'Compute Savings Plans: any instance family, region, size. EC2 Instance Savings Plans: specific family in specific region. More flexible than RI.',
  'Spot':                'Up to 90% discount. 2-minute interruption notice. Best for batch, stateless, or fault-tolerant workloads.',
  'CloudWatch':          'Metrics, Logs, Alarms, Dashboards. Default EC2 metrics: every 5 min. Detailed monitoring: every 1 min (extra cost). Custom metrics: any interval.',
  'CloudTrail':          'Management events vs Data events. Enabled by default for 90 days. Enable a Trail to S3 for longer retention and analysis.',
  'Cost Explorer':       'Visualize and analyze AWS costs. Reserved Instance coverage and utilization reports. Rightsizing recommendations.',
  'Trusted Advisor':     'Basic: 7 core checks (free). Business/Enterprise: all 400+ checks. Categories: Cost, Security, Fault Tolerance, Performance, Service Limits.',
}

function TopicChip({ topic }) {
  const [hover, setHover] = useState(false)
  const tip = TOPIC_TIPS[topic]

  return (
    <div style={{ position: 'relative' }}>
      <button
        onMouseEnter={() => tip && setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={() => setHover(h => !h)}
        style={{
          fontSize: 12, padding: '5px 11px',
          background: hover ? 'var(--color-accent-dim)' : 'var(--color-surface-raised)',
          border: `1px solid ${hover ? 'var(--color-accent-border)' : 'var(--color-border-emphasis)'}`,
          borderRadius: 20,
          color: hover ? 'var(--color-accent)' : 'var(--color-text-secondary)',
          cursor: tip ? 'pointer' : 'default',
          transition: 'all 150ms ease',
          fontFamily: 'var(--font-display)',
        }}
      >{topic}</button>

      {hover && tip && (
        <div style={{
          position: 'absolute', bottom: 'calc(100% + 8px)', left: 0, zIndex: 50,
          width: 260, background: 'var(--color-surface)',
          border: '1px solid var(--color-accent-border)',
          borderRadius: 10, padding: '10px 12px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          animation: 'popIn 120ms ease',
          pointerEvents: 'none',
        }}>
          <p style={{ fontSize: 12, lineHeight: 1.6, color: 'var(--color-text-secondary)', margin: 0 }}>{tip}</p>
          <div style={{ position: 'absolute', bottom: -5, left: 14, width: 9, height: 9, background: 'var(--color-surface)', border: '1px solid var(--color-accent-border)', borderTop: 'none', borderLeft: 'none', transform: 'rotate(45deg)' }} />
        </div>
      )}
      <style>{`@keyframes popIn { from { opacity:0;transform:translateY(4px) } to { opacity:1;transform:translateY(0) } }`}</style>
    </div>
  )
}
