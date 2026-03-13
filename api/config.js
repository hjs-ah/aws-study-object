// api/config.js — AI Provider Configuration
// ─────────────────────────────────────────────────────────────────────────────
// THE ONLY FILE YOU TOUCH to switch from Anthropic → AWS Bedrock.
// Change `provider` below and add the three AWS env vars to Vercel. Done.
//
//   'anthropic' (current):  Claude Haiku via Anthropic API — just needs ANTHROPIC_API_KEY
//   'bedrock'   (V2):       Nova Lite via AWS Bedrock — needs AWS_ACCESS_KEY_ID,
//                           AWS_SECRET_ACCESS_KEY, AWS_REGION=us-east-1
// ─────────────────────────────────────────────────────────────────────────────

export const AI_CONFIG = {

  // ── TOGGLE THIS to switch providers ───────────────────────────────────────
  provider: 'anthropic',   // ← 'anthropic' | 'bedrock'

  // ── Anthropic (current default) ────────────────────────────────────────────
  anthropic: {
    model: 'claude-haiku-4-5-20251001',  // dated snapshot required — undated alias fails
    maxTokens: 600,
  },

  // ── AWS Bedrock / Nova Lite (V2) ───────────────────────────────────────────
  // Nova Lite pricing: $0.06/1M input · $0.24/1M output (~13× cheaper than Haiku)
  bedrock: {
    model: process.env.AWS_BEDROCK_MODEL || 'amazon.nova-lite-v1:0',
    region: process.env.AWS_REGION || 'us-east-1',
    maxTokens: 600,
  },
}

// Per-session query cap — prevents surprise bills if app goes public
export const SESSION_QUERY_LIMIT = 25
