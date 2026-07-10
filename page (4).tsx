import { prisma } from "@/lib/prisma";
import { computeUsage } from "@/lib/plans";
import { makeRef } from "@/lib/utils";
import type { DocumentContent } from "@/types";
import type { User } from "@prisma/client";

export class LimitReachedError extends Error {
  constructor() {
    super("Free document limit reached. Upgrade to create more.");
    this.name = "LimitReachedError";
  }
}

export interface CreateDocumentInput {
  title: string;
  eventName: string;
  venue: string;
  client: string;
  siteDates: string;
  preparedBy: string;
  company: string;
  content: DocumentContent;
}

export async function listDocuments(userId: string) {
  return prisma.document.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getDocument(userId: string, id: string) {
  return prisma.document.findFirst({ where: { id, userId } });
}

export async function deleteDocument(userId: string, id: string) {
  // Scope the delete to the owner so users can't remove others' docs.
  return prisma.document.deleteMany({ where: { id, userId } });
}

/**
 * Create a document, enforcing the plan limit. Free users are capped at 3;
 * active subscribers are uncapped. Retries the human-facing ref on the rare
 * unique-collision.
 */
export async function createDocument(user: User, input: CreateDocumentInput) {
  const count = await prisma.document.count({ where: { userId: user.id } });
  const usage = computeUsage(user, count);
  if (usage.atLimit) throw new LimitReachedError();

  const total = await prisma.document.count();
  for (let attempt = 0; attempt < 5; attempt++) {
    const ref = makeRef(total + 1 + attempt);
    try {
      return await prisma.document.create({
        data: {
          ref,
          userId: user.id,
          title: input.title,
          eventName: input.eventName,
          venue: input.venue,
          client: input.client,
          siteDates: input.siteDates,
          preparedBy: input.preparedBy,
          company: input.company,
          hazards: input.content.hazards as unknown as object,
          methodSteps: input.content.methodSteps as unknown as object,
        },
      });
    } catch (e: unknown) {
      const code = (e as { code?: string })?.code;
      if (code === "P2002") continue; // ref collision — try the next number
      throw e;
    }
  }
  throw new Error("Could not allocate a unique document reference.");
}
