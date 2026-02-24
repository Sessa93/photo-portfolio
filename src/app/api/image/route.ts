import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");
  if (!url) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
  }

  try {
    let imageUrl = url;

    // If it's an Amazon Photos share link, resolve to the actual image URL
    if (url.includes("/photos/share/")) {
      const pageResponse = await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
      });
      const html = await pageResponse.text();

      // Extract image URL — og:image uses mixed quote styles, also look for templink/thumbnail URLs
      const ogMatch =
        html.match(/og:image['"\s]+content=['"]([^'"]+)['"]/) ||
        html.match(/content=['"]([^'"]+)['"]\s+property=['"]og:image/) ||
        html.match(/(https:\/\/content[^'"]*cdproxy\/templink[^'"]+)/) ||
        html.match(/(https:\/\/thumbnails-photos\.amazon\.[^'"]+)/);

      if (ogMatch) {
        // Use the templink URL but request a larger image by adjusting viewBox
        imageUrl = ogMatch[1].replace(/viewBox=[^&]+/, "viewBox=2400%2C2400");
      } else {
        return NextResponse.json(
          { error: "Could not extract image URL from share link" },
          { status: 422 }
        );
      }
    }

    // Fetch the actual image
    const imageResponse = await fetch(imageUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    if (!imageResponse.ok) {
      return NextResponse.json(
        { error: `Image fetch failed: ${imageResponse.status}` },
        { status: 502 }
      );
    }

    const contentType = imageResponse.headers.get("content-type") || "image/jpeg";
    const buffer = await imageResponse.arrayBuffer();

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=604800, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("Image proxy error:", error);
    return NextResponse.json({ error: "Failed to fetch image" }, { status: 500 });
  }
}
