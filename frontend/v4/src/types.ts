export type ComplaintStatus = 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'URGENT';

export interface Complaint {
  id: string;
  title: string;
  description: string;
  category: string;
  status: ComplaintStatus;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  location: string;
  timestamp: string;
  aiAnalysis?: {
    sentiment: string;
    suggestedAction: string;
    confidence: number;
    duplicateId?: string;
  };
}

export interface MetricCard {
  label: string;
  value: string | number;
  change: string;
  trend: 'up' | 'down' | 'neutral';
}

export interface ActionPlan {
  id: string;
  title: string;
  steps: string[];
  estimatedCost: string;
  estimatedTime: string;
  resources: string[];
}
