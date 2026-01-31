import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

interface InputFormProps {
  url: string;
  setUrl: (url: string) => void;
  loading: boolean;
  handleScrape: () => void;
  hasResult: boolean;
}

export function InputForm({
  url,
  setUrl,
  loading,
  handleScrape,
  hasResult,
}: InputFormProps) {
  return (
    <div
      className={`max-w-2xl mx-auto transition-all duration-500 ${
        hasResult
          ? "absolute left-0 right-0 mx-auto w-full z-40 bg-background/90 backdrop-blur-xl p-4 rounded-2xl border border-border/50 shadow-lg mb-8"
          : "mb-20"
      }`}
    >
      <div className="relative group max-w-xl mx-auto">
        <div className="absolute inset-0 bg-linear-to-r from-primary/20 via-primary/10 to-primary/5 blur-xl rounded-full opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-700" />
        <div className="relative flex items-center bg-background border border-border/40 shadow-sm hover:shadow-md transition-all duration-300 rounded-full focus-within:ring-4 focus-within:ring-primary/10 focus-within:border-primary/40 h-14 overflow-hidden">
          <div className="pl-5 text-muted-foreground/60">
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
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <Input
            type="url"
            placeholder="Paste website URL (e.g. linear.app)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleScrape()}
            className="flex-1 border-0 bg-transparent h-full text-base px-4 shadow-none focus-visible:ring-0 placeholder:text-muted-foreground/40 font-medium tracking-wide"
            disabled={loading}
          />
          <div className="pr-1.5 py-1.5 h-full">
            <Button
              onClick={handleScrape}
              disabled={loading || !url.trim()}
              size="sm"
              className={`h-full rounded-full font-semibold shadow-sm transition-all duration-300 ${
                loading
                  ? "w-32 bg-primary/10 text-primary hover:bg-primary/20"
                  : "w-24 bg-[#333]  text-white hover:bg-primary/90 hover:scale-105 active:scale-95"
              }`}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-xs">Scanning...</span>
                </div>
              ) : (
                "Analyze"
              )}
            </Button>
          </div>
        </div>
      </div>

      {!hasResult && !loading && (
        <div className="mt-8 flex flex-wrap justify-center items-center gap-3">
          <span className="text-sm text-primary">Try it:</span>
          {[
            "https://adopt.ai",
            "https://linear.app",
            "https://vercel.com",
            "https://stripe.com",
          ].map((link) => (
            <span
              key={link}
              className="p-0.5 border rounded-[10px] border-dashed border-border"
            >
              <button
                onClick={() => {
                  setUrl(link);
                  setTimeout(handleScrape, 100);
                }}
                className="text-sm px-2 py-1 rounded-[8px] bg-muted/50 hover:bg-muted transition-colors text-foreground/80 cursor-pointer"
              >
                {link.replace("https://", "")}
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
