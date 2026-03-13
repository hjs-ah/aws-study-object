// src/components/ConceptMap.jsx
// Phase 1: placeholder shell with topic chips
// Phase 2: VPC diagram wired in
// Phase 3+: all domain diagrams

const DOMAIN_TOPICS = {
  vpc: ['Subnets', 'Route tables', 'IGW', 'NAT Gateway', 'Security Groups', 'NACLs', 'VPC Peering', 'Transit Gateway'],
  iam: ['IAM Roles', 'Policies', 'STS', 'KMS', 'Secrets Manager', 'Cognito', 'GuardDuty'],
  compute: ['EC2 types', 'Spot vs Reserved', 'Auto Scaling', 'Lambda', 'ECS Fargate', 'EKS', 'Placement groups'],
  storage: ['S3 classes', 'Lifecycle policies', 'EBS types', 'EFS', 'Glacier', 'Storage Gateway'],
  databases: ['RDS Multi-AZ', 'Read Replicas', 'Aurora', 'DynamoDB', 'ElastiCache', 'DAX'],
  ha: ['ALB vs NLB', 'ASG', 'Route 53', 'CloudFront', 'DR tiers'],
  messaging: ['SQS Standard', 'SQS FIFO', 'SNS fan-out', 'EventBridge', 'Kinesis'],
  cost: ['Reserved Instances', 'Savings Plans', 'Spot', 'CloudWatch', 'Cost Explorer', 'Trusted Advisor'],
}

export function ConceptMap({ domain }) {
  const topics = DOMAIN_TOPICS[domain.slug] ?? []

  return (
    <div>
      {/* Diagram area */}
      <div style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        height: 220,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Grid pattern background */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }} />
        <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 6 }}>
            {domain.title} architecture diagram
          </div>
          <div style={{ fontSize: 11, color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
            Interactive diagram — Phase 2
          </div>
        </div>
      </div>

      {/* Topic chips */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {topics.map((topic) => (
          <span
            key={topic}
            style={{
              fontSize: 12,
              padding: '4px 10px',
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border-emphasis)',
              borderRadius: 20,
              color: 'var(--color-text-secondary)',
              cursor: 'pointer',
              transition: 'var(--transition)',
            }}
            onMouseEnter={(e) => {
              e.target.style.borderColor = 'var(--color-accent)'
              e.target.style.color = 'var(--color-accent)'
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = 'var(--color-border-emphasis)'
              e.target.style.color = 'var(--color-text-secondary)'
            }}
          >
            {topic}
          </span>
        ))}
      </div>
    </div>
  )
}
