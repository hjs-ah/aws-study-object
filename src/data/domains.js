// src/data/domains.js
const ALL_TABS = ['Concept map', 'Scenarios', 'Architecture Trap', 'Lab guide', 'Cheat sheet']

export const DOMAINS = [
  { slug: 'vpc',       title: 'VPC & Networking',  shortTitle: 'VPC',       weight: 20, color: '#185FA5', description: 'Subnets, routing, security groups, load balancers, connectivity',         concepts: 8,  questionCount: 24, tabs: ALL_TABS },
  { slug: 'iam',       title: 'IAM & Security',    shortTitle: 'IAM',       weight: 16, color: '#534AB7', description: 'Roles, policies, STS, KMS, Cognito, GuardDuty',                        concepts: 7,  questionCount: 20, tabs: ALL_TABS },
  { slug: 'compute',   title: 'Compute',            shortTitle: 'Compute',   weight: 15, color: '#0F6E56', description: 'EC2, Lambda, ECS, EKS, Auto Scaling, Beanstalk',                       concepts: 9,  questionCount: 22, tabs: ALL_TABS },
  { slug: 'storage',   title: 'Storage',            shortTitle: 'Storage',   weight: 14, color: '#854F0B', description: 'S3, EBS, EFS, Glacier, Storage Gateway',                              concepts: 7,  questionCount: 20, tabs: ALL_TABS },
  { slug: 'databases', title: 'Databases',          shortTitle: 'Databases', weight: 13, color: '#993C1D', description: 'RDS, Aurora, DynamoDB, ElastiCache, Redshift',                        concepts: 8,  questionCount: 22, tabs: ALL_TABS },
  { slug: 'ha',        title: 'HA & Resilience',   shortTitle: 'HA',        weight: 12, color: '#3B6D11', description: 'Load balancers, Auto Scaling, Route 53, CloudFront, DR',              concepts: 7,  questionCount: 18, tabs: ALL_TABS },
  { slug: 'messaging', title: 'Messaging',          shortTitle: 'Messaging', weight: 6,  color: '#5F5E5A', description: 'SQS, SNS, EventBridge, Kinesis',                                     concepts: 5,  questionCount: 14, tabs: ALL_TABS },
  { slug: 'cost',      title: 'Cost & Ops',        shortTitle: 'Cost & Ops', weight: 4, color: '#444441', description: 'Pricing models, CloudWatch, CloudTrail, Config, Trusted Advisor',     concepts: 6,  questionCount: 12, tabs: ALL_TABS },
]

export const getDomain = (slug) => DOMAINS.find((d) => d.slug === slug)
export const getTotalQuestions = () => DOMAINS.reduce((sum, d) => sum + d.questionCount, 0)
