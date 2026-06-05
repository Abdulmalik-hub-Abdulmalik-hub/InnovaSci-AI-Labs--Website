import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions, isAuthorized } from "@/lib/auth";
import { db } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.role || !isAuthorized(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const errors = await db.systemError.findMany({
      orderBy: { occurredAt: "desc" },
      take: 50,
    });

    return NextResponse.json(errors);
  } catch (error) {
    console.error("Error fetching errors:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}