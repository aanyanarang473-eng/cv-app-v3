"use client";

import { useState } from "react";

export default function Home() {
  const [cv, setCv] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  const canSubmit = cv.trim().length > 0 && jobDescription.trim().length > 0;

  return (
    <div className="min-h-screen bg-white px-6 py-16">
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <h1 className="text-3xl font-semibold text-gray-900">
          What&apos;s wrong with my CV?
        </h1>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label htmlFor="cv" className="text-sm font-medium text-gray-700">
              Paste your CV
            </label>
            <textarea
              id="cv"
              value={cv}
              onChange={(e) => setCv(e.target.value)}
              className="h-96 w-full resize-none rounded-md border border-gray-300 p-4 text-gray-900 focus:border-gray-500 focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="job-description"
              className="text-sm font-medium text-gray-700"
            >
              Paste the job description
            </label>
            <textarea
              id="job-description"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="h-96 w-full resize-none rounded-md border border-gray-300 p-4 text-gray-900 focus:border-gray-500 focus:outline-none"
            />
          </div>
        </div>

        <button
          type="button"
          disabled={!canSubmit}
          className="self-start rounded-md bg-gray-900 px-6 py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          Check my CV
        </button>
      </div>
    </div>
  );
}
