import type { DesignSystemResult } from "@/lib/scraper/types";

interface TypographyCardProps {
  typography: DesignSystemResult["typography"];
}

export function TypographyCard({ typography }: TypographyCardProps) {
  return (
    <div className="md:col-span-1 bg-card/50 hover:bg-card/80 transition-colors backdrop-blur-sm border border-border/50 rounded-3xl p-6 flex flex-col justify-between group">
      <div>
        <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
          Typeface
        </span>
        <div className="mt-4 space-y-4">
          <div>
            <p className="text-4xl font-medium tracking-tight group-hover:text-primary transition-colors truncate">
              Aa
            </p>
            <p
              className="text-sm font-medium mt-1 truncate max-w-[120px]"
              title={typography.headingFont || ""}
            >
              {typography.headingFont?.split(",")[0].replace(/['"]/g, "") ||
                "System"}
            </p>
            <span className="text-[10px] text-muted-foreground uppercase">
              Heading
            </span>
          </div>

          <div className="pt-4 border-t border-border/30">
            <p
              className="text-sm truncate max-w-[120px]"
              title={typography.bodyFont || ""}
            >
              {typography.bodyFont?.split(",")[0].replace(/['"]/g, "") ||
                "System"}
            </p>
            <span className="text-[10px] text-muted-foreground uppercase">
              Body
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
