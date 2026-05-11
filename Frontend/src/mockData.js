import { Priority, Status } from './types';

export const mockComplaint = {
  id: "GR-2026-0042",
  citizen: "Priya Verma",
  sector: "Sector 4",
  department: "Water",
  priority: Priority.CRITICAL,
  status: Status.IN_PROGRESS,
  currentStep: 1,
  totalSteps: 4,
  predictedEscalation: 87,
  eta: "6 hours",
  budget: 3500,
  vendor: { name: "R.K. Plumbing", responseTime: "2 hrs", contact: "+91-98765-43210" },
  aiTips: ["60% of Sector 4 leaks are main valve issues. Check valve first."],
  riskFlags: [
    "Citizen filed 3 complaints before — high dissatisfaction",
    "Monsoon season — check drainage contamination",
    "2 other complaints within 500m — possible main break"
  ],
  auditChain: [
    { block: 0, action: "SUBMITTED", actor: "CITIZEN", hash: "a7f3...9e2d", prev: "0000...0000", valid: true },
    { block: 1, action: "CLASSIFIED", actor: "AI_AGENT", hash: "b8e1...4c5a", prev: "a7f3...9e2d", valid: true },
    { block: 2, action: "ROUTED", actor: "ROUTER_ENGINE", hash: "c9d2...7f1b", prev: "b8e1...4c5a", valid: true, data: { officerId: "OFF-1129", priority: "HIGH" }, timestamp: "2026-04-26T10:43:17Z" },
    { block: 3, action: "ASSIGNED", actor: "SUPERVISOR", hash: "d0e3...8a2c", prev: "c9d2...7f1b", valid: true },
    { block: 4, action: "RESOLVED", actor: "OFFICER_1129", hash: "e1f4...9b3d", prev: "d0e3...8a2c", valid: true }
  ],
  masterBlock: { hash: "m2c3...9f4a", position: 1247, prev: "m1b2...8e3d" }
};

export const mockPredictions = [
  {
    id: "pred-1",
    title: "Pipe burst in Sector 4-7 cluster",
    probability: 'HIGH',
    confidence: 87,
    affected: 2400,
    trigger: "5 water complaints + monsoon + low pressure"
  },
  {
    id: "pred-2",
    title: "Sanitation strike risk, Ward 12",
    probability: 'MEDIUM',
    confidence: 64,
    affected: 1200,
    trigger: "3 similar precedents"
  }
];

export const mockExpertise = [
  { subject: 'Water', score: 92 },
  { subject: 'Roads', score: 45 },
  { subject: 'Electric', score: 60 },
  { subject: 'Sanit', score: 55 },
];

export const mockPeers = [
  { name: 'You', status: 'Active', time: '4.2 hrs', success: '92%', rank: 1 },
  { name: 'Gupta', status: 'Active', time: '5.1 hrs', success: '88%', rank: 2 },
  { name: 'Rao', status: 'Active', time: '6.8 hrs', success: '79%', rank: 3 },
];
