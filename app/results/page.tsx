"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { mockReport } from "@/lib/mockReport";
import { isReportPayload, type ReportPayload, type Severity } from "@/lib/report";
import { EASE } from "../components/LoadingSequence";
import DetailPanel, {
  type DetailContent,
} from "../components/results/DetailPanel";
import ChecklistPanel from "../components/results/ChecklistPanel";
import StatsPanel from "../components/results/StatsPanel";
import NavFooter from "../components/results/NavFooter";
import WholeDocumentPanel from "../components/results/WholeDocumentPanel";
import EvidenceRecoveryPanel from "../components/results/EvidenceRecoveryPanel";
import InterviewExposurePanel from "../components/results/InterviewExposurePanel";
import StrongestBulletPanel from "../components/results/StrongestBulletPanel";

type Filter = "all" | Severity;

const REPORT_STORAGE_KEY = "cv-review-report";

type Entry =
  | { kind: "stats"; id: "stats" }
  | {
      kind: "issue";
      id: string;
      severity: Severity;
      category: string;
      content: DetailContent;
    }
  | { kind: "whole-document"; id: "whole-document" }
  | { kind: "evidence-recovery"; id: "evidence-recovery" }
  | { kind: "interview-exposure"; id: "interview-exposure" }
  | { kind: "strongest-bullet"; id: "strongest-bullet" }
  | { kind: "checklist"; id: "what-to-do-next" };

function severityDotColor(severity: Severity) {
  return severity === "high" ? "#7A2E2E" : "#9AA3B5";
}

export default function ResultsPage() {
  const [report, setReport] = useState<ReportPayload>(mockReport);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(REPORT_STORAGE_KEY);
      if (!stored) return;
      const parsed = JSON.parse(stored);
      if (isReportPayload(parsed)) setReport(parsed);
    } catch {
      // Ignore corrupted storage and keep the default report.
    }
  }, []);

  const entries = useMemo<Entry[]>(() => {
    const issueEntries: Entry[] = report.issues.map((issue, i) => ({
      kind: "issue",
      id: issue.id ?? `issue-${i}`,
      severity: issue.severity,
      category: issue.category,
      content: {
        label: issue.where ? `${issue.category} — ${issue.where}` : issue.category,
        problem: issue.problem,
        why: issue.why,
        fix: issue.fix,
      },
    }));

    const trailing: Entry[] = [
      { kind: "whole-document", id: "whole-document" },
    ];
    if (report.evidence_recovery.length > 0) {
      trailing.push({ kind: "evidence-recovery", id: "evidence-recovery" });
    }
    if (report.interview_exposure.length > 0) {
      trailing.push({ kind: "interview-exposure", id: "interview-exposure" });
    }
    trailing.push({ kind: "strongest-bullet", id: "strongest-bullet" });
    trailing.push({ kind: "checklist", id: "what-to-do-next" });

    return [{ kind: "stats", id: "stats" }, ...issueEntries, ...trailing];
  }, [report]);

  const categories = useMemo(() => {
    const seen = new Set<string>();
    const ordered: string[] = [];
    for (const entry of entries) {
      if (entry.kind === "issue" && !seen.has(entry.category)) {
        seen.add(entry.category);
        ordered.push(entry.category);
      }
    }
    return ordered;
  }, [entries]);

  const trailingRows = useMemo(
    () => [
      { id: "whole-document", label: "The whole document" },
      ...(report.evidence_recovery.length > 0
        ? [{ id: "evidence-recovery", label: "Evidence recovery" }]
        : []),
      ...(report.interview_exposure.length > 0
        ? [{ id: "interview-exposure", label: "Interview exposure" }]
        : []),
      { id: "strongest-bullet", label: "Strongest bullet" },
      { id: "what-to-do-next", label: "What to do next" },
    ],
    [report]
  );

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [filter, setFilter] = useState<Filter>("all");
  const [fixed, setFixed] = useState<Record<string, boolean>>({});
  const [checklistChecked, setChecklistChecked] = useState<
    Record<number, boolean>
  >({});

  const selected = entries[selectedIndex];

  const goPrev = useCallback(() => {
    setSelectedIndex((i) => Math.max(0, i - 1));
  }, []);

  const goNext = useCallback(() => {
    setSelectedIndex((i) => Math.min(entries.length - 1, i + 1));
  }, [entries.length]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") goPrev();
      else if (e.key === "ArrowRight") goNext();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goPrev, goNext]);

  const jumpToId = (id: string) => {
    const index = entries.findIndex((e) => e.id === id);
    if (index !== -1) setSelectedIndex(index);
  };

  const jumpToFirstIssue = (predicate: (e: Extract<Entry, { kind: "issue" }>) => boolean) => {
    const index = entries.findIndex((e) => e.kind === "issue" && predicate(e));
    if (index !== -1) setSelectedIndex(index);
  };

  const fixableIds = useMemo(
    () => entries.filter((e) => e.kind !== "stats").map((e) => e.id),
    [entries]
  );
  const fixedCount = fixableIds.filter((id) => fixed[id]).length;

  const issueCounts = useMemo(() => {
    const counts = { high: 0, medium: 0, low: 0 };
    report.issues.forEach((issue) => {
      counts[issue.severity] += 1;
    });
    return counts;
  }, [report]);

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-[#14213D] text-[#EFEAE0]">
      <header className="flex h-12 flex-shrink-0 items-center justify-between border-b border-[#24344F] px-8">
        <span className="text-[11px] uppercase tracking-[0.2em] text-[#9AA3B5]">
          CV Review
        </span>
        <span className="text-[11px] text-[#9AA3B5]">6 September 2026</span>
      </header>

      <div className="flex min-h-0 flex-1">
        <aside className="flex w-[300px] flex-shrink-0 flex-col border-r border-[#24344F]">
          <div className="flex-shrink-0 px-6 pb-4 pt-6">
            <p className="line-clamp-3 font-serif text-[20px] leading-snug text-[#EFEAE0]">
              {report.verdict}
            </p>
          </div>
          <div className="h-px flex-shrink-0 bg-[#24344F]" />

          <nav className="min-h-0 flex-1 overflow-y-auto py-2">
            <button
              type="button"
              onClick={() => {
                setFilter("all");
                setSelectedIndex(0);
              }}
              className={`block w-full border-l-2 px-6 py-2.5 text-left text-[11px] uppercase tracking-[0.1em] transition-colors duration-150 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                selected.id === "stats"
                  ? "border-[#7A2E2E] bg-[#22334F] text-[#EFEAE0]"
                  : "border-transparent text-[#9AA3B5] hover:text-[#EFEAE0]"
              }`}
            >
              Stats
            </button>

            {categories.map((category) => {
              const groupIssues = entries.filter(
                (e): e is Extract<Entry, { kind: "issue" }> =>
                  e.kind === "issue" &&
                  e.category === category &&
                  (filter === "all" || e.severity === filter)
              );
              if (groupIssues.length === 0) return null;
              return (
                <div key={category} className="mt-3 first:mt-0">
                  <div className="px-6 pb-1 pt-2 text-[11px] uppercase tracking-[0.1em] text-[#9AA3B5]">
                    {category}
                  </div>
                  {groupIssues.map((entry) => {
                    const isSelected = entry.id === selected.id;
                    return (
                      <button
                        key={entry.id}
                        type="button"
                        onClick={() => setSelectedIndex(entries.indexOf(entry))}
                        className={`flex w-full items-start gap-2 border-l-2 px-6 py-2 text-left transition-colors duration-150 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                          isSelected
                            ? "border-[#7A2E2E] bg-[#22334F]"
                            : "border-transparent hover:bg-[#1B2A4A]"
                        }`}
                      >
                        <span
                          className="mt-[6px] h-1 w-1 flex-shrink-0 rounded-full"
                          style={{ background: severityDotColor(entry.severity) }}
                        />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[11px] uppercase tracking-[0.06em] text-[#9AA3B5]">
                            {entry.content.label}
                          </span>
                          <span className="block truncate text-sm text-[#EFEAE0]">
                            {entry.content.problem}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              );
            })}

            <div className="mt-3 flex flex-col">
              {trailingRows.map((row) => (
                <button
                  key={row.id}
                  type="button"
                  onClick={() => jumpToId(row.id)}
                  className={`w-full border-l-2 px-6 py-2.5 text-left text-[11px] uppercase tracking-[0.1em] transition-colors duration-150 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    selected.id === row.id
                      ? "border-[#7A2E2E] bg-[#22334F] text-[#EFEAE0]"
                      : "border-transparent text-[#9AA3B5] hover:text-[#EFEAE0]"
                  }`}
                >
                  {row.label}
                </button>
              ))}
            </div>
          </nav>

          <div className="flex-shrink-0 border-t border-[#24344F] px-6 py-4">
            <p className="mb-2 text-xs text-[#9AA3B5]">
              {fixedCount} of {fixableIds.length} fixed
            </p>
            <div className="relative h-px bg-[#24344F]">
              <div
                className="absolute left-0 top-0 h-full bg-[#7A2E2E] transition-[width] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{ width: `${(fixedCount / fixableIds.length) * 100}%` }}
              />
            </div>
          </div>
        </aside>

        <main className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden px-16">
          <div className="w-full max-w-[620px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={selected.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2, ease: EASE }}
              >
                {selected.kind === "stats" && (
                  <>
                    <StatsPanel
                      totalCount={report.issues.length}
                      highCount={issueCounts.high}
                      mediumCount={issueCounts.medium}
                      lowCount={issueCounts.low}
                      noJobDescription={report.no_job_description}
                      onSelectAll={() => {
                        setFilter("all");
                        jumpToFirstIssue(() => true);
                      }}
                      onSelectSeverity={(severity) => {
                        setFilter(severity);
                        jumpToFirstIssue((e) => e.severity === severity);
                      }}
                    />
                    <NavFooter
                      index={selectedIndex}
                      total={entries.length}
                      onPrev={goPrev}
                      onNext={goNext}
                      canPrev={selectedIndex > 0}
                      canNext={selectedIndex < entries.length - 1}
                      showMarkAsFixed={false}
                    />
                  </>
                )}

                {selected.kind === "issue" && (
                  <>
                    <DetailPanel content={selected.content} />
                    <NavFooter
                      index={selectedIndex}
                      total={entries.length}
                      onPrev={goPrev}
                      onNext={goNext}
                      canPrev={selectedIndex > 0}
                      canNext={selectedIndex < entries.length - 1}
                      fixed={!!fixed[selected.id]}
                      onToggleFixed={() =>
                        setFixed((prev) => ({
                          ...prev,
                          [selected.id]: !prev[selected.id],
                        }))
                      }
                    />
                  </>
                )}

                {selected.kind === "whole-document" && (
                  <>
                    <WholeDocumentPanel
                      spine={report.spine}
                      silentSignals={report.silent_signals}
                      gaps={report.gaps}
                      alreadyHas={report.already_has}
                      noJobDescription={report.no_job_description}
                    />
                    <NavFooter
                      index={selectedIndex}
                      total={entries.length}
                      onPrev={goPrev}
                      onNext={goNext}
                      canPrev={selectedIndex > 0}
                      canNext={selectedIndex < entries.length - 1}
                      fixed={!!fixed[selected.id]}
                      onToggleFixed={() =>
                        setFixed((prev) => ({
                          ...prev,
                          [selected.id]: !prev[selected.id],
                        }))
                      }
                    />
                  </>
                )}

                {selected.kind === "evidence-recovery" && (
                  <>
                    <EvidenceRecoveryPanel items={report.evidence_recovery} />
                    <NavFooter
                      index={selectedIndex}
                      total={entries.length}
                      onPrev={goPrev}
                      onNext={goNext}
                      canPrev={selectedIndex > 0}
                      canNext={selectedIndex < entries.length - 1}
                      fixed={!!fixed[selected.id]}
                      onToggleFixed={() =>
                        setFixed((prev) => ({
                          ...prev,
                          [selected.id]: !prev[selected.id],
                        }))
                      }
                    />
                  </>
                )}

                {selected.kind === "interview-exposure" && (
                  <>
                    <InterviewExposurePanel items={report.interview_exposure} />
                    <NavFooter
                      index={selectedIndex}
                      total={entries.length}
                      onPrev={goPrev}
                      onNext={goNext}
                      canPrev={selectedIndex > 0}
                      canNext={selectedIndex < entries.length - 1}
                      fixed={!!fixed[selected.id]}
                      onToggleFixed={() =>
                        setFixed((prev) => ({
                          ...prev,
                          [selected.id]: !prev[selected.id],
                        }))
                      }
                    />
                  </>
                )}

                {selected.kind === "strongest-bullet" && (
                  <>
                    <StrongestBulletPanel
                      text={report.strongest_bullet.text}
                      why={report.strongest_bullet.why}
                    />
                    <NavFooter
                      index={selectedIndex}
                      total={entries.length}
                      onPrev={goPrev}
                      onNext={goNext}
                      canPrev={selectedIndex > 0}
                      canNext={selectedIndex < entries.length - 1}
                      fixed={!!fixed[selected.id]}
                      onToggleFixed={() =>
                        setFixed((prev) => ({
                          ...prev,
                          [selected.id]: !prev[selected.id],
                        }))
                      }
                    />
                  </>
                )}

                {selected.kind === "checklist" && (
                  <>
                    <ChecklistPanel
                      items={report.action_checklist}
                      checked={checklistChecked}
                      onToggle={(index) =>
                        setChecklistChecked((prev) => ({
                          ...prev,
                          [index]: !prev[index],
                        }))
                      }
                    />
                    <NavFooter
                      index={selectedIndex}
                      total={entries.length}
                      onPrev={goPrev}
                      onNext={goNext}
                      canPrev={selectedIndex > 0}
                      canNext={selectedIndex < entries.length - 1}
                      fixed={!!fixed[selected.id]}
                      onToggleFixed={() =>
                        setFixed((prev) => ({
                          ...prev,
                          [selected.id]: !prev[selected.id],
                        }))
                      }
                    />
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}
