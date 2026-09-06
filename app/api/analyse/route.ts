import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { CV_REVIEWER_SYSTEM_PROMPT } from "@/lib/systemPrompt";
import { REPORT_INPUT_SCHEMA, REPORT_TOOL_NAME } from "@/lib/reportSchema";
import { isReportPayload } from "@/lib/report";

export async function POST(request: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "The server is missing its Anthropic API key." },
      { status: 500 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "That request wasn't valid JSON." },
      { status: 400 }
    );
  }

  const { cvText, jobText, sector, level } = (body ?? {}) as Record<
    string,
    unknown
  >;

  if (typeof cvText !== "string" || cvText.trim().length === 0) {
    return NextResponse.json({ error: "cvText is required." }, { status: 400 });
  }
  if (typeof jobText !== "string" || jobText.trim().length === 0) {
    return NextResponse.json({ error: "jobText is required." }, { status: 400 });
  }

  const userMessage = [
    `CV:\n${cvText}`,
    `Job description:\n${jobText}`,
    typeof sector === "string" && sector ? `Sector: ${sector}` : null,
    typeof level === "string" && level ? `Level: ${level}` : null,
  ]
    .filter(Boolean)
    .join("\n\n");

  const anthropic = new Anthropic({ apiKey });

  let response;
  try {
    response = await anthropic.messages.create({
      model: "claude-sonnet-5",
      max_tokens: 16000,
      system: CV_REVIEWER_SYSTEM_PROMPT,
      messages: [{ role: "user", content: userMessage }],
      tools: [
        {
          name: REPORT_TOOL_NAME,
          description: "Submit the structured CV review report.",
          input_schema:
            REPORT_INPUT_SCHEMA as unknown as Anthropic.Tool["input_schema"],
        },
      ],
      tool_choice: { type: "tool", name: REPORT_TOOL_NAME },
    });
  } catch (error) {
    console.error("Anthropic API request failed:", error);
    return NextResponse.json(
      { error: "The CV review failed to run. Please try again." },
      { status: 502 }
    );
  }

  const toolUseBlock = response.content.find(
    (block) => block.type === "tool_use" && block.name === REPORT_TOOL_NAME
  );

  let reportCandidate: unknown = null;

  if (toolUseBlock && toolUseBlock.type === "tool_use") {
    console.log("[analyse] Using tool_use block for the report.");
    reportCandidate = toolUseBlock.input;
  } else {
    const textBlock = response.content.find((block) => block.type === "text");
    if (textBlock && textBlock.type === "text") {
      console.log(
        "[analyse] No tool_use block found; falling back to text block."
      );
      const stripped = textBlock.text
        .trim()
        .replace(/^```(?:json)?\s*/i, "")
        .replace(/\s*```$/i, "");
      try {
        reportCandidate = JSON.parse(stripped);
      } catch (error) {
        console.error("[analyse] Failed to parse text block as JSON:", error);
      }
    } else {
      console.error("[analyse] No tool_use or text block found in response.");
    }
  }

  if (!isReportPayload(reportCandidate)) {
    console.error("Anthropic response missing a valid report:", response);
    return NextResponse.json(
      { error: "The review came back in an unexpected format. Please try again." },
      { status: 502 }
    );
  }

  return NextResponse.json(reportCandidate);
}
