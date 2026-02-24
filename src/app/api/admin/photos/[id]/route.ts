import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { deletePhoto } from "@/lib/db";

interface Params {
  params: Promise<{ id: string }>;
}

export async function DELETE(_req: Request, { params }: Params) {
  const session = await getSession();
  if (!session.isLoggedIn) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await params;
  try {
    await deletePhoto(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("DELETE /api/admin/photos/[id] error:", err);
    return NextResponse.json({ error: "Database error." }, { status: 500 });
  }
}
