export const REPORT_TOOL_NAME = "submit_cv_review";

export const REPORT_INPUT_SCHEMA = {
  type: "object",
  properties: {
    verdict: {
      type: "string",
      description: "One sentence. The single most important thing wrong.",
    },
    spine: {
      type: "string",
      description:
        "What this person appears to be and want next — or that it isn't clear, and why.",
    },
    no_job_description: { type: "boolean" },
    checks_skipped: {
      type: "array",
      items: { type: "string" },
    },
    issues: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: ["string", "null"] },
          severity: { type: "string", enum: ["high", "medium", "low"] },
          category: {
            type: "string",
            description:
              "Section name from the candidate's own CV, e.g. \"Experience — TMF Fund Management\".",
          },
          where: { type: "string" },
          problem: { type: "string" },
          why: { type: "string" },
          fix: { type: "string" },
        },
        required: ["id", "severity", "category", "where", "problem", "why", "fix"],
      },
    },
    silent_signals: {
      type: "array",
      items: { type: "string" },
    },
    evidence_recovery: {
      type: "array",
      items: {
        type: "object",
        properties: {
          gap: { type: "string" },
          question: { type: "string" },
          if_yes: { type: "string" },
          if_no: { type: "string" },
        },
        required: ["gap", "question", "if_yes", "if_no"],
      },
    },
    gaps: {
      type: "array",
      items: {
        type: "string",
        enum: [
          "no_case_experience",
          "no_technical_project",
          "no_client_facing_work",
          "no_finance_internship",
          "no_leadership_role",
          "no_quantitative_evidence",
          "no_industry_exposure",
          "no_professional_certification",
        ],
      },
    },
    already_has: {
      type: "array",
      items: {
        type: "string",
        enum: [
          "forage",
          "coursera_finance",
          "society_membership",
          "case_competition",
          "coding_certification",
          "professional_body",
          "technical_project",
        ],
      },
    },
    interview_exposure: {
      type: "array",
      items: { type: "string" },
    },
    strongest_bullet: {
      type: "object",
      properties: {
        text: { type: "string" },
        why: { type: "string" },
      },
      required: ["text", "why"],
    },
    action_checklist: {
      type: "array",
      items: { type: "string" },
    },
  },
  required: [
    "verdict",
    "spine",
    "no_job_description",
    "checks_skipped",
    "issues",
    "silent_signals",
    "evidence_recovery",
    "gaps",
    "already_has",
    "interview_exposure",
    "strongest_bullet",
    "action_checklist",
  ],
} as const;
