import { UserRole, PaperStatus, SecurityLevel, BlockchainEventType, IncidentType, IncidentSeverity } from '../constants';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  centreId?: string;
  isActive: boolean;
  createdAt: string;
}

export interface Examination {
  id: string;
  examId: string;
  name: string;
  department: string;
  subject: string;
  examType: string;
  examDate: string;
  startTime: string;
  endTime: string;
  securityLevel: SecurityLevel;
  totalPapers: number;
  assignedCentresCount: number;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
}

export interface Paper {
  id: string;
  paperId: string;
  examId: string;
  title: string;
  fileName: string;
  fileSize: number;
  sha256Hash: string;
  encryptionStatus: 'ENCRYPTED_AES_256_GCM' | 'PLAINTEXT_ERROR';
  blockchainTxHash?: string;
  blockchainBlockNumber?: number;
  version: string;
  status: PaperStatus;
  releaseTime?: string;
  createdBy: string;
  createdAt: string;
  approvedBy?: string;
  approvedAt?: string;
  assignedCentres: string[];
  revocationReason?: string;
}

export interface Centre {
  id: string;
  centreId: string;
  name: string;
  city: string;
  state: string;
  code: string;
  isAuthorized: boolean;
  authorizedDevicesCount: number;
  assignedExamsCount: number;
  status: 'ACTIVE' | 'FLAGGED' | 'SUSPENDED';
  createdAt: string;
}

export interface AuthorizedDevice {
  id: string;
  deviceId: string;
  deviceFingerprint: string;
  centreId: string;
  deviceName: string;
  os: string;
  ipAddress: string;
  status: 'AUTHORIZED' | 'PENDING' | 'REVOKED';
  registeredAt: string;
  lastSeen: string;
}

export interface CustodyEvent {
  id: string;
  eventId: string;
  paperId: string;
  eventType: BlockchainEventType;
  actor: string;
  centreId?: string;
  deviceId?: string;
  timestamp: string;
  txHash: string;
  blockNumber: number;
  result: 'SUCCESS' | 'BLOCKED' | 'ALERT';
  metadata: string;
}

export interface BlockchainTransaction {
  txHash: string;
  blockNumber: number;
  eventType: BlockchainEventType;
  paperId: string;
  actor: string;
  centreId?: string;
  deviceId?: string;
  timestamp: string;
  payloadHash: string;
  previousHash: string;
  signature: string;
  status: 'CONFIRMED' | 'PENDING' | 'FAILED';
}

export interface SecurityIncident {
  id: string;
  incidentId: string;
  type: IncidentType;
  severity: IncidentSeverity;
  paperId?: string;
  centreId?: string;
  userId?: string;
  deviceId?: string;
  timestamp: string;
  description: string;
  status: 'OPEN' | 'INVESTIGATING' | 'ACKNOWLEDGED' | 'RESOLVED';
  blockchainTxHash?: string;
  resolutionNotes?: string;
}

export interface DashboardSummary {
  activeExaminations: number;
  securedPapers: number;
  authorizedCentres: number;
  successfulAccesses: number;
  blockedAttempts: number;
  securityAlerts: number;
  integrityViolations: number;
  blockchainTransactions: number;
  threatLevel: 'NORMAL' | 'ELEVATED' | 'HIGH' | 'CRITICAL';
  accessSeries: Array<{
    label: string;
    successful: number;
    blocked: number;
  }>;
}
