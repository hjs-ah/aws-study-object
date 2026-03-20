// src/components/diagrams/AWSAIServicesDiagram.jsx — Structural for AIP
import { useState } from 'react'

const COMPONENTS = {
  bedrock: { label: 'Amazon Bedrock', abbr: 'Bedrock', tip: 'Fully managed FMs from Anthropic, Meta, Mistral, AI21, Stability AI, Amazon. No infrastructure. Knowledge Bases (RAG), Agents (tool use), Guardrails (safety), Model Eval. Pay per token.', trap: 'Bedrock is not just one model — it\'s a marketplace of models. Exam tests which model/feature to choose for a given use case.' },
  sagemaker: { label: 'SageMaker', abbr: 'SM', tip: 'Full ML platform: Studio IDE, Data Wrangler, Feature Store, Training, Hyperparameter Tuning, Endpoints, Pipelines, Model Monitor. Use when you need custom model training.', trap: 'SageMaker ≠ Bedrock. Bedrock = use pre-built foundation models. SageMaker = build/train/deploy your own models. Exam tests this distinction.' },
  rekognition: { label: 'Rekognition', abbr: 'Rekog', tip: 'Computer vision. Detects objects, faces, text, moderation labels, celebrities in images/video. Custom Labels for domain-specific objects. Real-time video analysis via Kinesis.', trap: 'Rekognition does NOT generate images. It analyzes existing images. For image generation, use Stability AI models via Bedrock.' },
  textract: { label: 'Textract', abbr: 'Txtract', tip: 'Extracts text AND structure from documents (forms, tables, PDFs). Goes beyond OCR — understands document layout, key-value pairs, and table structure. Async for large documents.', trap: 'Textract ≠ Comprehend. Textract = extract text/structure FROM documents. Comprehend = understand/analyze text (sentiment, entities, topics).' },
  comprehend: { label: 'Comprehend', abbr: 'Cmprhnd', tip: 'NLP service. Detects: sentiment, key phrases, entities (people, places, org), language, PII. Custom classification and entity recognition. Medical variant (Comprehend Medical) for healthcare.', trap: 'Comprehend does not generate text. It analyzes existing text. For text generation, use Bedrock.' },
  lex: { label: 'Lex / Transcribe / Polly', abbr: 'Lex+', tip: 'Lex = conversational chatbots (same tech as Alexa). Transcribe = speech-to-text (ASR). Polly = text-to-speech (TTS). Often combined: Transcribe (voice in) → Lex (intent) → Polly (voice out).', trap: 'Lex is for building bots with intents and slots. It is NOT a general-purpose chatbot — it requires you to define the conversation flows.' },
}

export function AWSAIServicesDiagram() {
  const [active, setActive] = useState(null)
  const toggle = (key) => setActive(p => p === key ? null : key)
  const comp = active ? COMPONENTS[active] : null
  const border = 'var(--color-border-emphasis)'
  const surfaceRaised = 'var(--color-surface-raised)'
  const accent = 'var(--color-accent)'
  const accentDim = 'var(--color-accent-dim)'
  const textPrimary = 'var(--color-text-primary)'
  const textSecondary = 'var(--color-text-secondary)'

  const Chip = ({ id, x, y, w = 80, h = 32 }) => {
    const c = COMPONENTS[id]; const isActive = active === id
    return (
      <g onClick={() => toggle(id)} style={{ cursor: 'pointer' }}>
        <rect x={x} y={y} width={w} height={h} rx={6} fill={isActive ? accentDim : surfaceRaised} stroke={isActive ? accent : border} strokeWidth={isActive ? 1.5 : 1} />
        <text x={x + w/2} y={y + h/2 + 1} textAnchor="middle" dominantBaseline="middle" fill={isActive ? accent : textPrimary} fontSize={9} fontFamily="var(--font-mono)" fontWeight={isActive ? 700 : 500}>{c.abbr}</text>
      </g>
    )
  }

  return (
    <div>
      <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ color: accent }}>↓</span> Click any service to see exam notes
      </div>
      <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: 14, marginBottom: 12, overflowX: 'auto' }}>
        <svg viewBox="0 0 560 250" style={{ width: '100%', minWidth: 320, display: 'block' }}>
          <rect x={8} y={8} width={544} height={234} rx={10} fill="none" stroke={border} strokeWidth={1} strokeDasharray="6 3" />
          <text x={18} y={24} fill={textSecondary} fontSize={9} fontFamily="var(--font-mono)" fontWeight={600}>AWS AI SERVICES — AIF-C01 DOMAIN</text>

          {/* Foundation model layer */}
          <rect x={20} y={32} width={520} height={60} rx={7} fill="rgba(79,142,247,0.06)" stroke="rgba(79,142,247,0.25)" strokeWidth={1} />
          <text x={30} y={46} fill={textSecondary} fontSize={9} fontFamily="var(--font-mono)" fontWeight={600}>FOUNDATION MODELS / CUSTOM ML</text>
          <Chip id="bedrock" x={80} y={48} w={90} h={32} />
          <Chip id="sagemaker" x={210} y={48} w={80} h={32} />

          {/* Vision */}
          <rect x={20} y={106} width={165} height={60} rx={7} fill="rgba(62,207,142,0.05)" stroke="rgba(62,207,142,0.25)" strokeWidth={1} />
          <text x={30} y={120} fill={textSecondary} fontSize={9} fontFamily="var(--font-mono)" fontWeight={600}>VISION</text>
          <Chip id="rekognition" x={40} y={124} w={90} h={30} />

          {/* Document */}
          <rect x={200} y={106} width={165} height={60} rx={7} fill="rgba(91,156,246,0.05)" stroke="rgba(91,156,246,0.25)" strokeWidth={1} />
          <text x={210} y={120} fill={textSecondary} fontSize={9} fontFamily="var(--font-mono)" fontWeight={600}>DOCUMENTS</text>
          <Chip id="textract" x={220} y={124} w={90} h={30} />

          {/* NLP */}
          <rect x={380} y={106} width={160} height={60} rx={7} fill="rgba(83,74,183,0.05)" stroke="rgba(83,74,183,0.25)" strokeWidth={1} />
          <text x={390} y={120} fill={textSecondary} fontSize={9} fontFamily="var(--font-mono)" fontWeight={600}>NLP</text>
          <Chip id="comprehend" x={400} y={124} w={100} h={30} />

          {/* Voice */}
          <rect x={20} y={180} width={520} height={44} rx={7} fill="rgba(245,158,11,0.05)" stroke="rgba(245,158,11,0.25)" strokeWidth={1} />
          <text x={30} y={194} fill={textSecondary} fontSize={9} fontFamily="var(--font-mono)" fontWeight={600}>CONVERSATIONAL / VOICE</text>
          <Chip id="lex" x={180} y={190} w={120} h={28} />
        </svg>
      </div>
      <div style={{ minHeight: 80, background: 'var(--color-surface)', border: `1px solid ${comp ? 'var(--color-accent-border)' : 'var(--color-border)'}`, borderRadius: 'var(--radius-md)', padding: '12px 14px', transition: 'border-color 200ms ease' }}>
        {!comp && <p style={{ fontSize: 12, color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>← Select a service above to see exam notes and traps</p>}
        {comp && (<>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7 }}>
            <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', padding: '2px 8px', background: 'var(--color-accent-dim)', border: '1px solid var(--color-accent-border)', borderRadius: 20, color: accent }}>{comp.abbr}</span>
            <span style={{ fontSize: 13, fontWeight: 500, color: textPrimary }}>{comp.label}</span>
          </div>
          <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: 8 }}>{comp.tip}</p>
          <div style={{ padding: '6px 10px', background: 'var(--color-warning-dim)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: 'var(--radius-sm)', fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--color-warning)' }}>Exam trap: {comp.trap}</div>
        </>)}
      </div>
    </div>
  )
}
export default AWSAIServicesDiagram
