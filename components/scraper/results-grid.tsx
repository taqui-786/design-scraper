import type { DesignSystemResult } from "@/lib/scraper/types";
import { VibeCard } from "./cards/vibe-card";
import { LogoCard } from "./cards/logo-card";
import { TypographyCard } from "./cards/typography-card";
import { PaletteCard } from "./cards/palette-card";
import { JsonViewer } from "./json-viewer";

interface ResultsGridProps {
  result: DesignSystemResult;
  vibeStreaming: boolean;
  streamedVibe: string;
}

export function ResultsGrid({
  result,
  vibeStreaming,
  streamedVibe,
}: ResultsGridProps) {
  return (
    <div className="max-w-5xl mt-64 mx-auto space-y-6 animate-in fade-in-50 slide-in-from-bottom-8 duration-700">
      <div className="flex items-baseline justify-between px-2">
        <h2 className="text-2xl font-bold tracking-tight">
          {result.meta.title || "Analysis Result"}
        </h2>
        <span className="font-mono text-xs text-muted-foreground">
          {(result.meta.duration / 1000).toFixed(2)}s
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 auto-rows-min">
        <VibeCard
          vibe={result.vibe}
          vibeStreaming={vibeStreaming}
          streamedVibe={streamedVibe}
        />

        <div className="md:col-span-2 bg-card/50 hover:bg-card/80 transition-colors backdrop-blur-sm border border-border/50 rounded-3xl p-6 flex flex-col justify-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-dot-pattern opacity-10" />

          <div className="flex items-center gap-6 relative z-10">
            <div className="relative group/color cursor-pointer">
              <div
                className="w-24 h-24 rounded-2xl shadow-sm border border-border/10 transition-transform group-hover/color:scale-110 group-hover/color:rotate-3 duration-300"
                style={{ backgroundColor: result.colors.primary || "#000" }}
              />
              <div className="absolute -bottom-2 -right-2 bg-background border border-border px-2 py-1 rounded-md text-[10px] uppercase font-bold shadow-sm opacity-0 group-hover/color:opacity-100 transition-opacity">
                Copy
              </div>
            </div>

            <div>
              <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                Primary Brand Color
              </span>
              <p className="text-4xl font-mono font-medium tracking-tighter mt-1">
                {result.colors.primary || "N/A"}
              </p>
              <div className="flex gap-2 mt-3">
                {result.colors.secondary && (
                  <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-background/50 border border-border/50">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: result.colors.secondary }}
                    />
                    <span className="text-xs font-mono text-muted-foreground">
                      {result.colors.secondary}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <TypographyCard typography={result.typography} />

        <LogoCard logo={result.logo} />

        <PaletteCard colors={result.colors} />
      </div>

      <JsonViewer result={result} />
    </div>
  );
}
