import type { FontInfo } from "./types";

export async function extractTypographyFromPage(
  page: import("playwright-core").Page
): Promise<FontInfo[]> {
  const fonts = await page.evaluate(() => {
    const fontMap = new Map<
      string,
      { weight: string; size: string; role: string; sources: string[] }
    >();

    const cleanFontFamily = (fontFamily: string): string => {
      const first = fontFamily.split(",")[0].trim();
      return first.replace(/["']/g, "");
    };

    const getRole = (element: Element): "heading" | "body" | "other" => {
      const tagName = element.tagName.toLowerCase();

      if (["h1", "h2", "h3", "h4", "h5", "h6"].includes(tagName)) {
        return "heading";
      }

      if (["p", "span", "li", "td", "th", "label", "a"].includes(tagName)) {
        return "body";
      }

      const hasDirectText = Array.from(element.childNodes).some(
        (node) => node.nodeType === Node.TEXT_NODE && node.textContent?.trim()
      );

      if (hasDirectText) {
        return "body";
      }

      return "other";
    };

    const allElements = document.querySelectorAll(
      "h1, h2, h3, h4, h5, h6, p, span, a, li, td, th, label, div, button"
    );

    allElements.forEach((element) => {
      const styles = window.getComputedStyle(element);
      const rect = element.getBoundingClientRect();

      if (rect.width === 0 || rect.height === 0) return;
      if (styles.display === "none" || styles.visibility === "hidden") return;

      const hasText = element.textContent?.trim();
      if (!hasText) return;

      const fontFamily = cleanFontFamily(styles.fontFamily);
      const fontWeight = styles.fontWeight;
      const fontSize = styles.fontSize;
      const role = getRole(element);

      if (!fontFamily || fontFamily === "inherit" || fontFamily === "initial")
        return;

      const key = `${fontFamily}|${role}`;
      const existing = fontMap.get(key) || {
        weight: fontWeight,
        size: fontSize,
        role,
        sources: [],
      };
      existing.sources.push(element.tagName.toLowerCase());
      fontMap.set(key, existing);
    });

    return Array.from(fontMap.entries()).map(([key, data]) => {
      const [family] = key.split("|");
      return {
        family,
        weight: data.weight,
        size: data.size,
        role: data.role as "heading" | "body" | "other",
        source: data.sources.slice(0, 5).join(", "),
      };
    });
  });

  return fonts;
}

export function classifyTypography(fonts: FontInfo[]): {
  headingFont: string | null;
  bodyFont: string | null;
  fonts: FontInfo[];
} {
  const headingFont = fonts.find((f) => f.role === "heading")?.family || null;

  const bodyFont =
    fonts.find((f) => f.role === "body" && f.family !== headingFont)?.family ||
    fonts.find((f) => f.role === "body")?.family ||
    null;

  return {
    headingFont,
    bodyFont,
    fonts,
  };
}
