const PROD_URL = "https://renovo-gilt.vercel.app";

export function getBaseUrl() {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  return PROD_URL;
}

export function buildAuthUrl(path: string) {
  return `${PROD_URL}${path}`;
}