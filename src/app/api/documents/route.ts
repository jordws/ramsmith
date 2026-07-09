import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser, UnauthorizedError } from "@/server/user";
import {
  createDocument,
  listDocuments,
  LimitReachedError,
} from "@/server/documents";

export const runtime = "nodejs";

const hazardSchema = z.object({
  id: z.string(),
  category: z.string(),
  hazard: z.string(),
  whoAtRisk: z.string(),
  controls: z.array(z.string()),
  likelihood: z.number().min(1).max(5),
  severity: z.number().min(1).max(5),
  residualLikelihood: z.number().min(1).max(5),
  residualSeverity: z.number().min(1).max(5),
});

const schema = z.object({
  title: z.string().min(1).max(160),
  eventName: z.string().min(1).max(160),
  venue: z.string().min(1).max(160),
  client: z.string().max(160),
  siteDates: z.string().max(240),
  preparedBy: z.string().min(1).max(120),
  company: z.string().min(1).max(160),
  content: z.object({
    hazards: z.array(hazardSchema).min(1, "Add at least one hazard"),
    loadPlan: z.object({
      vehicle: z.string(),
      payloadCapacityKg: z.number().min(0),
      items: z.array(
        z.object({
          id: z.string(),
          description: z.string(),
          quantity: z.number().min(0),
          weightKg: z.number().min(0),
        })
      ),
      notes: z.string().max(500),
    }),
    methodSteps: z.array(z.string()).min(1, "Add at least one method step"),
  }),
});

export async function GET() {
  try {
    const user = await requireUser();
    const docs = await listDocuments(user.id);
    return NextResponse.json({ documents: docs });
  } catch (e) {
    if (e instanceof UnauthorizedError)
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    throw e;
  }
}

export async function POST(req: Request) {
  try {
    const user = await requireUser();
    const body = await req.json().catch(() => null);
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid document" },
        { status: 400 }
      );
    }
    const doc = await createDocument(user, parsed.data);
    return NextResponse.json({ document: doc }, { status: 201 });
  } catch (e) {
    if (e instanceof UnauthorizedError)
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    if (e instanceof LimitReachedError)
      return NextResponse.json({ error: e.message, code: "LIMIT" }, { status: 402 });
    throw e;
  }
}
