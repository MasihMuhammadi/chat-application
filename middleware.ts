import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
export function middleware(request: NextRequest) {
  const token = request.cookies.get("userId")?.value;
  let url = request.nextUrl.pathname;
  const decodedUrl: any = token ? jwt.decode(token) : null;
  if (!token && url.includes("dashboard")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (token && (url === "/login" || url === "/")) {
    return NextResponse.redirect(
      new URL(`/dashboard/${decodedUrl?.id}`, request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/dashboard/:path*"],
};
