"use client";

export default function ChecklistPanel({
  items,
  checked,
  onToggle,
}: {
  items: string[];
  checked: Record<number, boolean>;
  onToggle: (index: number) => void;
}) {
  const doneCount = items.filter((_, i) => checked[i]).length;

  return (
    <div className="flex flex-col gap-5">
      <span className="text-[11px] uppercase tracking-[0.1em] text-[#9AA3B5]">
        What to do next
      </span>

      <p className="font-serif text-2xl leading-snug text-[#EFEAE0]">
        {doneCount} of {items.length} actions checked off
      </p>

      <div className="h-px bg-[#24344F]" />

      <div className="grid grid-cols-2 gap-x-8 gap-y-3">
        {items.map((text, i) => {
          const isDone = !!checked[i];
          return (
            <button
              key={i}
              type="button"
              onClick={() => onToggle(i)}
              className="flex items-start gap-2 text-left"
            >
              <span
                className={`mt-[3px] h-3 w-3 flex-shrink-0 rounded-[2px] border transition-colors duration-150 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isDone
                    ? "border-[#7A2E2E] bg-[#7A2E2E]"
                    : "border-[#24344F] bg-transparent"
                }`}
              />
              <span
                className={`text-[13px] leading-snug transition-opacity duration-150 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isDone
                    ? "text-[#EFEAE0] opacity-40 line-through"
                    : "text-[#EFEAE0] opacity-100"
                }`}
              >
                {text}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
