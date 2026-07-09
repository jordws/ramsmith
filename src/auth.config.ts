import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe auth config (no Prisma/bcrypt at module scope) so it can be
 * imported by middleware. The Credentials provider with the DB lookup is
 * added in auth.ts, which only runs on the Node runtime.
 */
const PROTECTED_PREFIXES = [
  "/dashboard",
  "/documents",
  "/billing",
  "/settings",
];

export const authConfig = {
  pages: { signIn: "/login" },
  session: { strategy: "jwt" },
  trustHost: true,
  providers: [],
  callbacks: {
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = request.nextUrl;
      const isProtected = PROTECTED_PREFIXES.some((p) =>
        pathname.startsWith(p)
      );
      if (isProtected && !isLoggedIn) return false; // -> redirected to /login
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
      }
      return token;
    },
    session({ session, token }) {
      if (token.id && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
