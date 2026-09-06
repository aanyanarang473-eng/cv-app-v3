"use client";

import type { EvidenceRecoveryItem } from "@/lib/report";

export default function EvidenceRecoveryPanel({
  items,
}: {
  items: EvidenceRecoveryItem[];
}) {
  return (
    <div className="flex flex-col gap-5">
      <span className="text-[11px] uppercase tracking-[0.1em] text-[#9AA3B5]">
        Evidence recovery
      </span>

      <p className="font-serif text-2xl leading-snug text-[#EFEAE0]">
        Questions worth answering before you send this.
      </p>

      <div className="h-px bg-[#24344F]" />

      <div className="flex flex-col divide-y divide-[#24344F]">
        {items.map((item, i) => (
          <div key={i} className="flex flex-col gap-1 py-3 first:pt-0">
            <p className="text-sm text-[#EFEAE0]">{item.question}</p>
            <p className="text-xs text-[#9AA3B5]">If yes: {item.if_yes}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
