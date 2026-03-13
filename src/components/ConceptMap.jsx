// src/components/ConceptMap.jsx
import { VPCDiagram } from './diagrams/VPCDiagram.jsx'
import { IAMDiagram } from './diagrams/IAMDiagram.jsx'
import { GenericDiagram } from './diagrams/GenericDiagram.jsx'

const DIAGRAM_MAP = {
  vpc: VPCDiagram,
  iam: IAMDiagram,
  // Phase 3: ComputeDiagram, StorageDiagram, DatabasesDiagram, HADiagram, MessagingDiagram, CostDiagram
}

export function ConceptMap({ domain }) {
  const DiagramComponent = DIAGRAM_MAP[domain.slug] ?? GenericDiagram
  return <DiagramComponent domain={domain} />
}
