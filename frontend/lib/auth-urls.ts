const PROD_URL = "https://renovo-gilt.vercel.app";

export function getBaseUrl() {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  return process.env.NEXT_PUBLIC_SITE_URL || PROD_URL;
}

export function buildAuthUrl(path: string) {
  const base = getBaseUrl();

  try {
    return new URL(path, base).toString();
  } catch {
    return `${PROD_URL}${path}`;
  }
}

export function validateAuthUrl(url: string, context: string) {
  try {
    const parsed = new URL(url);

    if (!parsed.origin || !parsed.protocol.startsWith("http")) {
      throw new Error("Non-http origin");
    }

    return parsed.toString();
  } catch {
    throw new Error(`Invalid auth redirect URL for ${context}: ${url}`);
  }
}