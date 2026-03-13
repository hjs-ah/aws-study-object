// src/components/ConceptMap.jsx
import { VPCDiagram } from './diagrams/VPCDiagram.jsx'
import { IAMDiagram } from './diagrams/IAMDiagram.jsx'
import { GenericDiagram } from './diagrams/GenericDiagram.jsx'
import { GlossaryTerms } from './GlossaryTerms.jsx'

const DIAGRAM_MAP = {
  vpc: VPCDiagram,
  iam: IAMDiagram,
}

export function ConceptMap({ domain }) {
  const DiagramComponent = DIAGRAM_MAP[domain.slug] ?? GenericDiagram
  return (
    <div>
      <DiagramComponent domain={domain} />
      <GlossaryTerms domainSlug={domain.slug} />
    </div>
  )
}
