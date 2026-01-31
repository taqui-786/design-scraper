import type { DesignSystemResult } from "./scraper/types";

const STORAGE_KEY = "design-scraper-history";
const MAX_HISTORY_ITEMS = 20;

export interface HistoryItem {
  id: string;
  url: string;
  title: string | null;
  scrapedAt: string;
  result: DesignSystemResult;
}

/**
 * Get all history items from localStorage
 */
export function getHistory(): HistoryItem[] {
  if (typeof window === "undefined") return [];

  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

/**
 * Save a scrape result to history
 */
export function saveToHistory(result: DesignSystemResult): HistoryItem {
  const history = getHistory();

  const newItem: HistoryItem = {
    id: crypto.randomUUID(),
    url: result.meta.url,
    title: result.meta.title,
    scrapedAt: result.meta.scrapedAt,
    result,
  };

  // Add to beginning, remove duplicates by URL
  const filtered = history.filter((item) => item.url !== result.meta.url);
  const updated = [newItem, ...filtered].slice(0, MAX_HISTORY_ITEMS);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return newItem;
}

/**
 * Remove an item from history
 */
export function removeFromHistory(id: string): void {
  const history = getHistory();
  const updated = history.filter((item) => item.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

/**
 * Clear all history
 */
export function clearHistory(): void {
  localStorage.removeItem(STORAGE_KEY);
}
