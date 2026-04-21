import { NextResponse } from "next/server";
import { MAINTENANCE_MODE } from "./maintenance.config.js";

export function middleware(request) {
  const { pathname } = request.nextUrl;

  if (
    MAINTENANCE_MODE &&
    !pathname.startsWith("/maintenance") &&
    !pathname.startsWith("/api") &&
    !pathname.startsWith("/favicon") &&
    !pathname.startsWith("/images")
  ) {
    return NextResponse.rewrite(new URL("/maintenance", request.url));
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
