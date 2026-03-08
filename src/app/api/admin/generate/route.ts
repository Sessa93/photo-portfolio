import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import OpenAI from "openai";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "OpenAI API key not configured." },
      { status: 500 },
    );
  }

  const model = process.env.OPENAI_MODEL || "gpt-4o";

  const { imageData, location, field, film, lens, settings } = await req.json();
  if (!imageData || typeof imageData !== "string") {
    return NextResponse.json(
      { error: "imageData is required." },
      { status: 400 },
    );
  }

  // field can be "title", "description", "tags", or undefined (both title+description)
  const generateField: string =
    field === "title" || field === "description" || field === "tags"
      ? field
      : "both";

  try {
    // imageData is a base64 string from the client. Use it directly for OpenAI/image processing logic.
    const openai = new OpenAI({ apiKey });

    const locationHint =
      location && typeof location === "string" && location.trim()
        ? ` The photo was taken in ${location.trim()}.`
        : "";
    const filmHint =
      film && typeof film === "string" && film.trim()
        ? ` The film used is ${film.trim()}.`
        : "";
    const lensHint =
      lens && typeof lens === "string" && lens.trim()
        ? ` The lens used is ${lens.trim()}.`
        : "";
    const settingsHint =
      settings && typeof settings === "string" && settings.trim()
        ? ` The camera settings are ${settings.trim()}.`
        : "";

    let prompt: string;
    let responseFormat: string;
    if (generateField === "title") {
      prompt = `You are an assistant for a photography portfolio website. Given the following photo, generate a short artistic title.${locationHint} Respond in JSON format: {"title": "..."}. Do not include any other text.`;
      responseFormat = "title";
    } else if (generateField === "description") {
      prompt = `You are an assistant for a photography portfolio website. Given the following photo, generate a brief evocative description (1-2 sentences).${locationHint} Respond in JSON format: {"description": "..."}. Do not include any other text.`;
      responseFormat = "description";
    } else if (generateField === "tags") {
      prompt = `You are an assistant for a photography portfolio website. Given the following photo, generate a comma-separated list of relevant tags (e.g. location, film type, colors, camera, lens, mood, style, subject). Provide 5-10 concise tags.${locationHint}${filmHint}${lensHint}${settingsHint} Respond in JSON format: {"tags": "tag1, tag2, tag3, ..."}. Do not include any other text.`;
      responseFormat = "tags";
    } else {
      prompt = `You are an assistant for a photography portfolio website. Given the following photo, generate a short artistic title and a brief evocative description (1-2 sentences).${locationHint} Respond in JSON format: {"title": "...", "description": "..."}. Do not include any other text.`;
      responseFormat = "both";
    }

    const response = await openai.chat.completions.create({
      model,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt,
            },
            {
              type: "image_url",
              image_url: { url: dataUrl },
            },
          ],
        },
      ],
      max_tokens: 200,
    });

    const content = response.choices[0]?.message?.content?.trim() ?? "";

    // Parse JSON from the response, stripping markdown fences if present
    let jsonStr = content;
    const fenceMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (fenceMatch) {
      jsonStr = fenceMatch[1].trim();
    }

    const parsed = JSON.parse(jsonStr);

    const result: Record<string, string> = {};
    if (responseFormat === "title" || responseFormat === "both") {
      result.title = parsed.title ?? "";
    }
    if (responseFormat === "description" || responseFormat === "both") {
      result.description = parsed.description ?? "";
    }
    if (responseFormat === "tags") {
      result.tags = parsed.tags ?? "";
    }

    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to generate.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
