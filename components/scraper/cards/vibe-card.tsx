import type { DesignSystemResult } from "@/lib/scraper/types";

interface VibeCardProps {
  vibe: DesignSystemResult["vibe"];
  vibeStreaming: boolean;
  streamedVibe: string;
}

export function VibeCard({ vibe, vibeStreaming, streamedVibe }: VibeCardProps) {
  return (
    <div className="md:col-span-2 md:row-span-2 bg-card/50 hover:bg-card/80 transition-colors backdrop-blur-sm border border-border/50 rounded-3xl p-6 flex flex-col justify-between group overflow-hidden relative">
      <div className="absolute top-0 right-0 p-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-colors duration-500" />

      <div>
        <div className="flex items-center gap-2 mb-4">
          <span className="px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
            Vibe Check
          </span>
          {vibeStreaming && (
            <span className="animate-pulse w-2 h-2 rounded-full bg-green-500"></span>
          )}
        </div>

        {vibe ? (
          <div className="space-y-6 relative z-10">
            <div>
              <span className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">
                Tone
              </span>
              <p className="text-3xl font-extrabold tracking-tight text-foreground mt-1">
                {vibe.tone}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                  Audience
                </span>
                <p className="text-lg font-semibold mt-1">{vibe.audience}</p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                  Aesthetic
                </span>
                <p className="text-lg font-semibold mt-1">{vibe.vibe}</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-background/50 border border-border/50 backdrop-blur-md">
              <p className="text-sm leading-relaxed text-muted-foreground">
                {vibeStreaming ? streamedVibe : vibe.summary}
                {vibeStreaming && (
                  <span className="inline-block w-1.5 h-3 bg-primary animate-pulse ml-1 align-middle" />
                )}
              </p>
            </div>
          </div>
        ) : vibeStreaming ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
              <span className="text-sm text-muted-foreground">
                Analyzing brand personality...
              </span>
            </div>
            <div className="font-mono text-sm opacity-60 h-[100px] overflow-hidden mask-gradient-b">
              {streamedVibe}
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-60">
            <p>No vibe data available</p>
            <p className="text-xs">Add GROQ_API_KEY to .env</p>
          </div>
        )}
      </div>
    </div>
  );
}
