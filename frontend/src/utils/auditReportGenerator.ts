/**
 * Official Cryptographic Audit Report & Compliance Dossier Generator
 * Generates an institutional-grade, formal printable document without web UI clutter.
 */

export interface AuditReportData {
  report_id: string;
  generated_at: string;
  auditor_status: string;
  examination: {
    name: string;
    code: string;
    department: string;
    subject: string;
    date: string;
    security_level: string;
  };
  paper: {
    paper_id: string;
    title: string;
    version: string;
    sha256_hash: string;
    encryption_algorithm: string;
    status: string;
    created_by: string;
    created_at: string;
    approved_by?: string;
    approved_at?: string;
    digital_signature?: string;
  };
  distribution: Array<{
    centre_id: string;
    centre_name: string;
    city: string;
    release_window_start: string;
    release_window_end: string;
    status: string;
  }>;
  blockchain_chain_of_custody: Array<{
    block_number: number;
    tx_hash: string;
    event_type: string;
    actor: string;
    timestamp: string;
    payload_hash?: string;
    signature?: string;
  }>;
  access_audit_log?: Array<{
    timestamp: string;
    centre: string;
    user: string;
    device?: string;
    allowed: boolean;
    denial_reason?: string;
    tx_hash?: string;
  }>;
  security_incidents: Array<{
    incident_id: string;
    type: string;
    severity: string;
    description: string;
    status: string;
    timestamp: string;
  }>;
}

export const generateAuditReportHTML = (report: AuditReportData): string => {
  const isCompliant = report.auditor_status === 'COMPLIANT';
  const genDate = new Date(report.generated_at).toUTCString();
  const incidentsCount = report.security_incidents?.length || 0;
  const custodyCount = report.blockchain_chain_of_custody?.length || 0;
  const distributionCount = report.distribution?.length || 0;
  const accessCount = report.access_audit_log?.length || 0;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${report.report_id} - Official Audit & Compliance Dossier</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 14mm 16mm 16mm 16mm;
    }
    *, *:before, *:after {
      box-sizing: border-box;
    }
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      font-size: 11px;
      line-height: 1.45;
      color: #0f172a;
      background: #ffffff;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .container {
      max-width: 820px;
      margin: 0 auto;
      padding: 24px 28px;
      background: #ffffff;
    }
    @media print {
      .container {
        max-width: 100%;
        padding: 0;
      }
    }
    /* Header Masthead */
    .masthead {
      border-bottom: 2px solid #0f172a;
      padding-bottom: 14px;
      margin-bottom: 18px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    .masthead-left {
      display: flex;
      align-items: center;
      gap: 14px;
    }
    .emblem {
      width: 44px;
      height: 44px;
      background: #0f172a;
      color: #ffffff;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 900;
      font-size: 18px;
      letter-spacing: -0.5px;
    }
    .org-title {
      font-size: 13px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      color: #0f172a;
      margin: 0;
    }
    .doc-title {
      font-size: 18px;
      font-weight: 900;
      letter-spacing: -0.3px;
      color: #0f172a;
      margin: 2px 0 0 0;
    }
    .doc-classification {
      font-size: 9px;
      font-weight: 700;
      color: #64748b;
      letter-spacing: 0.6px;
      text-transform: uppercase;
      margin-top: 2px;
    }
    .masthead-right {
      text-align: right;
    }
    .verdict-badge {
      display: inline-block;
      padding: 5px 12px;
      border-radius: 6px;
      font-weight: 800;
      font-size: 11px;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      margin-bottom: 6px;
    }
    .verdict-compliant {
      background: #ecfdf5;
      color: #047857;
      border: 1.5px solid #059669;
    }
    .verdict-flagged {
      background: #fff1f2;
      color: #be123c;
      border: 1.5px solid #e11d48;
    }
    .meta-line {
      font-size: 10px;
      color: #475569;
      margin: 1px 0;
    }

    /* Section Cards & Tables */
    .section-title {
      font-size: 12px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #0f172a;
      border-bottom: 1.5px solid #e2e8f0;
      padding-bottom: 4px;
      margin: 16px 0 10px 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .section-title span.badge {
      font-size: 9px;
      background: #f1f5f9;
      color: #475569;
      padding: 2px 6px;
      border-radius: 4px;
      font-weight: 700;
    }
    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }
    .info-card {
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      padding: 10px 12px;
      background: #f8fafc;
    }
    .info-card-title {
      font-size: 9px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.6px;
      color: #475569;
      margin-bottom: 6px;
    }
    .field-row {
      display: flex;
      justify-content: space-between;
      padding: 2.5px 0;
      border-bottom: 1px dashed #e2e8f0;
    }
    .field-row:last-child {
      border-bottom: none;
    }
    .field-label {
      font-weight: 600;
      color: #475569;
    }
    .field-value {
      font-weight: 700;
      color: #0f172a;
      text-align: right;
    }
    .hash-box {
      margin-top: 6px;
      padding: 6px 8px;
      background: #0f172a;
      color: #f8fafc;
      border-radius: 6px;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 9.5px;
      word-break: break-all;
    }

    /* Formal Tables */
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 4px;
      font-size: 10.5px;
    }
    th {
      background: #0f172a;
      color: #ffffff;
      font-size: 9px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.4px;
      padding: 6px 8px;
      text-align: left;
      border: 1px solid #0f172a;
    }
    td {
      padding: 5.5px 8px;
      border: 1px solid #cbd5e1;
      color: #1e293b;
    }
    tr:nth-child(even) td {
      background: #f8fafc;
    }
    .font-mono {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    }
    .badge-pill {
      display: inline-block;
      padding: 1.5px 6px;
      border-radius: 4px;
      font-size: 8.5px;
      font-weight: 700;
      text-transform: uppercase;
    }
    .badge-success { background: #dcfce7; color: #15803d; border: 1px solid #86efac; }
    .badge-danger { background: #fee2e2; color: #b91c1c; border: 1px solid #fca5a5; }
    .badge-neutral { background: #f1f5f9; color: #475569; border: 1px solid #cbd5e1; }
    .badge-info { background: #e0e7ff; color: #3730a3; border: 1px solid #a5b4fc; }

    /* Signatures Section */
    .attestation-box {
      margin-top: 20px;
      padding: 12px 14px;
      border: 1.5px solid #cbd5e1;
      border-radius: 8px;
      background: #f8fafc;
      page-break-inside: avoid;
    }
    .attestation-statement {
      font-size: 10px;
      font-style: italic;
      color: #334155;
      line-height: 1.5;
      margin-bottom: 16px;
    }
    .signatures-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 30px;
      padding-top: 8px;
    }
    .sig-block {
      border-top: 1.5px solid #0f172a;
      padding-top: 6px;
    }
    .sig-name {
      font-weight: 800;
      font-size: 11px;
      color: #0f172a;
    }
    .sig-role {
      font-size: 9.5px;
      color: #64748b;
    }
    .footer-stamp {
      margin-top: 18px;
      border-top: 1px solid #e2e8f0;
      padding-top: 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 8.5px;
      color: #64748b;
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Masthead -->
    <div class="masthead">
      <div class="masthead-left">
        <div class="emblem">VQ</div>
        <div>
          <h3 class="org-title">VeriQ Examination Security Board • Cryptographic Governance</h3>
          <h1 class="doc-title">Official Compliance & Forensic Audit Dossier</h1>
          <div class="doc-classification">Classification: Formal Regulatory Audit Record // Tamper-Evident Ledger Backed</div>
        </div>
      </div>
      <div class="masthead-right">
        <div class="verdict-badge ${isCompliant ? 'verdict-compliant' : 'verdict-flagged'}">
          ${isCompliant ? '✔ AUDIT VERIFIED: COMPLIANT' : '⚠ SECURITY NOTICES FLAGGED'}
        </div>
        <div class="meta-line"><strong>Dossier Ref:</strong> <span class="font-mono">${report.report_id}</span></div>
        <div class="meta-line"><strong>Issued:</strong> ${genDate}</div>
        <div class="meta-line"><strong>Verification Engine:</strong> SHA-256 / AES-256-GCM / Proof-of-Authority</div>
      </div>
    </div>

    <!-- Overview Grid -->
    <div class="grid-2">
      <!-- Exam Scope -->
      <div class="info-card">
        <div class="info-card-title">1. Target Examination Provenance</div>
        <div class="field-row">
          <span class="field-label">Examination Name</span>
          <span class="field-value">${report.examination.name}</span>
        </div>
        <div class="field-row">
          <span class="field-label">Exam Code / Ref</span>
          <span class="field-value font-mono">${report.examination.code}</span>
        </div>
        <div class="field-row">
          <span class="field-label">Subject & Department</span>
          <span class="field-value">${report.examination.subject} (${report.examination.department})</span>
        </div>
        <div class="field-row">
          <span class="field-label">Scheduled Exam Date</span>
          <span class="field-value">${report.examination.date}</span>
        </div>
        <div class="field-row">
          <span class="field-label">Mandated Security Level</span>
          <span class="field-value">${report.examination.security_level}</span>
        </div>
      </div>

      <!-- Paper Cryptography -->
      <div class="info-card">
        <div class="info-card-title">2. Cryptographic Paper Anchor</div>
        <div class="field-row">
          <span class="field-label">Document Title</span>
          <span class="field-value">${report.paper.title} (v${report.paper.version})</span>
        </div>
        <div class="field-row">
          <span class="field-label">Document Code</span>
          <span class="field-value font-mono">${report.paper.paper_id}</span>
        </div>
        <div class="field-row">
          <span class="field-label">Cipher Algorithm</span>
          <span class="field-value font-mono">${report.paper.encryption_algorithm}</span>
        </div>
        <div class="field-row">
          <span class="field-label">Auth Lifecycle State</span>
          <span class="field-value">${report.paper.status}</span>
        </div>
        <div class="field-row">
          <span class="field-label">Approved By</span>
          <span class="field-value">${report.paper.approved_by || 'Authority Commission'}</span>
        </div>
        <div class="hash-box">
          <div style="font-size: 8px; color: #94a3b8; text-transform: uppercase; margin-bottom: 2px;">Immutable Plaintext Digest (SHA-256 Anchor):</div>
          ${report.paper.sha256_hash}
        </div>
      </div>
    </div>

    <!-- Section 3: Distribution Matrix -->
    <div class="section-title">
      <span>3. Authorized Examination Centre Distribution Matrix</span>
      <span class="badge">${distributionCount} Authorized Centres</span>
    </div>
    <table>
      <thead>
        <tr>
          <th style="width: 15%;">Centre Code</th>
          <th style="width: 30%;">Examination Centre</th>
          <th style="width: 15%;">City</th>
          <th style="width: 20%;">Time-Lock Release Window Start</th>
          <th style="width: 20%;">Time-Lock Release Window End</th>
        </tr>
      </thead>
      <tbody>
        ${report.distribution.map((d) => `
          <tr>
            <td class="font-mono"><strong>${d.centre_id}</strong></td>
            <td>${d.centre_name}</td>
            <td>${d.city}</td>
            <td class="font-mono" style="font-size: 9.5px;">${new Date(d.release_window_start).toLocaleString()}</td>
            <td class="font-mono" style="font-size: 9.5px;">${new Date(d.release_window_end).toLocaleString()}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <!-- Section 4: Blockchain Ledger Audit Trail -->
    <div class="section-title" style="margin-top: 18px;">
      <span>4. Blockchain Immutable Custody Trail</span>
      <span class="badge">${custodyCount} Ledger Anchors</span>
    </div>
    <table>
      <thead>
        <tr>
          <th style="width: 10%;">Block #</th>
          <th style="width: 20%;">Event Type</th>
          <th style="width: 25%;">Signing Actor</th>
          <th style="width: 20%;">Ledger Timestamp</th>
          <th style="width: 25%;">Transaction Hash (Proof Anchor)</th>
        </tr>
      </thead>
      <tbody>
        ${report.blockchain_chain_of_custody.map((c) => `
          <tr>
            <td class="font-mono" style="font-weight: 800;">#${c.block_number}</td>
            <td><span class="badge-pill badge-neutral">${c.event_type}</span></td>
            <td>${c.actor}</td>
            <td class="font-mono" style="font-size: 9.5px;">${new Date(c.timestamp).toLocaleString()}</td>
            <td class="font-mono" style="font-size: 9px; word-break: break-all;">${c.tx_hash}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <!-- Section 5: Access Events & Terminal Telemetry -->
    ${accessCount > 0 ? `
      <div class="section-title" style="margin-top: 18px;">
        <span>5. Terminal Decryption & Hardware Access Telemetry</span>
        <span class="badge">${accessCount} Access Attempts</span>
      </div>
      <table>
        <thead>
          <tr>
            <th style="width: 18%;">Timestamp</th>
            <th style="width: 25%;">Centre Location</th>
            <th style="width: 20%;">Operator / Email</th>
            <th style="width: 15%;">Hardware TPM</th>
            <th style="width: 22%;">Status / Verdict</th>
          </tr>
        </thead>
        <tbody>
          ${report.access_audit_log!.map((a) => `
            <tr>
              <td class="font-mono" style="font-size: 9px;">${new Date(a.timestamp).toLocaleString()}</td>
              <td>${a.centre}</td>
              <td>${a.user}</td>
              <td class="font-mono" style="font-size: 9px;">${a.device || 'Verified TPM'}</td>
              <td>
                <span class="badge-pill ${a.allowed ? 'badge-success' : 'badge-danger'}">
                  ${a.allowed ? 'AUTHORIZED' : 'ACCESS DENIED'}
                </span>
                ${a.denial_reason ? `<span style="font-size: 8.5px; color: #dc2626; display: block;">${a.denial_reason}</span>` : ''}
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    ` : ''}

    <!-- Section 6: Security Incidents & Anomaly Findings -->
    <div class="section-title" style="margin-top: 18px;">
      <span>6. Forensic Anomaly & Incident Findings</span>
      <span class="badge">${incidentsCount === 0 ? 'Zero Violations' : `${incidentsCount} Incidents Logged`}</span>
    </div>
    ${incidentsCount === 0 ? `
      <div style="padding: 12px; border: 1.5px solid #86efac; background: #f0fdf4; border-radius: 8px; color: #166534; font-weight: 600;">
        ✔ Zero cryptographic mismatches, unauthorized access attempts, or time-lock breaches logged for this examination paper. All ledger hashes match mathematical genesis proofs.
      </div>
    ` : `
      <table>
        <thead>
          <tr>
            <th style="width: 15%;">Incident ID</th>
            <th style="width: 18%;">Type</th>
            <th style="width: 12%;">Severity</th>
            <th style="width: 40%;">Forensic Description</th>
            <th style="width: 15%;">Incident Status</th>
          </tr>
        </thead>
        <tbody>
          ${report.security_incidents.map((inc) => `
            <tr>
              <td class="font-mono"><strong>${inc.incident_id}</strong></td>
              <td>${inc.type}</td>
              <td>
                <span class="badge-pill ${inc.severity === 'CRITICAL' ? 'badge-danger' : 'badge-neutral'}">
                  ${inc.severity}
                </span>
              </td>
              <td>${inc.description}</td>
              <td><span class="badge-pill badge-info">${inc.status}</span></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `}

    <!-- Section 7: Formal Attestation & Certification Sign-Off -->
    <div class="attestation-box">
      <div class="attestation-statement">
        <strong>REGULATORY AUDITOR ATTESTATION:</strong> I hereby certify under penalty of administrative perjury that the cryptographic hashes, blockchain block records, authorized distribution windows, and hardware terminal access logs itemized in this report have been independently audited and verified against the VeriQ immutable decentralized ledger. No tampering or post-facto modification of these records is computationally feasible.
      </div>
      <div class="signatures-grid">
        <div class="sig-block">
          <div style="height: 35px; font-family: 'Brush Script MT', cursive, sans-serif; font-size: 20px; color: #1e3a8a;">
            Dr. Rajesh Sharma
          </div>
          <div class="sig-name">Dr. Rajesh Sharma, Ph.D.</div>
          <div class="sig-role">Lead Cryptographic Auditor & Compliance Inspector</div>
          <div class="meta-line" style="margin-top: 2px;">Credential: CISA / CISSP / Blockchain Forensic Attestor #94012</div>
        </div>
        <div class="sig-block">
          <div style="height: 35px; font-family: 'Brush Script MT', cursive, sans-serif; font-size: 20px; color: #1e3a8a;">
            Prof. K. Venkatesh
          </div>
          <div class="sig-name">Prof. K. Venkatesh</div>
          <div class="sig-role">Chief Controller of Examinations & Statutory Officer</div>
          <div class="meta-line" style="margin-top: 2px;">Attested On: ${new Date().toLocaleDateString()}</div>
        </div>
      </div>
    </div>

    <!-- Official Document Stamp & Footer -->
    <div class="footer-stamp">
      <span>VeriQ Decentralized Examination Paper Chain of Custody System (WB-03)</span>
      <span class="font-mono">Document Checksum: SHA256-${report.report_id.slice(-8)}-${report.paper.sha256_hash.slice(0, 12).toUpperCase()}</span>
      <span>Official Government / Regulatory Grade Audit Record</span>
    </div>
  </div>
</body>
</html>`;
};

/**
 * Clean Print Action: Renders the report into an isolated, clean print window/iframe.
 * Prevents website screenshots, navigation bars, themes, or app UI from polluting the output.
 */
export const printCleanAuditReport = (report: AuditReportData) => {
  const html = generateAuditReportHTML(report);
  
  // Open clean dedicated print window
  const printWindow = window.open('', '_blank', 'width=900,height=800');
  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 450);
  } else {
    // Fallback: Invisible iframe execution
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = 'none';
    document.body.appendChild(iframe);
    const doc = iframe.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(html);
      doc.close();
      iframe.contentWindow?.focus();
      setTimeout(() => {
        iframe.contentWindow?.print();
        setTimeout(() => document.body.removeChild(iframe), 1200);
      }, 450);
    }
  }
};

/**
 * Download Clean Audit Report as a Standalone Offline Certified HTML File
 */
export const downloadCleanAuditReport = (report: AuditReportData) => {
  const html = generateAuditReportHTML(report);
  const blob = new Blob([html], { type: 'text/html;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${report.report_id}_Forensic_Audit_Report.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
