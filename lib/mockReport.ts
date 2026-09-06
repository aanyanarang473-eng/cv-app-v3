import type { ReportPayload } from "./report";

export const mockReport: ReportPayload = {
  verdict:
    "Solid experience, told with too soft a voice — right now it reads as competent, not compelling.",

  spine:
    "An early-career consultant who supports other people's work rather than owning any of it — the CV never resolves which one they're trying to be.",

  no_job_description: false,
  checks_skipped: [],

  issues: [
    {
      id: "f1",
      severity: "high",
      category: "Experience — Meridian Consulting",
      where: "Bullet 2",
      problem:
        "Describes the assignment, not what you did with it: \"Responsible for supporting client engagements across multiple workstreams.\" No client, no workstream, no result.",
      why: "This is the second bullet on the page. It reads like a line lifted from the job posting, not something you lived through — and it gives the reader nothing to remember you by.",
      fix: "Name one engagement and its outcome: \"Ran workstream analysis for a supply-chain client, identifying $1.2M in redundant vendor spend.\"",
    },
    {
      id: "f2",
      severity: "high",
      category: "Summary",
      where: "Line 1",
      problem:
        "Four adjectives, zero evidence, in the highest-value line on the page: \"Results-driven professional with excellent communication and interpersonal skills.\"",
      why: "Every one of these words appears on thousands of other CVs this month. It spends your best real estate on a claim instead of a fact.",
      fix: "Replace with the one line that's actually true and specific to you — a scope, a result, a title.",
    },
    {
      id: "f3",
      severity: "high",
      category: "Experience",
      where: "Dates",
      problem:
        "Two roles overlap by three months with no explanation: Northfield Retail Group, Jun 2021 – Aug 2021, and Meridian Consulting, Jun 2021 – Present.",
      why: "A reader notices a date conflict before they notice anything you achieved — it reads as an error even when there's a reasonable explanation.",
      fix: "Correct the dates, or add a four-word clause: \"(part-time, overlapping transition)\".",
    },
    {
      id: "f4",
      severity: "medium",
      category: "Experience — Meridian Consulting",
      where: "Bullet 4",
      problem:
        "Your best number on the page is the last bullet under your current role: \"Helped reduce reporting turnaround time from 5 days to 2 days.\"",
      why: "The job description asks for someone who can \"improve operational efficiency.\" This is direct proof — and it's positioned where a seven-second read won't reach it.",
      fix: "Move it to the first bullet of the role, or lift it into the summary line.",
    },
    {
      id: "f5",
      severity: "medium",
      category: "Skills",
      where: "Skills list",
      problem:
        "Foundational tools and specialised ones sit in one undifferentiated line: \"Excel, PowerPoint, Python, SQL, Microsoft Office, Tableau, Public Speaking.\"",
      why: "Listing Python next to Microsoft Office asks the reader to guess which of these you're actually strong in — most will assume the lower bar.",
      fix: "Group by proficiency, or cut what the role doesn't ask for. The JD names SQL and Tableau directly — lead with those.",
    },
    {
      id: "f6",
      severity: "medium",
      category: "Experience — Northfield Retail Group",
      where: "Bullet 1",
      problem:
        "Names no initiative, no team, and no result: \"Worked closely with cross-functional teams to support marketing initiatives.\"",
      why: "This is your earliest role, which means it's already doing the least work to differentiate you. A vague bullet here costs you twice.",
      fix: "Pick the one campaign you can still describe in detail and quantify its result.",
    },
    {
      id: "f7",
      severity: "low",
      category: "Formatting",
      where: "Margins",
      problem:
        "Margin width shifts between the two pages: 1.9cm on page one, 2.4cm on page two.",
      why: "Not disqualifying, but it's the kind of small inconsistency that suggests the document was patched together rather than finished.",
      fix: "Set both pages to the same margin before exporting.",
    },
    {
      id: "f8",
      severity: "low",
      category: "Education",
      where: "Graduation date",
      problem:
        "Two different date formats used in the same document: \"Graduated: 05/2020\" against experience dates formatted \"Jun 2021 – Present.\"",
      why: "Small, but consistency is itself a signal — and it's one that readers in Consulting and Finance notice more than most.",
      fix: "Pick one date format and apply it throughout.",
    },
    {
      id: "f9",
      severity: "low",
      category: "Contact",
      where: "Email address",
      problem:
        "Personal email address doesn't match your name and reads informally: \"skateboard_dan99@hotmail.com.\"",
      why: "It's the first thing on the page — the first two seconds of impression, before a single line of experience is read.",
      fix: "Use an address built from your actual name on a plain provider.",
    },
  ],

  silent_signals: [
    "No bullet uses a first-person, active verb — every one reads as supported, helped, or worked closely with, so a reader will assume you were part of the team rather than driving it.",
    "Nothing states what happened after a project closed, so results read as activity in the moment rather than lasting impact.",
    "Two client-facing roles are listed, but nothing addresses direct client presentation experience — an unstated skill reads as an absent one.",
    "No bullet names a budget, headcount, or dollar figure you owned directly, only savings you contributed to — a senior reader will assume you executed rather than owned.",
  ],

  evidence_recovery: [
    {
      gap: "Nothing on the CV states whether you presented client findings yourself or someone else did.",
      question:
        "Did you personally present the workstream findings to the client, or did someone else present your work?",
      if_yes:
        "Add: \"Presented workstream findings directly to client VP-level stakeholders.\"",
      if_no: "Leave it out — don't imply presentation experience you don't have.",
    },
    {
      gap: "The reporting-turnaround bullet doesn't say what made cutting it from 5 days to 2 hard.",
      question:
        "Were you covering extra accounts or working through a team restructure when you made that change?",
      if_yes:
        "Add the constraint: \"...while covering two additional accounts during a team restructure.\"",
      if_no: "Leave the bullet as a straightforward process improvement.",
    },
    {
      gap: "Nothing mentions mentoring, despite a team-of-6 claim elsewhere.",
      question: "Did you onboard, review work for, or train anyone on that team?",
      if_yes:
        "Name it directly — mentoring is worth its own line, not something to leave implied by team size.",
      if_no: "Leave it out.",
    },
  ],

  gaps: ["no_case_experience", "no_professional_certification"],
  already_has: [],

  interview_exposure: [
    "\"Led a team of 6 through a systems migration\" — have one specific decision ready that the team wouldn't have made without you.",
    "\"Reduced reporting turnaround time from 5 days to 2 days\" — know exactly how both numbers were measured, and whether the change outlasted you.",
    "\"Comfortable working in fast-paced, ambiguous environments\" — have a specific story ready for \"tell me about a time the brief changed on you.\"",
    "The three-month overlap between Northfield and Meridian — decide your one-sentence explanation now, and make sure it matches the CV.",
  ],

  strongest_bullet: {
    text: "\"Helped reduce reporting turnaround time from 5 days to 2 days.\"",
    why: "It's the only line on the page with a measurable before and after — buried at the bottom of an early role, but the strongest evidence there is.",
  },

  action_checklist: [
    "Move the reporting-turnaround bullet out of last place.",
    "Rewrite the summary line — cut every adjective that isn't backed by a fact.",
    "Resolve the three-month overlap between Northfield and Meridian.",
    "Add a number to every bullet that currently has none.",
    "State who presented client findings — you or someone else.",
    "Name the pressure behind the 5-day-to-2-day bullet, not just the result.",
    "Add one line on mentoring if you trained or reviewed anyone's work.",
    "Split the skills list by proficiency, or cut what the role doesn't need.",
    "Match date formatting between education and experience.",
    "Fix the margin inconsistency between page one and two.",
    "Swap the personal email for one built from your name.",
  ],
};
