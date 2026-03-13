// src/components/ArchitectureBuilder.jsx
// Interactive drag-and-drop architecture builder.
// Drag AWS components from the palette onto drop zones.
// The canvas turns green when your architecture matches the correct answer.

import { useState, useRef } from 'react'

// Each challenge has: a title, a goal description, drop zones, and a solution
const CHALLENGES = {
  vpc: [
    {
      id: 'vpc-build-1',
      title: 'Build a Public Web App',
      goal: 'Arrange the components so internet users can reach the EC2 app server. Place each component in the correct tier.',
      hint: 'Remember: traffic flows Internet → IGW → ALB → EC2. NAT GW goes in the public subnet for EC2 to reach outbound internet.',
      components: ['IGW', 'ALB', 'NAT GW', 'EC2 ASG', 'RDS', 'Security Group'],
      zones: [
        { id: 'internet',        label: 'Internet Edge',     placeholder: 'Drop here…', accepts: ['IGW'], correct: ['IGW'] },
        { id: 'public-subnet',   label: 'Public Subnet',     placeholder: 'Drop here…', accepts: ['ALB', 'NAT GW'], correct: ['ALB', 'NAT GW'] },
        { id: 'private-subnet',  label: 'Private Subnet',    placeholder: 'Drop here…', accepts: ['EC2 ASG', 'Security Group'], correct: ['EC2 ASG', 'Security Group'] },
        { id: 'isolated-subnet', label: 'Isolated Subnet',   placeholder: 'Drop here…', accepts: ['RDS'], correct: ['RDS'] },
      ],
    },
    {
      id: 'vpc-build-2',
      title: 'Secure the Tiers',
      goal: 'Place the security controls in the right location. Security Groups go at the instance level; NACLs go at the subnet boundary.',
      hint: 'Security Groups are stateful and instance-level. NACLs are stateless and subnet-level. Both can coexist.',
      components: ['SG (Instance)', 'NACL (Subnet)', 'WAF', 'Shield'],
      zones: [
        { id: 'subnet-edge',    label: 'Subnet Boundary',  placeholder: 'Drop here…', accepts: ['NACL (Subnet)'], correct: ['NACL (Subnet)'] },
        { id: 'instance-level', label: 'Instance / ENI',   placeholder: 'Drop here…', accepts: ['SG (Instance)'], correct: ['SG (Instance)'] },
        { id: 'cloudfront-edge',label: 'CloudFront / ALB', placeholder: 'Drop here…', accepts: ['WAF'], correct: ['WAF'] },
        { id: 'global-edge',    label: 'Global Edge',      placeholder: 'Drop here…', accepts: ['Shield'], correct: ['Shield'] },
      ],
    },
  ],
  iam: [
    {
      id: 'iam-build-1',
      title: 'Secure an EC2 App',
      goal: 'An EC2 instance needs to read from S3 and write to DynamoDB. Drag the correct identity mechanism and policy type into place.',
      hint: 'EC2 should never use access keys. Use an IAM Role attached via an Instance Profile. Attach identity-based policies to the role.',
      components: ['IAM User + Keys', 'IAM Role', 'Instance Profile', 'Identity Policy', 'Resource Policy', 'MFA Token'],
      zones: [
        { id: 'ec2-identity',    label: 'EC2 Identity Mechanism', placeholder: 'Drop here…', accepts: ['IAM Role', 'Instance Profile'], correct: ['IAM Role', 'Instance Profile'] },
        { id: 'permissions',     label: 'Permission Type',        placeholder: 'Drop here…', accepts: ['Identity Policy'], correct: ['Identity Policy'] },
        { id: 'dont-use',        label: 'Do NOT use for EC2',     placeholder: 'Drop here…', accepts: ['IAM User + Keys', 'MFA Token', 'Resource Policy'], correct: ['IAM User + Keys'] },
      ],
    },
  ],
  compute: [
    {
      id: 'compute-build-1',
      title: 'Match Workloads to Compute',
      goal: 'Drag each compute service to the workload it is best suited for.',
      hint: 'Lambda = event-driven short tasks. EC2 = full control, long-running. Fargate = containerized, no server management. Spot = fault-tolerant batch.',
      components: ['Lambda', 'EC2 On-Demand', 'Fargate', 'Spot Instance'],
      zones: [
        { id: 'short-event',   label: 'API call handler (<15 min)', placeholder: 'Drop here…', accepts: ['Lambda'], correct: ['Lambda'] },
        { id: 'container-app', label: 'Containerized microservice',  placeholder: 'Drop here…', accepts: ['Fargate'], correct: ['Fargate'] },
        { id: 'batch-job',     label: 'Overnight batch processing',  placeholder: 'Drop here…', accepts: ['Spot Instance'], correct: ['Spot Instance'] },
        { id: 'steady-app',    label: 'Steady 24/7 web application', placeholder: 'Drop here…', accepts: ['EC2 On-Demand'], correct: ['EC2 On-Demand'] },
      ],
    },
  ],
  storage: [
    {
      id: 'storage-build-1',
      title: 'Choose the Right Storage',
      goal: 'Match each storage service to its ideal use case.',
      hint: 'EBS is block storage for a single EC2. EFS mounts to many EC2 instances. S3 is object storage for any data. Glacier is archival.',
      components: ['S3 Standard', 'EBS gp3', 'EFS', 'S3 Glacier'],
      zones: [
        { id: 'ec2-boot',     label: 'EC2 OS boot volume',             placeholder: 'Drop here…', accepts: ['EBS gp3'], correct: ['EBS gp3'] },
        { id: 'shared-files', label: 'Shared files across 10 EC2',      placeholder: 'Drop here…', accepts: ['EFS'], correct: ['EFS'] },
        { id: 'static-web',   label: 'Static website assets',           placeholder: 'Drop here…', accepts: ['S3 Standard'], correct: ['S3 Standard'] },
        { id: 'archive',      label: '7-year compliance archives',       placeholder: 'Drop here…', accepts: ['S3 Glacier'], correct: ['S3 Glacier'] },
      ],
    },
  ],
  databases: [
    {
      id: 'db-build-1',
      title: 'Choose the Right Database',
      goal: 'Match each database service to the workload that fits it best.',
      hint: 'RDS = relational SQL. DynamoDB = NoSQL key-value at scale. ElastiCache = in-memory speed layer. Redshift = analytics/OLAP.',
      components: ['RDS MySQL', 'DynamoDB', 'ElastiCache Redis', 'Redshift'],
      zones: [
        { id: 'transactional', label: 'e-Commerce order transactions', placeholder: 'Drop here…', accepts: ['RDS MySQL'], correct: ['RDS MySQL'] },
        { id: 'session-cache', label: 'User session caching',          placeholder: 'Drop here…', accepts: ['ElastiCache Redis'], correct: ['ElastiCache Redis'] },
        { id: 'iot-scale',     label: 'IoT sensor data at millions/s', placeholder: 'Drop here…', accepts: ['DynamoDB'], correct: ['DynamoDB'] },
        { id: 'analytics',     label: 'Business analytics queries',    placeholder: 'Drop here…', accepts: ['Redshift'], correct: ['Redshift'] },
      ],
    },
  ],
  ha: [
    {
      id: 'ha-build-1',
      title: 'Build a Highly Available App',
      goal: 'Drag the right components to create a multi-AZ, globally distributed architecture.',
      hint: 'Route 53 routes DNS globally. CloudFront caches at the edge. ALB distributes across AZs. ASG handles instance scaling.',
      components: ['Route 53', 'CloudFront', 'ALB', 'ASG', 'EC2 AZ-a', 'EC2 AZ-b'],
      zones: [
        { id: 'dns',        label: 'Global DNS Layer',   placeholder: 'Drop here…', accepts: ['Route 53'], correct: ['Route 53'] },
        { id: 'cdn',        label: 'CDN / Edge Cache',   placeholder: 'Drop here…', accepts: ['CloudFront'], correct: ['CloudFront'] },
        { id: 'lb',         label: 'Load Balancer',      placeholder: 'Drop here…', accepts: ['ALB'], correct: ['ALB'] },
        { id: 'scaling',    label: 'Auto Scaling Group', placeholder: 'Drop here…', accepts: ['ASG'], correct: ['ASG'] },
        { id: 'multi-az',   label: 'Multi-AZ Instances', placeholder: 'Drop here…', accepts: ['EC2 AZ-a', 'EC2 AZ-b'], correct: ['EC2 AZ-a', 'EC2 AZ-b'] },
      ],
    },
  ],
  messaging: [
    {
      id: 'msg-build-1',
      title: 'Design a Decoupled System',
      goal: 'Build a fan-out messaging pattern. One event should trigger multiple downstream consumers simultaneously.',
      hint: 'SNS publishes to multiple SQS queues simultaneously. Lambda processes from SQS. This is the classic fan-out pattern.',
      components: ['API Gateway', 'SNS Topic', 'SQS Queue A', 'SQS Queue B', 'Lambda A', 'Lambda B'],
      zones: [
        { id: 'entry',     label: 'API Entry Point',       placeholder: 'Drop here…', accepts: ['API Gateway'], correct: ['API Gateway'] },
        { id: 'fanout',    label: 'Fan-Out Hub',           placeholder: 'Drop here…', accepts: ['SNS Topic'], correct: ['SNS Topic'] },
        { id: 'queue-a',   label: 'Queue A',               placeholder: 'Drop here…', accepts: ['SQS Queue A'], correct: ['SQS Queue A'] },
        { id: 'queue-b',   label: 'Queue B',               placeholder: 'Drop here…', accepts: ['SQS Queue B'], correct: ['SQS Queue B'] },
        { id: 'processor-a', label: 'Consumer A',          placeholder: 'Drop here…', accepts: ['Lambda A'], correct: ['Lambda A'] },
        { id: 'processor-b', label: 'Consumer B',          placeholder: 'Drop here…', accepts: ['Lambda B'], correct: ['Lambda B'] },
      ],
    },
  ],
  cost: [
    {
      id: 'cost-build-1',
      title: 'Right-Size the Billing Strategy',
      goal: 'Match each pricing model to the correct workload type.',
      hint: 'On-Demand for unpredictable. Reserved for steady 24/7. Spot for fault-tolerant batch. Savings Plans for flexible commitment.',
      components: ['On-Demand', 'Reserved Instance', 'Spot Instance', 'Savings Plan'],
      zones: [
        { id: 'unpredictable', label: 'Unpredictable traffic spikes',    placeholder: 'Drop here…', accepts: ['On-Demand'], correct: ['On-Demand'] },
        { id: 'steady',        label: 'Steady 24/7 production DB',       placeholder: 'Drop here…', accepts: ['Reserved Instance'], correct: ['Reserved Instance'] },
        { id: 'batch',         label: 'Overnight fault-tolerant jobs',   placeholder: 'Drop here…', accepts: ['Spot Instance'], correct: ['Spot Instance'] },
        { id: 'flexible',      label: 'Mixed instance types, any region',placeholder: 'Drop here…', accepts: ['Savings Plan'], correct: ['Savings Plan'] },
      ],
    },
  ],
}

export function ArchitectureBuilder({ domainSlug }) {
  const challenges = CHALLENGES[domainSlug] ?? []
  const [challengeIdx, setChallengeIdx] = useState(0)
  const [zoneContents, setZoneContents] = useState({})  // zoneId → [componentName]
  const [dragging, setDragging] = useState(null)         // component being dragged
  const [dragSource, setDragSource] = useState(null)     // 'palette' or zoneId
  const [revealed, setRevealed] = useState(false)
  const [dragOver, setDragOver] = useState(null)

  const challenge = challenges[challengeIdx]

  const reset = (idx) => {
    setChallengeIdx(idx)
    setZoneContents({})
    setDragging(null)
    setDragSource(null)
    setRevealed(false)
  }

  if (!challenge) return (
    <div style={{
      padding: 28, textAlign: 'center',
      background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--color-border)', color: 'var(--color-text-muted)', fontSize: 13,
    }}>
      Architecture builder challenges coming soon for this domain.
    </div>
  )

  // Which components are still in the palette
  const usedComponents = Object.values(zoneContents).flat()
  const paletteComponents = challenge.components.filter(c => !usedComponents.includes(c))

  // Score each zone
  const zoneResults = challenge.zones.map(zone => {
    const placed = zoneContents[zone.id] ?? []
    const correct = zone.correct
    const allCorrect = correct.every(c => placed.includes(c)) && placed.every(c => correct.includes(c))
    return { zoneId: zone.id, correct: allCorrect, placed }
  })

  const totalCorrect = zoneResults.filter(z => z.correct).length
  const allCorrect = totalCorrect === challenge.zones.length && usedComponents.length > 0
  const anyPlaced = usedComponents.length > 0

  // Drag handlers
  const onDragStartPalette = (comp) => {
    setDragging(comp)
    setDragSource('palette')
  }

  const onDragStartZone = (comp, zoneId) => {
    setDragging(comp)
    setDragSource(zoneId)
  }

  const onDropZone = (zoneId) => {
    if (!dragging) return
    const zone = challenge.zones.find(z => z.id === zoneId)
    if (!zone.accepts.includes(dragging)) {
      setDragging(null); setDragSource(null); setDragOver(null)
      return
    }

    setZoneContents(prev => {
      const next = { ...prev }
      // Remove from source zone if dragged from another zone
      if (dragSource && dragSource !== 'palette') {
        next[dragSource] = (next[dragSource] ?? []).filter(c => c !== dragging)
      }
      next[zoneId] = [...(next[zoneId] ?? []), dragging]
      return next
    })
    setDragging(null); setDragSource(null); setDragOver(null)
  }

  const onDropPalette = () => {
    if (!dragging || dragSource === 'palette') { setDragging(null); setDragOver(null); return }
    // Return to palette
    setZoneContents(prev => {
      const next = { ...prev }
      if (dragSource) next[dragSource] = (next[dragSource] ?? []).filter(c => c !== dragging)
      return next
    })
    setDragging(null); setDragSource(null); setDragOver(null)
  }

  const removeFromZone = (comp, zoneId) => {
    setZoneContents(prev => ({
      ...prev,
      [zoneId]: (prev[zoneId] ?? []).filter(c => c !== comp)
    }))
  }

  return (
    <div>
      {/* Challenge header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <div style={{
          fontSize: 10, fontFamily: 'var(--font-mono)', padding: '3px 10px',
          background: 'rgba(91,156,246,0.1)', border: '1px solid rgba(91,156,246,0.25)',
          borderRadius: 20, color: 'var(--color-info)', fontWeight: 600,
        }}>🏗 Build It</div>
        {challenges.length > 1 && (
          <div style={{ display: 'flex', gap: 5, marginLeft: 'auto' }}>
            {challenges.map((_, i) => (
              <button key={i} onClick={() => reset(i)} style={{
                width: 7, height: 7, borderRadius: '50%', border: 'none', cursor: 'pointer',
                background: i === challengeIdx ? 'var(--color-accent)' : 'var(--color-border-emphasis)',
              }} />
            ))}
          </div>
        )}
      </div>

      {/* Goal card */}
      <div style={{
        background: 'var(--color-surface)', border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)', padding: '14px 16px', marginBottom: 14,
      }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 6 }}>
          {challenge.title}
        </div>
        <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.65, margin: 0 }}>
          {challenge.goal}
        </p>
      </div>

      {/* Instruction */}
      <div style={{
        fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)',
        marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6,
      }}>
        <span style={{ color: 'var(--color-info)' }}>↓</span>
        Drag components from the palette into the correct drop zones
        {anyPlaced && (
          <span style={{ marginLeft: 'auto', color: allCorrect ? 'var(--color-success)' : 'var(--color-text-muted)' }}>
            {totalCorrect}/{challenge.zones.length} zones correct
          </span>
        )}
      </div>

      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
        {/* LEFT: Component palette */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver('palette') }}
          onDrop={onDropPalette}
          onDragLeave={() => setDragOver(null)}
          style={{
            width: 140, flexShrink: 0,
            background: dragOver === 'palette' ? 'var(--color-accent-dim)' : 'var(--color-surface)',
            border: `1px dashed ${dragOver === 'palette' ? 'var(--color-accent)' : 'var(--color-border-emphasis)'}`,
            borderRadius: 'var(--radius-lg)', padding: '10px 8px',
            transition: 'all 150ms ease', minHeight: 200,
          }}
        >
          <div style={{ fontSize: 9, fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 8, textAlign: 'center' }}>
            Components
          </div>
          <div style={{ fontSize: 9, color: 'var(--color-text-muted)', textAlign: 'center', marginBottom: 10 }}>drag to zones →</div>
          {paletteComponents.map((comp) => (
            <div
              key={comp}
              draggable
              onDragStart={() => onDragStartPalette(comp)}
              onDragEnd={() => { setDragging(null); setDragOver(null) }}
              style={{
                padding: '6px 8px', marginBottom: 5,
                background: dragging === comp ? 'var(--color-accent-dim)' : 'var(--color-surface-raised)',
                border: `1px solid ${dragging === comp ? 'var(--color-accent)' : 'var(--color-border-emphasis)'}`,
                borderRadius: 'var(--radius-sm)', fontSize: 11,
                color: 'var(--color-text-primary)', cursor: 'grab',
                userSelect: 'none', transition: 'all 150ms ease',
                opacity: dragging === comp ? 0.5 : 1,
                textAlign: 'center',
              }}
            >
              {comp}
            </div>
          ))}
          {paletteComponents.length === 0 && (
            <div style={{ fontSize: 10, color: 'var(--color-text-muted)', textAlign: 'center', paddingTop: 8 }}>
              All placed!
            </div>
          )}
        </div>

        {/* RIGHT: Drop zones */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {challenge.zones.map((zone) => {
            const placed = zoneContents[zone.id] ?? []
            const result = zoneResults.find(r => r.zoneId === zone.id)
            const isOver = dragOver === zone.id
            const hasItems = placed.length > 0

            let zoneBg = 'var(--color-surface)'
            let zoneBorder = 'var(--color-border-emphasis)'
            let zoneLabel = 'var(--color-text-muted)'

            if (isOver) { zoneBg = 'var(--color-accent-dim)'; zoneBorder = 'var(--color-accent)' }
            else if (revealed || (hasItems && anyPlaced)) {
              if (result.correct) { zoneBg = 'rgba(62,207,142,0.08)'; zoneBorder = 'rgba(62,207,142,0.35)'; zoneLabel = 'var(--color-success)' }
              else if (hasItems) { zoneBg = 'rgba(240,96,96,0.08)'; zoneBorder = 'rgba(240,96,96,0.35)'; zoneLabel = 'var(--color-danger)' }
            }

            const canDrop = dragging && zone.accepts.includes(dragging)

            return (
              <div
                key={zone.id}
                onDragOver={(e) => { if (canDrop) { e.preventDefault(); setDragOver(zone.id) } }}
                onDrop={() => onDropZone(zone.id)}
                onDragLeave={() => setDragOver(null)}
                style={{
                  background: zoneBg, border: `1px dashed ${zoneBorder}`,
                  borderRadius: 'var(--radius-md)', padding: '10px 12px',
                  transition: 'all 150ms ease',
                  minHeight: 54,
                  opacity: (dragging && !canDrop) ? 0.4 : 1,
                }}
              >
                <div style={{
                  fontSize: 10, fontFamily: 'var(--font-mono)', fontWeight: 600,
                  color: zoneLabel, marginBottom: 6,
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                  <span>{zone.label}</span>
                  {hasItems && (result.correct
                    ? <span style={{ color: 'var(--color-success)' }}>✓ correct</span>
                    : revealed ? <span style={{ color: 'var(--color-danger)' }}>✗ wrong</span> : null
                  )}
                </div>

                {placed.length === 0 && (
                  <div style={{ fontSize: 11, color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                    {isOver ? 'Drop here!' : zone.placeholder}
                  </div>
                )}

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                  {placed.map((comp) => (
                    <div
                      key={comp}
                      draggable
                      onDragStart={() => onDragStartZone(comp, zone.id)}
                      onDragEnd={() => { setDragging(null); setDragOver(null) }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 5,
                        padding: '4px 9px',
                        background: result.correct ? 'rgba(62,207,142,0.12)' : 'rgba(255,153,0,0.1)',
                        border: `1px solid ${result.correct ? 'rgba(62,207,142,0.35)' : 'var(--color-accent-border)'}`,
                        borderRadius: 20, fontSize: 11,
                        color: result.correct ? 'var(--color-success)' : 'var(--color-accent)',
                        cursor: 'grab', userSelect: 'none',
                      }}
                    >
                      {comp}
                      <button
                        onClick={(e) => { e.stopPropagation(); removeFromZone(comp, zone.id) }}
                        style={{
                          background: 'none', border: 'none', cursor: 'pointer',
                          color: 'inherit', fontSize: 12, lineHeight: 1, padding: 0, opacity: 0.6,
                        }}
                      >×</button>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Status bar */}
      <div style={{
        marginTop: 14,
        padding: '12px 14px',
        background: allCorrect
          ? 'rgba(62,207,142,0.08)'
          : anyPlaced && totalCorrect > 0
            ? 'rgba(255,153,0,0.07)'
            : 'var(--color-surface)',
        border: `1px solid ${allCorrect ? 'rgba(62,207,142,0.3)' : anyPlaced && totalCorrect > 0 ? 'var(--color-accent-border)' : 'var(--color-border)'}`,
        borderRadius: 'var(--radius-md)', transition: 'all 300ms ease',
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        {allCorrect ? (
          <>
            <span style={{ fontSize: 18 }}>✅</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-success)' }}>Architecture correct!</div>
              <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{challenge.hint}</div>
            </div>
          </>
        ) : (
          <>
            <div style={{ flex: 1 }}>
              {!anyPlaced && <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Drag components from the palette to start building.</span>}
              {anyPlaced && !allCorrect && (
                <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
                  {totalCorrect > 0 ? `${totalCorrect}/${challenge.zones.length} zones correct — keep going!` : 'Some zones are wrong. Check your placement.'}
                </span>
              )}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => { setRevealed(true) }}
                style={{
                  padding: '7px 12px', fontSize: 12,
                  background: 'transparent', border: '1px solid var(--color-border-emphasis)',
                  borderRadius: 'var(--radius-sm)', color: 'var(--color-text-muted)', cursor: 'pointer',
                }}
              >Reveal hint</button>
              <button
                onClick={() => reset(challengeIdx)}
                style={{
                  padding: '7px 12px', fontSize: 12,
                  background: 'var(--color-surface-raised)', border: '1px solid var(--color-border-emphasis)',
                  borderRadius: 'var(--radius-sm)', color: 'var(--color-text-secondary)', cursor: 'pointer',
                }}
              >Reset</button>
            </div>
          </>
        )}
      </div>

      {/* Hint reveal */}
      {revealed && !allCorrect && (
        <div style={{
          marginTop: 10, padding: '10px 14px',
          background: 'var(--color-accent-dim)', border: '1px solid var(--color-accent-border)',
          borderRadius: 'var(--radius-md)', fontSize: 12, color: 'var(--color-text-secondary)', lineHeight: 1.6,
          animation: 'popIn 150ms ease',
        }}>
          <span style={{ fontWeight: 600, color: 'var(--color-accent)', fontFamily: 'var(--font-mono)', fontSize: 10 }}>HINT → </span>
          {challenge.hint}
        </div>
      )}

      {/* Next challenge */}
      {allCorrect && challengeIdx < challenges.length - 1 && (
        <button
          onClick={() => reset(challengeIdx + 1)}
          style={{
            marginTop: 10, width: '100%', padding: '10px',
            background: 'var(--color-accent)', border: 'none',
            borderRadius: 'var(--radius-md)', color: '#000',
            fontSize: 13, fontWeight: 600, cursor: 'pointer',
          }}
        >Next Challenge →</button>
      )}

      <style>{`@keyframes popIn { from { opacity:0;transform:translateY(4px) } to { opacity:1;transform:translateY(0) } }`}</style>
    </div>
  )
}
