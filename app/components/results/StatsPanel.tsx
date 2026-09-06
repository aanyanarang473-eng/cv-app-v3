"use client";

import { useEffect, useState } from "react";
import { animate } from "framer-motion";
import type { Severity } from "@/lib/report";
import { EASE } from "../LoadingSequence";

function useCountUp(target: number, delay: number) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const controls = animate(0, target, {
      duration: 0.7,
      delay,
      ease: EASE,
      onUpdate: (v) => setValue(Math.round(v)),
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return value;
}

interface StatItem {
  key: string;
  value: number;
  label: string;
  onClick: () => void;
}

export default function StatsPanel({
  totalCount,
  highCount,
  mediumCount,
  lowCount,
  noJobDescription,
  onSelectAll,
  onSelectSeverity,
}: {
  totalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
  noJobDescription: boolean;
  onSelectAll: () => void;
  onSelectSeverity: (severity: Severity) => void;
}) {
  const totalValue = useCountUp(totalCount, 0);
  const highValue = useCountUp(highCount, 0.08);
  const mediumValue = useCountUp(mediumCount, 0.16);
  const lowValue = useCountUp(lowCount, 0.24);

  const stats: StatItem[] = [
    { key: "total", value: totalValue, label: "Issues", onClick: onSelectAll },
    {
      key: "high",
      value: highValue,
      label: "High",
      onClick: () => onSelectSeverity("high"),
    },
    {
      key: "medium",
      value: mediumValue,
      label: "Medium",
      onClick: () => onSelectSeverity("medium"),
    },
    {
      key: "low",
      value: lowValue,
      label: "Low",
      onClick: () => onSelectSeverity("low"),
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-4 gap-6">
        {stats.map((stat) => (
          <button
            key={stat.key}
            type="button"
            onClick={stat.onClick}
            className="group flex flex-col items-start gap-1 text-left"
          >
            <span className="font-serif text-5xl leading-none text-[#EFEAE0] transition-colors duration-150 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:text-[#7A2E2E]">
              {stat.value}
            </span>
            <span className="text-[11px] uppercase tracking-[0.08em] text-[#9AA3B5]">
              {stat.label}
            </span>
          </button>
        ))}
      </div>

      {noJobDescription && (
        <>
          <div className="h-px bg-[#24344F]" />
          <p className="text-xs text-[#9AA3B5]">
            Reviewed without a job description — relevance and job-alignment
            checks were skipped.
          </p>
        </>
      )}
    </div>
  );
}
