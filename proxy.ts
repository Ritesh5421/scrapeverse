import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const session = request.cookies.get("session")?.value;
  const { pathname } = request.nextUrl;

  const isApiRoute = pathname.startsWith("/api/");
  const isAuthRoute =
    pathname.startsWith("/api/auth/signup") ||
    pathname.startsWith("/api/auth/signin") ||
    pathname.startsWith("/api/auth/signout") ||
    pathname.startsWith("/api/auth/session");

  if (isApiRoute && !isAuthRoute && !session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/user/:path*"],
};
