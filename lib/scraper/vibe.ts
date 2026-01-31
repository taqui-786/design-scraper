import type { VibeAnalysis } from "./types";
import { createGroq } from "@ai-sdk/groq";
import { generateText } from "ai";

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function extractHeroTextFromPage(
  page: import("playwright-core").Page
): Promise<string | null> {
  const heroText = await page.evaluate(() => {
    const selectors = [
      "h1",
      '[class*="hero"] h1',
      '[class*="hero"] h2',
      '[class*="hero"] p',
      '[class*="banner"] h1',
      '[class*="headline"]',
      "main h1",
      "header h1",
    ];

    const texts: string[] = [];

    for (const selector of selectors) {
      const elements = document.querySelectorAll(selector);
      for (const el of elements) {
        const text = el.textContent?.trim();
        if (text && text.length > 5 && text.length < 500) {
          texts.push(text);
        }
      }

      if (texts.length >= 3) break;
    }

    return texts.join("\n") || null;
  });

  return heroText;
}

export async function analyzeVibeWithLLM(
  heroText: string,
  pageTitle?: string
): Promise<VibeAnalysis | null> {
  if (!process.env.GROQ_API_KEY) {
    console.warn("GROQ_API_KEY not set, skipping vibe analysis");
    return null;
  }

  try {
    const prompt = `Analyze the following website headline/hero text and determine:
1. The tone of voice (e.g., Professional, Casual, Playful, Authoritative, Friendly)
2. The target audience (e.g., Developers, Enterprise, Consumers, Startups)
3. The design vibe (e.g., Corporate Memphis, Minimalist, Brutalist, Glassmorphism, Tech-forward)

Website Title: ${pageTitle || "Unknown"}
Hero/Headline Text:
"""
${heroText}
"""

Respond ONLY with a JSON object in this exact format:
{"tone": "string", "audience": "string", "vibe": "string", "summary": "one sentence summary of brand voice"}`;

    const { text } = await generateText({
      model: groq("openai/gpt-oss-20b"),
      system: "You are a brand analyst. Always respond with valid JSON only.",
      prompt,
      temperature: 0.7,
    });

    if (!text) return null;

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;

    const parsed = JSON.parse(jsonMatch[0]);
    return {
      tone: parsed.tone || "Unknown",
      audience: parsed.audience || "Unknown",
      vibe: parsed.vibe || "Unknown",
      summary: parsed.summary,
    };
  } catch (error) {
    console.error("LLM analysis error:", error);
    return null;
  }
}
