export type PaperStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'APPROVED'
  | 'ASSIGNED'
  | 'RELEASE_SCHEDULED'
  | 'RELEASED'
  | 'REVOKED';

export interface Paper {
  id: string;
  paper_id: string;
  exam_id: string;
  exam_code?: string;
  title: string;
  file_name: string;
  file_size: number;
  sha256_hash: string;
  encryption_status?: string;
  blockchain_tx_hash?: string;
  blockchain_block_number?: number;
  version: string;
  status: PaperStatus;
  release_time?: string;
  created_by: string;
  created_at: string;
  approved_by?: string;
  approved_at?: string;
  digital_signature?: string;
  revocation_reason?: string;
  assigned_centres?: string[];
}

export interface PaperVerificationResult {
  paper_id: string;
  verified: boolean;
  tampered: boolean;
  sha256_hash: string;
  blockchain_hash?: string;
  status: string;
  timestamp: string;
  details?: string;
}

export interface ChainOfCustodyRecord {
  paper_id: string;
  title: string;
  current_status: PaperStatus;
  sha256_hash: string;
  events: Array<{
    event_id: string;
    event_type: string;
    actor: string;
    timestamp: string;
    tx_hash: string;
    block_number: number;
    result: string;
    details?: string;
  }>;
}
