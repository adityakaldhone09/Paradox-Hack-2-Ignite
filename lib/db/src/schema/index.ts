import { pgTable, text, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// 1. Users Table
export const users = pgTable("users", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  hashedPassword: text("hashed_password").notNull(),
  role: text("role").notNull(), // SUPER_ADMIN, EXAM_AUTHORITY, etc.
  centreId: text("centre_id"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// 2. Examinations Table
export const examinations = pgTable("examinations", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  examId: text("exam_id").notNull().unique(),
  name: text("name").notNull(),
  department: text("department").notNull(),
  subject: text("subject").notNull(),
  examType: text("exam_type").default("FINAL"),
  examDate: text("exam_date").notNull(), // YYYY-MM-DD
  startTime: text("start_time").notNull(), // HH:MM:SS
  endTime: text("end_time").notNull(),
  securityLevel: text("security_level").default("HIGH"),
  status: text("status").default("SCHEDULED"), // SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// 3. Papers Table
export const papers = pgTable("papers", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  paperId: text("paper_id").notNull().unique(),
  examId: text("exam_id").notNull(),
  title: text("title").notNull(),
  fileName: text("file_name").notNull(),
  fileSize: integer("file_size").default(0),
  sha256Hash: text("sha256_hash").notNull(),
  encryptedFilePath: text("encrypted_file_path").notNull(),
  encryptionIv: text("encryption_iv").notNull(),
  encryptionTag: text("encryption_tag").notNull(),
  version: text("version").default("1.0"),
  status: text("status").default("DRAFT"), // DRAFT, APPROVED, ASSIGNED, RELEASED, REVOKED
  releaseTime: timestamp("release_time", { withTimezone: true }),
  createdBy: text("created_by").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  approvedBy: text("approved_by"),
  approvedAt: timestamp("approved_at", { withTimezone: true }),
  digitalSignature: text("digital_signature"),
  revocationReason: text("revocation_reason"),
});

// 4. Centres Table
export const centres = pgTable("centres", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  centreId: text("centre_id").notNull().unique(),
  name: text("name").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  code: text("code").notNull().unique(),
  isAuthorized: boolean("is_authorized").default(true),
  status: text("status").default("ACTIVE"), // ACTIVE, FLAGGED, SUSPENDED
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// 5. Authorized Devices Table
export const authorizedDevices = pgTable("authorized_devices", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  deviceId: text("device_id").notNull().unique(),
  deviceFingerprint: text("device_fingerprint").notNull(),
  centreId: text("centre_id").notNull(),
  deviceName: text("device_name").notNull(),
  os: text("os").default("Windows 11"),
  ipAddress: text("ip_address").default("127.0.0.1"),
  status: text("status").default("AUTHORIZED"), // AUTHORIZED, PENDING, REVOKED
  registeredAt: timestamp("registered_at", { withTimezone: true }).defaultNow(),
  lastSeen: timestamp("last_seen", { withTimezone: true }).defaultNow(),
});

// 6. Paper Centre Assignments Table
export const paperCentreAssignments = pgTable("paper_centre_assignments", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  paperId: text("paper_id").notNull(),
  centreId: text("centre_id").notNull(),
  releaseWindowStart: timestamp("release_window_start", { withTimezone: true }).notNull(),
  releaseWindowEnd: timestamp("release_window_end", { withTimezone: true }).notNull(),
  status: text("status").default("ASSIGNED"), // ASSIGNED, READY, ACCESSED, CANCELLED
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// 7. Access Events Table
export const accessEvents = pgTable("access_events", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  paperId: text("paper_id").notNull(),
  centreId: text("centre_id"),
  userId: text("user_id"),
  deviceId: text("device_id"),
  timestamp: timestamp("timestamp", { withTimezone: true }).defaultNow(),
  action: text("action").default("REQUEST_ACCESS"), // REQUEST_ACCESS, DECRYPT, VERIFY
  allowed: boolean("allowed").notNull(),
  denialReason: text("denial_reason"),
  ipAddress: text("ip_address").default("127.0.0.1"),
  txHash: text("tx_hash"),
});

// 8. Blockchain Transactions Table
export const blockchainTransactions = pgTable("blockchain_transactions", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  txHash: text("tx_hash").notNull().unique(),
  blockNumber: integer("block_number").notNull(),
  eventType: text("event_type").notNull(),
  paperId: text("paper_id").notNull(),
  actorId: text("actor_id").notNull(),
  centreId: text("centre_id"),
  deviceId: text("device_id"),
  payloadHash: text("payload_hash").notNull(),
  previousHash: text("previous_hash").notNull(),
  signature: text("signature").notNull(),
  timestamp: timestamp("timestamp", { withTimezone: true }).defaultNow(),
  status: text("status").default("CONFIRMED"),
  rawEventData: text("raw_event_data"),
});

// 9. Incidents Table
export const incidents = pgTable("incidents", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  incidentId: text("incident_id").notNull().unique(),
  type: text("type").notNull(),
  severity: text("severity").default("HIGH"), // LOW, MEDIUM, HIGH, CRITICAL
  paperId: text("paper_id"),
  centreId: text("centre_id"),
  userId: text("user_id"),
  deviceId: text("device_id"),
  timestamp: timestamp("timestamp", { withTimezone: true }).defaultNow(),
  description: text("description").notNull(),
  status: text("status").default("OPEN"), // OPEN, INVESTIGATING, ACKNOWLEDGED, RESOLVED
  txHash: text("tx_hash"),
  resolutionNotes: text("resolution_notes"),
});

// 10. Audit Logs Table
export const auditLogs = pgTable("audit_logs", {
  id: text("id").primaryKey().default(sql`gen_random_uuid()`),
  timestamp: timestamp("timestamp", { withTimezone: true }).defaultNow(),
  service: text("service").notNull(),
  actorId: text("actor_id").notNull(),
  action: text("action").notNull(),
  resourceType: text("resource_type").notNull(),
  resourceId: text("resource_id").notNull(),
  result: text("result").notNull(), // SUCCESS, FAILURE, BLOCKED
  requestId: text("request_id"),
  details: text("details"),
});