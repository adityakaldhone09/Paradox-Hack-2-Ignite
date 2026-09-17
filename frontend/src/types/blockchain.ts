export interface BlockchainStatus {
  network: string;
  chain_id: number;
  contract_address: string;
  latest_block_number: number;
  total_transactions: number;
  is_connected: boolean;
  mode: 'live' | 'mock';
}

export interface BlockchainBlock {
  block_number: number;
  block_hash: string;
  previous_hash: string;
  timestamp: string;
  transaction_count: number;
  transactions?: BlockchainTransaction[];
}

export interface BlockchainTransaction {
  tx_hash: string;
  block_number: number;
  event_type: string;
  paper_id?: string;
  actor: string;
  centre_id?: string;
  device_id?: string;
  timestamp: string;
  payload_hash: string;
  previous_hash?: string;
  signature?: string;
  status: 'CONFIRMED' | 'PENDING' | 'FAILED';
}
