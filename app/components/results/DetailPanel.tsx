"use client";

export interface DetailContent {
  label: string;
  problem: string;
  why: string;
  fix: string;
}

export default function DetailPanel({ content }: { content: DetailContent }) {
  return (
    <div className="flex flex-col gap-5">
      <span className="text-[11px] uppercase tracking-[0.1em] text-[#9AA3B5]">
        {content.label}
      </span>

      <p className="line-clamp-3 font-serif text-2xl leading-snug text-[#EFEAE0]">
        {content.problem}
      </p>

      <div className="h-px bg-[#24344F]" />

      <div className="flex flex-col gap-1.5">
        <span className="text-[11px] uppercase tracking-[0.1em] text-[#9AA3B5]">
          Why this matters
        </span>
        <p className="line-clamp-2 text-sm leading-relaxed text-[#EFEAE0]">
          {content.why}
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-[11px] uppercase tracking-[0.1em] text-[#9AA3B5]">
          What to do
        </span>
        <p className="line-clamp-2 text-sm leading-relaxed text-[#EFEAE0]">
          {content.fix}
        </p>
      </div>
    </div>
  );
}
