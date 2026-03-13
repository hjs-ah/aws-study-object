// src/data/certifications.js
// Master certification registry. Add new certs here — everything else reads from this.

export const CERTIFICATIONS = [
  {
    slug: 'saa-c03',
    title: 'AWS Solutions Architect',
    subtitle: 'Associate',
    examCode: 'SAA-C03',
    description: 'Design resilient, high-performing, secure, and cost-optimized architectures on AWS.',
    color: '#185FA5',
    accentColor: '#1a6fc4',
    icon: '🏗️',
    questionCount: 130,
    passingScore: 72,
    domains: [
      { slug: 'vpc',       title: 'VPC & Networking',   weight: 20, color: '#185FA5' },
      { slug: 'iam',       title: 'IAM & Security',     weight: 16, color: '#534AB7' },
      { slug: 'compute',   title: 'Compute',             weight: 15, color: '#0F6E56' },
      { slug: 'storage',   title: 'Storage',             weight: 14, color: '#854F0B' },
      { slug: 'databases', title: 'Databases',           weight: 13, color: '#993C1D' },
      { slug: 'ha',        title: 'HA & Resilience',    weight: 12, color: '#3B6D11' },
      { slug: 'messaging', title: 'Messaging',           weight: 6,  color: '#5F5E5A' },
      { slug: 'cost',      title: 'Cost & Ops',         weight: 4,  color: '#444441' },
    ],
  },
  {
    slug: 'aip-c01',
    title: 'AWS AI Practitioner',
    subtitle: 'Foundational',
    examCode: 'AIF-C01',
    description: 'Demonstrate knowledge of AI/ML concepts, AWS AI services, and responsible AI practices.',
    color: '#0F6E56',
    accentColor: '#138a6a',
    icon: '🤖',
    questionCount: 85,
    passingScore: 70,
    domains: [
      { slug: 'ai-concepts',        title: 'AI & ML Concepts',      weight: 20, color: '#0F6E56' },
      { slug: 'gen-ai',             title: 'Generative AI',          weight: 24, color: '#534AB7' },
      { slug: 'aws-ai-services',    title: 'AWS AI Services',        weight: 28, color: '#185FA5' },
      { slug: 'responsible-ai',     title: 'Responsible AI',         weight: 14, color: '#993C1D' },
      { slug: 'ml-fundamentals',    title: 'ML Fundamentals',        weight: 8,  color: '#854F0B' },
      { slug: 'security-compliance',title: 'Security & Compliance',  weight: 6,  color: '#3B6D11' },
    ],
  },
]

export const getCert = (slug) => CERTIFICATIONS.find((c) => c.slug === slug)
export const getCertDomain = (certSlug, domainSlug) =>
  getCert(certSlug)?.domains.find((d) => d.slug === domainSlug)
