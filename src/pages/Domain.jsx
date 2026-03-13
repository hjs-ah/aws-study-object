// src/pages/Domain.jsx
import { useState } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { getDomain } from '../data/domains.js'
import { useContent } from '../hooks/useContent.js'
import { DomainHeader } from '../components/DomainHeader.jsx'
import { TabBar } from '../components/TabBar.jsx'
import { ConceptMap } from '../components/ConceptMap.jsx'
import { PracticeQuestion } from '../components/PracticeQuestion.jsx'
import { ArchitectureTrap } from '../components/ArchitectureTrap.jsx'
import { ArchitectureBuilder } from '../components/ArchitectureBuilder.jsx'
import { AskBar } from '../components/AskBar.jsx'

export function Domain({ getDomainProgress, recordAnswer }) {
  const { slug } = useParams()
  const domain = getDomain(slug)
  const [activeTab, setActiveTab] = useState('Concept map')
  const [currentQ, setCurrentQ] = useState(0)

  const { questions, loading, source, notionConfigured } = useContent(
    activeTab === 'Scenarios' ? slug : null
  )

  if (!domain) return <Navigate to="/app" replace />

  const progress = getDomainProgress(slug)

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    setCurrentQ(0)
  }

  const handleAnswer = (correct) => {
    if (!questions?.[currentQ]) return
    recordAnswer(slug, questions[currentQ].id, correct)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <div style={{ flex: 1, overflowY: 'auto' }} className="domain-header-wrap">
        <DomainHeader
          domain={domain}
          progress={progress}
          source={source}
          notionConfigured={notionConfigured}
        />

        <TabBar tabs={domain.tabs} activeTab={activeTab} onTabChange={handleTabChange} />

        <div style={{ padding: '16px 20px' }}>

          {activeTab === 'Concept map' && <ConceptMap domain={domain} />}

          {activeTab === 'Architecture Trap' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div>
              <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 10 }}>🔍 Spot the Flaw</div>
              <ArchitectureTrap domainSlug={slug} />
            </div>
            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 20 }}>
              <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 10 }}>🏗 Build It Right</div>
              <ArchitectureBuilder domainSlug={slug} />
            </div>
          </div>
        )}

          {activeTab === 'Scenarios' && (
            <div>
              {loading && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 20, color: 'var(--color-text-muted)', fontSize: 13 }}>
                  <div style={{ width: 14, height: 14, border: '2px solid var(--color-border-emphasis)', borderTopColor: 'var(--color-accent)', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                  Loading questions…
                </div>
              )}
              {!loading && questions?.length === 0 && (
                <div style={{ padding: 24, textAlign: 'center', background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', color: 'var(--color-text-muted)', fontSize: 13 }}>
                  No questions found for {domain.title} yet.
                  <br />
                  <span style={{ fontSize: 11, marginTop: 6, display: 'block', fontFamily: 'var(--font-mono)' }}>
                    Add rows to your Notion database with Domain = {slug} and Type = question
                  </span>
                </div>
              )}
              {!loading && questions?.length > 0 && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                    <span style={{ fontSize: 12, color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
                      {currentQ + 1} / {questions.length}
                      {source && <span style={{ marginLeft: 8, opacity: 0.6 }}>· {source === 'notion' ? 'from Notion' : 'seed data'}</span>}
                    </span>
                    <div style={{ display: 'flex', gap: 5 }}>
                      {questions.map((q, i) => (
                        <button key={i} onClick={() => setCurrentQ(i)} style={{
                          width: 7, height: 7, borderRadius: '50%', border: 'none',
                          background: i === currentQ ? 'var(--color-accent)' : progress.answeredQuestions?.[q.id] ? 'var(--color-success)' : 'var(--color-border-emphasis)',
                          cursor: 'pointer', transition: 'background 200ms ease',
                        }} />
                      ))}
                    </div>
                  </div>
                  <PracticeQuestion key={questions[currentQ].id} question={questions[currentQ]} onAnswer={handleAnswer} />
                  <div style={{ marginTop: 12, textAlign: 'right' }}>
                    <button
                      onClick={() => setCurrentQ((n) => Math.min(n + 1, questions.length - 1))}
                      disabled={currentQ >= questions.length - 1}
                      style={{ padding: '8px 16px', background: 'transparent', border: '1px solid var(--color-border-emphasis)', borderRadius: 'var(--radius-sm)', color: 'var(--color-text-secondary)', fontSize: 13, cursor: 'pointer', opacity: currentQ >= questions.length - 1 ? 0.4 : 1 }}
                    >Skip →</button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'Lab guide' && <LabGuide slug={slug} />}
          {activeTab === 'Cheat sheet' && <CheatSheet slug={slug} />}

        </div>
      </div>

      <AskBar domainSlug={slug} domainTitle={domain.title} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

function LabGuide({ slug }) {
  const { questions: items, loading, source } = useContent(slug, 'lab')
  return <NotionContentPane items={items} loading={loading} source={source} slug={slug} type="lab" emptyMsg="Lab guides coming soon — add rows with Type = lab in Notion." />
}

function CheatSheet({ slug }) {
  const { questions: items, loading, source } = useContent(slug, 'cheat-sheet')
  return <NotionContentPane items={items} loading={loading} source={source} slug={slug} type="cheat-sheet" emptyMsg="Cheat sheets coming soon — add rows with Type = cheat-sheet in Notion." />
}

function NotionContentPane({ items, loading, source, emptyMsg }) {
  if (loading) return <div style={{ color: 'var(--color-text-muted)', fontSize: 13, padding: 20 }}>Loading…</div>
  if (!items?.length) return (
    <div style={{ padding: 24, textAlign: 'center', background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', color: 'var(--color-text-muted)', fontSize: 13 }}>
      {emptyMsg}
    </div>
  )
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {source && <div style={{ fontSize: 11, color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)', marginBottom: 4 }}>Source: {source}</div>}
      {items.map((item) => (
        <div key={item.id} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '14px 16px' }}>
          <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: 8 }}>{item.question}</div>
          {item.body && <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.65, whiteSpace: 'pre-wrap' }}>{item.body}</p>}
        </div>
      ))}
    </div>
  )
}
