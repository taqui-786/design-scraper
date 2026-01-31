import { NextRequest, NextResponse } from "next/server";
import { scrapeDesignSystem } from "@/lib/scraper";
import type { ScrapeResponse } from "@/lib/scraper";

export const maxDuration = 60;

export async function POST(
  request: NextRequest
): Promise<NextResponse<ScrapeResponse>> {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { success: false, error: "URL is required" },
        { status: 400 }
      );
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
      if (!["http:", "https:"].includes(parsedUrl.protocol)) {
        throw new Error("Invalid protocol");
      }
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid URL format. Please include http:// or https://",
        },
        { status: 400 }
      );
    }

    console.log(`[Scraper] Starting scrape for: ${url}`);

    const result = await scrapeDesignSystem(url);

    console.log(`[Scraper] Completed in ${result.meta.duration}ms`);
    console.log(
      `[Scraper] Colors found: ${result.colors.all.length}, Primary: ${result.colors.primary}`
    );
    console.log(
      `[Scraper] Typography: Heading=${result.typography.headingFont}, Body=${result.typography.bodyFont}`
    );
    console.log(
      `[Scraper] Logo: ${result.logo ? result.logo.type : "not found"}`
    );

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("[Scraper] Error:", error);

    const message =
      error instanceof Error ? error.message : "Unknown error occurred";

    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
