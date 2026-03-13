// ─────────────────────────────────────────────────────────────────────────────
// AI Provider Configuration
// ─────────────────────────────────────────────────────────────────────────────
// This is the single file you change when building V2 (Nova on AWS Bedrock).
// Everything else in the codebase stays identical.
//
// V1 (current):  provider: 'anthropic'  → uses @anthropic-ai/sdk
// V2 (Phase 5):  provider: 'bedrock'    → uses @aws-sdk/client-bedrock-runtime
// ─────────────────────────────────────────────────────────────────────────────

export const AI_CONFIG = {
  // Toggle this to switch providers: 'anthropic' | 'bedrock'
  provider: 'anthropic',

  anthropic: {
    model: 'claude-haiku-4-5',
    maxTokens: 600,
    // Prompt caching: the domain system prompt block is cached after first call.
    // Cost impact: cached tokens billed at 10% of normal input rate.
    // ~500 token system prompt × 1000 queries × 90% cache hit = ~$0.04 saved/month
    cacheSystemPrompt: true,
  },

  // ── V2 Nova config (uncomment when building Bedrock version) ───────────────
  // bedrock: {
  //   model: 'amazon.nova-pro-v1:0',
  //   region: process.env.AWS_REGION || 'us-east-1',
  //   maxTokens: 600,
  //   // Nova uses different auth: IAM role → access keys → SigV4 signing
  //   // You'll need: bedrock:InvokeModel permission on the IAM role
  // },
}

// Per-session query cap — prevents surprise bills if app goes public
export const SESSION_QUERY_LIMIT = 25