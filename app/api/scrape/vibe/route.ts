/**
 * Streaming Vibe Analysis API Route
 * Uses Groq with real-time streaming
 */

import { NextRequest } from "next/server";
import { createGroq } from "@ai-sdk/groq";
import { streamText } from "ai";

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { heroText, pageTitle } = body;

    if (!heroText || typeof heroText !== "string") {
      return new Response("Hero text is required", { status: 400 });
    }

    if (!process.env.GROQ_API_KEY) {
      return new Response("GROQ_API_KEY not configured", { status: 500 });
    }

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

    const result = streamText({
      model: groq("llama-3.3-70b-versatile"),
      system: "You are a brand analyst. Always respond with valid JSON only.",
      prompt,
      temperature: 0.7,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("[Vibe Stream] Error:", error);
    return new Response(
      error instanceof Error ? error.message : "Unknown error occurred",
      { status: 500 }
    );
  }
}
