import type { LogoInfo } from "./types";

export async function extractLogoFromPage(
  page: import("puppeteer").Page,
  baseUrl: string
): Promise<LogoInfo | null> {
  const logoData = await page.evaluate(() => {
    const isLogoElement = (element: Element): boolean => {
      const classNames = element.className?.toString().toLowerCase() || "";
      const id = element.id?.toLowerCase() || "";
      const ariaLabel = element.getAttribute("aria-label")?.toLowerCase() || "";

      if (element.tagName === "IMG") {
        const alt = (element as HTMLImageElement).alt?.toLowerCase() || "";
        const src = (element as HTMLImageElement).src?.toLowerCase() || "";
        return (
          classNames.includes("logo") ||
          id.includes("logo") ||
          alt.includes("logo") ||
          src.includes("logo") ||
          ariaLabel.includes("logo")
        );
      }

      return (
        classNames.includes("logo") ||
        id.includes("logo") ||
        ariaLabel.includes("logo")
      );
    };

    const getImageType = (
      url: string
    ): "svg" | "png" | "jpg" | "webp" | "unknown" => {
      const lower = url.toLowerCase();
      if (lower.includes(".svg") || lower.startsWith("data:image/svg"))
        return "svg";
      if (lower.includes(".png") || lower.startsWith("data:image/png"))
        return "png";
      if (
        lower.includes(".jpg") ||
        lower.includes(".jpeg") ||
        lower.startsWith("data:image/jpeg")
      )
        return "jpg";
      if (lower.includes(".webp") || lower.startsWith("data:image/webp"))
        return "webp";
      return "unknown";
    };

    const svgLogos = document.querySelectorAll("svg");
    for (const svg of svgLogos) {
      if (isLogoElement(svg) || isLogoElement(svg.parentElement!)) {
        const svgContent = svg.outerHTML;
        const dataUrl = "data:image/svg+xml," + encodeURIComponent(svgContent);
        return {
          url: dataUrl,
          type: "svg" as const,
          alt: svg.getAttribute("aria-label") || "Logo",
          width: svg.getBoundingClientRect().width,
          height: svg.getBoundingClientRect().height,
        };
      }
    }

    const imgLogos = document.querySelectorAll("img");
    for (const img of imgLogos) {
      if (isLogoElement(img)) {
        return {
          url: img.src,
          type: getImageType(img.src),
          alt: img.alt || "Logo",
          width: img.naturalWidth || img.width,
          height: img.naturalHeight || img.height,
        };
      }
    }

    const headerNav = document.querySelectorAll('header, nav, [role="banner"]');
    for (const container of headerNav) {
      const svg = container.querySelector("svg");
      if (svg) {
        const svgContent = svg.outerHTML;
        const dataUrl = "data:image/svg+xml," + encodeURIComponent(svgContent);
        return {
          url: dataUrl,
          type: "svg" as const,
          alt: svg.getAttribute("aria-label") || "Logo",
          width: svg.getBoundingClientRect().width,
          height: svg.getBoundingClientRect().height,
        };
      }
    }

    for (const container of headerNav) {
      const img = container.querySelector("img");
      if (img && img.src) {
        return {
          url: img.src,
          type: getImageType(img.src),
          alt: img.alt || "Logo",
          width: img.naturalWidth || img.width,
          height: img.naturalHeight || img.height,
        };
      }
    }

    return null;
  });

  if (!logoData) return null;

  if (
    logoData.url &&
    !logoData.url.startsWith("data:") &&
    !logoData.url.startsWith("http")
  ) {
    try {
      logoData.url = new URL(logoData.url, baseUrl).href;
    } catch {}
  }

  return logoData as LogoInfo;
}
