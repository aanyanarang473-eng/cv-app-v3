"use client";

function humanize(tag: string) {
  return tag.charAt(0).toUpperCase() + tag.slice(1).replace(/_/g, " ");
}

export default function WholeDocumentPanel({
  spine,
  silentSignals,
  gaps,
  alreadyHas,
  noJobDescription,
}: {
  spine: string;
  silentSignals: string[];
  gaps: string[];
  alreadyHas: string[];
  noJobDescription: boolean;
}) {
  return (
    <div className="flex flex-col gap-5">
      <span className="text-[11px] uppercase tracking-[0.1em] text-[#9AA3B5]">
        The whole document
      </span>

      <p className="line-clamp-3 font-serif text-2xl leading-snug text-[#EFEAE0]">
        {spine}
      </p>

      <div className="h-px bg-[#24344F]" />

      {silentSignals.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <span className="text-[11px] uppercase tracking-[0.1em] text-[#9AA3B5]">
            Silent signals
          </span>
          <div className="flex flex-col gap-1.5">
            {silentSignals.map((signal, i) => (
              <p key={i} className="line-clamp-2 text-sm leading-relaxed text-[#EFEAE0]">
                {signal}
              </p>
            ))}
          </div>
        </div>
      )}

      {gaps.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <span className="text-[11px] uppercase tracking-[0.1em] text-[#9AA3B5]">
            Gaps
          </span>
          <p className="text-sm text-[#EFEAE0]">
            {gaps.map(humanize).join(" · ")}
          </p>
        </div>
      )}

      {alreadyHas.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <span className="text-[11px] uppercase tracking-[0.1em] text-[#9AA3B5]">
            Already demonstrates
          </span>
          <p className="text-sm text-[#EFEAE0]">
            {alreadyHas.map(humanize).join(" · ")}
          </p>
        </div>
      )}

      {noJobDescription && (
        <p className="text-xs text-[#9AA3B5]">
          Reviewed without a job description — relevance and job-alignment
          checks were skipped.
        </p>
      )}
    </div>
  );
}
