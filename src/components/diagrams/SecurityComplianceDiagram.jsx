// src/components/diagrams/SecurityComplianceDiagram.jsx — Flowchart for AIP
import { useState } from 'react'

const STEPS = [
  { id: 'shared', label: 'Shared Responsibility', abbr: 'Shared', color: '#185FA5', tip: 'AWS = security OF the cloud (hardware, infra, managed services). Customer = security IN the cloud (data, IAM, app config, encryption choices). For AI: AWS secures Bedrock infra; you secure your prompts and data.', trap: 'For managed AI services (Bedrock), AWS secures the model weights and infrastructure. You are responsible for what data you send in prompts and how you store outputs.' },
  { id: 'encryption', label: 'Data Encryption', abbr: 'Encrypt', color: '#0F6E56', tip: 'At rest: KMS-managed keys (AWS-managed or customer-managed). In transit: TLS 1.2+. Bedrock uses encryption by default. Customer-managed keys give you key rotation control and audit via CloudTrail.', trap: 'Customer-managed KMS keys (CMK) are NOT free — charged per key per month plus API calls. AWS-managed keys are free but you can\'t control rotation timing.' },
  { id: 'iam', label: 'IAM & Access Control', abbr: 'IAM', color: '#534AB7', tip: 'Least privilege: grant only necessary permissions. Service Control Policies (SCPs) in AWS Organizations set guardrails. Bedrock uses IAM resource-based policies. Cross-account access via roles.', trap: 'IAM users are for humans or legacy apps. Use IAM Roles for EC2, Lambda, and service-to-service. Never hardcode credentials.' },
  { id: 'compliance', label: 'Compliance Frameworks', abbr: 'Comply', color: '#854F0B', tip: 'AWS is compliant with SOC 2, ISO 27001, HIPAA, GDPR, FedRAMP and more. Compliance responsibility follows the shared model. AWS Artifact provides compliance reports on demand.', trap: 'AWS being HIPAA-eligible doesn\'t make your application HIPAA-compliant. You must sign a BAA and configure your resources correctly.' },
  { id: 'audit', label: 'Audit & Monitoring', abbr: 'Audit', color: '#993C1D', tip: 'CloudTrail logs all API calls including Bedrock InvokeModel calls. CloudWatch monitors performance and cost. AWS Config tracks resource configuration changes. Security Hub aggregates findings.', trap: 'Bedrock does NOT log prompt/response content by default (privacy protection). Enable model invocation logging to S3/CloudWatch if you need audit trails of AI interactions.' },
]

export function SecurityComplianceDiagram() {
  const [active, setActive] = useState(null)
  const toggle = (id) => setActive(p => p === id ? null : id)
  const current = active ? STEPS.find(s => s.id === active) : null
  const border = 'var(--color-border-emphasis)'
  const surfaceRaised = 'var(--color-surface-raised)'
  const textPrimary = 'var(--color-text-primary)'
  const textSecondary = 'var(--color-text-secondary)'

  return (
    <div>
      <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ color: 'var(--color-accent)' }}>↓</span> Click any pillar — security & compliance for AIF-C01
      </div>
      <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: 14, marginBottom: 12, overflowX: 'auto' }}>
        <svg viewBox="0 0 560 110" style={{ width: '100%', minWidth: 320, display: 'block' }}>
          <defs>
            <marker id="secarr" markerWidth="6" markerHeight="4" refX="6" refY="2" orient="auto">
              <polygon points="0 0,6 2,0 4" fill="var(--color-border-emphasis)" />
            </marker>
          </defs>
          <text x={280} y={18} textAnchor="middle" fill={textSecondary} fontSize={9} fontFamily="var(--font-mono)" fontWeight={600}>SECURITY & COMPLIANCE — AIF-C01</text>
          {STEPS.map((step, i) => {
            const x = 20 + i * 108
            const isActive = active === step.id
            return (
              <g key={step.id} onClick={() => toggle(step.id)} style={{ cursor: 'pointer' }}>
                <rect x={x} y={28} width={96} height={64} rx={8}
                  fill={isActive ? `${step.color}22` : surfaceRaised}
                  stroke={isActive ? step.color : border}
                  strokeWidth={isActive ? 1.5 : 1} />
                <text x={x + 48} y={52} textAnchor="middle" dominantBaseline="middle"
                  fill={isActive ? step.color : textPrimary}
                  fontSize={9} fontFamily="var(--font-mono)" fontWeight={700}>{step.abbr}</text>
                <text x={x + 48} y={68} textAnchor="middle" dominantBaseline="middle"
                  fill={textSecondary} fontSize={7} fontFamily="var(--font-mono)">{step.label.split(' ')[0]}</text>
              </g>
            )
          })}
        </svg>
      </div>
      <div style={{ minHeight: 80, background: 'var(--color-surface)', border: `1px solid ${current ? 'var(--color-accent-border)' : border}`, borderRadius: 'var(--radius-md)', padding: '12px 14px', transition: 'border-color 200ms ease' }}>
        {!current && <p style={{ fontSize: 12, color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>← Select a pillar above to see exam notes</p>}
        {current && (<>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7 }}>
            <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', padding: '2px 8px', background: `${current.color}18`, border: `1px solid ${current.color}44`, borderRadius: 20, color: current.color }}>{current.abbr}</span>
            <span style={{ fontSize: 13, fontWeight: 500, color: textPrimary }}>{current.label}</span>
          </div>
          <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: 8 }}>{current.tip}</p>
          <div style={{ padding: '6px 10px', background: 'var(--color-warning-dim)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: 'var(--radius-sm)', fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--color-warning)' }}>Exam trap: {current.trap}</div>
        </>)}
      </div>
    </div>
  )
}
export default SecurityComplianceDiagram
