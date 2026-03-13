// src/data/certifications.js
// Master certification registry. Add new certs here — everything else reads from this.

const SAA_TABS = ['concepts', 'scenarios', 'architecture-trap', 'lab']
const AIP_TABS = ['concepts', 'scenarios', 'lab']

export const CERTIFICATIONS = [
  {
    slug: 'saa-c03',
    title: 'AWS Solutions Architect',
    subtitle: 'Associate',
    examCode: 'SAA-C03',
    description: 'Design resilient, high-performing, secure, and cost-optimized architectures on AWS.',
    color: '#ff9900',
    accentColor: '#e68a00',
    icon: '🏗️',
    questionCount: 130,
    passingScore: 72,
    domains: [
      { slug: 'vpc',       title: 'VPC & Networking',   shortTitle: 'VPC',        weight: 20, color: '#185FA5', questionCount: 24, tabs: SAA_TABS },
      { slug: 'iam',       title: 'IAM & Security',     shortTitle: 'IAM',        weight: 16, color: '#534AB7', questionCount: 20, tabs: SAA_TABS },
      { slug: 'compute',   title: 'Compute',             shortTitle: 'Compute',    weight: 15, color: '#0F6E56', questionCount: 22, tabs: SAA_TABS },
      { slug: 'storage',   title: 'Storage',             shortTitle: 'Storage',    weight: 14, color: '#854F0B', questionCount: 20, tabs: SAA_TABS },
      { slug: 'databases', title: 'Databases',           shortTitle: 'Databases',  weight: 13, color: '#993C1D', questionCount: 22, tabs: SAA_TABS },
      { slug: 'ha',        title: 'HA & Resilience',    shortTitle: 'HA',         weight: 12, color: '#3B6D11', questionCount: 18, tabs: SAA_TABS },
      { slug: 'messaging', title: 'Messaging',           shortTitle: 'Messaging',  weight: 6,  color: '#5F5E5A', questionCount: 14, tabs: SAA_TABS },
      { slug: 'cost',      title: 'Cost & Ops',         shortTitle: 'Cost & Ops', weight: 4,  color: '#444441', questionCount: 12, tabs: SAA_TABS },
    ],
  },
  {
    slug: 'aip-c01',
    title: 'AWS AI Practitioner',
    subtitle: 'Foundational',
    examCode: 'AIF-C01',
    description: 'Demonstrate knowledge of AI/ML concepts, AWS AI services, and responsible AI practices.',
    color: '#4f8ef7',
    accentColor: '#3a7ef0',
    icon: '🤖',
    questionCount: 85,
    passingScore: 70,
    domains: [
      { slug: 'ai-concepts',         title: 'AI & ML Concepts',     shortTitle: 'AI Concepts',   weight: 20, color: '#0F6E56', questionCount: 15, tabs: AIP_TABS },
      { slug: 'gen-ai',              title: 'Generative AI',         shortTitle: 'Generative AI', weight: 24, color: '#534AB7', questionCount: 20, tabs: AIP_TABS },
      { slug: 'aws-ai-services',     title: 'AWS AI Services',       shortTitle: 'AI Services',   weight: 28, color: '#185FA5', questionCount: 22, tabs: AIP_TABS },
      { slug: 'responsible-ai',      title: 'Responsible AI',        shortTitle: 'Resp. AI',      weight: 14, color: '#993C1D', questionCount: 12, tabs: AIP_TABS },
      { slug: 'ml-fundamentals',     title: 'ML Fundamentals',       shortTitle: 'ML Funds.',     weight: 8,  color: '#854F0B', questionCount: 9,  tabs: AIP_TABS },
      { slug: 'security-compliance', title: 'Security & Compliance', shortTitle: 'Security',      weight: 6,  color: '#3B6D11', questionCount: 7,  tabs: AIP_TABS },
    ],
  },
]

export const getCert = (slug) => CERTIFICATIONS.find((c) => c.slug === slug)
export const getCertDomain = (certSlug, domainSlug) =>
  getCert(certSlug)?.domains.find((d) => d.slug === domainSlug)
