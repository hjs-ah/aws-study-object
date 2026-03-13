// src/components/diagrams/GenericDiagram.jsx
// Placeholder diagram for domains not yet built out.
// Shows topic chips and a "Phase 3" tag.

const DOMAIN_TOPICS = {
  compute: ['EC2 types', 'Spot vs Reserved', 'Auto Scaling', 'Lambda', 'ECS Fargate', 'EKS', 'Placement groups', 'Beanstalk'],
  storage: ['S3 classes', 'Lifecycle policies', 'EBS types', 'EFS', 'Glacier', 'Storage Gateway', 'S3 Transfer Acceleration'],
  databases: ['RDS Multi-AZ', 'Read Replicas', 'Aurora', 'DynamoDB', 'ElastiCache Redis', 'DAX', 'Redshift'],
  ha: ['ALB vs NLB vs GLB', 'ASG', 'Route 53 routing', 'CloudFront', 'DR: Backup → Active-Active'],
  messaging: ['SQS Standard', 'SQS FIFO', 'SNS fan-out', 'EventBridge', 'Kinesis Streams', 'Kinesis Firehose'],
  cost: ['Reserved Instances', 'Savings Plans', 'Spot', 'CloudWatch', 'CloudTrail', 'Cost Explorer', 'Trusted Advisor'],
}

export function GenericDiagram({ domain }) {
  const topics = DOMAIN_TOPICS[domain.slug] ?? []

  return (
    <div>
      <div style={{
        background: 'var(--color-surface)', border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)', height: 160,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', overflow: 'hidden', marginBottom: 14,
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }} />
        <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 6 }}>
            {domain.title} — interactive diagram
          </div>
          <div style={{
            display: 'inline-block', fontSize: 10, fontFamily: 'var(--font-mono)',
            padding: '3px 10px',
            background: 'var(--color-info-dim)', border: '1px solid rgba(91,156,246,0.2)',
            borderRadius: 20, color: 'var(--color-info)',
          }}>
            Phase 3 · Notion CMS
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {topics.map((topic) => (
          <span key={topic} style={{
            fontSize: 12, padding: '4px 10px',
            background: 'var(--color-surface)', border: '1px solid var(--color-border-emphasis)',
            borderRadius: 20, color: 'var(--color-text-secondary)', cursor: 'default',
          }}>
            {topic}
          </span>
        ))}
      </div>
    </div>
  )
}
