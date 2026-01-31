import { ImageOff } from "lucide-react";
import type { LogoInfo } from "@/lib/scraper/types";

interface LogoCardProps {
  logo: LogoInfo | null;
}

export function LogoCard({ logo }: LogoCardProps) {
  const isDataUri = logo?.url?.startsWith("data:");

  return (
    <div className="md:col-span-1 bg-card hover:bg-card/90 transition-colors border border-border/50 rounded-3xl p-6 flex flex-col items-center justify-center relative min-h-[180px]">
      <span className="absolute top-6 left-6 text-xs text-muted-foreground uppercase tracking-wider font-semibold">
        Logo
      </span>

      {logo && logo.url ? (
        <div className="w-full h-full flex items-center justify-center p-4 mt-4">
          {isDataUri && logo.type === "svg" ? (
            <div
              className="max-w-full max-h-[80px] transition-all hover:scale-110 duration-300 [&>svg]:max-w-full [&>svg]:max-h-[80px] [&>svg]:w-auto [&>svg]:h-auto"
              dangerouslySetInnerHTML={{
                __html: decodeURIComponent(
                  logo.url.replace("data:image/svg+xml,", "")
                ),
              }}
            />
          ) : (
            <img
              src={logo.url}
              alt={logo.alt || "Logo"}
              referrerPolicy="no-referrer"
              className="max-w-full max-h-[80px] w-auto h-auto object-contain transition-all hover:scale-110 duration-300"
              onError={(e) => {
                const parent = e.currentTarget.parentElement;
                if (parent) {
                  parent.innerHTML =
                    '<div class="flex flex-col items-center gap-2 text-muted-foreground/40"><svg class="w-10 h-10" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="2" x2="22" y1="2" y2="22"></line><path d="M10.41 10.41a2 2 0 1 1-2.83-2.83"></path><line x1="13.5" x2="6" y1="13.5" y2="21"></line><line x1="18" x2="21" y1="12" y2="15"></line><path d="M3.59 3.59A1.99 1.99 0 0 0 3 5v14a2 2 0 0 0 2 2h14c.55 0 1.052-.22 1.41-.59"></path><path d="M21 15V5a2 2 0 0 0-2-2H9"></path></svg><span class="text-xs">Failed to load</span></div>';
                }
              }}
            />
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 text-muted-foreground/40">
          <ImageOff className="w-10 h-10" />
          <span className="text-xs">Not detected</span>
        </div>
      )}
    </div>
  );
}
