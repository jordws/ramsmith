import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

// Middleware only needs the edge-safe config to check the session cookie.
export const { auth: middleware } = NextAuth(authConfig);

export const config = {
  // Run on everything except static assets and the Next internals.
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
