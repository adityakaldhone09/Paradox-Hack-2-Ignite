export interface AuditReport {
  paper_id: string;
  paper_title: string;
  generated_at: string;
  total_events: number;
  cryptographic_integrity: {
    hash_verified: boolean;
    digital_signature_valid: boolean;
    blockchain_anchored: boolean;
    tamper_detected: boolean;
  };
  chain_of_custody_timeline: Array<{
    timestamp: string;
    event_type: string;
    actor: string;
    centre_id?: string;
    device_id?: string;
    tx_hash: string;
    block_number: number;
    result: string;
  }>;
  summary_hash: string;
}
