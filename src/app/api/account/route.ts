import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser, UnauthorizedError } from "@/server/user";

export const runtime = "nodejs";

const schema = z.object({
  name: z.string().min(1, "Enter your name").max(120),
  company: z.string().max(160).optional().or(z.literal("")),
});

export async function PATCH(req: Request) {
  try {
    const user = await requireUser();
    const body = await req.json().catch(() => null);
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid details" },
        { status: 400 }
      );
    }
    await prisma.user.update({
      where: { id: user.id },
      data: {
        name: parsed.data.name,
        company: parsed.data.company || null,
      },
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    if (e instanceof UnauthorizedError)
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    throw e;
  }
}
