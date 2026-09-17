export type IncidentSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type IncidentStatus = 'OPEN' | 'INVESTIGATING' | 'ACKNOWLEDGED' | 'RESOLVED';

export interface SecurityIncident {
  id: string;
  incident_id: string;
  type: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  paper_id?: string;
  centre_id?: string;
  device_id?: string;
  user_id?: string;
  timestamp: string;
  description: string;
  blockchain_tx_hash?: string;
  resolution_notes?: string;
}

export interface IncidentCreateInput {
  type: string;
  severity: IncidentSeverity;
  description: string;
  paper_id?: string;
  centre_id?: string;
  device_id?: string;
}
