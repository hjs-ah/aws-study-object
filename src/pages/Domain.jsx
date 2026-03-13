// src/pages/Domain.jsx — Domain study page with all tabs restored

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

const questionLoaders = {
  vpc: () => import('../data/questions/vpc.json', { assert: { type: 'json' } }),
  iam: () => import('../data/questions/iam.json', { assert: { type: 'json' } }),
  compute: () => import('../data/questions/compute.json', { assert: { type: 'json' } }),
  storage: () => import('../data/questions/storage.json', { assert: { type: 'json' } }),
  databases: () => import('../data/questions/databases.json', { assert: { type: 'json' } }),
  ha: () => import('../data/questions/ha.json', { assert: { type: 'json' } }),
  messaging: () => import('../data/questions/messaging.json', { assert: { type: 'json' } }),
  cost: () => import('../data/questions/cost.json', { assert: { type: 'json' } }),
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

  useEffect(() => {
    const loader = questionLoaders[domainSlug]
    if (loader) loader().then(m => setQuestions(m.default ?? []))
  }, [domainSlug])

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
    <div style={{ padding: '2rem', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Domain not found.</div>
  )

  const score = getDomainScore(domainSlug)
  const counts = getDomainCounts(domainSlug)
  const availableTabs = domain.tabs ?? ['concepts', 'scenarios']

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <DomainHeader domain={domain} certSlug={certSlug}>
        <ScoreBadge score={score} />
        {counts.total > 0 && (
          <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
            {counts.correct}/{counts.total}
          </span>
        )}
      </DomainHeader>

      <TabBar tabs={availableTabs} active={activeTab} onChange={setActiveTab} color={domain.color} />

      <div style={{ flex: 1, overflow: 'auto', padding: '1.25rem' }}>
        {activeTab === 'concepts' && <ConceptMap domain={domain} certSlug={certSlug} />}

        {activeTab === 'scenarios' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {allQuestions.length === 0 ? (
              <div style={{ color: 'var(--color-text-muted)', padding: '2rem', textAlign: 'center', fontSize: '0.875rem' }}>
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

        {activeTab === 'architecture-trap' && <ArchitectureTrap domain={domain} />}

        {activeTab === 'lab' && (
          <div style={{ color: 'var(--color-text-muted)', padding: '1.25rem', fontSize: '0.875rem', lineHeight: 1.6 }}>
            <div style={{ marginBottom: '0.5rem', fontSize: '1rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>🧪 Lab Guide</div>
            Lab content for <strong>{domain.title}</strong> — add via Notion (Type = lab).
          </div>
        )}
      </div>

      <AskBar domainSlug={domainSlug} certSlug={certSlug} />
    </div>
  )
}
