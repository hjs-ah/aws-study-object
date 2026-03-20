// src/components/ConceptMap.jsx
// Routes domain slug to the correct diagram component.
// Also fetches Notion "concept" rows and renders them below the diagram.

import { VPCDiagram } from './diagrams/VPCDiagram.jsx'
import { IAMDiagram } from './diagrams/IAMDiagram.jsx'
import { ComputeDiagram } from './diagrams/ComputeDiagram.jsx'
import { StorageDiagram } from './diagrams/StorageDiagram.jsx'
import { DatabasesDiagram } from './diagrams/DatabasesDiagram.jsx'
import { HADiagram } from './diagrams/HADiagram.jsx'
import { MessagingDiagram } from './diagrams/MessagingDiagram.jsx'
import { CostDiagram } from './diagrams/CostDiagram.jsx'
import { AIConceptsDiagram } from './diagrams/AIConceptsDiagram.jsx'
import { GenAIDiagram } from './diagrams/GenAIDiagram.jsx'
import { AWSAIServicesDiagram } from './diagrams/AWSAIServicesDiagram.jsx'
import { ResponsibleAIDiagram } from './diagrams/ResponsibleAIDiagram.jsx'
import { MLFundamentalsDiagram } from './diagrams/MLFundamentalsDiagram.jsx'
import { SecurityComplianceDiagram } from './diagrams/SecurityComplianceDiagram.jsx'
import { GlossaryTerms } from './GlossaryTerms.jsx'
import { useContent } from '../hooks/useContent.js'

const DIAGRAM_MAP = {
  // SAA-C03
  vpc:       VPCDiagram,
  iam:       IAMDiagram,
  compute:   ComputeDiagram,
  storage:   StorageDiagram,
  databases: DatabasesDiagram,
  ha:        HADiagram,
  messaging: MessagingDiagram,
  cost:      CostDiagram,
  // AIP-C01
  'ai-concepts':         AIConceptsDiagram,
  'gen-ai':              GenAIDiagram,
  'aws-ai-services':     AWSAIServicesDiagram,
  'responsible-ai':      ResponsibleAIDiagram,
  'ml-fundamentals':     MLFundamentalsDiagram,
  'security-compliance': SecurityComplianceDiagram,
}

// Renders concept rows fetched from Notion below the diagram
function NotionConcepts({ domainSlug, certSlug }) {
  const { items, loading, source } = useContent(domainSlug, 'concept', certSlug)

  if (loading) return (
    <div style={{ marginTop: 16, fontSize: 12, color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
      Loading Notion concepts…
    </div>
  )

  if (!items.length) return null

  return (
    <div style={{ marginTop: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'var(--font-mono)' }}>
          Notion Concepts
        </span>
        <span style={{ fontSize: 10, padding: '1px 7px', borderRadius: 20, background: 'rgba(62,207,142,0.1)', border: '1px solid rgba(62,207,142,0.3)', color: 'var(--color-success)', fontFamily: 'var(--font-mono)' }}>
          {items.length} live
        </span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {items.map(item => (
          <div key={item.id} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 10, padding: '12px 14px' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 6 }}>{item.title}</div>
            {item.body && <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.65, margin: 0 }}>{item.body}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}

export function ConceptMap({ domain, certSlug }) {
  const DiagramComponent = DIAGRAM_MAP[domain.slug]

  return (
    <div>
      {DiagramComponent
        ? <DiagramComponent domain={domain} />
        : (
          <div style={{ padding: '1rem', color: 'var(--color-text-muted)', fontSize: 13 }}>
            No diagram available for this domain yet.
          </div>
        )
      }
      <GlossaryTerms domainSlug={domain.slug} />
      <NotionConcepts domainSlug={domain.slug} certSlug={certSlug} />
    </div>
  )
}

export default ConceptMap
