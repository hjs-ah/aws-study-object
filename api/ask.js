// api/ask.js — Vercel serverless function
// AI tutor endpoint. Reads provider from config.js — swap between Anthropic and Bedrock
// by changing the single line in config.js. Frontend never changes.

import { DOMAIN_SYSTEM_PROMPTS } from './prompts.js'
import { AI_CONFIG, SESSION_QUERY_LIMIT } from './config.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { question, domainSlug, certSlug, sessionCount } = req.body

  if (!question || !domainSlug) {
    return res.status(400).json({ error: 'question and domainSlug are required' })
  }

  if (sessionCount > SESSION_QUERY_LIMIT) {
    return res.status(429).json({
      error: `Session limit of ${SESSION_QUERY_LIMIT} questions reached. Refresh to continue.`,
    })
  }

  const systemPrompt = DOMAIN_SYSTEM_PROMPTS[domainSlug]
  if (!systemPrompt) {
    return res.status(400).json({ error: `Unknown domain: ${domainSlug}` })
  }

  try {
    if (AI_CONFIG.provider === 'bedrock') {
      return await handleBedrock({ question, systemPrompt, res })
    } else {
      return await handleAnthropic({ question, systemPrompt, res })
    }
  } catch (err) {
    console.error('AI API error:', err?.message ?? err)
    return res.status(500).json({ error: 'AI request failed. Please try again.', detail: process.env.NODE_ENV !== 'production' ? String(err) : undefined })
  }
}

// ── Anthropic direct (current default) ───────────────────────────────────────
async function handleAnthropic({ question, systemPrompt, res }) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: AI_CONFIG.anthropic.model,
      max_tokens: AI_CONFIG.anthropic.maxTokens,
      system: [
        {
          type: 'text',
          text: systemPrompt,
          cache_control: { type: 'ephemeral' }, // prompt caching — saves ~90% on repeated domain queries
        },
      ],
      messages: [{ role: 'user', content: question }],
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`Anthropic error ${response.status}: ${err}`)
  }

  const data = await response.json()
  return res.status(200).json({
    answer: data.content[0].text,
    usage: { inputTokens: data.usage.input_tokens, outputTokens: data.usage.output_tokens },
  })
}

// ── AWS Bedrock / Nova (V2 — activate by setting provider: 'bedrock' in config.js) ──
async function handleBedrock({ question, systemPrompt, res }) {
  const { BedrockRuntimeClient, InvokeModelCommand } = await import('@aws-sdk/client-bedrock-runtime')

  const bedrock = new BedrockRuntimeClient({
    region: AI_CONFIG.bedrock.region,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  })

  const payload = {
    messages: [{ role: 'user', content: [{ text: question }] }],
    system: [{ text: systemPrompt }],
    inferenceConfig: { maxNewTokens: AI_CONFIG.bedrock.maxTokens },
  }

  const command = new InvokeModelCommand({
    modelId: AI_CONFIG.bedrock.model,
    body: JSON.stringify(payload),
    contentType: 'application/json',
    accept: 'application/json',
  })

  const raw = await bedrock.send(command)
  const result = JSON.parse(Buffer.from(raw.body).toString())

  return res.status(200).json({
    answer: result.output.message.content[0].text,
    usage: {
      inputTokens: result.usage.inputTokens,
      outputTokens: result.usage.outputTokens,
    },
  })
}
