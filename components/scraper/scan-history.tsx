"use client";

import { useState, useEffect } from "react";
import { Trash2, Clock, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getHistory, removeFromHistory, type HistoryItem } from "@/lib/history";
import type { DesignSystemResult } from "@/lib/scraper/types";

interface ScanHistoryProps {
  onSelectScan: (result: DesignSystemResult) => void;
}

export function ScanHistory({ onSelectScan }: ScanHistoryProps) {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setHistory(getHistory());
  }, []);

  const handleRemove = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    removeFromHistory(id);
    setHistory(getHistory());
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  if (!mounted || history.length === 0) {
    return null;
  }

  return (
    <div className="mt-12 max-w-2xl mx-auto">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm font-medium text-muted-foreground">
          Recent Scans
        </span>
      </div>

      <div className="space-y-2">
        {history.slice(0, 5).map((item) => (
          <div
            key={item.id}
            onClick={() => onSelectScan(item.result)}
            className="group flex items-center justify-between p-3 rounded-xl border border-border/50 bg-card/50 hover:bg-card hover:border-primary/30 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex -space-x-1">
                {item.result.colors.all.slice(0, 3).map((color, i) => (
                  <div
                    key={i}
                    className="w-4 h-4 rounded-full border-2 border-background"
                    style={{ backgroundColor: color.hex }}
                  />
                ))}
              </div>

              <div className="min-w-0">
                <p className="text-sm font-medium truncate max-w-[200px]">
                  {item.title || item.url}
                </p>
                <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                  {item.url.replace("https://", "").replace("www.", "")}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground hidden sm:block">
                {formatDate(item.scrapedAt)}
              </span>

              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                onClick={(e) => handleRemove(item.id, e)}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {history.length > 5 && (
        <p className="text-xs text-muted-foreground text-center mt-3">
          +{history.length - 5} more scans
        </p>
      )}
    </div>
  );
}
