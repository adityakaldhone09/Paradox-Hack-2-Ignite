export interface SecuritySummary {
  active_examinations: number;
  secured_papers: number;
  authorized_centres: number;
  successful_accesses: number;
  blocked_attempts: number;
  security_alerts: number;
  integrity_violations: number;
  blockchain_transactions: number;
  threat_level: 'NORMAL' | 'ELEVATED' | 'HIGH' | 'CRITICAL';
  access_series?: Array<{
    label: string;
    successful: number;
    blocked: number;
  }>;
}

export interface SecurityHeatmapPoint {
  centre_id: string;
  centre_name: string;
  lat?: number;
  lng?: number;
  risk_score: number;
  incident_count: number;
  status: 'SAFE' | 'WARNING' | 'CRITICAL';
}

export interface ThreatFeedItem {
  id: string;
  timestamp: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  type: string;
  description: string;
  source: string;
  centre_id?: string;
  paper_id?: string;
}
