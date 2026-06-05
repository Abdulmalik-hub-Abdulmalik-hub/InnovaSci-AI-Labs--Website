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

    const publications = await db.publication.findMany({
      include: { createdBy: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(publications);
  } catch (error) {
    console.error("Error fetching publications:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.role || !isAuthorized(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    
    const publication = await db.publication.create({
      data: {
        ...body,
        createdById: session.user.id,
      },
    });

    return NextResponse.json(publication, { status: 201 });
  } catch (error) {
    console.error("Error creating publication:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}