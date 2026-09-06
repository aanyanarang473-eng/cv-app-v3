"use client";

export default function StrongestBulletPanel({
  text,
  why,
}: {
  text: string;
  why: string;
}) {
  return (
    <div className="flex flex-col gap-5">
      <span className="text-[11px] uppercase tracking-[0.1em] text-[#9AA3B5]">
        Strongest bullet
      </span>

      <div className="border border-[#24344F] p-6">
        <p className="font-serif text-xl italic leading-relaxed text-[#EFEAE0]">
          {text}
        </p>
        <p className="mt-4 text-sm text-[#9AA3B5]">{why}</p>
      </div>
    </div>
  );
}
