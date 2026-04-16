// middleware.ts
import { NextResponse } from "next/server";

export function middleware() {
  const response = NextResponse.next();

  // Add cache status header for verification (Bonus B-1)
  response.headers.set("x-cache-status", "MISS"); // Will be overwritten by CF

  return response;
}

export const config = {
  matcher: "/:path*",
};
