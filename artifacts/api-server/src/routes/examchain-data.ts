import { Router, type IRouter } from "express";
import {
  AuditVerifyBody,
  AuditVerifyResponse,
  CreateExaminationBody,
  CreateExaminationResponse,
  CreateIncidentBody,
  CreateIncidentResponse,
  CreatePaperBody,
  CreatePaperResponse,
  GetBlockchainSummaryResponse,
  GetCentreResponse,
  GetDashboardActivityResponse,
  GetDashboardSummaryResponse,
  GetExaminationResponse,
  GetExaminationParams,
  GetPaperEventsResponse,
  GetPaperEventsParams,
  GetPaperResponse,
  GetPaperParams,
  ListBlockchainTransactionsResponse,
  ListCentresResponse,
  ListExaminationsQueryParams,
  ListExaminationsResponse,
  ListIncidentsQueryParams,
  ListIncidentsResponse,
  ListPapersQueryParams,
  ListPapersResponse,
  VerifyPaperBody,
  VerifyPaperParams,
  VerifyPaperResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

type Examination = {
  id: string;
  examId: string;
  name: string;
  department: string;
  subject: string;
  examDate: string;
  startTime: string;
  endTime: string;
  centres: number;
  status: string;
  securityLevel: string;
};

type Paper = {
  id: string;
  paperId: string;
  exam: string;
  subject: string;
  version: string;
  hash: string;
  encryption: string;
  status: string;
  createdBy: string;
  createdAt: string;
  releaseTime: string;
  integrity: string;
};

type Incident = {
  id: string;
  type: string;
  severity: string;
  paper: string;
  centre: string;
  timestamp: string;
  status: string;
  description: string;
};

const examinations: Examination[] = [
  {
    id: "exam-1",
    examId: "CSE-SEM-26",
    name: "CSE Semester Examination",
    department: "Computer Science",
    subject: "Distributed Systems",
    examDate: "2026-05-22",
    startTime: "10:00",
    endTime: "13:00",
    centres: 8,
    status: "Scheduled",
    securityLevel: "Critical",
  },
  {
    id: "exam-2",
    examId: "MAT-301",
    name: "Engineering Mathematics III",
    department: "Engineering",
    subject: "Engineering Mathematics",
    examDate: "2026-05-24",
    startTime: "10:00",
    endTime: "13:00",
    centres: 10,
    status: "Released",
    securityLevel: "High",
  },
  {
    id: "exam-3",
    examId: "PHY-302",
    name: "Applied Physics",
    department: "Sciences",
    subject: "Physics",
    examDate: "2026-05-28",
    startTime: "14:00",
    endTime: "17:00",
    centres: 6,
    status: "Draft",
    securityLevel: "High",
  },
  {
    id: "exam-4",
    examId: "DBMS-204",
    name: "Database Management Systems",
    department: "Computer Science",
    subject: "Database Management Systems",
    examDate: "2026-06-02",
    startTime: "10:00",
    endTime: "13:00",
    centres: 7,
    status: "Scheduled",
    securityLevel: "Critical",
  },
];

const papers: Paper[] = [
  {
    id: "paper-1",
    paperId: "MAT-301-V2",
    exam: "Engineering Mathematics III",
    subject: "Engineering Mathematics",
    version: "v2.1",
    hash: "8af3c9d1…e721",
    encryption: "AES-256-GCM",
    status: "Released",
    createdBy: "Ananya Rao",
    createdAt: "2026-05-18 14:32",
    releaseTime: "2026-05-24 09:45",
    integrity: "Verified",
  },
  {
    id: "paper-2",
    paperId: "PHY-302-V1",
    exam: "Applied Physics",
    subject: "Physics",
    version: "v1.0",
    hash: "3be8a7f2…4c19",
    encryption: "AES-256-GCM",
    status: "Locked",
    createdBy: "Rahul Mehta",
    createdAt: "2026-05-18 12:18",
    releaseTime: "2026-05-28 13:45",
    integrity: "Verified",
  },
  {
    id: "paper-3",
    paperId: "CSE-SEM-26-V3",
    exam: "CSE Semester Examination",
    subject: "Distributed Systems",
    version: "v3.0",
    hash: "d92c1e4a…97bf",
    encryption: "AES-256-GCM",
    status: "Scheduled",
    createdBy: "Ananya Rao",
    createdAt: "2026-05-17 17:05",
    releaseTime: "2026-05-22 09:45",
    integrity: "Verified",
  },
  {
    id: "paper-4",
    paperId: "DBMS-204-V1",
    exam: "Database Management Systems",
    subject: "Database Management Systems",
    version: "v1.0",
    hash: "c1a3b88e…1130",
    encryption: "AES-256-GCM",
    status: "Pending approval",
    createdBy: "Priya Nair",
    createdAt: "2026-05-16 09:41",
    releaseTime: "2026-06-02 09:45",
    integrity: "Verified",
  },
];

const centres = [
  {
    id: "centre-1",
    centreId: "C102",
    name: "North Campus Examination Hall",
    location: "Bengaluru, Karnataka",
    status: "Authorized",
    assignedExams: 6,
    devices: 18,
    lastActivity: "2 min ago",
    risk: "Low",
  },
  {
    id: "centre-2",
    centreId: "C103",
    name: "East District Test Centre",
    location: "Mysuru, Karnataka",
    status: "Review required",
    assignedExams: 4,
    devices: 12,
    lastActivity: "18 min ago",
    risk: "Medium",
  },
  {
    id: "centre-3",
    centreId: "C104",
    name: "Central University Hall",
    location: "Hubballi, Karnataka",
    status: "Authorized",
    assignedExams: 8,
    devices: 24,
    lastActivity: "1 hour ago",
    risk: "Low",
  },
  {
    id: "centre-4",
    centreId: "C108",
    name: "South City Testing Facility",
    location: "Mangaluru, Karnataka",
    status: "Authorized",
    assignedExams: 5,
    devices: 16,
    lastActivity: "3 hours ago",
    risk: "Low",
  },
];

const incidents: Incident[] = [
  {
    id: "INC-1042",
    type: "Early access attempt",
    severity: "Critical",
    paper: "PHY-302-V1",
    centre: "C103",
    timestamp: "Today, 09:42",
    status: "Investigating",
    description: "Release policy blocked an access request 18 minutes before the scheduled window.",
  },
  {
    id: "INC-1041",
    type: "Device mismatch",
    severity: "High",
    paper: "MAT-301-V2",
    centre: "C102",
    timestamp: "Today, 09:38",
    status: "Acknowledged",
    description: "Request originated from a device fingerprint not present in the centre allowlist.",
  },
  {
    id: "INC-1039",
    type: "Hash mismatch",
    severity: "Critical",
    paper: "DBMS-204-V1",
    centre: "C108",
    timestamp: "Yesterday, 17:14",
    status: "Resolved",
    description: "Uploaded revision did not match the blockchain-registered SHA-256 digest.",
  },
  {
    id: "INC-1037",
    type: "Credential failure",
    severity: "Medium",
    paper: "CSE-SEM-26-V3",
    centre: "C104",
    timestamp: "Yesterday, 14:09",
    status: "Closed",
    description: "Three failed operator authentications were rate-limited and contained.",
  },
];

const activity = [
  { id: "a1", time: "10:02:18", type: "access", title: "Paper accessed", detail: "Centre C102 accessed MAT-301-V2", status: "success" },
  { id: "a2", time: "10:01:44", type: "auth", title: "Centre authorization successful", detail: "C104 verified on approved device", status: "success" },
  { id: "a3", time: "09:59:12", type: "blocked", title: "Early access blocked", detail: "PHY-302-V1 remains locked until 13:45", status: "blocked" },
  { id: "a4", time: "09:58:36", type: "warning", title: "Device mismatch detected", detail: "Unrecognized fingerprint from C103", status: "warning" },
  { id: "a5", time: "09:54:02", type: "chain", title: "Blockchain event confirmed", detail: "MAT-301-V2 release recorded on block 18,492", status: "success" },
];

const paperEvents = [
  { id: "e1", event: "Paper created", timestamp: "18 May 2026, 14:32", actor: "Ananya Rao", device: "Secure workstation · WS-17", status: "verified", transaction: "0x8fa…a2c" },
  { id: "e2", event: "Paper approved", timestamp: "18 May 2026, 15:08", actor: "Dr. Vikram Iyer", device: "Secure workstation · WS-04", status: "verified", transaction: "0x1b4…e91" },
  { id: "e3", event: "Hash generated", timestamp: "18 May 2026, 15:09", actor: "ExamChain service", device: "Key vault · KV-02", status: "verified", transaction: "0x5c0…c71" },
  { id: "e4", event: "Paper encrypted", timestamp: "18 May 2026, 15:09", actor: "ExamChain service", device: "Key vault · KV-02", status: "verified", transaction: "0x9a3…f20" },
  { id: "e5", event: "Centre assigned", timestamp: "19 May 2026, 09:11", actor: "Ananya Rao", device: "Admin console · AC-02", status: "verified", transaction: "0x2dc…991" },
  { id: "e6", event: "Paper released", timestamp: "24 May 2026, 09:45", actor: "Release scheduler", device: "Policy engine · PE-01", status: "verified", transaction: "0xa11…42e" },
];

const transactions = [
  { id: "tx-1", hash: "0xa11f42e…91c8", event: "PAPER_RELEASED", paperId: "MAT-301-V2", actor: "Release scheduler", timestamp: "Today, 09:45:02", status: "Confirmed", block: 18492 },
  { id: "tx-2", hash: "0x5c0fc71…20a4", event: "HASH_REGISTERED", paperId: "CSE-SEM-26-V3", actor: "ExamChain service", timestamp: "Yesterday, 17:05:41", status: "Confirmed", block: 18461 },
  { id: "tx-3", hash: "0x9b72e01…6f3d", event: "ACCESS_BLOCKED", paperId: "PHY-302-V1", actor: "Policy engine", timestamp: "Today, 09:42:08", status: "Confirmed", block: 18488 },
  { id: "tx-4", hash: "0x2dc9a91…86ba", event: "CENTRE_ASSIGNED", paperId: "MAT-301-V2", actor: "Ananya Rao", timestamp: "19 May 2026, 09:11:14", status: "Confirmed", block: 18321 },
];

const makeId = (prefix: string) => `${prefix}-${Date.now().toString(36)}`;

router.get("/dashboard/summary", (_req, res) => {
  res.json(
    GetDashboardSummaryResponse.parse({
      activeExaminations: 12,
      securedPapers: 47,
      authorizedCentres: 10,
      successfulAccesses: 284,
      blockedAttempts: 19,
      securityAlerts: 6,
      integrityViolations: 1,
      blockchainTransactions: 18492,
      accessSeries: [
        { label: "18 May", value: 38, secondary: 2 },
        { label: "19 May", value: 54, secondary: 4 },
        { label: "20 May", value: 43, secondary: 1 },
        { label: "21 May", value: 67, secondary: 5 },
        { label: "22 May", value: 52, secondary: 3 },
        { label: "23 May", value: 71, secondary: 4 },
        { label: "24 May", value: 59, secondary: 2 },
      ],
    }),
  );
});

router.get("/dashboard/activity", (_req, res) => {
  res.json(GetDashboardActivityResponse.parse(activity));
});

router.get("/examinations", (req, res) => {
  const query = ListExaminationsQueryParams.parse(req.query);
  const search = query.search?.toLowerCase();
  const filtered = examinations.filter((exam) => {
    const matchesStatus = !query.status || exam.status.toLowerCase() === query.status.toLowerCase();
    const matchesSearch =
      !search ||
      [exam.name, exam.examId, exam.subject, exam.department].some((value) =>
        value.toLowerCase().includes(search),
      );
    return matchesStatus && matchesSearch;
  });
  res.json(ListExaminationsResponse.parse(filtered));
});

router.post("/examinations", (req, res) => {
  const body = CreateExaminationBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }
  const exam: Examination = {
    id: makeId("exam"),
    ...body.data,
    centres: 0,
    status: "Draft",
  };
  examinations.unshift(exam);
  res.status(201).json(CreateExaminationResponse.parse(exam));
});

router.get("/examinations/:id", (req, res) => {
  const params = GetExaminationParams.parse(req.params);
  const exam = examinations.find((item) => item.id === params.id);
  if (!exam) {
    res.status(404).json({ error: "Examination not found" });
    return;
  }
  res.json(GetExaminationResponse.parse(exam));
});

router.get("/papers", (req, res) => {
  const query = ListPapersQueryParams.parse(req.query);
  const search = query.search?.toLowerCase();
  const filtered = papers.filter((paper) => {
    const matchesStatus = !query.status || paper.status.toLowerCase() === query.status.toLowerCase();
    const matchesSearch =
      !search ||
      [paper.paperId, paper.exam, paper.subject].some((value) => value.toLowerCase().includes(search));
    return matchesStatus && matchesSearch;
  });
  res.json(ListPapersResponse.parse(filtered));
});

router.post("/papers", (req, res) => {
  const body = CreatePaperBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }
  const paper: Paper = {
    id: makeId("paper"),
    ...body.data,
    version: "v1.0",
    hash: "pending…",
    encryption: "Processing",
    status: "Processing",
    createdBy: "Current operator",
    createdAt: new Date().toISOString(),
    integrity: "Pending",
  };
  papers.unshift(paper);
  res.status(201).json(CreatePaperResponse.parse(paper));
});

router.get("/papers/:id", (req, res) => {
  const params = GetPaperParams.parse(req.params);
  const paper = papers.find((item) => item.id === params.id);
  if (!paper) {
    res.status(404).json({ error: "Paper not found" });
    return;
  }
  res.json(GetPaperResponse.parse(paper));
});

router.post("/papers/:id/verify", (req, res) => {
  const params = VerifyPaperParams.parse(req.params);
  const body = VerifyPaperBody.parse(req.body ?? {});
  const paper = papers.find((item) => item.id === params.id);
  if (!paper) {
    res.status(404).json({ error: "Paper not found" });
    return;
  }
  const currentHash = body.currentHash ?? paper.hash;
  const verified = currentHash === paper.hash || currentHash === "";
  res.json(
    VerifyPaperResponse.parse({
      verified,
      blockchainHash: paper.hash,
      currentHash,
      message: verified ? "Document verified against blockchain record." : "Document integrity failure detected.",
    }),
  );
});

router.get("/papers/:id/events", (req, res) => {
  const params = GetPaperEventsParams.parse(req.params);
  const paper = papers.find((item) => item.id === params.id);
  if (!paper) {
    res.status(404).json({ error: "Paper not found" });
    return;
  }
  res.json(GetPaperEventsResponse.parse(paperEvents));
});

router.get("/centres", (_req, res) => {
  res.json(ListCentresResponse.parse(centres));
});

router.get("/centres/:id", (req, res) => {
  const params = GetPaperParams.parse(req.params);
  const centre = centres.find((item) => item.id === params.id);
  if (!centre) {
    res.status(404).json({ error: "Centre not found" });
    return;
  }
  res.json(GetCentreResponse.parse(centre));
});

router.get("/incidents", (req, res) => {
  const query = ListIncidentsQueryParams.parse(req.query);
  const filtered = incidents.filter((incident) => {
    const severityMatch = !query.severity || incident.severity.toLowerCase() === query.severity.toLowerCase();
    const statusMatch = !query.status || incident.status.toLowerCase() === query.status.toLowerCase();
    return severityMatch && statusMatch;
  });
  res.json(ListIncidentsResponse.parse(filtered));
});

router.post("/incidents", (req, res) => {
  const body = CreateIncidentBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }
  const incident: Incident = {
    id: makeId("INC"),
    type: body.data.type,
    severity: body.data.severity,
    paper: body.data.paper ?? "Unassigned",
    centre: body.data.centre ?? "Unassigned",
    timestamp: "Just now",
    status: "Open",
    description: body.data.description,
  };
  incidents.unshift(incident);
  res.status(201).json(CreateIncidentResponse.parse(incident));
});

router.get("/blockchain/summary", (_req, res) => {
  res.json(
    GetBlockchainSummaryResponse.parse({
      network: "ExamChain LocalNet",
      status: "Operational",
      latestBlock: 18492,
      transactions: 18492,
      nodes: 4,
      confirmation: "2.4 sec avg.",
    }),
  );
});

router.get("/blockchain/transactions", (_req, res) => {
  res.json(ListBlockchainTransactionsResponse.parse(transactions));
});

router.post("/audit/verify", (req, res) => {
  const body = AuditVerifyBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }
  const paper = papers.find((item) => item.paperId.toLowerCase() === body.data.paperId.toLowerCase());
  res.json(
    AuditVerifyResponse.parse({
      paperId: body.data.paperId,
      verified: Boolean(paper),
      chainStatus: paper ? "Confirmed on block 18492" : "No matching blockchain record",
      integrity: paper?.integrity ?? "Unknown",
      message: paper
        ? "Paper identity, integrity, and chain-of-custody record verified."
        : "No paper was found for that identifier.",
    }),
  );
});

export default router;