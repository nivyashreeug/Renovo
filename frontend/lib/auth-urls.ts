export function getBaseUrl() {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (!siteUrl) {
    return "";
  }

  try {
    return new URL(siteUrl).origin;
  } catch {
    return "";
  }
}

export function buildAuthUrl(pathname: string) {
  const normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const baseUrl = getBaseUrl();

  if (!baseUrl) {
    return "";
  }

  return new URL(normalizedPath, baseUrl).toString();
}