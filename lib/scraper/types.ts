/**
 * Design System Scraper Types
 */

export interface ColorInfo {
  hex: string;
  rgb: string;
  role: "primary" | "secondary" | "background" | "accent" | "text" | "other";
  source: string; // Element type or selector where found
  count: number; // How many times this color appears
}

export interface FontInfo {
  family: string;
  weight: string;
  size: string;
  role: "heading" | "body" | "other";
  source: string;
}

export interface LogoInfo {
  url: string;
  type: "svg" | "png" | "jpg" | "webp" | "unknown";
  alt?: string;
  width?: number;
  height?: number;
}

export interface VibeAnalysis {
  tone: string;
  audience: string;
  vibe: string;
  summary?: string;
}

export interface DesignSystemResult {
  colors: {
    primary: string | null;
    secondary: string | null;
    background: string | null;
    accent: string | null;
    all: ColorInfo[];
  };
  typography: {
    headingFont: string | null;
    bodyFont: string | null;
    fonts: FontInfo[];
  };
  logo: LogoInfo | null;
  vibe: VibeAnalysis | null;
  heroText: string | null;
  meta: {
    url: string;
    title: string | null;
    scrapedAt: string;
    duration: number; // ms
  };
}

export interface ScrapeRequest {
  url: string;
}

export interface ScrapeResponse {
  success: boolean;
  data?: DesignSystemResult;
  error?: string;
}
