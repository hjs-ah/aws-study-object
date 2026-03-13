// src/components/ArchitectureTrap.jsx
// "What's Wrong Here?" — shows a plausible but flawed architecture.
// Learner selects which component(s) are wrong, then reveals the correct fix.

import { useState } from 'react'

const TRAPS = {
  vpc: [
    {
      id: 'vpc-trap-1',
      title: 'Public Web App Architecture',
      scenario: 'A team deploys a web app: EC2 instances in a private subnet, an ALB in a public subnet, and a NAT Gateway — also in the private subnet. Traffic flows fine in testing. Will this work in production?',
      diagram: [
        { id: 'igw',  label: 'Internet Gateway', pos: [50, 10],  wrong: false },
        { id: 'alb',  label: 'ALB (public subnet)', pos: [50, 32], wrong: false },
        { id: 'nat',  label: 'NAT GW (private subnet ⚠)', pos: [50, 56], wrong: true },
        { id: 'ec2',  label: 'EC2 ASG (private)', pos: [50, 76],  wrong: false },
      ],
      wrongIds: ['nat'],
      explanation: 'NAT Gateway must live in the PUBLIC subnet. If placed in the private subnet, instances cannot route outbound internet traffic because there is no path to the IGW. The private subnet route table points 0.0.0.0/0 → NAT GW, but the NAT GW itself needs a public subnet route to reach the IGW.',
      fix: 'Move NAT Gateway to the public subnet. The private subnet route table points to it; the public subnet route table points to IGW.',
    },
    {
      id: 'vpc-trap-2',
      title: 'Multi-Tier Secure App',
      scenario: 'A security-conscious team puts their RDS database in a private subnet and uses a Security Group to deny all access from 0.0.0.0/0. Is this the right approach for keeping RDS private?',
      diagram: [
        { id: 'sg',   label: 'Security Group: Deny 0.0.0.0/0 ⚠', pos: [50, 20], wrong: true },
        { id: 'rds',  label: 'RDS (private subnet)', pos: [50, 55], wrong: false },
        { id: 'ec2',  label: 'EC2 (private subnet)', pos: [50, 80], wrong: false },
      ],
      wrongIds: ['sg'],
      explanation: 'Security Groups CANNOT deny — they are allow-only. A Security Group that "denies 0.0.0.0/0" is simply an empty rule set. The correct approach is to not add any inbound rule for 0.0.0.0/0, and instead add a specific allow rule for the EC2 Security Group only.',
      fix: 'Remove the deny rule (it does nothing). Create an inbound rule on the RDS Security Group that references the EC2 Security Group ID on port 3306. This is the standard tier-to-tier SG reference pattern.',
    },
  ],
  iam: [
    {
      id: 'iam-trap-1',
      title: 'Lambda Accessing S3',
      scenario: 'A developer needs Lambda to read objects from S3. They create an IAM User, generate access keys, and put them in Lambda environment variables. Is this correct?',
      diagram: [
        { id: 'lambda', label: 'Lambda Function', pos: [50, 20], wrong: false },
        { id: 'keys',   label: 'Access Keys in Env Vars ⚠', pos: [50, 48], wrong: true },
        { id: 's3',     label: 'S3 Bucket', pos: [50, 76], wrong: false },
      ],
      wrongIds: ['keys'],
      explanation: 'Embedding IAM User access keys in Lambda environment variables is a security anti-pattern. Keys can be exposed in logs, deployment artifacts, or version control. Long-term credentials also cannot rotate automatically.',
      fix: 'Create an IAM Role with an S3 read policy. Attach it as the Lambda Execution Role. Lambda automatically gets temporary credentials via STS — no keys needed, no exposure risk.',
    },
    {
      id: 'iam-trap-2',
      title: 'Cross-Account Access',
      scenario: 'Account A needs to access Account B\'s DynamoDB. The admin attaches an IAM policy directly to the EC2 instance in Account A. The policy allows dynamodb:* on Account B\'s table ARN. Will this work?',
      diagram: [
        { id: 'ec2',     label: 'EC2 (Account A)', pos: [50, 15], wrong: false },
        { id: 'policy',  label: 'IAM Policy: dynamodb:* on B ARN ⚠', pos: [50, 40], wrong: true },
        { id: 'dynamo',  label: 'DynamoDB (Account B)', pos: [50, 72], wrong: false },
      ],
      wrongIds: ['policy'],
      explanation: 'A policy attached to Account A cannot grant access to Account B\'s resources alone. Cross-account access requires BOTH sides to allow the action: Account A\'s identity must be allowed to assume a role in Account B, AND Account B must have a role with a trust policy allowing Account A to assume it.',
      fix: '1. Create an IAM Role in Account B with dynamodb:* permission and a trust policy allowing Account A\'s EC2 role to assume it. 2. In Account A, allow the EC2 role to call sts:AssumeRole on that Account B role ARN.',
    },
  ],
  compute: [
    {
      id: 'compute-trap-1',
      title: 'High-Availability EC2 App',
      scenario: 'A team needs HA for their app. They launch 2 EC2 instances in the same Availability Zone with an ALB in front. Both instances are in the same AZ for lowest latency. Is this HA?',
      diagram: [
        { id: 'alb',  label: 'ALB', pos: [50, 15], wrong: false },
        { id: 'az1',  label: 'AZ-a: EC2 #1 ⚠', pos: [30, 55], wrong: true },
        { id: 'az2',  label: 'AZ-a: EC2 #2 ⚠', pos: [70, 55], wrong: true },
      ],
      wrongIds: ['az1', 'az2'],
      explanation: 'Two instances in the same AZ is NOT high-availability. If AZ-a experiences an outage (power failure, network issue), both instances go down simultaneously. True HA requires instances distributed across at least 2 AZs.',
      fix: 'Distribute instances across at least 2 AZs. ALB automatically detects unhealthy instances and routes only to healthy targets. Use an Auto Scaling Group with a multi-AZ configuration.',
    },
    {
      id: 'compute-trap-2',
      title: 'Lambda Timeout',
      scenario: 'A Lambda function processes large video transcoding jobs. The team sets the timeout to 60 minutes to ensure completion. Is this valid?',
      diagram: [
        { id: 'trigger', label: 'S3 Upload Trigger', pos: [50, 10], wrong: false },
        { id: 'lambda',  label: 'Lambda: timeout=60min ⚠', pos: [50, 45], wrong: true },
        { id: 'output',  label: 'S3 Output Bucket', pos: [50, 80], wrong: false },
      ],
      wrongIds: ['lambda'],
      explanation: 'Lambda has a hard maximum timeout of 15 minutes. A 60-minute timeout is not valid. Long-running video transcoding is the wrong fit for Lambda.',
      fix: 'Use AWS Elemental MediaConvert for video transcoding, or run the job on EC2/ECS Fargate for full control over execution time. Lambda is best for tasks completing within 15 minutes.',
    },
  ],
  storage: [
    {
      id: 'storage-trap-1',
      title: 'Database Backup Strategy',
      scenario: 'A team stores nightly database backups in S3 Standard. After 3 months, they realize storage costs are high. They add a Lifecycle rule to move objects to S3 Glacier after 30 days. Good solution?',
      diagram: [
        { id: 's3std',    label: 'S3 Standard (0-30 days)', pos: [50, 20], wrong: false },
        { id: 'lc',       label: 'Lifecycle: → Glacier after 30d', pos: [50, 48], wrong: false },
        { id: 'glacier',  label: 'Glacier (30d+)', pos: [50, 76], wrong: false },
      ],
      wrongIds: [],
      explanation: 'This is actually CORRECT! This is the intended S3 Lifecycle pattern. Objects start in Standard for fast access, then automatically transition to Glacier for cheap long-term archival. The team could also consider S3 Intelligent-Tiering as an alternative.',
      fix: 'No fix needed — this is a valid, cost-optimized approach. The team could also evaluate S3 Glacier Instant Retrieval if they need millisecond access to the archive.',
      isCorrect: true,
    },
  ],
  databases: [
    {
      id: 'db-trap-1',
      title: 'Read Scaling with Multi-AZ',
      scenario: 'An application has high read traffic on its RDS MySQL instance. The team enables Multi-AZ to distribute read traffic across the primary and standby. Will this help with read scaling?',
      diagram: [
        { id: 'app',     label: 'Application', pos: [50, 10], wrong: false },
        { id: 'primary', label: 'RDS Primary', pos: [30, 45], wrong: false },
        { id: 'standby', label: 'RDS Standby (reads?) ⚠', pos: [70, 45], wrong: true },
      ],
      wrongIds: ['standby'],
      explanation: 'Multi-AZ standby is NOT a read replica. It exists solely for automatic failover (HA). You CANNOT send read traffic to the standby — it is not accessible during normal operation.',
      fix: 'Create Read Replicas to scale read traffic. Read Replicas use async replication and ARE accessible for reads. Multi-AZ stays for HA; Read Replicas are for scale.',
    },
  ],
  ha: [
    {
      id: 'ha-trap-1',
      title: 'Global Failover Setup',
      scenario: 'A team configures Route 53 with a Failover routing policy: Primary = us-east-1, Secondary = eu-west-1. They set the health check on the primary ALB\'s IP address. Will failover trigger correctly if the us-east-1 app server crashes?',
      diagram: [
        { id: 'r53',    label: 'Route 53 Failover Policy', pos: [50, 10], wrong: false },
        { id: 'hc',     label: 'Health Check: ALB IP ⚠', pos: [50, 35], wrong: true },
        { id: 'alb1',   label: 'ALB us-east-1 (Primary)', pos: [25, 62], wrong: false },
        { id: 'alb2',   label: 'ALB eu-west-1 (Secondary)', pos: [75, 62], wrong: false },
      ],
      wrongIds: ['hc'],
      explanation: 'A health check on the ALB IP only checks if the ALB responds — not if the backend application is healthy. If the app servers crash but the ALB is still running (returning 502s), the health check may still pass and failover never triggers.',
      fix: 'Configure the Route 53 health check against an application-level health endpoint (e.g., /health) that validates the entire stack — app + DB connectivity. The ALB itself should also have proper health checks on the target EC2 instances.',
    },
  ],
  messaging: [
    {
      id: 'msg-trap-1',
      title: 'Order Processing System',
      scenario: 'An e-commerce team needs to process orders in strict sequence (order received → payment → fulfillment). They use an SQS Standard Queue. Is Standard Queue the right choice?',
      diagram: [
        { id: 'api',    label: 'Order API', pos: [50, 10], wrong: false },
        { id: 'sqs',    label: 'SQS Standard Queue ⚠', pos: [50, 42], wrong: true },
        { id: 'worker', label: 'Order Processor Lambda', pos: [50, 75], wrong: false },
      ],
      wrongIds: ['sqs'],
      explanation: 'SQS Standard Queue provides at-least-once delivery and best-effort ordering — NOT strict FIFO order. For payment processing that requires strict sequencing, Standard Queue can deliver messages out of order or even deliver duplicates.',
      fix: 'Use SQS FIFO Queue for strict ordering and exactly-once processing. FIFO queues guarantee message order within a message group and deduplicate within a 5-minute window. Note: FIFO throughput is limited (up to 300 TPS, or 3,000 with batching).',
    },
  ],
  cost: [
    {
      id: 'cost-trap-1',
      title: 'Cost Optimization for Dev Environment',
      scenario: 'A company runs dev/test EC2 instances 9am–6pm weekdays. Their developer recommends purchasing 1-year Reserved Instances for the dev fleet to save costs. Is this the best recommendation?',
      diagram: [
        { id: 'ec2',  label: 'Dev EC2 Fleet (45hr/week)', pos: [50, 30], wrong: false },
        { id: 'ri',   label: '1-Year Reserved Instances ⚠', pos: [50, 65], wrong: true },
      ],
      wrongIds: ['ri'],
      explanation: 'Reserved Instances only make sense for instances running 24/7 (or close to it). Dev instances running 45 hrs/week (27% utilization) would pay for 100% of time but use only 27%. The RI commitment would actually cost MORE than On-Demand for this usage pattern.',
      fix: 'Use scheduled On-Demand instances with Instance Scheduler (AWS solution) or Auto Scaling schedules to stop instances at 6pm and start at 9am. Alternatively, Spot Instances work well for dev environments that can tolerate interruption.',
    },
  ],
}

export function ArchitectureTrap({ domainSlug }) {
  const scenarios = TRAPS[domainSlug] ?? []
  const [scenarioIdx, setScenarioIdx] = useState(0)
  const [selected, setSelected] = useState(new Set())
  const [revealed, setRevealed] = useState(false)

  const scenario = scenarios[scenarioIdx]

  const reset = (idx) => {
    setScenarioIdx(idx)
    setSelected(new Set())
    setRevealed(false)
  }

  if (!scenario) return (
    <div style={{
      padding: 28, textAlign: 'center',
      background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--color-border)', color: 'var(--color-text-muted)', fontSize: 13,
    }}>
      Architecture trap scenarios coming soon for this domain.
    </div>
  )

  const toggleSelect = (id) => {
    if (revealed) return
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const allCorrect =
    scenario.isCorrect
      ? selected.size === 0
      : scenario.wrongIds.every((id) => selected.has(id)) &&
        [...selected].every((id) => scenario.wrongIds.includes(id))

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <div style={{
          fontSize: 10, fontFamily: 'var(--font-mono)', padding: '3px 10px',
          background: 'rgba(240,96,96,0.1)', border: '1px solid rgba(240,96,96,0.25)',
          borderRadius: 20, color: 'var(--color-danger)', fontWeight: 600,
        }}>⚠ What's Wrong?</div>
        <span style={{ fontSize: 12, color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
          {scenarioIdx + 1} / {scenarios.length}
        </span>
        {scenarios.length > 1 && (
          <div style={{ display: 'flex', gap: 5, marginLeft: 'auto' }}>
            {scenarios.map((_, i) => (
              <button key={i} onClick={() => reset(i)} style={{
                width: 7, height: 7, borderRadius: '50%', border: 'none', cursor: 'pointer',
                background: i === scenarioIdx ? 'var(--color-accent)' : 'var(--color-border-emphasis)',
              }} />
            ))}
          </div>
        )}
      </div>

      {/* Scenario card */}
      <div style={{
        background: 'var(--color-surface)', border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)', padding: '14px 16px', marginBottom: 14,
      }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 8 }}>
          {scenario.title}
        </div>
        <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.65, margin: 0 }}>
          {scenario.scenario}
        </p>
      </div>

      {/* Instruction hint */}
      {!revealed && (
        <div style={{
          fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)',
          marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <span style={{ color: 'var(--color-danger)' }}>↓</span>
          {scenario.isCorrect
            ? 'Review the architecture — decide if it\'s correct, then reveal the answer'
            : 'Click the component(s) that are WRONG in this architecture, then reveal'}
        </div>
      )}

      {/* Architecture components — simplified visual list */}
      <div style={{
        display: 'flex', flexDirection: 'column',
        gap: 8, marginBottom: 14,
        position: 'relative',
      }}>
        {/* Vertical connector line */}
        <div style={{
          position: 'absolute', left: 24, top: 20, bottom: 20, width: 1,
          background: 'var(--color-border-emphasis)',
          zIndex: 0,
        }} />

        {scenario.diagram.map((node, i) => {
          const isSelected = selected.has(node.id)
          const isWrong = node.wrong
          const showResult = revealed

          let bg = 'var(--color-surface)'
          let border = 'var(--color-border-emphasis)'
          let color = 'var(--color-text-primary)'

          if (showResult) {
            if (isWrong && !scenario.isCorrect) {
              bg = 'rgba(240,96,96,0.08)'; border = 'rgba(240,96,96,0.4)'; color = 'var(--color-danger)'
            } else {
              bg = 'rgba(62,207,142,0.07)'; border = 'rgba(62,207,142,0.35)'; color = 'var(--color-success)'
            }
          } else if (isSelected) {
            bg = 'rgba(240,96,96,0.08)'; border = 'rgba(240,96,96,0.4)'; color = 'var(--color-danger)'
          }

          return (
            <div key={node.id} style={{ display: 'flex', alignItems: 'center', gap: 12, position: 'relative', zIndex: 1 }}>
              {/* Node number bubble */}
              <div style={{
                width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                background: showResult && isWrong && !scenario.isCorrect
                  ? 'rgba(240,96,96,0.2)' : 'var(--color-surface-raised)',
                border: `1px solid ${showResult && isWrong && !scenario.isCorrect ? 'rgba(240,96,96,0.4)' : 'var(--color-border-emphasis)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontFamily: 'var(--font-mono)',
                color: showResult && isWrong && !scenario.isCorrect ? 'var(--color-danger)' : 'var(--color-text-muted)',
              }}>{i + 1}</div>

              {/* Clickable component block */}
              <button
                onClick={() => toggleSelect(node.id)}
                disabled={revealed}
                style={{
                  flex: 1, textAlign: 'left', padding: '10px 14px',
                  background: bg, border: `1px solid ${border}`,
                  borderRadius: 'var(--radius-md)', color,
                  fontSize: 13, fontWeight: isSelected || (showResult && isWrong) ? 500 : 400,
                  cursor: revealed ? 'default' : 'pointer',
                  transition: 'all 150ms ease',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}
              >
                <span>{node.label}</span>
                {showResult && isWrong && !scenario.isCorrect && (
                  <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)' }}>← WRONG</span>
                )}
                {showResult && !isWrong && (
                  <span style={{ fontSize: 11, color: 'var(--color-success)', fontFamily: 'var(--font-mono)' }}>✓</span>
                )}
                {!showResult && isSelected && (
                  <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)' }}>← selected</span>
                )}
              </button>
            </div>
          )
        })}
      </div>

      {/* Reveal button */}
      {!revealed && (
        <button
          onClick={() => setRevealed(true)}
          style={{
            width: '100%', padding: '11px',
            background: 'var(--color-accent)', border: 'none',
            borderRadius: 'var(--radius-md)',
            color: '#000', fontSize: 13, fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Reveal Answer
        </button>
      )}

      {/* Explanation panel */}
      {revealed && (
        <div style={{
          background: scenario.isCorrect ? 'rgba(62,207,142,0.07)' : 'rgba(240,96,96,0.07)',
          border: `1px solid ${scenario.isCorrect ? 'rgba(62,207,142,0.3)' : 'rgba(240,96,96,0.3)'}`,
          borderRadius: 'var(--radius-lg)', padding: '14px 16px',
          animation: 'popIn 200ms ease',
        }}>
          <div style={{
            fontSize: 12, fontWeight: 600,
            color: scenario.isCorrect ? 'var(--color-success)' : 'var(--color-danger)',
            fontFamily: 'var(--font-mono)', marginBottom: 8,
          }}>
            {scenario.isCorrect ? '✓ Correct Architecture' : '⚠ Flawed Architecture'}
          </div>
          <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.65, marginBottom: 10 }}>
            {scenario.explanation}
          </p>
          <div style={{
            padding: '8px 12px',
            background: 'var(--color-surface-raised)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-sm)',
            fontSize: 12, color: 'var(--color-text-secondary)', lineHeight: 1.6,
          }}>
            <span style={{ fontWeight: 600, color: 'var(--color-accent)', fontFamily: 'var(--font-mono)', fontSize: 10 }}>THE FIX → </span>
            {scenario.fix}
          </div>

          {scenarioIdx < scenarios.length - 1 && (
            <button onClick={() => reset(scenarioIdx + 1)} style={{
              marginTop: 12, width: '100%', padding: '9px',
              background: 'transparent', border: '1px solid var(--color-border-emphasis)',
              borderRadius: 'var(--radius-md)', color: 'var(--color-text-secondary)',
              fontSize: 13, cursor: 'pointer',
            }}>Next Scenario →</button>
          )}
        </div>
      )}

      <style>{`@keyframes popIn { from { opacity:0;transform:translateY(4px) } to { opacity:1;transform:translateY(0) } }`}</style>
    </div>
  )
}

export default ArchitectureTrap
