import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { computeUsage, type UsageState } from "@/lib/plans";
import type { User } from "@prisma/client";

/** Returns the full DB user for the current session, or null. */
export async function getCurrentUser(): Promise<User | null> {
  const session = await auth();
  if (!session?.user?.id) return null;
  return prisma.user.findUnique({ where: { id: session.user.id } });
}

/** Throws if unauthenticated — use inside API routes. */
export async function requireUser(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) throw new UnauthorizedError();
  return user;
}

export async function getUserWithUsage(): Promise<
  { user: User; usage: UsageState } | null
> {
  const user = await getCurrentUser();
  if (!user) return null;
  const documentCount = await prisma.document.count({
    where: { userId: user.id },
  });
  return { user, usage: computeUsage(user, documentCount) };
}

export class UnauthorizedError extends Error {
  constructor() {
    super("Not authenticated");
    this.name = "UnauthorizedError";
  }
}
