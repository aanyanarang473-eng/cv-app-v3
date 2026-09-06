export type Severity = "high" | "medium" | "low";

export interface Issue {
  id: string | null;
  severity: Severity;
  category: string;
  where: string;
  problem: string;
  why: string;
  fix: string;
}

export interface EvidenceRecoveryItem {
  gap: string;
  question: string;
  if_yes: string;
  if_no: string;
}

export interface StrongestBullet {
  text: string;
  why: string;
}

export interface ReportPayload {
  verdict: string;
  spine: string;
  no_job_description: boolean;
  checks_skipped: string[];
  issues: Issue[];
  silent_signals: string[];
  evidence_recovery: EvidenceRecoveryItem[];
  gaps: string[];
  already_has: string[];
  interview_exposure: string[];
  strongest_bullet: StrongestBullet;
  action_checklist: string[];
}

export function isReportPayload(value: unknown): value is ReportPayload {
  if (!value || typeof value !== "object") return false;
  const r = value as Record<string, unknown>;
  return (
    typeof r.verdict === "string" &&
    typeof r.spine === "string" &&
    typeof r.no_job_description === "boolean" &&
    Array.isArray(r.checks_skipped) &&
    Array.isArray(r.issues) &&
    Array.isArray(r.silent_signals) &&
    Array.isArray(r.evidence_recovery) &&
    Array.isArray(r.gaps) &&
    Array.isArray(r.already_has) &&
    Array.isArray(r.interview_exposure) &&
    typeof r.strongest_bullet === "object" &&
    r.strongest_bullet !== null &&
    Array.isArray(r.action_checklist)
  );
}
