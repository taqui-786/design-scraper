import type { ColorInfo } from "./types";

export async function extractColorsFromPage(
  page: import("playwright-core").Page
): Promise<ColorInfo[]> {
  const colors = await page.evaluate(() => {
    const colorMap = new Map<
      string,
      { count: number; sources: string[]; role: string }
    >();

    const rgbToHex = (rgb: string): string | null => {
      const match = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
      if (!match) return null;
      const [, r, g, b] = match;
      return (
        "#" +
        [r, g, b].map((x) => parseInt(x).toString(16).padStart(2, "0")).join("")
      );
    };

    const isNeutral = (hex: string): boolean => {
      if (!hex) return true;
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);

      const avg = (r + g + b) / 3;
      const variance =
        Math.abs(r - avg) + Math.abs(g - avg) + Math.abs(b - avg);

      if (variance < 15 && (avg > 240 || avg < 15)) return true;

      return false;
    };

    const getRole = (element: Element, property: string): string => {
      const tagName = element.tagName.toLowerCase();
      const classes = element.className?.toString().toLowerCase() || "";
      const role = element.getAttribute("role")?.toLowerCase() || "";

      if (
        tagName === "button" ||
        role === "button" ||
        classes.includes("btn") ||
        classes.includes("button") ||
        classes.includes("cta") ||
        classes.includes("primary")
      ) {
        return "primary";
      }

      if (
        tagName === "body" ||
        tagName === "main" ||
        tagName === "section" ||
        tagName === "header" ||
        classes.includes("container") ||
        classes.includes("wrapper") ||
        classes.includes("hero") ||
        property === "background-color"
      ) {
        if (property === "background-color") return "background";
      }

      if (
        tagName === "a" ||
        classes.includes("link") ||
        classes.includes("accent") ||
        classes.includes("secondary")
      ) {
        return "secondary";
      }

      if (property === "color") {
        return "text";
      }

      return "other";
    };

    const allElements = document.querySelectorAll("*");

    allElements.forEach((element) => {
      const styles = window.getComputedStyle(element);
      const rect = element.getBoundingClientRect();

      if (rect.width === 0 || rect.height === 0) return;
      if (styles.display === "none" || styles.visibility === "hidden") return;

      const bgColor = styles.backgroundColor;
      if (
        bgColor &&
        bgColor !== "rgba(0, 0, 0, 0)" &&
        bgColor !== "transparent"
      ) {
        const hex = rgbToHex(bgColor);
        if (hex && !isNeutral(hex)) {
          const existing = colorMap.get(hex) || {
            count: 0,
            sources: [],
            role: "other",
          };
          const role = getRole(element, "background-color");
          existing.count++;
          existing.sources.push(element.tagName.toLowerCase());

          if (role === "primary" && existing.role !== "primary") {
            existing.role = "primary";
          } else if (role === "background" && existing.role === "other") {
            existing.role = "background";
          }
          colorMap.set(hex, existing);
        }
      }

      const textColor = styles.color;
      if (textColor && textColor !== "rgba(0, 0, 0, 0)") {
        const hex = rgbToHex(textColor);
        if (hex && !isNeutral(hex)) {
          const existing = colorMap.get(hex) || {
            count: 0,
            sources: [],
            role: "other",
          };
          const role = getRole(element, "color");
          existing.count++;
          existing.sources.push(element.tagName.toLowerCase());
          if (role === "primary" && existing.role !== "primary") {
            existing.role = "primary";
          } else if (role === "secondary" && existing.role === "other") {
            existing.role = "secondary";
          }
          colorMap.set(hex, existing);
        }
      }

      const borderColor = styles.borderColor;
      if (borderColor && borderColor !== "rgba(0, 0, 0, 0)") {
        const hex = rgbToHex(borderColor);
        if (hex && !isNeutral(hex)) {
          const existing = colorMap.get(hex) || {
            count: 0,
            sources: [],
            role: "other",
          };
          existing.count++;
          existing.sources.push(element.tagName.toLowerCase() + "-border");
          if (existing.role === "other") {
            existing.role = "accent";
          }
          colorMap.set(hex, existing);
        }
      }
    });

    return Array.from(colorMap.entries()).map(([hex, data]) => ({
      hex,
      rgb: "", // Will be filled below
      role: data.role,
      source: data.sources.slice(0, 3).join(", "),
      count: data.count,
    }));
  });

  return colors.map((c) => ({
    ...c,
    rgb: hexToRgb(c.hex),
    role: c.role as ColorInfo["role"],
  }));
}

export function classifyColors(colors: ColorInfo[]): {
  primary: string | null;
  secondary: string | null;
  background: string | null;
  accent: string | null;
  all: ColorInfo[];
} {
  const sorted = [...colors].sort((a, b) => b.count - a.count);

  const primary = sorted.find((c) => c.role === "primary")?.hex || null;

  const secondary =
    sorted.find((c) => c.role === "secondary" && c.hex !== primary)?.hex ||
    null;

  const background =
    sorted.find(
      (c) => c.role === "background" && c.hex !== primary && c.hex !== secondary
    )?.hex || null;

  const accent =
    sorted.find(
      (c) => c.role === "accent" && c.hex !== primary && c.hex !== secondary
    )?.hex || null;

  return {
    primary,
    secondary,
    background,
    accent,
    all: sorted,
  };
}

function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgb(${r}, ${g}, ${b})`;
}
