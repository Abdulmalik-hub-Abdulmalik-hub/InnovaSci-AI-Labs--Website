import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions, isAuthorized } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.role || !isAuthorized(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const grants = await prisma.grant.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(grants);
  } catch (error) {
    console.error("Error fetching grants:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}