"use client";

import { useState } from "react";

import { InputForm } from "./input-form";
import { ResultsGrid } from "./results-grid";
import { ScanHistory } from "./scan-history";
import { HeroSection } from "./hero-section";
import { saveToHistory } from "@/lib/history";
import type { DesignSystemResult } from "@/lib/scraper/types";

export function ScraperContainer() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DesignSystemResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [vibeStreaming, setVibeStreaming] = useState(false);
  const [streamedVibe, setStreamedVibe] = useState<string>("");

  const handleScrape = async () => {
    if (!url.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);
    setVibeStreaming(false);
    setStreamedVibe("");

    try {
      const response = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to scrape design system");
      }

      setResult(data.data);

      if (data.data) {
        saveToHistory(data.data);
      }

      if (data.data) {
        streamVibeAnalysis(url, data.data.heroText, data.data.meta.title);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectFromHistory = (historicalResult: DesignSystemResult) => {
    setUrl(historicalResult.meta.url);
    setResult(historicalResult);
    setVibeStreaming(false);
    setStreamedVibe("");
    setError(null);
  };

  const streamVibeAnalysis = async (
    pageUrl: string,
    heroText: string | null,
    title: string | null
  ) => {
    if (!heroText) return;

    setVibeStreaming(true);
    try {
      const response = await fetch("/api/scrape/vibe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          heroText,
          pageTitle: title,
        }),
      });

      if (!response.body) return;

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let text = "";

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value, { stream: true });
        text += chunkValue;
        setStreamedVibe(text);
      }
    } catch (error) {
      console.error("Vibe stream error:", error);
    } finally {
      setVibeStreaming(false);
    }
  };

  return (
    <>
      <HeroSection result={!!result} />

      <InputForm
        url={url}
        setUrl={setUrl}
        loading={loading}
        handleScrape={handleScrape}
        hasResult={!!result}
      />

      {!result && !loading && (
        <ScanHistory onSelectScan={handleSelectFromHistory} />
      )}

      {error && (
        <div className="max-w-3xl mx-auto mb-8 animate-in fade-in slide-in-from-top-4">
          <div className="bg-destructive/5 border border-destructive/20 rounded-2xl p-4 flex items-center gap-3 text-destructive">
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{error}</span>
          </div>
        </div>
      )}

      {loading && (
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 animate-pulse">
          <div className="md:col-span-2 md:row-span-2 h-[400px] rounded-3xl bg-muted/50" />
          <div className="md:col-span-2 h-[190px] rounded-3xl bg-muted/50" />
          <div className="md:col-span-1 h-[190px] rounded-3xl bg-muted/50" />
          <div className="md:col-span-1 h-[190px] rounded-3xl bg-muted/50" />
          <div className="md:col-span-4 h-[100px] rounded-3xl bg-muted/50" />
        </div>
      )}

      {result && !loading && (
        <ResultsGrid
          result={result}
          vibeStreaming={vibeStreaming}
          streamedVibe={streamedVibe}
        />
      )}
    </>
  );
}
