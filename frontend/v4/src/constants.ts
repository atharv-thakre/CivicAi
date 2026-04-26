import { Complaint, MetricCard, ActionPlan } from './types';

export const MOCK_METRICS: MetricCard[] = [
  { label: 'Total Complaints', value: 1284, change: '+12%', trend: 'up' },
  { label: 'Pending Response', value: 86, change: '-4%', trend: 'down' },
  { label: 'AI Resolution Rate', value: '72%', change: '+8%', trend: 'up' },
  { label: 'Avg Feedback Score', value: 4.8, change: '+0.2', trend: 'up' },
];

export const MOCK_COMPLAINTS: Complaint[] = [
  {
    id: 'CMP-001',
    title: 'Major Water Leakage on 5th Avenue',
    description: 'A large pipe burst near the intersection, causing flooding and low pressure for residents.',
    category: 'Water & Sanitation',
    status: 'URGENT',
    priority: 'CRITICAL',
    location: 'Sector 4, 5th Avenue',
    timestamp: '2 hours ago',
    aiAnalysis: {
      sentiment: 'Highly Negative',
      suggestedAction: 'Dispatch Emergency Repair Team immediately. Coordinate with traffic police for road closure.',
      confidence: 0.98,
    },
  },
  {
    id: 'CMP-002',
    title: 'Streetlight Maintenance - Downtown Park',
    description: 'Multiple streetlights are flickerring or completely out in the central walking path.',
    category: 'Electricity',
    status: 'PENDING',
    priority: 'MEDIUM',
    location: 'Downtown Park',
    timestamp: '5 hours ago',
    aiAnalysis: {
      sentiment: 'Concerned',
      suggestedAction: 'Schedule maintenance for nighttime inspection.',
      confidence: 0.85,
    },
  },
  {
    id: 'CMP-003',
    title: 'Waste Collection Delay',
    description: 'The garbage truck hasn\'t visited our community for 3 days.',
    category: 'Waste Management',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    location: 'Green Valley Residency',
    timestamp: 'Yesterday',
    aiAnalysis: {
      sentiment: 'Frustrated',
      suggestedAction: 'Re-route nearby truck to Green Valley. Investigate route delay cause.',
      confidence: 0.92,
    },
  },
];

export const MOCK_ACTION_PLANS: ActionPlan[] = [
  {
    id: 'AP-001',
    title: 'Monsoon Flooding Mitigation',
    steps: [
      'De-silt 12 major drains in low-lying areas.',
      'Install 4 high-capacity pump stations at critical junctions.',
      'Deploy 24/7 monitoring teams during peak rainfall.',
      'Public awareness campaign on waste disposal to prevent clogs.'
    ],
    estimatedCost: '$25,000',
    estimatedTime: '15 Days',
    resources: ['Civil Engineering Team', 'Hydraulic Pumps', 'Media Cell'],
  }
];
