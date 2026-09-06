"use client";

export default function InterviewExposurePanel({
  items,
}: {
  items: string[];
}) {
  return (
    <div className="flex flex-col gap-5">
      <span className="text-[11px] uppercase tracking-[0.1em] text-[#9AA3B5]">
        Interview exposure
      </span>

      <p className="font-serif text-2xl leading-snug text-[#EFEAE0]">
        What you&apos;ll need to defend in the room.
      </p>

      <div className="h-px bg-[#24344F]" />

      <div className="flex flex-col divide-y divide-[#24344F]">
        {items.map((line, i) => (
          <p
            key={i}
            className="line-clamp-2 py-3 text-sm leading-relaxed text-[#EFEAE0] first:pt-0"
          >
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}
