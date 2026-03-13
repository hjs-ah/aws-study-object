// api/ask.js — Vercel serverless function
// Handles all AI queries from the ask bar. Domain-scoped system prompt.
// ─────────────────────────────────────────────────────────────────────────────
// V2 NOVA SWAP: Replace the handler body with the Bedrock version below.
// The request/response shape stays identical — frontend never changes.
// ─────────────────────────────────────────────────────────────────────────────

import Anthropic from '@anthropic-ai/sdk'
import { DOMAIN_SYSTEM_PROMPTS } from './prompts.js'
import { AI_CONFIG, SESSION_QUERY_LIMIT } from './config.js'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { question, domainSlug, sessionCount } = req.body

  if (!question || !domainSlug) {
    return res.status(400).json({ error: 'question and domainSlug are required' })
  }

  // ── Rate limit guard ───────────────────────────────────────────────────────
  if (sessionCount > SESSION_QUERY_LIMIT) {
    return res.status(429).json({
      error: `Session limit of ${SESSION_QUERY_LIMIT} questions reached. Refresh to continue.`
    })
  }

  const systemPrompt = DOMAIN_SYSTEM_PROMPTS[domainSlug]
  if (!systemPrompt) {
    return res.status(400).json({ error: `Unknown domain: ${domainSlug}` })
  }

  try {
    // ── V1: Anthropic Claude (current) ────────────────────────────────────────
    const response = await client.messages.create({
      model: AI_CONFIG.anthropic.model,
      max_tokens: AI_CONFIG.anthropic.maxTokens,
      system: [
        {
          type: 'text',
          text: systemPrompt,
          // Prompt caching: this block is identical on every call for a given
          // domain, so Anthropic caches it after the first request.
          // Saves ~90% on system prompt token cost across repeated queries.
          ...(AI_CONFIG.anthropic.cacheSystemPrompt && {
            cache_control: { type: 'ephemeral' }
          }),
        },
      ],
      messages: [{ role: 'user', content: question }],
    })

    return res.status(200).json({
      answer: response.content[0].text,
      usage: {
        inputTokens: response.usage.input_tokens,
        outputTokens: response.usage.output_tokens,
        cacheReadTokens: response.usage.cache_read_input_tokens ?? 0,
      },
    })

  } catch (err) {
    console.error('AI API error:', err)
    return res.status(500).json({ error: 'AI request failed. Please try again.' })
  }

  // ── V2 NOVA SWAP — replace the try/catch above with this block ─────────────
  //
  // import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime'
  //
  // const bedrock = new BedrockRuntimeClient({
  //   region: AI_CONFIG.bedrock.region,
  //   credentials: {
  //     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  //     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  //   },
  // })
  //
  // const payload = {
  //   messages: [{ role: 'user', content: [{ text: question }] }],
  //   system: [{ text: systemPrompt }],
  //   inferenceConfig: { maxNewTokens: AI_CONFIG.bedrock.maxTokens },
  // }
  //
  // const command = new InvokeModelCommand({
  //   modelId: AI_CONFIG.bedrock.model,
  //   body: JSON.stringify(payload),
  //   contentType: 'application/json',
  //   accept: 'application/json',
  // })
  //
  // const raw = await bedrock.send(command)
  // const result = JSON.parse(Buffer.from(raw.body).toString())
  //
  // return res.status(200).json({
  //   answer: result.output.message.content[0].text,
  //   usage: { inputTokens: result.usage.inputTokens, outputTokens: result.usage.outputTokens }
  // })
  // ─────────────────────────────────────────────────────────────────────────────
}
