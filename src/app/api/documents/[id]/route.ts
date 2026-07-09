import { NextResponse } from "next/server";
import { requireUser, UnauthorizedError } from "@/server/user";
import { deleteDocument } from "@/server/documents";

export const runtime = "nodejs";

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireUser();
    await deleteDocument(user.id, params.id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    if (e instanceof UnauthorizedError)
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    throw e;
  }
}
