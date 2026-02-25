import {NextRequest, NextResponse} from "next/server";
import {getSession} from "@/lib/session";
import OpenAI from "openai";

export async function POST(req: NextRequest) {
    const session = await getSession();
    if (!session.userId) {
        return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        return NextResponse.json({error: "OpenAI API key not configured."}, {status: 500});
    }

    const model = process.env.OPENAI_MODEL || "gpt-4o";

    const {imageUrl, location, field} = await req.json();
    if (!imageUrl || typeof imageUrl !== "string") {
        return NextResponse.json({error: "imageUrl is required."}, {status: 400});
    }

    // field can be "title", "description", "tags", or undefined (both title+description)
    const generateField: string = (field === "title" || field === "description" || field === "tags") ? field : "both";

    try {
        // Use a browser-like User-Agent to avoid 503 blocks from image hosts.
        const fetchHeaders = {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        };

        let resolvedUrl = imageUrl;
        if (imageUrl.includes("/photos/share/")) {
            const pageRes = await fetch(imageUrl, {headers: fetchHeaders});
            if (!pageRes.ok) {
                return NextResponse.json(
                    {error: `Failed to fetch share page: ${pageRes.status}`},
                    {status: 400},
                );
            }
            const html = await pageRes.text();
            const ogMatch =
                html.match(/og:image['"\s]+content=['"]([^'"]+)['"]/) ||
                html.match(/content=['"]([^'"]+)['"]\s+property=['"]og:image/) ||
                html.match(/(https:\/\/content[^'"]*cdproxy\/templink[^'"]+)/) ||
                html.match(/(https:\/\/thumbnails-photos\.amazon\.[^'"]+)/);
            if (ogMatch) {
                resolvedUrl = ogMatch[1].replace(/viewBox=[^&]+/, "viewBox=2400%2C2400");
            } else {
                return NextResponse.json(
                    {error: "Could not extract image URL from share link."},
                    {status: 422},
                );
            }
        }

        // Fetch the actual image with retries for transient errors.
        let imageRes: Response | null = null;
        for (let attempt = 0; attempt < 3; attempt++) {
            imageRes = await fetch(resolvedUrl, {
                redirect: "follow",
                headers: {
                    ...fetchHeaders,
                    "Accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
                },
            });
            if (imageRes.ok) break;
            if (imageRes.status === 503 && attempt < 2) {
                await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
                continue;
            }
            break;
        }

        if (!imageRes || !imageRes.ok) {
            return NextResponse.json(
                {error: `Failed to fetch image: ${imageRes?.status ?? "unknown"}`},
                {status: 400},
            );
        }

        const contentType = imageRes.headers.get("content-type") ?? "image/jpeg";
        const buffer = Buffer.from(await imageRes.arrayBuffer());
        const base64 = buffer.toString("base64");
        const dataUrl = `data:${contentType};base64,${base64}`;

        const openai = new OpenAI({apiKey});

        const locationHint = location && typeof location === "string" && location.trim()
            ? ` The photo was taken in ${location.trim()}.`
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
            prompt = `You are an assistant for a photography portfolio website. Given the following photo, generate a comma-separated list of relevant tags (e.g. location, film type, colors, camera, lens, mood, style, subject). Provide 5-10 concise tags.${locationHint} Respond in JSON format: {"tags": "tag1, tag2, tag3, ..."}. Do not include any other text.`;
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
                            image_url: {url: dataUrl},
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
        return NextResponse.json({error: message}, {status: 500});
    }
}
