"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import LoadingSequence from "./components/LoadingSequence";

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function Home() {
  const router = useRouter();
  const [cvMode, setCvMode] = useState<"file" | "text">("file");
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvText, setCvText] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);

  const [jobDescription, setJobDescription] = useState("");
  const [sector, setSector] = useState("");
  const [level, setLevel] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const isValidCvFile = (file: File) => {
    const name = file.name.toLowerCase();
    return name.endsWith(".pdf") || name.endsWith(".docx");
  };

  const handleFile = (file: File) => {
    if (!isValidCvFile(file)) {
      setFileError("Please upload a PDF or Word (.docx) file.");
      return;
    }
    setFileError(null);
    setCvFile(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  };

  const removeFile = () => {
    setCvFile(null);
    setFileError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const hasCv = cvMode === "file" ? cvFile !== null : cvText.trim().length > 0;
  const canSubmit = hasCv && jobDescription.trim().length >= 100;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    if (cvMode === "file") {
      setSubmitError(
        'File uploads aren\'t analysed yet — choose "Paste as text instead" to continue.'
      );
      return;
    }

    setSubmitError(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/analyse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cvText,
          jobText: jobDescription,
          sector,
          level,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "The review failed. Please try again.");
      }
      sessionStorage.setItem("cv-review-report", JSON.stringify(data));
      router.push("/results");
    } catch (err) {
      setIsLoading(false);
      setSubmitError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    }
  };

  if (isLoading) {
    return <LoadingSequence />;
  }

  return (
    <div className="min-h-screen bg-[#14213D] px-6 py-16 md:py-24">
      <div className="mx-auto flex max-w-5xl flex-col">
        <div className="flex flex-col gap-3">
          <span className="text-[11px] uppercase tracking-[0.2em] text-[#9AA3B5]">
            CV REVIEW
          </span>
          <h1 className="font-serif text-[46px] leading-[1.1] tracking-[-0.015em] text-[#EFEAE0]">
            What&apos;s wrong with your CV?
          </h1>
          <p className="max-w-[520px] text-base leading-relaxed text-[#9AA3B5]">
            Most tools rewrite your CV. We tell you what&apos;s wrong with it —
            the vague bullet, the buried achievement, the two pages that
            should be one — before you send it to anyone.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-10 md:grid-cols-2">
          <div className="flex flex-col gap-3">
            <span className="text-[12px] uppercase tracking-[0.1em] text-[#9AA3B5]">
              YOUR CV
            </span>

            {cvMode === "file" ? (
              <>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragOver(true);
                  }}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={handleDrop}
                  className={`flex h-[280px] cursor-pointer flex-col items-center justify-center gap-1 rounded-[2px] border border-dashed px-6 text-center transition-colors duration-150 ${
                    isDragOver
                      ? "border-[#7A2E2E] bg-[#1B2A4A]"
                      : "border-[#24344F]"
                  }`}
                >
                  {cvFile ? (
                    <>
                      <span className="text-sm text-[#EFEAE0]">
                        {cvFile.name}
                      </span>
                      <span className="text-xs text-[#9AA3B5]">
                        {formatFileSize(cvFile.size)}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile();
                        }}
                        className="mt-3 text-xs text-[#9AA3B5] transition-colors duration-150 hover:text-[#EFEAE0]"
                      >
                        Remove
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="text-sm text-[#EFEAE0]">
                        Drop your CV here
                      </span>
                      <span className="text-xs text-[#9AA3B5]">
                        PDF or Word · or paste it instead
                      </span>
                    </>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
                {fileError && (
                  <p className="text-xs text-[#9AA3B5]">{fileError}</p>
                )}
                <button
                  type="button"
                  onClick={() => setCvMode("text")}
                  className="self-start text-xs text-[#9AA3B5] underline-offset-4 transition-colors duration-150 hover:text-[#EFEAE0] hover:underline"
                >
                  Paste as text instead
                </button>
              </>
            ) : (
              <>
                <textarea
                  value={cvText}
                  onChange={(e) => setCvText(e.target.value)}
                  placeholder="Paste your CV"
                  className="h-[280px] w-full resize-none rounded-[2px] border border-[#24344F] bg-[#1B2A4A] p-4 text-sm text-[#EFEAE0] transition-colors duration-150 focus:border-[#7A2E2E] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setCvMode("file")}
                  className="self-start text-xs text-[#9AA3B5] underline-offset-4 transition-colors duration-150 hover:text-[#EFEAE0] hover:underline"
                >
                  Upload a file instead
                </button>
              </>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-[12px] uppercase tracking-[0.1em] text-[#9AA3B5]">
              JOB DESCRIPTION
            </span>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description"
              className="h-[180px] w-full resize-none rounded-[2px] border border-[#24344F] bg-[#1B2A4A] p-4 text-sm text-[#EFEAE0] transition-colors duration-150 focus:border-[#7A2E2E] focus:outline-none"
            />
            {jobDescription.length > 20 && (
              <span className="text-xs text-[#9AA3B5]">
                {jobDescription.length} characters
              </span>
            )}

            <div className="mt-3 grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="sector"
                  className="text-[12px] uppercase tracking-[0.1em] text-[#9AA3B5]"
                >
                  Sector
                </label>
                <select
                  id="sector"
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                  className="rounded-[2px] border border-[#24344F] bg-[#1B2A4A] px-3 py-2 text-sm text-[#EFEAE0] transition-colors duration-150 focus:border-[#7A2E2E] focus:outline-none"
                >
                  <option value="">—</option>
                  <option>Consulting</option>
                  <option>Finance</option>
                  <option>Technology</option>
                  <option>Marketing</option>
                  <option>Accounting</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="level"
                  className="text-[12px] uppercase tracking-[0.1em] text-[#9AA3B5]"
                >
                  Level
                </label>
                <select
                  id="level"
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="rounded-[2px] border border-[#24344F] bg-[#1B2A4A] px-3 py-2 text-sm text-[#EFEAE0] transition-colors duration-150 focus:border-[#7A2E2E] focus:outline-none"
                >
                  <option value="">—</option>
                  <option>Internship</option>
                  <option>Graduate</option>
                  <option>1–3 years</option>
                  <option>Career change</option>
                </select>
              </div>
            </div>
            <span className="text-xs text-[#9AA3B5]">
              Optional. Sharpens the analysis.
            </span>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start gap-3">
          <button
            type="button"
            disabled={!canSubmit}
            onClick={handleSubmit}
            className="rounded-[2px] bg-[#7A2E2E] px-8 py-3 text-[12px] uppercase tracking-[0.1em] text-[#EFEAE0] transition-colors duration-150 focus:outline focus:outline-1 focus:outline-offset-2 focus:outline-[#7A2E2E] disabled:bg-[#24344F] disabled:text-[#9AA3B5]"
          >
            REQUEST REVIEW
          </button>
          {submitError && (
            <p className="text-xs text-[#7A2E2E]">{submitError}</p>
          )}
          <span className="text-xs text-[#9AA3B5]">
            We never invent experience or add skills you don&apos;t have.
          </span>
        </div>
      </div>
    </div>
  );
}
