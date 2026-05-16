import { NextResponse, type NextRequest } from "next/server";

function getCanonicalHost() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (!siteUrl) {
    return null;
  }

  try {
    return new URL(siteUrl).host.replace(/^www\./, "");
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const canonicalHost = getCanonicalHost();

  if (!canonicalHost || canonicalHost.startsWith("localhost")) {
    return NextResponse.next();
  }

  const requestedHost =
    request.headers.get("x-forwarded-host") ||
    request.headers.get("host") ||
    request.nextUrl.host;
  const wwwHost = `www.${canonicalHost}`;

  if (requestedHost !== wwwHost) {
    return NextResponse.next();
  }

  const redirectUrl = request.nextUrl.clone();
  const protocol =
    request.headers.get("x-forwarded-proto") ||
    redirectUrl.protocol.replace(":", "") ||
    "https";

  redirectUrl.protocol = `${protocol}:`;
  redirectUrl.host = canonicalHost;

  return NextResponse.redirect(redirectUrl, 308);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};
