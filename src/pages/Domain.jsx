// src/pages/Domain.jsx
// Domain study page — cert-aware, integrates score engine on practice questions.

import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getCert } from '../data/certifications.js'
import TabBar from '../components/TabBar.jsx'
import ConceptMap from '../components/ConceptMap.jsx'
import PracticeQuestion from '../components/PracticeQuestion.jsx'
import ArchitectureTrap from '../components/ArchitectureTrap.jsx'
import AskBar from '../components/AskBar.jsx'
import DomainHeader from '../components/DomainHeader.jsx'
import ScoreBadge from '../components/ScoreBadge.jsx'
import { useScore } from '../hooks/useScore.js'
import { useContent } from '../hooks/useContent.js'

// Lazy-load question JSON for both certs
const questionLoaders = {
  // SAA-C03
  vpc: () => import('../data/questions/vpc.json', { assert: { type: 'json' } }),
  iam: () => import('../data/questions/iam.json', { assert: { type: 'json' } }),
  compute: () => import('../data/questions/compute.json', { assert: { type: 'json' } }),
  storage: () => import('../data/questions/storage.json', { assert: { type: 'json' } }),
  databases: () => import('../data/questions/databases.json', { assert: { type: 'json' } }),
  ha: () => import('../data/questions/ha.json', { assert: { type: 'json' } }),
  messaging: () => import('../data/questions/messaging.json', { assert: { type: 'json' } }),
  cost: () => import('../data/questions/cost.json', { assert: { type: 'json' } }),
  // AIP-C01
  'ai-concepts': () => import('../data/questions/ai-concepts.json', { assert: { type: 'json' } }),
  'gen-ai': () => import('../data/questions/gen-ai.json', { assert: { type: 'json' } }),
  'aws-ai-services': () => import('../data/questions/aws-ai-services.json', { assert: { type: 'json' } }),
  'responsible-ai': () => import('../data/questions/responsible-ai.json', { assert: { type: 'json' } }),
  'ml-fundamentals': () => import('../data/questions/ml-fundamentals.json', { assert: { type: 'json' } }),
  'security-compliance': () => import('../data/questions/security-compliance.json', { assert: { type: 'json' } }),
}

export default function Domain() {
  const { certSlug, domainSlug } = useParams()
  const cert = getCert(certSlug)
  const domain = cert?.domains.find(d => d.slug === domainSlug)

  const [activeTab, setActiveTab] = useState('concepts')
  const [questions, setQuestions] = useState([])

  const { getDomainScore, getDomainCounts, recordAnswer } = useScore(certSlug)
  const { items: notionItems, loading: notionLoading } = useContent(domainSlug, 'question', certSlug)

  // Load seed questions
  useEffect(() => {
    const loader = questionLoaders[domainSlug]
    if (loader) {
      loader().then(m => setQuestions(m.default ?? []))
    }
  }, [domainSlug])

  // Merge Notion questions on top of seed questions (Notion takes priority if available)
  const allQuestions = notionItems.length > 0
    ? notionItems.map(item => ({
        id: item.id,
        question: item.title,
        options: item.options ? item.options.split('\n') : [],
        answer: item.answer ?? 0,
        explanation: item.explanation,
        trap: item.trap,
        difficulty: item.difficulty,
      }))
    : questions

  if (!cert || !domain) return (
    <div style={{ padding: '2rem', color: 'var(--text-muted)' }}>Domain not found.</div>
  )

  const score = getDomainScore(domainSlug)
  const counts = getDomainCounts(domainSlug)

  // AIP doesn't have Architecture Trap/Builder — filter tabs accordingly
  const availableTabs = domain.tabs ?? ['concepts', 'scenarios']

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <DomainHeader domain={domain} certSlug={certSlug}>
        <ScoreBadge score={score} />
        {counts.total > 0 && (
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            {counts.correct}/{counts.total}
          </span>
        )}
      </DomainHeader>

      <TabBar
        tabs={availableTabs}
        active={activeTab}
        onChange={setActiveTab}
        color={domain.color}
      />

      <div style={{ flex: 1, overflow: 'auto', padding: '1rem' }}>
        {activeTab === 'concepts' && (
          <ConceptMap domain={domain} certSlug={certSlug} />
        )}

        {activeTab === 'scenarios' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {allQuestions.length === 0 ? (
              <div style={{ color: 'var(--text-muted)', padding: '1rem', textAlign: 'center' }}>
                {notionLoading ? 'Loading questions…' : 'No questions found for this domain yet.'}
              </div>
            ) : (
              allQuestions.map((q) => (
                <PracticeQuestion
                  key={q.id}
                  question={q}
                  onAnswer={(isCorrect) => recordAnswer(domainSlug, isCorrect)}
                />
              ))
            )}
          </div>
        )}

        {activeTab === 'architecture-trap' && (
          <ArchitectureTrap domain={domain} />
        )}

        {activeTab === 'lab' && (
          <div style={{ color: 'var(--text-muted)', padding: '1rem', fontSize: '0.875rem' }}>
            Lab content for {domain.title} — add via Notion (Type = lab).
          </div>
        )}

        {activeTab === 'cheat-sheet' && (
          <div style={{ color: 'var(--text-muted)', padding: '1rem', fontSize: '0.875rem' }}>
            Cheat sheet for {domain.title} — add via Notion (Type = cheat-sheet).
          </div>
        )}
      </div>

      <AskBar domainSlug={domainSlug} certSlug={certSlug} />
    </div>
  )
}
