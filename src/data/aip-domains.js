// src/data/aip-domains.js
// AIP-C01 domain definitions with tabs config (subset of SAA tabs — no Architecture Trap/Builder for AIP)

const AIP_TABS = ['concepts', 'scenarios', 'lab', 'cheat-sheet']

export const AIP_DOMAINS = [
  {
    slug: 'ai-concepts',
    title: 'AI & ML Concepts',
    shortTitle: 'AI Concepts',
    weight: 20,
    color: '#0F6E56',
    description: 'Supervised vs unsupervised, classification, regression, clustering, model evaluation metrics',
    concepts: 6,
    questionCount: 18,
    tabs: AIP_TABS,
  },
  {
    slug: 'gen-ai',
    title: 'Generative AI',
    shortTitle: 'Gen AI',
    weight: 24,
    color: '#534AB7',
    description: 'Foundation models, LLMs, RAG, prompt engineering, hallucination, fine-tuning',
    concepts: 8,
    questionCount: 20,
    tabs: AIP_TABS,
  },
  {
    slug: 'aws-ai-services',
    title: 'AWS AI Services',
    shortTitle: 'AI Services',
    weight: 28,
    color: '#185FA5',
    description: 'Bedrock, SageMaker, Comprehend, Rekognition, Lex, Textract, Polly, Transcribe, Kendra',
    concepts: 10,
    questionCount: 24,
    tabs: AIP_TABS,
  },
  {
    slug: 'responsible-ai',
    title: 'Responsible AI',
    shortTitle: 'Responsible AI',
    weight: 14,
    color: '#993C1D',
    description: 'Bias, fairness, explainability, transparency, human oversight, Bedrock Guardrails',
    concepts: 6,
    questionCount: 12,
    tabs: AIP_TABS,
  },
  {
    slug: 'ml-fundamentals',
    title: 'ML Fundamentals',
    shortTitle: 'ML Basics',
    weight: 8,
    color: '#854F0B',
    description: 'Training/validation/test splits, hyperparameters, SageMaker Autopilot, model tuning',
    concepts: 5,
    questionCount: 8,
    tabs: AIP_TABS,
  },
  {
    slug: 'security-compliance',
    title: 'Security & Compliance',
    shortTitle: 'Security',
    weight: 6,
    color: '#3B6D11',
    description: 'Shared responsibility for AI, CloudTrail, IAM for Bedrock, PII handling, Guardrails',
    concepts: 4,
    questionCount: 6,
    tabs: AIP_TABS,
  },
]

export const getAIPDomain = (slug) => AIP_DOMAINS.find((d) => d.slug === slug)
