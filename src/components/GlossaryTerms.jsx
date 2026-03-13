// src/components/GlossaryTerms.jsx
// Clickable keyword chips — tap to see a definition tooltip. X to close.
import { useState } from 'react'

const GLOSSARY = {
  'Subnet': 'A range of IP addresses within a VPC. Public subnets route to the internet via IGW; private subnets route outbound via NAT Gateway; isolated subnets have no internet route at all.',
  'IGW': 'Internet Gateway — a horizontally-scaled, HA VPC component. Attaches to the VPC; the ROUTE TABLE is what makes a subnet public, not the IGW.',
  'NAT Gateway': 'Allows private subnet instances to initiate outbound internet connections while blocking inbound. Must be placed in a PUBLIC subnet — the #1 exam trap.',
  'Security Group': 'Stateful virtual firewall at the instance/ENI level. Supports allow-only rules — no deny. Return traffic is automatically permitted.',
  'NACL': 'Network ACL — stateless firewall at the subnet level. Supports allow AND deny. Must explicitly allow both inbound AND outbound traffic (including ephemeral ports).',
  'VPC Peering': 'Networking connection between two VPCs. Non-transitive — A↔B and B↔C does NOT allow A↔C.',
  'Route Table': 'Rules that determine where network traffic is directed. Each subnet must be associated with exactly one route table.',
  'CIDR': 'IP address range notation. 10.0.0.0/16 = 65,536 addresses. /24 = 256 addresses. /32 = single IP.',
  'IAM Role': 'An identity with specific permissions assumed by AWS services, users, or apps. Provides temporary credentials via STS — no long-term access keys.',
  'IAM Policy': 'JSON document: Allow/Deny + Actions + Resources. Identity-based (on users/roles) or resource-based (on S3 buckets, KMS keys etc.).',
  'STS': 'Security Token Service — issues temporary credentials via AssumeRole. Tokens expire automatically.',
  'Instance Profile': 'Container for an IAM role that attaches to an EC2 instance. Allows the instance to call AWS APIs without embedding credentials.',
  'SCP': 'Service Control Policy — AWS Organizations guardrail. Sets the MAXIMUM permission ceiling. Does NOT grant permissions — only restricts.',
  'MFA': 'Multi-Factor Authentication — second verification factor beyond a password. Strongly recommended for all IAM users and root.',
  'KMS': 'Key Management Service — managed encryption keys. Key policy is REQUIRED even if your IAM policy allows KMS.',
  'Cognito': 'User Pools = authentication (sign-up/sign-in, JWTs). Identity Pools = exchange tokens for temporary AWS credentials to access resources.',
  'EC2': 'Elastic Compute Cloud — virtual servers. Choose instance type, purchase option (On-Demand/Reserved/Spot), and OS.',
  'Auto Scaling Group': 'Automatically adjusts EC2 instance count based on demand using scaling policies (target tracking, step, scheduled).',
  'Lambda': 'Serverless compute — runs code in response to events. Max 15-minute timeout. Billed per 1ms of execution.',
  'Spot Instance': 'Unused EC2 capacity at up to 90% discount. Can be interrupted with 2-minute notice. Great for batch, fault-tolerant workloads.',
  'Reserved Instance': '1 or 3-year commitment for up to 72% discount vs On-Demand. Best for steady, predictable workloads.',
  'ECS': 'Elastic Container Service — container orchestration. EC2 launch type (you manage cluster) or Fargate (AWS manages).',
  'Fargate': 'Serverless compute for containers. Define CPU/memory; AWS manages the underlying infrastructure.',
  'Placement Group': 'Controls EC2 placement on hardware. Cluster = low latency in one AZ. Spread = HA across hardware. Partition = large distributed systems.',
  'S3': 'Object storage with 11 9s (99.999999999%) durability. Not a file system. Accessed via HTTP/HTTPS API.',
  'EBS': 'Elastic Block Store — persistent block storage for EC2. AZ-locked. Types: gp3 (general), io2 (high IOPS), st1/sc1 (throughput HDD).',
  'EFS': 'Elastic File System — managed NFS mountable on multiple EC2 instances simultaneously across AZs.',
  'S3 Glacier': 'Archival storage. Retrieval: Expedited (1-5 min), Standard (3-5 hr), Bulk (5-12 hr). Glacier Instant = millisecond access.',
  'Lifecycle Policy': 'Automated S3 rule to transition objects between storage classes or expire them after a set period.',
  'Snowball': 'Physical data transfer device for migrating TBs–PBs to AWS when internet transfer is too slow or expensive.',
  'RDS': 'Managed relational databases (MySQL, PostgreSQL, MariaDB, Oracle, SQL Server). AWS handles patching, backups, Multi-AZ.',
  'Multi-AZ': 'Synchronous standby replica in a different AZ. Automatic failover for HA. Standby is NOT readable — exists only for failover.',
  'Read Replica': 'Read-only copy via async replication. Used for read scaling. NOT the same as Multi-AZ.',
  'Aurora': 'AWS-native MySQL/PostgreSQL-compatible DB. Up to 5x faster than MySQL. Replicates across 3 AZs with 6 copies automatically.',
  'DynamoDB': 'Fully managed NoSQL key-value/document DB. Millisecond latency at any scale. On-demand or provisioned capacity.',
  'ElastiCache': 'Managed in-memory cache. Redis (persistence, replication) or Memcached (simple, multi-threaded).',
  'DAX': 'DynamoDB Accelerator — in-memory cache for DynamoDB only. Reduces response times from ms to microseconds.',
  'ALB': 'Application Load Balancer — Layer 7. Supports path-based routing, host-based routing, WebSockets. Integrates with WAF.',
  'NLB': 'Network Load Balancer — Layer 4 (TCP/UDP). Millions of requests/sec, ultra-low latency. Supports static/Elastic IPs.',
  'Route 53': 'AWS managed DNS. Routing policies: Simple, Weighted, Latency, Failover, Geolocation, Geoproximity, Multi-value.',
  'CloudFront': 'CDN — caches content at 400+ global edge locations. Integrates with S3 (via OAC), ALB, EC2. Reduces latency and origin load.',
  'RTO': 'Recovery Time Objective — max acceptable downtime after a disaster. Lower RTO = higher cost.',
  'RPO': 'Recovery Point Objective — max acceptable data loss (in time). Lower RPO = more frequent replication = higher cost.',
  'SQS': 'Simple Queue Service — managed message queue. Standard (at-least-once, best-effort order) or FIFO (exactly-once, strict order).',
  'SNS': 'Simple Notification Service — pub/sub messaging. One message → all subscribers simultaneously. Does NOT persist messages.',
  'EventBridge': 'Serverless event bus connecting AWS services and SaaS apps. Routes events via rules to targets (Lambda, SQS, Step Functions).',
  'Kinesis': 'Real-time streaming. Data Streams (custom consumers), Firehose (delivery to S3/Redshift), Analytics (SQL on streams).',
  'Visibility Timeout': 'Period an SQS message is hidden after being received. Prevents double-processing. If processing fails, message reappears.',
  'DLQ': 'Dead Letter Queue — receives messages that failed processing after N attempts. Used for error investigation.',
  'CloudWatch': 'AWS monitoring — metrics, logs, alarms, dashboards. Different from CloudTrail (API audit logs).',
  'CloudTrail': 'Records all AWS API calls — who, what, from where, when. The audit log for security and compliance.',
  'Trusted Advisor': 'Automated checks across 5 categories: Cost, Security, Fault Tolerance, Performance, Service Limits.',
  'Savings Plans': 'Flexible 1 or 3-year commitment. Compute Savings Plans apply across instance families, regions, EC2/Lambda/Fargate.',
}

export const DOMAIN_KEYWORDS = {
  vpc: ['Subnet', 'IGW', 'NAT Gateway', 'Security Group', 'NACL', 'VPC Peering', 'Route Table', 'CIDR'],
  iam: ['IAM Role', 'IAM Policy', 'STS', 'Instance Profile', 'SCP', 'MFA', 'KMS', 'Cognito'],
  compute: ['EC2', 'Auto Scaling Group', 'Lambda', 'Spot Instance', 'Reserved Instance', 'ECS', 'Fargate', 'Placement Group'],
  storage: ['S3', 'EBS', 'EFS', 'S3 Glacier', 'Lifecycle Policy', 'Snowball'],
  databases: ['RDS', 'Multi-AZ', 'Read Replica', 'Aurora', 'DynamoDB', 'ElastiCache', 'DAX'],
  ha: ['ALB', 'NLB', 'Route 53', 'CloudFront', 'RTO', 'RPO'],
  messaging: ['SQS', 'SNS', 'EventBridge', 'Kinesis', 'Visibility Timeout', 'DLQ'],
  cost: ['CloudWatch', 'CloudTrail', 'Trusted Advisor', 'Savings Plans', 'Reserved Instance', 'Spot Instance'],
}

export function GlossaryTerms({ domainSlug }) {
  const [active, setActive] = useState(null)
  const terms = DOMAIN_KEYWORDS[domainSlug] ?? []

  return (
    <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid var(--color-border)' }}>
      <div style={{
        fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)',
        letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10,
        display: 'flex', alignItems: 'center', gap: 6,
      }}>
        <span style={{ color: 'var(--color-accent)', fontSize: 12 }}>◈</span>
        Key Terms — tap any to define
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
        {terms.map((term) => {
          const isActive = active === term
          return (
            <div key={term} style={{ position: 'relative' }}>
              <button
                onClick={() => setActive(isActive ? null : term)}
                style={{
                  fontSize: 12, padding: '5px 12px',
                  background: isActive ? 'var(--color-accent-dim)' : 'var(--color-surface)',
                  border: `1px solid ${isActive ? 'var(--color-accent)' : 'var(--color-border-emphasis)'}`,
                  borderRadius: 20,
                  color: isActive ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                  cursor: 'pointer', transition: 'all 150ms ease',
                  fontFamily: 'var(--font-display)', fontWeight: isActive ? 500 : 400,
                }}
              >{term}</button>

              {isActive && GLOSSARY[term] && (
                <div style={{
                  position: 'absolute', bottom: 'calc(100% + 8px)', left: 0, zIndex: 60,
                  width: 270, background: 'var(--color-surface)',
                  border: '1px solid var(--color-accent-border)',
                  borderRadius: 10, padding: '10px 30px 10px 12px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
                  animation: 'popIn 130ms ease',
                }}>
                  <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--color-accent)', fontFamily: 'var(--font-mono)', marginBottom: 5 }}>
                    {term}
                  </div>
                  <p style={{ fontSize: 12, lineHeight: 1.6, color: 'var(--color-text-secondary)', margin: 0 }}>
                    {GLOSSARY[term]}
                  </p>
                  <button onClick={() => setActive(null)} style={{
                    position: 'absolute', top: 6, right: 6,
                    width: 18, height: 18, borderRadius: '50%',
                    background: 'var(--color-accent)', border: 'none',
                    color: '#000', fontSize: 11, fontWeight: 700,
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>×</button>
                  {/* caret */}
                  <div style={{
                    position: 'absolute', bottom: -5, left: 14, width: 9, height: 9,
                    background: 'var(--color-surface)', border: '1px solid var(--color-accent-border)',
                    borderTop: 'none', borderLeft: 'none', transform: 'rotate(45deg)',
                  }} />
                </div>
              )}
            </div>
          )
        })}
      </div>
      <style>{`@keyframes popIn { from { opacity:0;transform:translateY(4px) } to { opacity:1;transform:translateY(0) } }`}</style>
    </div>
  )
}
