"use client";

export default function NavFooter({
  index,
  total,
  onPrev,
  onNext,
  canPrev,
  canNext,
  fixed,
  onToggleFixed,
  showMarkAsFixed = true,
}: {
  index: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  canPrev: boolean;
  canNext: boolean;
  fixed?: boolean;
  onToggleFixed?: () => void;
  showMarkAsFixed?: boolean;
}) {
  return (
    <div className="mt-8 flex flex-shrink-0 items-center justify-between border-t border-[#24344F] pt-4">
      {showMarkAsFixed ? (
        <button
          type="button"
          onClick={onToggleFixed}
          className={`text-xs uppercase tracking-[0.08em] transition-colors duration-150 ease-[cubic-bezier(0.16,1,0.3,1)] hover:text-[#EFEAE0] ${
            fixed ? "text-[#9AA3B5]" : "text-[#EFEAE0]"
          }`}
        >
          {fixed ? "Marked as fixed" : "Mark as fixed"}
        </button>
      ) : (
        <span />
      )}
      <div className="flex items-center gap-4 text-xs text-[#9AA3B5]">
        <button
          type="button"
          onClick={onPrev}
          disabled={!canPrev}
          className="transition-colors duration-150 ease-[cubic-bezier(0.16,1,0.3,1)] hover:text-[#EFEAE0] disabled:opacity-30 disabled:hover:text-[#9AA3B5]"
        >
          ←
        </button>
        <span>
          {index + 1} of {total}
        </span>
        <button
          type="button"
          onClick={onNext}
          disabled={!canNext}
          className="transition-colors duration-150 ease-[cubic-bezier(0.16,1,0.3,1)] hover:text-[#EFEAE0] disabled:opacity-30 disabled:hover:text-[#9AA3B5]"
        >
          →
        </button>
      </div>
    </div>
  );
}
