import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { DesignSystemResult } from "@/lib/scraper/types";

interface PaletteCardProps {
  colors: DesignSystemResult["colors"];
}

export function PaletteCard({ colors }: PaletteCardProps) {
  const [showAllColors, setShowAllColors] = useState(false);

  return (
    <div className="md:col-span-4 bg-card border border-border/50 rounded-3xl p-6">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
          Complete Palette ({colors.all.length} colors)
        </span>
        {colors.all.length > 14 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAllColors(!showAllColors)}
            className="h-7 text-xs gap-1"
          >
            {showAllColors ? (
              <>
                <ChevronUp className="w-3 h-3" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="w-3 h-3" />
                Show All +{colors.all.length - 14}
              </>
            )}
          </Button>
        )}
      </div>
      <div className="flex flex-wrap gap-3 pb-2">
        {(showAllColors ? colors.all : colors.all.slice(0, 14)).map(
          (color, i) => (
            <div
              key={i}
              className="group/swatch relative cursor-pointer"
              onClick={() => {
                navigator.clipboard.writeText(color.hex);
              }}
            >
              <div
                className="w-12 h-12 rounded-xl border border-border/20 shadow-sm transition-transform hover:scale-110 hover:z-10 hover:shadow-md"
                style={{ backgroundColor: color.hex }}
              />
              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-mono opacity-0 group-hover/swatch:opacity-100 transition-opacity bg-background px-1.5 py-0.5 rounded-md shadow-md border border-border pointer-events-none z-20 whitespace-nowrap">
                {color.hex}
              </span>
            </div>
          )
        )}
      </div>
    </div>
  );
}
