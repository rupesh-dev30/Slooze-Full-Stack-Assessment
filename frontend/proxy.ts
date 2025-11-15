import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_ROUTES = ["/dashboard", "/orders", "/checkout"];
const AUTH_ROUTES = ["/sign-in", "/sign-up"];

export async function proxy(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/restaurant")) {
    return NextResponse.next();
  }

  if (token && AUTH_ROUTES.some((path) => pathname.startsWith(path))) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (!token && PROTECTED_ROUTES.some((path) => pathname.startsWith(path))) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/sign-in",
    "/sign-up",
    "/dashboard/:path*",
    "/orders/:path*",
    "/checkout/:path*",
  ],
};
