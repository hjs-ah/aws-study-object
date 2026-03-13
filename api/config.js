// api/config.js — AI Provider Configuration
// ─────────────────────────────────────────────────────────────────────────────
// THE ONLY FILE YOU TOUCH to switch from Anthropic → AWS Bedrock.
// Change `provider` below and add the three AWS env vars to Vercel. Done.
//
//   V1 (current):  provider: 'anthropic'  → Claude Haiku via Anthropic API
//   V2 (Nova):     provider: 'bedrock'    → Nova Lite via AWS Bedrock
// ─────────────────────────────────────────────────────────────────────────────

export const AI_CONFIG = {

  // ── TOGGLE THIS to switch providers ───────────────────────────────────────
  provider: 'bedrock',   // ← SWITCHED TO NOVA LITE on AWS Bedrock

  // ── Anthropic (V1 — fallback) ──────────────────────────────────────────────
  anthropic: {
    model: 'claude-haiku-4-5-20251001',  // correct dated snapshot
    maxTokens: 600,
  },

  // ── AWS Bedrock / Nova Lite (V2 — ACTIVE) ─────────────────────────────────
  // Env vars required in Vercel:
  //   AWS_ACCESS_KEY_ID      → from IAM user with bedrock:InvokeModel
  //   AWS_SECRET_ACCESS_KEY  → from same IAM user
  //   AWS_REGION             → us-east-1
  //
  // Nova Lite pricing: $0.06/1M input · $0.24/1M output (~13× cheaper than Haiku)
  bedrock: {
    model: process.env.AWS_BEDROCK_MODEL || 'amazon.nova-lite-v1:0',
    region: process.env.AWS_REGION || 'us-east-1',
    maxTokens: 600,
  },
}

// Per-session query cap — prevents surprise bills if app goes public
export const SESSION_QUERY_LIMIT = 25
