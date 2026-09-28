import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const GUEST_COOKIE = "wg_session";
const ADMIN_COOKIE = "wa_session";

function getSecret(): Uint8Array {
  return new TextEncoder().encode(process.env.SESSION_SECRET ?? "");
}

async function isValid(token: string | undefined, expectedKind: "guest" | "admin"): Promise<boolean> {
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload.kind === expectedKind;
  } catch {
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/portal")) {
    const token = req.cookies.get(GUEST_COOKIE)?.value;
    if (!(await isValid(token, "guest"))) {
      const url = req.nextUrl.clone();
      url.pathname = "/rsvp";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
  }

  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const token = req.cookies.get(ADMIN_COOKIE)?.value;
    if (!(await isValid(token, "admin"))) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/portal/:path*", "/admin/:path*"],
};
