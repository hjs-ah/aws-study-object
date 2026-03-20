// src/components/diagrams/HADiagram.jsx — Structural diagram
import { useState } from 'react'

const COMPONENTS = {
  alb: { label: 'Application Load Balancer', abbr: 'ALB', tip: 'Layer 7 HTTP/HTTPS. Path-based and host-based routing. Supports WebSocket and HTTP/2. Sticky sessions via cookies. Fixed DNS name (no static IP).', trap: 'ALB has no static IP — it uses a DNS name. Use NLB if you need static IPs or TCP-level routing.' },
  nlb: { label: 'Network Load Balancer', abbr: 'NLB', tip: 'Layer 4 TCP/UDP. Handles millions of requests per second. Static IP per AZ (can assign Elastic IP). Ultra-low latency. Use for gaming, IoT, real-time.', trap: 'NLB does NOT do HTTP routing. If your use case needs path or host routing, ALB is the answer.' },
  asg: { label: 'Auto Scaling Group', abbr: 'ASG', tip: 'Maintains desired instance count. Health checks terminate and replace unhealthy instances. Launch Templates define instance config. Cooldown prevents rapid scaling thrashing.', trap: 'ASG scaling IN (removing instances) has a default 300-second cooldown. Scaling OUT can happen faster. Adjust cooldowns for your use case.' },
  r53: { label: 'Route 53 Routing', abbr: 'R53', tip: 'Weighted: split traffic by %. Latency: route to lowest RTT region. Failover: primary/secondary with health checks. Geolocation: by country/continent. Geoproximity: with bias.', trap: 'Geolocation ≠ Geoproximity. Geolocation routes by user\'s exact location. Geoproximity uses a configurable bias to shift traffic between regions.' },
  cf: { label: 'CloudFront', abbr: 'CF', tip: '400+ edge locations. OAC for S3 origin access control. TTL controls cache duration. Lambda@Edge for compute at edge. CloudFront Functions for lightweight request/response manipulation.', trap: 'CloudFront is a CDN — it caches content. It is NOT a load balancer. Don\'t confuse with Global Accelerator, which routes TCP/UDP to the nearest region.' },
  ga: { label: 'Global Accelerator', abbr: 'GA', tip: 'Static anycast IPs. Routes TCP/UDP to the nearest AWS region via AWS backbone. Instant failover. Not a CDN — no caching. Good for non-HTTP or latency-sensitive apps.', trap: 'Global Accelerator ≠ CloudFront. GA = network layer routing. CF = HTTP CDN with caching. GA has fixed IPs; CF has a DNS name.' },
  dr: { label: 'DR Strategies', abbr: 'DR', tip: 'Backup & Restore: cheapest, highest RTO. Pilot Light: minimal core running, scale on disaster. Warm Standby: scaled-down full copy. Multi-Site Active-Active: highest cost, lowest RTO/RPO.', trap: 'Know the 4 strategies in order of RTO/RPO and cost. Exam often asks which to use given a budget or RTO requirement.' },
}

export function HADiagram() {
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
        <text x={x + w/2} y={y + h/2 + 1} textAnchor="middle" dominantBaseline="middle" fill={isActive ? accent : textPrimary} fontSize={10} fontFamily="var(--font-mono)" fontWeight={isActive ? 700 : 500}>{c.abbr}</text>
      </g>
    )
  }

  return (
    <div>
      <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ color: accent }}>↓</span> Click any service to see exam notes
      </div>
      <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: 14, marginBottom: 12, overflowX: 'auto' }}>
        <svg viewBox="0 0 560 260" style={{ width: '100%', minWidth: 320, display: 'block' }}>
          <rect x={8} y={8} width={544} height={244} rx={10} fill="none" stroke={border} strokeWidth={1} strokeDasharray="6 3" />
          <text x={18} y={24} fill={textSecondary} fontSize={9} fontFamily="var(--font-mono)" fontWeight={600}>HIGH AVAILABILITY & RESILIENCE — SAA-C03 DOMAIN</text>

          {/* Global layer */}
          <rect x={20} y={32} width={520} height={56} rx={7} fill="rgba(83,74,183,0.05)" stroke="rgba(83,74,183,0.25)" strokeWidth={1} />
          <text x={30} y={46} fill={textSecondary} fontSize={9} fontFamily="var(--font-mono)" fontWeight={600}>GLOBAL EDGE</text>
          <Chip id="r53" x={60} y={50} w={80} h={28} />
          <Chip id="cf" x={170} y={50} w={70} h={28} />
          <Chip id="ga" x={270} y={50} w={80} h={28} />

          {/* Load balancing */}
          <rect x={20} y={102} width={340} height={56} rx={7} fill="rgba(91,156,246,0.05)" stroke="rgba(91,156,246,0.25)" strokeWidth={1} />
          <text x={30} y={116} fill={textSecondary} fontSize={9} fontFamily="var(--font-mono)" fontWeight={600}>LOAD BALANCING</text>
          <Chip id="alb" x={50} y={120} w={80} h={28} />
          <Chip id="nlb" x={160} y={120} w={80} h={28} />

          {/* Scaling */}
          <rect x={375} y={102} width={165} height={56} rx={7} fill="rgba(62,207,142,0.05)" stroke="rgba(62,207,142,0.25)" strokeWidth={1} />
          <text x={385} y={116} fill={textSecondary} fontSize={9} fontFamily="var(--font-mono)" fontWeight={600}>SCALING</text>
          <Chip id="asg" x={405} y={120} w={80} h={28} />

          {/* DR */}
          <rect x={20} y={172} width={520} height={56} rx={7} fill="rgba(240,96,96,0.05)" stroke="rgba(240,96,96,0.2)" strokeWidth={1} />
          <text x={30} y={186} fill={textSecondary} fontSize={9} fontFamily="var(--font-mono)" fontWeight={600}>DISASTER RECOVERY — cost ↑ · RTO ↓</text>
          <Chip id="dr" x={160} y={188} w={90} h={28} />
          <text x={290} y={205} fill={textSecondary} fontSize={8} fontFamily="var(--font-mono)">Backup → Pilot Light → Warm Standby → Active-Active</text>
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
export default HADiagram
