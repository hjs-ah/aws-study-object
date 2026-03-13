// src/pages/Domain.jsx
import { useState } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { getDomain } from '../data/domains.js'
import { DomainHeader } from '../components/DomainHeader.jsx'
import { TabBar } from '../components/TabBar.jsx'
import { ConceptMap } from '../components/ConceptMap.jsx'
import { PracticeQuestion } from '../components/PracticeQuestion.jsx'
import { AskBar } from '../components/AskBar.jsx'

// Lazy-load question data per domain
const questionModules = {
  vpc: () => import('../data/questions/vpc.json'),
  // Phase 2: add remaining domains here
  // iam: () => import('../data/questions/iam.json'),
  // compute: () => import('../data/questions/compute.json'),
}

export function Domain({ getDomainProgress, recordAnswer }) {
  const { slug } = useParams()
  const domain = getDomain(slug)

  const [activeTab, setActiveTab] = useState('Concept map')
  const [questions, setQuestions] = useState(null)
  const [currentQ, setCurrentQ] = useState(0)

  if (!domain) return <Navigate to="/" replace />

  const progress = getDomainProgress(slug)

  const loadQuestions = async () => {
    if (questions !== null) return
    const loader = questionModules[slug]
    if (!loader) { setQuestions([]); return }
    const mod = await loader()
    setQuestions(mod.default)
    setCurrentQ(0)
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    if (tab === 'Scenarios') loadQuestions()
  }

  const handleAnswer = (correct) => {
    if (!questions?.[currentQ]) return
    recordAnswer(slug, questions[currentQ].id, correct)
  }

  const handleNext = () => {
    if (questions && currentQ < questions.length - 1) {
      setCurrentQ((n) => n + 1)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      {/* Scrollable content area */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <DomainHeader domain={domain} progress={progress} />

        <TabBar tabs={domain.tabs} activeTab={activeTab} onTabChange={handleTabChange} />

        <div style={{ padding: '20px 28px' }}>

          {activeTab === 'Concept map' && (
            <ConceptMap domain={domain} />
          )}

          {activeTab === 'Scenarios' && (
            <div>
              {questions === null && (
                <div style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>Loading questions…</div>
              )}
              {questions?.length === 0 && (
                <div style={{
                  padding: '24px', textAlign: 'center',
                  background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text-muted)', fontSize: 13,
                }}>
                  Questions for {domain.title} coming in Phase 2
                </div>
              )}
              {questions?.length > 0 && (
                <div>
                  <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    marginBottom: 14,
                  }}>
                    <span style={{ fontSize: 12, color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
                      {currentQ + 1} / {questions.length}
                    </span>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {questions.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentQ(i)}
                          style={{
                            width: 7, height: 7,
                            borderRadius: '50%',
                            border: 'none',
                            background: i === currentQ
                              ? 'var(--color-accent)'
                              : progress.answeredQuestions?.[questions[i].id]
                                ? 'var(--color-success)'
                                : 'var(--color-border-emphasis)',
                            cursor: 'pointer',
                            transition: 'var(--transition)',
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  <PracticeQuestion
                    key={questions[currentQ].id}
                    question={questions[currentQ]}
                    onAnswer={handleAnswer}
                  />
                  <div style={{ marginTop: 12, textAlign: 'right' }}>
                    <button
                      onClick={handleNext}
                      disabled={currentQ >= questions.length - 1}
                      style={{
                        padding: '8px 16px',
                        background: 'transparent',
                        border: '1px solid var(--color-border-emphasis)',
                        borderRadius: 'var(--radius-sm)',
                        color: 'var(--color-text-secondary)',
                        fontSize: 13, cursor: 'pointer',
                      }}
                    >
                      Skip →
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'Lab guide' && (
            <div style={{
              padding: '24px', textAlign: 'center',
              background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text-muted)', fontSize: 13,
            }}>
              Hands-on lab guides — Phase 3 (Notion CMS)
            </div>
          )}

          {activeTab === 'Cheat sheet' && (
            <div style={{
              padding: '24px', textAlign: 'center',
              background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text-muted)', fontSize: 13,
            }}>
              Printable cheat sheets — Phase 3 (Notion CMS)
            </div>
          )}

        </div>
      </div>

      {/* Ask bar — pinned to bottom */}
      <AskBar domainSlug={slug} domainTitle={domain.title} />
    </div>
  )
}
